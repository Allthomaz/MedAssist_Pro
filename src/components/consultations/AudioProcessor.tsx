import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
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
  AlertCircle,
  Loader2,
} from 'lucide-react';

type IntentionType =
  | 'gerar-relatorio'
  | 'evoluir-prontuario'
  | 'solicitar-exames';

interface AudioProcessorProps {
  onProcessingComplete?: (audioUrl: string, intention: IntentionType) => void;
  className?: string;
}

const AudioProcessor: React.FC<AudioProcessorProps> = ({
  onProcessingComplete,
  className,
}) => {
  const [selectedIntention, setSelectedIntention] =
    useState<IntentionType>('gerar-relatorio');
  const [isUploading, setIsUploading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notes, setNotes] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Usar o hook customizado para gravação de áudio
  const {
    isRecording,
    recordedBlob,
    recordedUrl,
    recordingTime,
    microphoneStatus,
    recordingQuality,
    startRecording,
    stopRecording,
  } = useAudioRecorder({
    onRecordingComplete: (blob, url) => {
      // Callback quando gravação é concluída com sucesso
      console.log('Gravação concluída:', { blob, url });
    },
    onError: error => {
      // Callback para tratamento de erros
      console.error('Erro na gravação:', error);
    },
  });

  const intentionOptions = [
    { value: 'gerar-relatorio', label: 'Gerar Relatorio' },
    { value: 'evoluir-prontuario', label: 'Evoluir Prontuario' },
    { value: 'solicitar-exames', label: 'Solicitar Exames' },
  ];

  // Função de limpeza simplificada
  const handleCleanup = () => {
    setNotes('');
    setUploadProgress(0);
    setUploadedFiles([]);
  };

  // Verificação de permissões agora é feita pelo hook useAudioRecorder

  // Cleanup na desmontagem do componente
  useEffect(() => {
    return () => {
      handleCleanup();
    };
  }, []);

  // Função startRecording agora é fornecida pelo hook useAudioRecorder

  // Função stopRecording agora é fornecida pelo hook useAudioRecorder

  // Função para formatar tempo de gravação
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Processa e envia a gravação de áudio para o Supabase Storage
   *
   * Esta função realiza o upload da gravação para o bucket 'recordings' do Supabase,
   * incluindo metadados sobre a intenção, tempo de gravação e observações.
   * Também simula o progresso do upload para melhor UX.
   *
   * Fluxo:
   * 1. Valida se existe uma gravação
   * 2. Gera nome único baseado no timestamp
   * 3. Simula progresso visual do upload
   * 4. Faz upload para Supabase Storage com metadados
   * 5. Obtém URL pública do arquivo
   * 6. Notifica o componente pai via callback
   * 7. Limpa o estado do componente
   */
  const handleSendForProcessing = async () => {
    if (!recordedBlob) {
      toast({
        title: 'Erro',
        description: 'Nenhuma gravacao encontrada para processar.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Gerar nome único para o arquivo baseado no timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `recording-${timestamp}.webm`;

      // Simular progresso de upload para melhor experiência do usuário
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Upload para Supabase Storage
      const { error } = await supabase.storage
        .from('recordings')
        .upload(fileName, recordedBlob, {
          contentType: 'audio/webm',
          metadata: {
            intention: selectedIntention,
            recordingTime: recordingTime.toString(),
            notes: notes || 'Sem observacoes',
          },
        });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (error) {
        throw error;
      }

      // Obter URL pública
      const {
        data: { publicUrl },
      } = supabase.storage.from('recordings').getPublicUrl(fileName);

      toast({
        title: 'Upload concluido',
        description: 'Gravacao enviada com sucesso para processamento!',
      });

      // Callback para componente pai
      if (onProcessingComplete) {
        onProcessingComplete(publicUrl, selectedIntention);
      }

      // Reset do componente
      handleCleanup();
      setNotes('');
      setUploadProgress(0);
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast({
        title: 'Erro no upload',
        description: error.message || 'Falha ao enviar gravacao.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Gerencia o upload de arquivos de áudio externos
   *
   * Filtra apenas arquivos de áudio válidos e adiciona à lista de arquivos
   * carregados. Exibe aviso se arquivos não-áudio forem selecionados.
   *
   * @param event - Evento de mudança do input de arquivo
   */
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const audioFiles = files.filter(file => file.type.startsWith('audio/'));

    // Validar se todos os arquivos são de áudio
    if (audioFiles.length !== files.length) {
      toast({
        title: 'Aviso',
        description: 'Apenas arquivos de audio sao aceitos.',
        variant: 'destructive',
      });
    }

    setUploadedFiles(prev => [...prev, ...audioFiles]);
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Seleção de Intenção */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Configuração do Processamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="intention">Intencao do Processamento</Label>
            <Select
              value={selectedIntention}
              onValueChange={(value: IntentionType) =>
                setSelectedIntention(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a intencao" />
              </SelectTrigger>
              <SelectContent>
                {intentionOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observacoes (Opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Adicione observacoes sobre a consulta ou contexto adicional..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Gravação de Áudio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Gravacao de Audio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center space-x-4">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isUploading || microphoneStatus !== 'available'}
              >
                {microphoneStatus === 'checking' ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Mic className="h-5 w-5 mr-2" />
                )}
                {microphoneStatus === 'available'
                  ? 'Iniciar Gravacao'
                  : microphoneStatus === 'denied'
                    ? 'Acesso ao Microfone Negado'
                    : microphoneStatus === 'error'
                      ? 'Microfone Indisponível'
                      : 'Verificando Microfone...'}
              </Button>
            ) : (
              <Button onClick={stopRecording} size="lg" variant="destructive">
                <Square className="h-5 w-5 mr-2" />
                Parar Gravacao
              </Button>
            )}
          </div>

          {isRecording && (
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Activity className="h-4 w-4 text-red-500 animate-pulse" />
                <span className="text-lg font-mono">
                  {formatTime(recordingTime)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Gravando... Fale proximo ao microfone
              </p>
            </div>
          )}

          {recordedUrl && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <Button
                  onClick={() => {
                    if (recordedUrl) {
                      const audio = new Audio(recordedUrl);
                      audio.play().catch(error => {
                        console.error('Erro ao reproduzir audio:', error);
                        toast.error('Erro ao reproduzir o audio gravado');
                      });
                    }
                  }}
                  variant="outline"
                  size="sm"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 mr-2" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  {isPlaying ? 'Pausar' : 'Reproduzir'}
                </Button>
                <span className="text-sm text-muted-foreground">
                  Duracao: {formatTime(recordingTime)}
                </span>
              </div>

              <audio
                ref={audioRef}
                src={recordedUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload de Arquivos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload de Arquivos de Audio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Input
              type="file"
              accept="audio/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="audio-upload"
            />
            <Label htmlFor="audio-upload" className="cursor-pointer">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">
                Clique para selecionar arquivos de audio
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Suporta MP3, WAV, M4A, etc.
              </p>
            </Label>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Arquivos Selecionados:</h4>
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span className="text-sm">{file.name}</span>
                  <Button
                    onClick={() => removeUploadedFile(index)}
                    variant="ghost"
                    size="sm"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Envio para Processamento */}
      {(recordedBlob || uploadedFiles.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Enviar para Processamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Enviando...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            <Button
              onClick={handleSendForProcessing}
              className="w-full"
              disabled={
                isUploading || (!recordedBlob && uploadedFiles.length === 0)
              }
            >
              {isUploading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar para{' '}
                  {
                    intentionOptions.find(
                      opt => opt.value === selectedIntention
                    )?.label
                  }
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Status e Informações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Status do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Microfone:</span>
                <span
                  className={`font-medium ${
                    microphoneStatus === 'available'
                      ? 'text-green-600'
                      : microphoneStatus === 'denied'
                        ? 'text-red-600'
                        : microphoneStatus === 'error'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                  }`}
                >
                  {microphoneStatus === 'available'
                    ? 'Disponível'
                    : microphoneStatus === 'denied'
                      ? 'Acesso Negado'
                      : microphoneStatus === 'error'
                        ? 'Erro'
                        : 'Verificando...'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Qualidade do Audio:</span>
                <span
                  className={`font-medium ${
                    recordingQuality === 'high'
                      ? 'text-green-600'
                      : recordingQuality === 'medium'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  }`}
                >
                  {recordingQuality === 'high'
                    ? 'Alta (WebM)'
                    : recordingQuality === 'medium'
                      ? 'Média'
                      : 'Baixa'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Auto-save:</span>
                <span className="font-medium">Ativado</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Backup:</span>
                <span className="font-medium">Supabase</span>
              </div>
            </div>
          </div>
          {microphoneStatus === 'denied' && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              <AlertCircle className="h-4 w-4 inline mr-2" />
              Para usar a gravação, clique no ícone de cadeado na barra de
              endereços e permita o acesso ao microfone.
            </div>
          )}
          {microphoneStatus === 'error' && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              <AlertCircle className="h-4 w-4 inline mr-2" />
              Seu navegador não suporta gravação de áudio ou não há microfone
              disponível.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AudioProcessor;
