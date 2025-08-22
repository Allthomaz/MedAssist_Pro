-- Migração final para excluir definitivamente o usuário dr.thomaz@email.com
-- Esta migração será executada após o seed para garantir a remoção

-- Excluir o perfil da tabela profiles
DELETE FROM profiles WHERE email = 'dr.thomaz@email.com';

-- Excluir o usuário da tabela auth.users
DELETE FROM auth.users WHERE email = 'dr.thomaz@email.com';

-- Confirmar exclusão
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'dr.thomaz@email.com') THEN
        RAISE NOTICE 'Usuário dr.thomaz@email.com removido com sucesso da tabela profiles';
    ELSE
        RAISE EXCEPTION 'Falha ao remover usuário dr.thomaz@email.com da tabela profiles';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dr.thomaz@email.com') THEN
        RAISE NOTICE 'Usuário dr.thomaz@email.com removido com sucesso da tabela auth.users';
    ELSE
        RAISE EXCEPTION 'Falha ao remover usuário dr.thomaz@email.com da tabela auth.users';
    END IF;
END $$;