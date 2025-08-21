-- REMOÇÃO NUCLEAR DA POLÍTICA RECURSIVA
-- Esta migração usa uma abordagem mais agressiva para remover definitivamente
-- a política "Doctors can view patient profiles" que continua reaparecendo

-- 1. Desabilitar RLS temporariamente
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 2. Remover TODAS as políticas da tabela profiles
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Iterar sobre todas as políticas da tabela profiles e removê-las
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', policy_record.policyname);
        RAISE NOTICE 'Removida política: %', policy_record.policyname;
    END LOOP;
END $$;

-- 3. Verificar se todas as políticas foram removidas
DO $$
DECLARE
    remaining_policies INTEGER;
BEGIN
    SELECT COUNT(*) INTO remaining_policies
    FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles';
    
    IF remaining_policies > 0 THEN
        RAISE EXCEPTION 'ERRO: Ainda existem % políticas na tabela profiles', remaining_policies;
    ELSE
        RAISE NOTICE 'SUCESSO: Todas as políticas foram removidas da tabela profiles';
    END IF;
END $$;

-- 4. Reabilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Criar APENAS as 3 políticas seguras
CREATE POLICY "users_view_own_profile"
    ON public.profiles FOR SELECT
    USING ((select auth.uid()) = id);

CREATE POLICY "users_insert_own_profile"
    ON public.profiles FOR INSERT
    WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "users_update_own_profile"
    ON public.profiles FOR UPDATE
    USING ((select auth.uid()) = id)
    WITH CHECK ((select auth.uid()) = id);

-- 6. Verificação final com falha se política recursiva existir
DO $$
DECLARE
    policy_count INTEGER;
    policy_names TEXT;
    recursive_exists BOOLEAN;
BEGIN
    -- Contar políticas totais
    SELECT COUNT(*), string_agg(policyname, ', ') INTO policy_count, policy_names
    FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles';
    
    -- Verificar especificamente a política recursiva
    SELECT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles' 
        AND policyname = 'Doctors can view patient profiles'
    ) INTO recursive_exists;
    
    RAISE NOTICE 'Total de políticas na tabela profiles: %', policy_count;
    RAISE NOTICE 'Políticas existentes: %', COALESCE(policy_names, 'nenhuma');
    
    IF recursive_exists THEN
        RAISE EXCEPTION 'ERRO CRÍTICO: A política recursiva "Doctors can view patient profiles" ainda existe!';
    ELSE
        RAISE NOTICE 'SUCESSO TOTAL: Política recursiva eliminada definitivamente';
    END IF;
    
    IF policy_count != 3 THEN
        RAISE EXCEPTION 'ERRO: Esperadas 3 políticas, encontradas %', policy_count;
    END IF;
END $$;

-- 7. Comentário de segurança
COMMENT ON TABLE public.profiles IS 
'Tabela de perfis recriada sem políticas recursivas. '
'CRÍTICO: Nunca criar políticas que consultem a própria tabela profiles. '
'Médicos acessam dados de pacientes via tabela patients.';

-- 8. Log final concluído nos blocos DO acima