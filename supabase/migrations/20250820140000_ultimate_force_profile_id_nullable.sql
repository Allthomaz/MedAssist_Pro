-- MIGRAÇÃO DEFINITIVA PARA TORNAR profile_id NULLABLE
-- Esta migração deve resolver o problema de forma definitiva

-- Passo 1: Remover a constraint de chave estrangeira
ALTER TABLE public.patients DROP CONSTRAINT IF EXISTS patients_profile_id_fkey;

-- Passo 2: Forçar a coluna para ser nullable
ALTER TABLE public.patients ALTER COLUMN profile_id DROP NOT NULL;

-- Passo 3: Recriar a constraint de chave estrangeira sem NOT NULL
ALTER TABLE public.patients ADD CONSTRAINT patients_profile_id_fkey 
    FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Passo 4: Verificação final com mensagem de erro se falhar
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_attribute 
        WHERE attrelid = 'public.patients'::regclass 
        AND attname = 'profile_id' 
        AND attnotnull = true
    ) THEN
        RAISE EXCEPTION 'ERRO CRÍTICO: profile_id AINDA está como NOT NULL após a migração definitiva. Problema no PostgreSQL ou constraint oculta.';
    ELSE
        RAISE NOTICE 'SUCESSO DEFINITIVO: profile_id agora é nullable na tabela patients';
    END IF;
END $$;

-- Comentário para documentação
COMMENT ON COLUMN public.patients.profile_id IS 'Referência opcional ao perfil do usuário paciente (permite NULL para pacientes sem conta no sistema)';