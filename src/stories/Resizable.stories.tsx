import type { Meta, StoryObj } from '@storybook/react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  User,
  Calendar,
  FileText,
  Activity,
  Pill,
  TestTube,
  Clock,
  Heart,
  Thermometer,
  Stethoscope,
  ClipboardList,
  Image,
  MessageSquare,
  Settings,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

const meta: Meta<typeof ResizablePanelGroup> = {
  title: 'UI/Resizable',
  component: ResizablePanelGroup,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Componente Resizable para criar layouts flexíveis no MedAssist Pro. Permite que usuários ajustem o tamanho dos painéis conforme suas necessidades, ideal para dashboards médicos e visualização de dados.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Layout básico horizontal
export const Default: Story = {
  render: () => (
    <div className="h-[600px] w-full">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Painel Esquerdo
              </CardTitle>
              <CardDescription>Conteúdo do primeiro painel</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Este painel pode ser redimensionado arrastando a barra
                divisória.
              </p>
            </CardContent>
          </Card>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={50}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Painel Direito
              </CardTitle>
              <CardDescription>Conteúdo do segundo painel</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Arraste a barra para ajustar o tamanho dos painéis.
              </p>
            </CardContent>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

// Dashboard médico com múltiplos painéis
export const MedicalDashboard: Story = {
  render: () => (
    <div className="h-[700px] w-full">
      <ResizablePanelGroup direction="horizontal">
        {/* Painel de navegação lateral */}
        <ResizablePanel defaultSize={20} minSize={15}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Navegação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Pacientes
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Agenda
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <TestTube className="h-4 w-4 mr-2" />
                Exames
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Relatórios
              </Button>
            </CardContent>
          </Card>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Área principal */}
        <ResizablePanel defaultSize={80}>
          <ResizablePanelGroup direction="vertical">
            {/* Painel superior - Informações do paciente */}
            <ResizablePanel defaultSize={40}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informações do Paciente
                  </CardTitle>
                  <CardDescription>João Silva - 45 anos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Dados Pessoais</p>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>CPF: 123.456.789-00</p>
                        <p>Telefone: (11) 99999-9999</p>
                        <p>Email: joao@email.com</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Convênio</p>
                      <div className="space-y-1">
                        <Badge variant="outline">Unimed</Badge>
                        <p className="text-sm text-muted-foreground">
                          Carteira: 123456789
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Painel inferior - Histórico e sinais vitais */}
            <ResizablePanel defaultSize={60}>
              <ResizablePanelGroup direction="horizontal">
                {/* Sinais vitais */}
                <ResizablePanel defaultSize={50}>
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Sinais Vitais
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span className="text-sm">Pressão Arterial</span>
                        </div>
                        <span className="font-mono text-sm">120/80 mmHg</span>
                      </div>

                      <div className="flex justify-between items-center p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Freq. Cardíaca</span>
                        </div>
                        <span className="font-mono text-sm">72 bpm</span>
                      </div>

                      <div className="flex justify-between items-center p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-orange-500" />
                          <span className="text-sm">Temperatura</span>
                        </div>
                        <span className="font-mono text-sm">36.5°C</span>
                      </div>
                    </CardContent>
                  </Card>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Histórico médico */}
                <ResizablePanel defaultSize={50}>
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ClipboardList className="h-5 w-5" />
                        Histórico Médico
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[200px]">
                        <div className="space-y-2">
                          <div className="p-2 border rounded">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-medium">
                                  Consulta Cardiológica
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  15/01/2024
                                </p>
                              </div>
                              <Badge variant="outline">Concluída</Badge>
                            </div>
                          </div>

                          <div className="p-2 border rounded">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-medium">
                                  Exame de Sangue
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  10/01/2024
                                </p>
                              </div>
                              <Badge variant="secondary">Resultado</Badge>
                            </div>
                          </div>

                          <div className="p-2 border rounded">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-medium">
                                  Raio-X Tórax
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  05/01/2024
                                </p>
                              </div>
                              <Badge variant="outline">Normal</Badge>
                            </div>
                          </div>
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

// Prontuário eletrônico
export const ElectronicRecord: Story = {
  render: () => (
    <div className="h-[600px] w-full">
      <ResizablePanelGroup direction="horizontal">
        {/* Lista de pacientes */}
        <ResizablePanel defaultSize={30} minSize={25}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Pacientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {[
                    { name: 'Ana Silva', age: 34, status: 'Ativo' },
                    { name: 'João Santos', age: 45, status: 'Consulta' },
                    { name: 'Maria Oliveira', age: 28, status: 'Ativo' },
                    { name: 'Pedro Costa', age: 52, status: 'Exame' },
                    { name: 'Carla Ferreira', age: 39, status: 'Ativo' },
                  ].map((patient, index) => (
                    <div
                      key={index}
                      className="p-2 border rounded cursor-pointer hover:bg-muted"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">{patient.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {patient.age} anos
                          </p>
                        </div>
                        <Badge
                          variant={
                            patient.status === 'Consulta'
                              ? 'default'
                              : patient.status === 'Exame'
                                ? 'secondary'
                                : 'outline'
                          }
                          className="text-xs"
                        >
                          {patient.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Prontuário detalhado */}
        <ResizablePanel defaultSize={70}>
          <ResizablePanelGroup direction="vertical">
            {/* Cabeçalho do prontuário */}
            <ResizablePanel defaultSize={25}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Prontuário - João Santos
                  </CardTitle>
                  <CardDescription>Registro médico completo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium">Última Consulta</p>
                      <p className="text-sm text-muted-foreground">
                        15/01/2024
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Próxima Consulta</p>
                      <p className="text-sm text-muted-foreground">
                        22/01/2024
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Médico Responsável</p>
                      <p className="text-sm text-muted-foreground">Dr. Silva</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Conteúdo do prontuário */}
            <ResizablePanel defaultSize={75}>
              <ResizablePanelGroup direction="horizontal">
                {/* Evolução médica */}
                <ResizablePanel defaultSize={60}>
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Evolução Médica
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px]">
                        <div className="space-y-4">
                          <div className="border-l-2 border-blue-500 pl-4">
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-sm font-medium">
                                15/01/2024 - 14:30
                              </p>
                              <Badge variant="outline">Dr. Silva</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Paciente retorna para acompanhamento. Refere
                              melhora dos sintomas após início da medicação.
                              Exame físico sem alterações. Manter tratamento
                              atual.
                            </p>
                          </div>

                          <div className="border-l-2 border-green-500 pl-4">
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-sm font-medium">
                                10/01/2024 - 09:15
                              </p>
                              <Badge variant="outline">Dr. Silva</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Primeira consulta. Paciente apresenta quadro de
                              hipertensão leve. Solicitados exames
                              complementares. Iniciado tratamento medicamentoso.
                            </p>
                          </div>
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Exames e medicações */}
                <ResizablePanel defaultSize={40}>
                  <ResizablePanelGroup direction="vertical">
                    {/* Exames */}
                    <ResizablePanel defaultSize={50}>
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <TestTube className="h-5 w-5" />
                            Exames
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center p-2 border rounded">
                              <div>
                                <p className="text-sm font-medium">Hemograma</p>
                                <p className="text-xs text-muted-foreground">
                                  12/01/2024
                                </p>
                              </div>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </div>

                            <div className="flex justify-between items-center p-2 border rounded">
                              <div>
                                <p className="text-sm font-medium">Glicemia</p>
                                <p className="text-xs text-muted-foreground">
                                  12/01/2024
                                </p>
                              </div>
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    {/* Medicações */}
                    <ResizablePanel defaultSize={50}>
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Pill className="h-5 w-5" />
                            Medicações
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="p-2 border rounded">
                              <p className="text-sm font-medium">
                                Losartana 50mg
                              </p>
                              <p className="text-xs text-muted-foreground">
                                1x ao dia - manhã
                              </p>
                            </div>

                            <div className="p-2 border rounded">
                              <p className="text-sm font-medium">
                                Hidroclorotiazida 25mg
                              </p>
                              <p className="text-xs text-muted-foreground">
                                1x ao dia - manhã
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

// Layout vertical para análise de exames
export const ExamAnalysis: Story = {
  render: () => (
    <div className="h-[600px] w-full">
      <ResizablePanelGroup direction="vertical">
        {/* Cabeçalho com informações do exame */}
        <ResizablePanel defaultSize={20} minSize={15}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Análise de Exame - Raio-X Tórax
              </CardTitle>
              <CardDescription>João Santos - 15/01/2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <Badge variant="outline">Radiologia</Badge>
                  <Badge variant="secondary">Concluído</Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Dr. Radiologista</p>
                  <p className="text-xs text-muted-foreground">CRM 12345</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Área principal dividida */}
        <ResizablePanel defaultSize={80}>
          <ResizablePanelGroup direction="horizontal">
            {/* Visualização da imagem */}
            <ResizablePanel defaultSize={70}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Imagem do Exame
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[400px] bg-muted/20">
                  <div className="text-center space-y-2">
                    <Image className="h-16 w-16 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Visualização da imagem do exame
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Raio-X Tórax PA e Perfil
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Painel de análise e laudos */}
            <ResizablePanel defaultSize={30}>
              <ResizablePanelGroup direction="vertical">
                {/* Laudo médico */}
                <ResizablePanel defaultSize={60}>
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Laudo
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[200px]">
                        <div className="space-y-3 text-sm">
                          <div>
                            <p className="font-medium">Técnica:</p>
                            <p className="text-muted-foreground">
                              Radiografias do tórax em incidências PA e perfil.
                            </p>
                          </div>

                          <div>
                            <p className="font-medium">Achados:</p>
                            <p className="text-muted-foreground">
                              Pulmões expandidos e transparentes. Seios
                              costofrênicos livres. Silhueta cardíaca dentro dos
                              limites da normalidade.
                            </p>
                          </div>

                          <div>
                            <p className="font-medium">Conclusão:</p>
                            <p className="text-muted-foreground">
                              Exame radiológico do tórax sem alterações
                              patológicas evidentes.
                            </p>
                          </div>
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Histórico de exames */}
                <ResizablePanel defaultSize={40}>
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Histórico
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="p-2 border rounded">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium">
                                Raio-X Tórax
                              </p>
                              <p className="text-xs text-muted-foreground">
                                15/01/2024
                              </p>
                            </div>
                            <Badge variant="default">Atual</Badge>
                          </div>
                        </div>

                        <div className="p-2 border rounded">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium">
                                Raio-X Tórax
                              </p>
                              <p className="text-xs text-muted-foreground">
                                15/12/2023
                              </p>
                            </div>
                            <Badge variant="outline">Anterior</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

// Layout compacto para dispositivos menores
export const CompactLayout: Story = {
  render: () => (
    <div className="h-[400px] w-full">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={40}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Métricas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Pacientes Hoje</span>
                <Badge variant="default">24</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Consultas</span>
                <Badge variant="secondary">18</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Exames</span>
                <Badge variant="outline">6</Badge>
              </div>
            </CardContent>
          </Card>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={60}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Resumo do Dia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 border rounded">
                  <span className="text-sm">Consultas Realizadas</span>
                  <span className="font-mono text-sm">15/18</span>
                </div>
                <div className="flex justify-between items-center p-2 border rounded">
                  <span className="text-sm">Exames Pendentes</span>
                  <span className="font-mono text-sm">3/6</span>
                </div>
                <div className="flex justify-between items-center p-2 border rounded">
                  <span className="text-sm">Próxima Consulta</span>
                  <span className="font-mono text-sm">15:30</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};
