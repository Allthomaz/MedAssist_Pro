import { Meta, StoryObj } from '@storybook/react-vite';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ChevronDown,
  ChevronRight,
  User,
  Calendar,
  FileText,
  Activity,
  Heart,
  Thermometer,
  Droplets,
  Pill,
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Shield,
  Eye,
  Brain,
  Zap,
  Target,
  Users,
  Settings,
  Info,
  History,
  FileImage,
  TestTube,
} from 'lucide-react';
import { useState } from 'react';

const meta: Meta<typeof Collapsible> = {
  title: 'UI/Collapsible',
  component: Collapsible,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente Collapsible para criar seções expansíveis de conteúdo, útil para organizar informações médicas de forma hierárquica.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Componente auxiliar para demonstrar o collapsible
function CollapsibleDemo({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  badge,
  description,
}: {
  title: string;
  icon?: any;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string;
  description?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="w-full max-w-2xl">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {Icon && <Icon className="h-5 w-5" />}
                <div>
                  <CardTitle className="text-left">{title}</CardTitle>
                  {description && (
                    <CardDescription className="text-left">
                      {description}
                    </CardDescription>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {badge && <Badge variant="secondary">{badge}</Badge>}
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <Separator className="mb-4" />
            {children}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export const Default: Story = {
  render: () => (
    <CollapsibleDemo title="Informações do Paciente" icon={User}>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="font-medium">Nome:</span>
          <span>João Silva Santos</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">CPF:</span>
          <span>123.456.789-00</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Data de Nascimento:</span>
          <span>15/03/1985</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Convênio:</span>
          <span>Unimed Premium</span>
        </div>
      </div>
    </CollapsibleDemo>
  ),
};

export const PatientHistory: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-2xl">
      <CollapsibleDemo
        title="Histórico Médico"
        icon={History}
        badge="3 registros"
        description="Consultas e procedimentos anteriores"
      >
        <div className="space-y-4">
          <div className="border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Consulta Cardiológica</span>
              <Badge variant="outline">15/11/2024</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Avaliação de rotina. Pressão arterial controlada. Manter medicação
              atual.
            </p>
          </div>
          <div className="border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Exame de Sangue</span>
              <Badge variant="outline">02/11/2024</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Hemograma completo. Todos os valores dentro da normalidade.
            </p>
          </div>
        </div>
      </CollapsibleDemo>

      <CollapsibleDemo
        title="Medicações Atuais"
        icon={Pill}
        badge="2 medicamentos"
        defaultOpen
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium">Losartana 50mg</span>
              <p className="text-sm text-muted-foreground">
                1x ao dia, pela manhã
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800">Ativo</Badge>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <span className="font-medium">Sinvastatina 20mg</span>
              <p className="text-sm text-muted-foreground">
                1x ao dia, à noite
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800">Ativo</Badge>
          </div>
        </div>
      </CollapsibleDemo>
    </div>
  ),
};

export const VitalSigns: Story = {
  render: () => (
    <CollapsibleDemo
      title="Sinais Vitais"
      icon={Activity}
      badge="Última medição: hoje"
      description="Monitoramento dos sinais vitais do paciente"
      defaultOpen
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 border rounded-lg">
          <Heart className="h-8 w-8 text-red-500" />
          <div>
            <p className="font-medium">Pressão Arterial</p>
            <p className="text-2xl font-bold">120/80</p>
            <p className="text-sm text-muted-foreground">mmHg</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 border rounded-lg">
          <Activity className="h-8 w-8 text-blue-500" />
          <div>
            <p className="font-medium">Frequência Cardíaca</p>
            <p className="text-2xl font-bold">72</p>
            <p className="text-sm text-muted-foreground">bpm</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 border rounded-lg">
          <Thermometer className="h-8 w-8 text-orange-500" />
          <div>
            <p className="font-medium">Temperatura</p>
            <p className="text-2xl font-bold">36.5</p>
            <p className="text-sm text-muted-foreground">°C</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 border rounded-lg">
          <Droplets className="h-8 w-8 text-cyan-500" />
          <div>
            <p className="font-medium">Saturação O₂</p>
            <p className="text-2xl font-bold">98</p>
            <p className="text-sm text-muted-foreground">%</p>
          </div>
        </div>
      </div>
    </CollapsibleDemo>
  ),
};

export const ExamResults: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-2xl">
      <CollapsibleDemo
        title="Exames de Imagem"
        icon={FileImage}
        badge="2 exames"
        description="Resultados de exames radiológicos"
      >
        <div className="space-y-3">
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">Raio-X de Tórax</span>
              <div className="flex gap-2">
                <Badge variant="outline">20/11/2024</Badge>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Normal
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Campos pulmonares livres. Coração de tamanho normal. Sem
              alterações significativas.
            </p>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Visualizar Imagem
            </Button>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">Ultrassom Abdominal</span>
              <div className="flex gap-2">
                <Badge variant="outline">18/11/2024</Badge>
                <Badge className="bg-yellow-100 text-yellow-800">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Atenção
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Pequeno cálculo na vesícula biliar. Recomenda-se acompanhamento.
            </p>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Visualizar Imagem
            </Button>
          </div>
        </div>
      </CollapsibleDemo>

      <CollapsibleDemo
        title="Exames Laboratoriais"
        icon={TestTube}
        badge="1 exame"
        description="Resultados de análises clínicas"
      >
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Hemograma Completo</span>
            <div className="flex gap-2">
              <Badge variant="outline">22/11/2024</Badge>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Normal
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span>Hemoglobina:</span>
              <span className="font-medium">14.2 g/dL</span>
            </div>
            <div className="flex justify-between">
              <span>Hematócrito:</span>
              <span className="font-medium">42.1%</span>
            </div>
            <div className="flex justify-between">
              <span>Leucócitos:</span>
              <span className="font-medium">7.200/mm³</span>
            </div>
            <div className="flex justify-between">
              <span>Plaquetas:</span>
              <span className="font-medium">285.000/mm³</span>
            </div>
          </div>
        </div>
      </CollapsibleDemo>
    </div>
  ),
};

export const ContactInformation: Story = {
  render: () => (
    <CollapsibleDemo
      title="Informações de Contato"
      icon={Phone}
      description="Dados para comunicação com o paciente"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Telefone Principal</p>
            <p className="text-muted-foreground">(11) 99999-9999</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">E-mail</p>
            <p className="text-muted-foreground">joao.silva@email.com</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Endereço</p>
            <p className="text-muted-foreground">
              Rua das Flores, 123 - Centro
              <br />
              São Paulo, SP - 01234-567
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Contato de Emergência</p>
            <p className="text-muted-foreground">
              Maria Silva (Esposa) - (11) 88888-8888
            </p>
          </div>
        </div>
      </div>
    </CollapsibleDemo>
  ),
};

export const AppointmentSchedule: Story = {
  render: () => (
    <CollapsibleDemo
      title="Próximas Consultas"
      icon={Calendar}
      badge="3 agendadas"
      description="Agenda de consultas e procedimentos"
      defaultOpen
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div>
              <p className="font-medium">Consulta Cardiológica</p>
              <p className="text-sm text-muted-foreground">Dr. Carlos Mendes</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">25/11/2024</p>
            <p className="text-sm text-muted-foreground">14:30</p>
          </div>
        </div>
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div>
              <p className="font-medium">Exame de Sangue</p>
              <p className="text-sm text-muted-foreground">
                Laboratório Central
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">28/11/2024</p>
            <p className="text-sm text-muted-foreground">08:00</p>
          </div>
        </div>
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div>
              <p className="font-medium">Retorno Cardiologia</p>
              <p className="text-sm text-muted-foreground">Dr. Carlos Mendes</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">15/12/2024</p>
            <p className="text-sm text-muted-foreground">15:00</p>
          </div>
        </div>
      </div>
    </CollapsibleDemo>
  ),
};

export const InsuranceInformation: Story = {
  render: () => (
    <CollapsibleDemo
      title="Informações do Convênio"
      icon={Shield}
      badge="Ativo"
      description="Dados do plano de saúde"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium mb-1">Operadora</p>
            <p className="text-muted-foreground">Unimed São Paulo</p>
          </div>
          <div>
            <p className="font-medium mb-1">Plano</p>
            <p className="text-muted-foreground">Premium Plus</p>
          </div>
          <div>
            <p className="font-medium mb-1">Número da Carteira</p>
            <p className="text-muted-foreground">123456789012345</p>
          </div>
          <div>
            <p className="font-medium mb-1">Validade</p>
            <p className="text-muted-foreground">31/12/2024</p>
          </div>
        </div>
        <Separator />
        <div>
          <p className="font-medium mb-2">Coberturas Incluídas</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Consultas</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Exames</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Internações</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Cirurgias</span>
            </div>
          </div>
        </div>
      </div>
    </CollapsibleDemo>
  ),
};

export const SimpleCollapsible: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="w-full max-w-md">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span>Mostrar Detalhes</span>
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="border rounded-lg p-4 space-y-2">
              <p className="text-sm">
                Este é um exemplo simples de conteúdo colapsível.
              </p>
              <p className="text-sm text-muted-foreground">
                Você pode incluir qualquer conteúdo aqui.
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  },
};
