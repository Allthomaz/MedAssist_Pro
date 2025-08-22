import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

type MicrophoneStatus = 'checking' | 'available' | 'denied' | 'error';
type RecordingQuality = 'high' | 'medium' | 'low';

interface UseAudioRecorderReturn {
  // Estados
  isRecording: boolean;
  recordedBlob: Blob | null;
  recordedUrl: string | null;
  recordingTime: number;
  microphoneStatus: MicrophoneStatus;
  recordingQuality: RecordingQuality;
  
  // Ações
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  clearRecording: () => void;
  
  // Cleanup
  cleanup: () => void;
}

interface AudioConstraints {
  echoCancellation?: boolean;
  noiseSuppression?: boolean;
  autoGainControl?: boolean;
  sampleRate?: number;
}

interface UseAudioRecorderOptions {
  audioConstraints?: AudioConstraints;
  onRecordingComplete?: (blob: Blob, url: string) => void;
  onError?: (error: Error) => void;
}

export const useAudioRecorder = (options: UseAudioRecorderOptions = {}): UseAudioRecorderReturn => {
  const {
    audioConstraints = {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      sampleRate: 44100
    },
    onRecordingComplete,
    onError
  } = options;

  // Estados
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [microphoneStatus, setMicrophoneStatus] = useState<MicrophoneStatus>('checking');
  const [recordingQuality, setRecordingQuality] = useState<RecordingQuality>('high');

  // Refs para recursos
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const isCleaningUpRef = useRef(false);

  // Função de limpeza robusta
  const cleanup = useCallback(() => {
    if (isCleaningUpRef.current) return;
    isCleaningUpRef.current = true;

    try {
      // Parar gravação se estiver ativa
      if (mediaRecorderRef.current) {
        if (mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
        
        // Limpar event listeners
        mediaRecorderRef.current.ondataavailable = null;
        mediaRecorderRef.current.onstop = null;
        mediaRecorderRef.current.onerror = null;
        mediaRecorderRef.current = null;
      }
      
      // Parar e limpar stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
        streamRef.current = null;
      }
      
      // Limpar timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // Limpar URL object se existir
      if (recordedUrl) {
        URL.revokeObjectURL(recordedUrl);
      }
      
      // Reset estados
      setIsRecording(false);
      setRecordingTime(0);
      
      console.log('Recursos de áudio limpos com sucesso');
    } catch (error) {
      console.error('Erro ao limpar recursos de áudio:', error);
      
      // Forçar reset dos estados mesmo com erro
      setIsRecording(false);
      setRecordingTime(0);
    } finally {
      isCleaningUpRef.current = false;
    }
  }, [recordedUrl]);

  // Verificar permissões do microfone
  const checkMicrophonePermissions = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicrophoneStatus('error');
        return;
      }

      const permission = await navigator.permissions.query({ name: 'microphone' as any });
      
      const updateStatus = () => {
        if (permission.state === 'granted') {
          setMicrophoneStatus('available');
        } else if (permission.state === 'denied') {
          setMicrophoneStatus('denied');
        } else {
          setMicrophoneStatus('checking');
        }
      };

      updateStatus();
      
      // Escutar mudanças de permissão
      permission.onchange = updateStatus;
      
      return () => {
        permission.onchange = null;
      };
    } catch (error) {
      console.error('Erro ao verificar permissões do microfone:', error);
      setMicrophoneStatus('error');
    }
  }, []);

  // Iniciar gravação
  const startRecording = useCallback(async () => {
    try {
      // Verificar suporte do navegador
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Seu navegador não suporta gravação de áudio');
      }

      // Limpar recursos anteriores antes de iniciar nova gravação
      if (streamRef.current || mediaRecorderRef.current) {
        cleanup();
        // Aguardar um pouco para garantir que a limpeza foi concluída
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Verificar permissões
      const permission = await navigator.permissions.query({ name: 'microphone' as any });
      if (permission.state === 'denied') {
        throw new Error('Permissão de microfone negada. Por favor, habilite nas configurações do navegador.');
      }

      // Obter stream de áudio
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: audioConstraints
      });
      
      streamRef.current = stream;
      
      // Adicionar listeners para tracks
      stream.getTracks().forEach(track => {
        track.onended = () => {
          console.warn('Track de áudio terminou inesperadamente');
          cleanup();
          toast.error("A gravação foi interrompida porque o microfone foi desconectado.");
        };
        
        track.onmute = () => {
          console.warn('Track de áudio foi mutado');
          toast.warning("O microfone parece estar mutado. Verifique as configurações.");
        };
      });
      
      // Verificar suporte do MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      setRecordingQuality(mimeType === 'audio/webm' ? 'high' : 'medium');
      
      // Criar MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      // Configurar event listeners
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        try {
          const blob = new Blob(chunksRef.current, { type: mimeType });
          const url = URL.createObjectURL(blob);
          
          setRecordedBlob(blob);
          setRecordedUrl(url);
          
          // Callback de sucesso
          onRecordingComplete?.(blob, url);
          
          toast.success("Áudio gravado com sucesso!");
        } catch (error) {
          console.error('Erro ao processar gravação:', error);
          onError?.(error as Error);
          
          toast.error("Erro ao processar a gravação.");
        }
      };
      
      mediaRecorder.onerror = (event) => {
        console.error('Erro no MediaRecorder:', event);
        const error = new Error('Erro durante a gravação');
        onError?.(error);
        
        toast.error("Ocorreu um erro durante a gravação.");
        
        // Cleanup completo em caso de erro
        cleanup();
      };
      
      // Iniciar gravação
      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);
      setMicrophoneStatus('available');
      
      // Timer para contagem de tempo
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast.success("Gravação iniciada. Fale próximo ao microfone para melhor qualidade.");
      
    } catch (error: any) {
      console.error('Erro ao iniciar gravação:', error);
      
      let errorMessage = 'Erro desconhecido ao acessar o microfone';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Permissão de microfone negada. Clique no ícone de cadeado na barra de endereços e permita o acesso ao microfone.';
        setMicrophoneStatus('denied');
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'Nenhum microfone encontrado. Verifique se há um microfone conectado.';
        setMicrophoneStatus('error');
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Microfone está sendo usado por outro aplicativo. Feche outros programas que possam estar usando o microfone.';
        setMicrophoneStatus('error');
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Configurações de áudio não suportadas pelo seu dispositivo.';
        setMicrophoneStatus('error');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      onError?.(error);
      
      toast({
        title: "Erro ao iniciar gravação",
        description: errorMessage,
        variant: "destructive"
      });
      
      setIsRecording(false);
    }
  }, [audioConstraints, onRecordingComplete, onError]);

  // Parar gravação
  const stopRecording = useCallback(() => {
    try {
      if (mediaRecorderRef.current && isRecording) {
        if (mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
        
        setIsRecording(false);
        
        // Limpar timer
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        // Parar stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => {
            track.stop();
            track.enabled = false;
          });
        }
        
        toast.success("A gravação foi finalizada com sucesso.");
      }
    } catch (error) {
      console.error('Erro ao parar gravação:', error);
      
      // Forçar reset dos estados mesmo com erro
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      toast.error("Gravação finalizada com alguns problemas técnicos.");
    }
  }, [isRecording]);

  // Limpar gravação atual
  const clearRecording = useCallback(() => {
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
    }
    
    setRecordedBlob(null);
    setRecordedUrl(null);
    setRecordingTime(0);
  }, [recordedUrl]);

  // Effect para verificar permissões na montagem
  useEffect(() => {
    checkMicrophonePermissions();
  }, [checkMicrophonePermissions]);

  // Effect para cleanup na desmontagem
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Effect para cleanup quando recordedUrl muda
  useEffect(() => {
    const currentUrl = recordedUrl;
    return () => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [recordedUrl]);

  // Effect para cleanup automático em caso de erro ou inatividade
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isRecording) {
      // Auto-stop após 30 minutos para evitar gravações infinitas
      timeoutId = setTimeout(() => {
        console.warn('Gravação interrompida automaticamente após 30 minutos');
        stopRecording();
        toast.warning("Gravação muito longa foi interrompida automaticamente.");
      }, 30 * 60 * 1000); // 30 minutos
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isRecording, stopRecording]);

  return {
    // Estados
    isRecording,
    recordedBlob,
    recordedUrl,
    recordingTime,
    microphoneStatus,
    recordingQuality,
    
    // Ações
    startRecording,
    stopRecording,
    clearRecording,
    
    // Cleanup
    cleanup
  };
};

export default useAudioRecorder;