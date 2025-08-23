/**
 * Arquivo de configuração de exemplo para o módulo de configurações
 * Doctor Brief AI - Sistema de Configurações
 * 
 * Este arquivo demonstra como configurar as configurações padrão do sistema
 * e como personalizar diferentes aspectos da aplicação.
 */

import { UserSettings, SettingsCategory, SettingsTheme } from './types';

/**
 * Configurações padrão do usuário
 * Estas configurações são aplicadas quando um novo usuário é criado
 */
export const defaultUserSettings: Partial<UserSettings> = {
  version: '1.0.0',
  
  // Configurações de aparência padrão
  appearance: {
    theme: 'system',
    language: 'pt-BR',
    fontSize: 'medium',
    colorScheme: 'default',
    animations: true,
    compactMode: false,
    sidebar: {
      collapsed: false,
      position: 'left'
    },
    dashboard: {
      layout: 'grid',
      widgets: [
        'overview-stats',
        'recent-patients',
        'consultation-trends',
        'upcoming-appointments'
      ],
      density: 'comfortable'
    }
  },
  
  // Configurações de notificações padrão
  notifications: {
    email: {
      enabled: true,
      newPatient: true,
      appointmentReminder: true,
      consultationSummary: true,
      systemUpdates: false,
      securityAlerts: true,
      frequency: 'immediate'
    },
    push: {
      enabled: true,
      newPatient: true,
      appointmentReminder: true,
      urgentMessages: true,
      systemAlerts: true,
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '07:00'
      }
    },
    sound: {
      enabled: true,
      volume: 0.7,
      notificationSound: 'default',
      alertSound: 'urgent'
    },
    desktop: {
      enabled: true,
      position: 'top-right',
      duration: 5000
    }
  },
  
  // Configurações de áudio padrão
  audio: {
    microphone: {
      gain: 0.8,
      noiseReduction: true,
      echoCancellation: true,
      autoGainControl: true
    },
    transcription: {
      language: 'pt-BR',
      model: 'whisper-1',
      confidence: 0.8,
      punctuation: true,
      timestamps: true,
      speakerDiarization: false,
      customVocabulary: [
        'hipertensão',
        'diabetes',
        'cardiovascular',
        'pneumonia',
        'bronquite'
      ]
    },
    recording: {
      quality: 'high',
      format: 'mp3',
      bitrate: 128,
      sampleRate: 44100,
      channels: 'mono',
      autoStop: {
        enabled: true,
        silenceDuration: 3000
      }
    }
  },
  
  // Configurações de segurança padrão
  security: {
    password: {
      requireChange: false,
      changeInterval: 90,
      minLength: 8,
      requireSpecialChars: true,
      requireNumbers: true,
      requireUppercase: true,
      preventReuse: 5
    },
    twoFactor: {
      enabled: false,
      method: 'email',
      backupCodes: [],
      trustedDevices: []
    },
    session: {
      timeout: 3600000, // 1 hora
      maxConcurrentSessions: 3,
      requireReauthForSensitive: true,
      logoutOnClose: false
    },
    privacy: {
      shareUsageData: false,
      shareErrorReports: true,
      allowAnalytics: false,
      dataRetention: 365,
      autoDeleteInactive: true
    }
  },
  
  // Configurações de integrações padrão
  integrations: {
    api: {
      enabled: false,
      keys: [],
      rateLimit: {
        requests: 100,
        window: 3600000 // 1 hora
      }
    },
    webhooks: {
      enabled: false,
      endpoints: [],
      retryPolicy: {
        maxRetries: 3,
        backoffMultiplier: 2,
        maxBackoffTime: 30000
      }
    },
    externalServices: {
      openai: {
        enabled: false,
        model: 'gpt-4',
        maxTokens: 2000
      },
      anthropic: {
        enabled: false,
        model: 'claude-3-sonnet',
        maxTokens: 2000
      },
      googleCloud: {
        enabled: false,
        region: 'us-central1',
        services: []
      },
      aws: {
        enabled: false,
        region: 'us-east-1',
        services: []
      }
    }
  }
};

/**
 * Categorias de configurações disponíveis
 * Define a estrutura de navegação e organização das configurações
 */
export const settingsCategories: SettingsCategory[] = [
  {
    id: 'profile',
    name: 'Perfil',
    description: 'Informações pessoais e profissionais',
    icon: 'user',
    sections: [
      {
        id: 'personal',
        name: 'Informações Pessoais',
        description: 'Nome, foto e dados pessoais',
        fields: [
          {
            id: 'firstName',
            name: 'Nome',
            type: 'text',
            required: true
          },
          {
            id: 'lastName',
            name: 'Sobrenome',
            type: 'text',
            required: true
          },
          {
            id: 'avatar',
            name: 'Foto do Perfil',
            type: 'file'
          }
        ]
      },
      {
        id: 'professional',
        name: 'Informações Profissionais',
        description: 'CRM, especialidade e dados profissionais',
        fields: [
          {
            id: 'crm',
            name: 'CRM',
            type: 'text',
            required: true,
            validation: {
              pattern: '^[0-9]{4,6}$'
            }
          },
          {
            id: 'specialty',
            name: 'Especialidade',
            type: 'select',
            required: true,
            options: [
              { value: 'cardiologia', label: 'Cardiologia' },
              { value: 'dermatologia', label: 'Dermatologia' },
              { value: 'neurologia', label: 'Neurologia' },
              { value: 'pediatria', label: 'Pediatria' },
              { value: 'psiquiatria', label: 'Psiquiatria' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'appearance',
    name: 'Aparência',
    description: 'Tema, idioma e personalização visual',
    icon: 'palette',
    sections: [
      {
        id: 'theme',
        name: 'Tema',
        description: 'Configurações de tema e cores',
        fields: [
          {
            id: 'theme',
            name: 'Tema',
            type: 'select',
            defaultValue: 'system',
            options: [
              { value: 'light', label: 'Claro' },
              { value: 'dark', label: 'Escuro' },
              { value: 'system', label: 'Sistema' }
            ]
          },
          {
            id: 'colorScheme',
            name: 'Esquema de Cores',
            type: 'select',
            defaultValue: 'default',
            options: [
              { value: 'default', label: 'Padrão' },
              { value: 'high-contrast', label: 'Alto Contraste' },
              { value: 'colorblind', label: 'Daltônicos' }
            ]
          }
        ]
      },
      {
        id: 'layout',
        name: 'Layout',
        description: 'Configurações de layout e navegação',
        fields: [
          {
            id: 'compactMode',
            name: 'Modo Compacto',
            type: 'boolean',
            defaultValue: false
          },
          {
            id: 'sidebarPosition',
            name: 'Posição da Barra Lateral',
            type: 'select',
            defaultValue: 'left',
            options: [
              { value: 'left', label: 'Esquerda' },
              { value: 'right', label: 'Direita' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'notifications',
    name: 'Notificações',
    description: 'Configurações de alertas e notificações',
    icon: 'bell',
    sections: [
      {
        id: 'email',
        name: 'Email',
        description: 'Notificações por email',
        fields: [
          {
            id: 'emailEnabled',
            name: 'Ativar Notificações por Email',
            type: 'boolean',
            defaultValue: true
          },
          {
            id: 'emailFrequency',
            name: 'Frequência',
            type: 'select',
            defaultValue: 'immediate',
            options: [
              { value: 'immediate', label: 'Imediato' },
              { value: 'daily', label: 'Diário' },
              { value: 'weekly', label: 'Semanal' }
            ],
            dependencies: [
              {
                field: 'emailEnabled',
                value: true,
                condition: 'equals'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'audio',
    name: 'Áudio',
    description: 'Configurações de gravação e transcrição',
    icon: 'microphone',
    sections: [
      {
        id: 'recording',
        name: 'Gravação',
        description: 'Configurações de gravação de áudio',
        fields: [
          {
            id: 'quality',
            name: 'Qualidade',
            type: 'select',
            defaultValue: 'high',
            options: [
              { value: 'low', label: 'Baixa' },
              { value: 'medium', label: 'Média' },
              { value: 'high', label: 'Alta' }
            ]
          },
          {
            id: 'noiseReduction',
            name: 'Redução de Ruído',
            type: 'boolean',
            defaultValue: true
          }
        ]
      }
    ]
  },
  {
    id: 'security',
    name: 'Segurança',
    description: 'Configurações de segurança e privacidade',
    icon: 'shield',
    sections: [
      {
        id: 'authentication',
        name: 'Autenticação',
        description: 'Configurações de login e senha',
        fields: [
          {
            id: 'twoFactorEnabled',
            name: 'Autenticação de Dois Fatores',
            type: 'boolean',
            defaultValue: false
          },
          {
            id: 'sessionTimeout',
            name: 'Timeout da Sessão (minutos)',
            type: 'number',
            defaultValue: 60,
            validation: {
              min: 5,
              max: 480
            }
          }
        ]
      }
    ]
  },
  {
    id: 'integrations',
    name: 'Integrações',
    description: 'APIs e serviços externos',
    icon: 'link',
    sections: [
      {
        id: 'ai-services',
        name: 'Serviços de IA',
        description: 'Configurações de APIs de IA',
        fields: [
          {
            id: 'openaiEnabled',
            name: 'OpenAI',
            type: 'boolean',
            defaultValue: false
          },
          {
            id: 'anthropicEnabled',
            name: 'Anthropic',
            type: 'boolean',
            defaultValue: false
          }
        ]
      }
    ],
    permissions: ['admin', 'manager']
  }
];

/**
 * Temas disponíveis
 * Define os temas visuais que podem ser aplicados na aplicação
 */
export const availableThemes: SettingsTheme[] = [
  {
    id: 'light',
    name: 'Claro',
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    fonts: {
      primary: 'Inter, sans-serif',
      secondary: 'Inter, sans-serif',
      mono: 'JetBrains Mono, monospace'
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
    }
  },
  {
    id: 'dark',
    name: 'Escuro',
    colors: {
      primary: '#3b82f6',
      secondary: '#94a3b8',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      success: '#22c55e',
      warning: '#eab308',
      error: '#f87171'
    },
    fonts: {
      primary: 'Inter, sans-serif',
      secondary: 'Inter, sans-serif',
      mono: 'JetBrains Mono, monospace'
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.4)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.4)'
    }
  }
];

/**
 * Configurações do sistema
 * Configurações globais que afetam todo o sistema
 */
export const systemConfig = {
  // Configurações de cache
  cache: {
    ttl: 300000, // 5 minutos
    maxSize: 100,
    cleanupInterval: 60000 // 1 minuto
  },
  
  // Configurações de validação
  validation: {
    debounceTime: 300,
    showErrorsOnBlur: true,
    showErrorsOnSubmit: true
  },
  
  // Configurações de auditoria
  audit: {
    enabled: true,
    retentionDays: 90,
    logLevel: 'detailed',
    includeIpAddress: true,
    includeUserAgent: true
  },
  
  // Configurações de backup
  backup: {
    enabled: true,
    interval: 86400000, // 24 horas
    maxBackups: 30,
    compress: true,
    encrypt: true
  },
  
  // Configurações de sincronização
  sync: {
    enabled: true,
    interval: 30000, // 30 segundos
    retryAttempts: 3,
    retryDelay: 5000
  },
  
  // Configurações de performance
  performance: {
    lazyLoadThreshold: 100,
    virtualScrollThreshold: 1000,
    debounceSearchTime: 300
  },
  
  // Configurações de segurança
  security: {
    maxLoginAttempts: 5,
    lockoutDuration: 900000, // 15 minutos
    passwordMinLength: 8,
    sessionTimeout: 3600000, // 1 hora
    requireHttps: true
  },
  
  // Configurações de notificações
  notifications: {
    maxVisible: 5,
    defaultDuration: 5000,
    position: 'top-right',
    enableSound: true
  },
  
  // Configurações de upload
  upload: {
    maxFileSize: 10485760, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    maxFiles: 10
  },
  
  // Configurações de API
  api: {
    timeout: 30000, // 30 segundos
    retryAttempts: 3,
    retryDelay: 1000,
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
  }
};

/**
 * Configurações de desenvolvimento
 * Configurações específicas para ambiente de desenvolvimento
 */
export const developmentConfig = {
  debug: {
    enabled: true,
    logLevel: 'verbose',
    showPerformanceMetrics: true,
    enableDevTools: true
  },
  
  mock: {
    enabled: false,
    delay: 1000,
    errorRate: 0.1
  },
  
  testing: {
    enabled: true,
    coverage: {
      threshold: 80,
      includeUntested: true
    }
  }
};

/**
 * Configurações de produção
 * Configurações específicas para ambiente de produção
 */
export const productionConfig = {
  debug: {
    enabled: false,
    logLevel: 'error',
    showPerformanceMetrics: false,
    enableDevTools: false
  },
  
  monitoring: {
    enabled: true,
    errorReporting: true,
    performanceTracking: true,
    userAnalytics: false
  },
  
  optimization: {
    minifyCode: true,
    compressAssets: true,
    enableCaching: true,
    lazyLoading: true
  }
};

/**
 * Função para obter configurações baseadas no ambiente
 */
export function getEnvironmentConfig() {
  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    ...systemConfig,
    ...(isDevelopment && developmentConfig),
    ...(isProduction && productionConfig)
  };
}

/**
 * Função para validar configurações
 */
export function validateSettings(settings: Partial<UserSettings>): boolean {
  // Implementar validação básica
  if (settings.profile?.personalInfo?.firstName && 
      settings.profile?.personalInfo?.firstName.length < 2) {
    return false;
  }
  
  if (settings.profile?.professionalInfo?.crm && 
      !/^[0-9]{4,6}$/.test(settings.profile.professionalInfo.crm)) {
    return false;
  }
  
  return true;
}

/**
 * Função para mesclar configurações
 */
export function mergeSettings(
  defaultSettings: Partial<UserSettings>,
  userSettings: Partial<UserSettings>
): UserSettings {
  // Implementar merge profundo das configurações
  return {
    ...defaultSettings,
    ...userSettings,
    // Merge específico para objetos aninhados
    appearance: {
      ...defaultSettings.appearance,
      ...userSettings.appearance
    },
    notifications: {
      ...defaultSettings.notifications,
      ...userSettings.notifications
    },
    audio: {
      ...defaultSettings.audio,
      ...userSettings.audio
    },
    security: {
      ...defaultSettings.security,
      ...userSettings.security
    },
    integrations: {
      ...defaultSettings.integrations,
      ...userSettings.integrations
    }
  } as UserSettings;
}