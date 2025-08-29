import type { Meta, StoryObj } from '@storybook/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  FileText,
  Calendar,
  Pill,
  Activity,
  Heart,
  Stethoscope,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Download,
  Edit,
  Trash2,
  Plus,
  Eye,
  Star,
  Thermometer,
  Droplets,
  Zap,
  Target,
  TrendingUp,
  BookOpen,
  Settings,
  Shield,
  Bell,
  HelpCircle,
  ChevronRight,
  Microscope,
  Syringe,
  Bandage,
  Clipboard,
} from 'lucide-react';

const meta = {
  title: 'UI/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente Accordion para organizar informações de forma expansível no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

// Accordion básico
export const Default: Story = {
  render: () => (
    <div className="w-96">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Informações Gerais</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground">
              Aqui estão as informações gerais do paciente, incluindo dados
              pessoais e de contato.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Histórico Médico</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground">
              Histórico completo de consultas, diagnósticos e tratamentos
              anteriores.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>Medicações Atuais</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground">
              Lista de todas as medicações em uso, dosagens e horários de
              administração.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

// Accordion múltiplo (permite múltiplos itens abertos)
export const Multiple: Story = {
  render: () => (
    <div className="w-96">
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Dados Pessoais
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Nome:</span>
                <span className="font-medium">João Silva</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Idade:</span>
                <span className="font-medium">45 anos</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>CPF:</span>
                <span className="font-medium">123.456.789-00</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contato
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Telefone:</span>
                <span className="font-medium">(11) 99999-9999</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Email:</span>
                <span className="font-medium">joao@email.com</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Endereço:</span>
                <span className="font-medium">São Paulo, SP</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

// Accordion de prontuário médico
export const MedicalRecord: Story = {
  render: () => (
    <div className="w-[600px]">
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="flex items-center justify-between w-full mr-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Informações do Paciente
              </div>
              <Badge className="bg-green-500 text-white">Ativo</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-blue-500 text-white text-lg">
                    JS
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">João Silva</h3>
                  <p className="text-muted-foreground">Paciente #12345</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">Cardiologia</Badge>
                    <Badge variant="outline">Diabetes</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Dados Pessoais</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Idade:</span>
                      <span>45 anos</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sexo:</span>
                      <span>Masculino</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tipo Sanguíneo:</span>
                      <span>O+</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Contato</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      <span>(11) 99999-9999</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      <span>joao@email.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      <span>São Paulo, SP</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            <div className="flex items-center justify-between w-full mr-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Sinais Vitais
              </div>
              <Badge variant="outline">Última atualização: Hoje</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-500">72</p>
                <p className="text-sm text-muted-foreground">BPM</p>
                <Badge className="mt-2 bg-green-500 text-white">Normal</Badge>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <Thermometer className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-500">36.8</p>
                <p className="text-sm text-muted-foreground">°C</p>
                <Badge className="mt-2 bg-green-500 text-white">Normal</Badge>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-500">98</p>
                <p className="text-sm text-muted-foreground">SpO2 %</p>
                <Badge className="mt-2 bg-green-500 text-white">Normal</Badge>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <Activity className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-lg font-bold text-yellow-500">130/85</p>
                <p className="text-sm text-muted-foreground">mmHg</p>
                <Badge className="mt-2 bg-yellow-500 text-white">Elevada</Badge>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>
            <div className="flex items-center justify-between w-full mr-4">
              <div className="flex items-center gap-2">
                <Pill className="h-4 w-4" />
                Medicações
              </div>
              <Badge className="bg-blue-500 text-white">3 ativas</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Losartana 50mg</p>
                  <p className="text-sm text-muted-foreground">
                    1 comprimido, 1x ao dia
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Manhã, com água
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500 text-white">Ativo</Badge>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Metformina 850mg</p>
                  <p className="text-sm text-muted-foreground">
                    1 comprimido, 2x ao dia
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Café da manhã e jantar
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500 text-white">Ativo</Badge>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                <div>
                  <p className="font-medium text-muted-foreground">
                    Sinvastatina 20mg
                  </p>
                  <p className="text-sm text-muted-foreground">
                    1 comprimido, 1x ao dia
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Pausado temporariamente
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Pausado</Badge>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Medicação
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>
            <div className="flex items-center justify-between w-full mr-4">
              <div className="flex items-center gap-2">
                <Microscope className="h-4 w-4" />
                Exames
              </div>
              <Badge variant="outline">2 pendentes</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">Hemograma Completo</p>
                  <p className="text-sm text-muted-foreground">
                    Solicitado em 10/08/2024
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Dr. Carlos Santos
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500 text-white">Disponível</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">Glicemia de Jejum</p>
                  <p className="text-sm text-muted-foreground">
                    Solicitado em 12/08/2024
                  </p>
                  <p className="text-xs text-muted-foreground">Dr. Ana Lima</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Pendente</Badge>
                  <Button variant="ghost" size="sm">
                    <Clock className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">Eletrocardiograma</p>
                  <p className="text-sm text-muted-foreground">
                    Solicitado em 14/08/2024
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Dr. Carlos Santos
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-500 text-white">Agendado</Badge>
                  <Button variant="ghost" size="sm">
                    <Calendar className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger>
            <div className="flex items-center justify-between w-full mr-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Histórico de Consultas
              </div>
              <Badge variant="outline">Últimas 5</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-500 text-white text-xs">
                      CS
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">Dr. Carlos Santos</p>
                    <p className="text-xs text-muted-foreground">Cardiologia</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">10/08/2024</p>
                  <p className="text-xs text-muted-foreground">14:30</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-purple-500 text-white text-xs">
                      AL
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">Dra. Ana Lima</p>
                    <p className="text-xs text-muted-foreground">
                      Endocrinologia
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">05/08/2024</p>
                  <p className="text-xs text-muted-foreground">09:00</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-green-500 text-white text-xs">
                      MR
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">Dr. Miguel Rocha</p>
                    <p className="text-xs text-muted-foreground">
                      Clínica Geral
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">28/07/2024</p>
                  <p className="text-xs text-muted-foreground">16:00</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

// Accordion de FAQ médico
export const MedicalFAQ: Story = {
  render: () => (
    <div className="w-[500px]">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Como agendar uma consulta?
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Para agendar uma consulta, siga estes passos:
              </p>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                <li>Acesse o menu "Agendamentos"</li>
                <li>Clique em "Nova Consulta"</li>
                <li>Selecione o paciente</li>
                <li>Escolha a data e horário disponível</li>
                <li>Confirme o agendamento</li>
              </ol>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Pill className="h-4 w-4" />
              Como prescrever medicações?
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Para prescrever medicações:
              </p>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                <li>Abra o prontuário do paciente</li>
                <li>Vá para a seção "Medicações"</li>
                <li>Clique em "Adicionar Medicação"</li>
                <li>Preencha nome, dosagem e posologia</li>
                <li>Salve a prescrição</li>
              </ol>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Microscope className="h-4 w-4" />
              Como solicitar exames?
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Para solicitar exames laboratoriais ou de imagem:
              </p>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                <li>No prontuário, acesse "Exames"</li>
                <li>Clique em "Solicitar Exame"</li>
                <li>Selecione o tipo de exame</li>
                <li>Adicione observações se necessário</li>
                <li>Envie a solicitação</li>
              </ol>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Como registrar sinais vitais?
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Para registrar os sinais vitais do paciente:
              </p>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                <li>Acesse "Sinais Vitais" no prontuário</li>
                <li>Clique em "Novo Registro"</li>
                <li>Preencha PA, FC, Temp, SpO2</li>
                <li>Adicione peso e altura se necessário</li>
                <li>Salve o registro</li>
              </ol>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Como garantir a segurança dos dados?
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                O MedAssist Pro garante a segurança através de:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Criptografia de dados em trânsito e repouso</li>
                <li>Autenticação de dois fatores</li>
                <li>Logs de auditoria completos</li>
                <li>Backup automático diário</li>
                <li>Conformidade com LGPD</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

// Accordion de configurações do sistema
export const SystemSettings: Story = {
  render: () => (
    <div className="w-[500px]">
      <Accordion type="multiple" defaultValue={['item-1']}>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações Gerais
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Tema do Sistema</p>
                  <p className="text-xs text-muted-foreground">
                    Escolha entre claro, escuro ou automático
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Idioma</p>
                  <p className="text-xs text-muted-foreground">
                    Português (Brasil)
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Alterar
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Fuso Horário</p>
                  <p className="text-xs text-muted-foreground">
                    GMT-3 (Brasília)
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notificações
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Consultas Agendadas</p>
                  <p className="text-xs text-muted-foreground">
                    Receber lembretes 30 min antes
                  </p>
                </div>
                <Badge className="bg-green-500 text-white">Ativo</Badge>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Exames Disponíveis</p>
                  <p className="text-xs text-muted-foreground">
                    Notificar quando resultados chegarem
                  </p>
                </div>
                <Badge className="bg-green-500 text-white">Ativo</Badge>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Medicações Vencendo</p>
                  <p className="text-xs text-muted-foreground">
                    Alertar 7 dias antes do vencimento
                  </p>
                </div>
                <Badge variant="outline">Inativo</Badge>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Segurança
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">
                    Autenticação de Dois Fatores
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Proteção adicional para sua conta
                  </p>
                </div>
                <Badge className="bg-green-500 text-white">Ativo</Badge>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Sessão Automática</p>
                  <p className="text-xs text-muted-foreground">
                    Logout após 30 min de inatividade
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Logs de Auditoria</p>
                  <p className="text-xs text-muted-foreground">
                    Registrar todas as ações do usuário
                  </p>
                </div>
                <Badge className="bg-green-500 text-white">Ativo</Badge>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

// Accordion com badges e status
export const WithBadges: Story = {
  render: () => (
    <div className="w-96">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="flex items-center justify-between w-full mr-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                Pacientes Críticos
              </div>
              <Badge className="bg-red-500 text-white">3</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">Maria Santos - UTI</span>
                <Badge className="bg-red-500 text-white text-xs">Crítico</Badge>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">Pedro Lima - Emergência</span>
                <Badge className="bg-red-500 text-white text-xs">Crítico</Badge>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">Ana Costa - Cardiologia</span>
                <Badge className="bg-red-500 text-white text-xs">Crítico</Badge>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            <div className="flex items-center justify-between w-full mr-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Pacientes Estáveis
              </div>
              <Badge className="bg-green-500 text-white">12</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                12 pacientes em condição estável, sem necessidade de intervenção
                imediata.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Ver Lista Completa
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>
            <div className="flex items-center justify-between w-full mr-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                Aguardando Atendimento
              </div>
              <Badge className="bg-yellow-500 text-white">5</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">João Silva</span>
                <Badge className="bg-yellow-500 text-white text-xs">
                  15 min
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">Carlos Rocha</span>
                <Badge className="bg-yellow-500 text-white text-xs">
                  8 min
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">Lucia Fernandes</span>
                <Badge className="bg-yellow-500 text-white text-xs">
                  3 min
                </Badge>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

// Accordion compacto
export const Compact: Story = {
  render: () => (
    <div className="w-80">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="py-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-3 w-3" />
              Dados Básicos
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Nome: João Silva</p>
              <p>Idade: 45 anos</p>
              <p>CPF: 123.456.789-00</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="border-b-0">
          <AccordionTrigger className="py-2">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-3 w-3" />
              Contato
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Tel: (11) 99999-9999</p>
              <p>Email: joao@email.com</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="py-2">
            <div className="flex items-center gap-2 text-sm">
              <Pill className="h-3 w-3" />
              Medicações
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Losartana 50mg - 1x/dia</p>
              <p>• Metformina 850mg - 2x/dia</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
