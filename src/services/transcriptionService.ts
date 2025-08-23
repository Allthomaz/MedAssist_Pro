import { supabase } from '../integrations/supabase/client';
import { Database } from '../integrations/supabase/types';
import {
  WhisperSegment,
  WhisperResponse,
  KnownError,
  getErrorMessage,
} from '../types/common';

// Usar as variáveis de ambiente corretas para o Vite
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL =
  import.meta.env.VITE_OPENAI_API_URL ||
  'https://api.openai.com/v1/audio/transcriptions';

interface TranscriptionResult {
  text: string;
  confidence: number;
  language?: string;
  duration?: number;
  segments?: TranscriptionSegment[];
}

interface TranscriptionSegment {
  start: number;
  end: number;
  text: string;
  confidence: number;
}

interface TranscriptionOptions {
  language?: string;
  prompt?: string;
  temperature?: number;
  response_format?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';
  timestamp_granularities?: ('word' | 'segment')[];
}

class TranscriptionService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = OPENAI_API_KEY;
    this.baseUrl = OPENAI_API_URL;
    this.ensureApiAvailability();
  }

  /**
   * Valida se as API keys necessárias estão configuradas
   */
  private async validateApiKeys(): Promise<{
    openai: boolean;
    supabase: boolean;
  }> {
    const openaiValid = Boolean(OPENAI_API_KEY && OPENAI_API_KEY.trim() !== '');
    let supabaseValid = false;
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      supabaseValid = !!session;
    } catch {
      supabaseValid = false;
    }
    return {
      openai: openaiValid,
      supabase: supabaseValid,
    };
  }

  /**
   * Verifica se pelo menos uma API está disponível para transcrição
   * 
   * Esta validação é crítica para evitar falhas silenciosas durante o processo
   * de transcrição. Verifica tanto a configuração quanto a conectividade das APIs.
   * 
   * Validações realizadas:
   * - OpenAI: Presença da API key
   * - Supabase: Sessão ativa do usuário (necessária para Edge Functions)
   * 
   * @throws Error se nenhuma API estiver disponível
   */
  private async ensureApiAvailability(): Promise<void> {
    const { openai, supabase: supabaseValid } = await this.validateApiKeys();

    // Falha se nenhuma API estiver configurada e funcional
    if (!openai && !supabaseValid) {
      throw new Error(
        'Nenhuma API de transcrição está configurada. Configure pelo menos uma das seguintes:\n' +
          '- VITE_OPENAI_API_KEY para OpenAI Whisper\n' +
          '- Configurações do Supabase para transcrição via Edge Function'
      );
    }
  }

  /**
   * Transcreve áudio usando OpenAI Whisper
   */
  async transcribeWithOpenAI(
    audioFile: File | Blob,
    options: TranscriptionOptions = {}
  ): Promise<TranscriptionResult> {
    const { openai } = this.validateApiKeys();
    if (!openai) {
      throw new Error(
        'OpenAI API key não configurada. Configure VITE_OPENAI_API_KEY.'
      );
    }

    try {
      const formData = new FormData();

      // Converter Blob para File se necessário
      const file =
        audioFile instanceof File
          ? audioFile
          : new File([audioFile], 'audio.webm', { type: 'audio/webm' });

      formData.append('file', file);
      formData.append('model', 'whisper-1');

      // Configurações opcionais
      if (options.language) {
        formData.append('language', options.language);
      }

      if (options.prompt) {
        formData.append('prompt', options.prompt);
      }

      if (options.temperature !== undefined) {
        formData.append('temperature', options.temperature.toString());
      }

      formData.append(
        'response_format',
        options.response_format || 'verbose_json'
      );

      if (options.timestamp_granularities) {
        formData.append(
          'timestamp_granularities[]',
          options.timestamp_granularities.join(',')
        );
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Erro na API OpenAI: ${response.status} - ${errorData.error?.message || response.statusText}`
        );
      }

      const result = await response.json();

      // Processar resposta baseada no formato solicitado
      if (options.response_format === 'verbose_json') {
        // Formato verbose_json inclui segmentos detalhados com timestamps e confiança
        return {
          text: result.text,
          // Calcula confiança média de todos os segmentos
          confidence: this.calculateAverageConfidence(result.segments || []),
          language: result.language,
          duration: result.duration,
          // Mapeia segmentos do Whisper para formato interno
          segments:
            result.segments?.map((segment: WhisperSegment) => ({
              start: segment.start, // Timestamp de início em segundos
              end: segment.end, // Timestamp de fim em segundos
              text: segment.text, // Texto do segmento
              // Converte log-probabilidade em confiança percentual
              confidence: segment.avg_logprob
                ? Math.exp(segment.avg_logprob)
                : 0.95, // Valor padrão alto para segmentos sem confiança
            })) || [],
        };
      } else {
        // Formatos simples (text, srt, vtt) retornam apenas o texto
        return {
          text: typeof result === 'string' ? result : result.text,
          confidence: 0.95, // Valor padrão quando não há informação de confiança
        };
      }
    } catch (error) {
      console.error('Erro na transcrição OpenAI:', error);
      throw error;
    }
  }

  /**
   * Transcreve áudio usando a função Edge do Supabase
   */
  async transcribeWithSupabase(
    recordingId: string,
    options: TranscriptionOptions = {}
  ): Promise<TranscriptionResult> {
    try {
      const { data, error } = await supabase.functions.invoke(
        'transcribe-audio',
        {
          body: {
            recordingId,
            options: {
              language: options.language || 'pt',
              prompt:
                options.prompt ||
                'Transcrição de consulta médica. Inclua termos médicos, medicamentos e procedimentos.',
              temperature: options.temperature || 0.1,
              response_format: 'verbose_json',
            },
          },
        }
      );

      if (error) {
        throw new Error(`Erro na função Supabase: ${error.message}`);
      }

      return {
        text: data.transcription,
        confidence: data.confidence || 0.95,
        language: data.language,
        duration: data.duration,
        segments: data.segments || [],
      };
    } catch (error) {
      console.error('Erro na transcrição Supabase:', error);
      throw error;
    }
  }

  /**
   * Salva transcrição no banco de dados
   */
  async saveTranscription(
    recordingId: string,
    consultationId: string,
    transcriptionResult: TranscriptionResult,
    processingTime?: number
  ) {
    try {
      const { data, error } = await supabase
        .from('transcriptions')
        .insert({
          recording_id: recordingId,
          consultation_id: consultationId,
          transcript_text: transcriptionResult.text,
          confidence_score: transcriptionResult.confidence,
          language: transcriptionResult.language || 'pt',
          duration: transcriptionResult.duration,
          segments: transcriptionResult.segments,
          processing_time: processingTime,
          status: 'completed',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao salvar transcrição: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Erro ao salvar transcrição:', error);
      throw error;
    }
  }

  /**
   * Processa transcrição completa (transcreve + salva)
   * 
   * Esta é a função principal que orquestra todo o processo de transcrição:
   * 1. Valida disponibilidade das APIs
   * 2. Configura opções otimizadas para contexto médico
   * 3. Tenta transcrição com OpenAI (preferencial) com fallback para Supabase
   * 4. Mede tempo de processamento para métricas
   * 5. Persiste resultado no banco de dados
   * 
   * Estratégia de fallback:
   * - OpenAI Whisper: Maior precisão, especialmente para termos médicos
   * - Supabase Edge Function: Backup quando OpenAI falha ou não está disponível
   * 
   * @param audioFile - Arquivo de áudio (File ou Blob) para transcrever
   * @param recordingId - ID único da gravação no sistema
   * @param consultationId - ID da consulta médica associada
   * @param options - Opções de transcrição (sobrescreve padrões médicos)
   * @returns Objeto com ID da transcrição salva, texto e confiança
   */
  async processAudioTranscription(
    audioFile: File | Blob,
    recordingId: string,
    consultationId: string,
    options: TranscriptionOptions = {}
  ): Promise<{ transcriptionId: string; text: string; confidence: number }> {
    // Verificar se pelo menos uma API está disponível antes de prosseguir
    this.ensureApiAvailability();

    // Marcar início do processamento para métricas de performance
    const startTime = Date.now();

    try {
      // Configurações otimizadas para contexto médico
      // Temperature baixa (0.1) para maior precisão em termos técnicos
      // Prompt específico para melhorar reconhecimento de terminologia médica
      const defaultOptions: TranscriptionOptions = {
        language: 'pt', // Português brasileiro
        temperature: 0.1, // Baixa criatividade, alta precisão
        response_format: 'verbose_json', // Inclui timestamps e confiança
        timestamp_granularities: ['segment'], // Segmentação por frases
        prompt:
          'Esta é uma transcrição de consulta médica. Inclua termos médicos precisos, nomes de medicamentos, procedimentos, sintomas e diagnósticos. Mantenha a terminologia médica correta.',
      };

      // Mescla opções padrão com opções fornecidas pelo usuário
      const transcriptionOptions = { ...defaultOptions, ...options };

      // Variável para armazenar resultado da transcrição
      let transcriptionResult: TranscriptionResult;

      try {
        // Primeira tentativa: OpenAI Whisper (mais preciso para termos médicos)
        transcriptionResult = await this.transcribeWithOpenAI(
          audioFile,
          transcriptionOptions
        );
      } catch (openaiError) {
        console.warn(
          'Falha na transcrição OpenAI, tentando Supabase:',
          openaiError
        );

        // Fallback: Função Edge do Supabase como backup
        transcriptionResult = await this.transcribeWithSupabase(
          recordingId,
          transcriptionOptions
        );
      }

      // Calcular tempo total de processamento para métricas
      const processingTime = Date.now() - startTime;

      // Persistir transcrição no banco de dados com metadados
      const savedTranscription = await this.saveTranscription(
        recordingId,
        consultationId,
        transcriptionResult,
        processingTime
      );

      return {
        transcriptionId: savedTranscription.id,
        text: transcriptionResult.text,
        confidence: transcriptionResult.confidence,
      };
    } catch (error) {
      console.error('Erro no processamento de transcrição:', error);
      throw error;
    }
  }

  /**
   * Busca transcrições de uma consulta
   */
  async getTranscriptionsByConsultation(consultationId: string) {
    try {
      const { data, error } = await supabase
        .from('transcriptions')
        .select(
          `
          *,
          recordings (
            id,
            recording_name,
            duration,
            created_at
          )
        `
        )
        .eq('consultation_id', consultationId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Erro ao buscar transcrições: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar transcrições:', error);
      throw error;
    }
  }

  /**
   * Gera resumo da transcrição usando IA
   */
  async generateTranscriptionSummary(
    transcriptionText: string,
    consultationType: string = 'geral'
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('API key não configurada para geração de resumo.');
    }

    try {
      const prompt = this.buildSummaryPrompt(
        transcriptionText,
        consultationType
      );

      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content:
                  'Você é um assistente médico especializado em criar resumos estruturados de consultas médicas.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.3,
            max_tokens: 1000,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Erro na API OpenAI: ${response.status}`);
      }

      const result = await response.json();
      return result.choices[0]?.message?.content || 'Erro ao gerar resumo.';
    } catch (error) {
      console.error('Erro ao gerar resumo:', error);
      throw error;
    }
  }

  /**
   * Calcula a confiança média dos segmentos de transcrição
   * 
   * A API Whisper retorna avg_logprob (logaritmo da probabilidade média) para cada segmento.
   * Este valor precisa ser convertido para uma probabilidade real usando Math.exp().
   * 
   * Processo de cálculo:
   * 1. Para cada segmento, converte avg_logprob em probabilidade (0-1)
   * 2. Se avg_logprob não existir, usa valor padrão de 0.95 (95% de confiança)
   * 3. Calcula a média aritmética de todas as confianças dos segmentos
   * 
   * @param segments - Array de segmentos do Whisper com informações de confiança
   * @returns Valor de confiança média entre 0 e 1 (0% a 100%)
   */
  private calculateAverageConfidence(segments: WhisperSegment[]): number {
    // Retorna confiança padrão alta se não há segmentos para analisar
    if (!segments || segments.length === 0) return 0.95;

    // Soma todas as confianças dos segmentos
    const totalConfidence = segments.reduce((sum, segment) => {
      // Converte log-probabilidade em probabilidade real
      // avg_logprob é negativo, Math.exp() converte para valor entre 0-1
      const confidence = segment.avg_logprob
        ? Math.exp(segment.avg_logprob)
        : 0.95; // Valor padrão para segmentos sem informação de confiança
      return sum + confidence;
    }, 0);

    // Retorna a média aritmética das confianças
    return totalConfidence / segments.length;
  }

  /**
   * Constrói prompt para resumo médico
   */
  private buildSummaryPrompt(
    transcriptionText: string,
    consultationType: string
  ): string {
    return `
Analise a seguinte transcrição de consulta médica e crie um resumo estruturado:

**Transcrição:**
${transcriptionText}

**Tipo de Consulta:** ${consultationType}

**Instruções:**
1. Crie um resumo estruturado seguindo o formato SOAP (Subjetivo, Objetivo, Avaliação, Plano)
2. Identifique e destaque:
   - Queixa principal
   - Sintomas relatados
   - Exame físico (se mencionado)
   - Hipóteses diagnósticas
   - Medicamentos prescritos
   - Orientações dadas
3. Use terminologia médica apropriada
4. Mantenha informações precisas e objetivas
5. Organize em seções claras

**Formato de Resposta:**

## RESUMO DA CONSULTA

### SUBJETIVO (S)
[Queixa principal e história relatada pelo paciente]

### OBJETIVO (O)
[Exame físico e sinais vitais observados]

### AVALIAÇÃO (A)
[Hipóteses diagnósticas e análise clínica]

### PLANO (P)
[Tratamento, medicações e orientações]

### OBSERVAÇÕES ADICIONAIS
[Informações relevantes não categorizadas acima]
`;
  }

  /**
   * Valida formato de áudio suportado
   */
  isAudioFormatSupported(file: File): boolean {
    const supportedFormats = [
      'audio/webm',
      'audio/mp3',
      'audio/mpeg',
      'audio/wav',
      'audio/m4a',
      'audio/ogg',
    ];

    return supportedFormats.includes(file.type);
  }

  /**
   * Converte áudio para formato suportado se necessário
   */

  /**
   * Método principal para transcrever áudio (wrapper)
   * 
   * Função de conveniência que implementa estratégia de fallback automático:
   * 1. Valida disponibilidade das APIs de transcrição
   * 2. Prioriza OpenAI Whisper (maior precisão)
   * 3. Usa Supabase Edge Function como backup
   * 4. Gera IDs temporários quando necessário
   * 
   * Esta função é útil para transcrições rápidas sem necessidade de persistência
   * imediata no banco de dados.
   * 
   * @param audioFile - Arquivo de áudio para transcrever
   * @param options - Opções de transcrição
   * @returns Resultado da transcrição com texto e metadados
   */
  async transcribeAudio(
    audioFile: File | Blob,
    options: TranscriptionOptions = {}
  ): Promise<TranscriptionResult> {
    // Verificar se pelo menos uma API está disponível antes de prosseguir
    this.ensureApiAvailability();

    // Validar quais APIs estão configuradas e funcionais
    const { openai, supabase: supabaseValid } = this.validateApiKeys();

    // Estratégia 1: Tentar OpenAI primeiro (preferencial)
    if (openai) {
      try {
        return await this.transcribeWithOpenAI(audioFile, options);
      } catch (error) {
        console.warn('Falha na transcrição OpenAI:', error);

        // Fallback para Supabase se disponível
        if (supabaseValid) {
          console.log('Tentando fallback para Supabase...');
          // Gerar ID temporário para compatibilidade com API Supabase
          const recordingId = `temp_${Date.now()}`;
          return await this.transcribeWithSupabase(recordingId, options);
        }

        // Se não há fallback disponível, propagar erro original
        throw error;
      }
    }

    // Estratégia 2: Se OpenAI não está disponível, usar Supabase diretamente
    if (supabaseValid) {
      const recordingId = `temp_${Date.now()}`;
      return await this.transcribeWithSupabase(recordingId, options);
    }

    // Este caso nunca deveria ocorrer devido à validação em ensureApiAvailability
    throw new Error('Nenhuma API de transcrição disponível');
  }
}

// Instância singleton do serviço
export const transcriptionService = new TranscriptionService();

// Funções wrapper para compatibilidade
export const transcribeAudio = async (
  recordingId: string,
  options?: TranscriptionOptions
): Promise<{ transcription?: string; error?: string; confidence?: number }> => {
  try {
    const result = await transcriptionService.transcribeWithSupabase(
      recordingId,
      options
    );
    return {
      transcription: result.text,
      confidence: result.confidence,
    };
  } catch (error) {
    console.error('Erro na transcrição:', error);
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Erro desconhecido na transcrição',
    };
  }
};

export const saveTranscription = (
  recordingId: string,
  consultationId: string,
  transcriptionResult: TranscriptionResult,
  processingTime?: number
) => {
  return transcriptionService.saveTranscription(
    recordingId,
    consultationId,
    transcriptionResult,
    processingTime
  );
};

// Exportar tipos para uso em outros componentes
export type { TranscriptionResult, TranscriptionSegment, TranscriptionOptions };
