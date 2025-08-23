import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mic, Play, Square, Upload } from 'lucide-react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { transcriptionService } from '@/services/transcriptionService';
import { toast } from 'sonner';

interface TranscriptionResult {
  text: string;
  confidence: number;
  language?: string;
  duration?: number;
}

export const TranscriptionTest: React.FC = () => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] =
    useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const {
    isRecording,
    recordedBlob,
    recordedUrl,
    recordingTime,
    microphoneStatus,
    recordingQuality,
    startRecording,
    stopRecording,
    clearRecording,
  } = useAudioRecorder({
    onRecordingComplete: blob => {
      console.log('Gravação concluída:', blob);
      toast.success('Gravação concluída com sucesso!');
    },
    onError: error => {
      console.error('Erro na gravação:', error);
      toast.error(`Erro na gravação: ${error}`);
      setError(error);
    },
  });

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        setAudioFile(file);
        setError(null);
        toast.success('Arquivo de áudio carregado!');
      } else {
        setError('Por favor, selecione um arquivo de áudio válido.');
        toast.error('Formato de arquivo inválido!');
      }
    }
  };

  const testTranscription = async (audioSource: File | Blob) => {
    setIsTranscribing(true);
    setError(null);
    setTranscriptionResult(null);

    try {
      console.log('Iniciando transcrição...', audioSource);

      const result = await transcriptionService.transcribeWithOpenAI(
        audioSource,
        {
          language: 'pt',
          response_format: 'verbose_json',
          temperature: 0.2,
          prompt:
            'Transcrição de consulta médica em português brasileiro. Inclua termos médicos e sintomas mencionados pelo paciente.',
        }
      );

      console.log('Resultado da transcrição:', result);
      setTranscriptionResult(result);
      toast.success('Transcrição concluída com sucesso!');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro desconhecido na transcrição';
      console.error('Erro na transcrição:', err);
      setError(errorMessage);
      toast.error(`Erro na transcrição: ${errorMessage}`);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleTranscribeRecording = () => {
    if (recordedBlob) {
      testTranscription(recordedBlob);
    }
  };

  const handleTranscribeFile = () => {
    if (audioFile) {
      testTranscription(audioFile);
    }
  };

  const playAudio = () => {
    if (recordedUrl) {
      const audio = new Audio(recordedUrl);
      audio.play().catch(err => {
        console.error('Erro ao reproduzir áudio:', err);
        toast.error('Erro ao reproduzir áudio');
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Teste de Transcrição de Áudio Médico
          </CardTitle>
          <CardDescription>
            Teste o sistema de transcrição usando OpenAI Whisper para áudios
            médicos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status do Microfone */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status do Microfone:</span>
            <span
              className={`text-sm px-2 py-1 rounded ${
                microphoneStatus === MicrophoneStatus.Granted
                  ? 'bg-green-100 text-green-800'
                  : microphoneStatus === 'denied'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {microphoneStatus === MicrophoneStatus.Granted
                ? 'Permitido'
                : microphoneStatus === 'denied'
                  ? 'Negado'
                  : 'Verificando...'}
            </span>
          </div>

          {/* Seção de Gravação */}
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold">Gravar Novo Áudio</h3>

            <div className="flex items-center gap-4">
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? 'destructive' : 'default'}
                disabled={microphoneStatus !== MicrophoneStatus.Granted}
              >
                {isRecording ? (
                  <>
                    <Square className="h-4 w-4 mr-2" /> Parar (
                    {formatTime(recordingTime)})
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" /> Gravar
                  </>
                )}
              </Button>

              {recordedUrl && (
                <>
                  <Button onClick={playAudio} variant="outline">
                    <Play className="h-4 w-4 mr-2" /> Reproduzir
                  </Button>
                  <Button onClick={clearRecording} variant="outline">
                    Limpar
                  </Button>
                  <Button
                    onClick={handleTranscribeRecording}
                    disabled={isTranscribing}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isTranscribing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />{' '}
                        Transcrevendo...
                      </>
                    ) : (
                      <>Transcrever Gravação</>
                    )}
                  </Button>
                </>
              )}
            </div>

            {recordingQuality && (
              <div className="text-sm text-gray-600">
                Qualidade: {recordingQuality}
              </div>
            )}
          </div>

          {/* Seção de Upload */}
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold">Upload de Arquivo de Áudio</h3>

            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button variant="outline" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" /> Selecionar Arquivo
                  </span>
                </Button>
              </label>

              {audioFile && (
                <>
                  <span className="text-sm text-gray-600">
                    {audioFile.name} (
                    {(audioFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                  <Button
                    onClick={handleTranscribeFile}
                    disabled={isTranscribing}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isTranscribing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />{' '}
                        Transcrevendo...
                      </>
                    ) : (
                      <>Transcrever Arquivo</>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Resultado da Transcrição */}
          {transcriptionResult && (
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">
                  Resultado da Transcrição
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <strong>Texto:</strong>
                  <p className="mt-1 p-3 bg-white rounded border text-sm">
                    {transcriptionResult.text}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Confiança:</strong>{' '}
                    {(transcriptionResult.confidence * 100).toFixed(1)}%
                  </div>
                  {transcriptionResult.language && (
                    <div>
                      <strong>Idioma:</strong> {transcriptionResult.language}
                    </div>
                  )}
                  {transcriptionResult.duration && (
                    <div>
                      <strong>Duração:</strong>{' '}
                      {transcriptionResult.duration.toFixed(1)}s
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Erro */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                <strong>Erro:</strong> {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Informações de Configuração */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800 text-sm">
                Informações de Configuração
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>
                <strong>OpenAI API Key:</strong>{' '}
                {import.meta.env['VITE_OPENAI_API_KEY']
                  ? `Configurada (${import.meta.env['VITE_OPENAI_API_KEY'].substring(0, 10)}...)`
                  : 'Não configurada - Configure VITE_OPENAI_API_KEY no .env'}
              </div>
              <div>
                <strong>Supabase URL:</strong>{' '}
                {import.meta.env['VITE_SUPABASE_URL'] || 'Não configurada'}
              </div>
              <div>
                <strong>Formatos Suportados:</strong> audio/webm, audio/mp4,
                audio/wav, audio/mp3
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default TranscriptionTest;
