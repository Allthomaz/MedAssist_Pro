-- Inserir apenas consultas com números únicos
INSERT INTO public.consultations (
    patient_id, doctor_id, consultation_number, consultation_date, consultation_time, scheduled_duration,
    consultation_type, consultation_mode, status,
    chief_complaint, clinical_notes, diagnosis, treatment_plan, 
    prescriptions, follow_up_date
) VALUES 
((SELECT id FROM public.patients WHERE patient_number = 'P001'), 'ef14284c-594f-40d4-92ac-8f83f8f83ce3', 'CONS25000010', '2024-01-10', '09:00:00', 30, 'rotina', 'presencial', 'finalizada', 'Dor de cabeça frequente', 'Paciente relatou cefaleia e tontura', 'Cefaleia tensional', 'Repouso, hidratação adequada', 'Dipirona 500mg se necessário', '2024-02-10'),
((SELECT id FROM public.patients WHERE patient_number = 'P002'), 'ef14284c-594f-40d4-92ac-8f83f8f83ce3', 'CONS25000011', '2024-01-12', '14:30:00', 30, 'retorno', 'presencial', 'finalizada', 'Controle de diabetes', 'Paciente com sede excessiva e fadiga', 'Diabetes tipo 2 controlado', 'Manter dieta e exercícios', 'Metformina 850mg 2x ao dia', '2024-02-12');

-- Verificar dados inseridos
SELECT COUNT(*) as total_consultas FROM public.consultations;