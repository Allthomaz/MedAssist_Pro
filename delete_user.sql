-- Script para excluir o usuário dr.thomaz@email.com
-- Execute este script no Supabase local

-- Primeiro, excluir o perfil da tabela profiles
DELETE FROM profiles WHERE email = 'dr.thomaz@email.com';

-- Depois, excluir o usuário da tabela auth.users
DELETE FROM auth.users WHERE email = 'dr.thomaz@email.com';

-- Verificar se foi excluído
SELECT COUNT(*) as usuarios_restantes FROM auth.users WHERE email = 'dr.thomaz@email.com';
SELECT COUNT(*) as perfis_restantes FROM profiles WHERE email = 'dr.thomaz@email.com';