-- Criar sistema de notificações
-- Esta tabela gerencia todas as notificações do sistema

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Tipo de notificação
  type TEXT NOT NULL CHECK (type IN (
    'appointment_reminder', 'appointment_confirmation', 'appointment_cancelled',
    'consultation_completed', 'document_ready', 'prescription_ready',
    'payment_due', 'payment_received', 'system_update', 'security_alert',
    'patient_message', 'doctor_message', 'lab_result', 'referral_update'
  )),
  
  -- Título e conteúdo da notificação
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Dados adicionais em JSON
  data JSONB DEFAULT '{}',
  
  -- Status da notificação
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN (
    'unread', 'read', 'archived', 'deleted'
  )),
  
  -- Prioridade
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN (
    'low', 'normal', 'high', 'urgent'
  )),
  
  -- Canal de entrega
  channel TEXT NOT NULL DEFAULT 'in_app' CHECK (channel IN (
    'in_app', 'email', 'sms', 'push', 'whatsapp'
  )),
  
  -- Status de entrega
  delivery_status TEXT DEFAULT 'pending' CHECK (delivery_status IN (
    'pending', 'sent', 'delivered', 'failed', 'bounced'
  )),
  
  -- Timestamps de entrega
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  
  -- Agendamento de notificação
  scheduled_for TIMESTAMPTZ,
  
  -- Referências opcionais
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE SET NULL,
  document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  
  -- Campos de auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela para configurações de notificação por usuário
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Tipo de notificação
  notification_type TEXT NOT NULL,
  
  -- Canais habilitados para este tipo
  in_app_enabled BOOLEAN DEFAULT true,
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  push_enabled BOOLEAN DEFAULT true,
  whatsapp_enabled BOOLEAN DEFAULT false,
  
  -- Horários permitidos para notificações
  quiet_hours_start TIME DEFAULT '22:00',
  quiet_hours_end TIME DEFAULT '08:00',
  
  -- Dias da semana permitidos (array de números: 0=domingo, 6=sábado)
  allowed_days INTEGER[] DEFAULT ARRAY[1,2,3,4,5,6,0],
  
  -- Campos de auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Constraint para evitar duplicatas
  UNIQUE(user_id, notification_type)
);

-- Tabela para templates de notificação
CREATE TABLE IF NOT EXISTS public.notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificador único do template
  template_key TEXT NOT NULL UNIQUE,
  
  -- Nome e descrição
  name TEXT NOT NULL,
  description TEXT,
  
  -- Tipo de notificação
  notification_type TEXT NOT NULL,
  
  -- Templates por canal
  in_app_title TEXT,
  in_app_message TEXT,
  email_subject TEXT,
  email_body TEXT,
  sms_message TEXT,
  push_title TEXT,
  push_message TEXT,
  whatsapp_message TEXT,
  
  -- Variáveis disponíveis no template
  available_variables JSONB DEFAULT '[]',
  
  -- Status do template
  is_active BOOLEAN DEFAULT true,
  
  -- Campos de auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela para log de entregas
CREATE TABLE IF NOT EXISTS public.notification_delivery_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  
  -- Canal de entrega
  channel TEXT NOT NULL,
  
  -- Status da tentativa
  status TEXT NOT NULL CHECK (status IN (
    'pending', 'sent', 'delivered', 'failed', 'bounced', 'rejected'
  )),
  
  -- Detalhes da entrega
  provider TEXT, -- Nome do provedor (SendGrid, Twilio, etc.)
  external_id TEXT, -- ID externo do provedor
  response_data JSONB, -- Resposta completa do provedor
  error_message TEXT,
  
  -- Timestamps
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  delivered_at TIMESTAMPTZ,
  
  -- Campos de auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Função para marcar notificação como lida
CREATE OR REPLACE FUNCTION mark_notification_as_read(notification_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.notifications
  SET 
    status = 'read',
    read_at = now(),
    updated_at = now()
  WHERE id = notification_uuid
    AND user_id = (select auth.uid())
    AND status = 'unread';
  
  RETURN FOUND;
END;
$$;

-- Função para criar notificação
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_data JSONB DEFAULT '{}',
  p_priority TEXT DEFAULT 'normal',
  p_channel TEXT DEFAULT 'in_app',
  p_scheduled_for TIMESTAMPTZ DEFAULT NULL,
  p_appointment_id UUID DEFAULT NULL,
  p_consultation_id UUID DEFAULT NULL,
  p_document_id UUID DEFAULT NULL,
  p_patient_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (
    user_id, type, title, message, data, priority, channel,
    scheduled_for, appointment_id, consultation_id, document_id, patient_id
  )
  VALUES (
    p_user_id, p_type, p_title, p_message, p_data, p_priority, p_channel,
    p_scheduled_for, p_appointment_id, p_consultation_id, p_document_id, p_patient_id
  )
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Função para limpar notificações antigas
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER := 0;
  temp_count INTEGER;
BEGIN
  -- Deletar notificações lidas com mais de 30 dias
  DELETE FROM public.notifications
  WHERE status = 'read'
    AND read_at < (now() - INTERVAL '30 days');
  
  GET DIAGNOSTICS temp_count = ROW_COUNT;
  deleted_count := deleted_count + temp_count;
  
  -- Deletar notificações não lidas com mais de 90 dias
  DELETE FROM public.notifications
  WHERE status = 'unread'
    AND created_at < (now() - INTERVAL '90 days');
  
  GET DIAGNOSTICS temp_count = ROW_COUNT;
  deleted_count := deleted_count + temp_count;
  
  RETURN deleted_count;
END;
$$;

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON public.notifications(priority);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled_for ON public.notifications(scheduled_for) WHERE scheduled_for IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_status ON public.notifications(user_id, status);

CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON public.notification_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_templates_type ON public.notification_templates(notification_type);
CREATE INDEX IF NOT EXISTS idx_notification_templates_key ON public.notification_templates(template_key);

CREATE INDEX IF NOT EXISTS idx_delivery_log_notification_id ON public.notification_delivery_log(notification_id);
CREATE INDEX IF NOT EXISTS idx_delivery_log_status ON public.notification_delivery_log(status);
CREATE INDEX IF NOT EXISTS idx_delivery_log_attempted_at ON public.notification_delivery_log(attempted_at);

-- Triggers para atualizar updated_at
DROP TRIGGER IF EXISTS trg_notifications_updated_at ON public.notifications;
CREATE TRIGGER trg_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_notification_preferences_updated_at ON public.notification_preferences;
CREATE TRIGGER trg_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_notification_templates_updated_at ON public.notification_templates;
CREATE TRIGGER trg_notification_templates_updated_at
  BEFORE UPDATE ON public.notification_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_delivery_log ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- Políticas para notification_preferences
DROP POLICY IF EXISTS "Users can view their own preferences" ON public.notification_preferences;
CREATE POLICY "Users can view their own preferences"
  ON public.notification_preferences FOR SELECT
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own preferences" ON public.notification_preferences;
CREATE POLICY "Users can insert their own preferences"
  ON public.notification_preferences FOR INSERT
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update their own preferences" ON public.notification_preferences;
CREATE POLICY "Users can update their own preferences"
  ON public.notification_preferences FOR UPDATE
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- Políticas para notification_templates (apenas leitura para usuários)
DROP POLICY IF EXISTS "Users can view notification templates" ON public.notification_templates;
CREATE POLICY "Users can view notification templates"
  ON public.notification_templates FOR SELECT
  USING (is_active = true);

-- Políticas para delivery_log (apenas para notificações do usuário)
DROP POLICY IF EXISTS "Users can view their notification delivery logs" ON public.notification_delivery_log;
CREATE POLICY "Users can view their notification delivery logs"
  ON public.notification_delivery_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.notifications n
      WHERE n.id = notification_id AND n.user_id = (select auth.uid())
    )
  );

-- Comentários para documentação
COMMENT ON TABLE public.notifications IS 'Sistema de notificações do aplicativo';
COMMENT ON COLUMN public.notifications.type IS 'Tipo de notificação para categorização';
COMMENT ON COLUMN public.notifications.data IS 'Dados adicionais em formato JSON';
COMMENT ON COLUMN public.notifications.scheduled_for IS 'Data/hora para envio agendado da notificação';

COMMENT ON TABLE public.notification_preferences IS 'Preferências de notificação por usuário';
COMMENT ON COLUMN public.notification_preferences.quiet_hours_start IS 'Início do período de silêncio';
COMMENT ON COLUMN public.notification_preferences.allowed_days IS 'Dias da semana permitidos (0=domingo, 6=sábado)';

COMMENT ON TABLE public.notification_templates IS 'Templates para diferentes tipos de notificação';
COMMENT ON COLUMN public.notification_templates.available_variables IS 'Variáveis disponíveis para substituição no template';

COMMENT ON TABLE public.notification_delivery_log IS 'Log de tentativas de entrega de notificações';
COMMENT ON COLUMN public.notification_delivery_log.external_id IS 'ID fornecido pelo provedor de entrega';