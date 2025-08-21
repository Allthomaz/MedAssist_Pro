-- Atualizar o perfil existente para médico
UPDATE public.profiles 
SET 
  role = 'medico',
  full_name = 'Dr. Thomaz Felipe',
  crm = 'CRM/SP 123456',
  specialty = 'Clínica Geral',
  clinic_name = 'Clínica Médica São Paulo'
WHERE id = '462d3a72-da15-4576-988c-2767808361ee';

-- Verificar se a atualização foi bem-sucedida
SELECT id, full_name, role, email, crm, specialty, clinic_name
FROM public.profiles 
WHERE id = '462d3a72-da15-4576-988c-2767808361ee';