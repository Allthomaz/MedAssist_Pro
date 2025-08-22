-- Script para criar um usuário de teste válido
-- Este script deve ser executado no Supabase SQL Editor

-- Primeiro, vamos limpar dados antigos se existirem
DELETE FROM auth.users WHERE email = 'test@medassist.com';
DELETE FROM profiles WHERE email = 'test@medassist.com';

-- Criar usuário na tabela auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'test@medassist.com',
  crypt('123456', gen_salt('bf')), -- senha: 123456
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Dr. Teste", "profession": "medico"}',
  false,
  'authenticated',
  'authenticated'
);

-- Obter o ID do usuário criado
DO $$
DECLARE
    user_id uuid;
BEGIN
    SELECT id INTO user_id FROM auth.users WHERE email = 'test@medassist.com';
    
    -- Criar perfil correspondente
    INSERT INTO profiles (
        id,
        full_name,
        role,
        email,
        created_at,
        updated_at
    ) VALUES (
        user_id,
        'Dr. Teste',
        'doctor',
        'test@medassist.com',
        now(),
        now()
    );
END $$;

-- Verificar se o usuário foi criado corretamente
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    p.full_name,
    p.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'test@medassist.com';