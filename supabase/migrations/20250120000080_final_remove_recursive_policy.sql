-- =====================================================
-- REMOÇÃO DEFINITIVA DA POLÍTICA RECURSIVA
-- =====================================================

-- Esta migração remove definitivamente a política "Doctors can view patient profiles"
-- que causa recursão infinita na tabela profiles

-- 1. Remover a política recursiva da tabela profiles
DROP POLICY IF EXISTS "Doctors can view patient profiles" ON public.profiles;

-- 2. Verificar se a política foi removida
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

-- 3. Comentário de documentação
COMMENT ON TABLE public.profiles IS 
'Tabela de perfis de usuários. '
'IMPORTANTE: Esta tabela NÃO deve ter políticas que façam consultas recursivas em si mesma. '
'Médicos devem acessar dados de pacientes através da tabela patients, não profiles.';

-- 4. Verificação final das políticas restantes
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies 
  WHERE schemaname = 'public' 
  AND tablename = 'profiles';
  
  RAISE NOTICE 'Total de políticas na tabela profiles: %', policy_count;
END $$;