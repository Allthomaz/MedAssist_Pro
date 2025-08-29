import { Meta, StoryObj } from '@storybook/react-vite';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import {
  Activity,
  Heart,
  Thermometer,
  Droplets,
  Users,
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  Shield,
  Target,
  Brain,
  Eye,
  Stethoscope,
} from 'lucide-react';

const meta: Meta<typeof ChartContainer> = {
  title: 'UI/Chart',
  component: ChartContainer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente Chart baseado no Recharts para visualização de dados médicos, estatísticas e métricas no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Dados de exemplo para sinais vitais
const vitalSignsData = [
  {
    time: '08:00',
    pressao: 120,
    frequencia: 72,
    temperatura: 36.5,
    saturacao: 98,
  },
  {
    time: '10:00',
    pressao: 118,
    frequencia: 75,
    temperatura: 36.7,
    saturacao: 97,
  },
  {
    time: '12:00',
    pressao: 125,
    frequencia: 78,
    temperatura: 36.8,
    saturacao: 98,
  },
  {
    time: '14:00',
    pressao: 122,
    frequencia: 74,
    temperatura: 36.6,
    saturacao: 99,
  },
  {
    time: '16:00',
    pressao: 119,
    frequencia: 73,
    temperatura: 36.4,
    saturacao: 98,
  },
  {
    time: '18:00',
    pressao: 121,
    frequencia: 76,
    temperatura: 36.5,
    saturacao: 97,
  },
];

const vitalSignsConfig: ChartConfig = {
  pressao: {
    label: 'Pressão Arterial',
    color: 'hsl(var(--chart-1))',
    icon: Heart,
  },
  frequencia: {
    label: 'Frequência Cardíaca',
    color: 'hsl(var(--chart-2))',
    icon: Activity,
  },
  temperatura: {
    label: 'Temperatura',
    color: 'hsl(var(--chart-3))',
    icon: Thermometer,
  },
  saturacao: {
    label: 'Saturação O₂',
    color: 'hsl(var(--chart-4))',
    icon: Droplets,
  },
};

export const VitalSignsLineChart: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Monitoramento de Sinais Vitais
          </CardTitle>
          <CardDescription>
            Acompanhamento dos sinais vitais ao longo do dia - João Silva
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={vitalSignsConfig}>
            <LineChart
              accessibilityLayer
              data={vitalSignsData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="pressao"
                type="monotone"
                stroke="var(--color-pressao)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="frequencia"
                type="monotone"
                stroke="var(--color-frequencia)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  ),
};

// Dados para consultas por especialidade
const consultasData = [
  { especialidade: 'Cardiologia', consultas: 45, icon: Heart },
  { especialidade: 'Neurologia', consultas: 32, icon: Brain },
  { especialidade: 'Oftalmologia', consultas: 28, icon: Eye },
  { especialidade: 'Ortopedia', consultas: 38, icon: Shield },
  { especialidade: 'Pediatria', consultas: 52, icon: Users },
  { especialidade: 'Clínica Geral', consultas: 67, icon: Stethoscope },
];

const consultasConfig: ChartConfig = {
  consultas: {
    label: 'Consultas',
    color: 'hsl(var(--chart-1))',
  },
  Cardiologia: {
    label: 'Cardiologia',
    color: 'hsl(var(--chart-1))',
  },
  Neurologia: {
    label: 'Neurologia',
    color: 'hsl(var(--chart-2))',
  },
  Oftalmologia: {
    label: 'Oftalmologia',
    color: 'hsl(var(--chart-3))',
  },
  Ortopedia: {
    label: 'Ortopedia',
    color: 'hsl(var(--chart-4))',
  },
  Pediatria: {
    label: 'Pediatria',
    color: 'hsl(var(--chart-5))',
  },
  'Clínica Geral': {
    label: 'Clínica Geral',
    color: 'hsl(var(--chart-6))',
  },
};

export const ConsultationsBySpecialty: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Consultas por Especialidade
          </CardTitle>
          <CardDescription>
            Distribuição de consultas realizadas este mês
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={consultasConfig}>
            <BarChart
              accessibilityLayer
              data={consultasData}
              margin={{
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="especialidade"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={value => value.slice(0, 3)}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="consultas"
                fill="var(--color-consultas)"
                radius={8}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  ),
};

// Dados para ocupação de leitos
const leitosData = [
  { status: 'Ocupados', quantidade: 85, fill: 'hsl(var(--chart-1))' },
  { status: 'Disponíveis', quantidade: 25, fill: 'hsl(var(--chart-2))' },
  { status: 'Manutenção', quantidade: 5, fill: 'hsl(var(--chart-3))' },
  { status: 'Reservados', quantidade: 10, fill: 'hsl(var(--chart-4))' },
];

const leitosConfig: ChartConfig = {
  quantidade: {
    label: 'Leitos',
  },
  Ocupados: {
    label: 'Ocupados',
    color: 'hsl(var(--chart-1))',
  },
  Disponíveis: {
    label: 'Disponíveis',
    color: 'hsl(var(--chart-2))',
  },
  Manutenção: {
    label: 'Manutenção',
    color: 'hsl(var(--chart-3))',
  },
  Reservados: {
    label: 'Reservados',
    color: 'hsl(var(--chart-4))',
  },
};

export const BedOccupancyPieChart: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Ocupação de Leitos
          </CardTitle>
          <CardDescription>
            Status atual dos leitos hospitalares
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={leitosConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={leitosData}
                dataKey="quantidade"
                nameKey="status"
                innerRadius={60}
                strokeWidth={5}
              >
                {leitosData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="status" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  ),
};

// Dados para evolução de pacientes
const evolucaoData = [
  { mes: 'Jan', novos: 120, retornos: 85, altas: 95 },
  { mes: 'Fev', novos: 135, retornos: 92, altas: 88 },
  { mes: 'Mar', novos: 148, retornos: 105, altas: 102 },
  { mes: 'Abr', novos: 142, retornos: 98, altas: 96 },
  { mes: 'Mai', novos: 156, retornos: 112, altas: 108 },
  { mes: 'Jun', novos: 163, retornos: 118, altas: 115 },
];

const evolucaoConfig: ChartConfig = {
  novos: {
    label: 'Novos Pacientes',
    color: 'hsl(var(--chart-1))',
    icon: Users,
  },
  retornos: {
    label: 'Retornos',
    color: 'hsl(var(--chart-2))',
    icon: Calendar,
  },
  altas: {
    label: 'Altas Médicas',
    color: 'hsl(var(--chart-3))',
    icon: CheckCircle,
  },
};

export const PatientEvolutionAreaChart: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evolução de Pacientes
          </CardTitle>
          <CardDescription>
            Acompanhamento mensal de novos pacientes, retornos e altas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={evolucaoConfig}>
            <AreaChart
              accessibilityLayer
              data={evolucaoData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="mes"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="fillNovos" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-novos)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-novos)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillRetornos" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-retornos)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-retornos)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillAltas" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-altas)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-altas)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="altas"
                type="natural"
                fill="url(#fillAltas)"
                fillOpacity={0.4}
                stroke="var(--color-altas)"
                stackId="a"
              />
              <Area
                dataKey="retornos"
                type="natural"
                fill="url(#fillRetornos)"
                fillOpacity={0.4}
                stroke="var(--color-retornos)"
                stackId="a"
              />
              <Area
                dataKey="novos"
                type="natural"
                fill="url(#fillNovos)"
                fillOpacity={0.4}
                stroke="var(--color-novos)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  ),
};

// Dados para tempo de espera
const tempoEsperaData = [
  { hora: '08:00', tempo: 15 },
  { hora: '09:00', tempo: 22 },
  { hora: '10:00', tempo: 18 },
  { hora: '11:00', tempo: 25 },
  { hora: '12:00', tempo: 35 },
  { hora: '13:00', tempo: 28 },
  { hora: '14:00', tempo: 20 },
  { hora: '15:00', tempo: 16 },
  { hora: '16:00', tempo: 19 },
  { hora: '17:00', tempo: 24 },
];

const tempoEsperaConfig: ChartConfig = {
  tempo: {
    label: 'Tempo de Espera (min)',
    color: 'hsl(var(--chart-1))',
    icon: Clock,
  },
};

export const WaitingTimeChart: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Tempo de Espera
              </CardTitle>
              <CardDescription>
                Tempo médio de espera por horário
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Dentro da meta
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={tempoEsperaConfig}>
            <AreaChart
              accessibilityLayer
              data={tempoEsperaData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="hora"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={value => `${value}min`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="tempo"
                type="natural"
                fill="var(--color-tempo)"
                fillOpacity={0.4}
                stroke="var(--color-tempo)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  ),
};

// Dados para satisfação do paciente
const satisfacaoData = [
  { categoria: 'Atendimento', nota: 4.8 },
  { categoria: 'Tempo Espera', nota: 4.2 },
  { categoria: 'Instalações', nota: 4.6 },
  { categoria: 'Profissionais', nota: 4.9 },
  { categoria: 'Comunicação', nota: 4.5 },
  { categoria: 'Geral', nota: 4.6 },
];

const satisfacaoConfig: ChartConfig = {
  nota: {
    label: 'Nota de Satisfação',
    color: 'hsl(var(--chart-1))',
  },
};

export const PatientSatisfactionChart: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Satisfação do Paciente
          </CardTitle>
          <CardDescription>
            Avaliação média por categoria (escala 1-5)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={satisfacaoConfig}>
            <BarChart
              accessibilityLayer
              data={satisfacaoData}
              layout="horizontal"
              margin={{
                left: 80,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="categoria"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                width={70}
              />
              <XAxis
                type="number"
                domain={[0, 5]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="nota" fill="var(--color-nota)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  ),
};

export const SimpleLineChart: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Gráfico Simples</CardTitle>
          <CardDescription>Exemplo básico de linha</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: 'Valor',
                color: 'hsl(var(--chart-1))',
              },
            }}
          >
            <LineChart
              accessibilityLayer
              data={[
                { month: 'Jan', value: 186 },
                { month: 'Fev', value: 305 },
                { month: 'Mar', value: 237 },
                { month: 'Abr', value: 273 },
                { month: 'Mai', value: 209 },
                { month: 'Jun', value: 214 },
              ]}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="value"
                type="natural"
                stroke="var(--color-value)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  ),
};
