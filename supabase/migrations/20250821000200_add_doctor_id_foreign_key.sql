-- Add missing foreign key constraint for doctor_id in patients table
-- This ensures data integrity by referencing the profiles table

DO $$ 
BEGIN
    -- Check if the foreign key constraint already exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'patients_doctor_id_fkey' 
        AND table_name = 'patients' 
        AND table_schema = 'public'
    ) THEN
        -- Add the foreign key constraint
        ALTER TABLE public.patients 
        ADD CONSTRAINT patients_doctor_id_fkey 
        FOREIGN KEY (doctor_id) 
        REFERENCES public.profiles(id) 
        ON DELETE CASCADE;
        
        RAISE NOTICE 'SUCCESS: Added foreign key constraint patients_doctor_id_fkey';
    ELSE
        RAISE NOTICE 'Foreign key constraint patients_doctor_id_fkey already exists';
    END IF;
END $$;

-- Add comment to document the relationship
COMMENT ON COLUMN public.patients.doctor_id IS 'Foreign key referencing profiles.id - the doctor responsible for this patient';