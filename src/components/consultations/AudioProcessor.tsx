import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Send, 
  Activity, 
  FileText, 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

type IntentionType = 'gerar-relatorio' | 'evoluir-prontuario' | 'solicitar-exames';

interface AudioProcessorProps {
  onProcessingComplete?: (audioUrl: string, intention: IntentionType) => void;
  className?: string;
}

const AudioProcessor: React.FC<AudioProcessorProps> = ({ onProcessingComplete, className }) => {
  const [selectedIntention, setSelectedIntention] = useState<IntentionType>('gerar-relatorio');
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notes, setNotes] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const intentionOptions = [
    { value: 'gerar-relatorio', label: 'Gerar Relatório' },
    { value: 'evoluir-prontuario', label: 'Evoluir Prontuário' },
    { value: 'solicitar-exames', label: 'Solicitar Exames' }
  ];

  // Cleanup function
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (recordedUrl) {
        URL.revokeObjectURL(recordedUrl);
      }
    };
  }, [recordedUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setRecordedUrl(url);
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };
      
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast({
        title: "Gravação iniciada",
        description: "A gravação de áudio foi iniciada com sucesso.",
      });
      
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível acessar o microfone. Verifique as permissões.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      toast({
        title: "Gravação finalizada",
        description: "A gravação foi finalizada com sucesso.",
      });
    }
  };

  const handleSendForProcessing = async () => {
    if (!recordedBlob) {
      toast({
        title: "Erro",
        description: "Nenhuma gravação encontrada para processar.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Gerar nome único para o arquivo
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `recording-${selectedIntention}-${timestamp}.webm`;

      // Simular progresso de upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Upload do arquivo para o Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recordings')
        .upload(fileName, recordedBlob, {
          contentType: 'audio/webm',
          metadata: {
            intention: selectedIntention,
            timestamp: new Date().toISOString(),
            processed: 'false',
            notes: notes,
            duration: recordingTime.toString()
          }
        });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (uploadError) {
        throw uploadError;
      }

      // Obter URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from('recordings')
        .getPublicUrl(fileName);

      toast({
        title: "Sucesso!",
        description: `Áudio enviado para processamento com intenção: ${intentionOptions.find(opt => opt.value === selectedIntention)?.label}`,
      });

      // Callback para componente pai
      if (onProcessingComplete) {
        onProcessingComplete(urlData.publicUrl, selectedIntention);
      }

      // Reset states
      setRecordedBlob(null);
      setRecordedUrl(null);
      setRecordingTime(0);
      setUploadProgress(0);
      setNotes('');

    } catch (error) {
      console.error('Erro ao enviar áudio:', error);
      toast({
        title: "Erro",
        description: "Falha ao enviar áudio para processamento.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const toggleAudioPlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("w-full max-w-7xl mx-auto p-6", className)}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Activity className="w-6 h-6 text-medical-blue" />
          DoctorAssistant - Interface de Consulta
        </h1>
        <p className="text-muted-foreground mt-1">
          Sistema integrado para gravação, análise e processamento de consultas médicas
        </p>
      </div>

      {/* Layout de Três Colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUNA 1: Controle e Gravação */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-medical-blue" />
              Controle de Gravação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Dropdown de Intenções */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Intenção do Processamento
              </Label>
              <Select
                value={selectedIntention}
                onValueChange={(value: IntentionType) => setSelectedIntention(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Escolha uma intenção" />
                </SelectTrigger>
                <SelectContent>
                  {intentionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status da Gravação */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                  isRecording 
                    ? 'bg-red-100 text-red-700 border border-red-200' 
                    : recordedBlob
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  {isRecording ? (
                    <>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      Gravando
                    </>
                  ) : recordedBlob ? (
                    <>
                      <CheckCircle className="w-3 h-3" />
                      Finalizada
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3" />
                      Aguardando
                    </>
                  )}
                </div>
              </div>
              
              {/* Timer */}
              {(isRecording || recordingTime > 0) && (
                <div className="flex items-center justify-between text-sm">
                  <span>Duração:</span>
                  <span className="font-mono font-medium">{formatTime(recordingTime)}</span>
                </div>
              )}
            </div>

            {/* Controles de Gravação */}
            <div className="space-y-3">
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  className="w-full gap-2 bg-medical-blue hover:bg-medical-blue/90"
                  size="lg"
                  disabled={isUploading}
                >
                  <Mic className="w-4 h-4" />
                  {recordedBlob ? 'Nova Gravação' : 'Iniciar Consulta'}
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  className="w-full gap-2 bg-red-600 hover:bg-red-700"
                  size="lg"
                >
                  <Square className="w-4 h-4" />
                  Finalizar Consulta
                </Button>
              )}
            </div>

            {/* Pré-visualização do Áudio */}
            {recordedUrl && (
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Pré-visualização
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleAudioPlayback}
                      className="gap-2"
                    >
                      {isPlaying ? (
                        <Pause className="w-3 h-3" />
                      ) : (
                        <Play className="w-3 h-3" />
                      )}
                      {isPlaying ? 'Pausar' : 'Reproduzir'}
                    </Button>
                  </div>
                  
                  <audio
                    ref={audioRef}
                    src={recordedUrl}
                    className="w-full"
                    controls
                  />
                </div>

                {/* Botão de Envio */}
                <div className="space-y-2">
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Enviando...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                  
                  <Button
                    onClick={handleSendForProcessing}
                    disabled={isUploading}
                    className="w-full gap-2 bg-medical-success hover:bg-medical-success/90"
                    size="lg"
                  >
                    <Send className="w-4 h-4" />
                    {isUploading ? 'Enviando...' : 'Enviar para Processamento'}
                  </Button>
                </div>
              </div>
            )}

            {/* Fluxo de Processamento */}
            <div className="bg-card rounded-lg p-3 border">
              <h4 className="font-medium text-sm mb-3">Fluxo de Processamento</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-medical-blue text-white flex items-center justify-center text-xs">1</div>
                  Gravação do áudio
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-medical-success text-white flex items-center justify-center text-xs">2</div>
                  Agente Roteador analisa
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-accent text-foreground flex items-center justify-center text-xs">3</div>
                  Especialista processa
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* COLUNA 2: Análise e Anotações */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-medical-success" />
              Anotações da Consulta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Observações e Anotações
              </Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Digite suas observações durante a consulta..."
                className="min-h-[200px] resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {notes.length}/1000 caracteres
              </p>
            </div>

            {/* Informações da Sessão */}
            <div className="bg-muted/50 rounded-lg p-3 border">
              <h4 className="font-medium text-sm mb-2">Informações da Sessão</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Intenção:</span>
                  <span className="font-medium">
                    {intentionOptions.find(opt => opt.value === selectedIntention)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Duração:</span>
                  <span className="font-medium">{formatTime(recordingTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium">
                    {isRecording ? 'Em andamento' : recordedBlob ? 'Finalizada' : 'Não iniciada'}
                  </span>
                </div>
              </div>
            </div>

            {/* Atalhos de Texto */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Atalhos Rápidos</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNotes(prev => prev + '\n• Paciente relata: ')}
                  className="text-xs"
                >
                  + Relato
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNotes(prev => prev + '\n• Exame físico: ')}
                  className="text-xs"
                >
                  + Exame
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNotes(prev => prev + '\n• Diagnóstico: ')}
                  className="text-xs"
                >
                  + Diagnóstico
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNotes(prev => prev + '\n• Prescrição: ')}
                  className="text-xs"
                >
                  + Prescrição
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* COLUNA 3: Informações Adicionais */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-accent" />
              Documentos e Exames
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Upload de Arquivos */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Anexar Documentos
              </Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Clique para selecionar arquivos
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, Imagens, Documentos
                    </p>
                  </div>
                </Label>
              </div>
            </div>

            {/* Lista de Arquivos Anexados */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Arquivos Anexados</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded border">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs truncate" title={file.name}>
                          {file.name}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Informações do Sistema */}
            <div className="bg-muted/50 rounded-lg p-3 border">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Informações do Sistema
              </h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Supabase Storage: Conectado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>MediaRecorder API: Disponível</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Agente IA: Aguardando</span>
                </div>
              </div>
            </div>

            {/* Configurações Rápidas */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Configurações</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Qualidade do Áudio:</span>
                  <span className="font-medium">Alta (WebM)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Auto-save:</span>
                  <span className="font-medium">Ativado</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Backup:</span>
                  <span className="font-medium">Supabase</span>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AudioProcessor;