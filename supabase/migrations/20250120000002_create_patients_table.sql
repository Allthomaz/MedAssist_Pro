-- Criar tabela de pacientes
-- Esta tabela armazena informações detalhadas dos pacientes para uso médico

CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Informações pessoais detalhadas
  patient_number TEXT UNIQUE, -- Número do paciente no consultório
  full_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  cpf TEXT UNIQUE,
  rg TEXT,
  marital_status TEXT CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed', 'other')),
  occupation TEXT,
  
  -- Contatos
  email TEXT,
  phone TEXT,
  mobile_phone TEXT,
  
  -- Endereço
  address TEXT,
  address_number TEXT,
  address_complement TEXT,
  neighborhood TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'Brasil',
  
  -- Contato de emergência
  emergency_contact_name TEXT,
  emergency_contact_relationship TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_phone2 TEXT,
  
  -- Informações médicas básicas
  blood_type TEXT CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  weight DECIMAL(5,2), -- em kg
  height DECIMAL(5,2), -- em cm
  
  -- Alergias e medicamentos
  allergies TEXT[], -- Array de alergias
  current_medications TEXT[], -- Array de medicamentos atuais
  chronic_conditions TEXT[], -- Array de condições crônicas
  
  -- Histórico familiar
  family_history TEXT,
  
  -- Informações do plano de saúde
  insurance_company TEXT,
  insurance_number TEXT,
  insurance_plan TEXT,
  
  -- Observações gerais
  notes TEXT,
  
  -- Status do paciente
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  
  -- Campos de auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Função para gerar número sequencial do paciente
CREATE OR REPLACE FUNCTION generate_patient_number(doctor_uuid UUID)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  next_number INTEGER;
  doctor_initials TEXT;
BEGIN
  -- Buscar as iniciais do médico
  SELECT UPPER(LEFT(full_name, 1) || LEFT(SPLIT_PART(full_name, ' ', -1), 1))
  INTO doctor_initials
  FROM public.profiles
  WHERE id = doctor_uuid AND role = 'doctor';
  
  -- Se não encontrar o médico, usar 'DR'
  IF doctor_initials IS NULL THEN
    doctor_initials := 'DR';
  END IF;
  
  -- Contar pacientes existentes do médico
  SELECT COALESCE(MAX(CAST(SUBSTRING(patient_number FROM '[0-9]+$') AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.patients
  WHERE doctor_id = doctor_uuid
  AND patient_number ~ ('^' || doctor_initials || '[0-9]+$');
  
  RETURN doctor_initials || LPAD(next_number::TEXT, 4, '0');
END;
$$;

-- Trigger para gerar número do paciente automaticamente
CREATE OR REPLACE FUNCTION set_patient_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.patient_number IS NULL THEN
    NEW.patient_number := generate_patient_number(NEW.doctor_id);
  END IF;
  RETURN NEW;
END;
$$;

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_patients_profile_id ON public.patients(profile_id);
CREATE INDEX IF NOT EXISTS idx_patients_doctor_id ON public.patients(doctor_id);
CREATE INDEX IF NOT EXISTS idx_patients_patient_number ON public.patients(patient_number);
CREATE INDEX IF NOT EXISTS idx_patients_cpf ON public.patients(cpf) WHERE cpf IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_patients_status ON public.patients(status);
CREATE INDEX IF NOT EXISTS idx_patients_full_name ON public.patients USING gin(to_tsvector('portuguese', full_name));

-- Trigger para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS trg_patients_updated_at ON public.patients;
CREATE TRIGGER trg_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para gerar número do paciente
DROP TRIGGER IF EXISTS trg_patients_set_number ON public.patients;
CREATE TRIGGER trg_patients_set_number
  BEFORE INSERT ON public.patients
  FOR EACH ROW EXECUTE FUNCTION set_patient_number();

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
-- Médicos podem ver seus próprios pacientes
DROP POLICY IF EXISTS "Doctors can view their own patients" ON public.patients;
CREATE POLICY "Doctors can view their own patients"
  ON public.patients FOR SELECT
  USING (doctor_id = auth.uid());

-- Pacientes podem ver seus próprios dados
DROP POLICY IF EXISTS "Patients can view their own data" ON public.patients;
CREATE POLICY "Patients can view their own data"
  ON public.patients FOR SELECT
  USING (profile_id = auth.uid());

-- Médicos podem inserir novos pacientes
DROP POLICY IF EXISTS "Doctors can insert patients" ON public.patients;
CREATE POLICY "Doctors can insert patients"
  ON public.patients FOR INSERT
  WITH CHECK (
    doctor_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'doctor'
    )
  );

-- Médicos podem atualizar dados de seus pacientes
DROP POLICY IF EXISTS "Doctors can update their patients" ON public.patients;
CREATE POLICY "Doctors can update their patients"
  ON public.patients FOR UPDATE
  USING (doctor_id = auth.uid());

-- Pacientes podem atualizar alguns de seus próprios dados
DROP POLICY IF EXISTS "Patients can update their own basic info" ON public.patients;
CREATE POLICY "Patients can update their own basic info"
  ON public.patients FOR UPDATE
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- Comentários para documentação
COMMENT ON TABLE public.patients IS 'Informações detalhadas dos pacientes para uso médico';
COMMENT ON COLUMN public.patients.patient_number IS 'Número único do paciente no consultório (gerado automaticamente)';
COMMENT ON COLUMN public.patients.profile_id IS 'Referência ao perfil do usuário paciente';
COMMENT ON COLUMN public.patients.doctor_id IS 'Referência ao perfil do médico responsável';
COMMENT ON COLUMN public.patients.allergies IS 'Array de alergias conhecidas do paciente';
COMMENT ON COLUMN public.patients.current_medications IS 'Array de medicamentos em uso atual';
COMMENT ON COLUMN public.patients.chronic_conditions IS 'Array de condições crônicas do paciente';