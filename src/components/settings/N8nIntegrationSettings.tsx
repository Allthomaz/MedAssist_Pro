import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, RefreshCw, Webhook, Key } from 'lucide-react';
import { n8nService } from '@/services/n8nService';

interface N8nIntegrationSettingsProps {
  onSaved?: () => void;
}

export function N8nIntegrationSettings({
  onSaved,
}: N8nIntegrationSettingsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [config, setConfig] = useState({
    webhookUrl: '',
    workflowId: '',
    apiKey: '',
  });

  // Carregar configurações existentes
  useEffect(() => {
    const loadConfig = async () => {
      setLoading(true);
      try {
        // Verificar se o serviço está configurado
        if (n8nService.isConfigured()) {
          // Obter configuração atual do serviço
          // Nota: Isso é uma simulação, já que o serviço não expõe diretamente a configuração
          // Em um cenário real, você poderia ter um método getConfig() no serviço
          const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || '';
          const workflowId = import.meta.env.VITE_N8N_WORKFLOW_ID || '';
          const apiKey = import.meta.env.VITE_N8N_API_KEY || '';

          setConfig({
            webhookUrl,
            workflowId,
            apiKey,
          });
        }
      } catch (error) {
        console.error('Erro ao carregar configurações do n8n:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as configurações do n8n.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [toast]);

  // Salvar configurações
  const handleSave = async () => {
    if (!config.webhookUrl || !config.workflowId) {
      toast({
        title: 'Campos obrigatórios',
        description: 'URL do webhook e ID do workflow são obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const success = await n8nService.saveConfig({
        webhookUrl: config.webhookUrl,
        workflowId: config.workflowId,
        apiKey: config.apiKey,
      });

      if (success) {
        toast({
          title: 'Configurações salvas',
          description: 'Integração com n8n configurada com sucesso.',
          variant: 'default',
        });
        if (onSaved) onSaved();
      } else {
        throw new Error('Falha ao salvar configurações');
      }
    } catch (error) {
      console.error('Erro ao salvar configurações do n8n:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações do n8n.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Testar conexão
  const testConnection = async () => {
    if (!config.webhookUrl || !config.workflowId) {
      toast({
        title: 'Campos obrigatórios',
        description:
          'URL do webhook e ID do workflow são obrigatórios para testar a conexão.',
        variant: 'destructive',
      });
      return;
    }

    setTesting(true);
    try {
      // Criar uma configuração temporária para o teste
      const tempConfig = {
        webhookUrl: config.webhookUrl,
        workflowId: config.workflowId,
        apiKey: config.apiKey,
      };

      // Salvar temporariamente a configuração
      await n8nService.saveConfig(tempConfig);

      // Tentar acionar um workflow de teste
      const result = await n8nService.triggerTranscriptionWorkflow({
        recordingId: 'test-recording-id',
        consultationId: 'test-consultation-id',
        metadata: {
          isTest: true,
          timestamp: new Date().toISOString(),
        },
      });

      if (result.success) {
        toast({
          title: 'Conexão bem-sucedida',
          description: `Workflow ${result.workflowId} acionado com sucesso.`,
          variant: 'default',
        });
      } else {
        throw new Error(result.error || 'Falha no teste de conexão');
      }
    } catch (error) {
      console.error('Erro ao testar conexão com n8n:', error);
      toast({
        title: 'Erro na conexão',
        description:
          error instanceof Error
            ? error.message
            : 'Não foi possível conectar ao n8n.',
        variant: 'destructive',
      });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="w-5 h-5" />
            Integração com n8n
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-medical-blue" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webhook className="w-5 h-5" />
          Integração com n8n
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="webhookUrl">URL do Webhook</Label>
            <Input
              id="webhookUrl"
              placeholder="https://seu-servidor-n8n.com/webhook/seu-webhook-id"
              value={config.webhookUrl}
              onChange={e =>
                setConfig({ ...config, webhookUrl: e.target.value })
              }
            />
            <p className="text-sm text-muted-foreground">
              URL do webhook do n8n para acionar fluxos de trabalho de
              transcrição
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="workflowId">ID do Workflow</Label>
            <Input
              id="workflowId"
              placeholder="123456"
              value={config.workflowId}
              onChange={e =>
                setConfig({ ...config, workflowId: e.target.value })
              }
            />
            <p className="text-sm text-muted-foreground">
              Identificador do workflow no n8n
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="apiKey" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              Chave de API (opcional)
            </Label>
            <div className="flex">
              <Input
                id="apiKey"
                type={showApiKey ? 'text' : 'password'}
                placeholder="Chave de API do n8n"
                value={config.apiKey}
                onChange={e => setConfig({ ...config, apiKey: e.target.value })}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                className="ml-2"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? 'Ocultar' : 'Mostrar'}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Necessária para verificar o status das execuções de workflow
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            onClick={testConnection}
            disabled={testing || saving}
            className="flex items-center gap-2"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Testando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Testar Conexão
              </>
            )}
          </Button>

          <Button
            onClick={handleSave}
            disabled={testing || saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Salvar Configurações
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
