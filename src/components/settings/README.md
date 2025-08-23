# Módulo de Configurações

Este módulo é responsável pelo gerenciamento de configurações do sistema, preferências do usuário, personalização da interface e administração de configurações globais do Doctor Brief AI.

## Visão Geral

O módulo de configurações oferece:
- Configurações de perfil e conta do usuário
- Preferências de interface e tema
- Configurações de notificações
- Configurações de áudio e transcrição
- Configurações de segurança e privacidade
- Configurações de integração (APIs, webhooks)
- Configurações administrativas do sistema
- Backup e restauração de configurações
- Auditoria de mudanças de configuração

## Arquitetura de Componentes

### Estrutura Hierárquica
```
Settings
├── SettingsLayout (layout principal)
├── ProfileSettings (configurações de perfil)
│   ├── PersonalInfo (informações pessoais)
│   ├── ProfessionalInfo (informações profissionais)
│   ├── ContactInfo (informações de contato)
│   └── Avatar (foto de perfil)
├── AppearanceSettings (aparência)
│   ├── ThemeSelector (seletor de tema)
│   ├── LanguageSelector (seletor de idioma)
│   ├── FontSettings (configurações de fonte)
│   └── LayoutPreferences (preferências de layout)
├── NotificationSettings (notificações)
│   ├── EmailNotifications (notificações por email)
│   ├── PushNotifications (notificações push)
│   ├── SoundSettings (configurações de som)
│   └── NotificationSchedule (horários de notificação)
├── AudioSettings (configurações de áudio)
│   ├── MicrophoneSettings (configurações de microfone)
│   ├── TranscriptionSettings (configurações de transcrição)
│   ├── AudioQuality (qualidade de áudio)
│   └── NoiseReduction (redução de ruído)
├── SecuritySettings (segurança)
│   ├── PasswordSettings (configurações de senha)
│   ├── TwoFactorAuth (autenticação de dois fatores)
│   ├── SessionManagement (gerenciamento de sessões)
│   ├── DataPrivacy (privacidade de dados)
│   └── AuditLog (log de auditoria)
├── IntegrationSettings (integrações)
│   ├── APISettings (configurações de API)
│   ├── WebhookSettings (configurações de webhook)
│   ├── ExternalServices (serviços externos)
│   └── SyncSettings (configurações de sincronização)
├── SystemSettings (configurações do sistema)
│   ├── DatabaseSettings (configurações de banco)
│   ├── BackupSettings (configurações de backup)
│   ├── MaintenanceMode (modo de manutenção)
│   └── SystemLogs (logs do sistema)
└── SettingsExport (exportação/importação)
    ├── ExportSettings (exportar configurações)
    ├── ImportSettings (importar configurações)
    └── ResetSettings (resetar configurações)
```

## Interfaces de Dados

### UserSettings Interface
```typescript
interface UserSettings {
  // Identificação
  id: string;
  userId: string;
  version: string;
  
  // Metadados
  createdAt: Date;
  updatedAt: Date;
  lastSyncAt?: Date;
  
  // Configurações de Perfil
  profile: {
    personalInfo: {
      firstName: string;
      lastName: string;
      displayName: string;
      bio?: string;
      birthDate?: Date;
      gender?: 'M' | 'F' | 'O' | 'N';
      avatar?: string;
    };
    
    professionalInfo: {
      title: string;
      crm: string;
      specialty: string;
      subspecialty?: string;
      institution?: string;
      licenseNumber?: string;
      licenseExpiry?: Date;
      certifications?: string[];
    };
    
    contactInfo: {
      email: string;
      phone: string;
      alternativePhone?: string;
      address: {
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
      };
      emergencyContact?: {
        name: string;
        relationship: string;
        phone: string;
      };
    };
  };
  
  // Configurações de Aparência
  appearance: {
    theme: 'light' | 'dark' | 'system';
    primaryColor: string;
    accentColor: string;
    language: string;
    timezone: string;
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
    timeFormat: '12h' | '24h';
    currency: string;
    
    font: {
      family: string;
      size: 'small' | 'medium' | 'large' | 'extra-large';
      weight: 'normal' | 'medium' | 'bold';
    };
    
    layout: {
      sidebarCollapsed: boolean;
      compactMode: boolean;
      showAvatars: boolean;
      animationsEnabled: boolean;
      reducedMotion: boolean;
    };
  };
  
  // Configurações de Notificações
  notifications: {
    email: {
      enabled: boolean;
      newPatient: boolean;
      appointmentReminder: boolean;
      consultationSummary: boolean;
      systemUpdates: boolean;
      securityAlerts: boolean;
      marketingEmails: boolean;
      frequency: 'immediate' | 'daily' | 'weekly';
    };
    
    push: {
      enabled: boolean;
      newMessage: boolean;
      appointmentReminder: boolean;
      emergencyAlerts: boolean;
      systemNotifications: boolean;
      quietHours: {
        enabled: boolean;
        startTime: string; // HH:mm
        endTime: string; // HH:mm
        timezone: string;
      };
    };
    
    sound: {
      enabled: boolean;
      volume: number; // 0-100
      notificationSound: string;
      alertSound: string;
      muteWhenBusy: boolean;
    };
  };
  
  // Configurações de Áudio
  audio: {
    microphone: {
      deviceId?: string;
      gain: number; // 0-100
      noiseReduction: boolean;
      echoCancellation: boolean;
      autoGainControl: boolean;
    };
    
    transcription: {
      language: string;
      model: 'whisper-1' | 'whisper-large' | 'custom';
      confidence: number; // 0-1
      punctuation: boolean;
      timestamps: boolean;
      speakerDiarization: boolean;
      customVocabulary: string[];
    };
    
    recording: {
      quality: 'low' | 'medium' | 'high' | 'lossless';
      format: 'mp3' | 'wav' | 'flac';
      bitrate: number;
      sampleRate: number;
      channels: 'mono' | 'stereo';
      autoStop: {
        enabled: boolean;
        silenceDuration: number; // seconds
      };
    };
  };
  
  // Configurações de Segurança
  security: {
    password: {
      requireChange: boolean;
      changeInterval: number; // days
      minLength: number;
      requireSpecialChars: boolean;
      requireNumbers: boolean;
      requireUppercase: boolean;
      preventReuse: number; // last N passwords
    };
    
    twoFactor: {
      enabled: boolean;
      method: 'sms' | 'email' | 'authenticator';
      backupCodes: string[];
      trustedDevices: {
        id: string;
        name: string;
        lastUsed: Date;
        ipAddress: string;
      }[];
    };
    
    session: {
      timeout: number; // minutes
      maxConcurrentSessions: number;
      requireReauthForSensitive: boolean;
      logoutOnClose: boolean;
    };
    
    privacy: {
      shareUsageData: boolean;
      shareErrorReports: boolean;
      allowAnalytics: boolean;
      dataRetention: number; // days
      autoDeleteInactive: boolean;
    };
  };
  
  // Configurações de Integração
  integrations: {
    api: {
      enabled: boolean;
      keys: {
        id: string;
        name: string;
        key: string;
        permissions: string[];
        lastUsed?: Date;
        expiresAt?: Date;
      }[];
      rateLimit: {
        requests: number;
        window: number; // seconds
      };
    };
    
    webhooks: {
      enabled: boolean;
      endpoints: {
        id: string;
        url: string;
        events: string[];
        secret: string;
        active: boolean;
        lastTriggered?: Date;
      }[];
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
  
  // Configurações do Sistema (apenas admin)
  system?: {
    database: {
      connectionPoolSize: number;
      queryTimeout: number;
      enableQueryLogging: boolean;
      backupSchedule: string; // cron expression
    };
    
    performance: {
      cacheEnabled: boolean;
      cacheTTL: number; // seconds
      compressionEnabled: boolean;
      cdnEnabled: boolean;
    };
    
    maintenance: {
      enabled: boolean;
      message: string;
      allowedUsers: string[];
      scheduledStart?: Date;
      scheduledEnd?: Date;
    };
    
    monitoring: {
      errorTracking: boolean;
      performanceMonitoring: boolean;
      logLevel: 'debug' | 'info' | 'warn' | 'error';
      metricsRetention: number; // days
    };
  };
}
```

### SettingsCategory Interface
```typescript
interface SettingsCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  sections: SettingsSection[];
  permissions?: string[];
  adminOnly?: boolean;
}

interface SettingsSection {
  id: string;
  name: string;
  description?: string;
  fields: SettingsField[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

interface SettingsField {
  id: string;
  name: string;
  description?: string;
  type: SettingsFieldType;
  value: any;
  defaultValue: any;
  required?: boolean;
  disabled?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: any) => boolean | string;
  };
  options?: {
    label: string;
    value: any;
    disabled?: boolean;
  }[];
  dependencies?: {
    field: string;
    value: any;
    condition: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  }[];
}

type SettingsFieldType = 
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'boolean'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'textarea'
  | 'date'
  | 'time'
  | 'datetime'
  | 'color'
  | 'file'
  | 'image'
  | 'slider'
  | 'toggle'
  | 'json'
  | 'custom';
```

### SettingsChange Interface
```typescript
interface SettingsChange {
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
  reason?: string;
}
```

## Componentes Principais

### SettingsLayout.tsx
**Propósito**: Layout principal das configurações com navegação lateral.

**Funcionalidades**:
- ✅ Navegação por categorias
- ✅ Busca de configurações
- ✅ Breadcrumb navigation
- ✅ Indicadores de mudanças não salvas
- ✅ Ações globais (salvar, resetar, exportar)

**Implementação**:
```tsx
const SettingsLayout: React.FC<SettingsLayoutProps> = ({
  children,
  currentCategory,
  onCategoryChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();
  const { settings, updateSettings, saveSettings, resetSettings } = useSettings();
  
  const categories = useMemo(() => {
    const allCategories = [
      {
        id: 'profile',
        name: 'Perfil',
        description: 'Informações pessoais e profissionais',
        icon: 'User',
        order: 1
      },
      {
        id: 'appearance',
        name: 'Aparência',
        description: 'Tema, idioma e personalização',
        icon: 'Palette',
        order: 2
      },
      {
        id: 'notifications',
        name: 'Notificações',
        description: 'Configurações de alertas e notificações',
        icon: 'Bell',
        order: 3
      },
      {
        id: 'audio',
        name: 'Áudio',
        description: 'Microfone, transcrição e gravação',
        icon: 'Mic',
        order: 4
      },
      {
        id: 'security',
        name: 'Segurança',
        description: 'Senha, autenticação e privacidade',
        icon: 'Shield',
        order: 5
      },
      {
        id: 'integrations',
        name: 'Integrações',
        description: 'APIs, webhooks e serviços externos',
        icon: 'Plug',
        order: 6
      }
    ];
    
    // Adicionar configurações do sistema apenas para admins
    if (user?.role === 'admin') {
      allCategories.push({
        id: 'system',
        name: 'Sistema',
        description: 'Configurações administrativas',
        icon: 'Settings',
        order: 7
      });
    }
    
    return allCategories.sort((a, b) => a.order - b.order);
  }, [user?.role]);
  
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    
    return categories.filter(category => 
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);
  
  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    try {
      await saveSettings();
      setHasUnsavedChanges(false);
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResetSettings = async () => {
    const confirmed = await showConfirmDialog({
      title: 'Resetar Configurações',
      message: 'Tem certeza que deseja resetar todas as configurações para os valores padrão? Esta ação não pode ser desfeita.',
      confirmText: 'Resetar',
      cancelText: 'Cancelar',
      variant: 'destructive'
    });
    
    if (!confirmed) return;
    
    setIsLoading(true);
    
    try {
      await resetSettings();
      setHasUnsavedChanges(false);
      toast.success('Configurações resetadas com sucesso!');
    } catch (error) {
      console.error('Erro ao resetar configurações:', error);
      toast.error('Erro ao resetar configurações');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExportSettings = async () => {
    try {
      const exportData = await settingsService.exportSettings(user!.id);
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `configuracoes-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Configurações exportadas com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar configurações:', error);
      toast.error('Erro ao exportar configurações');
    }
  };
  
  // Detectar mudanças não salvas
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'Você tem alterações não salvas. Deseja sair mesmo assim?';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);
  
  return (
    <div className="settings-layout">
      <div className="settings-header">
        <div className="header-content">
          <div className="title-section">
            <h1>Configurações</h1>
            <p>Gerencie suas preferências e configurações do sistema</p>
          </div>
          
          <div className="header-actions">
            {hasUnsavedChanges && (
              <div className="unsaved-indicator">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-yellow-600">Alterações não salvas</span>
              </div>
            )}
            
            <div className="action-buttons">
              <Button
                variant="outline"
                onClick={handleExportSettings}
                disabled={isLoading}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              
              <Button
                variant="outline"
                onClick={handleResetSettings}
                disabled={isLoading}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Resetar
              </Button>
              
              <Button
                onClick={handleSaveSettings}
                disabled={isLoading || !hasUnsavedChanges}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Salvar
              </Button>
            </div>
          </div>
        </div>
        
        <div className="search-section">
          <div className="search-input">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar configurações..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      
      <div className="settings-content">
        <div className="settings-sidebar">
          <nav className="settings-nav">
            {filteredCategories.map((category) => {
              const Icon = getIcon(category.icon);
              
              return (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`nav-item ${
                    currentCategory === category.id ? 'active' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <div className="nav-content">
                    <span className="nav-title">{category.name}</span>
                    <span className="nav-description">{category.description}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="settings-main">
          <div className="settings-breadcrumb">
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Início</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/settings">Configurações</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {categories.find(c => c.id === currentCategory)?.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
          
          <div className="settings-content-area">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
```

### ProfileSettings.tsx
**Propósito**: Configurações de perfil pessoal e profissional.

**Funcionalidades**:
- ✅ Edição de informações pessoais
- ✅ Upload de avatar
- ✅ Informações profissionais (CRM, especialidade)
- ✅ Validação de dados médicos
- ✅ Histórico de alterações

```tsx
const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const { settings, updateSettings } = useSettings();
  const [isUploading, setIsUploading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  
  const profileForm = useForm<UserSettings['profile']>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: settings?.profile || {
      personalInfo: {
        firstName: '',
        lastName: '',
        displayName: '',
        bio: '',
        birthDate: undefined,
        gender: undefined,
        avatar: undefined
      },
      professionalInfo: {
        title: '',
        crm: '',
        specialty: '',
        subspecialty: '',
        institution: '',
        licenseNumber: '',
        licenseExpiry: undefined,
        certifications: []
      },
      contactInfo: {
        email: user?.email || '',
        phone: '',
        alternativePhone: '',
        address: {
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'Brasil'
        },
        emergencyContact: {
          name: '',
          relationship: '',
          phone: ''
        }
      }
    }
  });
  
  const handleAvatarUpload = async (file: File) => {
    if (!file) return;
    
    // Validar arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error('A imagem deve ter no máximo 5MB');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Redimensionar imagem
      const resizedFile = await resizeImage(file, 300, 300);
      
      // Upload para Supabase Storage
      const fileName = `avatars/${user!.id}/${Date.now()}.jpg`;
      const { data, error } = await supabase.storage
        .from('profiles')
        .upload(fileName, resizedFile, {
          contentType: 'image/jpeg',
          upsert: true
        });
      
      if (error) throw error;
      
      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(fileName);
      
      const avatarUrl = urlData.publicUrl;
      
      // Atualizar formulário
      profileForm.setValue('personalInfo.avatar', avatarUrl);
      setPreviewAvatar(avatarUrl);
      
      toast.success('Avatar atualizado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error);
      toast.error('Erro ao fazer upload do avatar');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleCrmValidation = async (crm: string) => {
    if (!crm) return;
    
    try {
      // Validar formato do CRM
      const crmRegex = /^\d{4,6}\/[A-Z]{2}$/;
      if (!crmRegex.test(crm)) {
        profileForm.setError('professionalInfo.crm', {
          message: 'Formato inválido. Use: 123456/UF'
        });
        return;
      }
      
      // Validar CRM na API do CFM (se disponível)
      const isValid = await validateCrmWithCfm(crm);
      if (!isValid) {
        profileForm.setError('professionalInfo.crm', {
          message: 'CRM não encontrado no sistema do CFM'
        });
        return;
      }
      
      profileForm.clearErrors('professionalInfo.crm');
      
    } catch (error) {
      console.error('Erro ao validar CRM:', error);
      // Não bloquear o usuário se a validação falhar
    }
  };
  
  const handleCepLookup = async (cep: string) => {
    if (!cep || cep.length !== 8) return;
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        toast.error('CEP não encontrado');
        return;
      }
      
      // Preencher campos automaticamente
      profileForm.setValue('contactInfo.address.street', data.logradouro);
      profileForm.setValue('contactInfo.address.neighborhood', data.bairro);
      profileForm.setValue('contactInfo.address.city', data.localidade);
      profileForm.setValue('contactInfo.address.state', data.uf);
      
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      toast.error('Erro ao buscar informações do CEP');
    }
  };
  
  const onSubmit = async (data: UserSettings['profile']) => {
    try {
      await updateSettings({
        profile: data
      });
      
      toast.success('Perfil atualizado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil');
    }
  };
  
  return (
    <div className="profile-settings">
      <div className="settings-header">
        <h2>Configurações de Perfil</h2>
        <p>Gerencie suas informações pessoais e profissionais</p>
      </div>
      
      <Form {...profileForm}>
        <form onSubmit={profileForm.handleSubmit(onSubmit)} className="space-y-8">
          {/* Avatar */}
          <Card>
            <CardHeader>
              <CardTitle>Foto de Perfil</CardTitle>
              <CardDescription>
                Sua foto será exibida em relatórios e documentos médicos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="avatar-upload">
                <div className="avatar-preview">
                  <Avatar className="w-24 h-24">
                    <AvatarImage 
                      src={previewAvatar || profileForm.watch('personalInfo.avatar')} 
                      alt="Avatar" 
                    />
                    <AvatarFallback>
                      {profileForm.watch('personalInfo.firstName')?.[0]}
                      {profileForm.watch('personalInfo.lastName')?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="avatar-actions">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAvatarUpload(file);
                    }}
                    className="hidden"
                    id="avatar-upload"
                  />
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    Alterar Foto
                  </Button>
                  
                  {profileForm.watch('personalInfo.avatar') && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        profileForm.setValue('personalInfo.avatar', undefined);
                        setPreviewAvatar(null);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remover
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={profileForm.control}
                  name="personalInfo.firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome *</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="personalInfo.lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sobrenome *</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu sobrenome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={profileForm.control}
                name="personalInfo.displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome de Exibição</FormLabel>
                    <FormControl>
                      <Input placeholder="Como você gostaria de ser chamado" {...field} />
                    </FormControl>
                    <FormDescription>
                      Este nome será usado em saudações e comunicações
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={profileForm.control}
                name="personalInfo.bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biografia</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Conte um pouco sobre você..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={profileForm.control}
                  name="personalInfo.birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field}
                          value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                          onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : undefined;
                            field.onChange(date);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="personalInfo.gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gênero</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="M">Masculino</SelectItem>
                          <SelectItem value="F">Feminino</SelectItem>
                          <SelectItem value="O">Outro</SelectItem>
                          <SelectItem value="N">Prefiro não informar</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Informações Profissionais */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Profissionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={profileForm.control}
                  name="professionalInfo.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Dr.">Dr.</SelectItem>
                          <SelectItem value="Dra.">Dra.</SelectItem>
                          <SelectItem value="Prof. Dr.">Prof. Dr.</SelectItem>
                          <SelectItem value="Prof. Dra.">Prof. Dra.</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="professionalInfo.crm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CRM *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="123456/SP"
                          {...field}
                          onBlur={(e) => {
                            field.onBlur();
                            handleCrmValidation(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Formato: número/UF (ex: 123456/SP)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={profileForm.control}
                  name="professionalInfo.specialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Especialidade *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Cardiologia" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="professionalInfo.subspecialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subespecialidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Cardiologia Intervencionista" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={profileForm.control}
                name="professionalInfo.institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instituição</FormLabel>
                    <FormControl>
                      <Input placeholder="Hospital ou clínica onde atua" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          {/* Informações de Contato */}
          <Card>
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={profileForm.control}
                  name="contactInfo.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="seu@email.com" {...field} disabled />
                      </FormControl>
                      <FormDescription>
                        Para alterar o email, use as configurações de segurança
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="contactInfo.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="(11) 99999-9999"
                          {...field}
                          onChange={(e) => {
                            const formatted = formatPhoneNumber(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={profileForm.control}
                name="contactInfo.alternativePhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone Alternativo</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="(11) 99999-9999"
                        {...field}
                        onChange={(e) => {
                          const formatted = formatPhoneNumber(e.target.value);
                          field.onChange(formatted);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Endereço */}
              <div className="space-y-4">
                <h4 className="font-medium">Endereço</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="contactInfo.address.zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="00000-000"
                            {...field}
                            onChange={(e) => {
                              const formatted = formatCep(e.target.value);
                              field.onChange(formatted);
                            }}
                            onBlur={(e) => {
                              field.onBlur();
                              const cep = e.target.value.replace(/\D/g, '');
                              if (cep.length === 8) {
                                handleCepLookup(cep);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="md:col-span-2">
                    <FormField
                      control={profileForm.control}
                      name="contactInfo.address.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rua</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da rua" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="contactInfo.address.number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="md:col-span-2">
                    <FormField
                      control={profileForm.control}
                      name="contactInfo.address.complement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Complemento</FormLabel>
                          <FormControl>
                            <Input placeholder="Apto, sala, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="contactInfo.address.neighborhood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do bairro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="contactInfo.address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da cidade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="contactInfo.address.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BRAZILIAN_STATES.map((state) => (
                              <SelectItem key={state.value} value={state.value}>
                                {state.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="contactInfo.address.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>País</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => profileForm.reset()}
            >
              Cancelar
            </Button>
            
            <Button type="submit">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
```

## Serviços e Integrações

### SettingsService
**Localização**: `src/services/settingsService.ts`

**Funcionalidades Principais**:

```typescript
class SettingsService {
  private cache = new Map<string, UserSettings>();
  private syncQueue: SettingsChange[] = [];
  
  /**
   * Carrega configurações do usuário
   */
  async getUserSettings(userId: string): Promise<UserSettings> {
    try {
      // Verificar cache primeiro
      const cached = this.cache.get(userId);
      if (cached && this.isCacheValid(cached)) {
        return cached;
      }
      
      // Buscar no banco de dados
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      let settings: UserSettings;
      
      if (!data) {
        // Criar configurações padrão
        settings = await this.createDefaultSettings(userId);
      } else {
        settings = data.settings;
      }
      
      // Atualizar cache
      this.cache.set(userId, settings);
      
      return settings;
      
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      throw error;
    }
  }
  
  /**
   * Atualiza configurações do usuário
   */
  async updateUserSettings(
    userId: string, 
    updates: Partial<UserSettings>,
    options: {
      sync?: boolean;
      validate?: boolean;
      audit?: boolean;
    } = {}
  ): Promise<UserSettings> {
    try {
      const currentSettings = await this.getUserSettings(userId);
      
      // Validar mudanças se solicitado
      if (options.validate) {
        await this.validateSettings(updates);
      }
      
      // Mesclar configurações
      const newSettings: UserSettings = {
        ...currentSettings,
        ...updates,
        updatedAt: new Date(),
        version: this.incrementVersion(currentSettings.version)
      };
      
      // Salvar no banco de dados
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: userId,
          settings: newSettings,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      // Atualizar cache
      this.cache.set(userId, newSettings);
      
      // Registrar mudanças para auditoria
      if (options.audit !== false) {
        await this.auditSettingsChanges(userId, currentSettings, newSettings);
      }
      
      // Sincronizar com outros dispositivos se solicitado
      if (options.sync !== false) {
        await this.syncSettingsAcrossDevices(userId, newSettings);
      }
      
      return newSettings;
      
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      throw error;
    }
  }
  
  /**
   * Exporta configurações do usuário
   */
  async exportSettings(userId: string): Promise<{
    settings: UserSettings;
    metadata: {
      exportedAt: Date;
      version: string;
      userId: string;
    };
  }> {
    try {
      const settings = await this.getUserSettings(userId);
      
      // Remover dados sensíveis
      const sanitizedSettings = this.sanitizeSettingsForExport(settings);
      
      return {
        settings: sanitizedSettings,
        metadata: {
          exportedAt: new Date(),
          version: settings.version,
          userId
        }
      };
      
    } catch (error) {
      console.error('Erro ao exportar configurações:', error);
      throw error;
    }
  }
  
  /**
   * Importa configurações do usuário
   */
  async importSettings(
    userId: string, 
    importData: {
      settings: Partial<UserSettings>;
      metadata: any;
    },
    options: {
      merge?: boolean;
      validate?: boolean;
    } = {}
  ): Promise<UserSettings> {
    try {
      // Validar dados de importação
      if (options.validate !== false) {
        await this.validateImportData(importData);
      }
      
      let settingsToImport = importData.settings;
      
      // Mesclar com configurações existentes se solicitado
      if (options.merge) {
        const currentSettings = await this.getUserSettings(userId);
        settingsToImport = {
          ...currentSettings,
          ...settingsToImport
        };
      }
      
      // Atualizar configurações
      return await this.updateUserSettings(userId, settingsToImport, {
        validate: true,
        audit: true
      });
      
    } catch (error) {
      console.error('Erro ao importar configurações:', error);
      throw error;
    }
  }
  
  /**
   * Reseta configurações para padrão
   */
  async resetSettings(userId: string, categories?: string[]): Promise<UserSettings> {
    try {
      const defaultSettings = await this.createDefaultSettings(userId);
      
      if (categories && categories.length > 0) {
        // Resetar apenas categorias específicas
        const currentSettings = await this.getUserSettings(userId);
        const resetSettings = { ...currentSettings };
        
        categories.forEach(category => {
          if (defaultSettings[category as keyof UserSettings]) {
            (resetSettings as any)[category] = defaultSettings[category as keyof UserSettings];
          }
        });
        
        return await this.updateUserSettings(userId, resetSettings);
      } else {
        // Resetar todas as configurações
        return await this.updateUserSettings(userId, defaultSettings);
      }
      
    } catch (error) {
      console.error('Erro ao resetar configurações:', error);
      throw error;
    }
  }
  
  /**
   * Valida configurações
   */
  private async validateSettings(settings: Partial<UserSettings>): Promise<void> {
    // Validar estrutura básica
    if (settings.profile) {
      await this.validateProfileSettings(settings.profile);
    }
    
    if (settings.security) {
      await this.validateSecuritySettings(settings.security);
    }
    
    if (settings.integrations) {
      await this.validateIntegrationSettings(settings.integrations);
    }
  }
  
  /**
   * Cria configurações padrão
   */
  private async createDefaultSettings(userId: string): Promise<UserSettings> {
    const user = await this.getUserInfo(userId);
    
    return {
      id: generateId(),
      userId,
      version: '1.0.0',
      createdAt: new Date(),
      updatedAt: new Date(),
      
      profile: {
        personalInfo: {
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          displayName: user?.displayName || '',
          bio: '',
          birthDate: undefined,
          gender: undefined,
          avatar: undefined
        },
        professionalInfo: {
          title: 'Dr.',
          crm: '',
          specialty: '',
          subspecialty: '',
          institution: '',
          licenseNumber: '',
          licenseExpiry: undefined,
          certifications: []
        },
        contactInfo: {
          email: user?.email || '',
          phone: '',
          alternativePhone: '',
          address: {
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'Brasil'
          },
          emergencyContact: {
            name: '',
            relationship: '',
            phone: ''
          }
        }
      },
      
      appearance: {
        theme: 'system',
        primaryColor: '#0066cc',
        accentColor: '#00cc66',
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        currency: 'BRL',
        font: {
          family: 'Inter',
          size: 'medium',
          weight: 'normal'
        },
        layout: {
          sidebarCollapsed: false,
          compactMode: false,
          showAvatars: true,
          animationsEnabled: true,
          reducedMotion: false
        }
      },
      
      notifications: {
        email: {
          enabled: true,
          newPatient: true,
          appointmentReminder: true,
          consultationSummary: true,
          systemUpdates: true,
          securityAlerts: true,
          marketingEmails: false,
          frequency: 'immediate'
        },
        push: {
          enabled: true,
          newMessage: true,
          appointmentReminder: true,
          emergencyAlerts: true,
          systemNotifications: true,
          quietHours: {
            enabled: false,
            startTime: '22:00',
            endTime: '08:00',
            timezone: 'America/Sao_Paulo'
          }
        },
        sound: {
          enabled: true,
          volume: 70,
          notificationSound: 'default',
          alertSound: 'urgent',
          muteWhenBusy: true
        }
      },
      
      audio: {
        microphone: {
          deviceId: undefined,
          gain: 80,
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
          customVocabulary: []
        },
        recording: {
          quality: 'high',
          format: 'mp3',
          bitrate: 128,
          sampleRate: 44100,
          channels: 'mono',
          autoStop: {
            enabled: true,
            silenceDuration: 3
          }
        }
      },
      
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
          method: 'authenticator',
          backupCodes: [],
          trustedDevices: []
        },
        session: {
          timeout: 480, // 8 horas
          maxConcurrentSessions: 3,
          requireReauthForSensitive: true,
          logoutOnClose: false
        },
        privacy: {
          shareUsageData: false,
          shareErrorReports: true,
          allowAnalytics: false,
          dataRetention: 2555, // 7 anos
          autoDeleteInactive: true
        }
      },
      
      integrations: {
        api: {
          enabled: false,
          keys: [],
          rateLimit: {
            requests: 1000,
            window: 3600
          }
        },
        webhooks: {
          enabled: false,
          endpoints: [],
          retryPolicy: {
            maxRetries: 3,
            backoffMultiplier: 2,
            maxBackoffTime: 300
          }
        },
        externalServices: {
          openai: {
            enabled: false,
            apiKey: undefined,
            model: 'gpt-4',
            maxTokens: 4000
          },
          anthropic: {
            enabled: false,
            apiKey: undefined,
            model: 'claude-3-sonnet',
            maxTokens: 4000
          },
          googleCloud: {
            enabled: false,
            projectId: undefined,
            keyFile: undefined,
            services: []
          },
          aws: {
            enabled: false,
            accessKeyId: undefined,
            secretAccessKey: undefined,
            region: 'us-east-1',
            services: []
          }
        }
      }
    };
  }
  
  /**
   * Registra mudanças para auditoria
   */
  private async auditSettingsChanges(
    userId: string,
    oldSettings: UserSettings,
    newSettings: UserSettings
  ): Promise<void> {
    try {
      const changes = this.detectChanges(oldSettings, newSettings);
      
      if (changes.length === 0) return;
      
      const { error } = await supabase
        .from('settings_audit_log')
        .insert(
          changes.map(change => ({
            user_id: userId,
            category: change.category,
            section: change.section,
            field: change.field,
            old_value: change.oldValue,
            new_value: change.newValue,
            timestamp: new Date().toISOString(),
            ip_address: await this.getCurrentIpAddress(),
            user_agent: navigator.userAgent
          }))
        );
      
      if (error) {
        console.error('Erro ao registrar auditoria:', error);
      }
      
    } catch (error) {
      console.error('Erro ao auditar mudanças:', error);
    }
  }
  
  /**
   * Detecta mudanças entre configurações
   */
  private detectChanges(
    oldSettings: UserSettings,
    newSettings: UserSettings
  ): SettingsChange[] {
    const changes: SettingsChange[] = [];
    
    // Comparar recursivamente todas as propriedades
    this.compareObjects('', oldSettings, newSettings, changes);
    
    return changes;
  }
  
  /**
   * Compara objetos recursivamente
   */
  private compareObjects(
    path: string,
    oldObj: any,
    newObj: any,
    changes: SettingsChange[]
  ): void {
    const allKeys = new Set([...Object.keys(oldObj || {}), ...Object.keys(newObj || {})]);
    
    allKeys.forEach(key => {
      const currentPath = path ? `${path}.${key}` : key;
      const oldValue = oldObj?.[key];
      const newValue = newObj?.[key];
      
      if (typeof oldValue === 'object' && typeof newValue === 'object' && 
          oldValue !== null && newValue !== null && 
          !Array.isArray(oldValue) && !Array.isArray(newValue)) {
        // Comparar objetos aninhados
        this.compareObjects(currentPath, oldValue, newValue, changes);
      } else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        // Valor mudou
        const pathParts = currentPath.split('.');
        changes.push({
          id: generateId(),
          userId: newObj.userId,
          category: pathParts[0] || 'unknown',
          section: pathParts[1] || 'unknown',
          field: pathParts.slice(2).join('.') || key,
          oldValue,
          newValue,
          timestamp: new Date(),
          ipAddress: '',
          userAgent: navigator.userAgent
        });
      }
    });
  }
}

export const settingsService = new SettingsService();
```

## Integração com Supabase

### Estrutura de Tabelas

```sql
-- Tabela principal de configurações
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  settings JSONB NOT NULL,
  version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Tabela de auditoria de configurações
CREATE TABLE settings_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  section VARCHAR(50) NOT NULL,
  field VARCHAR(100) NOT NULL,
  old_value JSONB,
  new_value JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Índices para performance
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX idx_settings_audit_user_id ON settings_audit_log(user_id);
CREATE INDEX idx_settings_audit_timestamp ON settings_audit_log(timestamp);
CREATE INDEX idx_settings_audit_category ON settings_audit_log(category);

-- RLS (Row Level Security)
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings_audit_log ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own audit log" ON settings_audit_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert audit log" ON settings_audit_log
  FOR INSERT WITH CHECK (true);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Row Level Security (RLS)

```sql
-- Política adicional para administradores
CREATE POLICY "Admins can view all settings" ON user_settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can view all audit logs" ON settings_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );
```

## Conformidade e Segurança

### LGPD (Lei Geral de Proteção de Dados)

**Implementação de Direitos do Titular**:

```typescript
// Direito de acesso
export const getPersonalDataReport = async (userId: string) => {
  const settings = await settingsService.getUserSettings(userId);
  const auditLog = await settingsService.getAuditLog(userId);
  
  return {
    personalData: {
      profile: settings.profile,
      preferences: {
        appearance: settings.appearance,
        notifications: settings.notifications
      }
    },
    processingHistory: auditLog,
    dataRetention: settings.security.privacy.dataRetention,
    consentStatus: {
      analytics: settings.security.privacy.allowAnalytics,
      usageData: settings.security.privacy.shareUsageData,
      errorReports: settings.security.privacy.shareErrorReports
    }
  };
};

// Direito de retificação
export const updatePersonalData = async (
  userId: string, 
  updates: Partial<UserSettings['profile']>
) => {
  return await settingsService.updateUserSettings(userId, {
    profile: updates
  }, {
    audit: true,
    validate: true
  });
};

// Direito de portabilidade
export const exportPersonalData = async (userId: string) => {
  return await settingsService.exportSettings(userId);
};

// Direito de eliminação
export const deletePersonalData = async (userId: string) => {
  // Anonimizar dados em vez de deletar completamente
  const anonymizedSettings = await settingsService.anonymizeSettings(userId);
  
  return await settingsService.updateUserSettings(userId, anonymizedSettings, {
    audit: true
  });
};
```

### HIPAA (Health Insurance Portability and Accountability Act)

**Controles de Segurança**:

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

// Controle de acesso baseado em função
const checkPermission = (user: User, action: string, resource: string): boolean => {
  const permissions = {
    admin: ['read', 'write', 'delete', 'audit'],
    doctor: ['read', 'write'],
    nurse: ['read'],
    patient: ['read_own']
  };
  
  const userPermissions = permissions[user.role] || [];
  
  if (resource === 'own_settings' && user.role === 'patient') {
    return userPermissions.includes('read_own') && ['read', 'write'].includes(action);
  }
  
  return userPermissions.includes(action);
};

// Log de auditoria detalhado
const auditAction = async ({
  userId,
  action,
  resource,
  details,
  ipAddress,
  userAgent
}: {
  userId: string;
  action: string;
  resource: string;
  details: any;
  ipAddress: string;
  userAgent: string;
}) => {
  await supabase.from('hipaa_audit_log').insert({
    user_id: userId,
    action,
    resource,
    details: encryptSensitiveData(details),
    ip_address: ipAddress,
    user_agent: userAgent,
    timestamp: new Date().toISOString()
  });
};
```

## Validações e Qualidade de Dados

### Schemas de Validação com Zod

```typescript
import { z } from 'zod';

// Schema para informações pessoais
export const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
  displayName: z.string().optional(),
  bio: z.string().max(500, 'Biografia deve ter no máximo 500 caracteres').optional(),
  birthDate: z.date().optional(),
  gender: z.enum(['M', 'F', 'O', 'N']).optional(),
  avatar: z.string().url().optional()
});

// Schema para informações profissionais
export const professionalInfoSchema = z.object({
  title: z.enum(['Dr.', 'Dra.', 'Prof. Dr.', 'Prof. Dra.']),
  crm: z.string().regex(/^\d{4,6}\/[A-Z]{2}$/, 'Formato inválido. Use: 123456/UF'),
  specialty: z.string().min(2, 'Especialidade é obrigatória'),
  subspecialty: z.string().optional(),
  institution: z.string().optional(),
  licenseNumber: z.string().optional(),
  licenseExpiry: z.date().optional(),
  certifications: z.array(z.string()).default([])
});

// Schema para endereço
export const addressSchema = z.object({
  street: z.string().min(1, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres'),
  zipCode: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
  country: z.string().default('Brasil')
});

// Schema para informações de contato
export const contactInfoSchema = z.object({
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone inválido'),
  alternativePhone: z.string().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone inválido').optional(),
  address: addressSchema,
  emergencyContact: z.object({
    name: z.string().optional(),
    relationship: z.string().optional(),
    phone: z.string().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone inválido').optional()
  }).optional()
});

// Schema completo do perfil
export const profileSettingsSchema = z.object({
  personalInfo: personalInfoSchema,
  professionalInfo: professionalInfoSchema,
  contactInfo: contactInfoSchema
});

// Schema para configurações de segurança
export const securitySettingsSchema = z.object({
  password: z.object({
    requireChange: z.boolean(),
    changeInterval: z.number().min(30).max(365),
    minLength: z.number().min(8).max(128),
    requireSpecialChars: z.boolean(),
    requireNumbers: z.boolean(),
    requireUppercase: z.boolean(),
    preventReuse: z.number().min(0).max(20)
  }),
  twoFactor: z.object({
    enabled: z.boolean(),
    method: z.enum(['sms', 'email', 'authenticator']),
    backupCodes: z.array(z.string()),
    trustedDevices: z.array(z.object({
      id: z.string(),
      name: z.string(),
      lastUsed: z.date(),
      ipAddress: z.string()
    }))
  }),
  session: z.object({
    timeout: z.number().min(5).max(1440), // 5 min a 24h
    maxConcurrentSessions: z.number().min(1).max(10),
    requireReauthForSensitive: z.boolean(),
    logoutOnClose: z.boolean()
  }),
  privacy: z.object({
    shareUsageData: z.boolean(),
    shareErrorReports: z.boolean(),
    allowAnalytics: z.boolean(),
    dataRetention: z.number().min(30).max(3650), // 30 dias a 10 anos
    autoDeleteInactive: z.boolean()
  })
});
```

## Performance e Otimização

### Estratégias de Cache

```typescript
class SettingsCache {
  private cache = new Map<string, {
    data: UserSettings;
    timestamp: number;
    ttl: number;
  }>();
  
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos
  
  set(userId: string, settings: UserSettings, ttl = this.DEFAULT_TTL): void {
    this.cache.set(userId, {
      data: settings,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get(userId: string): UserSettings | null {
    const cached = this.cache.get(userId);
    
    if (!cached) return null;
    
    const now = Date.now();
    if (now - cached.timestamp > cached.ttl) {
      this.cache.delete(userId);
      return null;
    }
    
    return cached.data;
  }
  
  invalidate(userId: string): void {
    this.cache.delete(userId);
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  // Limpeza automática de cache expirado
  startCleanupInterval(): void {
    setInterval(() => {
      const now = Date.now();
      
      for (const [userId, cached] of this.cache.entries()) {
        if (now - cached.timestamp > cached.ttl) {
          this.cache.delete(userId);
        }
      }
    }, 60000); // Limpar a cada minuto
  }
}

export const settingsCache = new SettingsCache();
```

### Otimização de Queries

```typescript
// Query otimizada para buscar apenas campos necessários
const getSettingsPartial = async (
  userId: string, 
  categories: string[]
): Promise<Partial<UserSettings>> => {
  const selectFields = categories.map(cat => `settings->'${cat}'`).join(', ');
  
  const { data, error } = await supabase
    .from('user_settings')
    .select(`id, user_id, version, ${selectFields}`)
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  
  return data;
};

// Batch update para múltiplas configurações
const batchUpdateSettings = async (
  updates: Array<{
    userId: string;
    settings: Partial<UserSettings>;
  }>
): Promise<void> => {
  const { error } = await supabase
    .from('user_settings')
    .upsert(
      updates.map(update => ({
        user_id: update.userId,
        settings: update.settings,
        updated_at: new Date().toISOString()
      }))
    );
  
  if (error) throw error;
};
```

## Configuração e Deploy

### Variáveis de Ambiente

```env
# Configurações de criptografia
ENCRYPTION_KEY=your-encryption-key-here
ENCRYPTION_ALGORITHM=AES-256-GCM

# Configurações de cache
CACHE_TTL=300000
CACHE_MAX_SIZE=1000

# Configurações de auditoria
AUDIT_ENABLED=true
AUDIT_RETENTION_DAYS=2555

# Configurações de validação
VALIDATION_STRICT_MODE=true
CRM_VALIDATION_ENABLED=true
CFM_API_URL=https://portal.cfm.org.br/api

# Configurações de backup
BACKUP_ENABLED=true
BACKUP_SCHEDULE="0 2 * * *"
BACKUP_RETENTION_DAYS=30

# Configurações de notificação
NOTIFICATION_SERVICE_URL=https://api.notification-service.com
NOTIFICATION_API_KEY=your-notification-api-key

# Configurações de integração
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
GOOGLE_CLOUD_PROJECT_ID=your-gcp-project-id
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
```

### Scripts de Migração

```sql
-- Migration: 001_create_settings_tables.sql
-- Criar tabelas de configurações e auditoria

-- Migration: 002_add_settings_indexes.sql
-- Adicionar índices para performance

-- Migration: 003_setup_rls_policies.sql
-- Configurar políticas de segurança

-- Migration: 004_create_settings_functions.sql
-- Criar funções auxiliares
CREATE OR REPLACE FUNCTION get_user_settings_summary(user_uuid UUID)
RETURNS TABLE(
  categories_count INTEGER,
  last_updated TIMESTAMP WITH TIME ZONE,
  has_profile BOOLEAN,
  has_security BOOLEAN,
  has_integrations BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    jsonb_object_keys(settings)::TEXT[] AS categories,
    updated_at,
    (settings ? 'profile') AS has_profile,
    (settings ? 'security') AS has_security,
    (settings ? 'integrations') AS has_integrations
  FROM user_settings
  WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Exemplos de Uso Prático

### Configuração Completa do Provider

```tsx
// App.tsx
import { SettingsProvider } from '@/contexts/SettingsContext';

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <Routes>
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/:category" element={<SettingsPage />} />
          </Routes>
        </Router>
      </SettingsProvider>
    </AuthProvider>
  );
}
```

### Hook de Configurações

```tsx
// hooks/useSettings.ts
export const useSettings = () => {
  const context = useContext(SettingsContext);
  
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  
  return context;
};

// Uso em componente
const MyComponent: React.FC = () => {
  const { settings, updateSettings, isLoading } = useSettings();
  
  const handleThemeChange = async (theme: 'light' | 'dark' | 'system') => {
    await updateSettings({
      appearance: {
        ...settings.appearance,
        theme
      }
    });
  };
  
  if (isLoading) {
    return <SettingsLoadingSkeleton />;
  }
  
  return (
    <div className={`app-theme-${settings.appearance.theme}`}>
      <ThemeSelector 
        value={settings.appearance.theme}
        onChange={handleThemeChange}
      />
    </div>
  );
};
```

### Configuração de Notificações

```tsx
const NotificationSettings: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [testNotification, setTestNotification] = useState(false);
  
  const handleNotificationTest = async () => {
    setTestNotification(true);
    
    try {
      await notificationService.sendTestNotification({
        userId: settings.userId,
        type: 'test',
        title: 'Teste de Notificação',
        message: 'Esta é uma notificação de teste do Doctor Brief AI',
        channels: {
          email: settings.notifications.email.enabled,
          push: settings.notifications.push.enabled,
          sound: settings.notifications.sound.enabled
        }
      });
      
      toast.success('Notificação de teste enviada!');
      
    } catch (error) {
      console.error('Erro ao enviar notificação de teste:', error);
      toast.error('Erro ao enviar notificação de teste');
    } finally {
      setTestNotification(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Notificação</CardTitle>
        <CardDescription>
          Configure como e quando você deseja receber notificações
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Notificações por Email</h4>
              <p className="text-sm text-gray-600">
                Receba atualizações importantes por email
              </p>
            </div>
            <Switch
              checked={settings.notifications.email.enabled}
              onCheckedChange={(enabled) => {
                updateSettings({
                  notifications: {
                    ...settings.notifications,
                    email: {
                      ...settings.notifications.email,
                      enabled
                    }
                  }
                });
              }}
            />
          </div>
          
          {settings.notifications.email.enabled && (
            <div className="ml-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Novos pacientes</span>
                <Switch
                  checked={settings.notifications.email.newPatient}
                  onCheckedChange={(newPatient) => {
                    updateSettings({
                      notifications: {
                        ...settings.notifications,
                        email: {
                          ...settings.notifications.email,
                          newPatient
                        }
                      }
                    });
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Lembretes de consulta</span>
                <Switch
                  checked={settings.notifications.email.appointmentReminder}
                  onCheckedChange={(appointmentReminder) => {
                    updateSettings({
                      notifications: {
                        ...settings.notifications,
                        email: {
                          ...settings.notifications.email,
                          appointmentReminder
                        }
                      }
                    });
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Resumos de consulta</span>
                <Switch
                  checked={settings.notifications.email.consultationSummary}
                  onCheckedChange={(consultationSummary) => {
                    updateSettings({
                      notifications: {
                        ...settings.notifications,
                        email: {
                          ...settings.notifications.email,
                          consultationSummary
                        }
                      }
                    });
                  }}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Test Notification */}
        <div className="pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleNotificationTest}
            disabled={testNotification}
          >
            {testNotification ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Bell className="w-4 h-4 mr-2" />
            )}
            Testar Notificações
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
```

## Testes

### Testes de Integração

```typescript
// __tests__/settings/settingsService.test.ts
describe('SettingsService', () => {
  let testUserId: string;
  
  beforeEach(async () => {
    testUserId = 'test-user-' + Date.now();
  });
  
  afterEach(async () => {
    // Limpar dados de teste
    await supabase
      .from('user_settings')
      .delete()
      .eq('user_id', testUserId);
  });
  
  describe('getUserSettings', () => {
    it('should create default settings for new user', async () => {
      const settings = await settingsService.getUserSettings(testUserId);
      
      expect(settings).toBeDefined();
      expect(settings.userId).toBe(testUserId);
      expect(settings.profile.personalInfo.firstName).toBe('');
      expect(settings.appearance.theme).toBe('system');
      expect(settings.notifications.email.enabled).toBe(true);
    });
    
    it('should return cached settings on subsequent calls', async () => {
      const settings1 = await settingsService.getUserSettings(testUserId);
      const settings2 = await settingsService.getUserSettings(testUserId);
      
      expect(settings1).toEqual(settings2);
    });
  });
  
  describe('updateUserSettings', () => {
    it('should update settings and create audit log', async () => {
      const initialSettings = await settingsService.getUserSettings(testUserId);
      
      const updates = {
        profile: {
          ...initialSettings.profile,
          personalInfo: {
            ...initialSettings.profile.personalInfo,
            firstName: 'João',
            lastName: 'Silva'
          }
        }
      };
      
      const updatedSettings = await settingsService.updateUserSettings(
        testUserId, 
        updates
      );
      
      expect(updatedSettings.profile.personalInfo.firstName).toBe('João');
      expect(updatedSettings.profile.personalInfo.lastName).toBe('Silva');
      expect(updatedSettings.updatedAt).not.toEqual(initialSettings.updatedAt);
      
      // Verificar se auditoria foi criada
      const { data: auditLogs } = await supabase
        .from('settings_audit_log')
        .select('*')
        .eq('user_id', testUserId);
      
      expect(auditLogs).toHaveLength(2); // firstName e lastName
    });
    
    it('should validate settings before updating', async () => {
      const invalidUpdates = {
        profile: {
          personalInfo: {
            firstName: 'A', // Muito curto
            lastName: 'B'   // Muito curto
          }
        }
      };
      
      await expect(
        settingsService.updateUserSettings(testUserId, invalidUpdates, {
          validate: true
        })
      ).rejects.toThrow();
    });
  });
  
  describe('exportSettings', () => {
    it('should export settings without sensitive data', async () => {
      const settings = await settingsService.getUserSettings(testUserId);
      
      // Adicionar dados sensíveis
      await settingsService.updateUserSettings(testUserId, {
        integrations: {
          ...settings.integrations,
          openai: {
            ...settings.integrations.openai,
            apiKey: 'sk-test-key'
          }
        }
      });
      
      const exportData = await settingsService.exportSettings(testUserId);
      
      expect(exportData.settings.integrations.openai.apiKey).toBeUndefined();
      expect(exportData.metadata.userId).toBe(testUserId);
      expect(exportData.metadata.exportedAt).toBeInstanceOf(Date);
    });
  });
});
```

## Roadmap

### Versão 2.0
- [ ] Configurações por organização/clínica
- [ ] Templates de configuração pré-definidos
- [ ] Sincronização em tempo real entre dispositivos
- [ ] Configurações condicionais baseadas em contexto
- [ ] API GraphQL para configurações

### Versão 2.1
- [ ] Configurações baseadas em IA (sugestões automáticas)
- [ ] Backup automático na nuvem
- [ ] Versionamento de configurações com rollback
- [ ] Configurações por especialidade médica
- [ ] Dashboard de analytics de configurações

### Versão 2.2
- [ ] Configurações colaborativas (equipe médica)
- [ ] Configurações baseadas em localização
- [ ] Integração com sistemas hospitalares
- [ ] Configurações de compliance automático
- [ ] Auditoria avançada com relatórios

## Diretrizes de Contribuição

### Padrões de Código
- Use TypeScript para type safety
- Implemente validação com Zod
- Adicione testes para novas funcionalidades
- Documente APIs com JSDoc
- Siga os padrões de nomenclatura estabelecidos

### Processo de Review
1. Criar branch feature/settings-[funcionalidade]
2. Implementar funcionalidade com testes
3. Atualizar documentação
4. Criar Pull Request
5. Review de código e aprovação
6. Merge para main

### Testes Obrigatórios
- Testes unitários para serviços
- Testes de integração com Supabase
- Testes de validação de dados
- Testes de performance para cache
- Testes de segurança para auditoria

## Suporte e Troubleshooting

### Problemas Comuns

**Configurações não salvam**:
- Verificar conexão com Supabase
- Validar políticas RLS
- Verificar logs de erro no console

**Cache inconsistente**:
- Limpar cache manualmente
- Verificar TTL do cache
- Reiniciar aplicação

**Validação falhando**:
- Verificar schemas Zod
- Validar formato dos dados
- Verificar mensagens de erro

### Logs e Monitoramento

```typescript
// Configurar logging detalhado
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[SETTINGS] ${message}`, data);
  },
  error: (message: string, error?: any) => {
    console.error(`[SETTINGS ERROR] ${message}`, error);
    // Enviar para serviço de monitoramento
  },
  warn: (message: string, data?: any) => {
    console.warn(`[SETTINGS WARNING] ${message}`, data);
  }
};
```

### Contato para Suporte
- Email: suporte@doctorbrief.ai
- Slack: #settings-module
- Documentação: https://docs.doctorbrief.ai/settings
- Issues: https://github.com/doctorbrief/issues