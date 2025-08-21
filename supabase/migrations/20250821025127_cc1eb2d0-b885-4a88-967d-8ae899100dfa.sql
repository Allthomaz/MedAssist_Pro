-- CRITICAL SECURITY FIXES
-- Phase 1: Fix function search paths to prevent SQL injection

-- Fix all database functions to use secure search paths
CREATE OR REPLACE FUNCTION public.set_document_number()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  SET search_path = public, extensions;
  IF NEW.document_number IS NULL THEN
    NEW.document_number := generate_document_number(NEW.doctor_id, NEW.document_type);
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_document_history_entry()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  action_type TEXT;
  changed_fields TEXT[];
BEGIN
  SET search_path = public, extensions;
  IF TG_OP = 'INSERT' THEN
    action_type := 'created';
  ELSIF TG_OP = 'UPDATE' THEN
    action_type := 'updated';
    changed_fields := ARRAY[]::TEXT[];
    
    IF OLD.status != NEW.status THEN
      changed_fields := array_append(changed_fields, 'status');
      IF NEW.status = 'assinado' AND OLD.status != 'assinado' THEN
        action_type := 'signed';
      ELSIF NEW.status = 'enviado' AND OLD.status != 'enviado' THEN
        action_type := 'sent';
      ELSIF NEW.status = 'cancelado' AND OLD.status != 'cancelado' THEN
        action_type := 'cancelled';
      ELSIF NEW.status = 'arquivado' AND OLD.status != 'arquivado' THEN
        action_type := 'archived';
      END IF;
    END IF;
    
    IF OLD.content_data != NEW.content_data THEN
      changed_fields := array_append(changed_fields, 'content_data');
    END IF;
    
    IF OLD.title != NEW.title THEN
      changed_fields := array_append(changed_fields, 'title');
    END IF;
  END IF;
  
  INSERT INTO public.document_history (
    document_id, action, previous_data, new_data, changed_fields, changed_by
  ) VALUES (
    COALESCE(NEW.id, OLD.id),
    action_type,
    CASE WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) ELSE NULL END,
    changed_fields,
    (select auth.uid())
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_recording_duration(p_recording_id uuid)
RETURNS integer
LANGUAGE plpgsql
AS $function$
DECLARE
  duration_seconds INTEGER;
BEGIN
  SET search_path = public, extensions;
  SELECT EXTRACT(EPOCH FROM (ended_at - started_at))::INTEGER
  INTO duration_seconds
  FROM public.recordings
  WHERE id = p_recording_id;
  
  RETURN COALESCE(duration_seconds, 0);
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_consultation_transcription_status()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  SET search_path = public, extensions;
  IF NEW.transcription_status = 'completed' AND OLD.transcription_status != 'completed' THEN
    UPDATE public.consultations
    SET 
      transcription_text = NEW.transcript_text,
      transcription_confidence = NEW.confidence_score,
      transcription_completed_at = NEW.transcription_completed_at
    WHERE id = NEW.consultation_id;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.cleanup_old_recordings()
RETURNS integer
LANGUAGE plpgsql
AS $function$
DECLARE
  deleted_count INTEGER := 0;
  setting_record RECORD;
BEGIN
  SET search_path = public, extensions;
  FOR setting_record IN 
    SELECT doctor_id, delete_audio_after_days 
    FROM public.transcription_settings 
    WHERE delete_audio_after_days > 0
  LOOP
    WITH deleted_recordings AS (
      DELETE FROM public.recordings
      WHERE doctor_id = setting_record.doctor_id
      AND created_at < (now() - (setting_record.delete_audio_after_days || ' days')::INTERVAL)
      AND recording_status = 'completed'
      RETURNING id
    )
    SELECT COUNT(*) INTO deleted_count FROM deleted_recordings;
  END LOOP;
  
  RETURN deleted_count;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_recording_duration()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  SET search_path = public, extensions;
  IF NEW.recording_status = 'completed' AND OLD.recording_status != 'completed' 
     AND NEW.started_at IS NOT NULL AND NEW.ended_at IS NOT NULL THEN
    NEW.audio_duration := EXTRACT(EPOCH FROM (NEW.ended_at - NEW.started_at))::INTEGER;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.mark_notification_as_read(notification_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
AS $function$
BEGIN
  SET search_path = public, extensions;
  UPDATE public.notifications
  SET 
    status = 'read',
    read_at = now(),
    updated_at = now()
  WHERE id = notification_uuid
    AND user_id = (select auth.uid())
    AND status = 'unread';
  
  RETURN FOUND;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_notification(p_user_id uuid, p_type text, p_title text, p_message text, p_data jsonb DEFAULT '{}'::jsonb, p_priority text DEFAULT 'normal'::text, p_channel text DEFAULT 'in_app'::text, p_scheduled_for timestamp with time zone DEFAULT NULL::timestamp with time zone, p_appointment_id uuid DEFAULT NULL::uuid, p_consultation_id uuid DEFAULT NULL::uuid, p_document_id uuid DEFAULT NULL::uuid, p_patient_id uuid DEFAULT NULL::uuid)
RETURNS uuid
LANGUAGE plpgsql
AS $function$
DECLARE
  notification_id UUID;
BEGIN
  SET search_path = public, extensions;
  INSERT INTO public.notifications (
    user_id, type, title, message, data, priority, channel,
    scheduled_for, appointment_id, consultation_id, document_id, patient_id
  )
  VALUES (
    p_user_id, p_type, p_title, p_message, p_data, p_priority, p_channel,
    p_scheduled_for, p_appointment_id, p_consultation_id, p_document_id, p_patient_id
  )
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.cleanup_old_notifications()
RETURNS integer
LANGUAGE plpgsql
AS $function$
DECLARE
  deleted_count INTEGER := 0;
  temp_count INTEGER;
BEGIN
  SET search_path = public, extensions;
  DELETE FROM public.notifications
  WHERE status = 'read'
    AND read_at < (now() - INTERVAL '30 days');
  
  GET DIAGNOSTICS temp_count = ROW_COUNT;
  deleted_count := deleted_count + temp_count;
  
  DELETE FROM public.notifications
  WHERE status = 'unread'
    AND created_at < (now() - INTERVAL '90 days');
  
  GET DIAGNOSTICS temp_count = ROW_COUNT;
  deleted_count := deleted_count + temp_count;
  
  RETURN deleted_count;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient'),
    NEW.email
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_patient_number(doctor_uuid uuid)
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
  next_number INTEGER;
  doctor_initials TEXT;
BEGIN
  SET search_path = public, extensions;
  SELECT UPPER(LEFT(full_name, 1) || LEFT(SPLIT_PART(full_name, ' ', -1), 1))
  INTO doctor_initials
  FROM public.profiles
  WHERE id = doctor_uuid AND role = 'doctor';
  
  IF doctor_initials IS NULL THEN
    doctor_initials := 'DR';
  END IF;
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(patient_number FROM '[0-9]+$') AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.patients
  WHERE doctor_id = doctor_uuid
  AND patient_number ~ ('^' || doctor_initials || '[0-9]+$');
  
  RETURN doctor_initials || LPAD(next_number::TEXT, 4, '0');
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_patient_number()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  SET search_path = public, extensions;
  IF NEW.patient_number IS NULL THEN
    NEW.patient_number := generate_patient_number(NEW.doctor_id);
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_consultation_number()
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
  next_number INTEGER;
  year_suffix TEXT;
BEGIN
  SET search_path = public, extensions;
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(consultation_number FROM '[0-9]+$') AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.consultations
  WHERE consultation_number ~ ('^CONS' || year_suffix || '[0-9]+$')
  AND EXTRACT(YEAR FROM consultation_date) = EXTRACT(YEAR FROM CURRENT_DATE);
  
  RETURN 'CONS' || year_suffix || LPAD(next_number::TEXT, 6, '0');
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_consultation_number()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  SET search_path = public, extensions;
  IF NEW.consultation_number IS NULL THEN
    NEW.consultation_number := generate_consultation_number();
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_consultation_timestamps()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  SET search_path = public, extensions;
  IF NEW.status = 'em_andamento' AND OLD.status != 'em_andamento' AND NEW.started_at IS NULL THEN
    NEW.started_at := now();
  END IF;
  
  IF NEW.status = 'finalizada' AND OLD.status != 'finalizada' AND NEW.finished_at IS NULL THEN
    NEW.finished_at := now();
    
    IF NEW.actual_duration IS NULL AND NEW.started_at IS NOT NULL THEN
      NEW.actual_duration := EXTRACT(EPOCH FROM (NEW.finished_at - NEW.started_at)) / 60;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_appointment_availability(p_doctor_id uuid, p_date date, p_time time without time zone, p_duration integer DEFAULT 30)
RETURNS boolean
LANGUAGE plpgsql
AS $function$
DECLARE
  day_of_week INTEGER;
  schedule_exists BOOLEAN;
  has_conflicts BOOLEAN;
  is_blocked BOOLEAN;
BEGIN
  SET search_path = public, extensions;
  day_of_week := EXTRACT(DOW FROM p_date);
  
  SELECT EXISTS(
    SELECT 1 FROM public.doctor_schedules ds
    WHERE ds.doctor_id = p_doctor_id
    AND ds.day_of_week = day_of_week
    AND ds.is_active = true
    AND p_time >= ds.start_time
    AND (p_time + (p_duration || ' minutes')::INTERVAL)::TIME <= ds.end_time
  ) INTO schedule_exists;
  
  IF NOT schedule_exists THEN
    RETURN false;
  END IF;
  
  SELECT EXISTS(
    SELECT 1 FROM public.appointments a
    WHERE a.doctor_id = p_doctor_id
    AND a.appointment_date = p_date
    AND a.status NOT IN ('cancelado', 'nao_compareceu')
    AND (
      (a.appointment_time <= p_time AND (a.appointment_time + (a.duration || ' minutes')::INTERVAL)::TIME > p_time)
      OR
      (p_time <= a.appointment_time AND (p_time + (p_duration || ' minutes')::INTERVAL)::TIME > a.appointment_time)
    )
  ) INTO has_conflicts;
  
  IF has_conflicts THEN
    RETURN false;
  END IF;
  
  SELECT EXISTS(
    SELECT 1 FROM public.schedule_blocks sb
    WHERE sb.doctor_id = p_doctor_id
    AND p_date >= sb.start_date
    AND p_date <= sb.end_date
    AND (
      (sb.start_time IS NULL)
      OR
      (p_time >= sb.start_time AND (p_time + (p_duration || ' minutes')::INTERVAL)::TIME <= sb.end_time)
    )
  ) INTO is_blocked;
  
  RETURN NOT is_blocked;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_consultation_from_appointment()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  consultation_uuid UUID;
BEGIN
  SET search_path = public, extensions;
  IF NEW.status = 'confirmado' AND OLD.status != 'confirmado' AND NEW.consultation_id IS NULL AND NEW.patient_id IS NOT NULL THEN
    INSERT INTO public.consultations (
      doctor_id,
      patient_id,
      consultation_date,
      consultation_time,
      scheduled_duration,
      consultation_type,
      consultation_mode,
      consultation_reason,
      chief_complaint,
      status
    ) VALUES (
      NEW.doctor_id,
      NEW.patient_id,
      NEW.appointment_date,
      NEW.appointment_time,
      NEW.duration,
      CASE NEW.appointment_type
        WHEN 'teleconsulta' THEN 'retorno'
        ELSE NEW.appointment_type
      END,
      NEW.consultation_mode,
      NEW.appointment_reason,
      NEW.chief_complaint,
      'agendada'
    ) RETURNING id INTO consultation_uuid;
    
    NEW.consultation_id := consultation_uuid;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_template_usage(p_template_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  SET search_path = public, extensions;
  UPDATE public.document_templates
  SET 
    usage_count = usage_count + 1,
    last_used_at = now()
  WHERE id = p_template_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.duplicate_template(p_template_id uuid, p_new_name text, p_doctor_id uuid)
RETURNS uuid
LANGUAGE plpgsql
AS $function$
DECLARE
  new_template_id UUID;
  section_record RECORD;
  new_section_id UUID;
BEGIN
  SET search_path = public, extensions;
  INSERT INTO public.document_templates (
    doctor_id, name, description, document_type, category,
    template_structure, template_content, template_variables,
    custom_css, print_settings, tags, parent_template_id
  )
  SELECT 
    p_doctor_id, p_new_name, description, document_type, category,
    template_structure, template_content, template_variables,
    custom_css, print_settings, tags, p_template_id
  FROM public.document_templates
  WHERE id = p_template_id
  RETURNING id INTO new_template_id;
  
  FOR section_record IN 
    SELECT * FROM public.template_sections WHERE template_id = p_template_id
  LOOP
    INSERT INTO public.template_sections (
      template_id, section_name, section_title, section_description,
      display_order, is_required, is_collapsible, is_repeatable, display_conditions
    )
    VALUES (
      new_template_id, section_record.section_name, section_record.section_title,
      section_record.section_description, section_record.display_order,
      section_record.is_required, section_record.is_collapsible,
      section_record.is_repeatable, section_record.display_conditions
    )
    RETURNING id INTO new_section_id;
    
    INSERT INTO public.template_fields (
      section_id, field_name, field_label, field_description, field_type,
      field_config, display_order, is_required, validation_rules,
      default_value, placeholder, display_conditions
    )
    SELECT 
      new_section_id, field_name, field_label, field_description, field_type,
      field_config, display_order, is_required, validation_rules,
      default_value, placeholder, display_conditions
    FROM public.template_fields
    WHERE section_id = section_record.id;
  END LOOP;
  
  RETURN new_template_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_document_number(p_doctor_id uuid, p_document_type text)
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
  doctor_initials TEXT;
  type_prefix TEXT;
  sequence_number INTEGER;
  document_number TEXT;
BEGIN
  SET search_path = public, extensions;
  SELECT 
    UPPER(LEFT(SPLIT_PART(full_name, ' ', 1), 1) || LEFT(SPLIT_PART(full_name, ' ', -1), 1))
  INTO doctor_initials
  FROM public.profiles
  WHERE id = p_doctor_id;
  
  type_prefix := CASE p_document_type
    WHEN 'prontuario' THEN 'PR'
    WHEN 'receita' THEN 'RC'
    WHEN 'atestado' THEN 'AT'
    WHEN 'laudo' THEN 'LD'
    WHEN 'relatorio' THEN 'RL'
    WHEN 'encaminhamento' THEN 'EN'
    WHEN 'solicitacao_exame' THEN 'SE'
    WHEN 'declaracao' THEN 'DC'
    ELSE 'DC'
  END;
  
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(document_number FROM '\d+$') AS INTEGER)
  ), 0) + 1
  INTO sequence_number
  FROM public.documents
  WHERE doctor_id = p_doctor_id
  AND document_type = p_document_type
  AND document_number ~ ('^' || doctor_initials || type_prefix || '\d+$');
  
  document_number := doctor_initials || type_prefix || LPAD(sequence_number::TEXT, 6, '0');
  
  RETURN document_number;
END;
$function$;

-- Add missing INSERT/DELETE policies for critical tables

-- Consultations table - secure INSERT policy
CREATE POLICY "Doctors can create consultations" 
ON public.consultations FOR INSERT 
WITH CHECK (doctor_id = (select auth.uid()));

-- Recordings table - secure DELETE policy  
CREATE POLICY "Doctors can delete their recordings" 
ON public.recordings FOR DELETE 
USING (doctor_id = (select auth.uid()));

-- Documents table - secure DELETE policy
CREATE POLICY "Doctors can delete their documents" 
ON public.documents FOR DELETE 
USING (doctor_id = (select auth.uid()) AND deleted_at IS NULL);

-- Transcriptions table - secure DELETE policy
CREATE POLICY "Doctors can delete their transcriptions" 
ON public.transcriptions FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.recordings r 
  WHERE r.id = transcriptions.recording_id AND r.doctor_id = (select auth.uid())
));

-- Notification preferences - secure DELETE policy
CREATE POLICY "Users can delete their notification preferences" 
ON public.notification_preferences FOR DELETE 
USING (user_id = (select auth.uid()));

-- Add comprehensive audit logging
CREATE TABLE IF NOT EXISTS public.patient_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  user_role TEXT NOT NULL,
  patient_id UUID NOT NULL,
  action TEXT NOT NULL,
  accessed_fields TEXT[],
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.patient_access_log ENABLE ROW LEVEL SECURITY;

-- Only system can write to audit log
CREATE POLICY "System only access to patient audit log" 
ON public.patient_access_log FOR ALL 
USING (false);

-- Create audit trigger for patient data access
CREATE OR REPLACE FUNCTION public.log_patient_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Log patient data access for compliance
  INSERT INTO public.patient_access_log (
    user_id,
    user_role,
    patient_id,
    action,
    accessed_fields,
    timestamp
  ) 
  SELECT 
    (select auth.uid()),
    COALESCE(p.role, 'unknown'),
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE 
      WHEN TG_OP = 'UPDATE' THEN ARRAY['updated_data']
      WHEN TG_OP = 'INSERT' THEN ARRAY['new_patient']
      WHEN TG_OP = 'DELETE' THEN ARRAY['deleted_patient']
      ELSE ARRAY['all_fields']
    END
  FROM public.profiles p 
  WHERE p.id = (select auth.uid());
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Apply audit trigger to patients table
DROP TRIGGER IF EXISTS audit_patient_access ON public.patients;
CREATE TRIGGER audit_patient_access
  AFTER INSERT OR UPDATE OR DELETE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.log_patient_access();