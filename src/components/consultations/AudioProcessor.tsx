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
  AlertCircle,
  Loader2 
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
  const [microphoneStatus, setMicrophoneStatus] = useState<'checking' | 'available' | 'denied' | 'error'>('checking');
  const [recordingQuality, setRecordingQuality] = useState<'high' | 'medium' | 'low'>('high');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const intentionOptions = [
    { value: 'gerar-relatorio', label: 'Gerar Relatorio' },
    { value: 'evoluir-prontuario', label: 'Evoluir Prontuario' },
    { value: 'solicitar-exames', label: 'Solicitar Exames' }
  ];

  const cleanupResources = () => {
    try {
      // Parar gravação se estiver ativa
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      
      // Limpar stream e suas tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
        streamRef.current = null;
      }
      
      // Limpar MediaRecorder
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.ondataavailable = null;
        mediaRecorderRef.current.onstop = null;
        mediaRecorderRef.current.onerror = null;
        mediaRecorderRef.current = null;
      }
      
      // Limpar timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // Reset estados
      setIsRecording(false);
      setRecordingTime(0);
      setRecordedBlob(null);
      
      console.log('Recursos de audio limpos com sucesso');
    } catch (error) {
      console.error('Erro ao limpar recursos:', error);
      
      // Forcar reset dos estados mesmo com erro
      setIsRecording(false);
      setRecordingTime(0);
      setRecordedBlob(null);
    }
  };

  // Check microphone permissions on component mount
  useEffect(() => {
    const checkMicrophonePermissions = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setMicrophoneStatus('error');
          return;
        }

        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        
        if (permission.state === 'granted') {
          setMicrophoneStatus('available');
        } else if (permission.state === 'denied') {
          setMicrophoneStatus('denied');
        } else {
          setMicrophoneStatus('checking');
        }

        // Listen for permission changes
        permission.onchange = () => {
          if (permission.state === 'granted') {
            setMicrophoneStatus('available');
          } else if (permission.state === 'denied') {
            setMicrophoneStatus('denied');
          }
        };
      } catch (error) {
        console.error('Erro ao verificar permissoes do microfone:', error);
        setMicrophoneStatus('error');
      }
    };

    checkMicrophonePermissions();
  }, []);

  // Cleanup function
  useEffect(() => {
    return () => {
      cleanupResources();
    };
  }, []);

  // Cleanup on recordedUrl change
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
      // Verificar se o navegador suporta getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Seu navegador nao suporta gravacao de audio');
      }

      // Verificar permissões antes de solicitar acesso
      const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      
      if (permission.state === 'denied') {
        throw new Error('Permissao de microfone negada. Por favor, habilite nas configuracoes do navegador.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        } 
      });
      
      streamRef.current = stream;
      
      // Verificar se MediaRecorder e suportado
        if (!MediaRecorder.isTypeSupported('audio/webm')) {
          console.warn('audio/webm nao suportado, usando formato padrao');
          setRecordingQuality('medium');
        } else {
          setRecordingQuality('high');
        }

        // Atualizar status do microfone
        setMicrophoneStatus('available');
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      // Configurar event listeners com tratamento de erro
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        try {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          setRecordedBlob(blob);
          const url = URL.createObjectURL(blob);
          setRecordedUrl(url);
          
          toast({
            title: "Gravacao concluida",
            description: "Audio gravado com sucesso!",
          });
        } catch (error) {
          console.error('Erro ao processar gravacao:', error);
          
          // Tratamento específico para diferentes tipos de erro
          if (error.name === 'NotAllowedError') {
            setMicrophoneStatus('denied');
            toast({
              title: "Erro",
              description: "Acesso ao microfone foi negado. Verifique as permissões do navegador.",
              variant: "destructive"
            });
          } else if (error.name === 'NotFoundError') {
            setMicrophoneStatus('error');
            toast({
              title: "Erro",
              description: "Nenhum microfone encontrado no dispositivo.",
              variant: "destructive"
            });
          } else if (error.name === 'NotSupportedError') {
            setMicrophoneStatus('error');
            toast({
              title: "Erro",
              description: "Gravação de áudio não é suportada neste navegador.",
              variant: "destructive"
            });
          } else {
            setMicrophoneStatus('error');
            toast({
              title: "Erro",
              description: "Erro ao acessar o microfone: " + (error.message || "Erro desconhecido"),
              variant: "destructive"
            });
          }
        }
      };
      
      mediaRecorder.onerror = (event) => {
        console.error('Erro no MediaRecorder:', event);
        toast({
          title: "Erro de gravacao",
          description: "Ocorreu um erro durante a gravacao.",
          variant: "destructive"
        });
        setIsRecording(false);
      };
      
      mediaRecorder.start(1000); // Capturar dados a cada segundo
      setIsRecording(true);
      setRecordingTime(0);
      
      // Timer para contagem de tempo
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast({
          title: "Gravacao iniciada",
          description: "Fale proximo ao microfone para melhor qualidade.",
        });
      
    } catch (error: any) {
      console.error('Erro ao iniciar gravação:', error);
      
      let errorMessage = 'Erro desconhecido ao acessar o microfone';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Permissao de microfone negada. Clique no icone de cadeado na barra de enderecos e permita o acesso ao microfone.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'Nenhum microfone encontrado. Verifique se ha um microfone conectado.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Microfone esta sendo usado por outro aplicativo. Feche outros programas que possam estar usando o microfone.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Configuracoes de audio nao suportadas pelo seu dispositivo.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro ao iniciar gravacao",
        description: errorMessage,
        variant: "destructive"
      });
      
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    try {
      if (mediaRecorderRef.current && isRecording) {
        // Verificar se o MediaRecorder está em estado válido
        if (mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
        
        setIsRecording(false);
        
        // Limpar timer
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        // Parar todas as tracks do stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => {
            track.stop();
            track.enabled = false;
          });
        }
        
        toast({
          title: "Gravacao finalizada",
          description: "A gravacao foi finalizada com sucesso.",
        });
      }
    } catch (error) {
      console.error('Erro ao parar gravação:', error);
      
      // Forcar reset dos estados mesmo com erro
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      toast({
        title: "Aviso",
        description: "Gravacao finalizada com alguns problemas tecnicos.",
        variant: "destructive"
      });
    }
  };

  const playRecording = () => {
    if (recordedUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendForProcessing = async () => {
    if (!recordedBlob) {
      toast({
        title: "Erro",
        description: "Nenhuma gravacao encontrada para processar.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Gerar nome único para o arquivo
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `recording-${timestamp}.webm`;

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

      // Upload para Supabase Storage
      const { data, error } = await supabase.storage
        .from('recordings')
        .upload(fileName, recordedBlob, {
          contentType: 'audio/webm',
          metadata: {
            intention: selectedIntention,
            recordingTime: recordingTime.toString(),
            notes: notes || 'Sem observacoes'
          }
        });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (error) {
        throw error;
      }

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('recordings')
        .getPublicUrl(fileName);

      toast({
        title: "Upload concluido",
        description: "Gravacao enviada com sucesso para processamento!",
      });

      // Callback para componente pai
      if (onProcessingComplete) {
        onProcessingComplete(publicUrl, selectedIntention);
      }

      // Reset do componente
      setRecordedBlob(null);
      setRecordedUrl(null);
      setRecordingTime(0);
      setNotes('');
      setUploadProgress(0);

    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: error.message || "Falha ao enviar gravacao.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const audioFiles = files.filter(file => file.type.startsWith('audio/'));
    
    if (audioFiles.length !== files.length) {
      toast({
        title: "Aviso",
        description: "Apenas arquivos de audio sao aceitos.",
        variant: "destructive"
      });
    }
    
    setUploadedFiles(prev => [...prev, ...audioFiles]);
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("space-y-6", className)}>
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
            <Select value={selectedIntention} onValueChange={(value: IntentionType) => setSelectedIntention(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a intencao" />
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
          
          <div className="space-y-2">
            <Label htmlFor="notes">Observacoes (Opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Adicione observacoes sobre a consulta ou contexto adicional..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
                  {microphoneStatus === 'available' ? 'Iniciar Gravacao' :
                   microphoneStatus === 'denied' ? 'Acesso ao Microfone Negado' :
                   microphoneStatus === 'error' ? 'Microfone Indisponível' :
                   'Verificando Microfone...'}
                </Button>
            ) : (
              <Button
                onClick={stopRecording}
                size="lg"
                variant="destructive"
              >
                <Square className="h-5 w-5 mr-2" />
                Parar Gravacao
              </Button>
            )}
          </div>

          {isRecording && (
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Activity className="h-4 w-4 text-red-500 animate-pulse" />
                <span className="text-lg font-mono">{formatTime(recordingTime)}</span>
              </div>
              <p className="text-sm text-muted-foreground">Gravando... Fale proximo ao microfone</p>
            </div>
          )}

          {recordedUrl && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <Button
                  onClick={playRecording}
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
              <p className="text-sm text-gray-600">Clique para selecionar arquivos de audio</p>
              <p className="text-xs text-gray-400 mt-1">Suporta MP3, WAV, M4A, etc.</p>
            </Label>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Arquivos Selecionados:</h4>
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
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
              disabled={isUploading || (!recordedBlob && uploadedFiles.length === 0)}
            >
              {isUploading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar para {intentionOptions.find(opt => opt.value === selectedIntention)?.label}
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
                <span className={`font-medium ${
                  microphoneStatus === 'available' ? 'text-green-600' :
                  microphoneStatus === 'denied' ? 'text-red-600' :
                  microphoneStatus === 'error' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {microphoneStatus === 'available' ? 'Disponível' :
                   microphoneStatus === 'denied' ? 'Acesso Negado' :
                   microphoneStatus === 'error' ? 'Erro' :
                   'Verificando...'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Qualidade do Audio:</span>
                <span className={`font-medium ${
                  recordingQuality === 'high' ? 'text-green-600' :
                  recordingQuality === 'medium' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {recordingQuality === 'high' ? 'Alta (WebM)' :
                   recordingQuality === 'medium' ? 'Média' :
                   'Baixa'}
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
              Para usar a gravação, clique no ícone de cadeado na barra de endereços e permita o acesso ao microfone.
            </div>
          )}
          {microphoneStatus === 'error' && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              <AlertCircle className="h-4 w-4 inline mr-2" />
              Seu navegador não suporta gravação de áudio ou não há microfone disponível.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AudioProcessor;