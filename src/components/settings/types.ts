/**
 * Tipos TypeScript para o módulo de configurações
 * Doctor Brief AI - Sistema de Configurações
 */

export interface UserSettings {
  id: string;
  userId: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Configurações de perfil
  profile: {
    personalInfo: PersonalInfo;
    professionalInfo: ProfessionalInfo;
    contactInfo: ContactInfo;
  };
  
  // Configurações de aparência
  appearance: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    fontSize: 'small' | 'medium' | 'large';
    colorScheme: 'default' | 'high-contrast' | 'colorblind';
    animations: boolean;
    compactMode: boolean;
    sidebar: {
      collapsed: boolean;
      position: 'left' | 'right';
    };
    dashboard: {
      layout: 'grid' | 'list';
      widgets: string[];
      density: 'comfortable' | 'compact';
    };
  };
  
  // Configurações de notificações
  notifications: {
    email: {
      enabled: boolean;
      newPatient: boolean;
      appointmentReminder: boolean;
      consultationSummary: boolean;
      systemUpdates: boolean;
      securityAlerts: boolean;
      frequency: 'immediate' | 'daily' | 'weekly';
    };
    push: {
      enabled: boolean;
      newPatient: boolean;
      appointmentReminder: boolean;
      urgentMessages: boolean;
      systemAlerts: boolean;
      quietHours: {
        enabled: boolean;
        start: string;
        end: string;
      };
    };
    sound: {
      enabled: boolean;
      volume: number;
      notificationSound: string;
      alertSound: string;
    };
    desktop: {
      enabled: boolean;
      position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
      duration: number;
    };
  };
  
  // Configurações de áudio
  audio: {
    microphone: {
      deviceId?: string;
      gain: number;
      noiseReduction: boolean;
      echoCancellation: boolean;
      autoGainControl: boolean;
    };
    transcription: {
      language: string;
      model: string;
      confidence: number;
      punctuation: boolean;
      timestamps: boolean;
      speakerDiarization: boolean;
      customVocabulary: string[];
    };
    recording: {
      quality: 'low' | 'medium' | 'high';
      format: 'mp3' | 'wav' | 'ogg';
      bitrate: number;
      sampleRate: number;
      channels: 'mono' | 'stereo';
      autoStop: {
        enabled: boolean;
        silenceDuration: number;
      };
    };
  };
  
  // Configurações de segurança
  security: {
    password: {
      requireChange: boolean;
      changeInterval: number;
      minLength: number;
      requireSpecialChars: boolean;
      requireNumbers: boolean;
      requireUppercase: boolean;
      preventReuse: number;
    };
    twoFactor: {
      enabled: boolean;
      method: 'sms' | 'email' | 'authenticator';
      backupCodes: string[];
      trustedDevices: TrustedDevice[];
    };
    session: {
      timeout: number;
      maxConcurrentSessions: number;
      requireReauthForSensitive: boolean;
      logoutOnClose: boolean;
    };
    privacy: {
      shareUsageData: boolean;
      shareErrorReports: boolean;
      allowAnalytics: boolean;
      dataRetention: number;
      autoDeleteInactive: boolean;
    };
  };
  
  // Configurações de integrações
  integrations: {
    api: {
      enabled: boolean;
      keys: ApiKey[];
      rateLimit: {
        requests: number;
        window: number;
      };
    };
    webhooks: {
      enabled: boolean;
      endpoints: WebhookEndpoint[];
      retryPolicy: {
        maxRetries: number;
        backoffMultiplier: number;
        maxBackoffTime: number;
      };
    };
    externalServices: {
      openai: {
        enabled: boolean;
        apiKey?: string;
        model: string;
        maxTokens: number;
      };
      anthropic: {
        enabled: boolean;
        apiKey?: string;
        model: string;
        maxTokens: number;
      };
      googleCloud: {
        enabled: boolean;
        projectId?: string;
        keyFile?: string;
        services: string[];
      };
      aws: {
        enabled: boolean;
        accessKeyId?: string;
        secretAccessKey?: string;
        region: string;
        services: string[];
      };
    };
  };
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  displayName?: string;
  bio?: string;
  birthDate?: Date;
  gender?: 'M' | 'F' | 'O' | 'N';
  avatar?: string;
}

export interface ProfessionalInfo {
  title: 'Dr.' | 'Dra.' | 'Prof. Dr.' | 'Prof. Dra.';
  crm: string;
  specialty: string;
  subspecialty?: string;
  institution?: string;
  licenseNumber?: string;
  licenseExpiry?: Date;
  certifications: string[];
}

export interface ContactInfo {
  email: string;
  phone: string;
  alternativePhone?: string;
  address: Address;
  emergencyContact?: EmergencyContact;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name?: string;
  relationship?: string;
  phone?: string;
}

export interface TrustedDevice {
  id: string;
  name: string;
  lastUsed: Date;
  ipAddress: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: Date;
  lastUsed?: Date;
  expiresAt?: Date;
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  secret: string;
  enabled: boolean;
  createdAt: Date;
  lastTriggered?: Date;
}

export interface SettingsChange {
  id: string;
  userId: string;
  category: string;
  section: string;
  field: string;
  oldValue: any;
  newValue: any;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
}

export interface SettingsUpdateOptions {
  audit?: boolean;
  validate?: boolean;
  cache?: boolean;
  notify?: boolean;
}

export interface SettingsExportData {
  settings: Partial<UserSettings>;
  metadata: {
    userId: string;
    exportedAt: Date;
    version: string;
    format: 'json' | 'csv' | 'xml';
  };
}

export interface SettingsValidationError {
  field: string;
  message: string;
  code: string;
  value: any;
}

export interface SettingsContext {
  settings: UserSettings;
  isLoading: boolean;
  error: string | null;
  updateSettings: (updates: Partial<UserSettings>, options?: SettingsUpdateOptions) => Promise<UserSettings>;
  resetSettings: (category?: string) => Promise<void>;
  exportSettings: (format?: 'json' | 'csv' | 'xml') => Promise<SettingsExportData>;
  importSettings: (data: SettingsExportData) => Promise<void>;
  getAuditLog: (limit?: number) => Promise<SettingsChange[]>;
  validateSettings: (settings: Partial<UserSettings>) => SettingsValidationError[];
}

export interface SettingsCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  sections: SettingsSection[];
  permissions?: string[];
}

export interface SettingsSection {
  id: string;
  name: string;
  description: string;
  fields: SettingsField[];
}

export interface SettingsField {
  id: string;
  name: string;
  description?: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect' | 'date' | 'time' | 'color' | 'file';
  required?: boolean;
  defaultValue?: any;
  options?: SettingsFieldOption[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: any) => boolean | string;
  };
  dependencies?: {
    field: string;
    value: any;
    condition: 'equals' | 'not_equals' | 'greater_than' | 'less_than';
  }[];
}

export interface SettingsFieldOption {
  value: any;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SettingsTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  fonts: {
    primary: string;
    secondary: string;
    mono: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

export interface NotificationPreferences {
  channels: {
    email: boolean;
    push: boolean;
    sms: boolean;
    desktop: boolean;
  };
  types: {
    newPatient: boolean;
    appointmentReminder: boolean;
    consultationSummary: boolean;
    systemUpdates: boolean;
    securityAlerts: boolean;
    urgentMessages: boolean;
  };
  schedule: {
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
      timezone: string;
    };
    frequency: 'immediate' | 'batched' | 'daily' | 'weekly';
    batchTime?: string;
  };
}

export interface AudioSettings {
  input: {
    deviceId?: string;
    gain: number;
    noiseReduction: boolean;
    echoCancellation: boolean;
    autoGainControl: boolean;
  };
  output: {
    deviceId?: string;
    volume: number;
  };
  transcription: {
    language: string;
    model: string;
    confidence: number;
    punctuation: boolean;
    timestamps: boolean;
    speakerDiarization: boolean;
    customVocabulary: string[];
  };
  recording: {
    quality: 'low' | 'medium' | 'high';
    format: 'mp3' | 'wav' | 'ogg';
    bitrate: number;
    sampleRate: number;
    channels: 'mono' | 'stereo';
    autoStop: {
      enabled: boolean;
      silenceDuration: number;
    };
  };
}

export interface SecuritySettings {
  authentication: {
    password: {
      requireChange: boolean;
      changeInterval: number;
      minLength: number;
      requireSpecialChars: boolean;
      requireNumbers: boolean;
      requireUppercase: boolean;
      preventReuse: number;
    };
    twoFactor: {
      enabled: boolean;
      method: 'sms' | 'email' | 'authenticator';
      backupCodes: string[];
      trustedDevices: TrustedDevice[];
    };
  };
  session: {
    timeout: number;
    maxConcurrentSessions: number;
    requireReauthForSensitive: boolean;
    logoutOnClose: boolean;
  };
  privacy: {
    shareUsageData: boolean;
    shareErrorReports: boolean;
    allowAnalytics: boolean;
    dataRetention: number;
    autoDeleteInactive: boolean;
  };
  audit: {
    enabled: boolean;
    retentionDays: number;
    logLevel: 'basic' | 'detailed' | 'verbose';
    includeIpAddress: boolean;
    includeUserAgent: boolean;
  };
}

export interface IntegrationSettings {
  api: {
    enabled: boolean;
    keys: ApiKey[];
    rateLimit: {
      requests: number;
      window: number;
    };
    cors: {
      enabled: boolean;
      origins: string[];
    };
  };
  webhooks: {
    enabled: boolean;
    endpoints: WebhookEndpoint[];
    retryPolicy: {
      maxRetries: number;
      backoffMultiplier: number;
      maxBackoffTime: number;
    };
    security: {
      requireSignature: boolean;
      algorithm: 'sha256' | 'sha512';
    };
  };
  externalServices: {
    openai: {
      enabled: boolean;
      apiKey?: string;
      model: string;
      maxTokens: number;
      temperature: number;
    };
    anthropic: {
      enabled: boolean;
      apiKey?: string;
      model: string;
      maxTokens: number;
    };
    googleCloud: {
      enabled: boolean;
      projectId?: string;
      keyFile?: string;
      services: string[];
    };
    aws: {
      enabled: boolean;
      accessKeyId?: string;
      secretAccessKey?: string;
      region: string;
      services: string[];
    };
  };
}

// Tipos para validação
export type SettingsValidator<T> = (value: T) => boolean | string;

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: SettingsValidator<any>;
  message?: string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule | ValidationSchema;
}

// Tipos para cache
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface CacheOptions {
  ttl?: number;
  maxSize?: number;
  cleanupInterval?: number;
}

// Tipos para eventos
export interface SettingsEvent {
  type: 'update' | 'reset' | 'export' | 'import' | 'validate';
  userId: string;
  category?: string;
  section?: string;
  field?: string;
  oldValue?: any;
  newValue?: any;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export type SettingsEventHandler = (event: SettingsEvent) => void;

// Tipos para migração
export interface SettingsMigration {
  version: string;
  description: string;
  up: (settings: any) => any;
  down: (settings: any) => any;
}

// Tipos para backup
export interface SettingsBackup {
  id: string;
  userId: string;
  settings: UserSettings;
  createdAt: Date;
  description?: string;
  automatic: boolean;
}

export interface BackupOptions {
  description?: string;
  automatic?: boolean;
  compress?: boolean;
  encrypt?: boolean;
}

// Tipos para sincronização
export interface SyncStatus {
  lastSync: Date;
  status: 'synced' | 'pending' | 'error';
  conflicts: SyncConflict[];
}

export interface SyncConflict {
  field: string;
  localValue: any;
  remoteValue: any;
  timestamp: Date;
}

// Tipos para permissões
export interface PermissionRule {
  resource: string;
  action: 'read' | 'write' | 'delete';
  condition?: (user: any, resource: any) => boolean;
}

export interface RolePermissions {
  role: string;
  permissions: PermissionRule[];
}

// Tipos para auditoria
export interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

export interface AuditLogFilter {
  userId?: string;
  action?: string;
  resource?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

// Tipos para relatórios
export interface SettingsReport {
  id: string;
  title: string;
  description: string;
  data: any;
  generatedAt: Date;
  format: 'json' | 'csv' | 'pdf';
}

export interface ReportOptions {
  format?: 'json' | 'csv' | 'pdf';
  includeAuditLog?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  categories?: string[];
}