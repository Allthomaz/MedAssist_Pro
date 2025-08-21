-- Adicionar campo para rastrear primeiro login e sistema de notificação de boas-vindas
-- Esta migração adiciona o campo first_login_at na tabela profiles

-- Verificar se a coluna já existe antes de adicionar
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'first_login_at') THEN
        ALTER TABLE public.profiles ADD COLUMN first_login_at TIMESTAMPTZ;
        COMMENT ON COLUMN public.profiles.first_login_at IS 'Timestamp do primeiro login do usuário (usado para mensagem de boas-vindas)';
    END IF;
END $$;

-- Função para criar notificação de boas-vindas
CREATE OR REPLACE FUNCTION public.create_welcome_notification(user_id_param UUID, user_name TEXT, user_role TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  welcome_title TEXT;
  welcome_message TEXT;
BEGIN
  -- Criar mensagem personalizada baseada no papel do usuário
  welcome_title := 'Bem-vindo ao Doctor Brief AI!';
  
  IF user_role = 'doctor' THEN
    welcome_message := 'Olá Dr(a). ' || user_name || '! É uma honra tê-lo(a) conosco. Estamos aqui para ser uma extensão do seu consultório, oferecendo as melhores ferramentas de IA para otimizar seu atendimento médico. Seja bem-vindo(a) à nossa plataforma!';
  ELSE
    welcome_message := 'Olá ' || user_name || '! É uma honra tê-lo(a) conosco. Nossa plataforma está aqui para facilitar seu acompanhamento médico e oferecer a melhor experiência em cuidados de saúde. Seja bem-vindo(a)!';
  END IF;
  
  -- Inserir notificação de boas-vindas
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    priority,
    channel,
    status,
    created_at
  ) VALUES (
    user_id_param,
    'welcome_message',
    welcome_title,
    welcome_message,
    'high',
    'in_app',
    'unread',
    now()
  );
END;
$$;

-- Adicionar tipo de notificação 'welcome_message' se não existir
DO $$
BEGIN
  -- Verificar se a constraint já permite 'welcome_message'
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name LIKE '%notifications_type_check%' 
    AND check_clause LIKE '%welcome_message%'
  ) THEN
    -- Remover constraint existente se existir
    BEGIN
      ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
    EXCEPTION
      WHEN undefined_object THEN
        -- Constraint não existe, continuar
        NULL;
    END;
    
    -- Adicionar nova constraint com 'welcome_message'
    ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check 
    CHECK (type IN (
      'appointment_reminder', 'appointment_confirmation', 'appointment_cancelled',
      'consultation_completed', 'document_ready', 'prescription_ready',
      'payment_due', 'payment_received', 'system_update', 'security_alert',
      'patient_message', 'doctor_message', 'lab_result', 'referral_update',
      'welcome_message'
    ));
  END IF;
END $$;

-- Comentários para documentação
COMMENT ON FUNCTION public.create_welcome_notification(UUID, TEXT, TEXT) IS 'Função para criar notificação de boas-vindas personalizada para novos usuários';

-- Garantir que a função seja executável por usuários autenticados
GRANT EXECUTE ON FUNCTION public.create_welcome_notification(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_welcome_notification(UUID, TEXT, TEXT) TO service_role;