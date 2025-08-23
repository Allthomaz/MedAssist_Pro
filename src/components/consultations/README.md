# Módulo de Consultas

Este módulo gerencia todo o fluxo de consultas médicas no sistema Doctor Brief AI, desde o processamento de áudio até a geração de relatórios estruturados.

## Visão Geral

O módulo de consultas é o núcleo do sistema, responsável por:
- Processamento de áudio médico com IA
- Geração automática de relatórios médicos
- Integração com modelos de linguagem (OpenAI/Anthropic)
- Gerenciamento de transcrições e análises
- Exportação de documentos em PDF

## Componentes Principais

### AudioProcessor.tsx
**Propósito**: Processa arquivos de áudio e coordena a transcrição com análise por IA.

**Funcionalidades**:
- ✅ Upload de arquivos de áudio para Supabase Storage
- ✅ Integração com serviço de transcrição (OpenAI Whisper)
- ✅ Processamento via MCP (Model Context Protocol)
- ✅ Análise inteligente de conteúdo médico
- ✅ Feedback visual de progresso
- ✅ Tratamento robusto de erros

**Props**:
```typescript
interface AudioProcessorProps {
  consultationId: string;
  onProcessingComplete?: (result: any) => void;
  onError?: (error: string) => void;
}
```

**Fluxo de Processamento**:
1. **Upload**: Arquivo enviado para Supabase Storage
2. **Transcrição**: Processamento via OpenAI Whisper
3. **Análise**: Interpretação do conteúdo médico via MCP
4. **Estruturação**: Organização dos dados para relatórios
5. **Callback**: Notificação do componente pai

### ReportGenerator.tsx
**Propósito**: Gera relatórios médicos estruturados usando IA e exporta em PDF.

**Funcionalidades**:
- ✅ Geração de relatórios via função Supabase Edge
- ✅ Tipos de relatório predefinidos (Anamnese, Evolução, etc.)
- ✅ Campo personalizado para intenções específicas
- ✅ Exportação em PDF com formatação profissional
- ✅ Substituição inteligente de placeholders
- ✅ Salvamento automático no banco de dados

**Props**:
```typescript
interface ReportGeneratorProps {
  consultationId: string;
  transcription?: string;
  onReportGenerated?: (report: GeneratedReport) => void;
}
```

**Tipos de Relatório Disponíveis**:
- **Anamnese Completa**: Histórico detalhado do paciente
- **Evolução Médica**: Acompanhamento do quadro clínico
- **Prescrição Médica**: Medicamentos e orientações
- **Atestado Médico**: Documento para afastamento
- **Relatório de Exames**: Análise de resultados
- **Personalizado**: Intenção definida pelo usuário

## Interfaces de Dados

### GeneratedReport
```typescript
interface GeneratedReport {
  id: string;
  consultation_id: string;
  report_type: string;
  content: string;
  created_at: string;
  updated_at: string;
  metadata?: {
    intention?: string;
    processing_time?: number;
    model_used?: string;
  };
}
```

### ProcessingResult
```typescript
interface ProcessingResult {
  transcription: string;
  analysis: {
    symptoms: string[];
    diagnosis: string[];
    recommendations: string[];
    medications: string[];
  };
  confidence: number;
  processing_time: number;
}
```

## Serviços Integrados

### MCP Service (Model Context Protocol)
**Localização**: `src/services/magicMcpService.ts`

**Funcionalidades**:
- Processamento de áudio médico
- Análise contextual de transcrições
- Extração de informações clínicas
- Estruturação de dados médicos

**Configuração**:
```typescript
const mcpConfig = {
  model: 'gpt-4-turbo',
  temperature: 0.3,
  max_tokens: 4000,
  context: 'medical_consultation'
};
```

### Report Service
**Localização**: `src/services/reportService.ts`

**Funcionalidades**:
- Geração de relatórios via Supabase Edge Functions
- Templates predefinidos para diferentes tipos
- Formatação automática de conteúdo
- Integração com banco de dados

### PDF Generation
**Biblioteca**: jsPDF

**Configurações**:
- **Formato**: A4 (210 x 297mm)
- **Margens**: 20mm em todos os lados
- **Fonte**: Helvetica (padrão médico)
- **Encoding**: UTF-8 (suporte a acentos)

## Fluxo de Trabalho Completo

### 1. Processamento de Áudio
```
Upload do Arquivo → Validação → Armazenamento → 
Transcrição (Whisper) → Análise (MCP) → 
Estruturação → Callback de Sucesso
```

### 2. Geração de Relatório
```
Seleção do Tipo → Configuração de Parâmetros → 
Chamada para Edge Function → Processamento IA → 
Salvamento no Banco → Exibição para Usuário
```

### 3. Exportação PDF
```
Solicitação de Download → Criação do Documento → 
Formatação do Conteúdo → Substituição de Placeholders → 
Aplicação de Estilos → Download Automático
```

## Validações e Segurança

### Validação de Entrada
- **Arquivos de Áudio**: Tipo, tamanho e integridade
- **Transcrições**: Conteúdo mínimo e formato
- **Relatórios**: Campos obrigatórios e estrutura

### Segurança de Dados
- **Criptografia**: Dados sensíveis em trânsito e repouso
- **Autenticação**: Validação de usuário para cada operação
- **Auditoria**: Log de todas as operações críticas
- **LGPD/HIPAA**: Conformidade com regulamentações

### Sanitização
- **Inputs**: Limpeza de caracteres especiais
- **Outputs**: Escape de conteúdo HTML/XML
- **SQL**: Prevenção de injection via Supabase RLS

## Tratamento de Erros

### Cenários Cobertos
- **Falha na transcrição**: Retry automático + fallback
- **Erro de IA**: Mensagem específica + log detalhado
- **Problema de rede**: Timeout + reconexão
- **Arquivo corrompido**: Validação + orientação
- **Limite de API**: Rate limiting + queue

### Estratégias de Recuperação
- **Retry exponencial**: Para falhas temporárias
- **Fallback graceful**: Funcionalidade reduzida
- **Cache local**: Dados críticos preservados
- **Notificação clara**: Feedback específico ao usuário

## Performance e Otimização

### Otimizações Implementadas
- **Lazy loading**: Componentes carregados sob demanda
- **Memoização**: Cache de resultados computacionais
- **Debouncing**: Redução de chamadas desnecessárias
- **Compression**: Arquivos otimizados para upload

### Métricas de Performance
- **Transcrição**: ~1min para 10min de áudio
- **Geração de relatório**: ~30s para análise completa
- **Export PDF**: ~2s para documento padrão
- **Upload**: ~5s para arquivo de 10MB

## Configuração do Ambiente

### Variáveis Necessárias
```env
# Supabase
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima

# OpenAI
VITE_OPENAI_API_KEY=sua_chave_openai
VITE_OPENAI_API_URL=https://api.openai.com/v1

# MCP Service
VITE_MCP_ENDPOINT=sua_url_mcp
VITE_MCP_API_KEY=sua_chave_mcp
```

### Configuração do Supabase

#### Edge Functions
```sql
-- Função para geração de relatórios
CREATE OR REPLACE FUNCTION generate_medical_report(
  consultation_id UUID,
  report_type TEXT,
  transcription TEXT,
  custom_intention TEXT DEFAULT NULL
) RETURNS JSON AS $$
-- Implementação da função
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### Tabelas Necessárias
```sql
-- Tabela de relatórios
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID REFERENCES consultations(id),
  report_type TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Uso Prático

### Exemplo: Processamento Completo
```tsx
import { AudioProcessor, ReportGenerator } from './components/consultations';

function ConsultationWorkflow({ consultationId }) {
  const [transcription, setTranscription] = useState('');
  const [processingComplete, setProcessingComplete] = useState(false);

  const handleProcessingComplete = (result) => {
    setTranscription(result.transcription);
    setProcessingComplete(true);
  };

  const handleReportGenerated = (report) => {
    console.log('Relatório gerado:', report);
    // Lógica adicional
  };

  return (
    <div>
      <AudioProcessor 
        consultationId={consultationId}
        onProcessingComplete={handleProcessingComplete}
      />
      
      {processingComplete && (
        <ReportGenerator 
          consultationId={consultationId}
          transcription={transcription}
          onReportGenerated={handleReportGenerated}
        />
      )}
    </div>
  );
}
```

### Exemplo: Geração de Relatório Personalizado
```tsx
const customReportConfig = {
  type: 'personalizado',
  intention: 'Relatório para cirurgia cardíaca com foco em riscos pré-operatórios',
  includeExams: true,
  includeMedications: true,
  format: 'detailed'
};

<ReportGenerator 
  consultationId={consultationId}
  transcription={transcription}
  config={customReportConfig}
/>
```

## Integração com Outros Módulos

### Módulo de Áudio
- **AudioManager**: Fornece arquivos para processamento
- **useAudioRecorder**: Gravação em tempo real

### Módulo de Pacientes
- **PatientData**: Contexto para relatórios personalizados
- **MedicalHistory**: Histórico para análise contextual

### Módulo de Documentos
- **DocumentManager**: Armazenamento de PDFs gerados
- **TemplateEngine**: Templates personalizados

## Roadmap

### Próximas Funcionalidades
- [ ] Análise de sentimento em consultas
- [ ] Sugestões automáticas de CID-10
- [ ] Integração com prontuário eletrônico
- [ ] Templates personalizáveis por especialidade
- [ ] Assinatura digital de documentos

### Melhorias Planejadas
- [ ] Interface de edição de relatórios
- [ ] Versionamento de documentos
- [ ] Colaboração em tempo real
- [ ] Análise de qualidade da consulta
- [ ] Métricas de performance médica

## Monitoramento e Logs

### Eventos Rastreados
- Início/fim de processamento de áudio
- Geração de relatórios (tipo, tempo, sucesso)
- Erros de transcrição ou IA
- Downloads de PDF
- Tempo de resposta das APIs

### Métricas de Negócio
- Taxa de sucesso na transcrição
- Tempo médio de geração de relatórios
- Tipos de relatório mais utilizados
- Satisfação do usuário com IA

## Contribuição

Para contribuir com este módulo:
1. **Testes**: Adicione testes para novas funcionalidades
2. **Documentação**: Mantenha JSDoc e README atualizados
3. **Performance**: Monitore impacto nas métricas
4. **Segurança**: Valide todas as entradas de dados
5. **UX**: Mantenha feedback claro para o usuário

## Suporte e Troubleshooting

### Problemas Comuns

**Transcrição falha**:
- Verificar conectividade com OpenAI
- Validar formato do arquivo de áudio
- Confirmar limites de API

**Relatório não gera**:
- Verificar Edge Functions do Supabase
- Validar transcrição mínima
- Confirmar configuração do MCP

**PDF não baixa**:
- Verificar bloqueador de pop-ups
- Validar conteúdo do relatório
- Confirmar suporte do navegador

### Logs Úteis
```javascript
// Habilitar logs detalhados
localStorage.setItem('debug_consultations', 'true');

// Verificar status das APIs
console.log('MCP Status:', await mcpService.healthCheck());
console.log('Supabase Status:', supabase.auth.getSession());
```