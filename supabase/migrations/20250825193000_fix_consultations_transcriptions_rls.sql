-- Fix RLS policies for consultations and transcriptions tables
-- This migration adds comprehensive RLS policies to prevent ERR_ABORTED errors
-- Date: 2025-08-25 19:30:00

-- ========================================
-- CONSULTATIONS TABLE POLICIES
-- ========================================

-- Remove existing policies first
DROP POLICY IF EXISTS "Doctors can view their own consultations" ON consultations;
DROP POLICY IF EXISTS "Patients can view their own consultations" ON consultations;
DROP POLICY IF EXISTS "Doctors can insert consultations" ON consultations;
DROP POLICY IF EXISTS "Doctors can update their own consultations" ON consultations;
DROP POLICY IF EXISTS "Doctors can delete their own consultations" ON consultations;
DROP POLICY IF EXISTS "Doctors can create consultations" ON consultations;

-- Allow doctors to view their own consultations
CREATE POLICY "Doctors can view their own consultations" ON consultations
  FOR SELECT
  USING (auth.uid() = doctor_id);

-- Allow patients to view their own consultations
CREATE POLICY "Patients can view their own consultations" ON consultations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.patients p
      WHERE p.id = patient_id AND p.profile_id = auth.uid()
    )
  );

-- Allow doctors to create consultations
CREATE POLICY "Doctors can create consultations" ON consultations
  FOR INSERT
  WITH CHECK (auth.uid() = doctor_id);

-- Allow doctors to update their own consultations
CREATE POLICY "Doctors can update their own consultations" ON consultations
  FOR UPDATE
  USING (auth.uid() = doctor_id)
  WITH CHECK (auth.uid() = doctor_id);

-- Allow doctors to delete their own consultations
CREATE POLICY "Doctors can delete their own consultations" ON consultations
  FOR DELETE
  USING (auth.uid() = doctor_id);

-- ========================================
-- TRANSCRIPTIONS TABLE POLICIES
-- ========================================

-- Remove existing policies first
DROP POLICY IF EXISTS "Doctors can manage their transcriptions" ON transcriptions;
DROP POLICY IF EXISTS "Doctors can view their transcriptions" ON transcriptions;
DROP POLICY IF EXISTS "Doctors can create their transcriptions" ON transcriptions;
DROP POLICY IF EXISTS "Doctors can update their transcriptions" ON transcriptions;
DROP POLICY IF EXISTS "Doctors can delete their transcriptions" ON transcriptions;

-- Allow doctors to view their own transcriptions
CREATE POLICY "Doctors can view their transcriptions" ON transcriptions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.consultations c
      WHERE c.id = consultation_id AND c.doctor_id = auth.uid()
    )
  );

-- Allow doctors to create transcriptions for their consultations
CREATE POLICY "Doctors can create their transcriptions" ON transcriptions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.consultations c
      WHERE c.id = consultation_id AND c.doctor_id = auth.uid()
    )
  );

-- Allow doctors to update their own transcriptions
CREATE POLICY "Doctors can update their transcriptions" ON transcriptions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.consultations c
      WHERE c.id = consultation_id AND c.doctor_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.consultations c
      WHERE c.id = consultation_id AND c.doctor_id = auth.uid()
    )
  );

-- Allow doctors to delete their own transcriptions
CREATE POLICY "Doctors can delete their transcriptions" ON transcriptions
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.consultations c
      WHERE c.id = consultation_id AND c.doctor_id = auth.uid()
    )
  );

-- ========================================
-- TRANSCRIPTION SEGMENTS TABLE POLICIES
-- ========================================

-- Check if transcription_segments table exists and add policies
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'transcription_segments') THEN
    -- Remove existing policies first
    DROP POLICY IF EXISTS "Access segments of accessible transcriptions" ON transcription_segments;
    DROP POLICY IF EXISTS "Doctors can view transcription segments" ON transcription_segments;
    DROP POLICY IF EXISTS "Doctors can create transcription segments" ON transcription_segments;
    DROP POLICY IF EXISTS "Doctors can update transcription segments" ON transcription_segments;
    DROP POLICY IF EXISTS "Doctors can delete transcription segments" ON transcription_segments;

    -- Allow doctors to view segments of their transcriptions
    CREATE POLICY "Doctors can view transcription segments" ON transcription_segments
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.transcriptions t
          JOIN public.consultations c ON c.id = t.consultation_id
          WHERE t.id = transcription_id AND c.doctor_id = auth.uid()
        )
      );

    -- Allow doctors to create segments for their transcriptions
    CREATE POLICY "Doctors can create transcription segments" ON transcription_segments
      FOR INSERT
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.transcriptions t
          JOIN public.consultations c ON c.id = t.consultation_id
          WHERE t.id = transcription_id AND c.doctor_id = auth.uid()
        )
      );

    -- Allow doctors to update segments of their transcriptions
    CREATE POLICY "Doctors can update transcription segments" ON transcription_segments
      FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM public.transcriptions t
          JOIN public.consultations c ON c.id = t.consultation_id
          WHERE t.id = transcription_id AND c.doctor_id = auth.uid()
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.transcriptions t
          JOIN public.consultations c ON c.id = t.consultation_id
          WHERE t.id = transcription_id AND c.doctor_id = auth.uid()
        )
      );

    -- Allow doctors to delete segments of their transcriptions
    CREATE POLICY "Doctors can delete transcription segments" ON transcription_segments
      FOR DELETE
      USING (
        EXISTS (
          SELECT 1 FROM public.transcriptions t
          JOIN public.consultations c ON c.id = t.consultation_id
          WHERE t.id = transcription_id AND c.doctor_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Ensure RLS is enabled on all tables
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcriptions ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON consultations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON transcriptions TO authenticated;

-- Grant permissions to service_role for system operations
GRANT ALL ON consultations TO service_role;
GRANT ALL ON transcriptions TO service_role;

-- Add comments for documentation
COMMENT ON POLICY "Doctors can view their own consultations" ON consultations IS 
'Allows doctors to view only consultations they created';

COMMENT ON POLICY "Patients can view their own consultations" ON consultations IS 
'Allows patients to view consultations related to them';

COMMENT ON POLICY "Doctors can view their transcriptions" ON transcriptions IS 
'Allows doctors to view transcriptions of their consultations';

COMMENT ON POLICY "Doctors can create their transcriptions" ON transcriptions IS 
'Allows doctors to create transcriptions for their consultations';