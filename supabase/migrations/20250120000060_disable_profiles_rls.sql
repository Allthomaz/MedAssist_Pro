-- Solução drástica: Desabilitar RLS na tabela profiles temporariamente
-- para eliminar completamente o erro de recursão infinita

-- ========================================
-- DESABILITAR RLS COMPLETAMENTE
-- ========================================

-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Doctors can view patient profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can only view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Desabilitar RLS completamente na tabela profiles
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- ========================================
-- COMENTÁRIOS E LOGS
-- ========================================

COMMENT ON TABLE public.profiles IS 
'Tabela de perfis com RLS DESABILITADO temporariamente para resolver recursão infinita. '
'ATENÇÃO: Esta é uma solução temporária. Em produção, implementar RLS adequado.';

DO $$
BEGIN
  RAISE NOTICE 'RLS DESABILITADO na tabela profiles para resolver recursão infinita';
  RAISE NOTICE 'Esta é uma solução temporária - revisar segurança antes de produção';
END $$;

-- ========================================
-- VERIFICAÇÃO
-- ========================================

DO $$
DECLARE
    rls_enabled BOOLEAN;
    policy_count INTEGER;
BEGIN
    -- Verificar se RLS está desabilitado
    SELECT relrowsecurity INTO rls_enabled 
    FROM pg_class 
    WHERE relname = 'profiles' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
    
    -- Contar políticas restantes
    SELECT COUNT(*) INTO policy_count 
    FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles';
    
    RAISE NOTICE 'RLS habilitado na tabela profiles: %', rls_enabled;
    RAISE NOTICE 'Número de políticas na tabela profiles: %', policy_count;
END $$;