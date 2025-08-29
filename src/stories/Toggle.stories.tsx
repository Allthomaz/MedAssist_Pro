import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from '@/components/ui/toggle';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Bold,
  Italic,
  Underline,
  Eye,
  EyeOff,
  Bell,
  BellOff,
  Heart,
  HeartOff,
  Star,
  StarOff,
  Lock,
  Unlock,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Zap,
  ZapOff,
  Shield,
  ShieldOff,
  Activity,
  Pause,
  Play,
  Settings,
  Filter,
  FilterX,
  Bookmark,
  BookmarkX,
} from 'lucide-react';
import { useState } from 'react';

const meta: Meta<typeof Toggle> = {
  title: 'UI/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente Toggle para alternar entre dois estados no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline'],
      description: 'Variante visual do toggle',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
      description: 'Tamanho do toggle',
    },
    pressed: {
      control: 'boolean',
      description: 'Estado pressionado do toggle',
    },
    disabled: {
      control: 'boolean',
      description: 'Se o toggle está desabilitado',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Toggle',
  },
};

export const Pressed: Story = {
  args: {
    children: 'Pressed',
    pressed: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Toggle size="sm">Small</Toggle>
      <Toggle size="default">Default</Toggle>
      <Toggle size="lg">Large</Toggle>
    </div>
  ),
};

// Casos de uso médicos
export const TextFormatting: Story = {
  render: () => {
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [underline, setUnderline] = useState(false);

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Formatação de Texto</CardTitle>
          <CardDescription>
            Ferramentas de formatação para relatórios médicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Toggle pressed={bold} onPressedChange={setBold} size="sm">
              <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle pressed={italic} onPressedChange={setItalic} size="sm">
              <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={underline}
              onPressedChange={setUnderline}
              size="sm"
            >
              <Underline className="h-4 w-4" />
            </Toggle>
          </div>
          <div className="text-sm text-muted-foreground">
            <p
              className={`${bold ? 'font-bold' : ''} ${
                italic ? 'italic' : ''
              } ${underline ? 'underline' : ''}`}
            >
              Exemplo de texto formatado para relatório médico.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  },
};

export const VisibilityToggle: Story = {
  render: () => {
    const [visible, setVisible] = useState(false);

    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Dados Sensíveis</CardTitle>
          <CardDescription>
            Controle de visibilidade de informações confidenciais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>CPF do Paciente</Label>
            <Toggle pressed={visible} onPressedChange={setVisible} size="sm">
              {visible ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Toggle>
          </div>
          <div className="p-3 bg-muted rounded-md font-mono text-sm">
            {visible ? '123.456.789-00' : '***.***.***-**'}
          </div>
        </CardContent>
      </Card>
    );
  },
};

export const NotificationSettings: Story = {
  render: () => {
    const [notifications, setNotifications] = useState(true);
    const [emergencyAlerts, setEmergencyAlerts] = useState(true);
    const [appointmentReminders, setAppointmentReminders] = useState(false);

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Configurações de Notificação</CardTitle>
          <CardDescription>
            Gerencie suas preferências de notificação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label>Notificações Gerais</Label>
            </div>
            <Toggle
              pressed={notifications}
              onPressedChange={setNotifications}
              variant="outline"
            >
              {notifications ? (
                <Bell className="h-4 w-4" />
              ) : (
                <BellOff className="h-4 w-4" />
              )}
            </Toggle>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label>Alertas de Emergência</Label>
              <Badge variant="destructive" className="text-xs">
                Crítico
              </Badge>
            </div>
            <Toggle
              pressed={emergencyAlerts}
              onPressedChange={setEmergencyAlerts}
              variant="outline"
            >
              {emergencyAlerts ? (
                <Heart className="h-4 w-4" />
              ) : (
                <HeartOff className="h-4 w-4" />
              )}
            </Toggle>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label>Lembretes de Consulta</Label>
            </div>
            <Toggle
              pressed={appointmentReminders}
              onPressedChange={setAppointmentReminders}
              variant="outline"
            >
              {appointmentReminders ? (
                <Star className="h-4 w-4" />
              ) : (
                <StarOff className="h-4 w-4" />
              )}
            </Toggle>
          </div>
        </CardContent>
      </Card>
    );
  },
};

export const SecuritySettings: Story = {
  render: () => {
    const [twoFactor, setTwoFactor] = useState(true);
    const [autoLock, setAutoLock] = useState(false);
    const [dataEncryption, setDataEncryption] = useState(true);

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Configurações de Segurança</CardTitle>
          <CardDescription>
            Configurações de segurança do sistema médico
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label>Autenticação 2FA</Label>
              <Badge variant="secondary" className="text-xs">
                Recomendado
              </Badge>
            </div>
            <Toggle
              pressed={twoFactor}
              onPressedChange={setTwoFactor}
              variant="outline"
            >
              {twoFactor ? (
                <Lock className="h-4 w-4" />
              ) : (
                <Unlock className="h-4 w-4" />
              )}
            </Toggle>
          </div>

          <div className="flex items-center justify-between">
            <Label>Bloqueio Automático</Label>
            <Toggle
              pressed={autoLock}
              onPressedChange={setAutoLock}
              variant="outline"
            >
              {autoLock ? (
                <Shield className="h-4 w-4" />
              ) : (
                <ShieldOff className="h-4 w-4" />
              )}
            </Toggle>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label>Criptografia de Dados</Label>
              <Badge variant="outline" className="text-xs">
                LGPD
              </Badge>
            </div>
            <Toggle
              pressed={dataEncryption}
              onPressedChange={setDataEncryption}
              variant="outline"
              disabled
            >
              {dataEncryption ? (
                <Zap className="h-4 w-4" />
              ) : (
                <ZapOff className="h-4 w-4" />
              )}
            </Toggle>
          </div>
        </CardContent>
      </Card>
    );
  },
};

export const SystemControls: Story = {
  render: () => {
    const [darkMode, setDarkMode] = useState(false);
    const [wifi, setWifi] = useState(true);
    const [sound, setSound] = useState(true);
    const [monitoring, setMonitoring] = useState(true);

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Controles do Sistema</CardTitle>
          <CardDescription>
            Configurações gerais do sistema hospitalar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Modo Escuro</Label>
            <Toggle pressed={darkMode} onPressedChange={setDarkMode} size="sm">
              {darkMode ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Toggle>
          </div>

          <div className="flex items-center justify-between">
            <Label>Conexão Wi-Fi</Label>
            <Toggle pressed={wifi} onPressedChange={setWifi} size="sm">
              {wifi ? (
                <Wifi className="h-4 w-4" />
              ) : (
                <WifiOff className="h-4 w-4" />
              )}
            </Toggle>
          </div>

          <div className="flex items-center justify-between">
            <Label>Sons do Sistema</Label>
            <Toggle pressed={sound} onPressedChange={setSound} size="sm">
              {sound ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Toggle>
          </div>

          <div className="flex items-center justify-between">
            <Label>Monitoramento Ativo</Label>
            <Toggle
              pressed={monitoring}
              onPressedChange={setMonitoring}
              size="sm"
            >
              {monitoring ? (
                <Activity className="h-4 w-4" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
            </Toggle>
          </div>
        </CardContent>
      </Card>
    );
  },
};

export const FilterControls: Story = {
  render: () => {
    const [activeFilters, setActiveFilters] = useState(false);
    const [favorites, setFavorites] = useState(false);
    const [advancedMode, setAdvancedMode] = useState(false);

    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Controles de Filtro</CardTitle>
          <CardDescription>Filtros para lista de pacientes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Filtros Ativos</Label>
            <Toggle
              pressed={activeFilters}
              onPressedChange={setActiveFilters}
              variant="outline"
              size="sm"
            >
              {activeFilters ? (
                <Filter className="h-4 w-4" />
              ) : (
                <FilterX className="h-4 w-4" />
              )}
            </Toggle>
          </div>

          <div className="flex items-center justify-between">
            <Label>Apenas Favoritos</Label>
            <Toggle
              pressed={favorites}
              onPressedChange={setFavorites}
              variant="outline"
              size="sm"
            >
              {favorites ? (
                <Bookmark className="h-4 w-4" />
              ) : (
                <BookmarkX className="h-4 w-4" />
              )}
            </Toggle>
          </div>

          <div className="flex items-center justify-between">
            <Label>Modo Avançado</Label>
            <Toggle
              pressed={advancedMode}
              onPressedChange={setAdvancedMode}
              variant="outline"
              size="sm"
            >
              <Settings className="h-4 w-4" />
            </Toggle>
          </div>
        </CardContent>
      </Card>
    );
  },
};

export const MediaControls: Story = {
  render: () => {
    const [playing, setPlaying] = useState(false);

    return (
      <Card className="w-[300px]">
        <CardHeader>
          <CardTitle>Controle de Áudio</CardTitle>
          <CardDescription>Reprodução de gravações médicas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center">
            <Toggle
              pressed={playing}
              onPressedChange={setPlaying}
              size="lg"
              variant="outline"
            >
              {playing ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Toggle>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            {playing ? 'Reproduzindo...' : 'Pausado'}
          </div>
        </CardContent>
      </Card>
    );
  },
};

export const CompactToggles: Story = {
  render: () => {
    const [toggles, setToggles] = useState({
      a: false,
      b: true,
      c: false,
      d: true,
    });

    const updateToggle = (key: string) => {
      setToggles(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    };

    return (
      <div className="flex gap-2">
        <Toggle
          pressed={toggles.a}
          onPressedChange={() => updateToggle('a')}
          size="sm"
        >
          A
        </Toggle>
        <Toggle
          pressed={toggles.b}
          onPressedChange={() => updateToggle('b')}
          size="sm"
        >
          B
        </Toggle>
        <Toggle
          pressed={toggles.c}
          onPressedChange={() => updateToggle('c')}
          size="sm"
        >
          C
        </Toggle>
        <Toggle
          pressed={toggles.d}
          onPressedChange={() => updateToggle('d')}
          size="sm"
        >
          D
        </Toggle>
      </div>
    );
  },
};
