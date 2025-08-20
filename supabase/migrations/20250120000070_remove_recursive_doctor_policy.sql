-- Remover a política recursiva que ainda está causando o erro
-- A política "Doctors can view patient profiles" faz consulta na própria tabela profiles
-- causando recursão infinita

-- ========================================
-- REMOVER POLÍTICA RECURSIVA ESPECÍFICA
-- ========================================

-- Esta é a política que está causando o problema:
-- "Doctors can view patient profiles" com qual:
-- ((EXISTS ( SELECT 1 FROM profiles doctor_profile WHERE ((doctor_profile.id = auth.uid()) AND (doctor_profile.role = 'doctor'::text)))) AND (role = 'patient'::text))

DROP POLICY IF EXISTS "Doctors can view patient profiles" ON public.profiles;

-- ========================================
-- VERIFICAÇÃO E LOGS
-- ========================================

DO $$
BEGIN
  RAISE NOTICE 'Removida política recursiva "Doctors can view patient profiles" da tabela profiles';
  RAISE NOTICE 'Esta política causava recursão infinita ao consultar a própria tabela profiles';
  RAISE NOTICE 'Médicos devem acessar dados de pacientes através da tabela patients';
END $$;

-- Verificar políticas restantes
DO $$
DECLARE
    policy_count INTEGER;
    policy_names TEXT;
BEGIN
    -- Contar políticas restantes
    SELECT COUNT(*) INTO policy_count 
    FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles';
    
    -- Listar nomes das políticas restantes
    SELECT string_agg(policyname, ', ') INTO policy_names
    FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles';
    
    RAISE NOTICE 'Políticas restantes na tabela profiles: % (%)', policy_count, COALESCE(policy_names, 'nenhuma');
END $$;