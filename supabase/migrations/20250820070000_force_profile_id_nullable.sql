-- CORREÇÃO DEFINITIVA: Tornar profile_id nullable na tabela patients
-- Esta migração força a alteração da coluna profile_id para permitir NULL

-- 1. Verificar estado atual
DO $$
DECLARE
    is_nullable_current TEXT;
BEGIN
    SELECT is_nullable INTO is_nullable_current
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'patients' 
    AND column_name = 'profile_id';
    
    RAISE NOTICE 'Estado ANTES da alteração - profile_id is_nullable: %', is_nullable_current;
END $$;

-- 2. Forçar a alteração da coluna para permitir NULL
ALTER TABLE public.patients ALTER COLUMN profile_id DROP NOT NULL;

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
    
    RAISE NOTICE 'Estado APÓS a alteração - profile_id is_nullable: %', is_nullable_after;
    
    IF is_nullable_after = 'YES' THEN
        RAISE NOTICE 'SUCESSO: Coluna profile_id agora permite valores NULL';
    ELSE
        RAISE EXCEPTION 'ERRO: Falha ao tornar profile_id nullable';
    END IF;
END $$;

-- 4. Atualizar comentário
COMMENT ON COLUMN public.patients.profile_id IS 
'Referência ao perfil do usuário paciente (OPCIONAL - null para pacientes sem conta no sistema)';

-- 5. Garantir que as políticas RLS estejam corretas
-- Remover políticas antigas que podem estar causando problemas
DROP POLICY IF EXISTS "Patients can view their own data" ON public.patients;
DROP POLICY IF EXISTS "Patients can update their own basic info" ON public.patients;

-- Recriar políticas que lidam corretamente com profile_id NULL
CREATE POLICY "Patients can view their own data"
  ON public.patients FOR SELECT
  USING (profile_id IS NOT NULL AND profile_id = (select auth.uid()));

CREATE POLICY "Patients can update their own basic info"
  ON public.patients FOR UPDATE
  USING (profile_id IS NOT NULL AND profile_id = (select auth.uid()))
  WITH CHECK (profile_id IS NOT NULL AND profile_id = (select auth.uid()));

-- 6. Log final
DO $$
BEGIN
    RAISE NOTICE 'MIGRAÇÃO CONCLUÍDA: profile_id agora é definitivamente nullable';
END $$;