-- Corrigir definitivamente a coluna profile_id para permitir valores NULL
-- O problema é que a migração anterior não foi aplicada corretamente

-- 1. Verificar o estado atual da coluna
DO $$
DECLARE
    is_nullable_current TEXT;
BEGIN
    SELECT is_nullable INTO is_nullable_current
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'patients' 
    AND column_name = 'profile_id';
    
    RAISE NOTICE 'Estado atual da coluna profile_id - is_nullable: %', is_nullable_current;
END $$;

-- 2. Tornar a coluna profile_id opcional (permitir NULL)
ALTER TABLE public.patients 
ALTER COLUMN profile_id DROP NOT NULL;

-- 3. Verificar se a alteração foi aplicada
DO $$
DECLARE
    is_nullable_after TEXT;
BEGIN
    SELECT is_nullable INTO is_nullable_after
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'patients' 
    AND column_name = 'profile_id';
    
    IF is_nullable_after = 'YES' THEN
        RAISE NOTICE 'SUCESSO: Coluna profile_id agora permite valores NULL';
    ELSE
        RAISE EXCEPTION 'ERRO: Coluna profile_id ainda não permite NULL';
    END IF;
END $$;

-- 4. Atualizar comentário para esclarecer o uso
COMMENT ON COLUMN public.patients.profile_id IS 
'Referência ao perfil do usuário paciente (opcional - null para pacientes sem conta no sistema)';

-- 5. Atualizar políticas RLS para lidar com profile_id NULL
-- Remover políticas que assumem profile_id sempre preenchido
DROP POLICY IF EXISTS "Patients can view their own data" ON public.patients;
DROP POLICY IF EXISTS "Patients can update their own basic info" ON public.patients;

-- Recriar políticas que verificam se profile_id não é null
CREATE POLICY "Patients can view their own data"
  ON public.patients FOR SELECT
  USING (profile_id IS NOT NULL AND profile_id = (select auth.uid()));

CREATE POLICY "Patients can update their own basic info"
  ON public.patients FOR UPDATE
  USING (profile_id IS NOT NULL AND profile_id = (select auth.uid()))
  WITH CHECK (profile_id IS NOT NULL AND profile_id = (select auth.uid()));

-- 6. Log de sucesso
DO $$
BEGIN
    RAISE NOTICE 'Migração concluída: profile_id agora é opcional na tabela patients';
END $$;