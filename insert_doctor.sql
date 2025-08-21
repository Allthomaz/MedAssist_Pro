-- Inserir um perfil de médico para teste
INSERT INTO public.profiles (id, full_name, email, role, crm, specialty, clinic_name)
VALUES (
  'fb58ab3e-a385-4d78-9db2-d14b572b7ab4',
  'Dr. Thomaz Felipe',
  'tmz.contatos@gmail.com',
  'medico',
  'CRM/SP 123456',
  'Clínica Geral',
  'Clínica Médica São Paulo'
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  crm = EXCLUDED.crm,
  specialty = EXCLUDED.specialty,
  clinic_name = EXCLUDED.clinic_name;

-- Verificar se a inserção foi bem-sucedida
SELECT id, full_name, role, email, crm, specialty
FROM public.profiles
WHERE id = 'fb58ab3e-a385-4d78-9db2-d14b572b7ab4';