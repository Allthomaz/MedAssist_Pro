-- Migração completa para excluir definitivamente o usuário dr.thomaz@email.com
-- Remove todas as dependências e força a exclusão

-- Desabilitar temporariamente as constraints de foreign key
SET session_replication_role = replica;

-- Excluir de todas as tabelas relacionadas primeiro
DELETE FROM auth.identities WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM auth.sessions WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM auth.refresh_tokens WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM auth.mfa_factors WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM auth.one_time_tokens WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM auth.flow_state WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

-- Excluir das tabelas públicas
DELETE FROM public.notifications WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM public.notification_preferences WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM public.security_audit_log WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM public.patient_access_log WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM public.oauth_connections WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM public.oauth_states WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

-- Excluir dados médicos relacionados
DELETE FROM public.recordings WHERE doctor_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM public.transcription_settings WHERE doctor_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM public.consultations WHERE doctor_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM public.appointments WHERE doctor_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM public.doctor_schedules WHERE doctor_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM public.schedule_blocks WHERE doctor_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM public.document_templates WHERE doctor_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM public.documents WHERE doctor_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM public.patients WHERE doctor_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

-- Finalmente, excluir o perfil e o usuário
DELETE FROM public.profiles WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM public.profiles WHERE email = 'dr.thomaz@email.com';
DELETE FROM auth.users WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM auth.users WHERE email = 'dr.thomaz@email.com';

-- Reabilitar as constraints
SET session_replication_role = DEFAULT;

-- Verificar se a exclusão foi bem-sucedida
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE email = 'dr.thomaz@email.com') AND 
       NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dr.thomaz@email.com') THEN
        RAISE NOTICE '✅ SUCESSO: Usuário dr.thomaz@email.com foi completamente removido do sistema!';
    ELSE
        RAISE EXCEPTION '❌ ERRO: Falha ao remover completamente o usuário dr.thomaz@email.com';
    END IF;
END $$;