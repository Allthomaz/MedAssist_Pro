-- Criar tabela de configurações do sistema
-- Esta tabela armazena configurações globais do sistema, incluindo integrações como n8n

CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  settings JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  is_encrypted BOOLEAN DEFAULT false,
  
  -- Campos de auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Criar índice para busca rápida por chave
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON public.system_settings(key);

-- Trigger para atualizar o campo updated_at
CREATE TRIGGER trg_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Política para permitir apenas administradores acessarem as configurações do sistema
CREATE POLICY "Admins can manage system settings" 
  ON public.system_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid())
      AND role = 'admin'
    )
  );

-- Política para permitir que usuários autenticados leiam configurações não sensíveis
CREATE POLICY "Authenticated users can read non-sensitive settings" 
  ON public.system_settings FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    is_encrypted = false
  );

-- Inserir configurações iniciais
INSERT INTO public.system_settings (key, settings, description, is_encrypted)
VALUES 
  ('n8n_integration', '{}', 'Configurações para integração com n8n para automação de fluxos de trabalho', true),
  ('email_settings', '{}', 'Configurações gerais de email do sistema', true),
  ('app_settings', '{"name": "Doctor Brief AI", "version": "1.0.0"}', 'Configurações gerais da aplicação', false)
ON CONFLICT (key) DO NOTHING;

-- Comentários para documentação
COMMENT ON TABLE public.system_settings IS 'Armazena configurações globais do sistema e integrações';
COMMENT ON COLUMN public.system_settings.key IS 'Chave única para identificar a configuração';
COMMENT ON COLUMN public.system_settings.settings IS 'Configurações em formato JSON';
COMMENT ON COLUMN public.system_settings.is_encrypted IS 'Indica se o conteúdo deve ser tratado como sensível';