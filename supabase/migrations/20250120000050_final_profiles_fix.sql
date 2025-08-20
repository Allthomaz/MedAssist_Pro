-- Correção final para recursão infinita na tabela profiles
-- Remove todas as políticas e cria apenas as essenciais

-- ========================================
-- DESABILITAR RLS TEMPORARIAMENTE
-- ========================================

ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- ========================================
-- REMOVER TODAS AS POLÍTICAS EXISTENTES
-- ========================================

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Doctors can view patient profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can only view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- ========================================
-- REABILITAR RLS E CRIAR POLÍTICAS SIMPLES
-- ========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política simples para SELECT
CREATE POLICY "profiles_select_policy"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

-- Política simples para INSERT
CREATE POLICY "profiles_insert_policy"
  ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- Política simples para UPDATE
CREATE POLICY "profiles_update_policy"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ========================================
-- LOG E VERIFICAÇÃO
-- ========================================

DO $$
DECLARE
    policy_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO policy_count 
    FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles';
    
    RAISE NOTICE 'Correção final aplicada. Total de políticas na tabela profiles: %', policy_count;
    RAISE NOTICE 'Políticas criadas: profiles_select_policy, profiles_insert_policy, profiles_update_policy';
END $$;