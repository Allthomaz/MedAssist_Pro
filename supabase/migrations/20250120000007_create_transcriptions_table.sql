-- Criar tabela de transcrições e gravações
-- Esta tabela gerencia as gravações de áudio das consultas e suas transcrições

CREATE TABLE IF NOT EXISTS public.recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID NOT NULL REFERENCES public.consultations(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  
  -- Informações básicas da gravação
  recording_name TEXT NOT NULL,
  description TEXT,
  
  -- Arquivo de áudio
  audio_url TEXT NOT NULL, -- URL do arquivo no storage
  audio_file_name TEXT NOT NULL,
  audio_file_size INTEGER, -- Tamanho em bytes
  audio_duration INTEGER, -- Duração em segundos
  audio_format TEXT, -- mp3, wav, m4a, etc.
  audio_quality TEXT CHECK (audio_quality IN ('low', 'medium', 'high', 'lossless')),
  
  -- Metadados técnicos do áudio
  sample_rate INTEGER, -- Taxa de amostragem (Hz)
  bit_rate INTEGER, -- Taxa de bits (kbps)
  channels INTEGER DEFAULT 1, -- Mono = 1, Stereo = 2
  
  -- Status da gravação
  recording_status TEXT NOT NULL DEFAULT 'recording' CHECK (recording_status IN (
    'recording', 'completed', 'processing', 'failed', 'cancelled'
  )),
  
  -- Timestamps da gravação
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  
  -- Configurações de gravação
  auto_transcribe BOOLEAN DEFAULT true,
  language_code TEXT DEFAULT 'pt-BR',
  
  -- Informações de processamento
  processing_started_at TIMESTAMPTZ,
  processing_completed_at TIMESTAMPTZ,
  processing_error TEXT,
  
  -- Campos de auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela para transcrições
CREATE TABLE IF NOT EXISTS public.transcriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recording_id UUID NOT NULL REFERENCES public.recordings(id) ON DELETE CASCADE,
  consultation_id UUID NOT NULL REFERENCES public.consultations(id) ON DELETE CASCADE,
  
  -- Conteúdo da transcrição
  transcript_text TEXT NOT NULL,
  transcript_html TEXT, -- Versão formatada com timestamps, speakers, etc.
  
  -- Metadados da transcrição
  language_detected TEXT,
  confidence_score DECIMAL(3,2), -- 0.00 a 1.00
  word_count INTEGER,
  
  -- Status da transcrição
  transcription_status TEXT NOT NULL DEFAULT 'pending' CHECK (transcription_status IN (
    'pending', 'processing', 'completed', 'failed', 'reviewing', 'approved'
  )),
  
  -- Informações do serviço de transcrição
  transcription_service TEXT, -- 'openai', 'google', 'azure', 'aws', 'manual'
  service_job_id TEXT, -- ID do job no serviço externo
  
  -- Timestamps de processamento
  transcription_started_at TIMESTAMPTZ,
  transcription_completed_at TIMESTAMPTZ,
  
  -- Revisão manual
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  
  -- Erro de processamento
  error_message TEXT,
  
  -- Campos de auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela para segmentos da transcrição (com timestamps)
CREATE TABLE IF NOT EXISTS public.transcription_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transcription_id UUID NOT NULL REFERENCES public.transcriptions(id) ON DELETE CASCADE,
  
  -- Posição no áudio
  start_time DECIMAL(10,3) NOT NULL, -- Tempo de início em segundos
  end_time DECIMAL(10,3) NOT NULL, -- Tempo de fim em segundos
  
  -- Conteúdo do segmento
  text TEXT NOT NULL,
  
  -- Identificação do falante
  speaker_id TEXT, -- 'doctor', 'patient', 'unknown', etc.
  speaker_name TEXT,
  
  -- Confiança da transcrição
  confidence DECIMAL(3,2),
  
  -- Ordem do segmento
  segment_order INTEGER NOT NULL,
  
  -- Palavras individuais (para edição granular)
  words JSONB, -- Array de objetos {word, start_time, end_time, confidence}
  
  -- Campos de auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela para anotações na transcrição
CREATE TABLE IF NOT EXISTS public.transcription_annotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transcription_id UUID NOT NULL REFERENCES public.transcriptions(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Posição da anotação
  start_time DECIMAL(10,3), -- Tempo de início (opcional)
  end_time DECIMAL(10,3), -- Tempo de fim (opcional)
  segment_id UUID REFERENCES public.transcription_segments(id), -- Segmento específico
  
  -- Tipo de anotação
  annotation_type TEXT NOT NULL CHECK (annotation_type IN (
    'note', 'highlight', 'correction', 'important', 'action_item', 'diagnosis', 'prescription'
  )),
  
  -- Conteúdo da anotação
  title TEXT,
  content TEXT NOT NULL,
  
  -- Cor/categoria visual
  color TEXT DEFAULT '#ffeb3b',
  
  -- Campos de auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela para configurações de transcrição por médico
CREATE TABLE IF NOT EXISTS public.transcription_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Configurações padrão
  default_language TEXT DEFAULT 'pt-BR',
  auto_transcribe BOOLEAN DEFAULT true,
  auto_punctuation BOOLEAN DEFAULT true,
  speaker_diarization BOOLEAN DEFAULT true, -- Identificação de falantes
  
  -- Configurações de qualidade
  preferred_service TEXT DEFAULT 'openai' CHECK (preferred_service IN (
    'openai', 'google', 'azure', 'aws'
  )),
  quality_level TEXT DEFAULT 'high' CHECK (quality_level IN ('low', 'medium', 'high')),
  
  -- Configurações de privacidade
  store_audio_locally BOOLEAN DEFAULT true,
  delete_audio_after_days INTEGER DEFAULT 90,
  encrypt_audio BOOLEAN DEFAULT true,
  
  -- Configurações de notificação
  notify_on_completion BOOLEAN DEFAULT true,
  notify_on_error BOOLEAN DEFAULT true,
  
  -- Palavras-chave personalizadas (para melhor reconhecimento)
  custom_vocabulary JSONB DEFAULT '[]',
  
  -- Campos de auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Constraint para um registro por médico
  UNIQUE(doctor_id)
);

-- Função para calcular duração da gravação
CREATE OR REPLACE FUNCTION calculate_recording_duration(
  p_recording_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  duration_seconds INTEGER;
BEGIN
  SELECT 
    EXTRACT(EPOCH FROM (ended_at - started_at))::INTEGER
  INTO duration_seconds
  FROM public.recordings
  WHERE id = p_recording_id;
  
  RETURN COALESCE(duration_seconds, 0);
END;
$$;

-- Função para atualizar status da consulta baseado na transcrição
CREATE OR REPLACE FUNCTION update_consultation_transcription_status()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Quando transcrição é completada, atualizar consulta
  IF NEW.transcription_status = 'completed' AND OLD.transcription_status != 'completed' THEN
    UPDATE public.consultations
    SET 
      transcription_text = NEW.transcript_text,
      transcription_confidence = NEW.confidence_score,
      transcription_completed_at = NEW.transcription_completed_at
    WHERE id = NEW.consultation_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Função para limpar gravações antigas
CREATE OR REPLACE FUNCTION cleanup_old_recordings()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count INTEGER := 0;
  setting_record RECORD;
BEGIN
  -- Para cada médico com configurações
  FOR setting_record IN 
    SELECT doctor_id, delete_audio_after_days 
    FROM public.transcription_settings 
    WHERE delete_audio_after_days > 0
  LOOP
    -- Deletar gravações antigas
    WITH deleted_recordings AS (
      DELETE FROM public.recordings
      WHERE doctor_id = setting_record.doctor_id
      AND created_at < (now() - (setting_record.delete_audio_after_days || ' days')::INTERVAL)
      AND recording_status = 'completed'
      RETURNING id
    )
    SELECT COUNT(*) INTO deleted_count
    FROM deleted_recordings;
  END LOOP;
  
  RETURN deleted_count;
END;
$$;

-- Trigger para atualizar duração quando gravação termina
CREATE OR REPLACE FUNCTION update_recording_duration()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Se mudou para 'completed' e tem timestamps
  IF NEW.recording_status = 'completed' AND OLD.recording_status != 'completed' 
     AND NEW.started_at IS NOT NULL AND NEW.ended_at IS NOT NULL THEN
    NEW.audio_duration := EXTRACT(EPOCH FROM (NEW.ended_at - NEW.started_at))::INTEGER;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_recordings_consultation_id ON public.recordings(consultation_id);
CREATE INDEX IF NOT EXISTS idx_recordings_doctor_id ON public.recordings(doctor_id);
CREATE INDEX IF NOT EXISTS idx_recordings_patient_id ON public.recordings(patient_id);
CREATE INDEX IF NOT EXISTS idx_recordings_status ON public.recordings(recording_status);
CREATE INDEX IF NOT EXISTS idx_recordings_created_at ON public.recordings(created_at);

CREATE INDEX IF NOT EXISTS idx_transcriptions_recording_id ON public.transcriptions(recording_id);
CREATE INDEX IF NOT EXISTS idx_transcriptions_consultation_id ON public.transcriptions(consultation_id);
CREATE INDEX IF NOT EXISTS idx_transcriptions_status ON public.transcriptions(transcription_status);
CREATE INDEX IF NOT EXISTS idx_transcriptions_text_search ON public.transcriptions USING GIN(to_tsvector('portuguese', transcript_text));

CREATE INDEX IF NOT EXISTS idx_transcription_segments_transcription_id ON public.transcription_segments(transcription_id);
CREATE INDEX IF NOT EXISTS idx_transcription_segments_time ON public.transcription_segments(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_transcription_segments_order ON public.transcription_segments(transcription_id, segment_order);

CREATE INDEX IF NOT EXISTS idx_transcription_annotations_transcription_id ON public.transcription_annotations(transcription_id);
CREATE INDEX IF NOT EXISTS idx_transcription_annotations_type ON public.transcription_annotations(annotation_type);
CREATE INDEX IF NOT EXISTS idx_transcription_annotations_created_by ON public.transcription_annotations(created_by);

CREATE INDEX IF NOT EXISTS idx_transcription_settings_doctor_id ON public.transcription_settings(doctor_id);

-- Triggers
DROP TRIGGER IF EXISTS trg_recordings_updated_at ON public.recordings;
CREATE TRIGGER trg_recordings_updated_at
  BEFORE UPDATE ON public.recordings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_recordings_duration ON public.recordings;
CREATE TRIGGER trg_recordings_duration
  BEFORE UPDATE ON public.recordings
  FOR EACH ROW EXECUTE FUNCTION update_recording_duration();

DROP TRIGGER IF EXISTS trg_transcriptions_updated_at ON public.transcriptions;
CREATE TRIGGER trg_transcriptions_updated_at
  BEFORE UPDATE ON public.transcriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_transcriptions_consultation_update ON public.transcriptions;
CREATE TRIGGER trg_transcriptions_consultation_update
  AFTER UPDATE ON public.transcriptions
  FOR EACH ROW EXECUTE FUNCTION update_consultation_transcription_status();

DROP TRIGGER IF EXISTS trg_transcription_segments_updated_at ON public.transcription_segments;
CREATE TRIGGER trg_transcription_segments_updated_at
  BEFORE UPDATE ON public.transcription_segments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_transcription_annotations_updated_at ON public.transcription_annotations;
CREATE TRIGGER trg_transcription_annotations_updated_at
  BEFORE UPDATE ON public.transcription_annotations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_transcription_settings_updated_at ON public.transcription_settings;
CREATE TRIGGER trg_transcription_settings_updated_at
  BEFORE UPDATE ON public.transcription_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transcriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transcription_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transcription_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transcription_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para recordings
DROP POLICY IF EXISTS "Doctors can manage their recordings" ON public.recordings;
CREATE POLICY "Doctors can manage their recordings"
  ON public.recordings FOR ALL
  USING (doctor_id = auth.uid());

-- Políticas para transcriptions
DROP POLICY IF EXISTS "Doctors can manage their transcriptions" ON public.transcriptions;
CREATE POLICY "Doctors can manage their transcriptions"
  ON public.transcriptions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.recordings r
      WHERE r.id = recording_id AND r.doctor_id = auth.uid()
    )
  );

-- Políticas para transcription_segments
DROP POLICY IF EXISTS "Access segments of accessible transcriptions" ON public.transcription_segments;
CREATE POLICY "Access segments of accessible transcriptions"
  ON public.transcription_segments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.transcriptions t
      JOIN public.recordings r ON r.id = t.recording_id
      WHERE t.id = transcription_id AND r.doctor_id = auth.uid()
    )
  );

-- Políticas para transcription_annotations
DROP POLICY IF EXISTS "Doctors can manage their annotations" ON public.transcription_annotations;
CREATE POLICY "Doctors can manage their annotations"
  ON public.transcription_annotations FOR ALL
  USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.transcriptions t
      JOIN public.recordings r ON r.id = t.recording_id
      WHERE t.id = transcription_id AND r.doctor_id = auth.uid()
    )
  );

-- Políticas para transcription_settings
DROP POLICY IF EXISTS "Doctors can manage their transcription settings" ON public.transcription_settings;
CREATE POLICY "Doctors can manage their transcription settings"
  ON public.transcription_settings FOR ALL
  USING (doctor_id = auth.uid());

-- Comentários para documentação
COMMENT ON TABLE public.recordings IS 'Gravações de áudio das consultas médicas';
COMMENT ON TABLE public.transcriptions IS 'Transcrições das gravações de áudio';
COMMENT ON TABLE public.transcription_segments IS 'Segmentos da transcrição com timestamps';
COMMENT ON TABLE public.transcription_annotations IS 'Anotações e destaques na transcrição';
COMMENT ON TABLE public.transcription_settings IS 'Configurações de transcrição por médico';
COMMENT ON FUNCTION calculate_recording_duration IS 'Calcula duração da gravação em segundos';
COMMENT ON FUNCTION cleanup_old_recordings IS 'Remove gravações antigas baseado nas configurações do médico';
COMMENT ON COLUMN public.transcription_segments.words IS 'Array JSON com palavras individuais e timestamps';
COMMENT ON COLUMN public.transcription_settings.custom_vocabulary IS 'Vocabulário personalizado para melhor reconhecimento';
COMMENT ON COLUMN public.recordings.audio_duration IS 'Duração do áudio em segundos';