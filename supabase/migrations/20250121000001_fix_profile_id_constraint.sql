-- Migração simples para corrigir a constraint NOT NULL do profile_id
-- Esta migração apenas altera a coluna sem mexer nas políticas

DO $$ 
BEGIN
    -- Verificar se a tabela patients existe
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'patients') THEN
        
        -- Verificar se profile_id ainda é NOT NULL
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'patients' 
            AND column_name = 'profile_id' 
            AND is_nullable = 'NO'
        ) THEN
            -- Alterar a coluna para ser nullable
            ALTER TABLE public.patients ALTER COLUMN profile_id DROP NOT NULL;
            
            -- Atualizar comentário da coluna
            COMMENT ON COLUMN public.patients.profile_id IS 'ID do perfil do usuário (nullable - permite pacientes sem conta no sistema)';
            
            RAISE NOTICE 'SUCESSO: profile_id alterado para nullable';
        ELSE
            RAISE NOTICE 'profile_id já é nullable';
        END IF;
        
    ELSE
        RAISE NOTICE 'Tabela patients não existe';
    END IF;
END $$;