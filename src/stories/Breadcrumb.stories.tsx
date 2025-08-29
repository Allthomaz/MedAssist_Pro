import type { Meta, StoryObj } from '@storybook/react';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Users,
  User,
  FileText,
  Calendar,
  Stethoscope,
  Heart,
  Brain,
  Eye,
  Bone,
  Activity,
  Pill,
  TestTube,
  FileImage,
  Settings,
  Building,
  UserCheck,
  ClipboardList,
  FolderOpen,
  Archive,
  Search,
  Filter,
  ChevronRight,
  Slash,
  ArrowRight,
} from 'lucide-react';

const meta: Meta<typeof Breadcrumb> = {
  title: 'UI/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente Breadcrumb para navegação hierárquica no MedAssist Pro, facilitando a orientação do usuário no sistema.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Pacientes</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>João Silva</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

// Casos de uso médicos
export const PatientNavigation: Story = {
  render: () => (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>Navegação do Paciente</CardTitle>
        <CardDescription>
          Caminho hierárquico para acessar dados do paciente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Pacientes
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                João Silva
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Prontuário
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </CardContent>
    </Card>
  ),
};

export const MedicalExamNavigation: Story = {
  render: () => (
    <Card className="w-[700px]">
      <CardHeader>
        <CardTitle>Navegação de Exames</CardTitle>
        <CardDescription>
          Acesso aos resultados de exames médicos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                Início
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-1">
                <TestTube className="h-4 w-4" />
                Laboratório
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Agosto 2024
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Maria Santos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                Hemograma Completo
                <Badge variant="secondary" className="ml-2">
                  Novo
                </Badge>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </CardContent>
    </Card>
  ),
};

export const SpecialtyNavigation: Story = {
  render: () => (
    <Card className="w-[650px]">
      <CardHeader>
        <CardTitle>Navegação por Especialidade</CardTitle>
        <CardDescription>
          Organização por área médica especializada
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                Hospital
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                Cardiologia
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-1">
                <UserCheck className="h-4 w-4" />
                Dr. Carlos Mendes
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Consultas</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                15/08/2024 - 14:30
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </CardContent>
    </Card>
  ),
};

export const ImagingNavigation: Story = {
  render: () => (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>Navegação de Imagens</CardTitle>
        <CardDescription>
          Acesso a exames de imagem e diagnósticos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-1">
                <FileImage className="h-4 w-4" />
                Imagens
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-1">
                <Bone className="h-4 w-4" />
                Raio-X
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Roberto Lima</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-1">
                Tórax PA
                <Badge className="ml-2 bg-green-100 text-green-800">
                  Normal
                </Badge>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </CardContent>
    </Card>
  ),
};

export const PrescriptionNavigation: Story = {
  render: () => (
    <Card className="w-[650px]">
      <CardHeader>
        <CardTitle>Navegação de Prescrições</CardTitle>
        <CardDescription>
          Gerenciamento de medicamentos e tratamentos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                Início
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Pacientes
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Ana Oliveira</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-1">
                <Pill className="h-4 w-4" />
                Prescrições
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-1">
                <ClipboardList className="h-4 w-4" />
                Receita #2024-0815
                <Badge variant="outline" className="ml-2">
                  Ativa
                </Badge>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </CardContent>
    </Card>
  ),
};

export const WithEllipsis: Story = {
  render: () => (
    <Card className="w-[700px]">
      <CardHeader>
        <CardTitle>Navegação com Reticências</CardTitle>
        <CardDescription>
          Para caminhos muito longos com muitos níveis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                MedAssist
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Hospital São Lucas</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Neurologia</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Dr. Ana Costa</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-1">
                <Brain className="h-4 w-4" />
                Ressonância Magnética
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </CardContent>
    </Card>
  ),
};

export const ArchiveNavigation: Story = {
  render: () => (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>Navegação de Arquivo</CardTitle>
        <CardDescription>
          Acesso a dados arquivados e históricos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                Sistema
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-1">
                <Archive className="h-4 w-4" />
                Arquivo
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">2023</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Dezembro</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-1">
                <FolderOpen className="h-4 w-4" />
                Pacientes Inativos
                <Badge variant="secondary" className="ml-2">
                  847 registros
                </Badge>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </CardContent>
    </Card>
  ),
};

export const SearchResultsNavigation: Story = {
  render: () => (
    <Card className="w-[650px]">
      <CardHeader>
        <CardTitle>Navegação de Busca</CardTitle>
        <CardDescription>Resultados de pesquisa no sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-1">
                <Search className="h-4 w-4" />
                Busca
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filtros
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-1">
                "diabetes tipo 2"
                <Badge variant="outline" className="ml-2">
                  156 resultados
                </Badge>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </CardContent>
    </Card>
  ),
};

export const SettingsNavigation: Story = {
  render: () => (
    <Card className="w-[550px]">
      <CardHeader>
        <CardTitle>Navegação de Configurações</CardTitle>
        <CardDescription>Acesso às configurações do sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                Início
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                Configurações
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Sistema</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Notificações</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </CardContent>
    </Card>
  ),
};

export const CustomSeparators: Story = {
  render: () => (
    <div className="space-y-4">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Separadores Customizados</CardTitle>
          <CardDescription>Diferentes estilos de separadores</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Separador com seta */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ArrowRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Pacientes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ArrowRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>João Silva</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Separador com barra */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Sistema</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Relatórios</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Mensal</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </CardContent>
      </Card>
    </div>
  ),
};
