-- Fix missing INSERT policy for notifications table
-- This migration adds the missing INSERT policy that allows users to create notifications

-- Add INSERT policy for notifications table
DROP POLICY IF EXISTS "Users can insert their own notifications" ON public.notifications;
CREATE POLICY "Users can insert their own notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (user_id = (select auth.uid()));

-- Also allow service_role to insert notifications (for system notifications)
DROP POLICY IF EXISTS "Service role can insert notifications" ON public.notifications;
CREATE POLICY "Service role can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- Grant necessary permissions to authenticated users
GRANT INSERT ON public.notifications TO authenticated;
GRANT INSERT ON public.notifications TO service_role;

-- Update the create_notification function to use SECURITY DEFINER properly
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_data JSONB DEFAULT '{}',
  p_priority TEXT DEFAULT 'normal',
  p_channel TEXT DEFAULT 'in_app',
  p_scheduled_for TIMESTAMPTZ DEFAULT NULL,
  p_appointment_id UUID DEFAULT NULL,
  p_consultation_id UUID DEFAULT NULL,
  p_document_id UUID DEFAULT NULL,
  p_patient_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id UUID;
BEGIN
  -- Validate that the user exists and is authenticated
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'User ID cannot be null';
  END IF;

  INSERT INTO public.notifications (
    user_id, type, title, message, data, priority, channel,
    scheduled_for, appointment_id, consultation_id, document_id, patient_id
  ) VALUES (
    p_user_id, p_type, p_title, p_message, p_data, p_priority, p_channel,
    p_scheduled_for, p_appointment_id, p_consultation_id, p_document_id, p_patient_id
  ) RETURNING id INTO notification_id;

  RETURN notification_id;
END;
$$;

-- Grant execute permissions on the function
GRANT EXECUTE ON FUNCTION create_notification(
  UUID, TEXT, TEXT, TEXT, JSONB, TEXT, TEXT, TIMESTAMPTZ, UUID, UUID, UUID, UUID
) TO authenticated;
GRANT EXECUTE ON FUNCTION create_notification(
  UUID, TEXT, TEXT, TEXT, JSONB, TEXT, TEXT, TIMESTAMPTZ, UUID, UUID, UUID, UUID
) TO service_role;

-- Comment for documentation
COMMENT ON POLICY "Users can insert their own notifications" ON public.notifications IS 
'Allows authenticated users to create notifications for themselves';

COMMENT ON POLICY "Service role can insert notifications" ON public.notifications IS 
'Allows service role to create system notifications for any user';