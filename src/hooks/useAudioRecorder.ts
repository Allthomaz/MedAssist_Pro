import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

/**
 * Status do microfone durante a verificação de permissões
 */
type MicrophoneStatus = 'checking' | 'available' | 'denied' | 'error';

/**
 * Qualidade da gravação baseada no suporte do navegador
 */
type RecordingQuality = 'high' | 'medium' | 'low';

/**
 * Interface que define o retorno do hook useAudioRecorder
 *
 * @interface UseAudioRecorderReturn
 * @property {boolean} isRecording - Indica se está gravando atualmente
 * @property {Blob | null} recordedBlob - Blob do áudio gravado
 * @property {string | null} recordedUrl - URL do áudio gravado para reprodução
 * @property {number} recordingTime - Tempo de gravação em segundos
 * @property {MicrophoneStatus} microphoneStatus - Status atual do microfone
 * @property {RecordingQuality} recordingQuality - Qualidade da gravação
 * @property {() => Promise<void>} startRecording - Função para iniciar gravação
 * @property {() => void} stopRecording - Função para parar gravação
 * @property {() => void} clearRecording - Função para limpar gravação atual
 * @property {() => void} cleanup - Função para limpeza de recursos
 */
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

/**
 * Configurações de áudio para a gravação
 *
 * @interface AudioConstraints
 * @property {boolean} [echoCancellation] - Cancelamento de eco
 * @property {boolean} [noiseSuppression] - Supressão de ruído
 * @property {boolean} [autoGainControl] - Controle automático de ganho
 * @property {number} [sampleRate] - Taxa de amostragem em Hz
 */
interface AudioConstraints {
  echoCancellation?: boolean;
  noiseSuppression?: boolean;
  autoGainControl?: boolean;
  sampleRate?: number;
}

/**
 * Opções de configuração para o hook useAudioRecorder
 *
 * @interface UseAudioRecorderOptions
 * @property {AudioConstraints} [audioConstraints] - Configurações de áudio
 * @property {(blob: Blob, url: string) => void} [onRecordingComplete] - Callback quando gravação é concluída
 * @property {(error: Error) => void} [onError] - Callback para tratamento de erros
 */
interface UseAudioRecorderOptions {
  audioConstraints?: AudioConstraints;
  onRecordingComplete?: (blob: Blob, url: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook customizado para gravação de áudio com funcionalidades avançadas
 *
 * Este hook fornece uma interface completa para gravação de áudio, incluindo:
 * - Verificação automática de permissões do microfone
 * - Gravação com configurações de qualidade personalizáveis
 * - Controle de tempo de gravação
 * - Limpeza automática de recursos
 * - Tratamento robusto de erros
 * - Callbacks para eventos de gravação
 *
 * @param {UseAudioRecorderOptions} [options={}] - Opções de configuração
 * @param {AudioConstraints} [options.audioConstraints] - Configurações de áudio
 * @param {Function} [options.onRecordingComplete] - Callback executado quando gravação é concluída
 * @param {Function} [options.onError] - Callback para tratamento de erros
 *
 * @returns {UseAudioRecorderReturn} Objeto contendo estados e funções para controle de gravação
 *
 * @example
 * ```tsx
 * function AudioRecorder() {
 *   const {
 *     isRecording,
 *     recordedBlob,
 *     recordedUrl,
 *     recordingTime,
 *     microphoneStatus,
 *     startRecording,
 *     stopRecording,
 *     clearRecording
 *   } = useAudioRecorder({
 *     audioConstraints: {
 *       echoCancellation: true,
 *       noiseSuppression: true,
 *       sampleRate: 44100
 *     },
 *     onRecordingComplete: (blob, url) => {
 *       console.log('Gravação concluída:', { blob, url });
 *     },
 *     onError: (error) => {
 *       console.error('Erro na gravação:', error);
 *     }
 *   });
 *
 *   return (
 *     <div>
 *       <button
 *         onClick={isRecording ? stopRecording : startRecording}
 *         disabled={microphoneStatus !== 'available'}
 *       >
 *         {isRecording ? 'Parar' : 'Gravar'}
 *       </button>
 *
 *       {isRecording && <p>Gravando: {recordingTime}s</p>}
 *
 *       {recordedUrl && (
 *         <div>
 *           <audio src={recordedUrl} controls />
 *           <button onClick={clearRecording}>Limpar</button>
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export const useAudioRecorder = (
  options: UseAudioRecorderOptions = {}
): UseAudioRecorderReturn => {
  const {
    audioConstraints = {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      sampleRate: 44100,
    },
    onRecordingComplete,
    onError,
  } = options;

  // Estados
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [microphoneStatus, setMicrophoneStatus] =
    useState<MicrophoneStatus>('checking');
  const [recordingQuality, setRecordingQuality] =
    useState<RecordingQuality>('high');

  // Refs para recursos
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const isCleaningUpRef = useRef(false);

  /**
   * Função de limpeza robusta que libera todos os recursos de áudio
   *
   * Esta função:
   * - Para a gravação se estiver ativa
   * - Limpa event listeners do MediaRecorder
   * - Para e libera o stream de áudio
   * - Limpa timers ativos
   * - Revoga URLs de objeto criadas
   * - Reseta estados para valores iniciais
   *
   * @returns {void}
   */
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

  /**
   * Verifica e monitora as permissões do microfone
   *
   * Esta função:
   * - Verifica se o navegador suporta getUserMedia
   * - Consulta o status atual das permissões
   * - Configura listener para mudanças de permissão
   * - Atualiza o estado microphoneStatus adequadamente
   *
   * @returns {Promise<void>}
   */
  const checkMicrophonePermissions = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicrophoneStatus('error');
        return;
      }

      const permission = await navigator.permissions.query({
        name: 'microphone' as PermissionName,
      });

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

  /**
   * Inicia a gravação de áudio
   *
   * Esta função:
   * - Verifica suporte do navegador e permissões
   * - Limpa recursos de gravações anteriores
   * - Obtém stream de áudio com configurações especificadas
   * - Configura MediaRecorder com tipo MIME apropriado
   * - Inicia timer de contagem de tempo
   * - Configura listeners para eventos de gravação
   * - Trata erros específicos com mensagens apropriadas
   *
   * @returns {Promise<void>}
   * @throws {Error} Quando há problemas com permissões, dispositivos ou configurações
   */
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
      const permission = await navigator.permissions.query({
        name: 'microphone' as PermissionName,
      });
      if (permission.state === 'denied') {
        throw new Error(
          'Permissão de microfone negada. Por favor, habilite nas configurações do navegador.'
        );
      }

      // Obter stream de áudio
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraints,
      });

      streamRef.current = stream;

      // Adicionar listeners para tracks
      stream.getTracks().forEach(track => {
        track.onended = () => {
          console.warn('Track de áudio terminou inesperadamente');
          cleanup();
          toast.error(
            'A gravação foi interrompida porque o microfone foi desconectado.'
          );
        };

        track.onmute = () => {
          console.warn('Track de áudio foi mutado');
          toast.warning(
            'O microfone parece estar mutado. Verifique as configurações.'
          );
        };
      });

      // Verificar suporte do MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';
      setRecordingQuality(mimeType === 'audio/webm' ? 'high' : 'medium');

      // Criar MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      // Configurar event listeners
      mediaRecorder.ondataavailable = event => {
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

          toast.success('Áudio gravado com sucesso!');
        } catch (error) {
          console.error('Erro ao processar gravação:', error);
          onError?.(error as Error);

          toast.error('Erro ao processar a gravação.');
        }
      };

      mediaRecorder.onerror = event => {
        console.error('Erro no MediaRecorder:', event);
        const error = new Error('Erro durante a gravação');
        onError?.(error);

        toast.error('Ocorreu um erro durante a gravação.');

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

      toast.success(
        'Gravação iniciada. Fale próximo ao microfone para melhor qualidade.'
      );
    } catch (error: unknown) {
      console.error('Erro ao iniciar gravação:', error);

      let errorMessage = 'Erro desconhecido ao acessar o microfone';

      const err = error as Error;
      if (err.name === 'NotAllowedError') {
        errorMessage =
          'Permissão de microfone negada. Clique no ícone de cadeado na barra de endereços e permita o acesso ao microfone.';
        setMicrophoneStatus('denied');
      } else if (err.name === 'NotFoundError') {
        errorMessage =
          'Nenhum microfone encontrado. Verifique se há um microfone conectado.';
        setMicrophoneStatus('error');
      } else if (err.name === 'NotReadableError') {
        errorMessage =
          'Microfone está sendo usado por outro aplicativo. Feche outros programas que possam estar usando o microfone.';
        setMicrophoneStatus('error');
      } else if (err.name === 'OverconstrainedError') {
        errorMessage =
          'Configurações de áudio não suportadas pelo seu dispositivo.';
        setMicrophoneStatus('error');
      } else if (err.message) {
        errorMessage = err.message;
      }

      onError?.(error);

      toast({
        title: 'Erro ao iniciar gravação',
        description: errorMessage,
        variant: 'destructive',
      });

      setIsRecording(false);
    }
  }, [audioConstraints, onRecordingComplete, onError, cleanup]);

  /**
   * Para a gravação de áudio atual
   *
   * Esta função:
   * - Para o MediaRecorder se estiver gravando
   * - Limpa o timer de contagem
   * - Para e desabilita tracks do stream
   * - Atualiza estados apropriadamente
   * - Trata erros durante o processo de parada
   *
   * @returns {void}
   */
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

        toast.success('A gravação foi finalizada com sucesso.');
      }
    } catch (error) {
      console.error('Erro ao parar gravação:', error);

      // Forçar reset dos estados mesmo com erro
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      toast.error('Gravação finalizada com alguns problemas técnicos.');
    }
  }, [isRecording]);

  /**
   * Limpa a gravação atual e libera recursos associados
   *
   * Esta função:
   * - Revoga a URL do objeto de áudio
   * - Limpa o blob gravado
   * - Reseta o tempo de gravação
   * - Remove referências para permitir garbage collection
   *
   * @returns {void}
   */
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
      timeoutId = setTimeout(
        () => {
          console.warn('Gravação interrompida automaticamente após 30 minutos');
          stopRecording();
          toast.warning(
            'Gravação muito longa foi interrompida automaticamente.'
          );
        },
        30 * 60 * 1000
      ); // 30 minutos
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
    cleanup,
  };
};

export default useAudioRecorder;
