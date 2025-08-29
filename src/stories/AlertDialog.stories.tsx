import type { Meta, StoryObj } from '@storybook/react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertTriangle,
  Trash2,
  UserX,
  FileX,
  Shield,
  Heart,
  Activity,
  Zap,
  Clock,
  AlertCircle,
  XCircle,
  CheckCircle,
  Info,
  HelpCircle,
  LogOut,
  Power,
  RefreshCw,
  Download,
  Upload,
  Save,
  Archive,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Bell,
  BellOff,
  Settings,
  Database,
  Server,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useState } from 'react';

const meta: Meta<typeof AlertDialog> = {
  title: 'UI/AlertDialog',
  component: AlertDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente AlertDialog para confirmações e alertas críticos no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Abrir Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso irá permanentemente deletar
            sua conta e remover seus dados de nossos servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction>Continuar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// Casos de uso médicos
export const DeletePatient: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Gerenciar Paciente</CardTitle>
          <CardDescription>João Silva - CPF: 123.456.789-00</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Visualizar
            </Button>
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <UserX className="h-5 w-5 text-destructive" />
                    Excluir Paciente
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Você está prestes a excluir permanentemente o paciente{' '}
                    <strong>João Silva</strong>.
                    <br />
                    <br />
                    Esta ação irá remover:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Todos os dados pessoais</li>
                      <li>Histórico médico completo</li>
                      <li>Consultas e exames</li>
                      <li>Prescrições médicas</li>
                    </ul>
                    <br />
                    <Badge variant="destructive" className="text-xs">
                      Esta ação não pode ser desfeita
                    </Badge>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Sim, excluir paciente
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    );
  },
};

export const EmergencyAlert: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Card className="w-[400px] border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Alerta de Emergência
          </CardTitle>
          <CardDescription>Paciente: Maria Santos - Leito 205</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Ativar Protocolo de Emergência
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Protocolo de Emergência
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Você está prestes a ativar o protocolo de emergência para a
                  paciente <strong>Maria Santos</strong>.
                  <br />
                  <br />
                  Isso irá:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Notificar toda a equipe médica</li>
                    <li>Acionar o código azul</li>
                    <li>Registrar no sistema de emergência</li>
                    <li>Alertar o plantão médico</li>
                  </ul>
                  <br />
                  <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded-md">
                    <Clock className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium">
                      Tempo de resposta crítico: 3 minutos
                    </span>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  <Zap className="h-4 w-4 mr-2" />
                  Ativar Emergência
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    );
  },
};

export const LogoutConfirmation: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Sessão Ativa</CardTitle>
        <CardDescription>Dr. Carlos Mendes - Cardiologista</CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Sair do Sistema
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <LogOut className="h-5 w-5" />
                Sair do Sistema
              </AlertDialogTitle>
              <AlertDialogDescription>
                Você está prestes a sair do sistema MedAssist Pro.
                <br />
                <br />
                Certifique-se de que:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Todos os dados foram salvos</li>
                  <li>Não há consultas em andamento</li>
                  <li>Relatórios foram finalizados</li>
                </ul>
                <br />
                <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-md">
                  <Shield className="h-4 w-4 text-amber-600" />
                  <span className="text-sm">
                    Sua sessão será encerrada por segurança
                  </span>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Permanecer Logado</AlertDialogCancel>
              <AlertDialogAction>Sair do Sistema</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  ),
};

export const DeleteMedicalRecord: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Prontuário Médico</CardTitle>
        <CardDescription>Consulta - 15/08/2024 - Dr. Ana Costa</CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <FileX className="h-4 w-4 mr-2" />
              Excluir Prontuário
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <FileX className="h-5 w-5 text-destructive" />
                Excluir Prontuário Médico
              </AlertDialogTitle>
              <AlertDialogDescription>
                Você está prestes a excluir permanentemente este prontuário
                médico.
                <br />
                <br />
                <strong>Dados que serão removidos:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Anamnese e exame físico</li>
                  <li>Diagnósticos e hipóteses</li>
                  <li>Prescrições e orientações</li>
                  <li>Anexos e exames complementares</li>
                </ul>
                <br />
                <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded-md">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium">
                    Atenção: Esta ação viola as normas do CFM
                  </span>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Confirmar Exclusão
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  ),
};

export const SystemMaintenance: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Administração do Sistema</CardTitle>
        <CardDescription>Manutenção programada do servidor</CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Server className="h-4 w-4 mr-2" />
              Iniciar Manutenção
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Manutenção do Sistema
              </AlertDialogTitle>
              <AlertDialogDescription>
                Você está prestes a iniciar a manutenção programada do sistema.
                <br />
                <br />
                <strong>Durante a manutenção:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Sistema ficará indisponível por 30 minutos</li>
                  <li>Todos os usuários serão desconectados</li>
                  <li>Backup automático será realizado</li>
                  <li>Atualizações de segurança serão aplicadas</li>
                </ul>
                <br />
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-md">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">
                    Horário recomendado: 02:00 - 02:30
                  </span>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Adiar Manutenção</AlertDialogCancel>
              <AlertDialogAction>
                <RefreshCw className="h-4 w-4 mr-2" />
                Iniciar Agora
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  ),
};

export const DataExport: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Exportar Dados</CardTitle>
        <CardDescription>Relatório mensal de pacientes</CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Relatório
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Exportar Dados Médicos
              </AlertDialogTitle>
              <AlertDialogDescription>
                Você está prestes a exportar dados sensíveis de pacientes.
                <br />
                <br />
                <strong>Dados incluídos:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Informações pessoais dos pacientes</li>
                  <li>Histórico médico e diagnósticos</li>
                  <li>Resultados de exames</li>
                  <li>Prescrições e tratamentos</li>
                </ul>
                <br />
                <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-md">
                  <Lock className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium">
                    Dados protegidos pela LGPD
                  </span>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction>
                <Download className="h-4 w-4 mr-2" />
                Confirmar Exportação
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  ),
};

export const CriticalVitalSigns: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Card className="w-[400px] border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Sinais Vitais Críticos
          </CardTitle>
          <CardDescription>
            Paciente: Roberto Lima - UTI Leito 12
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-destructive" />
              <span>
                FC: <strong className="text-destructive">180 bpm</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-destructive" />
              <span>
                PA: <strong className="text-destructive">200/120</strong>
              </span>
            </div>
          </div>

          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Bell className="h-4 w-4 mr-2" />
                Acionar Equipe Médica
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Sinais Vitais Críticos Detectados
                </AlertDialogTitle>
                <AlertDialogDescription>
                  O paciente <strong>Roberto Lima</strong> apresenta sinais
                  vitais em níveis críticos.
                  <br />
                  <br />
                  <strong>Valores atuais:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Frequência Cardíaca: 180 bpm (Normal: 60-100)</li>
                    <li>Pressão Arterial: 200/120 mmHg (Normal: 120/80)</li>
                    <li>Saturação O2: 88% (Normal: &gt;95%)</li>
                  </ul>
                  <br />
                  <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded-md">
                    <Zap className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium">
                      Intervenção médica imediata necessária
                    </span>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Monitorar</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  <Bell className="h-4 w-4 mr-2" />
                  Acionar Equipe
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    );
  },
};

export const ArchivePatient: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Gerenciar Paciente</CardTitle>
        <CardDescription>
          Ana Oliveira - Última consulta: 2 anos atrás
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">
              <Archive className="h-4 w-4 mr-2" />
              Arquivar Paciente
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5" />
                Arquivar Paciente
              </AlertDialogTitle>
              <AlertDialogDescription>
                Você está prestes a arquivar o paciente{' '}
                <strong>Ana Oliveira</strong>.
                <br />
                <br />
                <strong>O que acontecerá:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Paciente será movido para arquivo inativo</li>
                  <li>Dados serão preservados por questões legais</li>
                  <li>Não aparecerá nas buscas principais</li>
                  <li>Pode ser reativado quando necessário</li>
                </ul>
                <br />
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-md">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">
                    Recomendado para pacientes inativos há mais de 2 anos
                  </span>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Manter Ativo</AlertDialogCancel>
              <AlertDialogAction>
                <Archive className="h-4 w-4 mr-2" />
                Arquivar Paciente
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  ),
};

export const NetworkConnection: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Card className="w-[400px] border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-600 flex items-center gap-2">
            <WifiOff className="h-5 w-5" />
            Conexão Instável
          </CardTitle>
          <CardDescription>
            Problemas de conectividade detectados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Trabalhar Offline
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <WifiOff className="h-5 w-5 text-amber-600" />
                  Modo Offline
                </AlertDialogTitle>
                <AlertDialogDescription>
                  A conexão com o servidor está instável. Deseja continuar
                  trabalhando offline?
                  <br />
                  <br />
                  <strong>No modo offline:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Dados serão salvos localmente</li>
                    <li>Sincronização automática quando conectar</li>
                    <li>Funcionalidades limitadas disponíveis</li>
                    <li>Backup local será criado</li>
                  </ul>
                  <br />
                  <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-md">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span className="text-sm">
                      Dados críticos podem não ser sincronizados
                    </span>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Tentar Reconectar</AlertDialogCancel>
                <AlertDialogAction>
                  <WifiOff className="h-4 w-4 mr-2" />
                  Continuar Offline
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    );
  },
};

export const UnsavedChanges: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Editor de Prontuário</CardTitle>
        <CardDescription>
          Consulta em andamento - Alterações não salvas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">
              <XCircle className="h-4 w-4 mr-2" />
              Fechar sem Salvar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                Alterações Não Salvas
              </AlertDialogTitle>
              <AlertDialogDescription>
                Você possui alterações não salvas neste prontuário médico.
                <br />
                <br />
                <strong>Dados que serão perdidos:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Anotações da consulta atual</li>
                  <li>Diagnósticos atualizados</li>
                  <li>Prescrições em elaboração</li>
                  <li>Observações clínicas</li>
                </ul>
                <br />
                <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-md">
                  <Save className="h-4 w-4 text-amber-600" />
                  <span className="text-sm">
                    Recomendamos salvar antes de continuar
                  </span>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Descartar Alterações
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  ),
};
