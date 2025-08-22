-- Migração para excluir o usuário dr.thomaz@email.com
-- Este usuário foi criado incorretamente e precisa ser removido

-- Primeiro, excluir o perfil da tabela profiles
DELETE FROM profiles WHERE email = 'dr.thomaz@email.com';

-- Depois, excluir o usuário da tabela auth.users
DELETE FROM auth.users WHERE email = 'dr.thomaz@email.com';