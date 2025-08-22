-- Final deletion of dr.thomaz@email.com from profiles table
-- This user was already deleted from auth.users but remained in profiles

DELETE FROM public.profiles 
WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479' 
   OR email = 'dr.thomaz@email.com';

-- Verify deletion
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM public.profiles WHERE email = 'dr.thomaz@email.com') THEN
        RAISE EXCEPTION 'FAILED: dr.thomaz@email.com still exists in profiles';
    ELSE
        RAISE NOTICE 'SUCCESS: dr.thomaz@email.com completely removed from profiles';
    END IF;
END $$;