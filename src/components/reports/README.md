# Módulo de Relatórios

Este módulo é responsável pela geração, formatação e exportação de relatórios médicos estruturados, incluindo prontuários, laudos, prescrições e documentos administrativos do sistema Doctor Brief AI.

## Visão Geral

O módulo de relatórios oferece:

- Geração automática de relatórios médicos
- Templates personalizáveis para diferentes tipos de documentos
- Exportação em múltiplos formatos (PDF, Word, HTML)
- Integração com dados de consultas e transcrições
- Assinatura digital e validação de documentos
- Conformidade com padrões médicos (CFM, SBIS)
- Sistema de versionamento de documentos
- Relatórios estatísticos e analíticos

## Arquitetura de Componentes

### Estrutura Hierárquica

```
Reports
├── ReportGenerator (gerador principal)
├── Templates (modelos de documentos)
│   ├── MedicalReport (relatório médico)
│   ├── Prescription (receituário)
│   ├── MedicalCertificate (atestado)
│   ├── ReferralLetter (encaminhamento)
│   └── CustomTemplate (template personalizado)
├── Formatters (formatadores de saída)
│   ├── PDFFormatter
│   ├── WordFormatter
│   ├── HTMLFormatter
│   └── PrintFormatter
├── Signatures (assinatura digital)
├── Preview (visualização prévia)
└── History (histórico de relatórios)
```

## Interfaces de Dados

### ReportData Interface

```typescript
interface ReportData {
  // Identificação
  id: string;
  type: ReportType;
  templateId: string;
  version: string;

  // Metadados
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;

  // Dados do Paciente
  patient: {
    id: string;
    name: string;
    cpf: string;
    birthDate: Date;
    gender: 'M' | 'F' | 'O';
    address: Address;
    phone: string;
    email?: string;
    medicalRecord: string;
  };

  // Dados do Médico
  doctor: {
    id: string;
    name: string;
    crm: string;
    specialty: string;
    phone: string;
    email: string;
    digitalSignature?: string;
  };

  // Dados da Consulta
  consultation?: {
    id: string;
    date: Date;
    duration: number;
    type: 'presencial' | 'telemedicina';
    transcription?: string;
    summary?: string;
  };

  // Conteúdo do Relatório
  content: ReportContent;

  // Configurações
  settings: {
    format: 'pdf' | 'docx' | 'html';
    template: string;
    includeHeader: boolean;
    includeFooter: boolean;
    includeWatermark: boolean;
    pageSize: 'A4' | 'Letter';
    orientation: 'portrait' | 'landscape';
  };

  // Status
  status: 'draft' | 'generated' | 'signed' | 'sent';

  // Assinatura Digital
  digitalSignature?: {
    hash: string;
    timestamp: Date;
    certificate: string;
    isValid: boolean;
  };

  // Arquivos Gerados
  files: {
    pdf?: string; // URL do arquivo PDF
    docx?: string; // URL do arquivo Word
    html?: string; // URL do arquivo HTML
  };
}
```

### ReportType Enum

```typescript
enum ReportType {
  MEDICAL_REPORT = 'medical_report',
  PRESCRIPTION = 'prescription',
  MEDICAL_CERTIFICATE = 'medical_certificate',
  REFERRAL_LETTER = 'referral_letter',
  EXAM_REQUEST = 'exam_request',
  DISCHARGE_SUMMARY = 'discharge_summary',
  PROGRESS_NOTE = 'progress_note',
  CONSULTATION_SUMMARY = 'consultation_summary',
  STATISTICAL_REPORT = 'statistical_report',
  CUSTOM = 'custom',
}
```

### ReportContent Interface

```typescript
interface ReportContent {
  // Cabeçalho
  header?: {
    logo?: string;
    clinicName: string;
    clinicAddress: string;
    clinicPhone: string;
    clinicEmail: string;
  };

  // Seções do Relatório
  sections: ReportSection[];

  // Rodapé
  footer?: {
    text: string;
    includePageNumbers: boolean;
    includeGenerationDate: boolean;
  };

  // Anexos
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
}

interface ReportSection {
  id: string;
  title: string;
  type: 'text' | 'table' | 'list' | 'image' | 'chart';
  content: any;
  order: number;
  required: boolean;
  editable: boolean;
}
```

### Template Interface

```typescript
interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  version: string;

  // Estrutura do Template
  structure: {
    sections: TemplateSectionDefinition[];
    styles: TemplateStyles;
    layout: TemplateLayout;
  };

  // Configurações
  settings: {
    isDefault: boolean;
    isActive: boolean;
    allowCustomization: boolean;
    requiredFields: string[];
  };

  // Metadados
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  usageCount: number;
}

interface TemplateSectionDefinition {
  id: string;
  title: string;
  type: 'text' | 'table' | 'list' | 'image' | 'chart';
  placeholder: string;
  required: boolean;
  order: number;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

interface TemplateStyles {
  font: {
    family: string;
    size: number;
    color: string;
  };
  headings: {
    h1: FontStyle;
    h2: FontStyle;
    h3: FontStyle;
  };
  paragraph: {
    lineHeight: number;
    spacing: number;
    alignment: 'left' | 'center' | 'right' | 'justify';
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface TemplateLayout {
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  header: {
    height: number;
    includeOnFirstPage: boolean;
  };
  footer: {
    height: number;
    includeOnFirstPage: boolean;
  };
}
```

## Componentes Principais

### ReportGenerator.tsx

**Propósito**: Componente principal para geração de relatórios.

**Funcionalidades**:

- ✅ Seleção de templates
- ✅ Preenchimento automático de dados
- ✅ Editor WYSIWYG integrado
- ✅ Visualização em tempo real
- ✅ Validação de campos obrigatórios
- ✅ Geração em múltiplos formatos

**Implementação**:

```tsx
const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  patientId,
  consultationId,
  reportType,
  onReportGenerated,
}) => {
  const [selectedTemplate, setSelectedTemplate] =
    useState<ReportTemplate | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');

  const { templates, loading: templatesLoading } =
    useReportTemplates(reportType);
  const { patient } = usePatient(patientId);
  const { consultation } = useConsultation(consultationId);
  const { user: doctor } = useAuth();

  // Inicialização dos dados do relatório
  useEffect(() => {
    if (patient && doctor && selectedTemplate) {
      initializeReportData();
    }
  }, [patient, doctor, selectedTemplate, consultation]);

  const initializeReportData = async () => {
    try {
      const initialData: ReportData = {
        id: generateId(),
        type: reportType,
        templateId: selectedTemplate!.id,
        version: '1.0',
        title: generateReportTitle(reportType, patient!.name),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: doctor!.id,

        patient: {
          id: patient!.id,
          name: patient!.name,
          cpf: patient!.cpf,
          birthDate: patient!.birthDate,
          gender: patient!.gender,
          address: patient!.address,
          phone: patient!.phone,
          email: patient!.email,
          medicalRecord: patient!.medicalRecord,
        },

        doctor: {
          id: doctor!.id,
          name: doctor!.name,
          crm: doctor!.crm,
          specialty: doctor!.specialty,
          phone: doctor!.phone,
          email: doctor!.email,
          digitalSignature: doctor!.digitalSignature,
        },

        consultation: consultation
          ? {
              id: consultation.id,
              date: consultation.date,
              duration: consultation.duration,
              type: consultation.type,
              transcription: consultation.transcription,
              summary: consultation.summary,
            }
          : undefined,

        content: await generateInitialContent(
          selectedTemplate!,
          patient!,
          consultation
        ),

        settings: {
          format: 'pdf',
          template: selectedTemplate!.id,
          includeHeader: true,
          includeFooter: true,
          includeWatermark: false,
          pageSize: 'A4',
          orientation: 'portrait',
        },

        status: 'draft',
        files: {},
      };

      setReportData(initialData);
    } catch (error) {
      console.error('Erro ao inicializar dados do relatório:', error);
      toast.error('Erro ao carregar dados do relatório');
    }
  };

  const generateInitialContent = async (
    template: ReportTemplate,
    patient: Patient,
    consultation?: Consultation
  ): Promise<ReportContent> => {
    const sections: ReportSection[] = [];

    for (const sectionDef of template.structure.sections) {
      let content = '';

      // Preenchimento automático baseado no tipo de seção
      switch (sectionDef.id) {
        case 'patient_identification':
          content = `Nome: ${patient.name}\nCPF: ${patient.cpf}\nData de Nascimento: ${formatDate(patient.birthDate)}\nSexo: ${patient.gender}`;
          break;

        case 'consultation_summary':
          if (consultation?.summary) {
            content = consultation.summary;
          } else if (consultation?.transcription) {
            // Usar IA para gerar resumo da transcrição
            content = await generateSummaryFromTranscription(
              consultation.transcription
            );
          }
          break;

        case 'medical_history':
          // Buscar histórico médico do paciente
          const history = await getMedicalHistory(patient.id);
          content = formatMedicalHistory(history);
          break;

        case 'diagnosis':
          if (consultation?.diagnosis) {
            content = consultation.diagnosis;
          }
          break;

        case 'treatment_plan':
          if (consultation?.treatmentPlan) {
            content = consultation.treatmentPlan;
          }
          break;

        default:
          content = sectionDef.placeholder;
      }

      sections.push({
        id: sectionDef.id,
        title: sectionDef.title,
        type: sectionDef.type,
        content,
        order: sectionDef.order,
        required: sectionDef.required,
        editable: true,
      });
    }

    return {
      header: {
        logo: doctor!.clinicLogo,
        clinicName: doctor!.clinicName,
        clinicAddress: doctor!.clinicAddress,
        clinicPhone: doctor!.clinicPhone,
        clinicEmail: doctor!.clinicEmail,
      },
      sections: sections.sort((a, b) => a.order - b.order),
      footer: {
        text: `Documento gerado em ${formatDateTime(new Date())} - Doctor Brief AI`,
        includePageNumbers: true,
        includeGenerationDate: true,
      },
    };
  };

  const handleSectionUpdate = (sectionId: string, newContent: any) => {
    if (!reportData) return;

    const updatedSections = reportData.content.sections.map(section =>
      section.id === sectionId ? { ...section, content: newContent } : section
    );

    setReportData({
      ...reportData,
      content: {
        ...reportData.content,
        sections: updatedSections,
      },
      updatedAt: new Date(),
    });
  };

  const generateReport = async (format: 'pdf' | 'docx' | 'html' = 'pdf') => {
    if (!reportData) return;

    setIsGenerating(true);

    try {
      // Validar campos obrigatórios
      const validation = validateReportData(reportData);
      if (!validation.isValid) {
        toast.error(
          `Campos obrigatórios não preenchidos: ${validation.missingFields.join(', ')}`
        );
        return;
      }

      // Gerar relatório
      const result = await reportService.generateReport(reportData, format);

      // Atualizar dados com arquivo gerado
      const updatedReportData = {
        ...reportData,
        status: 'generated' as const,
        files: {
          ...reportData.files,
          [format]: result.fileUrl,
        },
        updatedAt: new Date(),
      };

      setReportData(updatedReportData);

      // Salvar no banco de dados
      await reportService.saveReport(updatedReportData);

      toast.success(
        `Relatório gerado com sucesso em formato ${format.toUpperCase()}`
      );

      if (onReportGenerated) {
        onReportGenerated(updatedReportData);
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = async (format: 'pdf' | 'docx' | 'html') => {
    if (!reportData?.files[format]) {
      await generateReport(format);
      return;
    }

    try {
      const response = await fetch(reportData.files[format]!);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportData.title}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar relatório:', error);
      toast.error('Erro ao baixar relatório');
    }
  };

  if (templatesLoading) {
    return <ReportGeneratorSkeleton />;
  }

  return (
    <div className="report-generator">
      <div className="report-header">
        <div className="report-title">
          <h2>Gerador de Relatórios</h2>
          <p>Tipo: {getReportTypeLabel(reportType)}</p>
        </div>

        <div className="report-actions">
          <div className="view-toggle">
            <Button
              variant={previewMode === 'edit' ? 'default' : 'outline'}
              onClick={() => setPreviewMode('edit')}
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button
              variant={previewMode === 'preview' ? 'default' : 'outline'}
              onClick={() => setPreviewMode('preview')}
            >
              <Eye className="w-4 h-4 mr-2" />
              Visualizar
            </Button>
          </div>

          <div className="generation-actions">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button disabled={isGenerating}>
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Gerar Relatório
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => generateReport('pdf')}>
                  <FileText className="w-4 h-4 mr-2" />
                  PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => generateReport('docx')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Word
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => generateReport('html')}>
                  <Globe className="w-4 h-4 mr-2" />
                  HTML
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="report-content">
        {!selectedTemplate ? (
          <TemplateSelector
            templates={templates}
            reportType={reportType}
            onTemplateSelect={setSelectedTemplate}
          />
        ) : (
          <div className="report-editor">
            <div className="editor-sidebar">
              <ReportSettings
                settings={reportData?.settings}
                onSettingsChange={settings =>
                  setReportData(prev => (prev ? { ...prev, settings } : null))
                }
              />

              <SectionNavigator
                sections={reportData?.content.sections || []}
                onSectionClick={sectionId => {
                  const element = document.getElementById(
                    `section-${sectionId}`
                  );
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </div>

            <div className="editor-main">
              {previewMode === 'edit' ? (
                <ReportEditor
                  reportData={reportData}
                  template={selectedTemplate}
                  onSectionUpdate={handleSectionUpdate}
                  onDataUpdate={setReportData}
                />
              ) : (
                <ReportPreview
                  reportData={reportData}
                  template={selectedTemplate}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
```

### ReportEditor.tsx

**Propósito**: Editor WYSIWYG para edição de conteúdo do relatório.

**Funcionalidades**:

- ✅ Editor de texto rico (TinyMCE/Quill)
- ✅ Inserção de tabelas e listas
- ✅ Upload de imagens
- ✅ Formatação avançada
- ✅ Auto-save
- ✅ Histórico de versões

```tsx
const ReportEditor: React.FC<ReportEditorProps> = ({
  reportData,
  template,
  onSectionUpdate,
  onDataUpdate,
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    'saved' | 'saving' | 'error'
  >('saved');

  // Auto-save a cada 30 segundos
  useEffect(() => {
    if (!reportData) return;

    const interval = setInterval(async () => {
      try {
        setAutoSaveStatus('saving');
        await reportService.saveReportDraft(reportData);
        setAutoSaveStatus('saved');
      } catch (error) {
        setAutoSaveStatus('error');
        console.error('Erro no auto-save:', error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [reportData]);

  const handleSectionContentChange = (sectionId: string, content: any) => {
    onSectionUpdate(sectionId, content);
    setAutoSaveStatus('saving');

    // Debounce para evitar muitas chamadas
    clearTimeout(window.autoSaveTimeout);
    window.autoSaveTimeout = setTimeout(() => {
      setAutoSaveStatus('saved');
    }, 1000);
  };

  const insertAIGeneratedContent = async (
    sectionId: string,
    prompt: string
  ) => {
    try {
      const aiContent = await reportService.generateContentWithAI({
        prompt,
        context: {
          patientName: reportData!.patient.name,
          consultationSummary: reportData!.consultation?.summary,
          reportType: reportData!.type,
        },
      });

      handleSectionContentChange(sectionId, aiContent);
      toast.success('Conteúdo gerado com IA inserido com sucesso');
    } catch (error) {
      console.error('Erro ao gerar conteúdo com IA:', error);
      toast.error('Erro ao gerar conteúdo com IA');
    }
  };

  return (
    <div className="report-editor">
      <div className="editor-header">
        <div className="document-info">
          <h3>{reportData?.title}</h3>
          <div className="auto-save-status">
            {autoSaveStatus === 'saving' && (
              <span className="text-yellow-600">
                <Loader2 className="w-4 h-4 inline mr-1 animate-spin" />
                Salvando...
              </span>
            )}
            {autoSaveStatus === 'saved' && (
              <span className="text-green-600">
                <Check className="w-4 h-4 inline mr-1" />
                Salvo
              </span>
            )}
            {autoSaveStatus === 'error' && (
              <span className="text-red-600">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Erro ao salvar
              </span>
            )}
          </div>
        </div>

        <div className="editor-tools">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Implementar histórico de versões
            }}
          >
            <History className="w-4 h-4 mr-2" />
            Histórico
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Implementar verificação ortográfica
            }}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Verificar Ortografia
          </Button>
        </div>
      </div>

      <div className="editor-content">
        {reportData?.content.sections.map(section => (
          <div
            key={section.id}
            id={`section-${section.id}`}
            className={`editor-section ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            <div className="section-header">
              <h4>{section.title}</h4>
              {section.required && (
                <span className="required-indicator">*</span>
              )}

              <div className="section-actions">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => {
                    const prompt = `Gere conteúdo para a seção "${section.title}" de um relatório médico`;
                    insertAIGeneratedContent(section.id, prompt);
                  }}
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  IA
                </Button>

                {section.type === 'table' && (
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => {
                      // Inserir tabela
                    }}
                  >
                    <Table className="w-4 h-4 mr-1" />
                    Tabela
                  </Button>
                )}

                {section.type === 'image' && (
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => {
                      // Upload de imagem
                    }}
                  >
                    <Image className="w-4 h-4 mr-1" />
                    Imagem
                  </Button>
                )}
              </div>
            </div>

            <div className="section-content">
              {section.type === 'text' && (
                <RichTextEditor
                  value={section.content}
                  onChange={content =>
                    handleSectionContentChange(section.id, content)
                  }
                  placeholder={`Digite o conteúdo para ${section.title}...`}
                  toolbar={[
                    'bold',
                    'italic',
                    'underline',
                    'strikethrough',
                    '|',
                    'h1',
                    'h2',
                    'h3',
                    '|',
                    'bulletlist',
                    'orderedlist',
                    '|',
                    'link',
                    'image',
                    'table',
                    '|',
                    'undo',
                    'redo',
                  ]}
                />
              )}

              {section.type === 'table' && (
                <TableEditor
                  data={section.content}
                  onChange={content =>
                    handleSectionContentChange(section.id, content)
                  }
                />
              )}

              {section.type === 'list' && (
                <ListEditor
                  items={section.content}
                  onChange={content =>
                    handleSectionContentChange(section.id, content)
                  }
                />
              )}

              {section.type === 'image' && (
                <ImageUploader
                  images={section.content}
                  onChange={content =>
                    handleSectionContentChange(section.id, content)
                  }
                  maxFiles={5}
                  acceptedTypes={['image/jpeg', 'image/png', 'image/gif']}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### PDFFormatter.tsx

**Propósito**: Formatador para geração de documentos PDF.

**Funcionalidades**:

- ✅ Geração de PDF com jsPDF/Puppeteer
- ✅ Templates responsivos
- ✅ Cabeçalhos e rodapés personalizados
- ✅ Numeração de páginas
- ✅ Marca d'água
- ✅ Assinatura digital

```tsx
class PDFFormatter {
  private puppeteer: any;

  constructor() {
    // Inicializar Puppeteer para renderização server-side
    this.initializePuppeteer();
  }

  async generatePDF(
    reportData: ReportData
  ): Promise<{ buffer: Buffer; url: string }> {
    try {
      // Gerar HTML do relatório
      const html = await this.generateHTML(reportData);

      // Configurações do PDF
      const pdfOptions = {
        format: reportData.settings.pageSize,
        orientation: reportData.settings.orientation,
        margin: {
          top: '2cm',
          right: '2cm',
          bottom: '2cm',
          left: '2cm',
        },
        displayHeaderFooter:
          reportData.settings.includeHeader ||
          reportData.settings.includeFooter,
        headerTemplate: reportData.settings.includeHeader
          ? this.generateHeaderHTML(reportData)
          : '',
        footerTemplate: reportData.settings.includeFooter
          ? this.generateFooterHTML(reportData)
          : '',
        printBackground: true,
      };

      // Gerar PDF com Puppeteer
      const browser = await this.puppeteer.launch({ headless: true });
      const page = await browser.newPage();

      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf(pdfOptions);

      await browser.close();

      // Upload para Supabase Storage
      const fileName = `reports/${reportData.id}/${Date.now()}.pdf`;
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, pdfBuffer, {
          contentType: 'application/pdf',
          upsert: true,
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      return {
        buffer: pdfBuffer,
        url: urlData.publicUrl,
      };
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw new Error('Falha na geração do PDF');
    }
  }

  private async generateHTML(reportData: ReportData): Promise<string> {
    const styles = this.generateCSS(reportData);

    let html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${reportData.title}</title>
        <style>${styles}</style>
      </head>
      <body>
    `;

    // Cabeçalho do documento
    if (reportData.content.header) {
      html += this.generateDocumentHeader(
        reportData.content.header,
        reportData
      );
    }

    // Conteúdo principal
    html += '<div class="document-content">';

    for (const section of reportData.content.sections) {
      html += this.generateSectionHTML(section);
    }

    html += '</div>';

    // Rodapé do documento
    if (reportData.content.footer) {
      html += this.generateDocumentFooter(reportData.content.footer);
    }

    // Marca d'água
    if (reportData.settings.includeWatermark) {
      html += this.generateWatermark();
    }

    html += '</body></html>';

    return html;
  }

  private generateCSS(reportData: ReportData): string {
    return `
      @page {
        size: ${reportData.settings.pageSize};
        margin: 2cm;
      }
      
      body {
        font-family: 'Arial', sans-serif;
        font-size: 12pt;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
      }
      
      .document-header {
        border-bottom: 2px solid #0066cc;
        padding-bottom: 20px;
        margin-bottom: 30px;
      }
      
      .clinic-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .clinic-logo {
        max-height: 80px;
        max-width: 200px;
      }
      
      .clinic-details {
        text-align: right;
        font-size: 10pt;
      }
      
      .document-title {
        text-align: center;
        font-size: 18pt;
        font-weight: bold;
        margin: 20px 0;
        color: #0066cc;
      }
      
      .patient-info {
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 5px;
        margin-bottom: 20px;
      }
      
      .patient-info h3 {
        margin-top: 0;
        color: #0066cc;
      }
      
      .section {
        margin-bottom: 25px;
        page-break-inside: avoid;
      }
      
      .section-title {
        font-size: 14pt;
        font-weight: bold;
        color: #0066cc;
        border-bottom: 1px solid #ddd;
        padding-bottom: 5px;
        margin-bottom: 10px;
      }
      
      .section-content {
        margin-left: 10px;
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 10px 0;
      }
      
      table th,
      table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      
      table th {
        background-color: #f8f9fa;
        font-weight: bold;
      }
      
      .signature-section {
        margin-top: 50px;
        text-align: center;
      }
      
      .signature-line {
        border-top: 1px solid #333;
        width: 300px;
        margin: 40px auto 10px;
      }
      
      .doctor-info {
        font-size: 10pt;
      }
      
      .watermark {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 72pt;
        color: rgba(0, 0, 0, 0.1);
        z-index: -1;
        pointer-events: none;
      }
      
      @media print {
        .page-break {
          page-break-before: always;
        }
      }
    `;
  }

  private generateDocumentHeader(header: any, reportData: ReportData): string {
    return `
      <div class="document-header">
        <div class="clinic-info">
          <div class="clinic-logo">
            ${header.logo ? `<img src="${header.logo}" alt="Logo" class="clinic-logo">` : ''}
          </div>
          <div class="clinic-details">
            <strong>${header.clinicName}</strong><br>
            ${header.clinicAddress}<br>
            Tel: ${header.clinicPhone}<br>
            Email: ${header.clinicEmail}
          </div>
        </div>
        
        <div class="document-title">
          ${this.getReportTypeTitle(reportData.type)}
        </div>
        
        <div class="patient-info">
          <h3>Dados do Paciente</h3>
          <p>
            <strong>Nome:</strong> ${reportData.patient.name}<br>
            <strong>CPF:</strong> ${reportData.patient.cpf}<br>
            <strong>Data de Nascimento:</strong> ${formatDate(reportData.patient.birthDate)}<br>
            <strong>Sexo:</strong> ${reportData.patient.gender}<br>
            <strong>Prontuário:</strong> ${reportData.patient.medicalRecord}
          </p>
        </div>
      </div>
    `;
  }

  private generateSectionHTML(section: ReportSection): string {
    let html = `
      <div class="section">
        <h3 class="section-title">${section.title}</h3>
        <div class="section-content">
    `;

    switch (section.type) {
      case 'text':
        html += `<div>${section.content}</div>`;
        break;

      case 'table':
        html += this.generateTableHTML(section.content);
        break;

      case 'list':
        html += this.generateListHTML(section.content);
        break;

      case 'image':
        html += this.generateImageHTML(section.content);
        break;

      default:
        html += `<div>${section.content}</div>`;
    }

    html += '</div></div>';

    return html;
  }

  private generateTableHTML(tableData: any): string {
    if (!tableData || !tableData.rows) return '';

    let html = '<table>';

    // Cabeçalho
    if (tableData.headers) {
      html += '<thead><tr>';
      tableData.headers.forEach((header: string) => {
        html += `<th>${header}</th>`;
      });
      html += '</tr></thead>';
    }

    // Linhas
    html += '<tbody>';
    tableData.rows.forEach((row: any[]) => {
      html += '<tr>';
      row.forEach((cell: any) => {
        html += `<td>${cell}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody>';

    html += '</table>';

    return html;
  }

  private generateListHTML(listData: any): string {
    if (!listData || !Array.isArray(listData.items)) return '';

    const tag = listData.ordered ? 'ol' : 'ul';

    let html = `<${tag}>`;
    listData.items.forEach((item: string) => {
      html += `<li>${item}</li>`;
    });
    html += `</${tag}>`;

    return html;
  }

  private generateImageHTML(imageData: any): string {
    if (!imageData || !Array.isArray(imageData)) return '';

    let html = '<div class="images">';
    imageData.forEach((image: any) => {
      html += `
        <div class="image-container">
          <img src="${image.url}" alt="${image.alt || 'Imagem'}" style="max-width: 100%; height: auto;">
          ${image.caption ? `<p class="image-caption">${image.caption}</p>` : ''}
        </div>
      `;
    });
    html += '</div>';

    return html;
  }

  private generateDocumentFooter(footer: any): string {
    return `
      <div class="document-footer">
        <div class="signature-section">
          <div class="signature-line"></div>
          <div class="doctor-info">
            <strong>Dr(a). ${reportData.doctor.name}</strong><br>
            CRM: ${reportData.doctor.crm}<br>
            ${reportData.doctor.specialty}
          </div>
        </div>
        
        <div class="footer-text">
          ${footer.text}
        </div>
      </div>
    `;
  }

  private generateWatermark(): string {
    return '<div class="watermark">CONFIDENCIAL</div>';
  }

  private getReportTypeTitle(type: ReportType): string {
    const titles = {
      [ReportType.MEDICAL_REPORT]: 'RELATÓRIO MÉDICO',
      [ReportType.PRESCRIPTION]: 'RECEITUÁRIO MÉDICO',
      [ReportType.MEDICAL_CERTIFICATE]: 'ATESTADO MÉDICO',
      [ReportType.REFERRAL_LETTER]: 'CARTA DE ENCAMINHAMENTO',
      [ReportType.EXAM_REQUEST]: 'SOLICITAÇÃO DE EXAMES',
      [ReportType.DISCHARGE_SUMMARY]: 'RESUMO DE ALTA',
      [ReportType.PROGRESS_NOTE]: 'EVOLUÇÃO MÉDICA',
      [ReportType.CONSULTATION_SUMMARY]: 'RESUMO DE CONSULTA',
      [ReportType.STATISTICAL_REPORT]: 'RELATÓRIO ESTATÍSTICO',
      [ReportType.CUSTOM]: 'DOCUMENTO PERSONALIZADO',
    };

    return titles[type] || 'DOCUMENTO MÉDICO';
  }
}

export const pdfFormatter = new PDFFormatter();
```

## Serviços e Integrações

### ReportService

**Localização**: `src/services/reportService.ts`

**Funcionalidades Principais**:

```typescript
class ReportService {
  private cache = new Map<string, any>();

  /**
   * Gera um relatório completo
   */
  async generateReport(
    reportData: ReportData,
    format: 'pdf' | 'docx' | 'html'
  ): Promise<{ fileUrl: string; fileName: string }> {
    try {
      let result;

      switch (format) {
        case 'pdf':
          result = await pdfFormatter.generatePDF(reportData);
          break;
        case 'docx':
          result = await wordFormatter.generateWord(reportData);
          break;
        case 'html':
          result = await htmlFormatter.generateHTML(reportData);
          break;
        default:
          throw new Error(`Formato não suportado: ${format}`);
      }

      // Registrar geração no log de auditoria
      await this.logReportGeneration(reportData, format, result.url);

      return {
        fileUrl: result.url,
        fileName: `${reportData.title}.${format}`,
      };
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      throw error;
    }
  }

  /**
   * Salva rascunho do relatório
   */
  async saveReportDraft(reportData: ReportData): Promise<void> {
    const { error } = await supabase.from('report_drafts').upsert({
      id: reportData.id,
      data: reportData,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
  }

  /**
   * Carrega rascunho do relatório
   */
  async loadReportDraft(reportId: string): Promise<ReportData | null> {
    const { data, error } = await supabase
      .from('report_drafts')
      .select('data')
      .eq('id', reportId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Não encontrado
      throw error;
    }

    return data.data;
  }

  /**
   * Salva relatório finalizado
   */
  async saveReport(reportData: ReportData): Promise<void> {
    const { error } = await supabase.from('reports').upsert({
      id: reportData.id,
      type: reportData.type,
      title: reportData.title,
      patient_id: reportData.patient.id,
      doctor_id: reportData.doctor.id,
      consultation_id: reportData.consultation?.id,
      data: reportData,
      status: reportData.status,
      created_at: reportData.createdAt.toISOString(),
      updated_at: reportData.updatedAt.toISOString(),
    });

    if (error) throw error;

    // Remover rascunho após salvar
    await supabase.from('report_drafts').delete().eq('id', reportData.id);
  }

  /**
   * Lista relatórios do médico
   */
  async getReports(
    doctorId: string,
    filters?: {
      type?: ReportType;
      patientId?: string;
      dateFrom?: Date;
      dateTo?: Date;
      status?: string;
    }
  ): Promise<ReportData[]> {
    let query = supabase
      .from('reports')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('created_at', { ascending: false });

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    if (filters?.patientId) {
      query = query.eq('patient_id', filters.patientId);
    }

    if (filters?.dateFrom) {
      query = query.gte('created_at', filters.dateFrom.toISOString());
    }

    if (filters?.dateTo) {
      query = query.lte('created_at', filters.dateTo.toISOString());
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data.map(item => item.data);
  }

  /**
   * Gera conteúdo com IA
   */
  async generateContentWithAI(params: {
    prompt: string;
    context: {
      patientName: string;
      consultationSummary?: string;
      reportType: ReportType;
    };
  }): Promise<string> {
    try {
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify({
          prompt: params.prompt,
          context: params.context,
          model: 'gpt-4',
          maxTokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro na API de IA');
      }

      const result = await response.json();
      return result.content;
    } catch (error) {
      console.error('Erro ao gerar conteúdo com IA:', error);
      throw error;
    }
  }

  /**
   * Aplica assinatura digital
   */
  async applyDigitalSignature(
    reportId: string,
    certificateData: any
  ): Promise<void> {
    try {
      // Gerar hash do documento
      const reportData = await this.getReport(reportId);
      const documentHash = await this.generateDocumentHash(reportData);

      // Aplicar assinatura
      const signature = await this.signDocument(documentHash, certificateData);

      // Salvar assinatura
      const { error } = await supabase.from('report_signatures').insert({
        report_id: reportId,
        hash: documentHash,
        signature: signature,
        certificate: certificateData.certificate,
        timestamp: new Date().toISOString(),
        is_valid: true,
      });

      if (error) throw error;

      // Atualizar status do relatório
      await supabase
        .from('reports')
        .update({ status: 'signed' })
        .eq('id', reportId);
    } catch (error) {
      console.error('Erro ao aplicar assinatura digital:', error);
      throw error;
    }
  }

  /**
   * Valida assinatura digital
   */
  async validateDigitalSignature(reportId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('report_signatures')
        .select('*')
        .eq('report_id', reportId)
        .single();

      if (error) return false;

      // Verificar integridade do documento
      const reportData = await this.getReport(reportId);
      const currentHash = await this.generateDocumentHash(reportData);

      if (currentHash !== data.hash) {
        return false; // Documento foi modificado
      }

      // Verificar validade do certificado
      const isValidCertificate = await this.validateCertificate(
        data.certificate
      );

      return isValidCertificate;
    } catch (error) {
      console.error('Erro ao validar assinatura:', error);
      return false;
    }
  }

  private async generateDocumentHash(reportData: ReportData): Promise<string> {
    const content = JSON.stringify(reportData.content);
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async logReportGeneration(
    reportData: ReportData,
    format: string,
    fileUrl: string
  ): Promise<void> {
    await supabase.from('audit_logs').insert({
      action: 'report_generated',
      entity_type: 'report',
      entity_id: reportData.id,
      user_id: reportData.createdBy,
      metadata: {
        reportType: reportData.type,
        format,
        fileUrl,
        patientId: reportData.patient.id,
      },
      timestamp: new Date().toISOString(),
    });
  }
}

export const reportService = new ReportService();
```

## Configuração e Deploy

### Variáveis de Ambiente

```env
# Relatórios
VITE_ENABLE_AI_CONTENT_GENERATION=true
VITE_MAX_REPORT_SIZE_MB=50
VITE_SUPPORTED_FORMATS=pdf,docx,html

# Assinatura Digital
VITE_ENABLE_DIGITAL_SIGNATURE=true
VITE_CERTIFICATE_VALIDATION_URL=https://api.certificados.gov.br

# Templates
VITE_DEFAULT_TEMPLATE_ID=medical_report_v1
VITE_CUSTOM_TEMPLATES_ENABLED=true

# Performance
VITE_REPORT_CACHE_TTL=3600000
VITE_ENABLE_REPORT_PREVIEW_CACHE=true
```

## Uso Prático

### Exemplo: Geração de Relatório Médico

```tsx
import { ReportGenerator } from './components/reports/ReportGenerator';
import { ReportType } from './types/report';

function ConsultationReportPage() {
  const { consultationId, patientId } = useParams();

  const handleReportGenerated = (reportData: ReportData) => {
    toast.success('Relatório gerado com sucesso!');

    // Navegar para visualização ou lista de relatórios
    navigate(`/reports/${reportData.id}`);
  };

  return (
    <div className="consultation-report-page">
      <PageHeader
        title="Gerar Relatório de Consulta"
        subtitle="Crie um relatório detalhado da consulta realizada"
      />

      <ReportGenerator
        patientId={patientId!}
        consultationId={consultationId!}
        reportType={ReportType.CONSULTATION_SUMMARY}
        onReportGenerated={handleReportGenerated}
      />
    </div>
  );
}
```

## Testes

### Testes de Geração

```typescript
describe('Report Generation', () => {
  test('should generate PDF report successfully', async () => {
    const mockReportData: ReportData = {
      // ... dados de teste
    };

    const result = await reportService.generateReport(mockReportData, 'pdf');

    expect(result.fileUrl).toBeDefined();
    expect(result.fileName).toContain('.pdf');

    // Verificar se o arquivo foi criado
    const response = await fetch(result.fileUrl);
    expect(response.ok).toBe(true);
    expect(response.headers.get('content-type')).toBe('application/pdf');
  });

  test('should validate required fields', () => {
    const incompleteReportData = {
      // ... dados incompletos
    };

    const validation = validateReportData(incompleteReportData);

    expect(validation.isValid).toBe(false);
    expect(validation.missingFields).toContain('patient.name');
  });
});
```

## Roadmap

### Próximas Funcionalidades

- [ ] Templates visuais drag & drop
- [ ] Integração com sistemas de gestão hospitalar
- [ ] Relatórios colaborativos
- [ ] Versionamento avançado de documentos
- [ ] Integração com blockchain para autenticidade

### Melhorias Planejadas

- [ ] OCR para digitalização de documentos
- [ ] Reconhecimento de voz para ditado
- [ ] Templates inteligentes com IA
- [ ] Análise de qualidade de relatórios
- [ ] Dashboard de métricas de relatórios

## Contribuição

Para contribuir com este módulo:

1. **Conformidade**: Sempre seguir padrões médicos (CFM, SBIS)
2. **Segurança**: Implementar criptografia e assinatura digital
3. **Performance**: Otimizar geração de documentos grandes
4. **Acessibilidade**: Garantir compatibilidade com leitores de tela
5. **Testes**: Manter cobertura alta para validações críticas

## Suporte

Para problemas relacionados a relatórios:

1. Verificar logs de geração de documentos
2. Validar templates e estruturas de dados
3. Testar conectividade com serviços de IA
4. Confirmar permissões de storage
5. Verificar certificados digitais

### Contatos Especializados

- **Templates**: templates@doctorbriefai.com
- **Assinatura Digital**: security@doctorbriefai.com
- **Performance**: performance@doctorbriefai.com
