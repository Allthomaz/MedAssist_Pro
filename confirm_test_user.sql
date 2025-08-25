-- Confirmar email do usuário de teste
UPDATE auth.users 
SET email_confirmed_at = now() 
WHERE email = 'teste@medassist.com';

-- Verificar se o usuário foi confirmado
SELECT email, email_confirmed_at 
FROM auth.users 
WHERE email = 'teste@medassist.com';