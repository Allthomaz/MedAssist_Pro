import { supabase } from '../integrations/supabase/client';

interface N8nWorkflowConfig {
  workflowId: string;
  webhookUrl: string;
  apiKey?: string;
  headers?: Record<string, string>;
}

interface N8nTranscriptionPayload {
  recordingId: string;
  consultationId: string;
  patientId?: string;
  doctorId?: string;
  audioUrl?: string;
  options?: {
    language?: string;
    prompt?: string;
    temperature?: number;
    response_format?: string;
  };
  metadata?: Record<string, any>;
}

interface N8nTranscriptionResponse {
  success: boolean;
  workflowId?: string;
  executionId?: string;
  transcription?: {
    text: string;
    confidence: number;
    language?: string;
    duration?: number;
    segments?: any[];
  };
  error?: string;
}

/**
 * Serviço para integração com n8n para automação de fluxos de trabalho
 * relacionados à transcrição de áudio e geração de relatórios médicos.
 */
class N8nService {
  private config: N8nWorkflowConfig | null = null;

  constructor() {
    this.loadConfig();
  }

  /**
   * Carrega a configuração do n8n do ambiente ou do banco de dados
   */
  private async loadConfig(): Promise<void> {
    // Primeiro tenta carregar do ambiente
    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
    const workflowId = import.meta.env.VITE_N8N_WORKFLOW_ID;
    const apiKey = import.meta.env.VITE_N8N_API_KEY;

    if (webhookUrl && workflowId) {
      this.config = {
        webhookUrl,
        workflowId,
        apiKey,
        headers: apiKey ? { 'X-N8N-API-KEY': apiKey } : {}
      };
      return;
    }

    // Se não encontrar no ambiente, tenta carregar do banco de dados
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('settings')
        .eq('key', 'n8n_integration')
        .single();

      if (error || !data) {
        console.warn('Configuração do n8n não encontrada no banco de dados');
        return;
      }

      const settings = data.settings;
      
      if (settings?.webhookUrl && settings?.workflowId) {
        this.config = {
          webhookUrl: settings.webhookUrl,
          workflowId: settings.workflowId,
          apiKey: settings.apiKey,
          headers: settings.apiKey ? { 'X-N8N-API-KEY': settings.apiKey } : {}
        };
      }
    } catch (error) {
      console.error('Erro ao carregar configuração do n8n:', error);
    }
  }

  /**
   * Verifica se o serviço n8n está configurado
   */
  public isConfigured(): boolean {
    return !!this.config?.webhookUrl && !!this.config?.workflowId;
  }

  /**
   * Salva a configuração do n8n no banco de dados
   */
  public async saveConfig(config: N8nWorkflowConfig): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          key: 'n8n_integration',
          settings: config,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Erro ao salvar configuração do n8n:', error);
        return false;
      }

      this.config = config;
      return true;
    } catch (error) {
      console.error('Erro ao salvar configuração do n8n:', error);
      return false;
    }
  }

  /**
   * Envia uma solicitação para o webhook do n8n para iniciar um fluxo de trabalho de transcrição
   */
  public async triggerTranscriptionWorkflow(
    payload: N8nTranscriptionPayload
  ): Promise<N8nTranscriptionResponse> {
    if (!this.isConfigured()) {
      await this.loadConfig();
      
      if (!this.isConfigured()) {
        return {
          success: false,
          error: 'Serviço n8n não configurado. Configure o webhook URL e workflow ID.'
        };
      }
    }

    try {
      // Preparar o payload com informações adicionais
      const enhancedPayload = {
        ...payload,
        workflowId: this.config!.workflowId,
        timestamp: new Date().toISOString(),
        source: 'doctor-brief-ai'
      };

      // Enviar para o webhook do n8n
      const response = await fetch(this.config!.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.config!.headers
        },
        body: JSON.stringify(enhancedPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro na resposta do n8n: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      return {
        success: true,
        workflowId: this.config!.workflowId,
        executionId: result.executionId || result.execution_id,
        transcription: result.transcription || result.data?.transcription
      };
    } catch (error) {
      console.error('Erro ao acionar workflow de transcrição no n8n:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido na integração com n8n'
      };
    }
  }

  /**
   * Verifica o status de uma execução de workflow no n8n
   */
  public async checkWorkflowStatus(executionId: string): Promise<any> {
    if (!this.isConfigured() || !this.config?.apiKey) {
      return {
        success: false,
        error: 'Configuração de API do n8n incompleta. Configure a API key.'
      };
    }

    try {
      // Extrair o domínio base do webhook URL
      const url = new URL(this.config.webhookUrl);
      const baseUrl = `${url.protocol}//${url.host}`;
      
      // Construir URL para a API de execuções do n8n
      const apiUrl = `${baseUrl}/api/v1/executions/${executionId}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'X-N8N-API-KEY': this.config.apiKey
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao verificar status: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao verificar status do workflow:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao verificar status'
      };
    }
  }
}

// Instância singleton do serviço
export const n8nService = new N8nService();