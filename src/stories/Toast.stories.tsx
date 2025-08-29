import { Meta, StoryObj } from '@storybook/react-vite';
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  AlertCircle,
  Info,
  XCircle,
  Clock,
  Bell,
  Heart,
  Pill,
  Calendar,
  FileText,
} from 'lucide-react';
import { useState } from 'react';

const meta: Meta<typeof Toast> = {
  title: 'UI/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente Toast para notificações temporárias no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
      description: 'Variante visual do toast',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component para demonstrar toasts
const ToastDemo = ({ children, ...props }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="space-y-4">
        <Button onClick={() => setOpen(true)}>Mostrar Toast</Button>
        <Toast open={open} onOpenChange={setOpen} {...props}>
          {children}
          <ToastClose />
        </Toast>
      </div>
      <ToastViewport />
    </ToastProvider>
  );
};

export const Default: Story = {
  render: () => (
    <ToastDemo>
      <div className="grid gap-1">
        <ToastTitle>Notificação</ToastTitle>
        <ToastDescription>Esta é uma notificação padrão.</ToastDescription>
      </div>
    </ToastDemo>
  ),
};

export const Success: Story = {
  render: () => (
    <ToastDemo className="border-green-200 bg-green-50">
      <div className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
        <div className="grid gap-1">
          <ToastTitle className="text-green-800">Sucesso!</ToastTitle>
          <ToastDescription className="text-green-700">
            Operação realizada com sucesso.
          </ToastDescription>
        </div>
      </div>
    </ToastDemo>
  ),
};

export const Error: Story = {
  render: () => (
    <ToastDemo variant="destructive">
      <div className="flex items-start gap-3">
        <XCircle className="h-5 w-5 text-red-100 mt-0.5" />
        <div className="grid gap-1">
          <ToastTitle>Erro!</ToastTitle>
          <ToastDescription>
            Ocorreu um erro durante a operação.
          </ToastDescription>
        </div>
      </div>
    </ToastDemo>
  ),
};

export const Warning: Story = {
  render: () => (
    <ToastDemo className="border-yellow-200 bg-yellow-50">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
        <div className="grid gap-1">
          <ToastTitle className="text-yellow-800">Atenção!</ToastTitle>
          <ToastDescription className="text-yellow-700">
            Esta ação requer sua atenção.
          </ToastDescription>
        </div>
      </div>
    </ToastDemo>
  ),
};

export const InfoToast: Story = {
  render: () => (
    <ToastDemo className="border-blue-200 bg-blue-50">
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
        <div className="grid gap-1">
          <ToastTitle className="text-blue-800">Informação</ToastTitle>
          <ToastDescription className="text-blue-700">
            Aqui está uma informação importante.
          </ToastDescription>
        </div>
      </div>
    </ToastDemo>
  ),
};

// Casos de uso médicos
export const PatientSaved: Story = {
  render: () => (
    <ToastDemo className="border-green-200 bg-green-50">
      <div className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
        <div className="grid gap-1">
          <ToastTitle className="text-green-800">Paciente Salvo</ToastTitle>
          <ToastDescription className="text-green-700">
            Os dados do paciente João Silva foram salvos com sucesso.
          </ToastDescription>
        </div>
      </div>
      <ToastAction altText="Ver paciente">Ver</ToastAction>
    </ToastDemo>
  ),
};

export const AppointmentScheduled: Story = {
  render: () => (
    <ToastDemo className="border-blue-200 bg-blue-50">
      <div className="flex items-start gap-3">
        <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
        <div className="grid gap-1">
          <ToastTitle className="text-blue-800">Consulta Agendada</ToastTitle>
          <ToastDescription className="text-blue-700">
            Consulta marcada para 15/03/2024 às 14:30h com Dr. Carlos.
          </ToastDescription>
        </div>
      </div>
      <ToastAction altText="Ver agenda">Ver Agenda</ToastAction>
    </ToastDemo>
  ),
};

export const MedicationAlert: Story = {
  render: () => (
    <ToastDemo className="border-yellow-200 bg-yellow-50">
      <div className="flex items-start gap-3">
        <Pill className="h-5 w-5 text-yellow-600 mt-0.5" />
        <div className="grid gap-1">
          <ToastTitle className="text-yellow-800">
            Alerta de Medicação
          </ToastTitle>
          <ToastDescription className="text-yellow-700">
            Possível interação entre Warfarina e Aspirina detectada.
          </ToastDescription>
        </div>
      </div>
      <ToastAction altText="Revisar prescrição">Revisar</ToastAction>
    </ToastDemo>
  ),
};

export const EmergencyAlert: Story = {
  render: () => (
    <ToastDemo variant="destructive">
      <div className="flex items-start gap-3">
        <Heart className="h-5 w-5 text-red-100 mt-0.5" />
        <div className="grid gap-1">
          <ToastTitle>Emergência!</ToastTitle>
          <ToastDescription>
            Paciente em estado crítico - Leito 205. Ação imediata necessária.
          </ToastDescription>
        </div>
      </div>
      <ToastAction altText="Ir para leito">Ir Agora</ToastAction>
    </ToastDemo>
  ),
};

export const ExamResults: Story = {
  render: () => (
    <ToastDemo className="border-green-200 bg-green-50">
      <div className="flex items-start gap-3">
        <FileText className="h-5 w-5 text-green-600 mt-0.5" />
        <div className="grid gap-1">
          <ToastTitle className="text-green-800">
            Resultados Disponíveis
          </ToastTitle>
          <ToastDescription className="text-green-700">
            Exames de sangue de Maria Santos estão prontos para análise.
          </ToastDescription>
        </div>
      </div>
      <ToastAction altText="Ver resultados">Ver Resultados</ToastAction>
    </ToastDemo>
  ),
};

export const SystemMaintenance: Story = {
  render: () => (
    <ToastDemo className="border-blue-200 bg-blue-50">
      <div className="flex items-start gap-3">
        <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
        <div className="grid gap-1">
          <ToastTitle className="text-blue-800">
            Manutenção Programada
          </ToastTitle>
          <ToastDescription className="text-blue-700">
            Sistema será atualizado hoje às 02:00h. Duração estimada: 30 min.
          </ToastDescription>
        </div>
      </div>
    </ToastDemo>
  ),
};

export const AppointmentReminder: Story = {
  render: () => (
    <ToastDemo className="border-purple-200 bg-purple-50">
      <div className="flex items-start gap-3">
        <Bell className="h-5 w-5 text-purple-600 mt-0.5" />
        <div className="grid gap-1">
          <ToastTitle className="text-purple-800">Lembrete</ToastTitle>
          <ToastDescription className="text-purple-700">
            Próxima consulta em 15 minutos - Paciente: Ana Costa.
          </ToastDescription>
        </div>
      </div>
      <ToastAction altText="Preparar consulta">Preparar</ToastAction>
    </ToastDemo>
  ),
};

export const DataSyncError: Story = {
  render: () => (
    <ToastDemo variant="destructive">
      <div className="flex items-start gap-3">
        <XCircle className="h-5 w-5 text-red-100 mt-0.5" />
        <div className="grid gap-1">
          <ToastTitle>Erro de Sincronização</ToastTitle>
          <ToastDescription>
            Falha ao sincronizar dados com o servidor. Tentando novamente...
          </ToastDescription>
        </div>
      </div>
      <ToastAction altText="Tentar novamente">Tentar Novamente</ToastAction>
    </ToastDemo>
  ),
};

export const WithBadge: Story = {
  render: () => (
    <ToastDemo className="border-green-200 bg-green-50">
      <div className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
        <div className="grid gap-1">
          <div className="flex items-center gap-2">
            <ToastTitle className="text-green-800">
              Prescrição Enviada
            </ToastTitle>
            <Badge variant="secondary" className="text-xs">
              Urgente
            </Badge>
          </div>
          <ToastDescription className="text-green-700">
            Prescrição enviada para farmácia com sucesso.
          </ToastDescription>
        </div>
      </div>
    </ToastDemo>
  ),
};

export const LongMessage: Story = {
  render: () => (
    <ToastDemo className="border-blue-200 bg-blue-50">
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
        <div className="grid gap-1">
          <ToastTitle className="text-blue-800">
            Atualização do Sistema
          </ToastTitle>
          <ToastDescription className="text-blue-700">
            Nova versão disponível com melhorias na interface de prescrições,
            correções de bugs no módulo de agendamento e otimizações de
            performance no carregamento de dados dos pacientes.
          </ToastDescription>
        </div>
      </div>
      <ToastAction altText="Ver detalhes">Ver Detalhes</ToastAction>
    </ToastDemo>
  ),
};

export const MultipleToasts: Story = {
  render: () => {
    const [toasts, setToasts] = useState<
      Array<{ id: number; type: string; open: boolean }>
    >([]);

    const addToast = (type: string) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, type, open: true }]);
    };

    const removeToast = (id: number) => {
      setToasts(prev =>
        prev.map(toast => (toast.id === id ? { ...toast, open: false } : toast))
      );
    };

    return (
      <ToastProvider>
        <div className="space-y-2">
          <Button
            onClick={() => addToast('success')}
            variant="outline"
            size="sm"
          >
            Sucesso
          </Button>
          <Button onClick={() => addToast('error')} variant="outline" size="sm">
            Erro
          </Button>
          <Button
            onClick={() => addToast('warning')}
            variant="outline"
            size="sm"
          >
            Aviso
          </Button>
        </div>

        {toasts.map(toast => (
          <Toast
            key={toast.id}
            open={toast.open}
            onOpenChange={open => !open && removeToast(toast.id)}
            className={
              toast.type === 'success'
                ? 'border-green-200 bg-green-50'
                : toast.type === 'error'
                  ? 'border-red-200 bg-red-50'
                  : 'border-yellow-200 bg-yellow-50'
            }
          >
            <div className="flex items-start gap-3">
              {toast.type === 'success' && (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              )}
              {toast.type === 'error' && (
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              {toast.type === 'warning' && (
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              )}
              <div className="grid gap-1">
                <ToastTitle
                  className={
                    toast.type === 'success'
                      ? 'text-green-800'
                      : toast.type === 'error'
                        ? 'text-red-800'
                        : 'text-yellow-800'
                  }
                >
                  {toast.type === 'success'
                    ? 'Sucesso!'
                    : toast.type === 'error'
                      ? 'Erro!'
                      : 'Atenção!'}
                </ToastTitle>
                <ToastDescription
                  className={
                    toast.type === 'success'
                      ? 'text-green-700'
                      : toast.type === 'error'
                        ? 'text-red-700'
                        : 'text-yellow-700'
                  }
                >
                  Toast {toast.type} #{toast.id}
                </ToastDescription>
              </div>
            </div>
            <ToastClose />
          </Toast>
        ))}

        <ToastViewport />
      </ToastProvider>
    );
  },
};
