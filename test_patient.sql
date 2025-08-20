-- Teste de inserção de um único paciente
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
    'P001',
    'Maria Silva Santos',
    '1985-03-15',
    'female',
    '123.456.789-01',
    '(11) 3333-1234',
    'maria.silva@email.com',
    'Rua das Flores, 123',
    'São Paulo',
    'SP',
    '05435-000',
    'O+',
    'active'
);