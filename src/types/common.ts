// Tipos comuns compartilhados no projeto

/**
 * Interface para tratamento de erros type-safe
 */
export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}

/**
 * Tipo para erros conhecidos da aplicação
 */
export type KnownError = AppError | Error;

/**
 * Interface para segmentos de transcrição do Whisper API
 */
export interface WhisperSegment {
  id: number;
  seek: number;
  start: number;
  end: number;
  text: string;
  tokens: number[];
  temperature: number;
  avg_logprob: number;
  compression_ratio: number;
  no_speech_prob: number;
}

/**
 * Interface para resposta completa do Whisper API
 */
export interface WhisperResponse {
  task: string;
  language: string;
  duration: number;
  text: string;
  segments: WhisperSegment[];
}

/**
 * Interface para items de conteúdo PDF
 */
export interface PDFContentItem {
  str?: string;
  dir?: string;
  width?: number;
  height?: number;
  transform?: number[];
  fontName?: string;
  hasEOL?: boolean;
}

/**
 * Tipo para valores de preferências de notificação
 */
export type NotificationPreferenceValue = boolean | string | number;

/**
 * Interface para dados de callback médico
 */
export interface MedicalCallbackData {
  patientId?: string;
  consultationId?: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  [key: string]: unknown;
}

/**
 * Tipo para classes CSS do calendário
 */
export interface CalendarClassNames {
  months?: string;
  month?: string;
  caption?: string;
  caption_label?: string;
  nav?: string;
  nav_button?: string;
  nav_button_previous?: string;
  nav_button_next?: string;
  table?: string;
  head_row?: string;
  head_cell?: string;
  row?: string;
  cell?: string;
  day?: string;
  day_selected?: string;
  day_today?: string;
  day_outside?: string;
  day_disabled?: string;
  day_range_middle?: string;
  day_hidden?: string;
}

/**
 * Utilitário para criar erros tipados
 */
export const createAppError = (
  message: string,
  code?: string,
  statusCode?: number,
  details?: Record<string, unknown>
): AppError => {
  const error = new Error(message) as AppError;
  error.code = code;
  error.statusCode = statusCode;
  error.details = details;
  return error;
};

/**
 * Type guard para verificar se é um AppError
 */
export const isAppError = (error: unknown): error is AppError => {
  return error instanceof Error && 'code' in error;
};

/**
 * Utilitário para extrair mensagem de erro de forma type-safe
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Erro desconhecido';
};
