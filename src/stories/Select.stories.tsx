import { Meta, StoryObj } from '@storybook/react-vite';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Stethoscope,
  Calendar,
  MapPin,
  Clock,
  Heart,
} from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente Select para seleção de opções no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// Select básico
export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Selecione uma opção" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Opção 1</SelectItem>
        <SelectItem value="option2">Opção 2</SelectItem>
        <SelectItem value="option3">Opção 3</SelectItem>
      </SelectContent>
    </Select>
  ),
};

// Select com label
export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="specialty">Especialidade Médica</Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Selecione a especialidade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="cardiology">Cardiologia</SelectItem>
          <SelectItem value="pediatrics">Pediatria</SelectItem>
          <SelectItem value="orthopedics">Ortopedia</SelectItem>
          <SelectItem value="neurology">Neurologia</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

// Select de especialidades médicas
export const MedicalSpecialties: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-2">
      <Label className="flex items-center gap-2">
        <Stethoscope className="h-4 w-4 text-medical-blue" />
        Especialidade
      </Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Escolha a especialidade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="general">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Clínica Geral
            </div>
          </SelectItem>
          <SelectItem value="cardiology">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              Cardiologia
            </div>
          </SelectItem>
          <SelectItem value="pediatrics">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-500" />
              Pediatria
            </div>
          </SelectItem>
          <SelectItem value="orthopedics">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-green-500" />
              Ortopedia
            </div>
          </SelectItem>
          <SelectItem value="neurology">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-purple-500" />
              Neurologia
            </div>
          </SelectItem>
          <SelectItem value="dermatology">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-orange-500" />
              Dermatologia
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

// Select de horários
export const TimeSlots: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-2">
      <Label className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-medical-blue" />
        Horário da Consulta
      </Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Selecione o horário" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="08:00">08:00 - Disponível</SelectItem>
          <SelectItem value="08:30">08:30 - Disponível</SelectItem>
          <SelectItem value="09:00" disabled>
            09:00 - Ocupado
          </SelectItem>
          <SelectItem value="09:30">09:30 - Disponível</SelectItem>
          <SelectItem value="10:00">10:00 - Disponível</SelectItem>
          <SelectItem value="10:30" disabled>
            10:30 - Ocupado
          </SelectItem>
          <SelectItem value="11:00">11:00 - Disponível</SelectItem>
          <SelectItem value="14:00">14:00 - Disponível</SelectItem>
          <SelectItem value="14:30">14:30 - Disponível</SelectItem>
          <SelectItem value="15:00">15:00 - Disponível</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

// Select de pacientes
export const PatientSelect: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-2">
      <Label className="flex items-center gap-2">
        <User className="h-4 w-4 text-medical-blue" />
        Selecionar Paciente
      </Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Buscar paciente..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="patient1">
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="font-medium">João Silva</div>
                <div className="text-sm text-muted-foreground">
                  CPF: 123.456.789-00
                </div>
              </div>
              <Badge className="bg-medical-success text-medical-success-foreground text-xs">
                Ativo
              </Badge>
            </div>
          </SelectItem>
          <SelectItem value="patient2">
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="font-medium">Maria Santos</div>
                <div className="text-sm text-muted-foreground">
                  CPF: 987.654.321-00
                </div>
              </div>
              <Badge className="bg-medical-success text-medical-success-foreground text-xs">
                Ativo
              </Badge>
            </div>
          </SelectItem>
          <SelectItem value="patient3">
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="font-medium">Pedro Costa</div>
                <div className="text-sm text-muted-foreground">
                  CPF: 456.789.123-00
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                Inativo
              </Badge>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

// Select de status
export const StatusSelect: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-2">
      <Label>Status da Consulta</Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Alterar status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="scheduled">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Agendada
            </div>
          </SelectItem>
          <SelectItem value="confirmed">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Confirmada
            </div>
          </SelectItem>
          <SelectItem value="in-progress">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              Em Andamento
            </div>
          </SelectItem>
          <SelectItem value="completed">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-medical-success rounded-full"></div>
              Concluída
            </div>
          </SelectItem>
          <SelectItem value="cancelled">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Cancelada
            </div>
          </SelectItem>
          <SelectItem value="no-show">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              Não Compareceu
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

// Select com busca
export const SearchableSelect: Story = {
  render: () => {
    const [searchTerm, setSearchTerm] = useState('');
    const cities = [
      'São Paulo',
      'Rio de Janeiro',
      'Belo Horizonte',
      'Salvador',
      'Brasília',
      'Fortaleza',
      'Curitiba',
      'Recife',
      'Porto Alegre',
      'Manaus',
    ];

    const filteredCities = cities.filter(city =>
      city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="w-full max-w-sm space-y-2">
        <Label className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-medical-blue" />
          Cidade
        </Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a cidade" />
          </SelectTrigger>
          <SelectContent>
            {filteredCities.map(city => (
              <SelectItem
                key={city}
                value={city.toLowerCase().replace(' ', '-')}
              >
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  },
};

// Select desabilitado
export const Disabled: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-2">
      <Label>Especialidade (Desabilitado)</Label>
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Não disponível" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="cardiology">Cardiologia</SelectItem>
          <SelectItem value="pediatrics">Pediatria</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

// Select com valor padrão
export const WithDefaultValue: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-2">
      <Label>Prioridade</Label>
      <Select defaultValue="medium">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Baixa
            </div>
          </SelectItem>
          <SelectItem value="medium">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              Média
            </div>
          </SelectItem>
          <SelectItem value="high">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Alta
            </div>
          </SelectItem>
          <SelectItem value="urgent">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-700 rounded-full animate-pulse"></div>
              Urgente
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

// Select múltiplo (simulado)
export const MultipleSelects: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <div className="space-y-2">
        <Label>Médico Responsável</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o médico" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dr-silva">
              Dr. João Silva - Cardiologia
            </SelectItem>
            <SelectItem value="dra-santos">
              Dra. Maria Santos - Pediatria
            </SelectItem>
            <SelectItem value="dr-costa">
              Dr. Pedro Costa - Ortopedia
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Tipo de Consulta</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="routine">Consulta de Rotina</SelectItem>
            <SelectItem value="followup">Retorno</SelectItem>
            <SelectItem value="emergency">Emergência</SelectItem>
            <SelectItem value="checkup">Check-up</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Duração</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Tempo estimado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15min">15 minutos</SelectItem>
            <SelectItem value="30min">30 minutos</SelectItem>
            <SelectItem value="45min">45 minutos</SelectItem>
            <SelectItem value="60min">1 hora</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button className="w-full" variant="medical">
        Agendar Consulta
      </Button>
    </div>
  ),
};
