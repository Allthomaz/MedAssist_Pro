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
   */
  private async ensureApiAvailability(): Promise<void> {
    const { openai, supabase: supabaseValid } = await this.validateApiKeys();

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

      // Processar resposta baseada no formato
      if (options.response_format === 'verbose_json') {
        return {
          text: result.text,
          confidence: this.calculateAverageConfidence(result.segments || []),
          language: result.language,
          duration: result.duration,
          segments:
            result.segments?.map((segment: WhisperSegment) => ({
              start: segment.start,
              end: segment.end,
              text: segment.text,
              confidence: segment.avg_logprob
                ? Math.exp(segment.avg_logprob)
                : 0.95,
            })) || [],
        };
      } else {
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
   */
  async processAudioTranscription(
    audioFile: File | Blob,
    recordingId: string,
    consultationId: string,
    options: TranscriptionOptions = {}
  ): Promise<{ transcriptionId: string; text: string; confidence: number }> {
    // Verificar se pelo menos uma API está disponível
    this.ensureApiAvailability();

    const startTime = Date.now();

    try {
      // Configurar prompt médico padrão se não fornecido
      const defaultOptions: TranscriptionOptions = {
        language: 'pt',
        temperature: 0.1,
        response_format: 'verbose_json',
        timestamp_granularities: ['segment'],
        prompt:
          'Esta é uma transcrição de consulta médica. Inclua termos médicos precisos, nomes de medicamentos, procedimentos, sintomas e diagnósticos. Mantenha a terminologia médica correta.',
      };

      const transcriptionOptions = { ...defaultOptions, ...options };

      // Tentar transcrição com OpenAI primeiro
      let transcriptionResult: TranscriptionResult;

      try {
        transcriptionResult = await this.transcribeWithOpenAI(
          audioFile,
          transcriptionOptions
        );
      } catch (openaiError) {
        console.warn(
          'Falha na transcrição OpenAI, tentando Supabase:',
          openaiError
        );

        // Fallback para função Supabase
        transcriptionResult = await this.transcribeWithSupabase(
          recordingId,
          transcriptionOptions
        );
      }

      const processingTime = Date.now() - startTime;

      // Salvar no banco de dados
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
   * Calcula a confiança média dos segmentos
   */
  private calculateAverageConfidence(segments: WhisperSegment[]): number {
    if (!segments || segments.length === 0) return 0.95;

    const totalConfidence = segments.reduce((sum, segment) => {
      const confidence = segment.avg_logprob
        ? Math.exp(segment.avg_logprob)
        : 0.95;
      return sum + confidence;
    }, 0);

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
   */
  async transcribeAudio(
    audioFile: File | Blob,
    options: TranscriptionOptions = {}
  ): Promise<TranscriptionResult> {
    // Verificar se pelo menos uma API está disponível
    this.ensureApiAvailability();

    const { openai, supabase: supabaseValid } = this.validateApiKeys();

    // Tentar OpenAI primeiro se disponível
    if (openai) {
      try {
        return await this.transcribeWithOpenAI(audioFile, options);
      } catch (error) {
        console.warn('Falha na transcrição OpenAI:', error);

        // Fallback para Supabase se disponível
        if (supabaseValid) {
          console.log('Tentando fallback para Supabase...');
          // Para usar Supabase, precisamos de um recordingId
          const recordingId = `temp_${Date.now()}`;
          return await this.transcribeWithSupabase(recordingId, options);
        }

        throw error;
      }
    }

    // Se OpenAI não está disponível, usar Supabase
    if (supabaseValid) {
      const recordingId = `temp_${Date.now()}`;
      return await this.transcribeWithSupabase(recordingId, options);
    }

    // Isso nunca deveria acontecer devido ao ensureApiAvailability
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
