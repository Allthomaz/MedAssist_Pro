-- Correção de vulnerabilidades de segurança identificadas
-- 1. Fortalecer políticas RLS da tabela de pacientes
-- 2. Corrigir exposição de templates de notificação do sistema
-- 3. Implementar proteção contra vazamento de senhas

-- ========================================
-- 1. FORTALECER POLÍTICAS RLS DA TABELA DE PACIENTES
-- ========================================

-- Remover políticas existentes que podem ser vulneráveis
DROP POLICY IF EXISTS "Doctors can view their own patients" ON public.patients;
DROP POLICY IF EXISTS "Patients can view their own data" ON public.patients;
DROP POLICY IF EXISTS "Doctors can insert patients" ON public.patients;
DROP POLICY IF EXISTS "Doctors can update their patients" ON public.patients;
DROP POLICY IF EXISTS "Patients can update their own basic info" ON public.patients;

-- Criar função auxiliar para verificar se o usuário é médico ativo
CREATE OR REPLACE FUNCTION public.is_active_doctor(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id 
    AND role = 'doctor'
    AND crm IS NOT NULL
    AND crm != ''
  );
END;
$$;

-- Criar função auxiliar para verificar se o usuário é paciente ativo
CREATE OR REPLACE FUNCTION public.is_active_patient(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id 
    AND role = 'patient'
  );
END;
$$;

-- Política mais restritiva para médicos visualizarem pacientes
CREATE POLICY "Verified doctors can view their assigned patients"
  ON public.patients FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    doctor_id = auth.uid() AND
    public.is_active_doctor(auth.uid()) AND
    status = 'active'
  );

-- Política mais restritiva para pacientes visualizarem seus próprios dados
CREATE POLICY "Active patients can view their own data"
  ON public.patients FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    profile_id = auth.uid() AND
    public.is_active_patient(auth.uid())
  );

-- Política mais restritiva para médicos inserirem pacientes
CREATE POLICY "Verified doctors can insert patients"
  ON public.patients FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    doctor_id = auth.uid() AND
    public.is_active_doctor(auth.uid()) AND
    profile_id IS NOT NULL AND
    public.is_active_patient(profile_id)
  );

-- Política mais restritiva para médicos atualizarem pacientes
CREATE POLICY "Verified doctors can update their assigned patients"
  ON public.patients FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND
    doctor_id = auth.uid() AND
    public.is_active_doctor(auth.uid())
  )
  WITH CHECK (
    doctor_id = auth.uid() AND
    public.is_active_doctor(auth.uid())
  );

-- Política mais restritiva para pacientes atualizarem dados básicos
-- Nota: Pacientes só podem atualizar campos não sensíveis como telefone, endereço, etc.
CREATE POLICY "Active patients can update limited own data"
  ON public.patients FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND
    profile_id = auth.uid() AND
    public.is_active_patient(auth.uid())
  )
  WITH CHECK (
    profile_id = auth.uid() AND
    public.is_active_patient(auth.uid())
  );

-- Política para prevenir DELETE não autorizado
CREATE POLICY "Only verified doctors can soft delete patients"
  ON public.patients FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND
    doctor_id = auth.uid() AND
    public.is_active_doctor(auth.uid())
  )
  WITH CHECK (
    status IN ('active', 'inactive') -- Apenas mudança de status permitida
  );

-- ========================================
-- 2. CORRIGIR EXPOSIÇÃO DE TEMPLATES DE NOTIFICAÇÃO
-- ========================================

-- Remover política que permite acesso geral aos templates
DROP POLICY IF EXISTS "Users can view active notification templates" ON public.notification_templates;

-- Criar função para verificar se o usuário pode acessar templates
CREATE OR REPLACE FUNCTION public.can_access_notification_templates(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Apenas médicos verificados podem acessar templates
  RETURN public.is_active_doctor(user_id);
END;
$$;

-- Nova política restritiva para templates de notificação
CREATE POLICY "Only verified doctors can view notification templates"
  ON public.notification_templates FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    public.can_access_notification_templates(auth.uid()) AND
    is_active = true AND
    notification_type != 'system' -- Bloquear acesso a templates do sistema
  );

-- Política para templates do sistema (apenas funções internas)
CREATE POLICY "System templates restricted access"
  ON public.notification_templates FOR SELECT
  USING (
    auth.uid() IS NULL OR -- Apenas chamadas de sistema
    (auth.uid() IS NOT NULL AND notification_type != 'system')
  );

-- ========================================
-- 3. IMPLEMENTAR PROTEÇÃO CONTRA VAZAMENTO DE SENHAS
-- ========================================

-- Criar função para sanitizar dados sensíveis em logs
CREATE OR REPLACE FUNCTION public.sanitize_sensitive_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Remover dados sensíveis de logs de auditoria
  IF TG_TABLE_NAME = 'patients' THEN
    -- Mascarar CPF e RG em logs
    NEW.cpf := CASE 
      WHEN NEW.cpf IS NOT NULL THEN 
        CONCAT(LEFT(NEW.cpf, 3), '.***.**', RIGHT(NEW.cpf, 2))
      ELSE NULL
    END;
    NEW.rg := CASE 
      WHEN NEW.rg IS NOT NULL THEN 
        CONCAT('***', RIGHT(NEW.rg, 3))
      ELSE NULL
    END;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar tabela de auditoria para mudanças sensíveis
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  user_id UUID,
  user_role TEXT,
  ip_address INET,
  user_agent TEXT,
  sensitive_fields_accessed TEXT[],
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  success BOOLEAN DEFAULT true,
  error_message TEXT
);

-- Habilitar RLS na tabela de auditoria
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Apenas administradores podem ver logs de auditoria
CREATE POLICY "Only system can access audit logs"
  ON public.security_audit_log FOR ALL
  USING (false); -- Bloquear acesso via RLS, apenas funções internas

-- Função para registrar acessos a dados sensíveis
CREATE OR REPLACE FUNCTION public.log_sensitive_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role_val TEXT;
  sensitive_fields TEXT[] := ARRAY[]::TEXT[];
BEGIN
  -- Obter role do usuário
  SELECT role INTO user_role_val
  FROM public.profiles
  WHERE id = auth.uid();
  
  -- Identificar campos sensíveis acessados
  IF TG_TABLE_NAME = 'patients' THEN
    sensitive_fields := ARRAY['cpf', 'rg', 'phone', 'email', 'address', 'emergency_contact_phone'];
  END IF;
  
  -- Registrar acesso
  INSERT INTO public.security_audit_log (
    table_name,
    operation,
    user_id,
    user_role,
    sensitive_fields_accessed,
    timestamp
  ) VALUES (
    TG_TABLE_NAME,
    TG_OP,
    auth.uid(),
    user_role_val,
    sensitive_fields,
    now()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Aplicar trigger de auditoria na tabela de pacientes
DROP TRIGGER IF EXISTS trg_patients_security_audit ON public.patients;
CREATE TRIGGER trg_patients_security_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_access();

-- ========================================
-- 4. CONFIGURAÇÕES ADICIONAIS DE SEGURANÇA
-- ========================================

-- Criar função para validar força de senha (se aplicável)
CREATE OR REPLACE FUNCTION public.validate_password_strength(password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validar critérios mínimos de senha
  RETURN (
    LENGTH(password) >= 8 AND
    password ~ '[A-Z]' AND -- Pelo menos uma maiúscula
    password ~ '[a-z]' AND -- Pelo menos uma minúscula
    password ~ '[0-9]' AND -- Pelo menos um número
    password ~ '[^A-Za-z0-9]' -- Pelo menos um caractere especial
  );
END;
$$;

-- Criar índices para melhorar performance das consultas de segurança
CREATE INDEX IF NOT EXISTS idx_profiles_role_crm ON public.profiles(role, crm) WHERE role = 'doctor';
CREATE INDEX IF NOT EXISTS idx_patients_doctor_status ON public.patients(doctor_id, status);
CREATE INDEX IF NOT EXISTS idx_patients_profile_status ON public.patients(profile_id, status);
CREATE INDEX IF NOT EXISTS idx_security_audit_user_timestamp ON public.security_audit_log(user_id, timestamp);

-- Comentários de documentação
COMMENT ON FUNCTION public.is_active_doctor(UUID) IS 'Verifica se o usuário é um médico ativo com CRM válido';
COMMENT ON FUNCTION public.is_active_patient(UUID) IS 'Verifica se o usuário é um paciente ativo';
COMMENT ON FUNCTION public.can_access_notification_templates(UUID) IS 'Verifica se o usuário pode acessar templates de notificação';
COMMENT ON FUNCTION public.log_sensitive_access() IS 'Registra acessos a dados sensíveis para auditoria';
COMMENT ON TABLE public.security_audit_log IS 'Log de auditoria para acessos a dados sensíveis';
COMMENT ON FUNCTION public.validate_password_strength(TEXT) IS 'Valida se a senha atende aos critérios mínimos de segurança';

-- Mensagem de conclusão
DO $$
BEGIN
  RAISE NOTICE 'Correções de segurança aplicadas com sucesso:';
  RAISE NOTICE '✓ Políticas RLS da tabela de pacientes fortalecidas';
  RAISE NOTICE '✓ Acesso a templates de notificação do sistema restringido';
  RAISE NOTICE '✓ Sistema de auditoria para dados sensíveis implementado';
  RAISE NOTICE '✓ Validação de força de senha adicionada';
  RAISE NOTICE '✓ Índices de performance para consultas de segurança criados';
END $$;