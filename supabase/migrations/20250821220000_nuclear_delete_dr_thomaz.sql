-- Migração nuclear para deletar definitivamente o usuário dr.thomaz@email.com
-- Esta migração deve ser executada após todas as outras

-- Primeiro, deletar de todas as tabelas relacionadas
DELETE FROM auth.identities WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM auth.sessions WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM auth.refresh_tokens WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM auth.mfa_factors WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM auth.one_time_tokens WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM auth.flow_state WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

-- Deletar de tabelas públicas
DELETE FROM public.notifications WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM public.notification_preferences WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM public.security_audit_log WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM public.patient_access_log WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM public.oauth_connections WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM public.oauth_states WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

-- Deletar registros médicos
DELETE FROM public.recordings WHERE doctor_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM public.transcription_settings WHERE doctor_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM public.consultations WHERE doctor_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM public.appointments WHERE doctor_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM public.doctor_schedules WHERE doctor_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM public.schedule_blocks WHERE doctor_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM public.document_templates WHERE doctor_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM public.documents WHERE doctor_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM public.patients WHERE doctor_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

-- Finalmente, deletar o perfil e usuário
DELETE FROM public.profiles WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM public.profiles WHERE email = 'dr.thomaz@email.com';
DELETE FROM auth.users WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
DELETE FROM auth.users WHERE email = 'dr.thomaz@email.com';

-- Verificar se foi removido
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE email = 'dr.thomaz@email.com') AND
       NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dr.thomaz@email.com') THEN
        RAISE NOTICE '🚀 NUCLEAR SUCCESS: Usuário dr.thomaz@email.com foi DEFINITIVAMENTE removido!';
    ELSE
        RAISE EXCEPTION '💥 NUCLEAR FAILURE: Usuário dr.thomaz@email.com ainda existe!';
    END IF;
END $$;