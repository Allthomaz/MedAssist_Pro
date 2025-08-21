-- Inserir um usuário médico de teste
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'dr.thomaz@email.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Dr. Thomaz Felipe", "role": "medico"}',
  false,
  'authenticated'
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data;

-- Inserir o perfil correspondente
INSERT INTO public.profiles (
  id,
  full_name,
  role,
  crm,
  specialty,
  created_at,
  updated_at
) VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'Dr. Thomaz Felipe',
  'medico',
  '123456-SP',
  'Clínica Médica',
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  crm = EXCLUDED.crm,
  specialty = EXCLUDED.specialty,
  updated_at = now();