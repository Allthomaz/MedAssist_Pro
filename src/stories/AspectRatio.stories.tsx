import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileImage,
  Heart,
  Brain,
  Bone,
  Eye,
  Stethoscope,
  Activity,
  Zap,
  Camera,
  Scan,
  Monitor,
  FileText,
  Download,
  Share,
  ZoomIn,
  RotateCw,
  Maximize,
  Calendar,
  User,
  MapPin,
  Clock,
} from 'lucide-react';

const meta: Meta<typeof AspectRatio> = {
  title: 'UI/AspectRatio',
  component: AspectRatio,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente AspectRatio para manter proporções consistentes em imagens médicas e conteúdo visual no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    ratio: {
      control: { type: 'number', min: 0.1, max: 5, step: 0.1 },
      description: 'Proporção da imagem (largura/altura)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ratio: 16 / 9,
  },
  render: args => (
    <div className="w-[450px]">
      <AspectRatio {...args}>
        <div className="flex h-full w-full items-center justify-center rounded-md border border-dashed">
          <FileImage className="h-12 w-12 text-muted-foreground" />
        </div>
      </AspectRatio>
    </div>
  ),
};

// Casos de uso médicos
export const XRayImage: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bone className="h-5 w-5" />
          Raio-X - Tórax PA
        </CardTitle>
        <CardDescription>
          Paciente: João Silva - Data: 15/08/2024
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AspectRatio ratio={4 / 3}>
          <div className="flex h-full w-full items-center justify-center rounded-md bg-slate-900 text-white">
            <div className="text-center space-y-2">
              <Bone className="h-16 w-16 mx-auto text-slate-300" />
              <p className="text-sm">Imagem de Raio-X</p>
              <p className="text-xs text-slate-400">Tórax PA - Normal</p>
            </div>
          </div>
        </AspectRatio>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="secondary">Normal</Badge>
            <Badge variant="outline">PA</Badge>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="outline">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const UltrasoundImage: Story = {
  render: () => (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Ultrassom Cardíaco
        </CardTitle>
        <CardDescription>Ecocardiograma - Dra. Ana Costa</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AspectRatio ratio={16 / 10}>
          <div className="flex h-full w-full items-center justify-center rounded-md bg-slate-800 text-white">
            <div className="text-center space-y-2">
              <Heart className="h-12 w-12 mx-auto text-red-400" />
              <p className="text-sm">Ultrassom Cardíaco</p>
              <p className="text-xs text-slate-400">
                Função ventricular preservada
              </p>
            </div>
          </div>
        </AspectRatio>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="secondary">Ecocardiograma</Badge>
            <Badge className="bg-green-100 text-green-800">Normal</Badge>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="outline">
              <Activity className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const CTScanImage: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Tomografia - Crânio
        </CardTitle>
        <CardDescription>TC sem contraste - Corte axial</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AspectRatio ratio={1}>
          <div className="flex h-full w-full items-center justify-center rounded-md bg-slate-900 text-white border">
            <div className="text-center space-y-2">
              <Brain className="h-16 w-16 mx-auto text-blue-400" />
              <p className="text-sm">TC de Crânio</p>
              <p className="text-xs text-slate-400">
                Sem alterações significativas
              </p>
            </div>
          </div>
        </AspectRatio>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="secondary">TC</Badge>
            <Badge variant="outline">Sem contraste</Badge>
            <Badge className="bg-green-100 text-green-800">Normal</Badge>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="outline">
              <Scan className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Maximize className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <FileText className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const MRIImage: Story = {
  render: () => (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Ressonância Magnética
        </CardTitle>
        <CardDescription>RM de coluna lombar - T2</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AspectRatio ratio={3 / 4}>
          <div className="flex h-full w-full items-center justify-center rounded-md bg-slate-800 text-white">
            <div className="text-center space-y-2">
              <Monitor className="h-14 w-14 mx-auto text-purple-400" />
              <p className="text-sm">RM Coluna Lombar</p>
              <p className="text-xs text-slate-400">Sequência T2 - Sagital</p>
            </div>
          </div>
        </AspectRatio>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="secondary">RM</Badge>
            <Badge variant="outline">T2</Badge>
            <Badge className="bg-amber-100 text-amber-800">Alterações</Badge>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="outline">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const EndoscopyImage: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Endoscopia Digestiva
        </CardTitle>
        <CardDescription>EDA - Dr. Carlos Mendes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AspectRatio ratio={16 / 9}>
          <div className="flex h-full w-full items-center justify-center rounded-md bg-pink-900 text-white">
            <div className="text-center space-y-2">
              <Eye className="h-12 w-12 mx-auto text-pink-300" />
              <p className="text-sm">Endoscopia Digestiva</p>
              <p className="text-xs text-pink-200">Mucosa gástrica normal</p>
            </div>
          </div>
        </AspectRatio>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="secondary">EDA</Badge>
            <Badge className="bg-green-100 text-green-800">Normal</Badge>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="outline">
              <Camera className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const ECGStrip: Story = {
  render: () => (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Eletrocardiograma
        </CardTitle>
        <CardDescription>ECG 12 derivações - Ritmo sinusal</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AspectRatio ratio={21 / 9}>
          <div className="flex h-full w-full items-center justify-center rounded-md bg-green-50 border">
            <div className="text-center space-y-2">
              <Activity className="h-10 w-10 mx-auto text-green-600" />
              <p className="text-sm text-green-800">ECG - 12 Derivações</p>
              <p className="text-xs text-green-600">
                Ritmo sinusal - FC: 72 bpm
              </p>
            </div>
          </div>
        </AspectRatio>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="secondary">ECG</Badge>
            <Badge variant="outline">12 derivações</Badge>
            <Badge className="bg-green-100 text-green-800">Normal</Badge>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="outline">
              <Zap className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const DermatologyPhoto: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Fotografia Dermatológica
        </CardTitle>
        <CardDescription>Lesão cutânea - Braço direito</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AspectRatio ratio={4 / 3}>
          <div className="flex h-full w-full items-center justify-center rounded-md bg-amber-50 border">
            <div className="text-center space-y-2">
              <Camera className="h-12 w-12 mx-auto text-amber-600" />
              <p className="text-sm text-amber-800">Foto Dermatológica</p>
              <p className="text-xs text-amber-600">Lesão pigmentada - 5mm</p>
            </div>
          </div>
        </AspectRatio>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="secondary">Dermatologia</Badge>
            <Badge className="bg-amber-100 text-amber-800">Acompanhar</Badge>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="outline">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const PatientPhoto: Story = {
  render: () => (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Foto do Paciente
        </CardTitle>
        <CardDescription>Para identificação no prontuário</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AspectRatio ratio={3 / 4}>
          <div className="flex h-full w-full items-center justify-center rounded-md bg-blue-50 border">
            <div className="text-center space-y-2">
              <User className="h-16 w-16 mx-auto text-blue-600" />
              <p className="text-sm text-blue-800">Foto do Paciente</p>
              <p className="text-xs text-blue-600">João Silva</p>
            </div>
          </div>
        </AspectRatio>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="secondary">Identificação</Badge>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="outline">
              <Camera className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const MedicalChart: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5" />
          Gráfico de Sinais Vitais
        </CardTitle>
        <CardDescription>Monitoramento 24h - UTI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AspectRatio ratio={16 / 9}>
          <div className="flex h-full w-full items-center justify-center rounded-md bg-slate-50 border">
            <div className="text-center space-y-2">
              <Activity className="h-12 w-12 mx-auto text-slate-600" />
              <p className="text-sm text-slate-800">Gráfico de Monitoramento</p>
              <p className="text-xs text-slate-600">
                PA, FC, SpO2 - Últimas 24h
              </p>
            </div>
          </div>
        </AspectRatio>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="secondary">Monitoramento</Badge>
            <Badge variant="outline">24h</Badge>
            <Badge className="bg-green-100 text-green-800">Estável</Badge>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="outline">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const SquareRatio: Story = {
  args: {
    ratio: 1,
  },
  render: args => (
    <div className="w-[300px]">
      <AspectRatio {...args}>
        <div className="flex h-full w-full items-center justify-center rounded-md border border-dashed">
          <div className="text-center">
            <FileImage className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Proporção 1:1</p>
          </div>
        </div>
      </AspectRatio>
    </div>
  ),
};

export const WideRatio: Story = {
  args: {
    ratio: 21 / 9,
  },
  render: args => (
    <div className="w-[500px]">
      <AspectRatio {...args}>
        <div className="flex h-full w-full items-center justify-center rounded-md border border-dashed">
          <div className="text-center">
            <FileImage className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Proporção 21:9 (Ultra-wide)
            </p>
          </div>
        </div>
      </AspectRatio>
    </div>
  ),
};

export const PortraitRatio: Story = {
  args: {
    ratio: 3 / 4,
  },
  render: args => (
    <div className="w-[300px]">
      <AspectRatio {...args}>
        <div className="flex h-full w-full items-center justify-center rounded-md border border-dashed">
          <div className="text-center">
            <FileImage className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Proporção 3:4 (Retrato)
            </p>
          </div>
        </div>
      </AspectRatio>
    </div>
  ),
};
