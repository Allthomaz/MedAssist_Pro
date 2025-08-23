import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import * as Sentry from '@sentry/react';

export function SentryTest() {
  const [testResult, setTestResult] = useState<string | null>(null);

  const testSentryIntegration = () => {
    try {
      // Força um erro para testar o Sentry
      const testError = new Error(
        '🧪 Teste de integração do Sentry - Este erro é intencional para validar a configuração'
      );

      // Adiciona contexto extra para o erro
      Sentry.withScope(scope => {
        scope.setTag('test', 'sentry-integration');
        scope.setLevel('error');
        scope.setContext('test_info', {
          timestamp: new Date().toISOString(),
          user_action: 'manual_sentry_test',
          environment: import.meta.env.MODE,
        });

        // Captura o erro no Sentry
        Sentry.captureException(testError);
      });

      // Também lança o erro para o console
      throw testError;
    } catch (error) {
      console.error('🔍 Erro capturado e enviado para o Sentry:', error);
      setTestResult(
        '✅ Erro enviado para o Sentry! Verifique o painel do Sentry em alguns segundos.'
      );

      // Limpa a mensagem após 10 segundos
      setTimeout(() => setTestResult(null), 10000);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Teste do Sentry
        </CardTitle>
        <CardDescription>
          Clique no botão para testar se o Sentry está capturando erros
          corretamente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={testSentryIntegration}
          variant="outline"
          className="w-full"
        >
          🧪 Testar Integração do Sentry
        </Button>

        {testResult && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700">{testResult}</span>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>
            <strong>📋 Instruções de Teste:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1 mt-2">
            <li>Clique no botão "Testar Integração do Sentry"</li>
            <li>Verifique o console do navegador (F12)</li>
            <li>Acesse o painel do Sentry (sentry.io) em 30-60 segundos</li>
            <li>Procure pelo erro com tag "test: sentry-integration"</li>
            <li>
              <strong>IMPORTANTE:</strong> Remova este componente após confirmar
              que funciona
            </li>
          </ol>

          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
            <p>
              <strong>⚠️ Lembrete:</strong> Este é um componente temporário
              apenas para teste. Remova-o após validar a integração.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
