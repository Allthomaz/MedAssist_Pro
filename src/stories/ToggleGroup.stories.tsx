import { Meta, StoryObj } from '@storybook/react-vite';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
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
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  Table,
  Heading1,
  Heading2,
  Heading3,
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Zap,
  Brain,
  Eye,
  Ear,
  Pill,
  Stethoscope,
  Syringe,
  Bandage,
  Shield,
  Clock,
  Calendar,
  User,
  Users,
  Building,
  Home,
  Car,
  Plane,
  Phone,
  Mail,
  MessageSquare,
  Video,
  Camera,
  Mic,
  Volume2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Snowflake,
  Wind,
  Sunrise,
  Sunset,
} from 'lucide-react';
import { useState } from 'react';

const meta: Meta<typeof ToggleGroup> = {
  title: 'UI/ToggleGroup',
  component: ToggleGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente ToggleGroup para agrupar múltiplos toggles no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
      description: 'Tipo de seleção do grupo',
    },
    variant: {
      control: 'select',
      options: ['default', 'outline'],
      description: 'Variante visual do grupo',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
      description: 'Tamanho dos itens do grupo',
    },
    disabled: {
      control: 'boolean',
      description: 'Se o grupo está desabilitado',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'single',
  },
  render: args => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="a">A</ToggleGroupItem>
      <ToggleGroupItem value="b">B</ToggleGroupItem>
      <ToggleGroupItem value="c">C</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Multiple: Story = {
  args: {
    type: 'multiple',
  },
  render: args => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="bold">
        <Bold className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic">
        <Italic className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline">
        <Underline className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Outline: Story = {
  args: {
    type: 'single',
    variant: 'outline',
  },
  render: args => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="left">
        <AlignLeft className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="center">
        <AlignCenter className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="right">
        <AlignRight className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Label>Small</Label>
        <ToggleGroup type="single" size="sm">
          <ToggleGroupItem value="1">1</ToggleGroupItem>
          <ToggleGroupItem value="2">2</ToggleGroupItem>
          <ToggleGroupItem value="3">3</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="flex items-center gap-4">
        <Label>Default</Label>
        <ToggleGroup type="single" size="default">
          <ToggleGroupItem value="1">1</ToggleGroupItem>
          <ToggleGroupItem value="2">2</ToggleGroupItem>
          <ToggleGroupItem value="3">3</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="flex items-center gap-4">
        <Label>Large</Label>
        <ToggleGroup type="single" size="lg">
          <ToggleGroupItem value="1">1</ToggleGroupItem>
          <ToggleGroupItem value="2">2</ToggleGroupItem>
          <ToggleGroupItem value="3">3</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  ),
};

// Casos de uso médicos
export const VitalSigns: Story = {
  render: () => {
    const [selectedVital, setSelectedVital] = useState<string>('heart-rate');

    return (
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Sinais Vitais</CardTitle>
          <CardDescription>
            Selecione o sinal vital para monitoramento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleGroup
            type="single"
            value={selectedVital}
            onValueChange={setSelectedVital}
            variant="outline"
          >
            <ToggleGroupItem value="heart-rate">
              <Heart className="h-4 w-4 mr-2" />
              Frequência Cardíaca
            </ToggleGroupItem>
            <ToggleGroupItem value="blood-pressure">
              <Activity className="h-4 w-4 mr-2" />
              Pressão Arterial
            </ToggleGroupItem>
            <ToggleGroupItem value="temperature">
              <Thermometer className="h-4 w-4 mr-2" />
              Temperatura
            </ToggleGroupItem>
            <ToggleGroupItem value="oxygen">
              <Droplets className="h-4 w-4 mr-2" />
              Saturação O2
            </ToggleGroupItem>
          </ToggleGroup>

          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm font-medium">
              Monitorando:{' '}
              {selectedVital === 'heart-rate' && 'Frequência Cardíaca'}
              {selectedVital === 'blood-pressure' && 'Pressão Arterial'}
              {selectedVital === 'temperature' && 'Temperatura Corporal'}
              {selectedVital === 'oxygen' && 'Saturação de Oxigênio'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  },
};

export const MedicalSpecialties: Story = {
  render: () => {
    const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([
      'cardiology',
    ]);

    return (
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Especialidades Médicas</CardTitle>
          <CardDescription>
            Selecione as especialidades de interesse
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleGroup
            type="multiple"
            value={selectedSpecialties}
            onValueChange={setSelectedSpecialties}
            variant="outline"
            className="flex-wrap"
          >
            <ToggleGroupItem value="cardiology">
              <Heart className="h-4 w-4 mr-2" />
              Cardiologia
            </ToggleGroupItem>
            <ToggleGroupItem value="neurology">
              <Brain className="h-4 w-4 mr-2" />
              Neurologia
            </ToggleGroupItem>
            <ToggleGroupItem value="ophthalmology">
              <Eye className="h-4 w-4 mr-2" />
              Oftalmologia
            </ToggleGroupItem>
            <ToggleGroupItem value="otolaryngology">
              <Ear className="h-4 w-4 mr-2" />
              Otorrinolaringologia
            </ToggleGroupItem>
            <ToggleGroupItem value="pharmacy">
              <Pill className="h-4 w-4 mr-2" />
              Farmácia
            </ToggleGroupItem>
            <ToggleGroupItem value="general">
              <Stethoscope className="h-4 w-4 mr-2" />
              Clínica Geral
            </ToggleGroupItem>
          </ToggleGroup>

          <div className="flex flex-wrap gap-2">
            {selectedSpecialties.map(specialty => (
              <Badge key={specialty} variant="secondary">
                {specialty === 'cardiology' && 'Cardiologia'}
                {specialty === 'neurology' && 'Neurologia'}
                {specialty === 'ophthalmology' && 'Oftalmologia'}
                {specialty === 'otolaryngology' && 'Otorrinolaringologia'}
                {specialty === 'pharmacy' && 'Farmácia'}
                {specialty === 'general' && 'Clínica Geral'}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  },
};

export const TextFormatting: Story = {
  render: () => {
    const [formatting, setFormatting] = useState<string[]>([]);

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Formatação de Texto</CardTitle>
          <CardDescription>
            Ferramentas de formatação para relatórios médicos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleGroup
            type="multiple"
            value={formatting}
            onValueChange={setFormatting}
            size="sm"
          >
            <ToggleGroupItem value="bold">
              <Bold className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic">
              <Italic className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline">
              <Underline className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="code">
              <Code className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="link">
              <Link className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          <div className="p-3 bg-muted rounded-md">
            <p
              className={`text-sm ${
                formatting.includes('bold') ? 'font-bold' : ''
              } ${formatting.includes('italic') ? 'italic' : ''} ${
                formatting.includes('underline') ? 'underline' : ''
              } ${
                formatting.includes('code')
                  ? 'font-mono bg-gray-100 px-1 rounded'
                  : ''
              }`}
            >
              Exemplo de texto formatado para relatório médico.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  },
};

export const TextAlignment: Story = {
  render: () => {
    const [alignment, setAlignment] = useState<string>('left');

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Alinhamento de Texto</CardTitle>
          <CardDescription>
            Controle de alinhamento para documentos médicos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleGroup
            type="single"
            value={alignment}
            onValueChange={setAlignment}
            variant="outline"
          >
            <ToggleGroupItem value="left">
              <AlignLeft className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center">
              <AlignCenter className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="right">
              <AlignRight className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="justify">
              <AlignJustify className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          <div className="p-3 bg-muted rounded-md">
            <p
              className={`text-sm ${
                alignment === 'left'
                  ? 'text-left'
                  : alignment === 'center'
                    ? 'text-center'
                    : alignment === 'right'
                      ? 'text-right'
                      : alignment === 'justify'
                        ? 'text-justify'
                        : 'text-left'
              }`}
            >
              Este é um exemplo de texto que demonstra o alinhamento
              selecionado. O texto se ajusta conforme a opção escolhida no grupo
              de toggles acima.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  },
};

export const ViewModes: Story = {
  render: () => {
    const [viewMode, setViewMode] = useState<string>('list');

    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Modo de Visualização</CardTitle>
          <CardDescription>
            Escolha como visualizar a lista de pacientes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={setViewMode}
            variant="outline"
          >
            <ToggleGroupItem value="list">
              <List className="h-4 w-4 mr-2" />
              Lista
            </ToggleGroupItem>
            <ToggleGroupItem value="table">
              <Table className="h-4 w-4 mr-2" />
              Tabela
            </ToggleGroupItem>
            <ToggleGroupItem value="cards">
              <User className="h-4 w-4 mr-2" />
              Cards
            </ToggleGroupItem>
          </ToggleGroup>

          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm font-medium">
              Visualização atual: {viewMode === 'list' && 'Lista'}
              {viewMode === 'table' && 'Tabela'}
              {viewMode === 'cards' && 'Cards'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  },
};

export const TimeRanges: Story = {
  render: () => {
    const [timeRange, setTimeRange] = useState<string>('today');

    return (
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Período de Consultas</CardTitle>
          <CardDescription>
            Selecione o período para visualizar consultas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            size="sm"
          >
            <ToggleGroupItem value="today">
              <Clock className="h-4 w-4 mr-1" />
              Hoje
            </ToggleGroupItem>
            <ToggleGroupItem value="week">
              <Calendar className="h-4 w-4 mr-1" />
              Esta Semana
            </ToggleGroupItem>
            <ToggleGroupItem value="month">
              <Calendar className="h-4 w-4 mr-1" />
              Este Mês
            </ToggleGroupItem>
            <ToggleGroupItem value="quarter">
              <Calendar className="h-4 w-4 mr-1" />
              Trimestre
            </ToggleGroupItem>
            <ToggleGroupItem value="year">
              <Calendar className="h-4 w-4 mr-1" />
              Ano
            </ToggleGroupItem>
          </ToggleGroup>

          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm">
              Mostrando consultas de:{' '}
              <span className="font-medium">
                {timeRange === 'today' && 'Hoje'}
                {timeRange === 'week' && 'Esta Semana'}
                {timeRange === 'month' && 'Este Mês'}
                {timeRange === 'quarter' && 'Este Trimestre'}
                {timeRange === 'year' && 'Este Ano'}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  },
};

export const PriorityLevels: Story = {
  render: () => {
    const [priorities, setPriorities] = useState<string[]>(['high']);

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Níveis de Prioridade</CardTitle>
          <CardDescription>
            Filtrar pacientes por nível de prioridade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleGroup
            type="multiple"
            value={priorities}
            onValueChange={setPriorities}
            variant="outline"
            size="sm"
          >
            <ToggleGroupItem value="critical">
              <Zap className="h-4 w-4 mr-1" />
              <Badge variant="destructive" className="text-xs">
                Crítico
              </Badge>
            </ToggleGroupItem>
            <ToggleGroupItem value="high">
              <Shield className="h-4 w-4 mr-1" />
              <Badge variant="secondary" className="text-xs">
                Alto
              </Badge>
            </ToggleGroupItem>
            <ToggleGroupItem value="medium">
              <Clock className="h-4 w-4 mr-1" />
              <Badge variant="outline" className="text-xs">
                Médio
              </Badge>
            </ToggleGroupItem>
            <ToggleGroupItem value="low">
              <User className="h-4 w-4 mr-1" />
              <Badge variant="secondary" className="text-xs">
                Baixo
              </Badge>
            </ToggleGroupItem>
          </ToggleGroup>

          <div className="text-sm text-muted-foreground">
            Filtros ativos: {priorities.length} de 4
          </div>
        </CardContent>
      </Card>
    );
  },
};

export const ContactMethods: Story = {
  render: () => {
    const [contactMethods, setContactMethods] = useState<string[]>(['phone']);

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Métodos de Contato</CardTitle>
          <CardDescription>
            Selecione os métodos preferidos de contato
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleGroup
            type="multiple"
            value={contactMethods}
            onValueChange={setContactMethods}
            variant="outline"
          >
            <ToggleGroupItem value="phone">
              <Phone className="h-4 w-4 mr-2" />
              Telefone
            </ToggleGroupItem>
            <ToggleGroupItem value="email">
              <Mail className="h-4 w-4 mr-2" />
              E-mail
            </ToggleGroupItem>
            <ToggleGroupItem value="sms">
              <MessageSquare className="h-4 w-4 mr-2" />
              SMS
            </ToggleGroupItem>
            <ToggleGroupItem value="video">
              <Video className="h-4 w-4 mr-2" />
              Vídeo
            </ToggleGroupItem>
          </ToggleGroup>

          <div className="space-y-2">
            {contactMethods.map(method => (
              <div key={method} className="flex items-center gap-2 text-sm">
                <Badge variant="outline">
                  {method === 'phone' && 'Telefone'}
                  {method === 'email' && 'E-mail'}
                  {method === 'sms' && 'SMS'}
                  {method === 'video' && 'Videochamada'}
                </Badge>
                <span className="text-muted-foreground">ativo</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>Grupo Desabilitado</CardTitle>
        <CardDescription>Exemplo de toggle group desabilitado</CardDescription>
      </CardHeader>
      <CardContent>
        <ToggleGroup type="single" disabled>
          <ToggleGroupItem value="option1">Opção 1</ToggleGroupItem>
          <ToggleGroupItem value="option2">Opção 2</ToggleGroupItem>
          <ToggleGroupItem value="option3">Opção 3</ToggleGroupItem>
        </ToggleGroup>
      </CardContent>
    </Card>
  ),
};
