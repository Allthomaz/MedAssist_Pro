-- Migração final para remover definitivamente o usuário dr.thomaz@email.com
-- Esta migração desabilita o trigger, remove o usuário e reabilita o trigger

-- 1. Desabilitar o trigger temporariamente (apenas para esta sessão)
SET session_replication_role = replica;

-- 2. Remover completamente o usuário de todas as tabelas
DELETE FROM public.profiles WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479' OR email = 'dr.thomaz@email.com';
DELETE FROM auth.users WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479' OR email = 'dr.thomaz@email.com';
DELETE FROM auth.identities WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM auth.sessions WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM auth.refresh_tokens WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

-- 3. Reabilitar o trigger
SET session_replication_role = DEFAULT;

-- 4. Verificação final
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479' OR email = 'dr.thomaz@email.com') THEN
        RAISE EXCEPTION '❌ FALHA: Usuário dr.thomaz@email.com ainda existe em profiles!';
    END IF;
    
    IF EXISTS (SELECT 1 FROM auth.users WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479' OR email = 'dr.thomaz@email.com') THEN
        RAISE EXCEPTION '❌ FALHA: Usuário dr.thomaz@email.com ainda existe em auth.users!';
    END IF;
    
    RAISE NOTICE '🎯 SUCESSO FINAL: Usuário dr.thomaz@email.com foi DEFINITIVAMENTE removido!';
END $$;