-- Seeds para popular o banco de dados com dados de exemplo
-- Este arquivo contém dados de teste para desenvolvimento

-- Nota: Os perfis são criados automaticamente pelo trigger quando usuários se registram
-- através do sistema de autenticação. Para testes, você pode criar usuários através da interface
-- do Supabase Studio ou através do sistema de registro da aplicação.

-- Nota: Para inserir pacientes, primeiro é necessário criar os perfis de usuário correspondentes
-- através do sistema de autenticação. Os dados abaixo são exemplos de como inserir pacientes
-- após a criação dos perfis.

-- Inserir pacientes de exemplo
DO $$
DECLARE
    user_id_var UUID;
BEGIN
    -- Pegar o primeiro usuário existente
    SELECT id INTO user_id_var FROM auth.users LIMIT 1;
    
    IF user_id_var IS NOT NULL THEN
        INSERT INTO public.patients (profile_id, full_name, birth_date, gender, cpf, phone, email, address, city, state, zip_code, emergency_contact_name, emergency_contact_phone, blood_type, allergies, current_medications, insurance_company, insurance_number, status) VALUES
            (user_id_var, 'Ana Costa Silva', '1985-03-15', 'female', '123.456.789-01', '(11) 98888-1111', 'ana.costa@email.com', 'Rua das Flores, 100', 'São Paulo', 'SP', '01234-567', 'Carlos Costa', '(11) 97777-1111', 'A+', ARRAY['Penicilina', 'Frutos do mar'], ARRAY['Losartana 50mg'], 'Unimed', '123456789', 'active'),
            (user_id_var, 'Roberto Lima Santos', '1978-07-22', 'male', '987.654.321-02', '(11) 98888-2222', 'roberto.lima@email.com', 'Av. Paulista, 200', 'São Paulo', 'SP', '02345-678', 'Lucia Lima', '(11) 97777-2222', 'O-', ARRAY['Dipirona'], ARRAY['Metformina 850mg', 'Sinvastatina 20mg'], 'Bradesco Saúde', '987654321', 'active'),
            (user_id_var, 'Maria Oliveira', '1990-12-10', 'female', '456.789.123-03', '(11) 98888-3333', 'maria.oliveira@email.com', 'Rua Augusta, 300', 'São Paulo', 'SP', '03456-789', 'João Oliveira', '(11) 97777-3333', 'B+', ARRAY['Lactose'], ARRAY['Anticoncepcional'], 'SulAmérica', '456789123', 'active')
        ON CONFLICT (profile_id, cpf) DO NOTHING;
    END IF;
END $$;

-- Exemplo de horários de funcionamento dos médicos (descomente após criar os perfis correspondentes):
-- INSERT INTO public.doctor_schedules (doctor_id, day_of_week, start_time, end_time, default_duration, break_duration, is_active) VALUES
--   -- Dr. João Silva (Cardiologista) - Segunda a Sexta
--   ('DOCTOR_ID_1', 1, '08:00', '12:00', 30, 5, true), -- Segunda manhã
--   ('DOCTOR_ID_1', 1, '14:00', '18:00', 30, 5, true), -- Segunda tarde
--   ('DOCTOR_ID_1', 2, '08:00', '12:00', 30, 5, true), -- Terça manhã
--   ('DOCTOR_ID_2', 2, '09:00', '13:00', 45, 10, true), -- Terça manhã
--   ('DOCTOR_ID_2', 2, '15:00', '19:00', 45, 10, true), -- Terça tarde
--   ('DOCTOR_ID_3', 1, '07:30', '11:30', 40, 10, true) -- Segunda manhã
-- ON CONFLICT DO NOTHING;

-- Inserir agendamentos de exemplo
DO $$
DECLARE
    user_id_var UUID;
    patient_id_var UUID;
BEGIN
    -- Pegar o primeiro usuário e paciente
    SELECT id INTO user_id_var FROM auth.users LIMIT 1;
    SELECT id INTO patient_id_var FROM public.patients LIMIT 1;
    
    IF user_id_var IS NOT NULL AND patient_id_var IS NOT NULL THEN
        INSERT INTO public.appointments (doctor_id, patient_id, appointment_date, appointment_time, duration, appointment_type, status, patient_name, patient_phone, patient_email, appointment_reason, consultation_mode) VALUES
            (user_id_var, patient_id_var, CURRENT_DATE + INTERVAL '1 day', '09:00', 30, 'retorno', 'agendado', 'Ana Costa Silva', '(11) 98888-1111', 'ana.costa@email.com', 'Consulta de retorno cardiológica', 'presencial'),
            (user_id_var, patient_id_var, CURRENT_DATE + INTERVAL '2 days', '10:00', 30, 'consulta_geral', 'confirmado', 'Roberto Lima Santos', '(11) 98888-2222', 'roberto.lima@email.com', 'Avaliação cardiológica de rotina', 'presencial'),
            (user_id_var, patient_id_var, CURRENT_DATE + INTERVAL '3 days', '15:30', 45, 'primeira_consulta', 'agendado', 'Maria Oliveira', '(11) 98888-3333', 'maria.oliveira@email.com', 'Primeira consulta clínica geral', 'presencial'),
            (user_id_var, patient_id_var, CURRENT_DATE + INTERVAL '7 days', '14:00', 30, 'rotina', 'agendado', 'Ana Costa Silva', '(11) 98888-1111', 'ana.costa@email.com', 'Consulta de rotina', 'telemedicina')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Inserir consultas de exemplo
DO $$
DECLARE
    user_id_var UUID;
    patient_id_var UUID;
BEGIN
    -- Pegar o primeiro usuário e paciente
    SELECT id INTO user_id_var FROM auth.users LIMIT 1;
    SELECT id INTO patient_id_var FROM public.patients LIMIT 1;
    
    IF user_id_var IS NOT NULL AND patient_id_var IS NOT NULL THEN
        INSERT INTO public.consultations (doctor_id, patient_id, consultation_date, consultation_time, scheduled_duration, consultation_type, status, chief_complaint, consultation_mode, location, clinical_notes, diagnosis, treatment_plan) VALUES
            (user_id_var, patient_id_var, CURRENT_DATE - INTERVAL '7 days', '09:00', 35, 'retorno', 'finalizada', 'Dor no peito e falta de ar', 'presencial', 'Consultório 1', 'Paciente relata dor precordial aos esforços. Exame físico normal. ECG sem alterações.', 'Dor torácica atípica', 'Orientações sobre estilo de vida. Retorno em 30 dias.'),
            (user_id_var, patient_id_var, CURRENT_DATE - INTERVAL '14 days', '10:30', 50, 'primeira_consulta', 'finalizada', 'Consulta de rotina', 'presencial', 'Consultório 1', 'Paciente assintomático. Exames laboratoriais dentro da normalidade.', 'Paciente hígido', 'Manter acompanhamento anual.'),
            (user_id_var, patient_id_var, CURRENT_DATE - INTERVAL '21 days', '15:00', 45, 'rotina', 'finalizada', 'Acompanhamento diabetes', 'presencial', 'Consultório 1', 'Glicemia controlada. HbA1c 6.8%. Paciente aderente ao tratamento.', 'Diabetes mellitus tipo 2 controlado', 'Manter medicação atual. Retorno em 3 meses.')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Exemplo de templates de documentos (descomente após criar os perfis correspondentes):
-- INSERT INTO public.document_templates (name, description, category, document_type, doctor_id, template_structure, is_public, is_active) VALUES
--   ('Receita Médica Padrão', 'Template padrão para receitas médicas', 'receita', 'receita', 'DOCTOR_ID_1', 
--    '{
--      "sections": [
--        {"id": "header", "name": "Cabeçalho", "type": "header", "required": true},
--        {"id": "patient_info", "name": "Dados do Paciente", "type": "patient_data", "required": true},
--        {"id": "medications", "name": "Medicamentos", "type": "medication_list", "required": true},
--        {"id": "instructions", "name": "Instruções", "type": "text", "required": false},
--        {"id": "footer", "name": "Rodapé", "type": "footer", "required": true}
--      ]
--    }', true, true),
--   
--   ('Atestado Médico', 'Template para atestados médicos', 'atestado', 'atestado', 'DOCTOR_ID_2',
--    '{
--      "sections": [
--        {"id": "header", "name": "Cabeçalho", "type": "header", "required": true},
--        {"id": "patient_info", "name": "Dados do Paciente", "type": "patient_data", "required": true},
--        {"id": "attestation", "name": "Atestação", "type": "text", "required": true},
--        {"id": "period", "name": "Período", "type": "date_range", "required": true},
--        {"id": "footer", "name": "Rodapé", "type": "footer", "required": true}
--      ]
--    }', true, true),
--   
--   ('Prontuário Cardiológico', 'Template específico para consultas cardiológicas', 'prontuario', 'prontuario', 'DOCTOR_ID_1',
--    '{
--      "sections": [
--        {"id": "anamnesis", "name": "Anamnese", "type": "text", "required": true},
--        {"id": "physical_exam", "name": "Exame Físico", "type": "structured_exam", "required": true},
--        {"id": "vital_signs", "name": "Sinais Vitais", "type": "vital_signs", "required": true},
--        {"id": "ecg", "name": "ECG", "type": "text", "required": false},
--        {"id": "diagnosis", "name": "Diagnóstico", "type": "text", "required": true},
--        {"id": "treatment_plan", "name": "Plano Terapêutico", "type": "text", "required": true}
--      ]
--    }', false, true)
-- ON CONFLICT DO NOTHING;

-- Exemplo de notificações (descomente após criar os perfis correspondentes):
-- INSERT INTO public.notifications (user_id, type, title, message, priority, channel, status, appointment_id) VALUES
--   ('PATIENT_PROFILE_ID_1', 'appointment_reminder', 'Lembrete de Consulta', 'Você tem uma consulta agendada para amanhã às 09:00 com Dr. João Silva', 'normal', 'in_app', 'unread', (SELECT id FROM public.appointments WHERE patient_id = (SELECT id FROM public.patients WHERE profile_id = 'PATIENT_PROFILE_ID_1') LIMIT 1)),
--   ('PATIENT_PROFILE_ID_2', 'appointment_confirmation', 'Consulta Confirmada', 'Sua consulta com Dr. João Silva foi confirmada para o dia ' || TO_CHAR(CURRENT_DATE + INTERVAL '2 days', 'DD/MM/YYYY') || ' às 10:00', 'normal', 'in_app', 'unread', (SELECT id FROM public.appointments WHERE patient_id = (SELECT id FROM public.patients WHERE profile_id = 'PATIENT_PROFILE_ID_2') LIMIT 1)),
--   ('DOCTOR_ID_1', 'patient_message', 'Nova Mensagem de Paciente', 'Ana Costa enviou uma mensagem sobre sua consulta', 'normal', 'in_app', 'read', NULL),
--   ('DOCTOR_ID_2', 'system_update', 'Atualização do Sistema', 'Nova funcionalidade de transcrição automática disponível', 'low', 'in_app', 'unread', NULL)
-- ON CONFLICT DO NOTHING;

-- Exemplo de preferências de notificação (descomente após criar os perfis correspondentes):
-- INSERT INTO public.notification_preferences (user_id, notification_type, in_app_enabled, email_enabled, sms_enabled, push_enabled) VALUES
--   ('DOCTOR_ID_1', 'appointment_reminder', true, true, false, true),
--   ('DOCTOR_ID_1', 'patient_message', true, true, false, true),
--   ('DOCTOR_ID_1', 'system_update', true, false, false, false),
--   ('DOCTOR_ID_2', 'appointment_reminder', true, true, false, true),
--   ('DOCTOR_ID_2', 'patient_message', true, true, false, true),
--   ('DOCTOR_ID_3', 'appointment_reminder', true, true, false, true),
--   ('PATIENT_PROFILE_ID_1', 'appointment_reminder', true, true, true, true),
--   ('PATIENT_PROFILE_ID_1', 'appointment_confirmation', true, true, true, true),
--   ('PATIENT_PROFILE_ID_2', 'appointment_reminder', true, true, false, true),
--   ('PATIENT_PROFILE_ID_3', 'appointment_reminder', true, true, false, true),
--   ('PATIENT_PROFILE_ID_4', 'appointment_reminder', true, false, false, true)
-- ON CONFLICT (user_id, notification_type) DO NOTHING;

-- Inserir templates de notificação
INSERT INTO public.notification_templates (template_key, name, description, notification_type, in_app_title, in_app_message, email_subject, email_body, sms_message, push_title, push_message, available_variables, is_active) VALUES
  ('appointment_reminder_24h', 'Lembrete 24h', 'Lembrete de consulta com 24 horas de antecedência', 'appointment_reminder', 
   'Lembrete de Consulta', 
   'Você tem uma consulta agendada para {{appointment_date}} às {{appointment_time}} com {{doctor_name}}',
   'Lembrete: Consulta agendada para amanhã',
   'Olá {{patient_name}},\n\nEste é um lembrete de que você tem uma consulta agendada para {{appointment_date}} às {{appointment_time}} com {{doctor_name}}.\n\nLocal: {{clinic_address}}\n\nEm caso de dúvidas, entre em contato conosco.\n\nAtenciosamente,\n{{clinic_name}}',
   'Lembrete: Consulta {{appointment_date}} {{appointment_time}} - {{doctor_name}}',
   'Consulta Amanhã',
   'Consulta com {{doctor_name}} às {{appointment_time}}',
   '["patient_name", "doctor_name", "appointment_date", "appointment_time", "clinic_name", "clinic_address"]',
   true),
   
  ('appointment_confirmed', 'Consulta Confirmada', 'Confirmação de agendamento de consulta', 'appointment_confirmation',
   'Consulta Confirmada',
   'Sua consulta com {{doctor_name}} foi confirmada para {{appointment_date}} às {{appointment_time}}',
   'Consulta confirmada - {{doctor_name}}',
   'Olá {{patient_name}},\n\nSua consulta foi confirmada!\n\nDetalhes:\n- Médico: {{doctor_name}}\n- Data: {{appointment_date}}\n- Horário: {{appointment_time}}\n- Local: {{clinic_address}}\n\nPor favor, chegue com 15 minutos de antecedência.\n\nAtenciosamente,\n{{clinic_name}}',
   'Consulta confirmada: {{appointment_date}} {{appointment_time}} - {{doctor_name}}',
   'Consulta Confirmada',
   'Agendamento confirmado com {{doctor_name}}',
   '["patient_name", "doctor_name", "appointment_date", "appointment_time", "clinic_name", "clinic_address"]',
   true)
ON CONFLICT (template_key) DO NOTHING;

-- Exemplo de bloqueios de horário (descomente após criar os perfis correspondentes):
-- INSERT INTO public.schedule_blocks (doctor_id, start_date, end_date, start_time, end_time, block_type, description) VALUES
--   ('DOCTOR_ID_1', CURRENT_DATE + INTERVAL '30 days', CURRENT_DATE + INTERVAL '37 days', NULL, NULL, 'ferias', 'Férias de fim de ano'),
--   ('DOCTOR_ID_2', CURRENT_DATE + INTERVAL '15 days', CURRENT_DATE + INTERVAL '17 days', NULL, NULL, 'congresso', 'Congresso Brasileiro de Dermatologia'),
--   ('DOCTOR_ID_3', CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '7 days', '14:00', '16:00', 'pessoal', 'Compromisso pessoal')
-- ON CONFLICT DO NOTHING;

-- Exemplo de configurações de transcrição (descomente após criar os perfis correspondentes):
-- INSERT INTO public.transcription_settings (
--   doctor_id,
--   default_language,
--   auto_transcribe,
--   auto_punctuation,
--   speaker_diarization,
--   preferred_service,
--   quality_level,
--   store_audio_locally,
--   delete_audio_after_days,
--   notify_on_completion,
--   notify_on_error,
--   custom_vocabulary
-- ) VALUES
-- (
--   'DOCTOR_ID_1',
--   'pt-BR',
--   true,
--   true,
--   true,
--   'openai',
--   'high',
--   true,
--   90,
--   true,
--   true,
--   '["cardiologia", "hipertensão", "arritmia", "infarto", "angina"]'::jsonb
-- ),
-- (
--   'DOCTOR_ID_2',
--   'pt-BR',
--   true,
--   true,
--   false,
--   'google',
--   'medium',
--   true,
--   60,
--   true,
--   false,
--   '["dermatologia", "melanoma", "psoríase", "eczema", "acne"]'::jsonb
-- ),
-- (
--   'DOCTOR_ID_3',
--   'pt-BR',
--   false,
--   true,
--   true,
--   'azure',
--   'high',
--   true,
--   120,
--   true,
--   true,
--   '["ortopedia", "fratura", "artrose", "artrite", "ligamento"]'::jsonb
-- )
-- ON CONFLICT (doctor_id) DO NOTHING;

-- Atualizar estatísticas das tabelas
ANALYZE public.profiles;
ANALYZE public.patients;
ANALYZE public.appointments;
ANALYZE public.consultations;
ANALYZE public.document_templates;
-- Inserir notificações de teste para usuários existentes
-- Nota: Estas notificações serão criadas para qualquer usuário que se registrar
DO $$
DECLARE
    user_record RECORD;
BEGIN
    -- Para cada usuário existente, criar notificações de teste
    FOR user_record IN SELECT id FROM auth.users LOOP
        INSERT INTO public.notifications (user_id, type, title, message, status, priority) VALUES
            (user_record.id, 'appointment_reminder', 'Lembrete de Consulta', 'Você tem uma consulta agendada para amanhã às 14:00', 'unread', 'high'),
            (user_record.id, 'system', 'Bem-vindo ao Sistema', 'Bem-vindo ao sistema de prontuários médicos!', 'unread', 'medium'),
            (user_record.id, 'document_ready', 'Documento Pronto', 'Seu relatório médico está disponível para download', 'unread', 'low')
        ON CONFLICT DO NOTHING;
    END LOOP;
END $$;

ANALYZE public.notifications;
ANALYZE public.notification_preferences;
ANALYZE public.notification_templates;
ANALYZE public.doctor_schedules;
ANALYZE public.schedule_blocks;
ANALYZE public.transcription_settings;

-- Inserir usuário médico de teste
-- Usuário dr.thomaz@email.com removido conforme solicitado

-- EXCLUSÃO FORÇADA DO USUÁRIO DR.THOMAZ NO FINAL DO SEED
-- Esta exclusão garante que o usuário seja removido mesmo se for inserido por algum processo
DELETE FROM public.profiles WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479' OR email = 'dr.thomaz@email.com';
DELETE FROM auth.users WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479' OR email = 'dr.thomaz@email.com';

-- VERIFICAÇÃO E BLOQUEIO FINAL
DO $$
BEGIN
    -- Verificar se o usuário ainda existe e forçar remoção
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479' OR email = 'dr.thomaz@email.com') LOOP
        DELETE FROM public.profiles WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479' OR email = 'dr.thomaz@email.com';
    END LOOP;
    
    WHILE EXISTS (SELECT 1 FROM auth.users WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479' OR email = 'dr.thomaz@email.com') LOOP
        DELETE FROM auth.users WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479' OR email = 'dr.thomaz@email.com';
    END LOOP;
    
    RAISE NOTICE '🚫 SEED FINAL: Usuário dr.thomaz@email.com foi definitivamente removido no seed!';
END $$;

-- Comentário final
-- Seeds criados com sucesso!
-- Este arquivo contém dados de exemplo para médicos e pacientes,
-- incluindo agendamentos, consultas, templates, configurações e notificações de teste.