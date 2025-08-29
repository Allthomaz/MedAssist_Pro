import type { Meta, StoryObj } from '@storybook/react';
import { Toaster, toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Heart,
  Calendar,
  User,
  TestTube,
  Pill,
  FileText,
  Clock,
  Bell,
  Activity,
  Stethoscope,
  AlertCircle,
  Download,
  Upload,
  Save,
  Trash2,
  Edit,
  Plus,
  Minus,
  RefreshCw,
  Zap,
  Shield,
  Database,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Volume2,
  VolumeX,
} from 'lucide-react';

const meta: Meta<typeof Toaster> = {
  title: 'UI/Sonner',
  component: Toaster,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente Sonner (Toast) para notificações no MedAssist Pro. Oferece diferentes tipos de notificações com suporte a temas e ações personalizadas.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Toast básico
export const Default: Story = {
  render: () => (
    <div className="space-y-4">
      <Toaster />
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Notificações Básicas</CardTitle>
          <CardDescription>
            Exemplos de diferentes tipos de toast
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            onClick={() => toast('Paciente cadastrado com sucesso!')}
            className="w-full"
          >
            Toast Simples
          </Button>

          <Button
            onClick={() =>
              toast.success('Consulta agendada!', {
                description: 'Dr. Silva - Hoje às 14:30',
                icon: <Calendar className="h-4 w-4" />,
              })
            }
            className="w-full"
            variant="outline"
          >
            Toast de Sucesso
          </Button>

          <Button
            onClick={() =>
              toast.error('Erro ao salvar dados', {
                description: 'Verifique a conexão e tente novamente',
                icon: <XCircle className="h-4 w-4" />,
              })
            }
            className="w-full"
            variant="destructive"
          >
            Toast de Erro
          </Button>

          <Button
            onClick={() =>
              toast.warning('Atenção necessária', {
                description: 'Paciente com sinais vitais alterados',
                icon: <AlertTriangle className="h-4 w-4" />,
              })
            }
            className="w-full"
            variant="secondary"
          >
            Toast de Aviso
          </Button>
        </CardContent>
      </Card>
    </div>
  ),
};

// Notificações médicas
export const MedicalNotifications: Story = {
  render: () => (
    <div className="space-y-4">
      <Toaster />
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Notificações Médicas</CardTitle>
          <CardDescription>
            Exemplos específicos para contexto médico
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            onClick={() =>
              toast.success('Paciente admitido', {
                description: 'João Silva - Leito 205A',
                icon: <User className="h-4 w-4" />,
                action: {
                  label: 'Ver Prontuário',
                  onClick: () => console.log('Abrindo prontuário'),
                },
              })
            }
            className="w-full"
          >
            Admissão de Paciente
          </Button>

          <Button
            onClick={() =>
              toast.info('Resultado de exame disponível', {
                description: 'Hemograma completo - Maria Santos',
                icon: <TestTube className="h-4 w-4" />,
                action: {
                  label: 'Visualizar',
                  onClick: () => console.log('Visualizando exame'),
                },
              })
            }
            className="w-full"
            variant="outline"
          >
            Resultado de Exame
          </Button>

          <Button
            onClick={() =>
              toast.warning('Medicação vencendo', {
                description: 'Dipirona - Vence em 2 dias',
                icon: <Pill className="h-4 w-4" />,
                action: {
                  label: 'Renovar',
                  onClick: () => console.log('Renovando medicação'),
                },
              })
            }
            className="w-full"
            variant="secondary"
          >
            Alerta de Medicação
          </Button>

          <Button
            onClick={() =>
              toast.error('Sinais vitais críticos', {
                description: 'Paciente Carlos - PA: 180/120 mmHg',
                icon: <Heart className="h-4 w-4" />,
                action: {
                  label: 'Emergência',
                  onClick: () => console.log('Acionando emergência'),
                },
                duration: 10000,
              })
            }
            className="w-full"
            variant="destructive"
          >
            Alerta Crítico
          </Button>
        </CardContent>
      </Card>
    </div>
  ),
};

// Notificações de sistema
export const SystemNotifications: Story = {
  render: () => (
    <div className="space-y-4">
      <Toaster />
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Notificações do Sistema</CardTitle>
          <CardDescription>Alertas técnicos e de sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            onClick={() =>
              toast.success('Backup concluído', {
                description: 'Dados salvos com segurança',
                icon: <Database className="h-4 w-4" />,
              })
            }
            className="w-full"
          >
            Backup Concluído
          </Button>

          <Button
            onClick={() =>
              toast.info('Atualização disponível', {
                description: 'MedAssist Pro v2.1.0',
                icon: <Download className="h-4 w-4" />,
                action: {
                  label: 'Atualizar',
                  onClick: () => console.log('Iniciando atualização'),
                },
              })
            }
            className="w-full"
            variant="outline"
          >
            Atualização
          </Button>

          <Button
            onClick={() =>
              toast.warning('Conexão instável', {
                description: 'Verificando conectividade...',
                icon: <Wifi className="h-4 w-4" />,
              })
            }
            className="w-full"
            variant="secondary"
          >
            Problema de Conexão
          </Button>

          <Button
            onClick={() =>
              toast.error('Falha no servidor', {
                description: 'Tentando reconectar automaticamente',
                icon: <AlertCircle className="h-4 w-4" />,
                action: {
                  label: 'Tentar Novamente',
                  onClick: () => console.log('Tentando reconectar'),
                },
              })
            }
            className="w-full"
            variant="destructive"
          >
            Erro do Servidor
          </Button>
        </CardContent>
      </Card>
    </div>
  ),
};

// Notificações com ações
export const ActionableNotifications: Story = {
  render: () => (
    <div className="space-y-4">
      <Toaster />
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Notificações com Ações</CardTitle>
          <CardDescription>
            Toasts interativos com botões de ação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            onClick={() =>
              toast('Consulta em 15 minutos', {
                description: 'Dr. Silva - Sala 3',
                icon: <Clock className="h-4 w-4" />,
                action: {
                  label: 'Confirmar',
                  onClick: () => toast.success('Consulta confirmada!'),
                },
                cancel: {
                  label: 'Adiar',
                  onClick: () => toast.info('Consulta adiada'),
                },
              })
            }
            className="w-full"
          >
            Lembrete de Consulta
          </Button>

          <Button
            onClick={() =>
              toast('Prontuário não salvo', {
                description: 'Você tem alterações não salvas',
                icon: <FileText className="h-4 w-4" />,
                action: {
                  label: 'Salvar',
                  onClick: () => toast.success('Prontuário salvo!'),
                },
                cancel: {
                  label: 'Descartar',
                  onClick: () => toast.info('Alterações descartadas'),
                },
                duration: Infinity,
              })
            }
            className="w-full"
            variant="outline"
          >
            Salvar Prontuário
          </Button>

          <Button
            onClick={() =>
              toast('Excluir paciente?', {
                description: 'Esta ação não pode ser desfeita',
                icon: <Trash2 className="h-4 w-4" />,
                action: {
                  label: 'Confirmar',
                  onClick: () => toast.success('Paciente excluído'),
                },
                cancel: {
                  label: 'Cancelar',
                  onClick: () => toast.info('Operação cancelada'),
                },
                duration: Infinity,
              })
            }
            className="w-full"
            variant="destructive"
          >
            Confirmar Exclusão
          </Button>
        </CardContent>
      </Card>
    </div>
  ),
};

// Notificações de progresso
export const ProgressNotifications: Story = {
  render: () => {
    const simulateUpload = () => {
      const uploadId = toast.loading('Enviando exame...', {
        description: 'Preparando arquivo',
        icon: <Upload className="h-4 w-4" />,
      });

      setTimeout(() => {
        toast.loading('Enviando exame...', {
          id: uploadId,
          description: '25% concluído',
          icon: <Upload className="h-4 w-4" />,
        });
      }, 1000);

      setTimeout(() => {
        toast.loading('Enviando exame...', {
          id: uploadId,
          description: '75% concluído',
          icon: <Upload className="h-4 w-4" />,
        });
      }, 2000);

      setTimeout(() => {
        toast.success('Exame enviado com sucesso!', {
          id: uploadId,
          description: 'Disponível para análise',
          icon: <CheckCircle className="h-4 w-4" />,
        });
      }, 3000);
    };

    const simulateSync = () => {
      const syncId = toast.loading('Sincronizando dados...', {
        description: 'Conectando ao servidor',
        icon: <RefreshCw className="h-4 w-4 animate-spin" />,
      });

      setTimeout(() => {
        toast.success('Sincronização concluída', {
          id: syncId,
          description: '1.247 registros atualizados',
          icon: <CheckCircle className="h-4 w-4" />,
        });
      }, 4000);
    };

    return (
      <div className="space-y-4">
        <Toaster />
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Notificações de Progresso</CardTitle>
            <CardDescription>
              Toasts que mostram progresso de operações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={simulateUpload} className="w-full">
              Simular Upload
            </Button>

            <Button onClick={simulateSync} className="w-full" variant="outline">
              Simular Sincronização
            </Button>

            <Button
              onClick={() =>
                toast.loading('Processando...', {
                  description: 'Esta operação pode demorar alguns minutos',
                  icon: <Zap className="h-4 w-4" />,
                  duration: Infinity,
                })
              }
              className="w-full"
              variant="secondary"
            >
              Loading Infinito
            </Button>

            <Button
              onClick={() => {
                const promises = [
                  new Promise(resolve => setTimeout(resolve, 2000)),
                  new Promise(resolve => setTimeout(resolve, 3000)),
                  new Promise(resolve => setTimeout(resolve, 1500)),
                ];

                toast.promise(Promise.all(promises), {
                  loading: 'Salvando dados...',
                  success: 'Todos os dados foram salvos!',
                  error: 'Erro ao salvar dados',
                  description: 'Aguarde enquanto processamos',
                });
              }}
              className="w-full"
              variant="outline"
            >
              Promise Toast
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  },
};

// Notificações customizadas
export const CustomNotifications: Story = {
  render: () => (
    <div className="space-y-4">
      <Toaster />
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Notificações Customizadas</CardTitle>
          <CardDescription>
            Toasts com estilos e comportamentos especiais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            onClick={() =>
              toast('Emergência ativada!', {
                description: 'Código azul - Sala 302',
                icon: <AlertCircle className="h-4 w-4" />,
                className: 'border-red-500 bg-red-50 text-red-900',
                duration: 10000,
                action: {
                  label: 'Responder',
                  onClick: () => console.log('Respondendo emergência'),
                },
              })
            }
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Emergência
          </Button>

          <Button
            onClick={() =>
              toast('Bateria baixa', {
                description: '15% restante - Conecte o carregador',
                icon: <BatteryLow className="h-4 w-4" />,
                className: 'border-yellow-500 bg-yellow-50 text-yellow-900',
              })
            }
            className="w-full bg-yellow-600 hover:bg-yellow-700"
          >
            Bateria Baixa
          </Button>

          <Button
            onClick={() =>
              toast('Modo silencioso ativado', {
                description: 'Notificações serão silenciadas',
                icon: <VolumeX className="h-4 w-4" />,
                className: 'border-gray-500 bg-gray-50 text-gray-900',
              })
            }
            className="w-full bg-gray-600 hover:bg-gray-700"
          >
            Modo Silencioso
          </Button>

          <Button
            onClick={() =>
              toast('Sistema seguro', {
                description: 'Todas as verificações passaram',
                icon: <Shield className="h-4 w-4" />,
                className: 'border-green-500 bg-green-50 text-green-900',
                duration: 2000,
              })
            }
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Status Seguro
          </Button>

          <Button
            onClick={() => {
              // Toast com posição customizada
              toast('Notificação no topo', {
                description: 'Esta notificação aparece no topo',
                icon: <Info className="h-4 w-4" />,
                position: 'top-center',
              });
            }}
            className="w-full"
            variant="outline"
          >
            Posição Customizada
          </Button>
        </CardContent>
      </Card>
    </div>
  ),
};

// Múltiplas notificações
export const MultipleNotifications: Story = {
  render: () => (
    <div className="space-y-4">
      <Toaster />
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Múltiplas Notificações</CardTitle>
          <CardDescription>
            Testando comportamento com várias notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            onClick={() => {
              toast.success('Paciente 1 cadastrado');
              toast.success('Paciente 2 cadastrado');
              toast.success('Paciente 3 cadastrado');
            }}
            className="w-full"
          >
            3 Sucessos Rápidos
          </Button>

          <Button
            onClick={() => {
              toast.info('Consulta agendada', {
                icon: <Calendar className="h-4 w-4" />,
              });
              toast.warning('Medicação vencendo', {
                icon: <Pill className="h-4 w-4" />,
              });
              toast.error('Exame atrasado', {
                icon: <TestTube className="h-4 w-4" />,
              });
            }}
            className="w-full"
            variant="outline"
          >
            Tipos Mistos
          </Button>

          <Button
            onClick={() => {
              for (let i = 1; i <= 5; i++) {
                setTimeout(() => {
                  toast(`Notificação ${i}`, {
                    description: `Esta é a notificação número ${i}`,
                    icon: <Bell className="h-4 w-4" />,
                  });
                }, i * 500);
              }
            }}
            className="w-full"
            variant="secondary"
          >
            5 Sequenciais
          </Button>

          <Button
            onClick={() => {
              // Limpar todas as notificações
              toast.dismiss();
              toast.info('Todas as notificações foram limpas');
            }}
            className="w-full"
            variant="destructive"
          >
            Limpar Todas
          </Button>
        </CardContent>
      </Card>
    </div>
  ),
};
