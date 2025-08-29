import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Componente de skeleton para indicar carregamento de conteúdo, melhorando a experiência do usuário durante operações assíncronas.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Basico: Story = {
  render: () => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[150px]" />
    </div>
  ),
};

export const Circular: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[160px]" />
      </div>
    </div>
  ),
};

export const CardPaciente: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader className="flex flex-row items-center space-y-0 space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-3 w-[80px]" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-3 w-[60px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-[80px]" />
          <Skeleton className="h-4 w-[160px]" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </CardContent>
    </Card>
  ),
};

export const ListaPacientes: Story = {
  render: () => (
    <div className="space-y-4">
      {[1, 2, 3, 4].map(i => (
        <div
          key={i}
          className="flex items-center space-x-4 p-4 border rounded-lg"
        >
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[140px]" />
            <Skeleton className="h-3 w-[100px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      ))}
    </div>
  ),
};

export const TabelaExames: Story = {
  render: () => (
    <div className="space-y-4">
      {/* Header da tabela */}
      <div className="grid grid-cols-6 gap-4 p-4 border-b">
        <Skeleton className="h-4 w-[60px]" />
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-[80px]" />
        <Skeleton className="h-4 w-[70px]" />
        <Skeleton className="h-4 w-[60px]" />
        <Skeleton className="h-4 w-[50px]" />
      </div>

      {/* Linhas da tabela */}
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="grid grid-cols-6 gap-4 p-4 border-b">
          <Skeleton className="h-4 w-[50px]" />
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-4 w-[90px]" />
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <div className="flex space-x-1">
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-6 w-6 rounded" />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const DashboardMedico: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Card de estatísticas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[60px] mb-2" />
          <Skeleton className="h-3 w-[120px]" />
        </CardContent>
      </Card>

      {/* Card de gráfico */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-[140px]" />
          <Skeleton className="h-3 w-[180px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full rounded" />
        </CardContent>
      </Card>

      {/* Card de atividades recentes */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-[120px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-3 w-[100px]" />
                <Skeleton className="h-3 w-[80px]" />
              </div>
              <Skeleton className="h-3 w-[40px]" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  ),
};

export const FormularioMedico: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <Skeleton className="h-6 w-[180px]" />
        <Skeleton className="h-4 w-[250px]" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Campo de input */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Campo de select */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Campo de textarea */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-[90px]" />
          <Skeleton className="h-20 w-full" />
        </div>

        {/* Checkboxes */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-[120px]" />
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-[140px]" />
            </div>
          ))}
        </div>

        {/* Botões */}
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-[80px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </CardContent>
    </Card>
  ),
};

export const CalendarioConsultas: Story = {
  render: () => (
    <Card className="w-[600px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-6 w-[160px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </CardHeader>
      <CardContent>
        {/* Header do calendário */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="text-center p-2">
              <Skeleton className="h-4 w-8 mx-auto" />
            </div>
          ))}
        </div>

        {/* Dias do calendário */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="aspect-square p-2">
              <Skeleton className="h-6 w-6 rounded" />
              {i % 7 === 0 && (
                <Skeleton className="h-2 w-4 mt-1 rounded-full" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  ),
};

export const PerfilMedico: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Skeleton className="h-24 w-24 rounded-full" />
        </div>
        <Skeleton className="h-6 w-[160px] mx-auto mb-2" />
        <Skeleton className="h-4 w-[120px] mx-auto mb-1" />
        <Skeleton className="h-4 w-[100px] mx-auto" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informações pessoais */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-[140px]" />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-[60px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-[80px]" />
              <Skeleton className="h-4 w-[120px]" />
            </div>
          </div>
        </div>

        {/* Especialidades */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-[120px]" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>

        {/* Estatísticas */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-[100px]" />
          <div className="grid grid-cols-3 gap-4 text-center">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-6 w-8 mx-auto" />
                <Skeleton className="h-3 w-12 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const ChatMensagens: Story = {
  render: () => (
    <Card className="w-[400px] h-[500px]">
      <CardHeader className="flex flex-row items-center space-y-0 space-x-3 pb-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-1 flex-1">
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-3 w-[80px]" />
        </div>
        <Skeleton className="h-6 w-6 rounded" />
      </CardHeader>
      <CardContent className="space-y-4 flex-1">
        {/* Mensagens */}
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[80%] ${i % 2 === 0 ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              {i % 2 !== 0 && (
                <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              )}
              <div className="space-y-1">
                <Skeleton
                  className={`h-4 ${i % 3 === 0 ? 'w-[180px]' : i % 3 === 1 ? 'w-[120px]' : 'w-[200px]'} rounded-lg`}
                />
                <Skeleton className="h-3 w-[60px]" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>

      {/* Input de mensagem */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10 rounded" />
        </div>
      </div>
    </Card>
  ),
};
