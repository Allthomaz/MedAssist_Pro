import React, { useState, useRef, useEffect } from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  Download,
  Trash2,
  FileAudio,
  Loader2
} from 'lucide-react';
import { transcribeAudio, saveTranscription } from '../../services/transcriptionService';

interface AudioRecorderProps {
  consultationId: string;
  onRecordingComplete?: (recordingId: string) => void;
  onTranscriptionComplete?: (transcriptionId: string, text: string) => void;
}

interface Recording {
  id: string;
  audio_file_name: string;
  audio_file_size: number;
  audio_duration: number;
  recording_status: 'recording' | 'completed' | 'processing';
  created_at: string;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  consultationId,
  onRecordingComplete,
  onTranscriptionComplete
}) => {
  const [recordingTime, setRecordingTime] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState<string>('');
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchRecordings();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (currentAudioUrl) {
        URL.revokeObjectURL(currentAudioUrl);
      }
    };
  }, [consultationId]);

  const fetchRecordings = async () => {
    try {
      const { data, error } = await supabase
        .from('recordings')
        .select('*')
        .eq('consultation_id', consultationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecordings((data || []).map(record => ({
        id: record.id,
        audio_file_name: record.audio_file_name,
        audio_file_size: record.audio_file_size || 0,
        audio_duration: record.audio_duration || 0,
        recording_status: (record.recording_status as 'recording' | 'completed' | 'processing') || 'completed',
        created_at: record.created_at
      })));
    } catch (err) {
      console.error('Erro ao buscar gravações:', err);
    }
  };

  // Função para iniciar o timer de gravação
  const startTimer = () => {
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  // Função para parar o timer
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };



  const saveRecording = async (audioBlob: Blob, audioUrl: string) => {
    if (!audioBlob) return;

    try {
      setIsUploading(true);
      setError(null);

      // Gerar nome único para o arquivo
      const fileName = `recording_${consultationId}_${Date.now()}.webm`;
      
      // Upload do arquivo para o Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recordings')
        .upload(fileName, audioBlob, {
          contentType: 'audio/webm'
        });

      if (uploadError) throw uploadError;

      // Salvar metadados no banco
      const { data: recordingData, error: recordingError } = await supabase
        .from('recordings')
        .insert({
          consultation_id: consultationId,
          doctor_id: (await supabase.auth.getUser()).data.user?.id,
          recording_name: fileName,
          audio_file_name: fileName,
          audio_url: uploadData.path,
          file_size: audioBlob.size,
          duration: recordingTime,
          status: 'completed'
        })
        .select()
        .single();

      if (recordingError) throw recordingError;

      // Limpar estado local
      setCurrentAudioUrl(null);
      setRecordingTime(0);
      
      // Atualizar lista de gravações
      await fetchRecordings();
      
      // Callback para notificar componente pai
      if (onRecordingComplete) {
        onRecordingComplete(recordingData.id);
      }

      // Iniciar transcrição automática
      await startTranscription(recordingData.id);

    } catch (err) {
      console.error('Erro ao salvar gravação:', err);
      setError('Erro ao salvar gravação. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const startTranscription = async (recordingId: string) => {
    try {
      setIsTranscribing(true);
      setError(null);

      // Usar o novo serviço de transcrição
      const result = await transcribeAudio(recordingId, {
        language: 'pt',
        response_format: 'verbose_json'
      });

      if (result.error) {
        throw new Error(result.error);
      }

      // Salvar transcrição usando o serviço
      const transcriptionData = await saveTranscription({
        recordingId,
        consultationId,
        transcriptText: result.transcription,
        confidenceScore: result.confidence || 0.95,
        languageDetected: result.language || 'pt',
        wordCount: result.transcription.split(/\s+/).length,
        transcriptionService: 'openai'
      });

      setTranscriptionText(result.transcription);
      
      // Callback para notificar componente pai
      if (onTranscriptionComplete) {
        onTranscriptionComplete(transcriptionData.id, result.transcription);
      }

    } catch (err) {
      console.error('Erro na transcrição:', err);
      setError('Erro na transcrição automática. A gravação foi salva.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const deleteRecording = async (recordingId: string, filePath: string) => {
    try {
      // Deletar arquivo do storage
      const { error: storageError } = await supabase.storage
        .from('recordings')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Deletar registro do banco
      const { error: dbError } = await supabase
        .from('recordings')
        .delete()
        .eq('id', recordingId);

      if (dbError) throw dbError;

      // Atualizar lista
      await fetchRecordings();

    } catch (err) {
      console.error('Erro ao deletar gravação:', err);
      setError('Erro ao deletar gravação.');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Controles de Gravação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-medical-blue" />
            Gravação de Áudio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Controles de Gravação com ReactMediaRecorder */}
          <ReactMediaRecorder
            audio
            onStart={() => {
              startTimer();
              setError(null);
            }}
            onStop={(blobUrl, blob) => {
              stopTimer();
              setCurrentAudioUrl(blobUrl);
              // Salvar automaticamente após parar a gravação
              if (blob) {
                saveRecording(blob, blobUrl);
              }
            }}
            render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
              <div className="space-y-4">
                {/* Status da Gravação */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {status === 'recording' && (
                      <Badge className="bg-red-100 text-red-700 border-red-200">
                        Gravando
                      </Badge>
                    )}
                    
                    <div className="text-2xl font-mono font-bold text-medical-blue">
                      {formatTime(recordingTime)}
                    </div>
                  </div>

                  {status === 'recording' && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-muted-foreground">REC</span>
                    </div>
                  )}
                </div>

                {/* Controles de Gravação */}
                <div className="flex items-center gap-3">
                  {status === 'idle' && (
                    <Button
                      onClick={startRecording}
                      className="gap-2"
                      variant="medical"
                      disabled={isUploading || isTranscribing}
                    >
                      <Mic className="w-4 h-4" />
                      Iniciar Gravação
                    </Button>
                  )}
                  
                  {status === 'recording' && (
                    <>
                      <div className="flex items-center gap-2 text-red-600">
                        <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                        <span className="font-medium">Gravando... {formatTime(recordingTime)}</span>
                      </div>
                      
                      <Button onClick={stopRecording} variant="destructive" className="gap-2">
                        <Square className="w-4 h-4" />
                        Parar Gravação
                      </Button>
                    </>
                  )}
                  
                  {status === 'stopped' && mediaBlobUrl && (
                    <div className="text-green-600 font-medium">
                      ✓ Gravação concluída e salva automaticamente
                    </div>
                  )}
                </div>

                {/* Preview do Áudio Gravado */}
                {mediaBlobUrl && (
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Última Gravação</h4>
                      <div className="text-sm text-muted-foreground">
                        {formatTime(recordingTime)}
                      </div>
                    </div>
                    
                    <audio
                      src={mediaBlobUrl}
                      className="w-full"
                      controls
                    />
                  </div>
                )}
              </div>
            )}
          />

          {/* Status da Transcrição */}
          {isTranscribing && (
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">Transcrevendo áudio...</span>
              </div>
              <Progress value={undefined} className="w-full" />
            </div>
          )}

          {/* Texto da Transcrição */}
          {transcriptionText && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Transcrição:</h4>
              <p className="text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded">
                {transcriptionText}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Gravações Existentes */}
      {recordings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileAudio className="w-5 h-5 text-medical-blue" />
              Gravações da Consulta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recordings.map((recording) => (
                <div key={recording.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileAudio className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{recording.audio_file_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(recording.audio_file_size)} • {formatTime(recording.audio_duration)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={
                        recording.recording_status === 'completed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }
                    >
                      {recording.recording_status === 'completed' ? 'Concluída' : 'Processando'}
                    </Badge>
                    
                    <Button
                      onClick={() => deleteRecording(recording.id, recording.audio_file_name)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};