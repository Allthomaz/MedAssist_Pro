import { Meta, StoryObj } from '@storybook/react-vite';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Info,
  HelpCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Clock,
  Calendar,
  User,
  Phone,
  Pill,
  Stethoscope,
  FileText,
  Settings,
  Bell,
  Shield,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Share,
  Copy,
  Star,
  Bookmark,
} from 'lucide-react';

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente Tooltip para exibir informações adicionais no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <TooltipProvider>
        <div className="p-8">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

// Tooltip básico
export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">
          <Info className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Informações adicionais sobre este item</p>
      </TooltipContent>
    </Tooltip>
  ),
};

// Tooltip com diferentes posições
export const Positions: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-8 place-items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Top</Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Tooltip no topo</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Right</Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Tooltip à direita</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Tooltip embaixo</p>
        </TooltipContent>
      </Tooltip>

      <div></div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Left</Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Tooltip à esquerda</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

// Tooltips com ícones médicos
export const MedicalIcons: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            <Heart className="h-4 w-4 text-red-500" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Frequência Cardíaca: 72 BPM</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            <Thermometer className="h-4 w-4 text-orange-500" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Temperatura: 36.8°C</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            <Droplets className="h-4 w-4 text-blue-500" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Saturação de O2: 98%</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            <Activity className="h-4 w-4 text-purple-500" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Pressão Arterial: 120/80 mmHg</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

// Tooltips em badges de status
export const StatusBadges: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className="bg-green-500 text-white cursor-help">
            <CheckCircle className="h-3 w-3 mr-1" />
            Ativo
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Paciente com tratamento ativo</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className="bg-yellow-500 text-white cursor-help">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Aguardando resultados de exames</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className="bg-red-500 text-white cursor-help">
            <XCircle className="h-3 w-3 mr-1" />
            Crítico
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Paciente requer atenção imediata</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="cursor-help">
            <Clock className="h-3 w-3 mr-1" />
            Agendado
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Consulta agendada para 15/08/2024 às 14:30</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

// Tooltips em card de paciente
export const PatientCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="" alt="João Silva" />
              <AvatarFallback className="bg-blue-500 text-white">
                JS
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="flex items-center gap-2">
                João Silva
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Shield className="h-4 w-4 text-green-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Paciente verificado e ativo no sistema</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
              <CardDescription>Paciente #12345</CardDescription>
            </div>
          </div>
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Visualizar prontuário completo</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar informações do paciente</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ligar para: (11) 99999-9999</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Calendar className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Última consulta: 10/08/2024</p>
              </TooltipContent>
            </Tooltip>
            <span className="text-sm">45 anos, Masculino</span>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Stethoscope className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Especialidade: Cardiologia</p>
              </TooltipContent>
            </Tooltip>
            <span className="text-sm">Hipertensão, Diabetes Tipo 2</span>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Pill className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <p>Medicações ativas:</p>
                  <p>• Losartana 50mg - 1x/dia</p>
                  <p>• Metformina 850mg - 2x/dia</p>
                </div>
              </TooltipContent>
            </Tooltip>
            <span className="text-sm">2 medicações ativas</span>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

// Tooltips com conteúdo rico
export const RichContent: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Exame de Sangue
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[300px]">
          <div className="space-y-2">
            <p className="font-semibold">Hemograma Completo</p>
            <div className="text-xs space-y-1">
              <p>Data: 12/08/2024</p>
              <p>Status: Disponível</p>
              <p>Valores normais exceto:</p>
              <p className="text-red-500">• Glicose: 145 mg/dL (↑)</p>
              <p className="text-yellow-500">• Colesterol: 210 mg/dL (↑)</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">
            <User className="h-4 w-4 mr-2" />
            Dr. Silva
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[250px]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-500 text-white text-xs">
                  DS
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">Dr. Carlos Silva</p>
                <p className="text-xs text-muted-foreground">CRM 12345-SP</p>
              </div>
            </div>
            <div className="text-xs space-y-1">
              <p>Especialidade: Cardiologia</p>
              <p>Experiência: 15 anos</p>
              <p>Avaliação: ⭐⭐⭐⭐⭐ (4.9/5)</p>
              <p>Próximo horário: 16/08 às 09:00</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Notificações
            <Badge className="ml-2 bg-red-500 text-white">3</Badge>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[280px]">
          <div className="space-y-2">
            <p className="font-semibold text-sm">Notificações Pendentes</p>
            <div className="text-xs space-y-2">
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 bg-red-500 rounded-full mt-1"></div>
                <div>
                  <p className="font-medium">Consulta cancelada</p>
                  <p className="text-muted-foreground">Maria Santos - 15/08</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 bg-yellow-500 rounded-full mt-1"></div>
                <div>
                  <p className="font-medium">Exame disponível</p>
                  <p className="text-muted-foreground">
                    João Silva - Hemograma
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-1"></div>
                <div>
                  <p className="font-medium">Nova mensagem</p>
                  <p className="text-muted-foreground">Dr. Santos - Urgente</p>
                </div>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

// Tooltips de ajuda
export const HelpTooltips: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Formulário de Consulta
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Preencha todos os campos obrigatórios para registrar a consulta
              </p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            Queixa Principal
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3 w-3 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Descreva o motivo principal da consulta em poucas palavras
                </p>
              </TooltipContent>
            </Tooltip>
          </label>
          <div className="p-2 border rounded text-sm text-muted-foreground">
            Ex: Dor no peito há 2 dias
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            Pressão Arterial
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3 w-3 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <p>Formato: Sistólica/Diastólica</p>
                  <p>Valores normais: 120/80 mmHg</p>
                  <p>Hipertensão: ≥140/90 mmHg</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </label>
          <div className="p-2 border rounded text-sm text-muted-foreground">
            Ex: 130/85
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            CID-10
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3 w-3 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[250px]">
                <div className="space-y-1">
                  <p>Classificação Internacional de Doenças</p>
                  <p>Exemplos:</p>
                  <p>• I10 - Hipertensão essencial</p>
                  <p>• E11 - Diabetes mellitus tipo 2</p>
                  <p>• J06 - Infecções agudas das vias aéreas</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </label>
          <div className="p-2 border rounded text-sm text-muted-foreground">
            Ex: I20.9 - Angina pectoris
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

// Tooltips de ações
export const ActionTooltips: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="outline">
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Baixar prontuário em PDF</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="outline">
              <Upload className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Enviar exames</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="outline">
              <Share className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Compartilhar com outro médico</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="outline">
              <Copy className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copiar informações</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="outline">
              <Star className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Marcar como favorito</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="outline">
              <Bookmark className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Salvar para revisão</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Excluir registro (ação irreversível)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="outline">
              <Settings className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Configurações avançadas</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  ),
};

// Tooltips com delay customizado
export const CustomDelay: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button variant="outline">Sem Delay</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Aparece imediatamente</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <Button variant="outline">Delay Normal</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Aparece após 500ms</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip delayDuration={1000}>
        <TooltipTrigger asChild>
          <Button variant="outline">Delay Longo</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Aparece após 1 segundo</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

// Tooltips em tabela médica
export const MedicalTable: Story = {
  render: () => (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>Resultados de Exames</CardTitle>
        <CardDescription>Últimos exames laboratoriais</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-4 p-3 border rounded-lg">
            <div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm font-medium cursor-help">Glicose</p>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    <p>Glicose em jejum</p>
                    <p>Valor normal: 70-99 mg/dL</p>
                    <p>Pré-diabetes: 100-125 mg/dL</p>
                    <p>Diabetes: ≥126 mg/dL</p>
                  </div>
                </TooltipContent>
              </Tooltip>
              <p className="text-lg font-bold text-red-500">145 mg/dL</p>
              <p className="text-xs text-muted-foreground">12/08/2024</p>
            </div>

            <div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm font-medium cursor-help">Colesterol</p>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    <p>Colesterol total</p>
                    <p>Desejável: &lt;200 mg/dL</p>
                    <p>Limítrofe: 200-239 mg/dL</p>
                    <p>Alto: ≥240 mg/dL</p>
                  </div>
                </TooltipContent>
              </Tooltip>
              <p className="text-lg font-bold text-yellow-500">210 mg/dL</p>
              <p className="text-xs text-muted-foreground">12/08/2024</p>
            </div>

            <div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm font-medium cursor-help">Hemoglobina</p>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    <p>Hemoglobina (Hb)</p>
                    <p>Homens: 13.5-17.5 g/dL</p>
                    <p>Mulheres: 12.0-15.5 g/dL</p>
                    <p>Indica capacidade de transporte de oxigênio</p>
                  </div>
                </TooltipContent>
              </Tooltip>
              <p className="text-lg font-bold text-green-500">14.2 g/dL</p>
              <p className="text-xs text-muted-foreground">12/08/2024</p>
            </div>

            <div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm font-medium cursor-help">Creatinina</p>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    <p>Creatinina sérica</p>
                    <p>Homens: 0.7-1.3 mg/dL</p>
                    <p>Mulheres: 0.6-1.1 mg/dL</p>
                    <p>Indica função renal</p>
                  </div>
                </TooltipContent>
              </Tooltip>
              <p className="text-lg font-bold text-green-500">0.9 mg/dL</p>
              <p className="text-xs text-muted-foreground">12/08/2024</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};
