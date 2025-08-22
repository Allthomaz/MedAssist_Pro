-- Migração para bloquear permanentemente a criação do usuário dr.thomaz@email.com
-- Esta migração cria uma constraint que impede a inserção deste usuário específico

-- 1. Primeiro, remover o usuário se existir
DELETE FROM public.profiles WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479' OR email = 'dr.thomaz@email.com';
DELETE FROM auth.users WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479' OR email = 'dr.thomaz@email.com';

-- 2. Criar uma função que bloqueia a inserção do usuário específico
CREATE OR REPLACE FUNCTION block_dr_thomaz_insertion()
RETURNS TRIGGER AS $$
BEGIN
    -- Bloquear inserção do usuário específico
    IF NEW.id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479' OR NEW.email = 'dr.thomaz@email.com' THEN
        RAISE EXCEPTION 'BLOCKED: Usuário dr.thomaz@email.com foi permanentemente bloqueado!';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Criar trigger para bloquear inserções na tabela profiles
DROP TRIGGER IF EXISTS block_dr_thomaz_profiles ON public.profiles;
CREATE TRIGGER block_dr_thomaz_profiles
    BEFORE INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION block_dr_thomaz_insertion();

-- 4. Criar trigger para bloquear inserções na tabela auth.users
DROP TRIGGER IF EXISTS block_dr_thomaz_auth ON auth.users;
CREATE TRIGGER block_dr_thomaz_auth
    BEFORE INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION block_dr_thomaz_insertion();

-- 5. Verificação final
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479' OR email = 'dr.thomaz@email.com') THEN
        RAISE EXCEPTION '❌ FALHA: Usuário dr.thomaz@email.com ainda existe em profiles!';
    END IF;
    
    RAISE NOTICE '🔒 BLOQUEIO ATIVADO: Usuário dr.thomaz@email.com foi permanentemente bloqueado!';
END $$;