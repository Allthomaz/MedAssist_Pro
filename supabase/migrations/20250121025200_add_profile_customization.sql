-- Add profile customization fields
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS custom_title TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS theme_preference TEXT DEFAULT 'light',
ADD COLUMN IF NOT EXISTS compact_mode BOOLEAN DEFAULT false;

-- Update existing profiles to have default values
UPDATE profiles 
SET 
  theme_preference = COALESCE(theme_preference, 'light'),
  compact_mode = COALESCE(compact_mode, false)
WHERE theme_preference IS NULL OR compact_mode IS NULL;