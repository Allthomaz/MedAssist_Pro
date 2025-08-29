import { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  Moon,
  Sun,
  Shield,
  Smartphone,
  Mail,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Lock,
  Unlock,
  Activity,
  Heart,
  Clock,
  FileText,
  Settings,
} from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente Switch para configurações de toggle e preferências no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Estado ativo/inativo',
    },
    disabled: {
      control: 'boolean',
      description: 'Estado desabilitado',
    },
    id: {
      control: 'text',
      description: 'ID do switch',
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

// Switch básico
export const Default: Story = {
  args: {
    id: 'default-switch',
  },
  render: args => (
    <div className="flex items-center space-x-2">
      <Switch {...args} />
      <Label htmlFor={args.id}>Ativar notificações</Label>
    </div>
  ),
};

// Switch ativo
export const Checked: Story = {
  args: {
    id: 'checked-switch',
    checked: true,
  },
  render: args => (
    <div className="flex items-center space-x-2">
      <Switch {...args} />
      <Label htmlFor={args.id}>Opção ativada</Label>
    </div>
  ),
};

// Switch desabilitado
export const Disabled: Story = {
  args: {
    id: 'disabled-switch',
    disabled: true,
  },
  render: args => (
    <div className="flex items-center space-x-2">
      <Switch {...args} />
      <Label htmlFor={args.id} className="opacity-50">
        Opção desabilitada
      </Label>
    </div>
  ),
};

// Switch com ícone
export const WithIcon: Story = {
  render: () => {
    const [isEnabled, setIsEnabled] = useState(false);

    return (
      <div className="flex items-center space-x-2">
        <Switch
          id="icon-switch"
          checked={isEnabled}
          onCheckedChange={setIsEnabled}
        />
        <Label htmlFor="icon-switch" className="flex items-center gap-2">
          {isEnabled ? (
            <Bell className="h-4 w-4 text-medical-blue" />
          ) : (
            <Bell className="h-4 w-4 text-muted-foreground" />
          )}
          Notificações push
        </Label>
      </div>
    );
  },
};

// Configurações de notificação
export const NotificationSettings: Story = {
  render: () => {
    const [settings, setSettings] = useState({
      push: true,
      email: false,
      sms: true,
      sound: false,
      vibration: true,
    });

    const handleSettingChange = (key: keyof typeof settings) => {
      setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-medical-blue" />
            Configurações de Notificação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="push-notifications"
              className="flex items-center gap-2"
            >
              <Smartphone className="h-4 w-4 text-medical-blue" />
              Notificações Push
            </Label>
            <Switch
              id="push-notifications"
              checked={settings.push}
              onCheckedChange={() => handleSettingChange('push')}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label
              htmlFor="email-notifications"
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4 text-medical-blue" />
              Notificações por Email
            </Label>
            <Switch
              id="email-notifications"
              checked={settings.email}
              onCheckedChange={() => handleSettingChange('email')}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label
              htmlFor="sms-notifications"
              className="flex items-center gap-2"
            >
              <Smartphone className="h-4 w-4 text-medical-blue" />
              SMS
              <Badge className="bg-medical-blue text-white text-xs">
                Premium
              </Badge>
            </Label>
            <Switch
              id="sms-notifications"
              checked={settings.sms}
              onCheckedChange={() => handleSettingChange('sms')}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label
              htmlFor="sound-notifications"
              className="flex items-center gap-2"
            >
              {settings.sound ? (
                <Volume2 className="h-4 w-4 text-medical-blue" />
              ) : (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              )}
              Som
            </Label>
            <Switch
              id="sound-notifications"
              checked={settings.sound}
              onCheckedChange={() => handleSettingChange('sound')}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label
              htmlFor="vibration-notifications"
              className="flex items-center gap-2"
            >
              <Smartphone className="h-4 w-4 text-medical-blue" />
              Vibração
            </Label>
            <Switch
              id="vibration-notifications"
              checked={settings.vibration}
              onCheckedChange={() => handleSettingChange('vibration')}
            />
          </div>
        </CardContent>
      </Card>
    );
  },
};

// Configurações de privacidade
export const PrivacySettings: Story = {
  render: () => {
    const [privacy, setPrivacy] = useState({
      profileVisible: true,
      shareData: false,
      analytics: true,
      marketing: false,
      twoFactor: true,
    });

    const handlePrivacyChange = (key: keyof typeof privacy) => {
      setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-medical-blue" />
            Configurações de Privacidade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label
                htmlFor="profile-visible"
                className="flex items-center gap-2"
              >
                {privacy.profileVisible ? (
                  <Eye className="h-4 w-4 text-medical-blue" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
                Perfil Visível
              </Label>
              <p className="text-xs text-muted-foreground">
                Permitir que outros profissionais vejam seu perfil
              </p>
            </div>
            <Switch
              id="profile-visible"
              checked={privacy.profileVisible}
              onCheckedChange={() => handlePrivacyChange('profileVisible')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="share-data" className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-medical-blue" />
                Compartilhar Dados
              </Label>
              <p className="text-xs text-muted-foreground">
                Permitir uso de dados para pesquisas médicas
              </p>
            </div>
            <Switch
              id="share-data"
              checked={privacy.shareData}
              onCheckedChange={() => handlePrivacyChange('shareData')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="analytics" className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-medical-blue" />
                Analytics
              </Label>
              <p className="text-xs text-muted-foreground">
                Ajudar a melhorar a plataforma
              </p>
            </div>
            <Switch
              id="analytics"
              checked={privacy.analytics}
              onCheckedChange={() => handlePrivacyChange('analytics')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="marketing" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-medical-blue" />
                Marketing
              </Label>
              <p className="text-xs text-muted-foreground">
                Receber ofertas e novidades
              </p>
            </div>
            <Switch
              id="marketing"
              checked={privacy.marketing}
              onCheckedChange={() => handlePrivacyChange('marketing')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="two-factor" className="flex items-center gap-2">
                {privacy.twoFactor ? (
                  <Lock className="h-4 w-4 text-green-500" />
                ) : (
                  <Unlock className="h-4 w-4 text-red-500" />
                )}
                Autenticação 2FA
                <Badge className="bg-green-500 text-white text-xs">
                  Recomendado
                </Badge>
              </Label>
              <p className="text-xs text-muted-foreground">
                Segurança adicional para sua conta
              </p>
            </div>
            <Switch
              id="two-factor"
              checked={privacy.twoFactor}
              onCheckedChange={() => handlePrivacyChange('twoFactor')}
            />
          </div>
        </CardContent>
      </Card>
    );
  },
};

// Configurações médicas
export const MedicalSettings: Story = {
  render: () => {
    const [medical, setMedical] = useState({
      reminders: true,
      emergencyContact: true,
      shareWithFamily: false,
      autoBackup: true,
      criticalAlerts: true,
    });

    const handleMedicalChange = (key: keyof typeof medical) => {
      setMedical(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-medical-blue" />
            Configurações Médicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="medication-reminders"
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4 text-medical-blue" />
              Lembretes de Medicação
            </Label>
            <Switch
              id="medication-reminders"
              checked={medical.reminders}
              onCheckedChange={() => handleMedicalChange('reminders')}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label
              htmlFor="emergency-contact"
              className="flex items-center gap-2"
            >
              <Smartphone className="h-4 w-4 text-red-500" />
              Contato de Emergência
              <Badge className="bg-red-500 text-white text-xs">Crítico</Badge>
            </Label>
            <Switch
              id="emergency-contact"
              checked={medical.emergencyContact}
              onCheckedChange={() => handleMedicalChange('emergencyContact')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="share-family" className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-medical-blue" />
                Compartilhar com Família
              </Label>
              <p className="text-xs text-muted-foreground">
                Permitir acesso aos dados médicos
              </p>
            </div>
            <Switch
              id="share-family"
              checked={medical.shareWithFamily}
              onCheckedChange={() => handleMedicalChange('shareWithFamily')}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="auto-backup" className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-medical-blue" />
              Backup Automático
            </Label>
            <Switch
              id="auto-backup"
              checked={medical.autoBackup}
              onCheckedChange={() => handleMedicalChange('autoBackup')}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label
              htmlFor="critical-alerts"
              className="flex items-center gap-2"
            >
              <Activity className="h-4 w-4 text-red-500" />
              Alertas Críticos
              <Badge className="bg-red-500 text-white text-xs">
                Obrigatório
              </Badge>
            </Label>
            <Switch
              id="critical-alerts"
              checked={medical.criticalAlerts}
              onCheckedChange={() => handleMedicalChange('criticalAlerts')}
              disabled
            />
          </div>
        </CardContent>
      </Card>
    );
  },
};

// Tema escuro/claro
export const ThemeToggle: Story = {
  render: () => {
    const [isDark, setIsDark] = useState(false);

    return (
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-toggle" className="flex items-center gap-2">
              {isDark ? (
                <Moon className="h-4 w-4 text-slate-600" />
              ) : (
                <Sun className="h-4 w-4 text-yellow-500" />
              )}
              {isDark ? 'Tema Escuro' : 'Tema Claro'}
            </Label>
            <Switch
              id="theme-toggle"
              checked={isDark}
              onCheckedChange={setIsDark}
            />
          </div>

          <div
            className="mt-4 p-3 rounded-lg transition-colors"
            style={{
              backgroundColor: isDark ? '#1f2937' : '#f3f4f6',
              color: isDark ? '#f9fafb' : '#111827',
            }}
          >
            <p className="text-sm">
              Prévia do tema {isDark ? 'escuro' : 'claro'}
            </p>
            <p className="text-xs opacity-75 mt-1">
              Esta configuração será aplicada em toda a aplicação
            </p>
          </div>
        </CardContent>
      </Card>
    );
  },
};

// Estados do switch
export const SwitchStates: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch id="off" />
        <Label htmlFor="off">Desativado</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="on" checked />
        <Label htmlFor="on">Ativado</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="disabled-off" disabled />
        <Label htmlFor="disabled-off" className="opacity-50">
          Desabilitado (off)
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="disabled-on" disabled checked />
        <Label htmlFor="disabled-on" className="opacity-50">
          Desabilitado (on)
        </Label>
      </div>
    </div>
  ),
};

// Switch com status de conexão
export const ConnectionStatus: Story = {
  render: () => {
    const [isConnected, setIsConnected] = useState(true);

    return (
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="connection-toggle"
              className="flex items-center gap-2"
            >
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              Conexão Online
            </Label>
            <Switch
              id="connection-toggle"
              checked={isConnected}
              onCheckedChange={setIsConnected}
            />
          </div>

          <div className="mt-4">
            <Badge
              className={`${
                isConnected
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}
            >
              {isConnected ? 'Online' : 'Offline'}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              {isConnected
                ? 'Dados sincronizados em tempo real'
                : 'Trabalhando no modo offline'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  },
};

// Switch com confirmação
export const WithConfirmation: Story = {
  render: () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleToggle = (checked: boolean) => {
      if (checked && !isEnabled) {
        setShowConfirm(true);
      } else {
        setIsEnabled(checked);
      }
    };

    const confirmEnable = () => {
      setIsEnabled(true);
      setShowConfirm(false);
    };

    const cancelEnable = () => {
      setShowConfirm(false);
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="confirm-switch"
            checked={isEnabled}
            onCheckedChange={handleToggle}
          />
          <Label htmlFor="confirm-switch" className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-medical-blue" />
            Modo Avançado
            <Badge className="bg-orange-500 text-white text-xs">Cuidado</Badge>
          </Label>
        </div>

        {showConfirm && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-4">
              <p className="text-sm font-medium text-orange-800">
                Confirmar ativação do Modo Avançado?
              </p>
              <p className="text-xs text-orange-600 mt-1">
                Esta opção pode afetar o funcionamento normal do sistema.
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={confirmEnable}
                  className="px-3 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600"
                >
                  Confirmar
                </button>
                <button
                  onClick={cancelEnable}
                  className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  },
};
