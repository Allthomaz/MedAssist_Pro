-- Criar tabela de documentos gerados
-- Esta tabela armazena todos os documentos médicos gerados a partir dos templates

CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE SET NULL,
  template_id UUID REFERENCES public.document_templates(id) ON DELETE SET NULL,
  
  -- Informações básicas do documento
  document_number TEXT UNIQUE, -- Número sequencial do documento
  title TEXT NOT NULL,
  description TEXT,
  
  -- Tipo de documento
  document_type TEXT NOT NULL CHECK (document_type IN (
    'prontuario', 'receita', 'atestado', 'laudo', 'relatorio',
    'encaminhamento', 'solicitacao_exame', 'declaracao', 'outros'
  )),
  
  -- Categoria/especialidade
  category TEXT,
  
  -- Conteúdo do documento
  content_data JSONB NOT NULL DEFAULT '{}', -- Dados estruturados preenchidos
  content_html TEXT, -- HTML renderizado do documento
  content_text TEXT, -- Versão em texto puro para busca
  
  -- Arquivos gerados
  pdf_url TEXT, -- URL do PDF gerado
  pdf_file_size INTEGER, -- Tamanho do arquivo PDF em bytes
  
  -- Status do documento
  status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN (
    'rascunho', 'finalizado', 'assinado', 'enviado', 'cancelado', 'arquivado'
  )),
  
  -- Informações de assinatura digital
  is_signed BOOLEAN DEFAULT false,
  signed_at TIMESTAMPTZ,
  signature_data JSONB, -- Dados da assinatura digital
  
  -- Versionamento
  version INTEGER DEFAULT 1,
  parent_document_id UUID REFERENCES public.documents(id),
  
  -- Validade (para receitas, atestados, etc.)
  valid_from DATE,
  valid_until DATE,
  
  -- Informações de envio/compartilhamento
  sent_to_patient BOOLEAN DEFAULT false,
  sent_to_patient_at TIMESTAMPTZ,
  patient_email_sent TEXT,
  
  -- Metadados adicionais
  metadata JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  
  -- Campos de auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ
);

-- Tabela para anexos dos documentos
CREATE TABLE IF NOT EXISTS public.document_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  
  -- Informações do arquivo
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- MIME type
  file_size INTEGER NOT NULL, -- Tamanho em bytes
  file_url TEXT NOT NULL, -- URL do arquivo no storage
  
  -- Tipo de anexo
  attachment_type TEXT NOT NULL CHECK (attachment_type IN (
    'exame', 'imagem', 'audio', 'video', 'documento', 'outros'
  )),
  
  -- Descrição do anexo
  description TEXT,
  
  -- Ordem de exibição
  display_order INTEGER DEFAULT 0,
  
  -- Campos de auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela para histórico de alterações dos documentos
CREATE TABLE IF NOT EXISTS public.document_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  
  -- Informações da alteração
  action TEXT NOT NULL CHECK (action IN (
    'created', 'updated', 'signed', 'sent', 'cancelled', 'archived', 'restored'
  )),
  
  -- Dados antes da alteração (para rollback)
  previous_data JSONB,
  
  -- Dados após a alteração
  new_data JSONB,
  
  -- Campos alterados
  changed_fields TEXT[],
  
  -- Motivo da alteração
  change_reason TEXT,
  
  -- Usuário que fez a alteração
  changed_by UUID REFERENCES public.profiles(id),
  
  -- Timestamp da alteração
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela para compartilhamento de documentos
CREATE TABLE IF NOT EXISTS public.document_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  shared_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Destinatário do compartilhamento
  shared_with_email TEXT,
  shared_with_name TEXT,
  
  -- Tipo de compartilhamento
  share_type TEXT NOT NULL CHECK (share_type IN (
    'email', 'link', 'whatsapp', 'download'
  )),
  
  -- Token de acesso (para links públicos)
  access_token TEXT UNIQUE,
  
  -- Configurações de acesso
  expires_at TIMESTAMPTZ,
  max_downloads INTEGER,
  download_count INTEGER DEFAULT 0,
  requires_password BOOLEAN DEFAULT false,
  access_password TEXT,
  
  -- Status do compartilhamento
  is_active BOOLEAN DEFAULT true,
  
  -- Logs de acesso
  last_accessed_at TIMESTAMPTZ,
  access_count INTEGER DEFAULT 0,
  
  -- Campos de auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Função para gerar número sequencial do documento
CREATE OR REPLACE FUNCTION generate_document_number(
  p_doctor_id UUID,
  p_document_type TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  doctor_initials TEXT;
  type_prefix TEXT;
  sequence_number INTEGER;
  document_number TEXT;
BEGIN
  -- Buscar iniciais do médico
  SELECT 
    UPPER(LEFT(SPLIT_PART(full_name, ' ', 1), 1) || LEFT(SPLIT_PART(full_name, ' ', -1), 1))
  INTO doctor_initials
  FROM public.profiles
  WHERE id = p_doctor_id;
  
  -- Definir prefixo baseado no tipo
  type_prefix := CASE p_document_type
    WHEN 'prontuario' THEN 'PR'
    WHEN 'receita' THEN 'RC'
    WHEN 'atestado' THEN 'AT'
    WHEN 'laudo' THEN 'LD'
    WHEN 'relatorio' THEN 'RL'
    WHEN 'encaminhamento' THEN 'EN'
    WHEN 'solicitacao_exame' THEN 'SE'
    WHEN 'declaracao' THEN 'DC'
    ELSE 'DC'
  END;
  
  -- Buscar próximo número sequencial
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(document_number FROM '\d+$') AS INTEGER)
  ), 0) + 1
  INTO sequence_number
  FROM public.documents
  WHERE doctor_id = p_doctor_id
  AND document_type = p_document_type
  AND document_number ~ ('^' || doctor_initials || type_prefix || '\d+$');
  
  -- Gerar número do documento
  document_number := doctor_initials || type_prefix || LPAD(sequence_number::TEXT, 6, '0');
  
  RETURN document_number;
END;
$$;

-- Função para criar entrada no histórico
CREATE OR REPLACE FUNCTION create_document_history_entry()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  action_type TEXT;
  changed_fields TEXT[];
BEGIN
  -- Determinar tipo de ação
  IF TG_OP = 'INSERT' THEN
    action_type := 'created';
  ELSIF TG_OP = 'UPDATE' THEN
    action_type := 'updated';
    
    -- Detectar campos alterados
    changed_fields := ARRAY[]::TEXT[];
    
    IF OLD.status != NEW.status THEN
      changed_fields := array_append(changed_fields, 'status');
      
      -- Ações específicas baseadas no status
      IF NEW.status = 'assinado' AND OLD.status != 'assinado' THEN
        action_type := 'signed';
      ELSIF NEW.status = 'enviado' AND OLD.status != 'enviado' THEN
        action_type := 'sent';
      ELSIF NEW.status = 'cancelado' AND OLD.status != 'cancelado' THEN
        action_type := 'cancelled';
      ELSIF NEW.status = 'arquivado' AND OLD.status != 'arquivado' THEN
        action_type := 'archived';
      END IF;
    END IF;
    
    IF OLD.content_data != NEW.content_data THEN
      changed_fields := array_append(changed_fields, 'content_data');
    END IF;
    
    IF OLD.title != NEW.title THEN
      changed_fields := array_append(changed_fields, 'title');
    END IF;
  END IF;
  
  -- Inserir entrada no histórico
  INSERT INTO public.document_history (
    document_id, action, previous_data, new_data, changed_fields, changed_by
  ) VALUES (
    COALESCE(NEW.id, OLD.id),
    action_type,
    CASE WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) ELSE NULL END,
    changed_fields,
    auth.uid()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger para definir número do documento
CREATE OR REPLACE FUNCTION set_document_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.document_number IS NULL THEN
    NEW.document_number := generate_document_number(NEW.doctor_id, NEW.document_type);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_documents_doctor_id ON public.documents(doctor_id);
CREATE INDEX IF NOT EXISTS idx_documents_patient_id ON public.documents(patient_id);
CREATE INDEX IF NOT EXISTS idx_documents_consultation_id ON public.documents(consultation_id);
CREATE INDEX IF NOT EXISTS idx_documents_template_id ON public.documents(template_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON public.documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_number ON public.documents(document_number);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON public.documents(created_at);
CREATE INDEX IF NOT EXISTS idx_documents_tags ON public.documents USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_documents_content_text ON public.documents USING GIN(to_tsvector('portuguese', content_text));
CREATE INDEX IF NOT EXISTS idx_documents_not_deleted ON public.documents(id) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_document_attachments_document_id ON public.document_attachments(document_id);
CREATE INDEX IF NOT EXISTS idx_document_attachments_type ON public.document_attachments(attachment_type);

CREATE INDEX IF NOT EXISTS idx_document_history_document_id ON public.document_history(document_id);
CREATE INDEX IF NOT EXISTS idx_document_history_changed_at ON public.document_history(changed_at);

CREATE INDEX IF NOT EXISTS idx_document_shares_document_id ON public.document_shares(document_id);
CREATE INDEX IF NOT EXISTS idx_document_shares_token ON public.document_shares(access_token);
CREATE INDEX IF NOT EXISTS idx_document_shares_active ON public.document_shares(is_active);

-- Triggers
DROP TRIGGER IF EXISTS trg_documents_set_number ON public.documents;
CREATE TRIGGER trg_documents_set_number
  BEFORE INSERT ON public.documents
  FOR EACH ROW EXECUTE FUNCTION set_document_number();

DROP TRIGGER IF EXISTS trg_documents_updated_at ON public.documents;
CREATE TRIGGER trg_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_document_attachments_updated_at ON public.document_attachments;
CREATE TRIGGER trg_document_attachments_updated_at
  BEFORE UPDATE ON public.document_attachments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_document_shares_updated_at ON public.document_shares;
CREATE TRIGGER trg_document_shares_updated_at
  BEFORE UPDATE ON public.document_shares
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_documents_history ON public.documents;
CREATE TRIGGER trg_documents_history
  AFTER INSERT OR UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION create_document_history_entry();

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_shares ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para documents
DROP POLICY IF EXISTS "Doctors can manage their documents" ON public.documents;
CREATE POLICY "Doctors can manage their documents"
  ON public.documents FOR ALL
  USING (doctor_id = auth.uid() AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Patients can view their documents" ON public.documents;
CREATE POLICY "Patients can view their documents"
  ON public.documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.patients p
      WHERE p.id = patient_id AND p.profile_id = auth.uid()
    )
    AND status IN ('finalizado', 'assinado', 'enviado')
    AND deleted_at IS NULL
  );

-- Políticas para document_attachments
DROP POLICY IF EXISTS "Access attachments of accessible documents" ON public.document_attachments;
CREATE POLICY "Access attachments of accessible documents"
  ON public.document_attachments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.id = document_id
      AND (
        d.doctor_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.patients p
          WHERE p.id = d.patient_id AND p.profile_id = auth.uid()
        )
      )
      AND d.deleted_at IS NULL
    )
  );

-- Políticas para document_history
DROP POLICY IF EXISTS "Doctors can view their document history" ON public.document_history;
CREATE POLICY "Doctors can view their document history"
  ON public.document_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.id = document_id AND d.doctor_id = auth.uid()
    )
  );

-- Políticas para document_shares
DROP POLICY IF EXISTS "Doctors can manage their document shares" ON public.document_shares;
CREATE POLICY "Doctors can manage their document shares"
  ON public.document_shares FOR ALL
  USING (shared_by = auth.uid());

-- Comentários para documentação
COMMENT ON TABLE public.documents IS 'Documentos médicos gerados (prontuários, receitas, laudos, etc.)';
COMMENT ON TABLE public.document_attachments IS 'Anexos dos documentos (exames, imagens, etc.)';
COMMENT ON TABLE public.document_history IS 'Histórico de alterações dos documentos';
COMMENT ON TABLE public.document_shares IS 'Compartilhamento de documentos via email/link';
COMMENT ON FUNCTION generate_document_number IS 'Gera número sequencial único para documentos';
COMMENT ON COLUMN public.documents.content_data IS 'Dados estruturados preenchidos do documento';
COMMENT ON COLUMN public.documents.signature_data IS 'Dados da assinatura digital (certificado, hash, etc.)';
COMMENT ON COLUMN public.document_shares.access_token IS 'Token único para acesso via link público';
COMMENT ON COLUMN public.documents.deleted_at IS 'Timestamp de exclusão lógica (soft delete)';