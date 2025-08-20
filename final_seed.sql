-- Inserir dados finais corrigidos
DELETE FROM public.patients;
DELETE FROM public.appointments;
DELETE FROM public.consultations;

-- Inserir pacientes
INSERT INTO public.patients (
    doctor_id, patient_number, full_name, birth_date, gender, cpf, phone, mobile_phone, email, 
    address, address_number, neighborhood, city, state, zip_code, 
    emergency_contact_name, emergency_contact_relationship, emergency_contact_phone, 
    blood_type, allergies, chronic_conditions, current_medications, 
    insurance_company, insurance_number, status
) VALUES 
('ef14284c-594f-40d4-92ac-8f83f8f83ce3', 'P001', 'Maria Silva Santos', '1985-03-15', 'female', '123.456.789-01', '(11) 3333-1234', '(11) 99999-1234', 'maria.silva@email.com', 'Rua das Flores', '123', 'Vila Madalena', 'São Paulo', 'SP', '05435-000', 'João Santos', 'esposo', '(11) 88888-5678', 'O+', ARRAY['Penicilina'], ARRAY['Hipertensão arterial'], ARRAY['Losartana 50mg'], 'Unimed', 'UN123456789', 'active'),
('ef14284c-594f-40d4-92ac-8f83f8f83ce3', 'P002', 'Carlos Eduardo Lima', '1978-07-22', 'male', '987.654.321-02', '(11) 2222-9012', '(11) 77777-9012', 'carlos.lima@email.com', 'Av. Paulista', '456', 'Bela Vista', 'São Paulo', 'SP', '01310-100', 'Ana Lima', 'esposa', '(11) 66666-3456', 'A-', ARRAY['Nenhuma conhecida'], ARRAY['Diabetes tipo 2'], ARRAY['Metformina 850mg'], 'Bradesco Saúde', 'BS987654321', 'active'),
('ef14284c-594f-40d4-92ac-8f83f8f83ce3', 'P003', 'Ana Paula Costa', '1992-11-08', 'female', '456.789.123-03', '(11) 1111-7890', '(11) 55555-7890', 'ana.costa@email.com', 'Rua Augusta', '789', 'Consolação', 'São Paulo', 'SP', '01305-000', 'Pedro Costa', 'irmão', '(11) 44444-2345', 'B+', ARRAY['Dipirona'], ARRAY['Asma'], ARRAY['Salbutamol spray'], 'SulAmérica', 'SA456789123', 'active');

-- Inserir agendamentos
INSERT INTO public.appointments (
    patient_id, doctor_id, appointment_date, appointment_time, duration,
    appointment_type, status, consultation_mode, notes
) VALUES 
((SELECT id FROM public.patients WHERE patient_number = 'P001'), 'ef14284c-594f-40d4-92ac-8f83f8f83ce3', '2024-01-15', '09:00:00', 30, 'consulta_geral', 'agendado', 'presencial', 'Consulta de rotina'),
((SELECT id FROM public.patients WHERE patient_number = 'P002'), 'ef14284c-594f-40d4-92ac-8f83f8f83ce3', '2024-01-16', '14:30:00', 30, 'retorno', 'agendado', 'presencial', 'Acompanhamento diabetes'),
((SELECT id FROM public.patients WHERE patient_number = 'P003'), 'ef14284c-594f-40d4-92ac-8f83f8f83ce3', '2024-01-17', '10:15:00', 45, 'primeira_consulta', 'finalizado', 'presencial', 'Consulta para asma');

-- Inserir consultas (usando valores corretos das constraints)
INSERT INTO public.consultations (
    patient_id, doctor_id, consultation_date, consultation_time, scheduled_duration,
    consultation_type, consultation_mode, status,
    chief_complaint, clinical_notes, diagnosis, treatment_plan, 
    prescriptions, follow_up_date
) VALUES 
((SELECT id FROM public.patients WHERE patient_number = 'P001'), 'ef14284c-594f-40d4-92ac-8f83f8f83ce3', '2024-01-10', '09:00:00', 30, 'rotina', 'presencial', 'finalizada', 'Dor de cabeça frequente', 'Paciente relatou cefaleia e tontura', 'Cefaleia tensional', 'Repouso, hidratação adequada', 'Dipirona 500mg se necessário', '2024-02-10'),
((SELECT id FROM public.patients WHERE patient_number = 'P002'), 'ef14284c-594f-40d4-92ac-8f83f8f83ce3', '2024-01-12', '14:30:00', 30, 'retorno', 'presencial', 'finalizada', 'Controle de diabetes', 'Paciente com sede excessiva e fadiga', 'Diabetes tipo 2 controlado', 'Manter dieta e exercícios', 'Metformina 850mg 2x ao dia', '2024-02-12');

-- Verificar dados inseridos
SELECT 'Pacientes:' as tabela, COUNT(*) as total FROM public.patients
UNION ALL
SELECT 'Agendamentos:', COUNT(*) FROM public.appointments
UNION ALL
SELECT 'Consultas:', COUNT(*) FROM public.consultations;