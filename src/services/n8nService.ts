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
  metadata?: Record<string, unknown>;
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
    segments?: Array<{
      start: number;
      end: number;
      text: string;
      confidence: number;
    }>;
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
        headers: apiKey ? { 'X-N8N-API-KEY': apiKey } : {},
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
          headers: settings.apiKey ? { 'X-N8N-API-KEY': settings.apiKey } : {},
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
      const { error } = await supabase.from('system_settings').upsert({
        key: 'n8n_integration',
        settings: config,
        updated_at: new Date().toISOString(),
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
   *
   * Esta função implementa a integração com n8n para automação de workflows de transcrição:
   * 1. Verifica se o serviço está configurado (webhook URL e workflow ID)
   * 2. Enriquece o payload com metadados adicionais (timestamp, source, workflowId)
   * 3. Envia requisição HTTP POST para o webhook do n8n
   * 4. Processa a resposta e extrai informações de execução
   * 5. Retorna resultado estruturado com dados da transcrição ou erro
   *
   * O n8n permite criar workflows visuais que podem processar áudio,
   * chamar APIs de transcrição e executar lógicas complexas de forma automatizada.
   */
  public async triggerTranscriptionWorkflow(
    payload: N8nTranscriptionPayload
  ): Promise<N8nTranscriptionResponse> {
    // Verificação de configuração com tentativa de recarregamento
    if (!this.isConfigured()) {
      await this.loadConfig();

      if (!this.isConfigured()) {
        return {
          success: false,
          error:
            'Serviço n8n não configurado. Configure o webhook URL e workflow ID.',
        };
      }
    }

    try {
      // Enriquecimento do payload com metadados para rastreabilidade
      // Adiciona informações de contexto que o workflow n8n pode usar
      const enhancedPayload = {
        ...payload,
        workflowId: this.config!.workflowId,
        timestamp: new Date().toISOString(),
        source: 'doctor-brief-ai',
      };

      // Execução da requisição HTTP para o webhook do n8n
      // O webhook é o ponto de entrada para iniciar o workflow
      const response = await fetch(this.config!.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.config!.headers, // Inclui API key se configurada
        },
        body: JSON.stringify(enhancedPayload),
      });

      // Validação da resposta HTTP
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Erro na resposta do n8n: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();

      // Normalização da resposta do n8n
      // Diferentes versões do n8n podem retornar campos com nomes ligeiramente diferentes
      return {
        success: true,
        workflowId: this.config!.workflowId,
        executionId: result.executionId || result.execution_id,
        transcription: result.transcription || result.data?.transcription,
      };
    } catch (error) {
      console.error('Erro ao acionar workflow de transcrição no n8n:', error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Erro desconhecido na integração com n8n',
      };
    }
  }

  /**
   * Verifica o status de uma execução de workflow no n8n
   *
   * Esta função implementa o monitoramento de execuções de workflow:
   * 1. Valida se a configuração inclui API key (necessária para acessar a API REST)
   * 2. Constrói a URL da API REST do n8n a partir do webhook URL
   * 3. Faz requisição GET para o endpoint de execuções
   * 4. Retorna informações detalhadas sobre o status da execução
   *
   * Permite acompanhar o progresso de workflows longos e verificar
   * se a transcrição foi concluída com sucesso.
   */
  public async checkWorkflowStatus(executionId: string): Promise<{
    success: boolean;
    status: string;
    data?: unknown;
    error?: string;
  }> {
    // Validação de pré-requisitos para acesso à API REST
    if (!this.isConfigured() || !this.config?.apiKey) {
      return {
        success: false,
        error: 'Configuração de API do n8n incompleta. Configure a API key.',
      };
    }

    try {
      // Construção da URL base da API a partir do webhook URL
      // O webhook URL geralmente é algo como: https://n8n.example.com/webhook/...
      // A API REST fica em: https://n8n.example.com/api/v1/...
      const url = new URL(this.config.webhookUrl);
      const baseUrl = `${url.protocol}//${url.host}`;

      // Montagem da URL específica para consultar a execução
      const apiUrl = `${baseUrl}/api/v1/executions/${executionId}`;

      // Requisição autenticada para a API REST do n8n
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'X-N8N-API-KEY': this.config.apiKey, // Autenticação via API key
        },
      });

      // Validação da resposta da API
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Erro ao verificar status: ${response.status} - ${errorText}`
        );
      }

      // Retorna os dados completos da execução (status, dados, logs, etc.)
      return await response.json();
    } catch (error) {
      console.error('Erro ao verificar status do workflow:', error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Erro desconhecido ao verificar status',
      };
    }
  }
}

// Instância singleton do serviço
export const n8nService = new N8nService();
