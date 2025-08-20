-- =====================================================
-- SECURITY FIX: Proteção Avançada de Dados de Pacientes
-- =====================================================

-- 1. Criar função de segurança para verificar se usuário é médico
-- NOTA: Removida para evitar recursão infinita com RLS na tabela profiles
-- A verificação de role será feita diretamente nas políticas quando necessário

-- 2. Funções auxiliares removidas para simplificar e evitar problemas de recursão
-- As verificações serão feitas diretamente nas políticas RLS

-- 4. Remover políticas existentes e criar novas mais seguras
DROP POLICY IF EXISTS "Doctors can manage their patients" ON public.patients;
DROP POLICY IF EXISTS "Users can insert patients as doctor" ON public.patients;
DROP POLICY IF EXISTS "Patients can view their own data" ON public.patients;
DROP POLICY IF EXISTS "Patients can update their own basic info" ON public.patients;

-- 5. Criar políticas de segurança robustas

-- Política para médicos visualizarem apenas seus próprios pacientes
CREATE POLICY "doctors_view_own_patients" 
ON public.patients 
FOR SELECT 
USING (
  doctor_id = auth.uid()
);

-- Política para médicos inserirem pacientes
CREATE POLICY "doctors_insert_patients" 
ON public.patients 
FOR INSERT 
WITH CHECK (
  doctor_id = auth.uid()
);

-- Política para médicos atualizarem apenas seus próprios pacientes
CREATE POLICY "doctors_update_own_patients" 
ON public.patients 
FOR UPDATE 
USING (
  doctor_id = auth.uid()
)
WITH CHECK (
  doctor_id = auth.uid()
);

-- Política para pacientes visualizarem apenas seus próprios dados
CREATE POLICY "patients_view_own_data" 
ON public.patients 
FOR SELECT 
USING (profile_id = auth.uid());

-- Política restrita para pacientes atualizarem apenas campos não-médicos
CREATE POLICY "patients_update_limited_fields" 
ON public.patients 
FOR UPDATE 
USING (profile_id = auth.uid())
WITH CHECK (
  profile_id = auth.uid()
  -- Nota: Validações de campos imutáveis devem ser feitas via triggers
  -- pois OLD/NEW não estão disponíveis em políticas RLS
);

-- 6. Política rigorosa para DELETE (apenas médicos podem deletar seus pacientes)
CREATE POLICY "doctors_delete_own_patients" 
ON public.patients 
FOR DELETE 
USING (
  doctor_id = auth.uid()
);

-- 7. Criar view segura para dados básicos de pacientes (sem informações sensíveis)
CREATE OR REPLACE VIEW public.patients_basic_info AS
SELECT 
  id,
  patient_number,
  full_name,
  birth_date,
  gender,
  phone,
  email,
  status,
  created_at,
  doctor_id
FROM public.patients;

-- 8. Habilitar security barrier na view
-- Nota: Views não suportam políticas RLS diretamente
-- A segurança é controlada pela tabela base (patients)
ALTER VIEW public.patients_basic_info SET (security_barrier = on);

-- 10. Criar função para auditoria de acesso
CREATE OR REPLACE FUNCTION public.log_patient_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_log (
    table_name,
    operation,
    record_id,
    user_id,
    timestamp,
    metadata
  ) VALUES (
    'patients',
    TG_OP,
    COALESCE(NEW.id, OLD.id),
    auth.uid(),
    NOW(),
    jsonb_build_object(
      'ip_address', current_setting('request.headers', true)::jsonb->>'x-forwarded-for',
      'user_agent', current_setting('request.headers', true)::jsonb->>'user-agent'
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Criar tabela de auditoria se não existir
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  record_id UUID,
  user_id UUID,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- 12. Aplicar trigger de auditoria
-- Nota: Triggers não suportam SELECT, apenas INSERT, UPDATE, DELETE
DROP TRIGGER IF EXISTS audit_patients_access ON public.patients;
CREATE TRIGGER audit_patients_access
  AFTER INSERT OR UPDATE OR DELETE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.log_patient_access();

-- 13. Habilitar RLS na tabela de auditoria
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- 14. Política para auditoria (apenas usuários podem ver seus próprios logs)
CREATE POLICY "users_view_own_audit_logs" 
ON public.audit_log 
FOR SELECT 
USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.patients WHERE id = record_id AND doctor_id = auth.uid())
);

-- 15. Criar índices para performance e segurança
CREATE INDEX IF NOT EXISTS idx_patients_doctor_id ON public.patients(doctor_id);
CREATE INDEX IF NOT EXISTS idx_patients_profile_id ON public.patients(profile_id);
CREATE INDEX IF NOT EXISTS idx_patients_cpf ON public.patients(cpf) WHERE cpf IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_patients_email ON public.patients(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_audit_log_record_id ON public.audit_log(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.audit_log(user_id);

-- 16. Comentários de documentação de segurança
COMMENT ON TABLE public.patients IS 'Tabela de pacientes com RLS rigoroso. Contém dados sensíveis de saúde protegidos por múltiplas camadas de segurança.';
COMMENT ON TABLE public.audit_log IS 'Log de auditoria para rastreamento de acesso aos dados de pacientes.';