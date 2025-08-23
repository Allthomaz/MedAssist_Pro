# Módulo de Pacientes

Este módulo gerencia todo o ciclo de vida dos dados de pacientes no sistema Doctor Brief AI, incluindo cadastro, histórico médico, consultas e conformidade com regulamentações de privacidade.

## Visão Geral

O módulo de pacientes é responsável por:

- Cadastro e gerenciamento de dados pessoais
- Histórico médico completo e estruturado
- Relacionamento com consultas e procedimentos
- Controle de acesso e privacidade (LGPD/HIPAA)
- Integração com prontuário eletrônico
- Relatórios e análises de dados de saúde

## Arquitetura de Dados

### Estrutura Hierárquica

```
Paciente
├── Dados Pessoais (identificação, contato)
├── Dados Médicos (alergias, medicamentos, histórico)
├── Consultas (lista de consultas realizadas)
├── Documentos (exames, laudos, receitas)
├── Preferências (notificações, privacidade)
└── Auditoria (logs de acesso e modificações)
```

### Relacionamentos

- **1:N** Paciente → Consultas
- **1:N** Paciente → Documentos
- **N:M** Paciente → Médicos (através de consultas)
- **1:1** Paciente → Preferências

## Interfaces de Dados

### Patient Interface

```typescript
interface Patient {
  id: string;
  // Dados Pessoais
  full_name: string;
  cpf: string;
  rg?: string;
  birth_date: Date;
  gender: Gender;

  // Contato
  email?: string;
  phone: string;
  emergency_contact?: EmergencyContact;

  // Endereço
  address: Address;

  // Dados Médicos
  medical_data: MedicalData;

  // Metadados
  created_at: Date;
  updated_at: Date;
  created_by: string; // ID do médico que cadastrou

  // Controle de Acesso
  privacy_settings: PrivacySettings;
  consent_given: boolean;
  consent_date?: Date;
}
```

### MedicalData Interface

```typescript
interface MedicalData {
  // Informações Básicas
  blood_type?: BloodType;
  height?: number; // em cm
  weight?: number; // em kg

  // Alergias e Restrições
  allergies: Allergy[];
  food_restrictions: string[];

  // Medicamentos
  current_medications: Medication[];
  medication_history: MedicationHistory[];

  // Histórico Médico
  chronic_conditions: ChronicCondition[];
  previous_surgeries: Surgery[];
  family_history: FamilyHistory[];

  // Hábitos de Vida
  lifestyle: LifestyleData;

  // Observações Gerais
  general_notes?: string;

  // Última Atualização
  last_updated: Date;
  updated_by: string;
}
```

### Address Interface

```typescript
interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}
```

### PrivacySettings Interface

```typescript
interface PrivacySettings {
  // Compartilhamento de Dados
  allow_data_sharing: boolean;
  allow_research_participation: boolean;
  allow_marketing_communication: boolean;

  // Acesso a Dados
  data_retention_period: number; // em anos
  allow_family_access: boolean;
  authorized_contacts: string[]; // IDs de contatos autorizados

  // Notificações
  notification_preferences: NotificationPreferences;

  // Auditoria
  last_privacy_update: Date;
  privacy_version: string;
}
```

## Componentes Principais

### PatientForm.tsx

**Propósito**: Formulário completo para cadastro e edição de pacientes.

**Funcionalidades**:

- ✅ Validação robusta de CPF, RG e dados pessoais
- ✅ Campos condicionais baseados em contexto médico
- ✅ Integração com API de CEP para endereços
- ✅ Upload de documentos (RG, CPF, cartão SUS)
- ✅ Consentimento LGPD integrado
- ✅ Salvamento automático (draft)

**Validações Implementadas**:

```typescript
const patientSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),

  cpf: z
    .string()
    .length(11, 'CPF deve ter 11 dígitos')
    .regex(/^\d+$/, 'CPF deve conter apenas números')
    .refine(validateCPF, 'CPF inválido'),

  birth_date: z
    .date()
    .max(new Date(), 'Data de nascimento não pode ser futura')
    .min(new Date('1900-01-01'), 'Data muito antiga'),

  phone: z
    .string()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .regex(/^\d+$/, 'Telefone deve conter apenas números'),

  email: z.string().email('Email inválido').optional(),

  // Validações médicas específicas
  medical_data: medicalDataSchema,
});
```

### PatientList.tsx

**Propósito**: Lista paginada e pesquisável de pacientes.

**Funcionalidades**:

- ✅ Busca avançada (nome, CPF, telefone)
- ✅ Filtros por idade, gênero, cidade
- ✅ Ordenação por múltiplos campos
- ✅ Paginação otimizada
- ✅ Ações em lote (exportar, arquivar)
- ✅ Visualização responsiva

**Performance**:

- Virtualização para listas grandes (>1000 pacientes)
- Debounce na busca (300ms)
- Cache inteligente de resultados
- Lazy loading de dados médicos

### PatientProfile.tsx

**Propósito**: Visualização completa do perfil do paciente.

**Seções**:

- **Dados Pessoais**: Informações básicas e contato
- **Histórico Médico**: Condições, alergias, medicamentos
- **Consultas**: Timeline de consultas realizadas
- **Documentos**: Exames, laudos, receitas
- **Estatísticas**: Gráficos de evolução de saúde

### MedicalHistory.tsx

**Propósito**: Gerenciamento do histórico médico detalhado.

**Funcionalidades**:

- ✅ Timeline interativa de eventos médicos
- ✅ Categorização por tipo de evento
- ✅ Anexo de documentos por evento
- ✅ Notas médicas estruturadas
- ✅ Integração com CID-10
- ✅ Alertas de interações medicamentosas

## Serviços e Integrações

### PatientService

**Localização**: `src/services/patientService.ts`

**Funcionalidades Principais**:

#### CRUD Operations

```typescript
class PatientService {
  // Criar novo paciente
  async createPatient(patientData: CreatePatientRequest): Promise<Patient> {
    // Validação de dados
    // Verificação de duplicatas (CPF)
    // Criptografia de dados sensíveis
    // Salvamento no banco
    // Log de auditoria
  }

  // Buscar pacientes com filtros
  async searchPatients(
    filters: PatientFilters
  ): Promise<PaginatedResponse<Patient>> {
    // Construção de query otimizada
    // Aplicação de filtros
    // Paginação
    // Ordenação
    // Cache de resultados
  }

  // Atualizar dados do paciente
  async updatePatient(
    id: string,
    updates: UpdatePatientRequest
  ): Promise<Patient> {
    // Validação de permissões
    // Merge inteligente de dados
    // Versionamento de alterações
    // Notificação de mudanças
    // Auditoria completa
  }

  // Arquivar paciente (soft delete)
  async archivePatient(id: string, reason: string): Promise<void> {
    // Verificação de dependências
    // Backup de dados
    // Marcação como arquivado
    // Notificação de stakeholders
  }
}
```

#### Integrações Externas

```typescript
// Integração com API de CEP
const fetchAddressByCEP = async (cep: string): Promise<Address> => {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const data = await response.json();

  if (data.erro) {
    throw new Error('CEP não encontrado');
  }

  return {
    street: data.logradouro,
    neighborhood: data.bairro,
    city: data.localidade,
    state: data.uf,
    zip_code: cep,
    country: 'Brasil',
  };
};

// Validação de CPF
const validateCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');

  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  // Algoritmo de validação do CPF
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF[i]) * (10 - i);
  }

  let digit1 = 11 - (sum % 11);
  if (digit1 > 9) digit1 = 0;

  if (parseInt(cleanCPF[9]) !== digit1) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF[i]) * (11 - i);
  }

  let digit2 = 11 - (sum % 11);
  if (digit2 > 9) digit2 = 0;

  return parseInt(cleanCPF[10]) === digit2;
};
```

### Integração com Supabase

#### Estrutura de Tabelas

```sql
-- Tabela principal de pacientes
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  rg TEXT,
  birth_date DATE NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  email TEXT,
  phone TEXT NOT NULL,
  address JSONB NOT NULL,
  emergency_contact JSONB,
  medical_data JSONB DEFAULT '{}',
  privacy_settings JSONB DEFAULT '{}',
  consent_given BOOLEAN DEFAULT false,
  consent_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  archived_at TIMESTAMP WITH TIME ZONE,
  archived_by UUID REFERENCES auth.users(id),
  archived_reason TEXT
);

-- Tabela de histórico médico
CREATE TABLE medical_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'consultation', 'surgery', 'medication', 'allergy', etc.
  event_date DATE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cid_code TEXT, -- Código CID-10
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT CHECK (status IN ('active', 'resolved', 'chronic')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Tabela de documentos do paciente
CREATE TABLE patient_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- 'exam', 'prescription', 'report', 'image'
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  description TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Índices para performance
CREATE INDEX idx_patients_cpf ON patients(cpf);
CREATE INDEX idx_patients_name ON patients USING gin(to_tsvector('portuguese', full_name));
CREATE INDEX idx_patients_phone ON patients(phone);
CREATE INDEX idx_patients_created_by ON patients(created_by);
CREATE INDEX idx_medical_events_patient_id ON medical_events(patient_id);
CREATE INDEX idx_medical_events_date ON medical_events(event_date DESC);
CREATE INDEX idx_patient_documents_patient_id ON patient_documents(patient_id);
```

#### Row Level Security (RLS)

```sql
-- Políticas de acesso para pacientes
CREATE POLICY "Doctors can view their patients" ON patients
  FOR SELECT USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM consultations c
      WHERE c.patient_id = patients.id
      AND c.doctor_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can create patients" ON patients
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'doctor'
    )
  );

CREATE POLICY "Doctors can update their patients" ON patients
  FOR UPDATE USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM consultations c
      WHERE c.patient_id = patients.id
      AND c.doctor_id = auth.uid()
    )
  );

-- Políticas para eventos médicos
CREATE POLICY "Access medical events through patient access" ON medical_events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM patients p
      WHERE p.id = medical_events.patient_id
      AND (
        p.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM consultations c
          WHERE c.patient_id = p.id
          AND c.doctor_id = auth.uid()
        )
      )
    )
  );
```

## Conformidade e Privacidade

### LGPD (Lei Geral de Proteção de Dados)

#### Implementações de Conformidade

```typescript
// Consentimento explícito
const requestConsent = async (
  patientId: string,
  purposes: ConsentPurpose[]
): Promise<ConsentRecord> => {
  const consentRecord = {
    patient_id: patientId,
    purposes: purposes,
    consent_given: false,
    consent_date: null,
    consent_version: CURRENT_CONSENT_VERSION,
    ip_address: getUserIP(),
    user_agent: navigator.userAgent,
  };

  // Apresentar termos de consentimento
  const userConsent = await showConsentModal(purposes);

  if (userConsent) {
    consentRecord.consent_given = true;
    consentRecord.consent_date = new Date();
  }

  // Salvar registro de consentimento
  return await saveConsentRecord(consentRecord);
};

// Direito ao esquecimento
const deletePatientData = async (
  patientId: string,
  reason: string
): Promise<void> => {
  // Verificar se há impedimentos legais
  const legalHolds = await checkLegalHolds(patientId);
  if (legalHolds.length > 0) {
    throw new Error(
      'Não é possível excluir dados devido a impedimentos legais'
    );
  }

  // Backup para auditoria (dados anonimizados)
  await createAnonymizedBackup(patientId);

  // Exclusão em cascata
  await deletePatientCascade(patientId);

  // Log de auditoria
  await logDataDeletion(patientId, reason);

  // Notificação de confirmação
  await notifyDataDeletion(patientId);
};

// Portabilidade de dados
const exportPatientData = async (
  patientId: string,
  format: 'json' | 'pdf' | 'xml'
): Promise<ExportResult> => {
  // Verificar permissões
  await checkExportPermissions(patientId);

  // Coletar todos os dados
  const patientData = await collectAllPatientData(patientId);

  // Formatar conforme solicitado
  const formattedData = await formatData(patientData, format);

  // Log de auditoria
  await logDataExport(patientId, format);

  return {
    data: formattedData,
    export_date: new Date(),
    format: format,
    checksum: calculateChecksum(formattedData),
  };
};
```

### HIPAA (Health Insurance Portability and Accountability Act)

#### Medidas de Segurança

```typescript
// Criptografia de dados sensíveis
const encryptSensitiveData = (data: any): string => {
  const key = process.env.ENCRYPTION_KEY;
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

const decryptSensitiveData = (encryptedData: string): any => {
  const key = process.env.ENCRYPTION_KEY;
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// Auditoria de acesso
const logDataAccess = async (
  patientId: string,
  accessType: string,
  userId: string
): Promise<void> => {
  await supabase.from('audit_logs').insert({
    patient_id: patientId,
    user_id: userId,
    action: 'data_access',
    resource: 'patient_data',
    access_type: accessType,
    timestamp: new Date(),
    ip_address: getUserIP(),
    user_agent: navigator.userAgent,
  });
};

// Controle de acesso baseado em contexto
const checkAccessPermission = async (
  patientId: string,
  userId: string,
  action: string
): Promise<boolean> => {
  // Verificar relacionamento médico-paciente
  const relationship = await checkDoctorPatientRelationship(patientId, userId);
  if (!relationship) return false;

  // Verificar permissões específicas da ação
  const permissions = await getUserPermissions(userId);
  if (!permissions.includes(action)) return false;

  // Verificar restrições temporais
  const timeRestrictions = await getTimeRestrictions(userId);
  if (!isWithinAllowedTime(timeRestrictions)) return false;

  return true;
};
```

## Validações e Qualidade de Dados

### Validações de Entrada

```typescript
// Validação de CPF com verificação de duplicatas
const validateUniquePatient = async (
  cpf: string,
  excludeId?: string
): Promise<ValidationResult> => {
  const existingPatient = await supabase
    .from('patients')
    .select('id, full_name')
    .eq('cpf', cpf)
    .neq('id', excludeId || '')
    .single();

  if (existingPatient.data) {
    return {
      valid: false,
      error: `Paciente já cadastrado: ${existingPatient.data.full_name}`,
    };
  }

  return { valid: true };
};

// Validação de dados médicos
const validateMedicalData = (medicalData: MedicalData): ValidationResult[] => {
  const errors: ValidationResult[] = [];

  // Validar alergias
  medicalData.allergies.forEach((allergy, index) => {
    if (!allergy.substance || !allergy.severity) {
      errors.push({
        field: `allergies[${index}]`,
        valid: false,
        error: 'Substância e severidade são obrigatórias',
      });
    }
  });

  // Validar medicamentos atuais
  medicalData.current_medications.forEach((medication, index) => {
    if (!medication.name || !medication.dosage) {
      errors.push({
        field: `current_medications[${index}]`,
        valid: false,
        error: 'Nome e dosagem são obrigatórios',
      });
    }

    // Verificar interações medicamentosas
    const interactions = checkDrugInteractions(
      medication,
      medicalData.current_medications
    );
    if (interactions.length > 0) {
      errors.push({
        field: `current_medications[${index}]`,
        valid: false,
        error: `Possível interação medicamentosa: ${interactions.join(', ')}`,
        severity: 'warning',
      });
    }
  });

  return errors;
};
```

### Limpeza e Normalização

```typescript
// Normalização de dados de entrada
const normalizePatientData = (rawData: any): Patient => {
  return {
    ...rawData,
    full_name: rawData.full_name.trim().toUpperCase(),
    cpf: rawData.cpf.replace(/\D/g, ''), // Remove caracteres não numéricos
    phone: rawData.phone.replace(/\D/g, ''),
    email: rawData.email?.toLowerCase().trim(),
    address: {
      ...rawData.address,
      zip_code: rawData.address.zip_code.replace(/\D/g, ''),
      street: rawData.address.street.trim(),
      city: rawData.address.city.trim().toUpperCase(),
      state: rawData.address.state.trim().toUpperCase(),
    },
  };
};

// Sanitização de dados sensíveis para logs
const sanitizeForLogging = (patientData: Patient): any => {
  return {
    id: patientData.id,
    name_hash: hashString(patientData.full_name),
    cpf_masked: maskCPF(patientData.cpf),
    age: calculateAge(patientData.birth_date),
    gender: patientData.gender,
    city: patientData.address.city,
    state: patientData.address.state,
  };
};
```

## Performance e Otimização

### Estratégias de Cache

```typescript
// Cache de busca de pacientes
const patientSearchCache = new Map<string, CacheEntry>();

const searchPatientsWithCache = async (
  query: string,
  filters: PatientFilters
): Promise<Patient[]> => {
  const cacheKey = generateCacheKey(query, filters);
  const cached = patientSearchCache.get(cacheKey);

  if (cached && !isCacheExpired(cached)) {
    return cached.data;
  }

  const results = await searchPatients(query, filters);

  patientSearchCache.set(cacheKey, {
    data: results,
    timestamp: Date.now(),
    ttl: 5 * 60 * 1000, // 5 minutos
  });

  return results;
};

// Pré-carregamento de dados relacionados
const preloadPatientData = async (patientId: string): Promise<void> => {
  // Carregar dados em paralelo
  const [medicalHistory, documents, consultations] = await Promise.all([
    loadMedicalHistory(patientId),
    loadPatientDocuments(patientId),
    loadRecentConsultations(patientId),
  ]);

  // Armazenar no cache local
  cachePatientData(patientId, {
    medicalHistory,
    documents,
    consultations,
  });
};
```

### Otimização de Queries

```typescript
// Query otimizada para busca de pacientes
const buildOptimizedPatientQuery = (filters: PatientFilters) => {
  let query = supabase.from('patients').select(`
      id,
      full_name,
      cpf,
      birth_date,
      phone,
      email,
      address->city,
      address->state,
      created_at,
      medical_data->blood_type,
      medical_data->chronic_conditions
    `);

  // Aplicar filtros de forma otimizada
  if (filters.name) {
    query = query.textSearch('full_name', filters.name, {
      type: 'websearch',
      config: 'portuguese',
    });
  }

  if (filters.city) {
    query = query.eq('address->city', filters.city);
  }

  if (filters.ageRange) {
    const { min, max } = filters.ageRange;
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - min);
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - max);

    query = query
      .gte('birth_date', minDate.toISOString().split('T')[0])
      .lte('birth_date', maxDate.toISOString().split('T')[0]);
  }

  return query
    .order('full_name')
    .range(filters.offset || 0, (filters.offset || 0) + (filters.limit || 50));
};
```

## Relatórios e Analytics

### Relatórios Estatísticos

```typescript
// Relatório demográfico
const generateDemographicReport = async (
  doctorId: string
): Promise<DemographicReport> => {
  const patients = await getPatientsByDoctor(doctorId);

  return {
    total_patients: patients.length,
    age_distribution: calculateAgeDistribution(patients),
    gender_distribution: calculateGenderDistribution(patients),
    geographic_distribution: calculateGeographicDistribution(patients),
    most_common_conditions: getMostCommonConditions(patients),
    registration_trends: getRegistrationTrends(patients),
  };
};

// Relatório de qualidade de dados
const generateDataQualityReport = async (
  doctorId: string
): Promise<DataQualityReport> => {
  const patients = await getPatientsByDoctor(doctorId);

  return {
    completeness: {
      basic_info: calculateCompletenessScore(patients, BASIC_FIELDS),
      medical_data: calculateCompletenessScore(patients, MEDICAL_FIELDS),
      contact_info: calculateCompletenessScore(patients, CONTACT_FIELDS),
    },
    data_issues: {
      missing_cpf: patients.filter(p => !p.cpf).length,
      invalid_emails: patients.filter(p => p.email && !isValidEmail(p.email))
        .length,
      outdated_records: patients.filter(p => isRecordOutdated(p)).length,
    },
    recommendations: generateDataQualityRecommendations(patients),
  };
};
```

## Configuração e Deploy

### Variáveis de Ambiente

```env
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima

# Criptografia
ENCRYPTION_KEY=sua_chave_de_criptografia_256_bits
HASH_SALT=seu_salt_para_hashing

# APIs Externas
VITE_VIACEP_API_URL=https://viacep.com.br/ws
VITE_IBGE_API_URL=https://servicodados.ibge.gov.br/api/v1

# Configurações de Privacidade
VITE_DATA_RETENTION_YEARS=7
VITE_CONSENT_VERSION=1.0
VITE_PRIVACY_POLICY_URL=https://doctorbriefai.com/privacy

# Configurações de Performance
VITE_CACHE_TTL_MINUTES=5
VITE_MAX_SEARCH_RESULTS=100
VITE_PRELOAD_RELATED_DATA=true
```

### Scripts de Migração

```sql
-- Migração para adicionar campos de auditoria
ALTER TABLE patients ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS access_count INTEGER DEFAULT 0;

-- Migração para adicionar índices de performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_patients_birth_date ON patients(birth_date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_patients_gender ON patients(gender);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_patients_city ON patients USING gin((address->>'city'));

-- Migração para adicionar campos de consentimento LGPD
ALTER TABLE patients ADD COLUMN IF NOT EXISTS consent_version TEXT DEFAULT '1.0';
ALTER TABLE patients ADD COLUMN IF NOT EXISTS data_retention_until DATE;
```

## Uso Prático

### Exemplo: Cadastro Completo

```tsx
import { PatientForm } from './components/patients/PatientForm';
import { usePatients } from './hooks/usePatients';

function NewPatientPage() {
  const { createPatient, loading, error } = usePatients();

  const handleSubmit = async (patientData: CreatePatientRequest) => {
    try {
      const newPatient = await createPatient(patientData);
      toast.success('Paciente cadastrado com sucesso!');
      navigate(`/patients/${newPatient.id}`);
    } catch (err) {
      toast.error('Erro ao cadastrar paciente');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Novo Paciente</h1>

      <PatientForm
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        showConsentForm={true}
        enableAutoSave={true}
      />
    </div>
  );
}
```

### Exemplo: Busca Avançada

```tsx
import { PatientList } from './components/patients/PatientList';
import { PatientFilters } from './components/patients/PatientFilters';

function PatientsPage() {
  const [filters, setFilters] = useState<PatientFilters>({});
  const { patients, loading, searchPatients } = usePatients();

  const handleFilterChange = (newFilters: PatientFilters) => {
    setFilters(newFilters);
    searchPatients(newFilters);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex gap-6">
        <aside className="w-1/4">
          <PatientFilters filters={filters} onChange={handleFilterChange} />
        </aside>

        <main className="flex-1">
          <PatientList
            patients={patients}
            loading={loading}
            onPatientSelect={patient => navigate(`/patients/${patient.id}`)}
            enableBulkActions={true}
            showMedicalSummary={true}
          />
        </main>
      </div>
    </div>
  );
}
```

## Testes

### Testes de Integração

```typescript
describe('Patient Management', () => {
  test('should create patient with valid data', async () => {
    const patientData = {
      full_name: 'João Silva',
      cpf: '12345678901',
      birth_date: new Date('1990-01-01'),
      phone: '11999999999',
      address: {
        street: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        zip_code: '01234567',
      },
    };

    const patient = await patientService.createPatient(patientData);

    expect(patient.id).toBeDefined();
    expect(patient.full_name).toBe('JOÃO SILVA');
    expect(patient.cpf).toBe('12345678901');
  });

  test('should reject duplicate CPF', async () => {
    const patientData = {
      full_name: 'Maria Silva',
      cpf: '12345678901', // CPF já usado no teste anterior
      birth_date: new Date('1985-01-01'),
      phone: '11888888888',
    };

    await expect(patientService.createPatient(patientData)).rejects.toThrow(
      'Paciente já cadastrado'
    );
  });
});
```

## Roadmap

### Próximas Funcionalidades

- [ ] Integração com cartão SUS
- [ ] Reconhecimento facial para identificação
- [ ] Chatbot para coleta de anamnese
- [ ] Integração com wearables (Apple Health, Google Fit)
- [ ] Análise preditiva de riscos de saúde

### Melhorias Planejadas

- [ ] Interface mobile nativa
- [ ] Sincronização offline
- [ ] Backup automático em múltiplas nuvens
- [ ] Assinatura digital de documentos
- [ ] Integração com laboratórios

## Contribuição

Para contribuir com este módulo:

1. **Privacidade**: Sempre considere implicações de privacidade
2. **Validação**: Implemente validação robusta em todas as camadas
3. **Auditoria**: Registre todas as operações críticas
4. **Performance**: Monitore impacto em queries e cache
5. **Testes**: Mantenha cobertura alta, especialmente para validações

## Suporte

Para problemas relacionados ao módulo de pacientes:

1. Verifique logs de auditoria para operações falhadas
2. Confirme configurações de RLS no Supabase
3. Valide integridade dos dados no banco
4. Teste conectividade com APIs externas
5. Verifique conformidade com LGPD/HIPAA

### Contatos Especializados

- **Privacidade**: privacy@doctorbriefai.com
- **Dados Médicos**: medical-data@doctorbriefai.com
- **Performance**: performance@doctorbriefai.com
