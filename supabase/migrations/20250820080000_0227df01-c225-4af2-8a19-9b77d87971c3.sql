-- Verificar se a tabela patients já existe e criar se necessário
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'patients') THEN
        -- Criar tabela patients se não existir
        CREATE TABLE public.patients (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            doctor_id UUID NOT NULL,
            profile_id UUID, -- Nullable para permitir pacientes sem conta no sistema
            patient_number TEXT,
            full_name TEXT NOT NULL,
            birth_date DATE NOT NULL,
            gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
            cpf TEXT,
            rg TEXT,
            marital_status TEXT,
            occupation TEXT,
            email TEXT,
            phone TEXT,
            mobile_phone TEXT,
            address TEXT,
            address_number TEXT,
            address_complement TEXT,
            neighborhood TEXT,
            city TEXT,
            state TEXT,
            zip_code TEXT,
            country TEXT DEFAULT 'Brasil',
            emergency_contact_name TEXT,
            emergency_contact_relationship TEXT,
            emergency_contact_phone TEXT,
            emergency_contact_phone2 TEXT,
            height NUMERIC,
            weight NUMERIC,
            blood_type TEXT,
            allergies TEXT[],
            current_medications TEXT[],
            chronic_conditions TEXT[],
            family_history TEXT,
            insurance_company TEXT,
            insurance_number TEXT,
            insurance_plan TEXT,
            notes TEXT,
            status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );

        -- Habilitar RLS
        ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

        -- Criar policies para RLS
        CREATE POLICY "Doctors can view their own patients" 
        ON public.patients 
        FOR SELECT 
        USING (doctor_id = auth.uid());

        CREATE POLICY "Doctors can insert patients" 
        ON public.patients 
        FOR INSERT 
        WITH CHECK (doctor_id = auth.uid());

        CREATE POLICY "Doctors can update their patients" 
        ON public.patients 
        FOR UPDATE 
        USING (doctor_id = auth.uid());

        CREATE POLICY "Patients can view their own data" 
        ON public.patients 
        FOR SELECT 
        USING (profile_id = auth.uid());

        CREATE POLICY "Patients can update their own basic info" 
        ON public.patients 
        FOR UPDATE 
        USING (profile_id = auth.uid())
        WITH CHECK (profile_id = auth.uid());

        -- Criar trigger para updated_at
        CREATE TRIGGER update_patients_updated_at
        BEFORE UPDATE ON public.patients
        FOR EACH ROW
        EXECUTE FUNCTION public.update_updated_at_column();

        -- Criar trigger para gerar número do paciente
        CREATE TRIGGER set_patient_number_trigger
        BEFORE INSERT ON public.patients
        FOR EACH ROW
        EXECUTE FUNCTION public.set_patient_number();
    END IF;
END $$;