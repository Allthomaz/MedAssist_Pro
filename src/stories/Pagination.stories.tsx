import type { Meta, StoryObj } from '@storybook/react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Calendar,
  FileText,
  Activity,
  Pill,
  TestTube,
  Clock,
  Filter,
  Search,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';

const meta: Meta<typeof Pagination> = {
  title: 'UI/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente Pagination para navegação entre páginas no MedAssist Pro. Usado para dividir grandes listas de dados médicos em páginas menores e mais gerenciáveis.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Paginação básica
export const Default: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">10</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

// Lista de pacientes com paginação
export const PatientList: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const totalPatients = 247;
    const totalPages = Math.ceil(totalPatients / itemsPerPage);

    const patients = [
      { id: 1, name: 'Ana Silva', age: 34, lastVisit: '2024-01-15' },
      { id: 2, name: 'João Santos', age: 45, lastVisit: '2024-01-14' },
      { id: 3, name: 'Maria Oliveira', age: 28, lastVisit: '2024-01-13' },
      { id: 4, name: 'Pedro Costa', age: 52, lastVisit: '2024-01-12' },
      { id: 5, name: 'Carla Ferreira', age: 39, lastVisit: '2024-01-11' },
    ];

    return (
      <div className="w-[800px] space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lista de Pacientes
            </CardTitle>
            <CardDescription>
              {totalPatients} pacientes cadastrados no sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Mostrar:</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={value => setItemsPerPage(Number(value))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">
                  por página
                </span>
              </div>

              <Badge variant="outline">
                Página {currentPage} de {totalPages}
              </Badge>
            </div>

            <div className="space-y-2">
              {patients.map(patient => (
                <div
                  key={patient.id}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {patient.age} anos
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Última consulta</p>
                    <p className="text-sm text-muted-foreground">
                      {patient.lastVisit}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} a{' '}
                {Math.min(currentPage * itemsPerPage, totalPatients)} de{' '}
                {totalPatients} pacientes
              </p>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
                    />
                  </PaginationItem>

                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  {totalPages > 5 && (
                    <>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
};

// Agenda de consultas
export const AppointmentSchedule: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(3);
    const totalAppointments = 156;
    const itemsPerPage = 8;
    const totalPages = Math.ceil(totalAppointments / itemsPerPage);

    const appointments = [
      {
        id: 1,
        patient: 'Ana Silva',
        time: '09:00',
        type: 'Consulta',
        status: 'Confirmada',
      },
      {
        id: 2,
        patient: 'João Santos',
        time: '09:30',
        type: 'Retorno',
        status: 'Aguardando',
      },
      {
        id: 3,
        patient: 'Maria Oliveira',
        time: '10:00',
        type: 'Exame',
        status: 'Em andamento',
      },
      {
        id: 4,
        patient: 'Pedro Costa',
        time: '10:30',
        type: 'Consulta',
        status: 'Confirmada',
      },
    ];

    return (
      <div className="w-[700px] space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Agenda do Dia - 15/01/2024
            </CardTitle>
            <CardDescription>
              {totalAppointments} consultas agendadas este mês
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {appointments.map(appointment => (
                <div
                  key={appointment.id}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="font-mono text-sm font-medium">
                        {appointment.time}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">{appointment.patient}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.type}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      appointment.status === 'Confirmada'
                        ? 'default'
                        : appointment.status === 'Em andamento'
                          ? 'secondary'
                          : 'outline'
                    }
                  >
                    {appointment.status}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                    />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink href="#" onClick={() => setCurrentPage(1)}>
                      1
                    </PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink href="#" onClick={() => setCurrentPage(2)}>
                      2
                    </PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      3
                    </PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink href="#" onClick={() => setCurrentPage(4)}>
                      4
                    </PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink href="#" onClick={() => setCurrentPage(5)}>
                      5
                    </PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages} • {totalAppointments}{' '}
                consultas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
};

// Resultados de exames
export const ExamResults: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalExams = 89;
    const itemsPerPage = 6;
    const totalPages = Math.ceil(totalExams / itemsPerPage);

    const exams = [
      {
        id: 1,
        type: 'Hemograma Completo',
        date: '2024-01-15',
        status: 'Concluído',
        priority: 'Normal',
      },
      {
        id: 2,
        type: 'Glicemia de Jejum',
        date: '2024-01-14',
        status: 'Concluído',
        priority: 'Alterado',
      },
      {
        id: 3,
        type: 'Colesterol Total',
        date: '2024-01-13',
        status: 'Em análise',
        priority: 'Normal',
      },
      {
        id: 4,
        type: 'Raio-X Tórax',
        date: '2024-01-12',
        status: 'Concluído',
        priority: 'Normal',
      },
      {
        id: 5,
        type: 'Urina Tipo I',
        date: '2024-01-11',
        status: 'Concluído',
        priority: 'Alterado',
      },
    ];

    return (
      <div className="w-[750px] space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Resultados de Exames
            </CardTitle>
            <CardDescription>
              {totalExams} exames realizados nos últimos 30 dias
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {exams.map(exam => (
                <div
                  key={exam.id}
                  className="flex justify-between items-center p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{exam.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {exam.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        exam.priority === 'Alterado' ? 'destructive' : 'outline'
                      }
                    >
                      {exam.priority}
                    </Badge>
                    <Badge
                      variant={
                        exam.status === 'Concluído' ? 'default' : 'secondary'
                      }
                    >
                      {exam.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </Button>
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      className="pointer-events-none opacity-50"
                    />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink href="#">{totalPages}</PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Mostrando 1-{itemsPerPage} de {totalExams} exames
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
};

// Paginação compacta
export const Compact: Story = {
  render: () => (
    <div className="space-y-4">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Sinais Vitais
          </CardTitle>
          <CardDescription>Histórico dos últimos registros</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between p-2 border rounded">
              <span className="text-sm">Pressão Arterial</span>
              <span className="text-sm font-mono">120/80 mmHg</span>
            </div>
            <div className="flex justify-between p-2 border rounded">
              <span className="text-sm">Frequência Cardíaca</span>
              <span className="text-sm font-mono">72 bpm</span>
            </div>
            <div className="flex justify-between p-2 border rounded">
              <span className="text-sm">Temperatura</span>
              <span className="text-sm font-mono">36.5°C</span>
            </div>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
    </div>
  ),
};

// Paginação com muitas páginas
export const ManyPages: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(47);
    const totalPages = 150;

    return (
      <div className="space-y-4">
        <Card className="w-[600px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Histórico de Medicações
            </CardTitle>
            <CardDescription>
              {totalPages * 20} registros de medicações prescritas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Badge variant="outline" className="mb-4">
                Página {currentPage} de {totalPages}
              </Badge>
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  />
                </PaginationItem>

                <PaginationItem>
                  <PaginationLink href="#" onClick={() => setCurrentPage(1)}>
                    1
                  </PaginationLink>
                </PaginationItem>

                {currentPage > 4 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {[...Array(3)].map((_, i) => {
                  const pageNum = currentPage - 1 + i;
                  if (pageNum > 1 && pageNum < totalPages) {
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          isActive={pageNum === currentPage}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                {currentPage < totalPages - 3 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Navegando por um grande volume de dados médicos
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
};
