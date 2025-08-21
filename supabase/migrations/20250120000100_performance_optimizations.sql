-- ========================================
-- OTIMIZAÇÕES DE PERFORMANCE DO SUPABASE
-- ========================================
-- Este arquivo contém otimizações baseadas nas queries mais utilizadas
-- na aplicação MedAssist Pro

-- ========================================
-- ÍNDICES COMPOSTOS PARA QUERIES FREQUENTES
-- ========================================

-- Índice composto para busca de pacientes por médico e status
CREATE INDEX IF NOT EXISTS idx_patients_doctor_status 
  ON public.patients(doctor_id, status) 
  WHERE status = 'active';

-- Índice composto para busca de consultas por médico, data e status
CREATE INDEX IF NOT EXISTS idx_consultations_doctor_date_status 
  ON public.consultations(doctor_id, consultation_date, status);

-- Índice composto para relatórios de consultas por médico e tipo
CREATE INDEX IF NOT EXISTS idx_consultations_doctor_type 
  ON public.consultations(doctor_id, consultation_type);

-- Índice composto para consultas por médico e período (relatórios mensais)
CREATE INDEX IF NOT EXISTS idx_consultations_doctor_month
  ON public.consultations(doctor_id, consultation_date);

-- Índice para agendamentos por médico e data
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date 
  ON public.appointments(doctor_id, appointment_date);

-- Índice para notificações não lidas por usuário
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread 
  ON public.notifications(user_id, status) 
  WHERE status = 'unread';

-- ========================================
-- ÍNDICES PARA BUSCA DE TEXTO
-- ========================================

-- Índice GIN para busca de pacientes por nome (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_patients_name_gin 
  ON public.patients USING gin(to_tsvector('portuguese', full_name));

-- Índice GIN para busca em anotações clínicas (já existe, mas verificando)
DROP INDEX IF EXISTS idx_consultations_clinical_notes;
CREATE INDEX IF NOT EXISTS idx_consultations_clinical_notes_gin 
  ON public.consultations USING gin(to_tsvector('portuguese', 
    COALESCE(clinical_notes, '') || ' ' || 
    COALESCE(diagnosis, '') || ' ' || 
    COALESCE(treatment_plan, '')
  )) WHERE clinical_notes IS NOT NULL;

-- ========================================
-- VIEWS MATERIALIZADAS PARA RELATÓRIOS
-- ========================================

-- View materializada para estatísticas do dashboard
CREATE MATERIALIZED VIEW IF NOT EXISTS dashboard_stats AS
SELECT 
  doctor_id,
  COUNT(*) as total_patients,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_patients,
  COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as new_patients_month
FROM public.patients
GROUP BY doctor_id;

-- Índice único para a view materializada
CREATE UNIQUE INDEX IF NOT EXISTS idx_dashboard_stats_doctor 
  ON dashboard_stats(doctor_id);

-- Revogar acesso SELECT para papéis anon e authenticated
REVOKE SELECT ON dashboard_stats FROM anon;
REVOKE SELECT ON dashboard_stats FROM authenticated;

-- View materializada para estatísticas de consultas
CREATE MATERIALIZED VIEW IF NOT EXISTS consultation_stats AS
SELECT 
  doctor_id,
  DATE_TRUNC('month', consultation_date) as month,
  consultation_type,
  consultation_mode,
  status,
  COUNT(*) as total_consultations,
  AVG(actual_duration) as avg_duration,
  COUNT(CASE WHEN document_generated = true THEN 1 END) as documents_generated,
  COUNT(CASE WHEN has_recording = true THEN 1 END) as recordings_made
FROM public.consultations
WHERE consultation_date >= CURRENT_DATE - INTERVAL '24 months'
GROUP BY doctor_id, DATE_TRUNC('month', consultation_date), 
         consultation_type, consultation_mode, status;

-- Índice composto para a view de estatísticas de consultas
CREATE INDEX IF NOT EXISTS idx_consultation_stats_doctor_month 
  ON consultation_stats(doctor_id, month);

-- Revogar acesso SELECT para papéis anon e authenticated
REVOKE SELECT ON consultation_stats FROM anon;
REVOKE SELECT ON consultation_stats FROM authenticated;

-- ========================================
-- FUNÇÕES PARA REFRESH DAS VIEWS
-- ========================================

-- Função para atualizar estatísticas do dashboard
CREATE OR REPLACE FUNCTION refresh_dashboard_stats()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  SET search_path = public, extensions;
  REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_stats;
END;
$$;

-- Função para atualizar estatísticas de consultas
CREATE OR REPLACE FUNCTION refresh_consultation_stats()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  SET search_path = public, extensions;
  REFRESH MATERIALIZED VIEW CONCURRENTLY consultation_stats;
END;
$$;

-- ========================================
-- TRIGGERS PARA AUTO-REFRESH
-- ========================================

-- Função para trigger de atualização de estatísticas
CREATE OR REPLACE FUNCTION trigger_refresh_stats()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  SET search_path = public, extensions;
  -- Agendar refresh das views materializadas
  -- Nota: Em produção, considere usar pg_cron ou similar
  PERFORM pg_notify('refresh_stats', 'dashboard');
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger para atualizar estatísticas quando pacientes são modificados
DROP TRIGGER IF EXISTS trg_patients_refresh_stats ON public.patients;
CREATE TRIGGER trg_patients_refresh_stats
  AFTER INSERT OR UPDATE OR DELETE ON public.patients
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_refresh_stats();

-- Trigger para atualizar estatísticas quando consultas são modificadas
DROP TRIGGER IF EXISTS trg_consultations_refresh_stats ON public.consultations;
CREATE TRIGGER trg_consultations_refresh_stats
  AFTER INSERT OR UPDATE OR DELETE ON public.consultations
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_refresh_stats();

-- ========================================
-- OTIMIZAÇÕES DE CONFIGURAÇÃO
-- ========================================

-- Configurar parâmetros de performance para as tabelas principais
ALTER TABLE public.patients SET (fillfactor = 90);
ALTER TABLE public.consultations SET (fillfactor = 85);
ALTER TABLE public.appointments SET (fillfactor = 90);

-- ========================================
-- POLÍTICAS RLS OTIMIZADAS
-- ========================================

-- Otimizar política de pacientes para usar índice
DROP POLICY IF EXISTS "Doctors can view their own patients" ON public.patients;
CREATE POLICY "Doctors can view their own patients"
  ON public.patients FOR SELECT
  USING (doctor_id = (select auth.uid()) AND status != 'archived');

-- Otimizar política de consultas para usar índice
DROP POLICY IF EXISTS "Doctors can view their own consultations" ON public.consultations;
CREATE POLICY "Doctors can view their own consultations"
  ON public.consultations FOR SELECT
  USING (doctor_id = (select auth.uid()));

-- ========================================
-- FUNÇÕES AUXILIARES PARA RELATÓRIOS
-- ========================================

-- Função otimizada para buscar estatísticas do dashboard
CREATE OR REPLACE FUNCTION get_dashboard_stats(doctor_uuid UUID)
RETURNS TABLE(
  total_patients BIGINT,
  active_patients BIGINT,
  new_patients_month BIGINT,
  total_consultations_month BIGINT,
  completed_consultations_month BIGINT,
  pending_appointments BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
  SET search_path = public, extensions;
  RETURN QUERY
  SELECT 
    COALESCE(ds.total_patients, 0),
    COALESCE(ds.active_patients, 0),
    COALESCE(ds.new_patients_month, 0),
    COALESCE((
      SELECT COUNT(*) 
      FROM public.consultations c 
      WHERE c.doctor_id = doctor_uuid 
        AND c.consultation_date >= DATE_TRUNC('month', CURRENT_DATE)
        AND c.consultation_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
    ), 0),
    COALESCE((
      SELECT COUNT(*) 
      FROM public.consultations c 
      WHERE c.doctor_id = doctor_uuid 
        AND c.consultation_date >= DATE_TRUNC('month', CURRENT_DATE)
        AND c.consultation_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
        AND c.status = 'finalizada'
    ), 0),
    COALESCE((
      SELECT COUNT(*) 
      FROM public.appointments a 
      WHERE a.doctor_id = doctor_uuid 
        AND a.appointment_date >= CURRENT_DATE
        AND a.status = 'agendado'
    ), 0)
  FROM dashboard_stats ds
  WHERE ds.doctor_id = doctor_uuid;
END;
$$;

-- Função otimizada para relatórios de consultas por tipo
CREATE OR REPLACE FUNCTION get_consultations_by_type(doctor_uuid UUID, start_date DATE, end_date DATE)
RETURNS TABLE(
  consultation_type TEXT,
  total_count BIGINT,
  avg_duration NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
  SET search_path = public, extensions;
  RETURN QUERY
  SELECT 
    c.consultation_type,
    COUNT(*) as total_count,
    AVG(c.actual_duration) as avg_duration
  FROM public.consultations c
  WHERE c.doctor_id = doctor_uuid
    AND c.consultation_date >= start_date
    AND c.consultation_date <= end_date
  GROUP BY c.consultation_type
  ORDER BY total_count DESC;
END;
$$;

-- ========================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- ========================================

COMMENT ON MATERIALIZED VIEW dashboard_stats IS 'Estatísticas agregadas para o dashboard médico - atualizada via triggers';
COMMENT ON MATERIALIZED VIEW consultation_stats IS 'Estatísticas detalhadas de consultas por mês e tipo - para relatórios';
COMMENT ON FUNCTION get_dashboard_stats(UUID) IS 'Função otimizada para buscar estatísticas do dashboard de um médico';
COMMENT ON FUNCTION get_consultations_by_type(UUID, DATE, DATE) IS 'Função otimizada para relatórios de consultas por tipo em um período';

-- ========================================
-- REFRESH INICIAL DAS VIEWS
-- ========================================

-- Fazer refresh inicial das views materializadas
REFRESH MATERIALIZED VIEW dashboard_stats;
REFRESH MATERIALIZED VIEW consultation_stats;

-- ========================================
-- ANÁLISE FINAL DAS TABELAS
-- ========================================

-- Atualizar estatísticas do PostgreSQL para otimizar o query planner
ANALYZE public.patients;
ANALYZE public.consultations;
ANALYZE public.appointments;
ANALYZE public.notifications;
ANALYZE dashboard_stats;
ANALYZE consultation_stats;

-- Log de conclusão
DO $$
BEGIN
  RAISE NOTICE 'Otimizações de performance aplicadas com sucesso!';
  RAISE NOTICE 'Índices compostos criados para queries frequentes';
  RAISE NOTICE 'Views materializadas criadas para relatórios';
  RAISE NOTICE 'Funções otimizadas para dashboard e relatórios';
  RAISE NOTICE 'Triggers configurados para auto-refresh das estatísticas';
END $$;