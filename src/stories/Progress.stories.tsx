import { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from '@/components/ui/progress';
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
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  Upload,
  Wifi,
  Battery,
  HardDrive,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const meta = {
  title: 'UI/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente Progress para exibição de barras de progresso e indicadores no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Valor do progresso (0-100)',
    },
    className: {
      control: 'text',
      description: 'Classes CSS adicionais',
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

// Progress básico
export const Default: Story = {
  args: {
    value: 60,
  },
};

// Diferentes valores
export const DifferentValues: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Baixo</span>
          <span>25%</span>
        </div>
        <Progress value={25} className="h-2" />
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Médio</span>
          <span>50%</span>
        </div>
        <Progress value={50} className="h-2" />
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Alto</span>
          <span>75%</span>
        </div>
        <Progress value={75} className="h-2" />
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Completo</span>
          <span>100%</span>
        </div>
        <Progress value={100} className="h-2" />
      </div>
    </div>
  ),
};

// Diferentes tamanhos
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <div>
        <p className="text-sm mb-2">Extra Pequeno (1px)</p>
        <Progress value={60} className="h-1" />
      </div>

      <div>
        <p className="text-sm mb-2">Pequeno (2px)</p>
        <Progress value={60} className="h-2" />
      </div>

      <div>
        <p className="text-sm mb-2">Médio (4px) - Padrão</p>
        <Progress value={60} />
      </div>

      <div>
        <p className="text-sm mb-2">Grande (6px)</p>
        <Progress value={60} className="h-6" />
      </div>

      <div>
        <p className="text-sm mb-2">Extra Grande (8px)</p>
        <Progress value={60} className="h-8" />
      </div>
    </div>
  ),
};

// Progress com cores personalizadas
export const CustomColors: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <div>
        <p className="text-sm mb-2 text-green-600">Sucesso</p>
        <Progress value={85} className="h-3 [&>div]:bg-green-500" />
      </div>

      <div>
        <p className="text-sm mb-2 text-yellow-600">Atenção</p>
        <Progress value={60} className="h-3 [&>div]:bg-yellow-500" />
      </div>

      <div>
        <p className="text-sm mb-2 text-red-600">Crítico</p>
        <Progress value={25} className="h-3 [&>div]:bg-red-500" />
      </div>

      <div>
        <p className="text-sm mb-2 text-blue-600">Informação</p>
        <Progress value={70} className="h-3 [&>div]:bg-blue-500" />
      </div>

      <div>
        <p className="text-sm mb-2 text-purple-600">Personalizado</p>
        <Progress
          value={90}
          className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-pink-500"
        />
      </div>
    </div>
  ),
};

// Sinais vitais
export const VitalSigns: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Sinais Vitais
        </CardTitle>
        <CardDescription>Monitoramento em tempo real</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Frequência Cardíaca</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">72 bpm</span>
              <Badge className="bg-green-500 text-white">Normal</Badge>
            </div>
          </div>
          <Progress value={72} className="h-2 [&>div]:bg-red-500" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>60</span>
            <span>100</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Temperatura</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">36.8°C</span>
              <Badge className="bg-green-500 text-white">Normal</Badge>
            </div>
          </div>
          <Progress value={68} className="h-2 [&>div]:bg-orange-500" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>35°C</span>
            <span>42°C</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Saturação O2</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">98%</span>
              <Badge className="bg-green-500 text-white">Excelente</Badge>
            </div>
          </div>
          <Progress value={98} className="h-2 [&>div]:bg-blue-500" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>90%</span>
            <span>100%</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Pressão Arterial</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">120/80</span>
              <Badge className="bg-green-500 text-white">Ideal</Badge>
            </div>
          </div>
          <Progress value={75} className="h-2 [&>div]:bg-purple-500" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>90/60</span>
            <span>140/90</span>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

// Progress de tratamento
export const TreatmentProgress: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Progresso do Tratamento</CardTitle>
        <CardDescription>Paciente: João Silva</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Medicação</span>
            <div className="flex items-center gap-2">
              <span className="text-sm">7/10 doses</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </div>
          <Progress value={70} className="h-3 [&>div]:bg-green-500" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Fisioterapia</span>
            <div className="flex items-center gap-2">
              <span className="text-sm">4/8 sessões</span>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </div>
          </div>
          <Progress value={50} className="h-3 [&>div]:bg-yellow-500" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Exames</span>
            <div className="flex items-center gap-2">
              <span className="text-sm">1/3 realizados</span>
              <XCircle className="h-4 w-4 text-red-500" />
            </div>
          </div>
          <Progress value={33} className="h-3 [&>div]:bg-red-500" />
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Progresso Geral</span>
            <span className="font-bold">51%</span>
          </div>
          <Progress
            value={51}
            className="h-4 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-purple-500"
          />
        </div>
      </CardContent>
    </Card>
  ),
};

// Progress animado
export const AnimatedProgress: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 1;
        });
      }, 100);

      return () => clearInterval(timer);
    }, []);

    return (
      <div className="space-y-4 w-[300px]">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Carregando dados...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Sincronizando...</span>
            <span>{Math.min(progress + 20, 100)}%</span>
          </div>
          <Progress
            value={Math.min(progress + 20, 100)}
            className="h-3 [&>div]:bg-blue-500"
          />
        </div>
      </div>
    );
  },
};

// Progress de sistema
export const SystemProgress: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Status do Sistema</CardTitle>
        <CardDescription>Monitoramento de recursos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              <span className="text-sm font-medium">Armazenamento</span>
            </div>
            <span className="text-sm">750GB / 1TB</span>
          </div>
          <Progress value={75} className="h-2 [&>div]:bg-blue-500" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">CPU</span>
            </div>
            <span className="text-sm">45%</span>
          </div>
          <Progress value={45} className="h-2 [&>div]:bg-green-500" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Battery className="h-4 w-4" />
              <span className="text-sm font-medium">Memória RAM</span>
            </div>
            <span className="text-sm">8.2GB / 16GB</span>
          </div>
          <Progress value={51} className="h-2 [&>div]:bg-yellow-500" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              <span className="text-sm font-medium">Rede</span>
            </div>
            <span className="text-sm">Estável</span>
          </div>
          <Progress value={90} className="h-2 [&>div]:bg-green-500" />
        </div>
      </CardContent>
    </Card>
  ),
};

// Progress de upload/download
export const FileTransfer: Story = {
  render: () => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [downloadProgress, setDownloadProgress] = useState(0);

    useEffect(() => {
      const uploadTimer = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 2;
        });
      }, 150);

      const downloadTimer = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 3;
        });
      }, 200);

      return () => {
        clearInterval(uploadTimer);
        clearInterval(downloadTimer);
      };
    }, []);

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Transferência de Arquivos</CardTitle>
          <CardDescription>Upload e download de exames</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Upload - Raio-X.pdf</span>
              </div>
              <span className="text-sm">{uploadProgress}%</span>
            </div>
            <Progress
              value={uploadProgress}
              className="h-3 [&>div]:bg-blue-500"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {uploadProgress < 100 ? 'Enviando...' : 'Concluído!'}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">
                  Download - Exame_Sangue.pdf
                </span>
              </div>
              <span className="text-sm">{downloadProgress}%</span>
            </div>
            <Progress
              value={downloadProgress}
              className="h-3 [&>div]:bg-green-500"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {downloadProgress < 100 ? 'Baixando...' : 'Concluído!'}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setUploadProgress(0);
                setDownloadProgress(0);
              }}
            >
              Reiniciar
            </Button>
            <Button
              size="sm"
              disabled={uploadProgress < 100 && downloadProgress < 100}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Finalizar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  },
};

// Progress com múltiplas etapas
export const MultiStepProgress: Story = {
  render: () => {
    const steps = [
      { name: 'Dados Pessoais', completed: true },
      { name: 'Histórico Médico', completed: true },
      { name: 'Exames', completed: false },
      { name: 'Revisão', completed: false },
    ];

    const completedSteps = steps.filter(step => step.completed).length;
    const progressPercentage = (completedSteps / steps.length) * 100;

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Cadastro de Paciente</CardTitle>
          <CardDescription>
            Etapa {completedSteps + 1} de {steps.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progresso Geral</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          <div className="space-y-2">
            {steps.map((step, index) => (
              <div key={step.name} className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    step.completed
                      ? 'bg-green-500 text-white'
                      : index === completedSteps
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`text-sm ${
                    step.completed
                      ? 'text-green-600 font-medium'
                      : index === completedSteps
                        ? 'text-blue-600 font-medium'
                        : 'text-muted-foreground'
                  }`}
                >
                  {step.name}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" size="sm" disabled={completedSteps === 0}>
              Anterior
            </Button>
            <Button size="sm" disabled={completedSteps === steps.length}>
              {completedSteps === steps.length - 1 ? 'Finalizar' : 'Próximo'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  },
};

// Progress indeterminado (loading)
export const IndeterminateProgress: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <div>
        <p className="text-sm mb-2">Carregando dados do paciente...</p>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full animate-pulse"
            style={{ width: '40%' }}
          ></div>
        </div>
      </div>

      <div>
        <p className="text-sm mb-2">Sincronizando com servidor...</p>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full animate-bounce"
            style={{ width: '60%' }}
          ></div>
        </div>
      </div>

      <div>
        <p className="text-sm mb-2">Processando exames...</p>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full animate-ping"
            style={{ width: '30%' }}
          ></div>
        </div>
      </div>
    </div>
  ),
};
