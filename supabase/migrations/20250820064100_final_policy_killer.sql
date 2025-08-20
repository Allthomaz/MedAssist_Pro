-- REMOÇÃO FINAL E DEFINITIVA DA POLÍTICA RECURSIVA
-- Esta migração será executada por último e força a remoção da política problemática

-- 1. Remover a política recursiva específica
DROP POLICY IF EXISTS "Doctors can view patient profiles" ON public.profiles;

-- 2. Verificar se foi removida e falhar se ainda existir
DO $$
DECLARE
    policy_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles' 
        AND policyname = 'Doctors can view patient profiles'
    ) INTO policy_exists;
    
    IF policy_exists THEN
        -- Tentar remover novamente com CASCADE
        DROP POLICY "Doctors can view patient profiles" ON public.profiles CASCADE;
        
        -- Verificar novamente
        SELECT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'public' 
            AND tablename = 'profiles' 
            AND policyname = 'Doctors can view patient profiles'
        ) INTO policy_exists;
        
        IF policy_exists THEN
            RAISE EXCEPTION 'IMPOSSÍVEL REMOVER: A política recursiva persiste mesmo após DROP CASCADE';
        ELSE
            RAISE NOTICE 'SUCESSO: Política removida com CASCADE';
        END IF;
    ELSE
        RAISE NOTICE 'SUCESSO: Política já estava removida';
    END IF;
END $$;

-- 3. Criar uma função que impede a criação da política recursiva
CREATE OR REPLACE FUNCTION public.prevent_recursive_policy()
RETURNS event_trigger
LANGUAGE plpgsql
AS $$
DECLARE
    obj record;
BEGIN
    FOR obj IN SELECT * FROM pg_event_trigger_ddl_commands()
    LOOP
        IF obj.command_tag = 'CREATE POLICY' AND 
           obj.object_identity LIKE '%Doctors can view patient profiles%' THEN
            RAISE EXCEPTION 'BLOQUEADO: Tentativa de criar política recursiva "Doctors can view patient profiles" foi impedida';
        END IF;
    END LOOP;
END;
$$;

-- 4. Criar event trigger para bloquear criação da política recursiva
DROP EVENT TRIGGER IF EXISTS prevent_recursive_policy_trigger;
CREATE EVENT TRIGGER prevent_recursive_policy_trigger
    ON ddl_command_end
    WHEN TAG IN ('CREATE POLICY')
    EXECUTE FUNCTION public.prevent_recursive_policy();

-- 5. Log final (comentário apenas - logs são tratados nos blocos DO acima)
-- Event trigger criado para bloquear política recursiva
-- Migração final de remoção de política concluída