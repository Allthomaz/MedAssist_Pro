-- MIGRAÇÃO FINAL DEFINITIVA: FORÇAR profile_id NULLABLE
-- Esta migração deve ser a ÚLTIMA a ser executada

-- Forçar profile_id a ser nullable
ALTER TABLE public.patients ALTER COLUMN profile_id DROP NOT NULL;

-- Verificar se a alteração funcionou
DO $$
DECLARE
    is_null_allowed TEXT;
BEGIN
    SELECT is_nullable INTO is_null_allowed 
    FROM information_schema.columns 
    WHERE table_name = 'patients' AND column_name = 'profile_id';
    
    IF is_null_allowed = 'YES' THEN
        RAISE NOTICE '✅ SUCESSO FINAL: profile_id agora é definitivamente nullable!';
    ELSE
        RAISE EXCEPTION '❌ FALHA FINAL: profile_id ainda é NOT NULL';
    END IF;
END $$;

-- Teste de inserção com profile_id NULL
DO $$
DECLARE
    doctor_id_var UUID;
BEGIN
    -- Pegar um doctor_id válido
    SELECT id INTO doctor_id_var FROM public.profiles WHERE role = 'doctor' LIMIT 1;
    
    IF doctor_id_var IS NOT NULL THEN
        -- Tentar inserir um paciente com profile_id NULL
        INSERT INTO public.patients (doctor_id, profile_id, full_name, birth_date, gender, status)
        VALUES (
            doctor_id_var,
            NULL, -- profile_id explicitamente NULL
            'TESTE FINAL NULLABLE',
            '1990-01-01',
            'other',
            'active'
        );
        
        -- Limpar o teste
        DELETE FROM public.patients WHERE full_name = 'TESTE FINAL NULLABLE';
        
        RAISE NOTICE '✅ TESTE FINAL SUCESSO: Inserção com profile_id NULL funcionou!';
    ELSE
        RAISE NOTICE '⚠️ AVISO: Nenhum médico encontrado para teste';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION '❌ TESTE FINAL FALHOU: %', SQLERRM;
END $$;