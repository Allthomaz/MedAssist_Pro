-- TESTE: Desabilitar RLS temporariamente para eliminar política recursiva
-- Esta migração desabilita RLS, remove todas as políticas e reabilita apenas as necessárias

-- 1. Remover a política recursiva específica
DROP POLICY IF EXISTS "Doctors can view patient profiles" ON public.profiles;

-- 2. Desabilitar RLS temporariamente
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 3. Aguardar um momento
SELECT pg_sleep(1);

-- 4. Reabilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Remover todas as políticas existentes
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', policy_record.policyname);
        RAISE NOTICE 'Removida política: %', policy_record.policyname;
    END LOOP;
END $$;

-- 6. Criar apenas as 3 políticas seguras
CREATE POLICY "users_view_own_profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_insert_own_profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own_profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 7. Verificação final
DO $$
DECLARE
    policy_count INTEGER;
    recursive_policy_exists BOOLEAN;
BEGIN
    -- Contar políticas
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles';
    
    -- Verificar se a política recursiva existe
    SELECT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles' 
        AND policyname = 'Doctors can view patient profiles'
    ) INTO recursive_policy_exists;
    
    RAISE NOTICE 'Total de políticas: %', policy_count;
    
    IF recursive_policy_exists THEN
        RAISE EXCEPTION 'FALHA: A política recursiva ainda existe após desabilitar/reabilitar RLS!';
    END IF;
    
    IF policy_count != 3 THEN
        RAISE EXCEPTION 'FALHA: Número incorreto de políticas. Esperado: 3, Atual: %', policy_count;
    END IF;
    
    RAISE NOTICE 'SUCESSO: RLS reconfigurado corretamente com 3 políticas seguras';
END $$;

-- 8. Log das políticas existentes
DO $$
DECLARE
    policy_names TEXT;
BEGIN
    SELECT string_agg(policyname, ', ' ORDER BY policyname) INTO policy_names
    FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles';
    
    RAISE NOTICE 'Políticas finais: %', policy_names;
END $$;