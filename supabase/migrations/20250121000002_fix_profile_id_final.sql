-- Alteração direta da coluna profile_id para permitir NULL
ALTER TABLE public.patients ALTER COLUMN profile_id DROP NOT NULL;

-- Verificação
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'patients' 
        AND column_name = 'profile_id' 
        AND is_nullable = 'YES'
    ) THEN
        RAISE NOTICE 'SUCESSO: profile_id agora é nullable';
    ELSE
        RAISE EXCEPTION 'ERRO: profile_id ainda é NOT NULL';
    END IF;
END $$;