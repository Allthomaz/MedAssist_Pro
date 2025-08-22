-- Remover perfil órfão que existe em profiles mas não em auth.users
-- ID: f47ac10b-58cc-4372-a567-0e02b2c3d479 (dr.thomaz@email.com)

-- Deletar o registro órfão da tabela profiles
DELETE FROM public.profiles 
WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

-- Verificar se foi removido com sucesso
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479') THEN
        RAISE EXCEPTION '❌ FALHA: Perfil órfão ainda existe na tabela profiles!';
    ELSE
        RAISE NOTICE '✅ SUCESSO: Perfil órfão f47ac10b-58cc-4372-a567-0e02b2c3d479 removido definitivamente!';
    END IF;
END $$;