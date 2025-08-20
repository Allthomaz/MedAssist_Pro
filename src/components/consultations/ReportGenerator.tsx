import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FileText, Download, Loader2 } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import jsPDF from 'jspdf';

interface ReportGeneratorProps {
  consultationId: string;
  transcriptionText?: string;
  patientName?: string;
  doctorName?: string;
}

interface GeneratedReport {
  title: string;
  content: string;
  success: boolean;
  error?: string;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  consultationId,
  transcriptionText = '',
  patientName = 'Paciente',
  doctorName = 'Dr. [Nome]'
}) => {
  const [reportType, setReportType] = useState<string>('');
  const [customIntention, setCustomIntention] = useState<string>('');
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const reportTypes = [
    { value: 'relatório clínico', label: 'Relatório Clínico' },
    { value: 'laudo médico', label: 'Laudo Médico' },
    { value: 'prescrição médica', label: 'Prescrição Médica' },
    { value: 'atestado médico', label: 'Atestado Médico' },
    { value: 'evolução clínica', label: 'Evolução Clínica' },
    { value: 'custom', label: 'Personalizado' }
  ];

  const generateReport = async () => {
    if (!transcriptionText.trim()) {
      alert('Não há transcrição disponível para gerar o relatório.');
      return;
    }

    if (!reportType) {
      alert('Selecione o tipo de relatório.');
      return;
    }

    if (reportType === 'custom' && !customIntention.trim()) {
      alert('Descreva o tipo de documento personalizado.');
      return;
    }

    setIsGenerating(true);
    setGeneratedReport(null);

    try {
      const intention = reportType === 'custom' ? customIntention : reportType;
      
      const { data, error } = await supabase.functions.invoke('generate-report', {
        body: {
          transcription: transcriptionText,
          intention: intention,
          timestamp: new Date().toISOString()
        }
      });

      if (error) {
        throw new Error(error.message || 'Erro ao gerar relatório');
      }

      if (!data.success) {
        throw new Error(data.error || 'Falha na geração do relatório');
      }

      setGeneratedReport(data);

      // Salvar relatório no banco de dados
      const { error: saveError } = await supabase
        .from('documents')
        .insert({
          consultation_id: consultationId,
          document_type: intention,
          title: data.title,
          content: data.content,
          generated_at: new Date().toISOString(),
          status: 'generated'
        });

      if (saveError) {
        console.error('Erro ao salvar relatório:', saveError);
      }

    } catch (error) {
      console.error('Erro na geração do relatório:', error);
      alert(`Erro ao gerar relatório: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = async () => {
    if (!generatedReport) return;

    setIsDownloading(true);

    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - (margin * 2);
      
      // Configurar fonte
      pdf.setFont('helvetica');
      
      // Título
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      const titleLines = pdf.splitTextToSize(generatedReport.title, maxWidth);
      let currentY = margin + 10;
      
      titleLines.forEach((line: string) => {
        pdf.text(line, margin, currentY);
        currentY += 8;
      });
      
      currentY += 10;
      
      // Conteúdo
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      // Substituir placeholders
      let content = generatedReport.content
        .replace(/\[Nome do Paciente\]/g, patientName)
        .replace(/\[Número do CRM\]/g, 'XXXXXX')
        .replace(/Médico Responsável/g, doctorName)
        .replace(/Médico Prescritor/g, doctorName)
        .replace(/Assinatura do Médico/g, doctorName);
      
      const contentLines = pdf.splitTextToSize(content, maxWidth);
      
      contentLines.forEach((line: string) => {
        // Verificar se precisa de nova página
        if (currentY > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }
        
        pdf.text(line, margin, currentY);
        currentY += 6;
      });
      
      // Rodapé com data de geração
      const footerY = pageHeight - 15;
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'italic');
      pdf.text(
        `Documento gerado automaticamente em ${new Date().toLocaleString('pt-BR')}`,
        margin,
        footerY
      );
      
      // Download do PDF
      const fileName = `${generatedReport.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Gerador de Relatórios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Seleção do tipo de relatório */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo de Documento</label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de documento" />
            </SelectTrigger>
            <SelectContent>
              {reportTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Campo personalizado */}
        {reportType === 'custom' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Descreva o documento desejado</label>
            <Textarea
              value={customIntention}
              onChange={(e) => setCustomIntention(e.target.value)}
              placeholder="Ex: Relatório de alta hospitalar, Laudo de exame específico..."
              rows={3}
            />
          </div>
        )}

        {/* Botão de gerar */}
        <Button 
          onClick={generateReport}
          disabled={isGenerating || !transcriptionText.trim() || !reportType}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando Relatório...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Gerar Relatório
            </>
          )}
        </Button>

        {/* Relatório gerado */}
        {generatedReport && (
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{generatedReport.title}</h3>
              <Button
                onClick={downloadPDF}
                disabled={isDownloading}
                variant="outline"
                size="sm"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando PDF...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Baixar PDF
                  </>
                )}
              </Button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {generatedReport.content
                  .replace(/\[Nome do Paciente\]/g, patientName)
                  .replace(/\[Número do CRM\]/g, 'XXXXXX')
                  .replace(/Médico Responsável/g, doctorName)
                  .replace(/Médico Prescritor/g, doctorName)
                  .replace(/Assinatura do Médico/g, doctorName)
                }
              </pre>
            </div>
          </div>
        )}

        {/* Aviso sobre transcrição */}
        {!transcriptionText.trim() && (
          <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
            ⚠️ Nenhuma transcrição disponível. Grave e transcreva áudio primeiro para gerar relatórios.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;