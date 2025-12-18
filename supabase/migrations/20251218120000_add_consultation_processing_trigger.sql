-- Add new columns to the consultations table to store processing results
ALTER TABLE public.consultations
ADD COLUMN IF NOT EXISTS has_transcription BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS transcription_text TEXT,
ADD COLUMN IF NOT EXISTS summary_text TEXT,
ADD COLUMN IF NOT EXISTS processing_error TEXT;
