-- =====================================================
-- REMOÇÃO DEFINITIVA DA POLÍTICA RECURSIVA
-- =====================================================

-- Esta migração remove definitivamente a política "Doctors can view patient profiles"
-- que causa recursão infinita na tabela profiles

-- 1. Remover a política recursiva da tabela profiles
DROP POLICY IF EXISTS "Doctors can view patient profiles" ON public.profiles;

-- 2. Remover qualquer função que possa recriar essa política
DROP FUNCTION IF EXISTS public.is_doctor(UUID);
DROP FUNCTION IF EXISTS public.is_patient_doctor(UUID, UUID);
DROP FUNCTION IF EXISTS public.is_own_patient_record(UUID, UUID);

-- 3. Verificar se a política foi removida
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Doctors can view patient profiles'
  ) THEN
    RAISE EXCEPTION 'ERRO: Política recursiva ainda existe após tentativa de remoção!';
  ELSE
    RAISE NOTICE 'SUCESSO: Política recursiva "Doctors can view patient profiles" removida definitivamente';
  END IF;
END $$;

-- 4. Garantir que apenas as políticas seguras existam na tabela profiles
-- Remover todas as políticas e recriar apenas as necessárias
DROP POLICY IF EXISTS "Users can only view their own profile" ON public.profiles;

-- Recriar apenas as políticas seguras (sem recursão)
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING ((select auth.uid()) = id);

-- 5. Comentário de documentação
COMMENT ON TABLE public.profiles IS 
'Tabela de perfis de usuários. '
'IMPORTANTE: Esta tabela NÃO deve ter políticas que façam consultas recursivas em si mesma. '
'Médicos devem acessar dados de pacientes através da tabela patients, não profiles.';

-- 6. Verificação final das políticas restantes
DO $$
DECLARE
  policy_count INTEGER;
  policy_names TEXT;
BEGIN
  SELECT COUNT(*), string_agg(policyname, ', ') INTO policy_count, policy_names
  FROM pg_policies 
  WHERE schemaname = 'public' 
  AND tablename = 'profiles';
  
  RAISE NOTICE 'Total de políticas na tabela profiles: %', policy_count;
  RAISE NOTICE 'Políticas existentes: %', policy_names;
END $$;