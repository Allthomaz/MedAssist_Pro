-- Migração final definitiva para tornar profile_id nullable
-- Esta migração deve ser a última a ser aplicada

-- Primeiro, remove qualquer constraint que possa estar forçando NOT NULL
DO $$
BEGIN
    -- Força a alteração da coluna para nullable
    EXECUTE 'ALTER TABLE public.patients ALTER COLUMN profile_id DROP NOT NULL';
    
    -- Verifica se a alteração foi bem-sucedida
    IF EXISTS (
        SELECT 1 FROM pg_attribute 
        WHERE attrelid = 'public.patients'::regclass 
        AND attname = 'profile_id' 
        AND attnotnull = true
    ) THEN
        -- Se ainda estiver NOT NULL, tenta uma abordagem mais agressiva
        RAISE NOTICE 'Primeira tentativa falhou, tentando abordagem alternativa...';
        
        -- Remove e recria a constraint de chave estrangeira
        ALTER TABLE public.patients DROP CONSTRAINT IF EXISTS patients_profile_id_fkey;
        ALTER TABLE public.patients ALTER COLUMN profile_id DROP NOT NULL;
        ALTER TABLE public.patients ADD CONSTRAINT patients_profile_id_fkey 
            FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
            
        RAISE NOTICE 'Constraint recriada com profile_id nullable';
    ELSE
        RAISE NOTICE 'SUCESSO: profile_id agora é nullable';
    END IF;
END $$;

-- Verificação final
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_attribute 
        WHERE attrelid = 'public.patients'::regclass 
        AND attname = 'profile_id' 
        AND attnotnull = true
    ) THEN
        RAISE EXCEPTION 'ERRO CRÍTICO: profile_id ainda está como NOT NULL após todas as tentativas';
    ELSE
        RAISE NOTICE 'CONFIRMADO: profile_id é nullable na tabela patients';
    END IF;
END $$;