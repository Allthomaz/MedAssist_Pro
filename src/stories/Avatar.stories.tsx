import { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  User,
  UserCheck,
  UserX,
  Stethoscope,
  Heart,
  Shield,
  Star,
  Crown,
  Award,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
} from 'lucide-react';

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente Avatar para exibição de fotos de perfil e iniciais no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Classes CSS adicionais',
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Avatar básico com imagem
export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

// Avatar com fallback (iniciais)
export const WithFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="" alt="João Silva" />
      <AvatarFallback>JS</AvatarFallback>
    </Avatar>
  ),
};

// Diferentes tamanhos
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="h-6 w-6">
        <AvatarImage src="https://github.com/shadcn.png" alt="Pequeno" />
        <AvatarFallback className="text-xs">XS</AvatarFallback>
      </Avatar>

      <Avatar className="h-8 w-8">
        <AvatarImage src="https://github.com/shadcn.png" alt="Pequeno" />
        <AvatarFallback className="text-xs">SM</AvatarFallback>
      </Avatar>

      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="Médio" />
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>

      <Avatar className="h-12 w-12">
        <AvatarImage src="https://github.com/shadcn.png" alt="Grande" />
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>

      <Avatar className="h-16 w-16">
        <AvatarImage src="https://github.com/shadcn.png" alt="Extra Grande" />
        <AvatarFallback className="text-lg">XL</AvatarFallback>
      </Avatar>

      <Avatar className="h-20 w-20">
        <AvatarImage src="https://github.com/shadcn.png" alt="Muito Grande" />
        <AvatarFallback className="text-xl">2XL</AvatarFallback>
      </Avatar>
    </div>
  ),
};

// Avatar de médico
export const DoctorAvatar: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src="" alt="Dr. Silva" />
          <AvatarFallback className="bg-medical-blue text-white">
            DS
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
          <Stethoscope className="h-2 w-2 text-white" />
        </div>
      </div>

      <div>
        <p className="font-medium">Dr. Silva</p>
        <p className="text-sm text-muted-foreground">Cardiologista</p>
        <Badge className="bg-green-500 text-white text-xs mt-1">Online</Badge>
      </div>
    </div>
  ),
};

// Avatar de paciente
export const PatientAvatar: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src="" alt="João Silva" />
          <AvatarFallback className="bg-blue-500 text-white">JS</AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
          <User className="h-2 w-2 text-white" />
        </div>
      </div>

      <div>
        <p className="font-medium">João Silva</p>
        <p className="text-sm text-muted-foreground">Paciente</p>
        <Badge variant="outline" className="text-xs mt-1">
          Ativo
        </Badge>
      </div>
    </div>
  ),
};

// Status de conexão
export const ConnectionStatus: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="relative">
        <Avatar>
          <AvatarImage src="" alt="Online" />
          <AvatarFallback className="bg-green-500 text-white">
            ON
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
      </div>

      <div className="relative">
        <Avatar>
          <AvatarImage src="" alt="Ausente" />
          <AvatarFallback className="bg-yellow-500 text-white">
            AW
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-yellow-500 rounded-full border-2 border-white"></div>
      </div>

      <div className="relative">
        <Avatar>
          <AvatarImage src="" alt="Ocupado" />
          <AvatarFallback className="bg-red-500 text-white">BS</AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></div>
      </div>

      <div className="relative">
        <Avatar>
          <AvatarImage src="" alt="Offline" />
          <AvatarFallback className="bg-gray-500 text-white">OF</AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-gray-500 rounded-full border-2 border-white"></div>
      </div>
    </div>
  ),
};

// Avatar com badge de especialidade
export const SpecialtyBadge: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="relative">
        <Avatar className="h-14 w-14">
          <AvatarImage src="" alt="Cardiologista" />
          <AvatarFallback className="bg-red-500 text-white text-lg">
            <Heart className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs">
          Cardio
        </Badge>
      </div>

      <div className="relative">
        <Avatar className="h-14 w-14">
          <AvatarImage src="" alt="Neurologista" />
          <AvatarFallback className="bg-purple-500 text-white text-lg">
            <Stethoscope className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white text-xs">
          Neuro
        </Badge>
      </div>

      <div className="relative">
        <Avatar className="h-14 w-14">
          <AvatarImage src="" alt="Pediatra" />
          <AvatarFallback className="bg-green-500 text-white text-lg">
            <Shield className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs">
          Pediatria
        </Badge>
      </div>
    </div>
  ),
};

// Avatar com rating
export const WithRating: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar className="h-16 w-16">
          <AvatarImage src="" alt="Dr. Silva" />
          <AvatarFallback className="bg-medical-blue text-white text-lg">
            DS
          </AvatarFallback>
        </Avatar>
        <div className="absolute -top-1 -right-1 h-6 w-6 bg-yellow-500 rounded-full border-2 border-white flex items-center justify-center">
          <Star className="h-3 w-3 text-white fill-current" />
        </div>
      </div>

      <div>
        <p className="font-medium text-lg">Dr. Silva</p>
        <p className="text-sm text-muted-foreground">Cardiologista</p>
        <div className="flex items-center gap-1 mt-1">
          {[1, 2, 3, 4, 5].map(star => (
            <Star key={star} className="h-3 w-3 text-yellow-500 fill-current" />
          ))}
          <span className="text-xs text-muted-foreground ml-1">(4.9)</span>
        </div>
      </div>
    </div>
  ),
};

// Lista de equipe médica
export const MedicalTeam: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Equipe Médica</CardTitle>
        <CardDescription>Profissionais disponíveis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage src="" alt="Dr. Silva" />
                  <AvatarFallback className="bg-medical-blue text-white">
                    DS
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <p className="font-medium">Dr. Silva</p>
                <p className="text-sm text-muted-foreground">Cardiologista</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Phone className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline">
                <Mail className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage src="" alt="Dra. Santos" />
                  <AvatarFallback className="bg-purple-500 text-white">
                    MS
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-yellow-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <p className="font-medium">Dra. Santos</p>
                <p className="text-sm text-muted-foreground">Neurologista</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Phone className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline">
                <Mail className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage src="" alt="Dr. Costa" />
                  <AvatarFallback className="bg-green-500 text-white">
                    PC
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <p className="font-medium">Dr. Costa</p>
                <p className="text-sm text-muted-foreground">Pediatra</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled>
                <Phone className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline">
                <Mail className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

// Avatar em grupo (stack)
export const AvatarGroup: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium mb-2">
          Equipe de Plantão (4 membros)
        </p>
        <div className="flex -space-x-2">
          <Avatar className="border-2 border-white">
            <AvatarImage src="" alt="Dr. Silva" />
            <AvatarFallback className="bg-medical-blue text-white">
              DS
            </AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-white">
            <AvatarImage src="" alt="Dra. Santos" />
            <AvatarFallback className="bg-purple-500 text-white">
              MS
            </AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-white">
            <AvatarImage src="" alt="Dr. Costa" />
            <AvatarFallback className="bg-green-500 text-white">
              PC
            </AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-white">
            <AvatarImage src="" alt="Dra. Lima" />
            <AvatarFallback className="bg-orange-500 text-white">
              AL
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Consultores (+2 mais)</p>
        <div className="flex -space-x-2">
          <Avatar className="border-2 border-white">
            <AvatarImage src="" alt="Dr. Oliveira" />
            <AvatarFallback className="bg-red-500 text-white">
              RO
            </AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-white">
            <AvatarImage src="" alt="Dra. Ferreira" />
            <AvatarFallback className="bg-blue-500 text-white">
              CF
            </AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-white bg-gray-100">
            <AvatarFallback className="bg-gray-500 text-white text-xs">
              +2
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  ),
};

// Avatar com informações detalhadas
export const DetailedProfile: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="" alt="Dr. Silva" />
              <AvatarFallback className="bg-medical-blue text-white text-2xl">
                DS
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
              <UserCheck className="h-4 w-4 text-white" />
            </div>
          </div>

          <h3 className="text-xl font-semibold">Dr. João Silva</h3>
          <p className="text-muted-foreground mb-2">Cardiologista</p>

          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className="h-4 w-4 text-yellow-500 fill-current"
              />
            ))}
            <span className="text-sm text-muted-foreground ml-1">(4.9)</span>
          </div>

          <div className="w-full space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">CRM:</span>
              <span>12345-SP</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Experiência:</span>
              <span>15 anos</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Consultas:</span>
              <span>2.847</span>
            </div>
          </div>

          <div className="flex gap-2 mt-4 w-full">
            <Button className="flex-1" size="sm">
              <Calendar className="h-3 w-3 mr-1" />
              Agendar
            </Button>
            <Button variant="outline" size="sm">
              <Phone className="h-3 w-3" />
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

// Avatar com diferentes formas
export const CustomShapes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="rounded-lg">
        <AvatarImage src="" alt="Quadrado" />
        <AvatarFallback className="bg-medical-blue text-white rounded-lg">
          SQ
        </AvatarFallback>
      </Avatar>

      <Avatar className="rounded-none">
        <AvatarImage src="" alt="Retângulo" />
        <AvatarFallback className="bg-purple-500 text-white rounded-none">
          RT
        </AvatarFallback>
      </Avatar>

      <Avatar>
        <AvatarImage src="" alt="Círculo" />
        <AvatarFallback className="bg-green-500 text-white">CR</AvatarFallback>
      </Avatar>

      <Avatar className="rounded-sm">
        <AvatarImage src="" alt="Arredondado" />
        <AvatarFallback className="bg-orange-500 text-white rounded-sm">
          AR
        </AvatarFallback>
      </Avatar>
    </div>
  ),
};
