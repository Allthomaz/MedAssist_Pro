-- Execução direta para corrigir profile_id
BEGIN;

-- Alterar a coluna para permitir NULL
ALTER TABLE public.patients ALTER COLUMN profile_id DROP NOT NULL;

-- Verificar se a alteração foi aplicada
SELECT 
    column_name, 
    is_nullable, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'patients' 
AND column_name = 'profile_id';

COMMIT;