import React, { useState, useRef, useEffect } from 'react';
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

interface AudioRecorderProps {
  consultationId: string;
  onRecordingComplete?: (recordingId: string) => void;
  onTranscriptionComplete?: (transcriptionId: string, text: string) => void;
}

interface Recording {
  id: string;
  file_name: string;
  file_size: number;
  duration: number;
  status: 'recording' | 'completed' | 'processing';
  created_at: string;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  consultationId,
  onRecordingComplete,
  onTranscriptionComplete
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState<string>('');
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchRecordings();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
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
      setRecordings(data || []);
    } catch (err) {
      console.error('Erro ao buscar gravações:', err);
    }
  };

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Parar todas as faixas de áudio
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000); // Capturar dados a cada segundo
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);

      // Iniciar timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Erro ao iniciar gravação:', err);
      setError('Erro ao acessar o microfone. Verifique as permissões.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const saveRecording = async () => {
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
          file_name: fileName,
          file_path: uploadData.path,
          file_size: audioBlob.size,
          duration: recordingTime,
          status: 'completed'
        })
        .select()
        .single();

      if (recordingError) throw recordingError;

      // Limpar estado local
      setAudioBlob(null);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
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

      // Chamar função do Supabase para transcrição
      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: { recordingId }
      });

      if (error) throw error;

      // Salvar transcrição no banco
      const { data: transcriptionData, error: transcriptionError } = await supabase
        .from('transcriptions')
        .insert({
          recording_id: recordingId,
          transcription_text: data.transcription,
          confidence_score: data.confidence || 0.95,
          status: 'completed'
        })
        .select()
        .single();

      if (transcriptionError) throw transcriptionError;

      setTranscriptionText(data.transcription);
      
      // Callback para notificar componente pai
      if (onTranscriptionComplete) {
        onTranscriptionComplete(transcriptionData.id, data.transcription);
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

          {/* Status da Gravação */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isRecording && (
                <Badge className="bg-red-100 text-red-700 border-red-200">
                  {isPaused ? 'Pausado' : 'Gravando'}
                </Badge>
              )}
              
              <div className="text-2xl font-mono font-bold text-medical-blue">
                {formatTime(recordingTime)}
              </div>
            </div>

            {isRecording && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">REC</span>
              </div>
            )}
          </div>

          {/* Controles */}
          <div className="flex items-center gap-2">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                className="gap-2"
                variant="medical"
                disabled={isUploading || isTranscribing}
              >
                <Mic className="w-4 h-4" />
                Iniciar Gravação
              </Button>
            ) : (
              <>
                {!isPaused ? (
                  <Button onClick={pauseRecording} variant="outline" className="gap-2">
                    <Pause className="w-4 h-4" />
                    Pausar
                  </Button>
                ) : (
                  <Button onClick={resumeRecording} variant="outline" className="gap-2">
                    <Play className="w-4 h-4" />
                    Continuar
                  </Button>
                )}
                
                <Button onClick={stopRecording} variant="destructive" className="gap-2">
                  <Square className="w-4 h-4" />
                  Parar
                </Button>
              </>
            )}
          </div>

          {/* Preview do Áudio Gravado */}
          {audioBlob && audioUrl && (
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Gravação Concluída</h4>
                <div className="text-sm text-muted-foreground">
                  {formatFileSize(audioBlob.size)} • {formatTime(recordingTime)}
                </div>
              </div>
              
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="w-full"
                controls
              />
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={saveRecording}
                  disabled={isUploading || isTranscribing}
                  className="gap-2"
                  variant="medical"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  {isUploading ? 'Salvando...' : 'Salvar Gravação'}
                </Button>
                
                <Button
                  onClick={() => {
                    setAudioBlob(null);
                    if (audioUrl) {
                      URL.revokeObjectURL(audioUrl);
                      setAudioUrl(null);
                    }
                    setRecordingTime(0);
                  }}
                  variant="outline"
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Descartar
                </Button>
              </div>
            </div>
          )}

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
                      <p className="font-medium">{recording.file_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(recording.file_size)} • {formatTime(recording.duration)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={
                        recording.status === 'completed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }
                    >
                      {recording.status === 'completed' ? 'Concluída' : 'Processando'}
                    </Badge>
                    
                    <Button
                      onClick={() => deleteRecording(recording.id, recording.file_name)}
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