-- =====================================================
-- RECRIAÇÃO COMPLETA DA TABELA PROFILES
-- =====================================================

-- Esta migração recria completamente a tabela profiles para eliminar
-- definitivamente qualquer política recursiva persistente

-- 1. Backup dos dados existentes
CREATE TEMP TABLE profiles_backup AS 
SELECT * FROM public.profiles;

-- 3. Remover todas as políticas RLS
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

-- 4. Desabilitar RLS
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 5. Remover a tabela completamente
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 6. Recriar a tabela profiles do zero
CREATE TABLE public.profiles (
    id UUID NOT NULL PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    role TEXT NOT NULL CHECK (role IN ('doctor', 'patient')),
    phone TEXT,
    specialty TEXT,
    crm TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Recriar o trigger de updated_at
CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 9. Criar APENAS as políticas seguras (sem recursão)
CREATE POLICY "users_view_own_profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "users_insert_own_profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own_profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 10. Restaurar os dados do backup (apenas colunas compatíveis)
INSERT INTO public.profiles (id, full_name, email, role, phone, specialty, crm, created_at, updated_at)
SELECT id, full_name, email, role, phone, specialty, crm, created_at, updated_at 
FROM profiles_backup
ON CONFLICT (id) DO NOTHING;

-- 11. Verificação final rigorosa
DO $$
DECLARE
    policy_count INTEGER;
    policy_names TEXT;
    recursive_policy_exists BOOLEAN;
    doctor_policy_exists BOOLEAN;
BEGIN
    -- Contar políticas
    SELECT COUNT(*), string_agg(policyname, ', ') INTO policy_count, policy_names
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles';
    
    -- Verificar se ainda existe a política recursiva específica
    SELECT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles' 
        AND policyname = 'Doctors can view patient profiles'
    ) INTO recursive_policy_exists;
    
    -- Verificar se existe qualquer política que mencione 'doctor'
    SELECT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles' 
        AND (policyname ILIKE '%doctor%' OR qual ILIKE '%doctor%')
    ) INTO doctor_policy_exists;
    
    IF recursive_policy_exists THEN
        RAISE EXCEPTION 'ERRO CRÍTICO: Política recursiva "Doctors can view patient profiles" ainda existe!';
    END IF;
    
    IF doctor_policy_exists THEN
        RAISE EXCEPTION 'ERRO: Ainda existem políticas relacionadas a médicos na tabela profiles!';
    END IF;
    
    IF policy_count != 3 THEN
        RAISE EXCEPTION 'ERRO: Número incorreto de políticas. Esperado: 3, Atual: %', policy_count;
    END IF;
    
    RAISE NOTICE 'SUCESSO TOTAL: Tabela profiles recriada sem políticas recursivas';
    RAISE NOTICE 'Total de políticas: %', policy_count;
    RAISE NOTICE 'Políticas: %', policy_names;
END $$;

-- 12. Comentário de segurança crítica
COMMENT ON TABLE public.profiles IS 
'Tabela de perfis de usuários recriada para eliminar políticas recursivas. '
'CRÍTICO: Esta tabela NÃO deve ter políticas que façam consultas recursivas em si mesma. '
'Médicos devem acessar dados de pacientes através da tabela patients, não profiles. '
'QUALQUER política que consulte a própria tabela profiles causará recursão infinita e deve ser removida imediatamente.';