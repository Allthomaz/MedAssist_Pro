import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mic, Play, Square, Upload, CheckCircle } from 'lucide-react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { toast } from 'sonner';

export const SimpleTranscriptionTest: React.FC = () => {
  const [testResults, setTestResults] = useState<{
    audioRecorder: boolean;
    microphoneAccess: boolean;
    recording: boolean;
    playback: boolean;
  }>({ audioRecorder: false, microphoneAccess: false, recording: false, playback: false });

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
    cleanup
  } = useAudioRecorder({
    onRecordingComplete: (blob) => {
      console.log('Gravação concluída:', blob);
      toast.success('Gravação concluída com sucesso!');
      setTestResults(prev => ({ ...prev, recording: true }));
    },
    onError: (error) => {
      console.error('Erro na gravação:', error);
      toast.error(`Erro na gravação: ${error}`);
    }
  });

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = async () => {
    try {
      await startRecording();
      setTestResults(prev => ({ ...prev, microphoneAccess: true, audioRecorder: true }));
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      toast.error('Erro ao acessar o microfone');
    }
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handlePlayRecording = () => {
    if (recordedUrl) {
      const audio = new Audio(recordedUrl);
      audio.play().then(() => {
        setTestResults(prev => ({ ...prev, playback: true }));
        toast.success('Reprodução iniciada!');
      }).catch(error => {
        console.error('Erro na reprodução:', error);
        toast.error('Erro ao reproduzir áudio');
      });
    }
  };

  const handleClearRecording = () => {
    clearRecording();
    setTestResults({ audioRecorder: false, microphoneAccess: false, recording: false, playback: false });
    toast.info('Gravação limpa');
  };

  const simulateTranscription = () => {
    if (!recordedBlob) {
      toast.error('Nenhuma gravação disponível para transcrever');
      return;
    }

    toast.info('Simulando transcrição...');
    
    // Simula uma transcrição de teste
    setTimeout(() => {
      toast.success('Transcrição simulada: "Esta é uma transcrição de teste do áudio gravado."');
    }, 2000);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-6 w-6" />
            Teste do Sistema de Transcrição
          </CardTitle>
          <CardDescription>
            Teste das funcionalidades de gravação e transcrição de áudio médico
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status do Sistema */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              {testResults.audioRecorder ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
              )}
              <span className="text-sm">Hook de Áudio</span>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              {testResults.microphoneAccess ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
              )}
              <span className="text-sm">Microfone</span>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              {testResults.recording ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
              )}
              <span className="text-sm">Gravação</span>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              {testResults.playback ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
              )}
              <span className="text-sm">Reprodução</span>
            </div>
          </div>

          {/* Informações do Sistema */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Alert>
              <AlertDescription>
                <strong>Status do Microfone:</strong> {microphoneStatus}
              </AlertDescription>
            </Alert>
            <Alert>
              <AlertDescription>
                <strong>Tempo de Gravação:</strong> {formatTime(recordingTime)}
              </AlertDescription>
            </Alert>
            <Alert>
              <AlertDescription>
                <strong>Qualidade:</strong> {recordingQuality || 'N/A'}
              </AlertDescription>
            </Alert>
          </div>

          {/* Controles de Gravação */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleStartRecording}
              disabled={isRecording}
              variant={isRecording ? "secondary" : "default"}
              className="flex items-center gap-2"
            >
              {isRecording ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Gravando... {formatTime(recordingTime)}
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  Iniciar Gravação
                </>
              )}
            </Button>

            <Button
              onClick={handleStopRecording}
              disabled={!isRecording}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Square className="h-4 w-4" />
              Parar Gravação
            </Button>

            <Button
              onClick={handlePlayRecording}
              disabled={!recordedUrl}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Reproduzir
            </Button>

            <Button
              onClick={handleClearRecording}
              disabled={!recordedBlob && !isRecording}
              variant="outline"
              className="flex items-center gap-2"
            >
              Limpar
            </Button>
          </div>

          {/* Teste de Transcrição Simulada */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">Teste de Transcrição</h3>
            <Button
              onClick={simulateTranscription}
              disabled={!recordedBlob}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Simular Transcrição
            </Button>
          </div>

          {/* Informações de Debug */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">Informações de Debug</h3>
            <div className="bg-gray-50 p-4 rounded-lg text-sm font-mono">
              <div>Gravação ativa: {isRecording ? 'Sim' : 'Não'}</div>
              <div>Blob disponível: {recordedBlob ? 'Sim' : 'Não'}</div>
              <div>URL disponível: {recordedUrl ? 'Sim' : 'Não'}</div>
              <div>Tamanho do blob: {recordedBlob ? `${Math.round(recordedBlob.size / 1024)} KB` : 'N/A'}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleTranscriptionTest;