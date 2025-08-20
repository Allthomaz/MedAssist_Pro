-- Migração final para tornar profile_id nullable na tabela patients
-- Esta migração força a remoção da constraint NOT NULL

BEGIN;

-- Remover constraint NOT NULL da coluna profile_id
ALTER TABLE public.patients ALTER COLUMN profile_id DROP NOT NULL;

-- Verificar se a alteração foi aplicada
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'patients' 
        AND column_name = 'profile_id' 
        AND is_nullable = 'NO'
    ) THEN
        RAISE EXCEPTION 'ERRO: profile_id ainda é NOT NULL após a alteração';
    ELSE
        RAISE NOTICE 'SUCESSO: profile_id agora é nullable';
    END IF;
END $$;

COMMIT;