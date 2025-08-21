-- =====================================================
-- REMOÇÃO FORÇADA DA POLÍTICA RECURSIVA
-- =====================================================

-- Esta migração força a remoção da política recursiva que persiste
-- mesmo após tentativas anteriores de remoção

-- 1. Desabilitar RLS temporariamente para evitar conflitos
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 2. Remover TODAS as políticas da tabela profiles
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', policy_record.policyname);
        RAISE NOTICE 'Removida política: %', policy_record.policyname;
    END LOOP;
END $$;

-- 3. Reabilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Criar apenas as políticas seguras (sem recursão)
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

-- 5. Verificação final
DO $$
DECLARE
    policy_count INTEGER;
    policy_names TEXT;
    recursive_policy_exists BOOLEAN;
BEGIN
    -- Contar políticas
    SELECT COUNT(*), string_agg(policyname, ', ') INTO policy_count, policy_names
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles';
    
    -- Verificar se ainda existe política recursiva
    SELECT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles' 
        AND policyname = 'Doctors can view patient profiles'
    ) INTO recursive_policy_exists;
    
    IF recursive_policy_exists THEN
        RAISE EXCEPTION 'ERRO CRÍTICO: Política recursiva ainda existe após remoção forçada!';
    ELSE
        RAISE NOTICE 'SUCESSO: Política recursiva removida definitivamente';
    END IF;
    
    RAISE NOTICE 'Total de políticas na tabela profiles: %', policy_count;
    RAISE NOTICE 'Políticas existentes: %', policy_names;
END $$;

-- 6. Comentário de segurança
COMMENT ON TABLE public.profiles IS 
'Tabela de perfis de usuários. '
'CRÍTICO: Esta tabela NÃO deve ter políticas que façam consultas recursivas em si mesma. '
'Médicos devem acessar dados de pacientes através da tabela patients, não profiles. '
'Qualquer política que consulte a própria tabela profiles causará recursão infinita.';