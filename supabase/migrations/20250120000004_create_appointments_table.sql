-- Criar tabela de agendamentos
-- Esta tabela gerencia os horários disponíveis e agendamentos dos médicos

CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  
  -- Informações básicas do agendamento
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration INTEGER NOT NULL DEFAULT 30, -- duração em minutos
  
  -- Tipo de agendamento
  appointment_type TEXT NOT NULL CHECK (appointment_type IN (
    'consulta_geral', 'primeira_consulta', 'retorno', 'urgencia', 
    'exame', 'procedimento', 'teleconsulta', 'avaliacao'
  )),
  
  -- Status do agendamento
  status TEXT NOT NULL DEFAULT 'disponivel' CHECK (status IN (
    'disponivel', 'agendado', 'confirmado', 'em_andamento', 
    'finalizado', 'cancelado', 'nao_compareceu', 'reagendado'
  )),
  
  -- Informações do paciente (quando agendado)
  patient_name TEXT, -- Nome do paciente (pode ser diferente do cadastrado)
  patient_phone TEXT, -- Telefone para contato
  patient_email TEXT, -- Email para confirmações
  
  -- Detalhes do agendamento
  appointment_reason TEXT, -- Motivo da consulta
  chief_complaint TEXT, -- Queixa principal
  is_first_time BOOLEAN DEFAULT false, -- Primeira vez do paciente
  
  -- Localização e modalidade
  location TEXT, -- Local da consulta (sala, endereço)
  consultation_mode TEXT NOT NULL DEFAULT 'presencial' CHECK (consultation_mode IN (
    'presencial', 'telemedicina', 'hibrida'
  )),
  
  -- Informações de contato e confirmação
  confirmation_sent BOOLEAN DEFAULT false,
  confirmation_sent_at TIMESTAMPTZ,
  confirmed_by_patient BOOLEAN DEFAULT false,
  confirmed_at TIMESTAMPTZ,
  
  -- Lembretes
  reminder_sent BOOLEAN DEFAULT false,
  reminder_sent_at TIMESTAMPTZ,
  
  -- Observações e notas
  notes TEXT, -- Observações internas
  special_instructions TEXT, -- Instruções especiais
  
  -- Informações de cancelamento/reagendamento
  cancelled_by TEXT CHECK (cancelled_by IN ('doctor', 'patient', 'system')),
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  rescheduled_from UUID REFERENCES public.appointments(id), -- Referência ao agendamento original
  
  -- Integração com consulta
  consultation_id UUID REFERENCES public.consultations(id),
  
  -- Campos de auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela para horários de funcionamento do médico
CREATE TABLE IF NOT EXISTS public.doctor_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Dia da semana (0 = domingo, 1 = segunda, ..., 6 = sábado)
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  
  -- Horários de funcionamento
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  -- Duração padrão das consultas neste horário
  default_duration INTEGER DEFAULT 30,
  
  -- Intervalo entre consultas
  break_duration INTEGER DEFAULT 0,
  
  -- Status do horário
  is_active BOOLEAN DEFAULT true,
  
  -- Campos de auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela para bloqueios de horários (feriados, férias, etc.)
CREATE TABLE IF NOT EXISTS public.schedule_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Período do bloqueio
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TIME, -- Se NULL, bloqueia o dia todo
  end_time TIME,
  
  -- Tipo de bloqueio
  block_type TEXT NOT NULL CHECK (block_type IN (
    'ferias', 'feriado', 'congresso', 'doenca', 'pessoal', 'manutencao'
  )),
  
  -- Descrição do bloqueio
  description TEXT,
  
  -- Se é recorrente (ex: todos os feriados)
  is_recurring BOOLEAN DEFAULT false,
  
  -- Campos de auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Função para verificar disponibilidade de horário
CREATE OR REPLACE FUNCTION check_appointment_availability(
  p_doctor_id UUID,
  p_date DATE,
  p_time TIME,
  p_duration INTEGER DEFAULT 30
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  day_of_week INTEGER;
  schedule_exists BOOLEAN;
  has_conflicts BOOLEAN;
  is_blocked BOOLEAN;
BEGIN
  -- Calcular dia da semana (0 = domingo)
  day_of_week := EXTRACT(DOW FROM p_date);
  
  -- Verificar se existe horário de funcionamento
  SELECT EXISTS(
    SELECT 1 FROM public.doctor_schedules ds
    WHERE ds.doctor_id = p_doctor_id
    AND ds.day_of_week = day_of_week
    AND ds.is_active = true
    AND p_time >= ds.start_time
    AND (p_time + (p_duration || ' minutes')::INTERVAL)::TIME <= ds.end_time
  ) INTO schedule_exists;
  
  IF NOT schedule_exists THEN
    RETURN false;
  END IF;
  
  -- Verificar conflitos com outros agendamentos
  SELECT EXISTS(
    SELECT 1 FROM public.appointments a
    WHERE a.doctor_id = p_doctor_id
    AND a.appointment_date = p_date
    AND a.status NOT IN ('cancelado', 'nao_compareceu')
    AND (
      -- Sobreposição de horários
      (a.appointment_time <= p_time AND (a.appointment_time + (a.duration || ' minutes')::INTERVAL)::TIME > p_time)
      OR
      (p_time <= a.appointment_time AND (p_time + (p_duration || ' minutes')::INTERVAL)::TIME > a.appointment_time)
    )
  ) INTO has_conflicts;
  
  IF has_conflicts THEN
    RETURN false;
  END IF;
  
  -- Verificar bloqueios
  SELECT EXISTS(
    SELECT 1 FROM public.schedule_blocks sb
    WHERE sb.doctor_id = p_doctor_id
    AND p_date >= sb.start_date
    AND p_date <= sb.end_date
    AND (
      (sb.start_time IS NULL) -- Dia todo bloqueado
      OR
      (p_time >= sb.start_time AND (p_time + (p_duration || ' minutes')::INTERVAL)::TIME <= sb.end_time)
    )
  ) INTO is_blocked;
  
  RETURN NOT is_blocked;
END;
$$;

-- Função para criar consulta automaticamente quando agendamento é confirmado
CREATE OR REPLACE FUNCTION create_consultation_from_appointment()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  consultation_uuid UUID;
BEGIN
  -- Se mudou para 'confirmado' e não tem consulta associada
  IF NEW.status = 'confirmado' AND OLD.status != 'confirmado' AND NEW.consultation_id IS NULL AND NEW.patient_id IS NOT NULL THEN
    INSERT INTO public.consultations (
      doctor_id,
      patient_id,
      consultation_date,
      consultation_time,
      scheduled_duration,
      consultation_type,
      consultation_mode,
      consultation_reason,
      chief_complaint,
      status
    ) VALUES (
      NEW.doctor_id,
      NEW.patient_id,
      NEW.appointment_date,
      NEW.appointment_time,
      NEW.duration,
      CASE NEW.appointment_type
        WHEN 'teleconsulta' THEN 'retorno'
        ELSE NEW.appointment_type
      END,
      NEW.consultation_mode,
      NEW.appointment_reason,
      NEW.chief_complaint,
      'agendada'
    ) RETURNING id INTO consultation_uuid;
    
    NEW.consultation_id := consultation_uuid;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_datetime ON public.appointments(appointment_date, appointment_time);
CREATE INDEX IF NOT EXISTS idx_appointments_consultation_id ON public.appointments(consultation_id);

CREATE INDEX IF NOT EXISTS idx_doctor_schedules_doctor_id ON public.doctor_schedules(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_schedules_day ON public.doctor_schedules(day_of_week);

CREATE INDEX IF NOT EXISTS idx_schedule_blocks_doctor_id ON public.schedule_blocks(doctor_id);
CREATE INDEX IF NOT EXISTS idx_schedule_blocks_dates ON public.schedule_blocks(start_date, end_date);

-- Triggers
DROP TRIGGER IF EXISTS trg_appointments_updated_at ON public.appointments;
CREATE TRIGGER trg_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_doctor_schedules_updated_at ON public.doctor_schedules;
CREATE TRIGGER trg_doctor_schedules_updated_at
  BEFORE UPDATE ON public.doctor_schedules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_schedule_blocks_updated_at ON public.schedule_blocks;
CREATE TRIGGER trg_schedule_blocks_updated_at
  BEFORE UPDATE ON public.schedule_blocks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_appointments_create_consultation ON public.appointments;
CREATE TRIGGER trg_appointments_create_consultation
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION create_consultation_from_appointment();

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_blocks ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para appointments
DROP POLICY IF EXISTS "Doctors can manage their appointments" ON public.appointments;
CREATE POLICY "Doctors can manage their appointments"
  ON public.appointments FOR ALL
  USING (doctor_id = auth.uid());

DROP POLICY IF EXISTS "Patients can view their appointments" ON public.appointments;
CREATE POLICY "Patients can view their appointments"
  ON public.appointments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.patients p
      WHERE p.id = patient_id AND p.profile_id = auth.uid()
    )
  );

-- Políticas para doctor_schedules
DROP POLICY IF EXISTS "Doctors can manage their schedules" ON public.doctor_schedules;
CREATE POLICY "Doctors can manage their schedules"
  ON public.doctor_schedules FOR ALL
  USING (doctor_id = auth.uid());

-- Políticas para schedule_blocks
DROP POLICY IF EXISTS "Doctors can manage their schedule blocks" ON public.schedule_blocks;
CREATE POLICY "Doctors can manage their schedule blocks"
  ON public.schedule_blocks FOR ALL
  USING (doctor_id = auth.uid());

-- Comentários para documentação
COMMENT ON TABLE public.appointments IS 'Agendamentos de consultas médicas';
COMMENT ON TABLE public.doctor_schedules IS 'Horários de funcionamento dos médicos';
COMMENT ON TABLE public.schedule_blocks IS 'Bloqueios de horários (férias, feriados, etc.)';
COMMENT ON FUNCTION check_appointment_availability IS 'Verifica se um horário está disponível para agendamento';
COMMENT ON COLUMN public.appointments.rescheduled_from IS 'Referência ao agendamento original em caso de reagendamento';
COMMENT ON COLUMN public.doctor_schedules.day_of_week IS 'Dia da semana (0=domingo, 1=segunda, ..., 6=sábado)';