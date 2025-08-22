-- Criar bucket 'recordings' no Supabase Storage
-- Esta migração cria o bucket para armazenar gravações de áudio das consultas

-- Inserir o bucket 'recordings' na tabela storage.buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'recordings',
  'recordings', 
  false, -- bucket privado
  52428800, -- 50MB em bytes
  ARRAY['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/webm', 'audio/ogg']
)
ON CONFLICT (id) DO NOTHING;

-- RLS já está habilitado por padrão na tabela storage.objects

-- Política para permitir que médicos façam upload de gravações
CREATE POLICY "Doctors can upload recordings"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'recordings' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'doctor'
  )
);

-- Política para permitir que médicos vejam suas próprias gravações
CREATE POLICY "Doctors can view their recordings"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'recordings' AND
  auth.role() = 'authenticated' AND
  (
    -- O médico pode ver gravações que ele mesmo fez upload
    owner = auth.uid() OR
    -- Ou gravações associadas aos seus pacientes/consultas
    EXISTS (
      SELECT 1 FROM public.recordings r
      WHERE r.audio_file_name = name AND r.doctor_id = auth.uid()
    )
  )
);

-- Política para permitir que médicos atualizem suas próprias gravações
CREATE POLICY "Doctors can update their recordings"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'recordings' AND
  auth.role() = 'authenticated' AND
  (
    owner = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.recordings r
      WHERE r.audio_file_name = name AND r.doctor_id = auth.uid()
    )
  )
);

-- Política para permitir que médicos deletem suas próprias gravações
CREATE POLICY "Doctors can delete their recordings"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'recordings' AND
  auth.role() = 'authenticated' AND
  (
    owner = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.recordings r
      WHERE r.audio_file_name = name AND r.doctor_id = auth.uid()
    )
  )
);

-- Bucket criado para armazenar gravações de áudio das consultas

-- Log da migração
DO $$
BEGIN
  RAISE NOTICE 'Bucket "recordings" criado com sucesso para armazenar gravações de áudio';
  RAISE NOTICE 'Políticas RLS configuradas para permitir acesso apenas aos médicos proprietários';
END $$;