-- Migração direta para tornar profile_id nullable na tabela patients
-- Força a alteração usando ALTER TABLE DROP NOT NULL

ALTER TABLE public.patients ALTER COLUMN profile_id DROP NOT NULL;

-- Verifica se a alteração foi aplicada
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_attribute 
        WHERE attrelid = 'public.patients'::regclass 
        AND attname = 'profile_id' 
        AND attnotnull = true
    ) THEN
        RAISE EXCEPTION 'ERRO: profile_id ainda está como NOT NULL após a migração';
    ELSE
        RAISE NOTICE 'SUCESSO: profile_id agora permite NULL';
    END IF;
END $$;