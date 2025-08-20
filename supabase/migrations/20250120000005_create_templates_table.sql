-- Criar tabela de modelos/templates de documentos médicos
-- Esta tabela permite aos médicos criar templates personalizáveis para diferentes tipos de documentos

CREATE TABLE IF NOT EXISTS public.document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Informações básicas do template
  name TEXT NOT NULL,
  description TEXT,
  
  -- Tipo de documento
  document_type TEXT NOT NULL CHECK (document_type IN (
    'prontuario', 'receita', 'atestado', 'laudo', 'relatorio',
    'encaminhamento', 'solicitacao_exame', 'declaracao', 'outros'
  )),
  
  -- Categoria/especialidade
  category TEXT, -- Ex: cardiologia, pediatria, etc.
  
  -- Estrutura do template (JSON)
  template_structure JSONB NOT NULL DEFAULT '{}',
  -- Exemplo de estrutura:
  -- {
  --   "sections": [
  --     {
  --       "id": "anamnese",
  --       "title": "Anamnese",
  --       "order": 1,
  --       "fields": [
  --         {
  --           "id": "queixa_principal",
  --           "label": "Queixa Principal",
  --           "type": "textarea",
  --           "required": true,
  --           "placeholder": "Descreva a queixa principal..."
  --         }
  --       ]
  --     }
  --   ]
  -- }
  
  -- Template HTML/texto para geração do documento
  template_content TEXT,
  
  -- Variáveis disponíveis no template
  template_variables JSONB DEFAULT '[]',
  -- Exemplo: ["patient_name", "patient_age", "consultation_date", "doctor_name", "doctor_crm"]
  
  -- CSS personalizado para o documento
  custom_css TEXT,
  
  -- Configurações de impressão/PDF
  print_settings JSONB DEFAULT '{}',
  -- Exemplo: {"page_size": "A4", "margins": {"top": 20, "bottom": 20, "left": 20, "right": 20}}
  
  -- Status e visibilidade
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false, -- Template padrão para o tipo de documento
  is_public BOOLEAN DEFAULT false, -- Disponível para outros médicos
  
  -- Estatísticas de uso
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  
  -- Versionamento
  version INTEGER DEFAULT 1,
  parent_template_id UUID REFERENCES public.document_templates(id),
  
  -- Tags para organização
  tags TEXT[] DEFAULT '{}',
  
  -- Campos de auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela para seções de templates (normalizada)
CREATE TABLE IF NOT EXISTS public.template_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.document_templates(id) ON DELETE CASCADE,
  
  -- Informações da seção
  section_name TEXT NOT NULL,
  section_title TEXT NOT NULL,
  section_description TEXT,
  
  -- Ordem da seção no template
  display_order INTEGER NOT NULL DEFAULT 0,
  
  -- Configurações da seção
  is_required BOOLEAN DEFAULT false,
  is_collapsible BOOLEAN DEFAULT false,
  is_repeatable BOOLEAN DEFAULT false, -- Permite múltiplas instâncias
  
  -- Condições para exibir a seção
  display_conditions JSONB DEFAULT '{}',
  
  -- Campos de auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela para campos dos templates
CREATE TABLE IF NOT EXISTS public.template_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES public.template_sections(id) ON DELETE CASCADE,
  
  -- Informações do campo
  field_name TEXT NOT NULL,
  field_label TEXT NOT NULL,
  field_description TEXT,
  
  -- Tipo do campo
  field_type TEXT NOT NULL CHECK (field_type IN (
    'text', 'textarea', 'number', 'date', 'time', 'datetime',
    'select', 'multiselect', 'checkbox', 'radio', 'file',
    'signature', 'drawing', 'table', 'calculated'
  )),
  
  -- Configurações do campo
  field_config JSONB DEFAULT '{}',
  -- Exemplo para select: {"options": [{"value": "sim", "label": "Sim"}, {"value": "nao", "label": "Não"}]}
  -- Exemplo para text: {"min_length": 5, "max_length": 100, "pattern": "^[A-Za-z ]+$"}
  
  -- Ordem do campo na seção
  display_order INTEGER NOT NULL DEFAULT 0,
  
  -- Validações
  is_required BOOLEAN DEFAULT false,
  validation_rules JSONB DEFAULT '{}',
  
  -- Valor padrão
  default_value TEXT,
  
  -- Placeholder/dica
  placeholder TEXT,
  
  -- Condições para exibir o campo
  display_conditions JSONB DEFAULT '{}',
  
  -- Campos de auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela para templates compartilhados/públicos
CREATE TABLE IF NOT EXISTS public.shared_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.document_templates(id) ON DELETE CASCADE,
  shared_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  shared_with UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- NULL = público
  
  -- Permissões
  can_view BOOLEAN DEFAULT true,
  can_copy BOOLEAN DEFAULT true,
  can_modify BOOLEAN DEFAULT false,
  
  -- Campos de auditoria
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Função para incrementar contador de uso
CREATE OR REPLACE FUNCTION increment_template_usage(
  p_template_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.document_templates
  SET 
    usage_count = usage_count + 1,
    last_used_at = now()
  WHERE id = p_template_id;
END;
$$;

-- Função para duplicar template
CREATE OR REPLACE FUNCTION duplicate_template(
  p_template_id UUID,
  p_new_name TEXT,
  p_doctor_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  new_template_id UUID;
  section_record RECORD;
  field_record RECORD;
  new_section_id UUID;
BEGIN
  -- Duplicar template principal
  INSERT INTO public.document_templates (
    doctor_id, name, description, document_type, category,
    template_structure, template_content, template_variables,
    custom_css, print_settings, tags, parent_template_id
  )
  SELECT 
    p_doctor_id, p_new_name, description, document_type, category,
    template_structure, template_content, template_variables,
    custom_css, print_settings, tags, p_template_id
  FROM public.document_templates
  WHERE id = p_template_id
  RETURNING id INTO new_template_id;
  
  -- Duplicar seções
  FOR section_record IN 
    SELECT * FROM public.template_sections WHERE template_id = p_template_id
  LOOP
    INSERT INTO public.template_sections (
      template_id, section_name, section_title, section_description,
      display_order, is_required, is_collapsible, is_repeatable, display_conditions
    )
    VALUES (
      new_template_id, section_record.section_name, section_record.section_title,
      section_record.section_description, section_record.display_order,
      section_record.is_required, section_record.is_collapsible,
      section_record.is_repeatable, section_record.display_conditions
    )
    RETURNING id INTO new_section_id;
    
    -- Duplicar campos da seção
    INSERT INTO public.template_fields (
      section_id, field_name, field_label, field_description, field_type,
      field_config, display_order, is_required, validation_rules,
      default_value, placeholder, display_conditions
    )
    SELECT 
      new_section_id, field_name, field_label, field_description, field_type,
      field_config, display_order, is_required, validation_rules,
      default_value, placeholder, display_conditions
    FROM public.template_fields
    WHERE section_id = section_record.id;
  END LOOP;
  
  RETURN new_template_id;
END;
$$;

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_document_templates_doctor_id ON public.document_templates(doctor_id);
CREATE INDEX IF NOT EXISTS idx_document_templates_type ON public.document_templates(document_type);
CREATE INDEX IF NOT EXISTS idx_document_templates_category ON public.document_templates(category);
CREATE INDEX IF NOT EXISTS idx_document_templates_active ON public.document_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_document_templates_public ON public.document_templates(is_public);
CREATE INDEX IF NOT EXISTS idx_document_templates_tags ON public.document_templates USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_template_sections_template_id ON public.template_sections(template_id);
CREATE INDEX IF NOT EXISTS idx_template_sections_order ON public.template_sections(template_id, display_order);

CREATE INDEX IF NOT EXISTS idx_template_fields_section_id ON public.template_fields(section_id);
CREATE INDEX IF NOT EXISTS idx_template_fields_order ON public.template_fields(section_id, display_order);

CREATE INDEX IF NOT EXISTS idx_shared_templates_template_id ON public.shared_templates(template_id);
CREATE INDEX IF NOT EXISTS idx_shared_templates_shared_with ON public.shared_templates(shared_with);

-- Triggers para updated_at
DROP TRIGGER IF EXISTS trg_document_templates_updated_at ON public.document_templates;
CREATE TRIGGER trg_document_templates_updated_at
  BEFORE UPDATE ON public.document_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_template_sections_updated_at ON public.template_sections;
CREATE TRIGGER trg_template_sections_updated_at
  BEFORE UPDATE ON public.template_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_template_fields_updated_at ON public.template_fields;
CREATE TRIGGER trg_template_fields_updated_at
  BEFORE UPDATE ON public.template_fields
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_shared_templates_updated_at ON public.shared_templates;
CREATE TRIGGER trg_shared_templates_updated_at
  BEFORE UPDATE ON public.shared_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_templates ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para document_templates
DROP POLICY IF EXISTS "Doctors can manage their templates" ON public.document_templates;
CREATE POLICY "Doctors can manage their templates"
  ON public.document_templates FOR ALL
  USING (doctor_id = auth.uid());

DROP POLICY IF EXISTS "Doctors can view public templates" ON public.document_templates;
CREATE POLICY "Doctors can view public templates"
  ON public.document_templates FOR SELECT
  USING (is_public = true AND is_active = true);

DROP POLICY IF EXISTS "Doctors can view shared templates" ON public.document_templates;
CREATE POLICY "Doctors can view shared templates"
  ON public.document_templates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.shared_templates st
      WHERE st.template_id = id
      AND (st.shared_with = auth.uid() OR st.shared_with IS NULL)
      AND st.can_view = true
    )
  );

-- Políticas para template_sections
DROP POLICY IF EXISTS "Access sections of accessible templates" ON public.template_sections;
CREATE POLICY "Access sections of accessible templates"
  ON public.template_sections FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.document_templates dt
      WHERE dt.id = template_id
      AND (
        dt.doctor_id = auth.uid()
        OR (dt.is_public = true AND dt.is_active = true)
        OR EXISTS (
          SELECT 1 FROM public.shared_templates st
          WHERE st.template_id = dt.id
          AND (st.shared_with = auth.uid() OR st.shared_with IS NULL)
          AND st.can_view = true
        )
      )
    )
  );

-- Políticas para template_fields
DROP POLICY IF EXISTS "Access fields of accessible sections" ON public.template_fields;
CREATE POLICY "Access fields of accessible sections"
  ON public.template_fields FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.template_sections ts
      JOIN public.document_templates dt ON dt.id = ts.template_id
      WHERE ts.id = section_id
      AND (
        dt.doctor_id = auth.uid()
        OR (dt.is_public = true AND dt.is_active = true)
        OR EXISTS (
          SELECT 1 FROM public.shared_templates st
          WHERE st.template_id = dt.id
          AND (st.shared_with = auth.uid() OR st.shared_with IS NULL)
          AND st.can_view = true
        )
      )
    )
  );

-- Políticas para shared_templates
DROP POLICY IF EXISTS "Doctors can manage their shared templates" ON public.shared_templates;
CREATE POLICY "Doctors can manage their shared templates"
  ON public.shared_templates FOR ALL
  USING (shared_by = auth.uid());

DROP POLICY IF EXISTS "Doctors can view templates shared with them" ON public.shared_templates;
CREATE POLICY "Doctors can view templates shared with them"
  ON public.shared_templates FOR SELECT
  USING (shared_with = auth.uid() OR shared_with IS NULL);

-- Comentários para documentação
COMMENT ON TABLE public.document_templates IS 'Templates/modelos para geração de documentos médicos';
COMMENT ON TABLE public.template_sections IS 'Seções dos templates de documentos';
COMMENT ON TABLE public.template_fields IS 'Campos das seções dos templates';
COMMENT ON TABLE public.shared_templates IS 'Compartilhamento de templates entre médicos';
COMMENT ON FUNCTION increment_template_usage IS 'Incrementa contador de uso do template';
COMMENT ON FUNCTION duplicate_template IS 'Duplica um template com todas suas seções e campos';
COMMENT ON COLUMN public.document_templates.template_structure IS 'Estrutura JSON do template com seções e campos';
COMMENT ON COLUMN public.document_templates.template_variables IS 'Variáveis disponíveis para substituição no template';
COMMENT ON COLUMN public.template_fields.field_config IS 'Configurações específicas do tipo de campo (opções, validações, etc.)';
COMMENT ON COLUMN public.template_fields.display_conditions IS 'Condições JSON para exibir o campo condicionalmente';