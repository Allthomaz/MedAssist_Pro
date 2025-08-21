-- Criar tabela de perfis de usuários
-- Esta tabela estende as informações do auth.users do Supabase

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('doctor', 'patient')),
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  
  -- Campos específicos para médicos
  crm TEXT, -- Registro no Conselho Regional de Medicina
  specialty TEXT, -- Especialidade médica
  clinic_name TEXT, -- Nome da clínica/consultório
  clinic_address TEXT, -- Endereço da clínica
  
  -- Campos específicos para pacientes
  birth_date DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  cpf TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  
  -- Campos de auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_crm ON public.profiles(crm) WHERE crm IS NOT NULL;

-- Trigger para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
-- Usuários podem ver seu próprio perfil
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING ((select auth.uid()) = id);

-- POLÍTICA REMOVIDA: "Doctors can view patient profiles" causava recursão infinita
-- Médicos devem acessar dados de pacientes através da tabela patients, não profiles
-- Esta política foi removida para evitar consultas recursivas na própria tabela profiles

-- Usuários podem inserir seu próprio perfil
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK ((select auth.uid()) = id);

-- Usuários podem atualizar seu próprio perfil
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING ((select auth.uid()) = id);

-- Função para criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient'),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Comentários para documentação
COMMENT ON TABLE public.profiles IS 'Perfis de usuários com informações estendidas para médicos e pacientes';
COMMENT ON COLUMN public.profiles.role IS 'Tipo de usuário: doctor ou patient';
COMMENT ON COLUMN public.profiles.crm IS 'Registro no Conselho Regional de Medicina (apenas médicos)';
COMMENT ON COLUMN public.profiles.specialty IS 'Especialidade médica (apenas médicos)';
COMMENT ON COLUMN public.profiles.cpf IS 'CPF do paciente (apenas pacientes)';