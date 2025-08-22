-- Forçar exclusão do usuário dr.thomaz@email.com
-- Executar após seed para garantir remoção definitiva

DELETE FROM profiles WHERE email = 'dr.thomaz@email.com';
DELETE FROM auth.users WHERE email = 'dr.thomaz@email.com';