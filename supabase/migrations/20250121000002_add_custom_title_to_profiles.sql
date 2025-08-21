-- Adicionar coluna custom_title à tabela profiles
-- Esta coluna permitirá que usuários personalizem como querem ser chamados

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS custom_title TEXT;

-- Comentário para documentação
COMMENT ON COLUMN public.profiles.custom_title IS 'Título personalizado para como o usuário prefere ser chamado (ex: Dr., Dra., Prof., etc.)';

-- Log de sucesso
DO $$
BEGIN
    RAISE NOTICE 'Coluna custom_title adicionada à tabela profiles com sucesso';
END $$;