-- Migração final para garantir que profile_id seja nullable
-- Esta migração deve ser executada por último para corrigir definitivamente o problema

DO $$ 
BEGIN
    -- Verificar estado atual da coluna
    RAISE NOTICE 'Verificando estado atual da coluna profile_id...';
    
    -- Forçar a coluna a ser nullable
    ALTER TABLE public.patients ALTER COLUMN profile_id DROP NOT NULL;
    
    -- Verificar se a alteração foi aplicada
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'patients' 
        AND column_name = 'profile_id' 
        AND is_nullable = 'YES'
    ) THEN
        RAISE NOTICE 'SUCESSO: Coluna profile_id agora permite valores NULL';
    ELSE
        RAISE EXCEPTION 'ERRO: Falha ao tornar profile_id nullable';
    END IF;
    
    -- Atualizar comentário da coluna
    COMMENT ON COLUMN public.patients.profile_id IS 'ID do perfil do usuário (opcional - permite pacientes sem conta no sistema)';
    
    RAISE NOTICE 'MIGRAÇÃO FINAL CONCLUÍDA: profile_id é definitivamente nullable';
END $$;