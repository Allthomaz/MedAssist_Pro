import { Meta, StoryObj } from '@storybook/react-vite';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  User,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Activity,
  Heart,
} from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente Dialog para modais e janelas de diálogo no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// Dialog básico
export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Abrir Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Título do Dialog</DialogTitle>
          <DialogDescription>
            Esta é uma descrição do dialog. Explique aqui o que o usuário pode
            fazer.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Conteúdo do dialog aqui.</p>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// Dialog de novo paciente
export const NewPatient: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="medical">
          <User className="mr-2 h-4 w-4" />
          Novo Paciente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-medical-blue" />
            Cadastrar Novo Paciente
          </DialogTitle>
          <DialogDescription>
            Preencha as informações básicas do paciente para criar o cadastro.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome *
            </Label>
            <Input
              id="name"
              placeholder="Nome completo"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cpf" className="text-right">
              CPF *
            </Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="birthdate" className="text-right">
              Nascimento
            </Label>
            <Input id="birthdate" type="date" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Telefone
            </Label>
            <Input
              id="phone"
              placeholder="(11) 99999-9999"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button variant="medical">Cadastrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// Dialog de agendamento
export const ScheduleAppointment: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="medical-outline">
          <Calendar className="mr-2 h-4 w-4" />
          Agendar Consulta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-medical-blue" />
            Agendar Nova Consulta
          </DialogTitle>
          <DialogDescription>
            Selecione o paciente, data e horário para a consulta.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="patient">Paciente</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o paciente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="patient1">João Silva</SelectItem>
                <SelectItem value="patient2">Maria Santos</SelectItem>
                <SelectItem value="patient3">Pedro Costa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input id="date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Horário</Label>
              <Input id="time" type="time" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialty">Especialidade</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a especialidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Clínica Geral</SelectItem>
                <SelectItem value="cardiology">Cardiologia</SelectItem>
                <SelectItem value="pediatrics">Pediatria</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              placeholder="Observações sobre a consulta (opcional)"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button variant="medical">Agendar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// Dialog de confirmação
export const ConfirmationDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Excluir Paciente</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Confirmar Exclusão
          </DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. O paciente e todos os seus dados
            serão removidos permanentemente.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4" />
              <span className="font-medium">João Silva</span>
            </div>
            <p className="text-sm text-muted-foreground">
              CPF: 123.456.789-00
              <br />
              Cadastrado em: 15/03/2024
              <br />
              Consultas: 8 registros
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button variant="destructive">Excluir Definitivamente</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// Dialog de sucesso
export const SuccessDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="medical">
          Simular Sucesso
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-medical-success">
                <CheckCircle className="h-5 w-5" />
                Operação Realizada com Sucesso!
              </DialogTitle>
              <DialogDescription>
                O paciente foi cadastrado com sucesso no sistema.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-medical-success/10 border border-medical-success/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-medical-success" />
                  <span className="font-medium">Maria Santos</span>
                  <Badge className="bg-medical-success text-medical-success-foreground">
                    Novo
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Prontuário: #2024001
                  <br />
                  CPF: 987.654.321-00
                  <br />
                  Cadastrado em: {new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="medical" onClick={() => setOpen(false)}>
                Continuar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  },
};

// Dialog de detalhes do paciente
export const PatientDetails: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Ver Detalhes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-medical-blue" />
            Detalhes do Paciente
          </DialogTitle>
          <DialogDescription>
            Informações completas e histórico médico do paciente.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Informações Básicas */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Informações Pessoais
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Nome:</span>
                <p className="font-medium">Ana Costa Silva</p>
              </div>
              <div>
                <span className="text-muted-foreground">CPF:</span>
                <p className="font-medium">123.456.789-00</p>
              </div>
              <div>
                <span className="text-muted-foreground">Nascimento:</span>
                <p className="font-medium">15/08/1985 (38 anos)</p>
              </div>
              <div>
                <span className="text-muted-foreground">Telefone:</span>
                <p className="font-medium">(11) 99999-9999</p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Status Atual
            </h4>
            <div className="flex gap-2">
              <Badge className="bg-medical-success text-medical-success-foreground">
                <Heart className="w-3 h-3 mr-1" />
                Estável
              </Badge>
              <Badge className="bg-medical-blue text-medical-blue-foreground">
                Cardiologia
              </Badge>
              <Badge variant="outline">Plano Premium</Badge>
            </div>
          </div>

          {/* Últimas Consultas */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Últimas Consultas
            </h4>
            <div className="space-y-2">
              <div className="border rounded-lg p-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm">
                    Consulta Cardiológica
                  </span>
                  <Badge className="bg-medical-success text-medical-success-foreground text-xs">
                    Concluída
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Dr. Carlos Santos - 20/01/2025 14:30
                </p>
              </div>
              <div className="border rounded-lg p-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm">
                    Retorno Cardiologia
                  </span>
                  <Badge className="bg-medical-blue text-medical-blue-foreground text-xs">
                    Agendada
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Dr. Carlos Santos - 25/02/2025 15:00
                </p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Editar</Button>
          <Button variant="medical">Nova Consulta</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// Dialog responsivo
export const ResponsiveDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Dialog Responsivo</Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[425px] sm:max-w-[600px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Dialog Responsivo</DialogTitle>
          <DialogDescription>
            Este dialog se adapta a diferentes tamanhos de tela.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Campo 1</Label>
              <Input placeholder="Valor 1" />
            </div>
            <div className="space-y-2">
              <Label>Campo 2</Label>
              <Input placeholder="Valor 2" />
            </div>
            <div className="space-y-2">
              <Label>Campo 3</Label>
              <Input placeholder="Valor 3" />
            </div>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button className="w-full sm:w-auto">Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
