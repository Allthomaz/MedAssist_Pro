-- Fix: Make patient_number unique per doctor instead of globally
-- This avoids collisions when different doctors share the same initials
-- and the patient_number is generated based on initials.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'patients'
  ) THEN
    -- Drop global unique constraint on patient_number if it exists
    IF EXISTS (
      SELECT 1 
      FROM information_schema.table_constraints
      WHERE table_schema = 'public'
        AND table_name = 'patients'
        AND constraint_name = 'patients_patient_number_key'
    ) THEN
      ALTER TABLE public.patients DROP CONSTRAINT patients_patient_number_key;
    END IF;

    -- Create composite unique constraint to ensure uniqueness per doctor
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE table_schema = 'public'
        AND table_name = 'patients'
        AND constraint_name = 'patients_doctor_id_patient_number_key'
    ) THEN
      ALTER TABLE public.patients
        ADD CONSTRAINT patients_doctor_id_patient_number_key UNIQUE (doctor_id, patient_number);
    END IF;

    -- Keep a non-unique index on patient_number for fast lookups
    CREATE INDEX IF NOT EXISTS idx_patients_patient_number_nonuniq ON public.patients(patient_number);
  END IF;
END $$;