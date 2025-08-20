-- Remoção definitiva da política recursiva que causa erro infinito
-- A política "Doctors can view patient profiles" faz consulta na própria tabela profiles

-- ========================================
-- REMOVER POLÍTICA RECURSIVA PROBLEMÁTICA
-- ========================================

-- Remover a política que causa recursão infinita
DROP POLICY IF EXISTS "Doctors can view patient profiles" ON public.profiles;

-- Log da correção
DO $$
BEGIN
  RAISE NOTICE 'Política recursiva "Doctors can view patient profiles" removida definitivamente';
  RAISE NOTICE 'Médicos devem acessar dados de pacientes através da tabela patients, não profiles';
END $$;

-- Verificar políticas restantes na tabela profiles
DO $$
DECLARE
    policy_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO policy_count 
    FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles';
    
    RAISE NOTICE 'Total de políticas RLS na tabela profiles: %', policy_count;
END $$;