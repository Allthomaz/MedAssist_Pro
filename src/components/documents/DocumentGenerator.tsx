import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Upload, 
  FileText, 
  Brain, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  X
} from 'lucide-react';
import { pdfjsLib } from '@/utils/pdfWorker';
import mammoth from 'mammoth';

interface GeneratedDocument {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  type: string;
}

interface DocumentGeneratorProps {
  onDocumentGenerated?: (document: GeneratedDocument) => void;
}

export const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({ 
  onDocumentGenerated 
}) => {
  const [transcription, setTranscription] = useState('');
  const [intention, setIntention] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<GeneratedDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Função para extrair texto de diferentes tipos de arquivo
  const extractTextFromFile = async (file: File): Promise<string> => {
    try {
      if (file.type === 'text/plain') {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = () => reject(new Error('Erro ao ler arquivo de texto'));
          reader.readAsText(file);
        });
      } 
      
      else if (file.type === 'application/pdf') {
        return new Promise(async (resolve, reject) => {
          try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let text = '';
            
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              const pageText = content.items
                .filter(item => 'str' in item)
                .map(item => (item as any).str)
                .join(' ');
              text += pageText + '\n';
            }
            
            if (!text.trim()) {
              reject(new Error('Não foi possível extrair texto do PDF'));
              return;
            }
            
            resolve(text);
          } catch (error) {
            reject(new Error('Erro ao processar PDF: ' + (error instanceof Error ? error.message : 'Erro desconhecido')));
          }
        });
      } 
      
      else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        return new Promise(async (resolve, reject) => {
          try {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            
            if (!result.value.trim()) {
              reject(new Error('Não foi possível extrair texto do documento DOCX'));
              return;
            }
            
            resolve(result.value);
          } catch (error) {
            reject(new Error('Erro ao processar DOCX: ' + (error instanceof Error ? error.message : 'Erro desconhecido')));
          }
        });
      } 
      
      else if (file.type === 'application/msword') {
        // DOC files are more complex, fallback to binary reading
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const result = e.target?.result as string;
              // Basic text extraction for DOC files (limited)
              const text = result.replace(/[^\x20-\x7E\s]/g, ' ').replace(/\s+/g, ' ').trim();
              if (!text) {
                reject(new Error('Não foi possível extrair texto do arquivo DOC. Tente converter para DOCX ou TXT.'));
                return;
              }
              resolve(text);
            } catch (error) {
              reject(new Error('Erro ao processar arquivo DOC'));
            }
          };
          reader.onerror = () => reject(new Error('Erro ao ler arquivo DOC'));
          reader.readAsText(file, 'utf-8');
        });
      } 
      
      else {
        throw new Error('Tipo de arquivo não suportado. Use arquivos .txt, .pdf, .doc ou .docx');
      }
    } catch (error) {
      throw new Error('Erro ao processar arquivo: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  // Manipular upload de arquivo
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Verificar tipos de arquivo aceitos
    const acceptedTypes = [
      'text/plain',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!acceptedTypes.includes(file.type)) {
      toast({
        title: "Erro",
        description: "Tipo de arquivo não suportado. Use arquivos .txt, .pdf, .doc ou .docx",
        variant: "destructive"
      });
      return;
    }

    setIsProcessingFile(true);
    setUploadedFile(file);
    setError(null);

    try {
      const extractedText = await extractTextFromFile(file);
      setTranscription(extractedText);
      toast({
        title: "Sucesso",
        description: "Texto extraído do arquivo com sucesso!"
      });
    } catch (err) {
      setError(`Erro ao processar arquivo: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
      toast({
        title: "Erro",
        description: "Falha ao extrair texto do arquivo",
        variant: "destructive"
      });
    } finally {
      setIsProcessingFile(false);
    }
  };

  // Remover arquivo carregado
  const removeUploadedFile = () => {
    setUploadedFile(null);
    setTranscription('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Gerar documento via Supabase Edge Function
  const generateDocument = async () => {
    if (!transcription.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, adicione uma transcrição antes de gerar o documento",
        variant: "destructive"
      });
      return;
    }

    if (!intention.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe a intenção do documento",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedDocument(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-report', {
        body: {
          transcription: transcription.trim(),
          intention: intention.trim(),
          timestamp: new Date().toISOString()
        }
      });

      if (error) {
        throw new Error(error.message || 'Erro ao gerar documento');
      }

      const document: GeneratedDocument = {
        id: crypto.randomUUID(),
        title: data.title || 'Documento Gerado',
        content: data.content || data.report || 'Conteúdo não disponível',
        createdAt: new Date().toISOString(),
        type: 'generated_report'
      };

      setGeneratedDocument(document);
      onDocumentGenerated?.(document);
      
      toast({
        title: "Sucesso",
        description: "Documento gerado com sucesso!"
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao gerar documento';
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Limpar formulário
  const clearForm = () => {
    setTranscription('');
    setIntention('');
    setGeneratedDocument(null);
    setError(null);
    removeUploadedFile();
  };

  return (
    <div className="space-y-6">
      {/* Formulário de Geração */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-medical-blue" />
            Gerador de Documentos Médicos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload de Arquivo */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload de Arquivo (Opcional)</Label>
            <div className="flex items-center gap-4">
              <Input
                id="file-upload"
                type="file"
                ref={fileInputRef}
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                disabled={isProcessingFile}
                className="flex-1"
              />
              {uploadedFile && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {uploadedFile.name}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeUploadedFile}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
            {isProcessingFile && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processando arquivo...
              </div>
            )}
          </div>

          {/* Campo de Transcrição */}
          <div className="space-y-2">
            <Label htmlFor="transcription">Transcrição da Consulta</Label>
            <Textarea
              id="transcription"
              placeholder="Cole aqui a transcrição da consulta ou deixe que o upload do arquivo preencha automaticamente..."
              value={transcription}
              onChange={(e) => setTranscription(e.target.value)}
              rows={8}
              className="resize-none"
            />
          </div>

          {/* Campo de Intenção */}
          <div className="space-y-2">
            <Label htmlFor="intention">Intenção do Documento</Label>
            <Input
              id="intention"
              placeholder="Ex: Gerar relatório clínico resumido, Criar laudo de exame, Elaborar prescrição médica..."
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center gap-3">
            <Button
              onClick={generateDocument}
              disabled={isGenerating || !transcription.trim() || !intention.trim()}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  Gerar Documento
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={clearForm}
              disabled={isGenerating}
            >
              Limpar
            </Button>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Documento Gerado */}
      {generatedDocument && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Documento Gerado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{generatedDocument.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Gerado em {new Date(generatedDocument.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>
              <Badge variant="outline">Relatório IA</Badge>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {generatedDocument.content}
              </pre>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(generatedDocument.content);
                  toast({
                    title: "Copiado",
                    description: "Documento copiado para a área de transferência"
                  });
                }}
              >
                Copiar Texto
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  const blob = new Blob([generatedDocument.content], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${generatedDocument.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
              >
                Baixar Arquivo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentGenerator;