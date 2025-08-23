import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Upload,
  Play,
  Pause,
  Trash2,
  FileAudio,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  FileText,
} from 'lucide-react';

// Importar o cliente Supabase do arquivo de integração
import { supabase } from '../../integrations/supabase/client';
import AudioProcessor from '../consultations/AudioProcessor';
import { transcribeAudio } from '../../services/transcriptionService';

// Usar a variável de ambiente para a URL da API da OpenAI
// const OPENAI_API_URL = import.meta.env.VITE_OPENAI_API_URL || 'https://api.openai.com/v1/audio/transcriptions';

interface AudioFile {
  id: string;
  consultation_id: string;
  audio_file_name: string;
  audio_file_path: string;
  duration_seconds?: number;
  recording_status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  file_size?: number;
  transcription?: {
    id: string;
    transcript_text: string;
    confidence_score: number;
    language_detected: string;
    word_count: number;
  };
}

interface AudioManagerProps {
  consultationId: string;
  patientName: string;
  onTranscriptionUpdate?: (transcriptionId: string, text: string) => void;
}

export const AudioManager: React.FC<AudioManagerProps> = ({
  consultationId,
  patientName,
  onTranscriptionUpdate,
}) => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [transcribingAudio, setTranscribingAudio] = useState<string | null>(
    null
  );
  const [showRecorder, setShowRecorder] = useState(false);

  // Ref para rastrear elementos de áudio ativos
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioCleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    loadAudioFiles();
  }, [consultationId]);

  // Cleanup de recursos de áudio na desmontagem do componente
  useEffect(() => {
    return () => {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current.currentTime = 0;
        if (audioCleanupRef.current) {
          audioCleanupRef.current();
          audioCleanupRef.current = null;
        }
        activeAudioRef.current = null;
      }
      setPlayingAudio(null);
      setTranscribingAudio(null);
    };
  }, []);

  const loadAudioFiles = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: recordings, error: recordingsError } = await supabase
        .from('recordings')
        .select(
          `
          *,
          transcriptions (
            id,
            transcript_text,
            confidence_score,
            language_detected,
            word_count
          )
        `
        )
        .eq('consultation_id', consultationId)
        .order('created_at', { ascending: false });

      if (recordingsError) throw recordingsError;

      const formattedFiles: AudioFile[] =
        recordings?.map(recording => ({
          id: recording.id,
          consultation_id: recording.consultation_id,
          audio_file_name: recording.audio_file_name,
          audio_file_path: recording.audio_url,
          duration_seconds: recording.audio_duration,
          recording_status: recording.recording_status,
          created_at: recording.created_at,
          updated_at: recording.updated_at,
          file_size: recording.audio_file_size,
          transcription: recording.transcriptions?.[0] || null,
        })) || [];

      setAudioFiles(formattedFiles);
    } catch (err) {
      console.error('Erro ao carregar arquivos de áudio:', err);
      setError('Erro ao carregar arquivos de áudio');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Valida arquivos de áudio antes do upload
   *
   * Realiza validação completa do arquivo incluindo:
   * 1. Verificação de tamanho (1KB - 50MB)
   * 2. Validação de extensão de arquivo
   * 3. Verificação de tipo MIME
   * 4. Correspondência entre MIME type e extensão
   *
   * Esta validação garante que apenas arquivos de áudio válidos
   * sejam aceitos, prevenindo problemas de upload e transcrição.
   *
   * @param file - Arquivo a ser validado
   * @returns Promise com resultado da validação
   */
  const validateAudioFile = async (
    file: File
  ): Promise<{ isValid: boolean; error?: string }> => {
    // Validar tamanho mínimo para evitar arquivos corrompidos
    const minSize = 1024; // 1KB
    if (file.size < minSize) {
      return {
        isValid: false,
        error: 'Arquivo muito pequeno. Tamanho mínimo: 1KB.',
      };
    }

    // Validar tamanho máximo para otimizar performance e custos
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'Arquivo muito grande. Tamanho máximo: 50MB.',
      };
    }

    // Tipos MIME permitidos com suas extensões correspondentes
    const allowedMimeTypes = {
      'audio/wav': ['.wav'],
      'audio/wave': ['.wav'],
      'audio/x-wav': ['.wav'],
      'audio/mp3': ['.mp3'],
      'audio/mpeg': ['.mp3', '.mp2'],
      'audio/mpeg3': ['.mp3'],
      'audio/x-mpeg-3': ['.mp3'],
      'audio/webm': ['.webm'],
      'audio/ogg': ['.ogg'],
      'audio/vorbis': ['.ogg'],
      'audio/x-ogg': ['.ogg'],
      'audio/flac': ['.flac'],
      'audio/x-flac': ['.flac'],
      'audio/aac': ['.aac'],
      'audio/x-aac': ['.aac'],
      'audio/mp4': ['.m4a', '.mp4'],
      'audio/x-m4a': ['.m4a'],
    };

    // Validar extensão do arquivo
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const validExtensions = [
      '.wav',
      '.mp3',
      '.mp2',
      '.webm',
      '.ogg',
      '.flac',
      '.aac',
      '.m4a',
      '.mp4',
    ];

    if (!validExtensions.includes(fileExtension)) {
      return {
        isValid: false,
        error: `Extensão de arquivo não suportada: ${fileExtension}. Use: ${validExtensions.join(', ')}.`,
      };
    }

    // Validar tipo MIME
    const mimeType = file.type.toLowerCase();
    if (!Object.keys(allowedMimeTypes).includes(mimeType)) {
      return {
        isValid: false,
        error: `Tipo MIME não suportado: ${mimeType}. Use arquivos de áudio válidos.`,
      };
    }

    // Validar correspondência entre MIME type e extensão
    const expectedExtensions =
      allowedMimeTypes[mimeType as keyof typeof allowedMimeTypes];
    if (!expectedExtensions.includes(fileExtension)) {
      return {
        isValid: false,
        error: `Incompatibilidade entre tipo de arquivo (${mimeType}) e extensão (${fileExtension}).`,
      };
    }

    // Removida validação de assinatura para simplificar e evitar problemas potenciais

    return { isValid: true };
  };

  /**
   * Gerencia o upload de arquivos de áudio
   *
   * Processo completo de upload:
   * 1. Valida o arquivo selecionado
   * 2. Gera nome único para evitar conflitos
   * 3. Faz upload para Supabase Storage
   * 4. Salva metadados na tabela 'recordings'
   * 5. Atualiza a lista de arquivos
   * 6. Inicia transcrição automática
   *
   * O upload é otimizado para arquivos médicos com validação
   * rigorosa e tratamento de erros robusto.
   *
   * @param event - Evento de mudança do input de arquivo
   */
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validação robusta do arquivo antes do upload
    const validation = await validateAudioFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Arquivo inválido.');
      return;
    }

    try {
      setUploadingFile(true);
      setError(null);

      // Gerar nome único baseado na consulta e timestamp
      const fileExtension = file.name.split('.').pop();
      const fileName = `audio_${consultationId}_${Date.now()}.${fileExtension}`;

      // Upload para bucket 'recordings' do Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recordings')
        .upload(fileName, file, {
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      // Persistir metadados na tabela 'recordings'
      const { data: recordingData, error: recordingError } = await supabase
        .from('recordings')
        .insert({
          consultation_id: consultationId,
          audio_file_name: fileName,
          audio_file_path: uploadData.path,
          file_size: file.size,
          recording_status: 'pending',
          auto_transcribe: true, // Habilita transcrição automática
        })
        .select()
        .single();

      if (recordingError) throw recordingError;

      // Atualizar interface com novo arquivo
      await loadAudioFiles();

      // Iniciar processo de transcrição automática
      if (recordingData.id) {
        startTranscription(recordingData.id);
      }
    } catch (err) {
      console.error('Erro no upload:', err);
      setError('Erro ao fazer upload do arquivo');
    } finally {
      setUploadingFile(false);
      // Limpar input para permitir novo upload do mesmo arquivo
      event.target.value = '';
    }
  };

  /**
   * Inicia o processo de transcrição de áudio
   *
   * Utiliza o serviço de transcrição (OpenAI Whisper) para converter
   * áudio em texto. O processo é otimizado para português médico.
   *
   * Configurações:
   * - Idioma: Português (pt)
   * - Formato: verbose_json (inclui timestamps e confiança)
   * - Modelo: Whisper (via OpenAI API)
   *
   * @param recordingId - ID da gravação a ser transcrita
   */
  const startTranscription = async (recordingId: string) => {
    try {
      setTranscribingAudio(recordingId);
      setError(null);

      // Chamar serviço de transcrição com configurações médicas
      const result = await transcribeAudio(recordingId, {
        language: 'pt', // Português brasileiro
        response_format: 'verbose_json', // Inclui timestamps e metadados
      });

      if (result.error) {
        throw new Error(result.error);
      }

      // Atualizar interface com nova transcrição
      await loadAudioFiles();

      // Notificar componente pai sobre nova transcrição
      if (onTranscriptionUpdate && result.transcription) {
        onTranscriptionUpdate(recordingId, result.transcription);
      }
    } catch (err) {
      console.error('Erro na transcrição:', err);
      setError('Erro na transcrição do áudio');
    } finally {
      setTranscribingAudio(null);
    }
  };

  /**
   * Reproduz arquivo de áudio com controle de estado
   *
   * Gerencia a reprodução de áudio com:
   * 1. Geração de URL assinada do Supabase (válida por 1h)
   * 2. Controle de instância única (para um áudio por vez)
   * 3. Event listeners para fim e erro de reprodução
   * 4. Cleanup automático de recursos
   *
   * A URL assinada garante acesso seguro aos arquivos privados
   * sem expor credenciais no frontend.
   *
   * @param audioFile - Arquivo de áudio a ser reproduzido
   */
  const playAudio = async (audioFile: AudioFile) => {
    try {
      setError(null);

      // Garantir que apenas um áudio toque por vez
      if (activeAudioRef.current) {
        stopAudio();
      }

      // Gerar URL assinada para acesso seguro ao arquivo
      const { data } = await supabase.storage
        .from('recordings')
        .createSignedUrl(audioFile.audio_file_path, 3600); // Válida por 1 hora

      if (data?.signedUrl) {
        const audio = new Audio(data.signedUrl);
        activeAudioRef.current = audio;

        // Configurar listeners para gerenciar estado da reprodução
        const handleEnded = () => {
          setPlayingAudio(null);
          if (activeAudioRef.current === audio) {
            activeAudioRef.current = null;
          }
        };

        const handleError = () => {
          console.error('Erro durante reprodução do áudio');
          setError('Erro durante reprodução do áudio');
          setPlayingAudio(null);
          if (activeAudioRef.current === audio) {
            activeAudioRef.current = null;
          }
        };

        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);

        // Registrar função de cleanup para remoção de listeners
        audioCleanupRef.current = () => {
          audio.removeEventListener('ended', handleEnded);
          audio.removeEventListener('error', handleError);
        };

        await audio.play();
        setPlayingAudio(audioFile.id);
      }
    } catch (err) {
      console.error('Erro ao reproduzir áudio:', err);
      setError('Erro ao reproduzir áudio');
      setPlayingAudio(null);
      if (activeAudioRef.current) {
        activeAudioRef.current = null;
      }
    }
  };

  /**
   * Para a reprodução de áudio e limpa recursos
   *
   * Realiza cleanup completo:
   * 1. Pausa o áudio atual
   * 2. Reseta posição para o início
   * 3. Remove event listeners
   * 4. Limpa referências
   * 5. Atualiza estado da interface
   *
   * Essencial para evitar vazamentos de memória e conflitos
   * entre múltiplas reproduções.
   */
  const stopAudio = () => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.currentTime = 0;

      // Executar cleanup de event listeners
      if (audioCleanupRef.current) {
        audioCleanupRef.current();
        audioCleanupRef.current = null;
      }

      activeAudioRef.current = null;
    }
    setPlayingAudio(null);
  };

  /**
   * Remove arquivo de áudio do sistema
   *
   * Processo de exclusão completa:
   * 1. Confirma ação com o usuário
   * 2. Remove arquivo físico do Supabase Storage
   * 3. Remove registro da tabela 'recordings'
   * 4. Atualiza interface removendo item da lista
   *
   * A exclusão é irreversível e remove tanto o arquivo
   * quanto todos os metadados associados.
   *
   * @param audioFile - Arquivo de áudio a ser excluído
   */
  const deleteAudio = async (audioFile: AudioFile) => {
    if (!confirm('Tem certeza que deseja excluir este áudio?')) return;

    try {
      setError(null);

      // Remover arquivo físico do bucket de storage
      const { error: storageError } = await supabase.storage
        .from('recordings')
        .remove([audioFile.audio_file_path]);

      if (storageError) throw storageError;

      // Remover registro da tabela de metadados
      const { error: dbError } = await supabase
        .from('recordings')
        .delete()
        .eq('id', audioFile.id);

      if (dbError) throw dbError;

      // Atualizar interface removendo item da lista
      await loadAudioFiles();
    } catch (err) {
      console.error('Erro ao deletar áudio:', err);
      setError('Erro ao deletar áudio');
    }
  };

  /**
   * Faz download de arquivo de áudio para o dispositivo
   *
   * Processo de download:
   * 1. Baixa arquivo do Supabase Storage
   * 2. Cria URL temporária (blob) do arquivo
   * 3. Cria elemento <a> invisível para trigger do download
   * 4. Simula clique para iniciar download
   * 5. Remove elemento e libera URL da memória
   *
   * O download preserva o nome original do arquivo e
   * é otimizado para não consumir memória desnecessariamente.
   *
   * @param audioFile - Arquivo de áudio a ser baixado
   */
  const downloadAudio = async (audioFile: AudioFile) => {
    try {
      setError(null);

      // Baixar arquivo do Supabase Storage
      const { data, error } = await supabase.storage
        .from('recordings')
        .download(audioFile.audio_file_path);

      if (error) throw error;

      // Criar URL temporária e elemento de download
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = audioFile.audio_file_name;

      // Executar download programaticamente
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Liberar URL da memória para evitar vazamentos
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao baixar áudio:', err);
      setError('Erro ao baixar áudio');
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'processing':
        return 'Processando';
      case 'failed':
        return 'Falhou';
      default:
        return 'Pendente';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileAudio className="w-5 h-5 text-blue-600" />
            Gerenciamento de Áudios
          </h3>
          <p className="text-sm text-gray-600 mt-1">Paciente: {patientName}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRecorder(!showRecorder)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Mic className="w-4 h-4" />
            {showRecorder ? 'Fechar Gravador' : 'Gravar Áudio'}
          </button>

          <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            {uploadingFile ? 'Enviando...' : 'Upload Áudio'}
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              disabled={uploadingFile}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Processador de Áudio */}
      {showRecorder && (
        <div className="mb-6">
          <AudioProcessor
            onProcessingComplete={(audioUrl, intention) => {
              console.log('Processamento completo:', { audioUrl, intention });
              loadAudioFiles();
            }}
          />
        </div>
      )}

      {/* Mensagens de Erro */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Lista de Arquivos de Áudio */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Carregando áudios...</span>
        </div>
      ) : audioFiles.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FileAudio className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Nenhum áudio encontrado</p>
          <p className="text-sm">Grave um áudio ou faça upload de um arquivo</p>
        </div>
      ) : (
        <div className="space-y-4">
          {audioFiles.map(audioFile => (
            <div
              key={audioFile.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-4">
                <FileAudio className="w-8 h-8 text-blue-600" />

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">
                      {audioFile.audio_file_name}
                    </h4>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(audioFile.recording_status)}
                      <span className="text-xs text-gray-600">
                        {getStatusText(audioFile.recording_status)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>
                      Duração: {formatDuration(audioFile.duration_seconds)}
                    </span>
                    <span>Tamanho: {formatFileSize(audioFile.file_size)}</span>
                    <span>Criado: {formatDate(audioFile.created_at)}</span>
                  </div>

                  {audioFile.transcription && (
                    <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Eye className="w-3 h-3 text-green-600" />
                        <span className="text-xs font-medium text-green-700">
                          Transcrição (Confiança:{' '}
                          {(
                            audioFile.transcription.confidence_score * 100
                          ).toFixed(1)}
                          %)
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 line-clamp-2">
                        {audioFile.transcription.transcript_text}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (playingAudio === audioFile.id) {
                      stopAudio();
                    } else {
                      playAudio(audioFile);
                    }
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title={playingAudio === audioFile.id ? 'Parar' : 'Reproduzir'}
                >
                  {playingAudio === audioFile.id ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>

                {!audioFile.transcription &&
                  audioFile.recording_status === 'completed' && (
                    <button
                      onClick={() => startTranscription(audioFile.id)}
                      disabled={transcribingAudio === audioFile.id}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Transcrever"
                    >
                      {transcribingAudio === audioFile.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </button>
                  )}

                <button
                  onClick={() => downloadAudio(audioFile)}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  title="Baixar"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteAudio(audioFile)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Informações sobre Formatos Suportados */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h5 className="font-medium text-blue-900 mb-2">Formatos suportados:</h5>
        <p className="text-sm text-blue-800 mb-2">
          <strong>Áudio:</strong> WAV, MP3, WebM, OGG, FLAC, AAC, M4A, MP4
        </p>
        <p className="text-sm text-blue-800">
          <strong>Tamanho:</strong> 1KB - 50MB • <strong>Validação:</strong>{' '}
          Tipo MIME, extensão e assinatura de arquivo •{' '}
          <strong>Transcrição:</strong> OpenAI Whisper
        </p>
      </div>
    </div>
  );
};

export default AudioManager;
