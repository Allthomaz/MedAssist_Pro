import { Meta, StoryObj } from '@storybook/react-vite';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal, Eye, Edit, Trash2, Download } from 'lucide-react';

const meta: Meta<typeof Table> = {
  title: 'UI/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Componente de tabela flexível para exibição de dados estruturados com suporte a diferentes layouts e casos de uso médicos.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;

// Dados de exemplo para as stories
const pacientes = [
  {
    id: '001',
    nome: 'Ana Silva',
    idade: 34,
    telefone: '(11) 99999-1234',
    email: 'ana.silva@email.com',
    status: 'Ativo',
    ultimaConsulta: '15/01/2024',
    medico: 'Dr. João Santos',
  },
  {
    id: '002',
    nome: 'Carlos Oliveira',
    idade: 45,
    telefone: '(11) 88888-5678',
    email: 'carlos.oliveira@email.com',
    status: 'Inativo',
    ultimaConsulta: '10/12/2023',
    medico: 'Dra. Maria Costa',
  },
  {
    id: '003',
    nome: 'Beatriz Santos',
    idade: 28,
    telefone: '(11) 77777-9012',
    email: 'beatriz.santos@email.com',
    status: 'Ativo',
    ultimaConsulta: '20/01/2024',
    medico: 'Dr. Pedro Lima',
  },
];

const exames = [
  {
    id: 'EX001',
    tipo: 'Hemograma Completo',
    paciente: 'Ana Silva',
    data: '15/01/2024',
    status: 'Concluído',
    resultado: 'Normal',
    medico: 'Dr. João Santos',
    prioridade: 'Normal',
  },
  {
    id: 'EX002',
    tipo: 'Raio-X Tórax',
    paciente: 'Carlos Oliveira',
    data: '18/01/2024',
    status: 'Pendente',
    resultado: '-',
    medico: 'Dra. Maria Costa',
    prioridade: 'Urgente',
  },
  {
    id: 'EX003',
    tipo: 'Ultrassom Abdominal',
    paciente: 'Beatriz Santos',
    data: '20/01/2024',
    status: 'Em Análise',
    resultado: 'Aguardando',
    medico: 'Dr. Pedro Lima',
    prioridade: 'Alta',
  },
];

const medicamentos = [
  {
    nome: 'Paracetamol 500mg',
    categoria: 'Analgésico',
    estoque: 150,
    minimo: 50,
    validade: '12/2025',
    fornecedor: 'Farmácia Central',
    preco: 'R$ 12,50',
  },
  {
    nome: 'Amoxicilina 875mg',
    categoria: 'Antibiótico',
    estoque: 25,
    minimo: 30,
    validade: '08/2024',
    fornecedor: 'MedSupply',
    preco: 'R$ 28,90',
  },
  {
    nome: 'Losartana 50mg',
    categoria: 'Anti-hipertensivo',
    estoque: 80,
    minimo: 40,
    validade: '03/2025',
    fornecedor: 'Farmácia Central',
    preco: 'R$ 15,75',
  },
];

function getStatusBadge(status: string) {
  const variants: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
  > = {
    Ativo: 'default',
    Inativo: 'secondary',
    Concluído: 'default',
    Pendente: 'outline',
    'Em Análise': 'secondary',
  };
  return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
}

function getPrioridadeBadge(prioridade: string) {
  const variants: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
  > = {
    Normal: 'outline',
    Alta: 'secondary',
    Urgente: 'destructive',
  };
  return (
    <Badge variant={variants[prioridade] || 'outline'}>{prioridade}</Badge>
  );
}

function getEstoqueBadge(atual: number, minimo: number) {
  if (atual < minimo) {
    return <Badge variant="destructive">Baixo</Badge>;
  } else if (atual < minimo * 1.5) {
    return <Badge variant="secondary">Médio</Badge>;
  }
  return <Badge variant="default">Alto</Badge>;
}

export const Basica: Story = {
  render: () => (
    <Table>
      <TableCaption>Lista de pacientes cadastrados no sistema.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Idade</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pacientes.map(paciente => (
          <TableRow key={paciente.id}>
            <TableCell className="font-medium">{paciente.id}</TableCell>
            <TableCell>{paciente.nome}</TableCell>
            <TableCell>{paciente.idade} anos</TableCell>
            <TableCell>{getStatusBadge(paciente.status)}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const ComSelecao: Story = {
  render: () => (
    <Table>
      <TableCaption>
        Selecione os pacientes para enviar notificações.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox />
          </TableHead>
          <TableHead>Paciente</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Última Consulta</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pacientes.map(paciente => (
          <TableRow key={paciente.id}>
            <TableCell>
              <Checkbox />
            </TableCell>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {paciente.nome
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                {paciente.nome}
              </div>
            </TableCell>
            <TableCell>{paciente.telefone}</TableCell>
            <TableCell>{paciente.email}</TableCell>
            <TableCell>{paciente.ultimaConsulta}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const TabelaExames: Story = {
  render: () => (
    <Table>
      <TableCaption>Exames realizados e pendentes no sistema.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Tipo de Exame</TableHead>
          <TableHead>Paciente</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Prioridade</TableHead>
          <TableHead>Resultado</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exames.map(exame => (
          <TableRow key={exame.id}>
            <TableCell className="font-medium">{exame.id}</TableCell>
            <TableCell>{exame.tipo}</TableCell>
            <TableCell>{exame.paciente}</TableCell>
            <TableCell>{exame.data}</TableCell>
            <TableCell>{getStatusBadge(exame.status)}</TableCell>
            <TableCell>{getPrioridadeBadge(exame.prioridade)}</TableCell>
            <TableCell>{exame.resultado}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const EstoqueMedicamentos: Story = {
  render: () => (
    <Table>
      <TableCaption>Controle de estoque de medicamentos.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Medicamento</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Estoque Atual</TableHead>
          <TableHead>Estoque Mínimo</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Validade</TableHead>
          <TableHead>Preço</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {medicamentos.map((medicamento, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{medicamento.nome}</TableCell>
            <TableCell>{medicamento.categoria}</TableCell>
            <TableCell>{medicamento.estoque}</TableCell>
            <TableCell>{medicamento.minimo}</TableCell>
            <TableCell>
              {getEstoqueBadge(medicamento.estoque, medicamento.minimo)}
            </TableCell>
            <TableCell>{medicamento.validade}</TableCell>
            <TableCell>{medicamento.preco}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={7}>Total de medicamentos</TableCell>
          <TableCell className="text-right font-medium">
            {medicamentos.length}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

export const TabelaCompacta: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>Paciente</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pacientes.slice(0, 3).map((paciente, index) => (
          <TableRow key={paciente.id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {paciente.nome
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{paciente.nome}</span>
              </div>
            </TableCell>
            <TableCell>{getStatusBadge(paciente.status)}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">
                <Eye className="h-3 w-3" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const TabelaVazia: Story = {
  render: () => (
    <Table>
      <TableCaption>Nenhum paciente encontrado.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={4}
            className="h-24 text-center text-muted-foreground"
          >
            Nenhum resultado encontrado.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const TabelaCarregando: Story = {
  render: () => (
    <Table>
      <TableCaption>Carregando dados dos pacientes...</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[1, 2, 3].map(i => (
          <TableRow key={i}>
            <TableCell>
              <div className="h-4 w-12 bg-muted animate-pulse rounded" />
            </TableCell>
            <TableCell>
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            </TableCell>
            <TableCell>
              <div className="h-6 w-16 bg-muted animate-pulse rounded" />
            </TableCell>
            <TableCell className="text-right">
              <div className="h-8 w-8 bg-muted animate-pulse rounded ml-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const TabelaResponsiva: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <div className="w-full">
      <Table>
        <TableCaption>Tabela responsiva para dispositivos móveis.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Paciente</TableHead>
            <TableHead className="hidden sm:table-cell">Telefone</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pacientes.map(paciente => (
            <TableRow key={paciente.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{paciente.nome}</div>
                  <div className="text-sm text-muted-foreground sm:hidden">
                    {paciente.telefone}
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {paciente.telefone}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {paciente.email}
              </TableCell>
              <TableCell>{getStatusBadge(paciente.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};
