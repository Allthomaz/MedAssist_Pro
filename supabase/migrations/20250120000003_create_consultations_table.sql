-- Criar tabela de consultas
-- Esta tabela armazena informações das consultas médicas com gravações e transcrições

CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  
  -- Informações básicas da consulta
  consultation_number TEXT UNIQUE, -- Número sequencial da consulta
  consultation_date DATE NOT NULL,
  consultation_time TIME NOT NULL,
  scheduled_duration INTEGER DEFAULT 30, -- duração em minutos
  actual_duration INTEGER, -- duração real em minutos
  
  -- Tipo e modalidade da consulta
  consultation_type TEXT NOT NULL CHECK (consultation_type IN (
    'primeira_consulta', 'retorno', 'urgencia', 'rotina', 'exame', 'procedimento'
  )),
  consultation_mode TEXT NOT NULL DEFAULT 'presencial' CHECK (consultation_mode IN (
    'presencial', 'telemedicina', 'hibrida'
  )),
  
  -- Status da consulta
  status TEXT NOT NULL DEFAULT 'agendada' CHECK (status IN (
    'agendada', 'em_andamento', 'finalizada', 'cancelada', 'nao_compareceu'
  )),
  
  -- Informações da consulta
  chief_complaint TEXT, -- Queixa principal
  consultation_reason TEXT, -- Motivo da consulta
  clinical_notes TEXT, -- Anotações clínicas
  diagnosis TEXT, -- Diagnóstico
  treatment_plan TEXT, -- Plano de tratamento
  prescriptions TEXT, -- Prescrições
  recommendations TEXT, -- Recomendações
  follow_up_date DATE, -- Data do próximo retorno
  
  -- Informações de gravação e transcrição
  has_recording BOOLEAN DEFAULT false,
  recording_url TEXT, -- URL do arquivo de gravação no Supabase Storage
  recording_duration INTEGER, -- duração da gravação em segundos
  has_transcription BOOLEAN DEFAULT false,
  transcription_text TEXT, -- texto da transcrição
  transcription_confidence DECIMAL(3,2), -- confiança da transcrição (0.00 a 1.00)
  
  -- Informações de geração de documento
  document_generated BOOLEAN DEFAULT false,
  document_url TEXT, -- URL do documento gerado
  document_template_id UUID, -- referência ao template usado
  
  -- Sinais vitais
  vital_signs JSONB, -- JSON com sinais vitais (pressão, temperatura, etc.)
  
  -- Localização da consulta
  location TEXT, -- Local da consulta (sala, endereço, etc.)
  
  -- Campos de auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at TIMESTAMPTZ, -- quando a consulta foi iniciada
  finished_at TIMESTAMPTZ -- quando a consulta foi finalizada
);

-- Função para gerar número sequencial da consulta
CREATE OR REPLACE FUNCTION generate_consultation_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  next_number INTEGER;
  year_suffix TEXT;
BEGIN
  -- Usar os dois últimos dígitos do ano
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  
  -- Contar consultas do ano atual
  SELECT COALESCE(MAX(CAST(SUBSTRING(consultation_number FROM '[0-9]+$') AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.consultations
  WHERE consultation_number ~ ('^CONS' || year_suffix || '[0-9]+$')
  AND EXTRACT(YEAR FROM consultation_date) = EXTRACT(YEAR FROM CURRENT_DATE);
  
  RETURN 'CONS' || year_suffix || LPAD(next_number::TEXT, 6, '0');
END;
$$;

-- Trigger para gerar número da consulta automaticamente
CREATE OR REPLACE FUNCTION set_consultation_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.consultation_number IS NULL THEN
    NEW.consultation_number := generate_consultation_number();
  END IF;
  RETURN NEW;
END;
$$;

-- Função para atualizar timestamps de início e fim
CREATE OR REPLACE FUNCTION update_consultation_timestamps()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Se mudou para 'em_andamento' e não tinha started_at
  IF NEW.status = 'em_andamento' AND OLD.status != 'em_andamento' AND NEW.started_at IS NULL THEN
    NEW.started_at := now();
  END IF;
  
  -- Se mudou para 'finalizada' e não tinha finished_at
  IF NEW.status = 'finalizada' AND OLD.status != 'finalizada' AND NEW.finished_at IS NULL THEN
    NEW.finished_at := now();
    
    -- Calcular duração real se não foi definida
    IF NEW.actual_duration IS NULL AND NEW.started_at IS NOT NULL THEN
      NEW.actual_duration := EXTRACT(EPOCH FROM (NEW.finished_at - NEW.started_at)) / 60;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_consultations_doctor_id ON public.consultations(doctor_id);
CREATE INDEX IF NOT EXISTS idx_consultations_patient_id ON public.consultations(patient_id);
CREATE INDEX IF NOT EXISTS idx_consultations_date ON public.consultations(consultation_date);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON public.consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_type ON public.consultations(consultation_type);
CREATE INDEX IF NOT EXISTS idx_consultations_number ON public.consultations(consultation_number);
CREATE INDEX IF NOT EXISTS idx_consultations_has_recording ON public.consultations(has_recording) WHERE has_recording = true;
CREATE INDEX IF NOT EXISTS idx_consultations_document_generated ON public.consultations(document_generated) WHERE document_generated = true;

-- Índice para busca de texto nas anotações clínicas
CREATE INDEX IF NOT EXISTS idx_consultations_clinical_notes ON public.consultations USING gin(to_tsvector('portuguese', clinical_notes)) WHERE clinical_notes IS NOT NULL;

-- Triggers
DROP TRIGGER IF EXISTS trg_consultations_updated_at ON public.consultations;
CREATE TRIGGER trg_consultations_updated_at
  BEFORE UPDATE ON public.consultations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_consultations_set_number ON public.consultations;
CREATE TRIGGER trg_consultations_set_number
  BEFORE INSERT ON public.consultations
  FOR EACH ROW EXECUTE FUNCTION set_consultation_number();

DROP TRIGGER IF EXISTS trg_consultations_timestamps ON public.consultations;
CREATE TRIGGER trg_consultations_timestamps
  BEFORE UPDATE ON public.consultations
  FOR EACH ROW EXECUTE FUNCTION update_consultation_timestamps();

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
-- Médicos podem ver suas próprias consultas
DROP POLICY IF EXISTS "Doctors can view their own consultations" ON public.consultations;
CREATE POLICY "Doctors can view their own consultations"
  ON public.consultations FOR SELECT
  USING (doctor_id = auth.uid());

-- Pacientes podem ver suas próprias consultas
DROP POLICY IF EXISTS "Patients can view their own consultations" ON public.consultations;
CREATE POLICY "Patients can view their own consultations"
  ON public.consultations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.patients p
      WHERE p.id = patient_id AND p.profile_id = auth.uid()
    )
  );

-- Médicos podem inserir consultas
DROP POLICY IF EXISTS "Doctors can insert consultations" ON public.consultations;
CREATE POLICY "Doctors can insert consultations"
  ON public.consultations FOR INSERT
  WITH CHECK (
    doctor_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'doctor'
    )
  );

-- Médicos podem atualizar suas próprias consultas
DROP POLICY IF EXISTS "Doctors can update their own consultations" ON public.consultations;
CREATE POLICY "Doctors can update their own consultations"
  ON public.consultations FOR UPDATE
  USING (doctor_id = auth.uid());

-- Comentários para documentação
COMMENT ON TABLE public.consultations IS 'Consultas médicas com gravações, transcrições e documentos gerados';
COMMENT ON COLUMN public.consultations.consultation_number IS 'Número único da consulta (gerado automaticamente)';
COMMENT ON COLUMN public.consultations.vital_signs IS 'JSON com sinais vitais coletados durante a consulta';
COMMENT ON COLUMN public.consultations.recording_url IS 'URL do arquivo de gravação no Supabase Storage';
COMMENT ON COLUMN public.consultations.transcription_confidence IS 'Nível de confiança da transcrição automática (0.00 a 1.00)';
COMMENT ON COLUMN public.consultations.document_template_id IS 'Template usado para gerar o documento da consulta';