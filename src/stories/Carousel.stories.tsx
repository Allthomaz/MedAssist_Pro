import { Meta, StoryObj } from '@storybook/react-vite';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  FileImage,
  Heart,
  Brain,
  Bone,
  Eye,
  Stethoscope,
  Activity,
  TestTube,
  Calendar,
  User,
  Clock,
  MapPin,
  Phone,
  Mail,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Zap,
  Shield,
  Award,
  Target,
} from 'lucide-react';

const meta: Meta<typeof Carousel> = {
  title: 'UI/Carousel',
  component: Carousel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente Carousel para exibir múltiplas imagens médicas, informações de pacientes ou dados em sequência no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        <CarouselItem>
          <div className="p-1">
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-6">
                <span className="text-4xl font-semibold">1</span>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="p-1">
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-6">
                <span className="text-4xl font-semibold">2</span>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="p-1">
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-6">
                <span className="text-4xl font-semibold">3</span>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

// Casos de uso médicos
export const MedicalImaging: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileImage className="h-5 w-5" />
            Exames de Imagem - João Silva
          </CardTitle>
          <CardDescription>
            Navegue pelos diferentes exames realizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Carousel className="w-full">
            <CarouselContent>
              <CarouselItem>
                <Card>
                  <CardContent className="p-6">
                    <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <Bone className="h-12 w-12 mb-2" />
                        <h3 className="text-lg font-semibold">Raio-X Tórax</h3>
                        <p className="text-sm">15/08/2024 - 14:30</p>
                        <Badge className="mt-2 bg-green-100 text-green-800">
                          Normal
                        </Badge>
                      </div>
                    </AspectRatio>
                  </CardContent>
                </Card>
              </CarouselItem>
              <CarouselItem>
                <Card>
                  <CardContent className="p-6">
                    <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <Brain className="h-12 w-12 mb-2" />
                        <h3 className="text-lg font-semibold">
                          Ressonância Magnética
                        </h3>
                        <p className="text-sm">12/08/2024 - 09:15</p>
                        <Badge variant="outline" className="mt-2">
                          Em análise
                        </Badge>
                      </div>
                    </AspectRatio>
                  </CardContent>
                </Card>
              </CarouselItem>
              <CarouselItem>
                <Card>
                  <CardContent className="p-6">
                    <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <Heart className="h-12 w-12 mb-2" />
                        <h3 className="text-lg font-semibold">
                          Ecocardiograma
                        </h3>
                        <p className="text-sm">10/08/2024 - 16:00</p>
                        <Badge className="mt-2 bg-blue-100 text-blue-800">
                          Alteração leve
                        </Badge>
                      </div>
                    </AspectRatio>
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </CardContent>
      </Card>
    </div>
  ),
};

export const PatientCards: Story = {
  render: () => (
    <div className="w-full max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Pacientes Recentes
          </CardTitle>
          <CardDescription>Últimos pacientes atendidos hoje</CardDescription>
        </CardHeader>
        <CardContent>
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Maria Santos</CardTitle>
                      <Badge className="bg-green-100 text-green-800">
                        Consulta
                      </Badge>
                    </div>
                    <CardDescription>Cardiologia - 14:30</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span>Pressão: 120/80 mmHg</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Activity className="h-4 w-4 text-blue-500" />
                      <span>FC: 72 bpm</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Consulta finalizada</span>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
              <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">João Silva</CardTitle>
                      <Badge variant="outline">Aguardando</Badge>
                    </div>
                    <CardDescription>Neurologia - 15:00</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Brain className="h-4 w-4 text-purple-500" />
                      <span>Exame: Ressonância</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span>Chegada: 14:45</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Info className="h-4 w-4 text-blue-500" />
                      <span>Primeira consulta</span>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
              <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Ana Costa</CardTitle>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Retorno
                      </Badge>
                    </div>
                    <CardDescription>Oftalmologia - 15:30</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Eye className="h-4 w-4 text-indigo-500" />
                      <span>Acuidade: 20/20</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TestTube className="h-4 w-4 text-green-500" />
                      <span>Exames: OK</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>Paciente VIP</span>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
              <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Carlos Mendes</CardTitle>
                      <Badge className="bg-red-100 text-red-800">Urgente</Badge>
                    </div>
                    <CardDescription>Emergência - 16:00</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span>Dor no peito</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span>Prioridade alta</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Stethoscope className="h-4 w-4 text-blue-500" />
                      <span>Triagem: Nível 2</span>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </CardContent>
      </Card>
    </div>
  ),
};

export const VitalSigns: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Sinais Vitais - Monitoramento
          </CardTitle>
          <CardDescription>
            Acompanhamento dos sinais vitais ao longo do dia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Carousel className="w-full">
            <CarouselContent>
              <CarouselItem>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-500" />
                        Pressão Arterial
                      </span>
                      <Badge className="bg-green-100 text-green-800">
                        Normal
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className="text-4xl font-bold text-red-500">
                        120/80
                      </div>
                      <div className="text-sm text-muted-foreground">mmHg</div>
                      <div className="flex justify-between text-sm">
                        <span>Sistólica: 120</span>
                        <span>Diastólica: 80</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Última medição: 15:30
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
              <CarouselItem>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-500" />
                        Frequência Cardíaca
                      </span>
                      <Badge className="bg-green-100 text-green-800">
                        Normal
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className="text-4xl font-bold text-blue-500">72</div>
                      <div className="text-sm text-muted-foreground">bpm</div>
                      <div className="flex justify-center">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Ritmo regular - 15:30
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
              <CarouselItem>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-purple-500" />
                        Temperatura
                      </span>
                      <Badge className="bg-green-100 text-green-800">
                        Normal
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className="text-4xl font-bold text-purple-500">
                        36.5
                      </div>
                      <div className="text-sm text-muted-foreground">°C</div>
                      <div className="text-sm">Axilar</div>
                      <div className="text-xs text-muted-foreground">
                        Medição: 15:25
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
              <CarouselItem>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-500" />
                        Saturação O₂
                      </span>
                      <Badge className="bg-green-100 text-green-800">
                        Excelente
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className="text-4xl font-bold text-green-500">
                        98
                      </div>
                      <div className="text-sm text-muted-foreground">%</div>
                      <div className="flex justify-center">
                        <Award className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Oxímetro - 15:30
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </CardContent>
      </Card>
    </div>
  ),
};

export const AppointmentSchedule: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Agenda do Dia - 15/08/2024
          </CardTitle>
          <CardDescription>Consultas e procedimentos agendados</CardDescription>
        </CardHeader>
        <CardContent>
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              <CarouselItem className="pl-2 md:pl-4 md:basis-1/2">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">09:00 - 09:30</CardTitle>
                      <Badge className="bg-blue-100 text-blue-800">
                        Consulta
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="font-semibold">Dr. Carlos Mendes</div>
                    <div className="text-sm text-muted-foreground">
                      Cardiologia
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4" />
                      <span>Maria Santos</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>Sala 201</span>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
              <CarouselItem className="pl-2 md:pl-4 md:basis-1/2">
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">10:00 - 10:45</CardTitle>
                      <Badge className="bg-green-100 text-green-800">
                        Procedimento
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="font-semibold">Dra. Ana Costa</div>
                    <div className="text-sm text-muted-foreground">
                      Oftalmologia
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4" />
                      <span>João Silva</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>Sala 105</span>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
              <CarouselItem className="pl-2 md:pl-4 md:basis-1/2">
                <Card className="border-l-4 border-l-yellow-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">11:30 - 12:00</CardTitle>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Retorno
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="font-semibold">Dr. Roberto Lima</div>
                    <div className="text-sm text-muted-foreground">
                      Ortopedia
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4" />
                      <span>Ana Oliveira</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>Sala 303</span>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
              <CarouselItem className="pl-2 md:pl-4 md:basis-1/2">
                <Card className="border-l-4 border-l-red-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">14:00 - 14:30</CardTitle>
                      <Badge className="bg-red-100 text-red-800">Urgente</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="font-semibold">Dra. Lucia Santos</div>
                    <div className="text-sm text-muted-foreground">
                      Emergência
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4" />
                      <span>Carlos Mendes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>Pronto Socorro</span>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </CardContent>
      </Card>
    </div>
  ),
};

export const VerticalOrientation: Story = {
  render: () => (
    <div className="w-full max-w-xs">
      <Card>
        <CardHeader>
          <CardTitle>Carousel Vertical</CardTitle>
          <CardDescription>Navegação vertical para listas</CardDescription>
        </CardHeader>
        <CardContent>
          <Carousel orientation="vertical" className="w-full max-w-xs">
            <CarouselContent className="-mt-1 h-[200px]">
              <CarouselItem className="pt-1 md:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex items-center justify-center p-6">
                      <span className="text-2xl font-semibold">1</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
              <CarouselItem className="pt-1 md:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex items-center justify-center p-6">
                      <span className="text-2xl font-semibold">2</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
              <CarouselItem className="pt-1 md:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex items-center justify-center p-6">
                      <span className="text-2xl font-semibold">3</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
              <CarouselItem className="pt-1 md:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex items-center justify-center p-6">
                      <span className="text-2xl font-semibold">4</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
              <CarouselItem className="pt-1 md:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex items-center justify-center p-6">
                      <span className="text-2xl font-semibold">5</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </CardContent>
      </Card>
    </div>
  ),
};

export const WithoutControls: Story = {
  render: () => (
    <div className="w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>Sem Controles</CardTitle>
          <CardDescription>
            Carousel automático ou controlado por gestos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Carousel className="w-full max-w-xs">
            <CarouselContent>
              <CarouselItem>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <div className="text-center">
                        <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
                        <span className="text-sm font-semibold">
                          Cardiologia
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <div className="text-center">
                        <Brain className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                        <span className="text-sm font-semibold">
                          Neurologia
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <div className="text-center">
                        <Eye className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                        <span className="text-sm font-semibold">
                          Oftalmologia
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </CardContent>
      </Card>
    </div>
  ),
};
