import type { Meta, StoryObj } from '@storybook/react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  Activity,
  FileText,
  Clock,
  Stethoscope,
  Pill,
  AlertTriangle,
} from 'lucide-react';

const meta = {
  title: 'UI/HoverCard',
  component: HoverCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente HoverCard para exibir informações adicionais ao passar o mouse sobre elementos no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// HoverCard básico
export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@medassist</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarFallback>MA</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@medassist</h4>
            <p className="text-sm">
              Sistema de gestão médica completo para clínicas e hospitais.
            </p>
            <div className="flex items-center pt-2">
              <Calendar className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-xs text-muted-foreground">
                Ativo desde Janeiro 2024
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

// Informações do Médico
export const DoctorInfo: Story = {
  render: () => (
    <div className="p-8">
      <p className="text-sm text-muted-foreground mb-4">
        Passe o mouse sobre o nome do médico para ver mais informações:
      </p>
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link" className="text-base font-medium">
            Dr. João Silva
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-96">
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-medical-blue text-white">
                  JS
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 flex-1">
                <h4 className="text-lg font-semibold">Dr. João Silva</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    <Stethoscope className="h-3 w-3 mr-1" />
                    Cardiologista
                  </Badge>
                  <Badge variant="outline">CRM 12345-SP</Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center text-sm">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>joao.silva@medassist.com</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Consultório 205, Ala B</span>
              </div>
            </div>

            <Separator />

            <div className="text-sm text-muted-foreground">
              <p>Especialista em cardiologia com 15 anos de experiência.</p>
              <p className="mt-1">Próxima disponibilidade: Hoje às 14:30</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};

// Informações do Paciente
export const PatientInfo: Story = {
  render: () => (
    <div className="p-8">
      <p className="text-sm text-muted-foreground mb-4">
        Passe o mouse sobre o nome do paciente:
      </p>
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link" className="text-base font-medium">
            Maria Santos
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-96">
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-medical-green text-white">
                  MS
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 flex-1">
                <h4 className="text-lg font-semibold">Maria Santos</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">45 anos</Badge>
                  <Badge variant="outline">ID: #12345</Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">
                  Última Consulta
                </p>
                <p>15/01/2024</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Convênio</p>
                <p>Unimed Premium</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <Heart className="mr-2 h-4 w-4 text-red-500" />
                  Pressão Arterial
                </span>
                <span className="font-medium">120/80 mmHg</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <Activity className="mr-2 h-4 w-4 text-blue-500" />
                  Frequência Cardíaca
                </span>
                <span className="font-medium">72 bpm</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">
                Alergia: Penicilina
              </span>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};

// Medicamento
export const MedicationInfo: Story = {
  render: () => (
    <div className="p-8">
      <p className="text-sm text-muted-foreground mb-4">
        Passe o mouse sobre o medicamento:
      </p>
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link" className="text-base font-medium">
            <Pill className="mr-2 h-4 w-4" />
            Losartana 50mg
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold flex items-center">
                <Pill className="mr-2 h-5 w-5 text-medical-blue" />
                Losartana Potássica 50mg
              </h4>
              <p className="text-sm text-muted-foreground">Anti-hipertensivo</p>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div>
                <p className="font-medium">Posologia:</p>
                <p>1 comprimido ao dia, pela manhã</p>
              </div>
              <div>
                <p className="font-medium">Duração:</p>
                <p>Uso contínuo - 30 dias</p>
              </div>
              <div>
                <p className="font-medium">Laboratório:</p>
                <p>EMS Pharma</p>
              </div>
            </div>

            <Separator />

            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Efeitos colaterais comuns:</p>
              <p>Tontura, dor de cabeça, fadiga</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};

// Exame Médico
export const ExamInfo: Story = {
  render: () => (
    <div className="p-8">
      <p className="text-sm text-muted-foreground mb-4">
        Passe o mouse sobre o exame:
      </p>
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link" className="text-base font-medium">
            <FileText className="mr-2 h-4 w-4" />
            Hemograma Completo
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-96">
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold flex items-center">
                <FileText className="mr-2 h-5 w-5 text-medical-blue" />
                Hemograma Completo
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">Laboratório</Badge>
                <Badge variant="outline">15/01/2024</Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Hemácias</p>
                  <p className="text-green-600 font-medium">4.5 M/μL ✓</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">
                    Leucócitos
                  </p>
                  <p className="text-green-600 font-medium">7.2 K/μL ✓</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Plaquetas</p>
                  <p className="text-green-600 font-medium">280 K/μL ✓</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">
                    Hemoglobina
                  </p>
                  <p className="text-green-600 font-medium">14.2 g/dL ✓</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status:</span>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Resultados Normais
              </Badge>
            </div>

            <div className="text-xs text-muted-foreground">
              <p>Laboratório: LabMed | Dr. Responsável: Ana Costa</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};

// Agendamento
export const AppointmentInfo: Story = {
  render: () => (
    <div className="p-8">
      <p className="text-sm text-muted-foreground mb-4">
        Passe o mouse sobre o agendamento:
      </p>
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link" className="text-base font-medium">
            <Clock className="mr-2 h-4 w-4" />
            Consulta - 14:30
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-medical-blue" />
                Consulta Cardiológica
              </h4>
              <p className="text-sm text-muted-foreground">
                Hoje, 15 de Janeiro - 14:30
              </p>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paciente:</span>
                <span className="font-medium">Maria Santos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Médico:</span>
                <span className="font-medium">Dr. João Silva</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Consultório:</span>
                <span className="font-medium">205 - Ala B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duração:</span>
                <span className="font-medium">30 minutos</span>
              </div>
            </div>

            <Separator />

            <div className="text-sm">
              <p className="font-medium text-muted-foreground mb-1">Motivo:</p>
              <p>Consulta de retorno - Acompanhamento hipertensão</p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Confirmado
              </Badge>
              <Badge variant="outline">Convênio</Badge>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};

// HoverCard simples
export const Simple: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="outline">Informações</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <p className="text-sm">
          Informações adicionais aparecem aqui quando você passa o mouse.
        </p>
      </HoverCardContent>
    </HoverCard>
  ),
};
