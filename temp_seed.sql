-- Primeiro criar um perfil se não existir
INSERT INTO public.profiles (id, full_name, email, phone, role) VALUES
('ef14284c-594f-40d4-92ac-8f83f8f83ce3', 'Dr. Thomaz', 'tmz.contatos@gmail.com', '(11) 99999-0000', 'doctor')
ON CONFLICT (id) DO NOTHING;

-- Inserir pacientes de exemplo
INSERT INTO public.patients (profile_id, doctor_id, patient_number, full_name, birth_date, gender, cpf, phone, mobile_phone, email, address, address_number, neighborhood, city, state, zip_code, emergency_contact_name, emergency_contact_relationship, emergency_contact_phone, blood_type, allergies, chronic_conditions, current_medications, insurance_company, insurance_number, status) VALUES
('ef14284c-594f-40d4-92ac-8f83f8f83ce3', 'ef14284c-594f-40d4-92ac-8f83f8f83ce3', 'P001', 'Maria Silva Santos', '1985-03-15', 'female', '123.456.789-01', '(11) 3333-1234', '(11) 99999-1234', 'maria.silva@email.com', 'Rua das Flores', '123', 'Vila Madalena', 'São Paulo', 'SP', '05435-000', 'João Santos', 'esposo', '(11) 88888-5678', 'O+', ARRAY['Penicilina'], ARRAY['Hipertensão arterial'], ARRAY['Losartana 50mg'], 'Unimed', 'UN123456789', 'active'),
('ef14284c-594f-40d4-92ac-8f83f8f83ce3', 'ef14284c-594f-40d4-92ac-8f83f8f83ce3', 'P002', 'Carlos Eduardo Lima', '1978-07-22', 'male', '987.654.321-02', '(11) 2222-9012', '(11) 77777-9012', 'carlos.lima@email.com', 'Av. Paulista', '456', 'Bela Vista', 'São Paulo', 'SP', '01310-100', 'Ana Lima', 'esposa', '(11) 66666-3456', 'A-', ARRAY['Nenhuma conhecida'], ARRAY['Diabetes tipo 2'], ARRAY['Metformina 850mg'], 'Bradesco Saúde', 'BS987654321', 'active'),
('ef14284c-594f-40d4-92ac-8f83f8f83ce3', 'ef14284c-594f-40d4-92ac-8f83f8f83ce3', 'P003', 'Ana Paula Costa', '1992-11-08', 'female', '456.789.123-03', '(11) 1111-7890', '(11) 55555-7890', 'ana.costa@email.com', 'Rua Augusta', '789', 'Consolação', 'São Paulo', 'SP', '01305-000', 'Pedro Costa', 'irmão', '(11) 44444-2345', 'B+', ARRAY['Dipirona'], ARRAY['Asma'], ARRAY['Salbutamol spray'], 'SulAmérica', 'SA456789123', 'active')
ON CONFLICT DO NOTHING;

-- Inserir agendamentos de exemplo
INSERT INTO public.appointments (doctor_id, patient_id, appointment_date, appointment_time, duration, appointment_type, status, notes, location) 
SELECT 
    'ef14284c-594f-40d4-92ac-8f83f8f83ce3',
    p.id,
    CURRENT_DATE + INTERVAL '1 day',
    '09:00',
    30,
    'consulta',
    'agendada',
    'Consulta de rotina',
    'Consultório 1'
FROM public.patients p 
WHERE p.patient_number = 'P001'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.appointments (doctor_id, patient_id, appointment_date, appointment_time, duration, appointment_type, status, notes, location) 
SELECT 
    'ef14284c-594f-40d4-92ac-8f83f8f83ce3',
    p.id,
    CURRENT_DATE + INTERVAL '2 days',
    '14:30',
    45,
    'retorno',
    'agendada',
    'Retorno para avaliação',
    'Consultório 1'
FROM public.patients p 
WHERE p.patient_number = 'P002'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Inserir consultas de exemplo
INSERT INTO public.consultations (doctor_id, patient_id, consultation_date, consultation_time, scheduled_duration, consultation_type, status, chief_complaint, consultation_mode, location, clinical_notes, diagnosis, treatment_plan) 
SELECT 
    'ef14284c-594f-40d4-92ac-8f83f8f83ce3',
    p.id,
    CURRENT_DATE - INTERVAL '7 days',
    '09:00',
    35,
    'retorno',
    'finalizada',
    'Dor no peito e falta de ar',
    'presencial',
    'Consultório 1',
    'Paciente relata dor precordial aos esforços. Exame físico normal. ECG sem alterações.',
    'Dor torácica atípica',
    'Orientações sobre estilo de vida. Retorno em 30 dias.'
FROM public.patients p 
WHERE p.patient_number = 'P001'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.consultations (doctor_id, patient_id, consultation_date, consultation_time, scheduled_duration, consultation_type, status, chief_complaint, consultation_mode, location, clinical_notes, diagnosis, treatment_plan) 
SELECT 
    'ef14284c-594f-40d4-92ac-8f83f8f83ce3',
    p.id,
    CURRENT_DATE - INTERVAL '14 days',
    '10:30',
    50,
    'primeira_consulta',
    'finalizada',
    'Consulta de rotina',
    'presencial',
    'Consultório 1',
    'Paciente assintomático. Exames laboratoriais dentro da normalidade.',
    'Paciente hígido',
    'Manter acompanhamento anual.'
FROM public.patients p 
WHERE p.patient_number = 'P002'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Inserir notificações de exemplo
INSERT INTO public.notifications (user_id, title, message, type, status, scheduled_for) VALUES
('ef14284c-594f-40d4-92ac-8f83f8f83ce3', 'Consulta Agendada', 'Você tem uma consulta agendada para amanhã às 09:00', 'appointment_reminder', 'pending', CURRENT_TIMESTAMP + INTERVAL '1 day'),
('ef14284c-594f-40d4-92ac-8f83f8f83ce3', 'Relatório Disponível', 'O relatório da consulta de Maria Silva Santos está disponível', 'report_ready', 'unread', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;