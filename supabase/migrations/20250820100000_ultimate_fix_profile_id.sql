-- Migração definitiva para corrigir profile_id nullable
-- Esta migração será executada por último para garantir que profile_id seja nullable

DO $$ 
BEGIN
    -- Verificar se a tabela patients existe
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'patients') THEN
        -- Forçar profile_id a ser nullable
        ALTER TABLE public.patients ALTER COLUMN profile_id DROP NOT NULL;
        
        -- Verificar se a alteração foi aplicada
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'patients' 
            AND column_name = 'profile_id' 
            AND is_nullable = 'YES'
        ) THEN
            RAISE NOTICE 'SUCESSO: profile_id agora é nullable';
        ELSE
            RAISE EXCEPTION 'ERRO: Falha ao tornar profile_id nullable';
        END IF;
        
        -- Atualizar comentário
        COMMENT ON COLUMN public.patients.profile_id IS 'ID do perfil do usuário (opcional - permite pacientes sem conta)';
        
        RAISE NOTICE 'MIGRAÇÃO DEFINITIVA CONCLUÍDA: profile_id é nullable';
    ELSE
        RAISE NOTICE 'Tabela patients não existe ainda';
    END IF;
END $$;