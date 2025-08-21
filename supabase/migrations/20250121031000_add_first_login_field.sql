-- Adicionar campo first_login_at na tabela profiles
-- Esta migração força a criação do campo necessário para o sistema de boas-vindas

ALTER TABLE public.profiles ADD COLUMN first_login_at TIMESTAMPTZ;

-- Comentário para documentação
COMMENT ON COLUMN public.profiles.first_login_at IS 'Timestamp do primeiro login do usuário (usado para mensagem de boas-vindas)';

-- Verificar se o campo foi criado
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'profiles' AND column_name = 'first_login_at') THEN
        RAISE NOTICE 'Campo first_login_at criado com sucesso na tabela profiles';
    ELSE
        RAISE EXCEPTION 'Falha ao criar campo first_login_at na tabela profiles';
    END IF;
END $$;