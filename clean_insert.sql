-- Limpar e inserir dados de teste
DELETE FROM public.patients;

-- Inserir paciente de teste
INSERT INTO public.patients (
    doctor_id, 
    patient_number, 
    full_name, 
    birth_date, 
    gender, 
    cpf, 
    phone, 
    email, 
    address, 
    city, 
    state, 
    zip_code, 
    blood_type, 
    status
) VALUES (
    'ef14284c-594f-40d4-92ac-8f83f8f83ce3',
    'P999',
    'Maria Silva Santos',
    '1985-03-15',
    'female',
    '999.999.999-99',
    '(11) 3333-1234',
    'maria.test@email.com',
    'Rua das Flores, 123',
    'São Paulo',
    'SP',
    '05435-000',
    'O+',
    'active'
);

-- Verificar inserção
SELECT COUNT(*) as total FROM public.patients;
SELECT patient_number, full_name FROM public.patients;