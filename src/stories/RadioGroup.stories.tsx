import { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
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
  User,
  Activity,
  Heart,
  Thermometer,
  Droplets,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle,
  Star,
  MapPin,
  CreditCard,
  Shield,
} from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente RadioGroup para seleções exclusivas no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Valor selecionado',
    },
    onValueChange: {
      action: 'valueChanged',
      description: 'Callback quando valor muda',
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita o grupo',
    },
    className: {
      control: 'text',
      description: 'Classes CSS adicionais',
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// RadioGroup básico
export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option1" id="option1" />
        <Label htmlFor="option1">Opção 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option2" id="option2" />
        <Label htmlFor="option2">Opção 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option3" id="option3" />
        <Label htmlFor="option3">Opção 3</Label>
      </div>
    </RadioGroup>
  ),
};

// Seleção de tipo de consulta
export const ConsultationType: Story = {
  render: () => {
    const [consultationType, setConsultationType] = useState('routine');

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Tipo de Consulta
          </CardTitle>
          <CardDescription>
            Selecione o tipo de consulta a ser agendada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={consultationType}
            onValueChange={setConsultationType}
          >
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="routine" id="routine" />
              <div className="flex-1">
                <Label htmlFor="routine" className="font-medium cursor-pointer">
                  Consulta de Rotina
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Consulta regular para acompanhamento
                </p>
              </div>
              <Badge variant="secondary">30 min</Badge>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="urgent" id="urgent" />
              <div className="flex-1">
                <Label htmlFor="urgent" className="font-medium cursor-pointer">
                  Consulta Urgente
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Para casos que requerem atenção imediata
                </p>
              </div>
              <Badge variant="destructive">15 min</Badge>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="followup" id="followup" />
              <div className="flex-1">
                <Label
                  htmlFor="followup"
                  className="font-medium cursor-pointer"
                >
                  Retorno
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Consulta de acompanhamento pós-tratamento
                </p>
              </div>
              <Badge variant="outline">20 min</Badge>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="specialist" id="specialist" />
              <div className="flex-1">
                <Label
                  htmlFor="specialist"
                  className="font-medium cursor-pointer"
                >
                  Consulta Especializada
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Consulta com especialista
                </p>
              </div>
              <Badge variant="secondary">45 min</Badge>
            </div>
          </RadioGroup>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Selecionado:</strong>{' '}
              {consultationType === 'routine' && 'Consulta de Rotina'}
              {consultationType === 'urgent' && 'Consulta Urgente'}
              {consultationType === 'followup' && 'Retorno'}
              {consultationType === 'specialist' && 'Consulta Especializada'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  },
};

// Prioridade do paciente
export const PatientPriority: Story = {
  render: () => {
    const [priority, setPriority] = useState('normal');

    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Prioridade do Paciente
          </CardTitle>
          <CardDescription>
            Defina o nível de prioridade para atendimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={priority} onValueChange={setPriority}>
            <div className="flex items-center space-x-3 p-2">
              <RadioGroupItem value="low" id="low" />
              <Label
                htmlFor="low"
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Baixa Prioridade
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-2">
              <RadioGroupItem value="normal" id="normal" />
              <Label
                htmlFor="normal"
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Prioridade Normal
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-2">
              <RadioGroupItem value="high" id="high" />
              <Label
                htmlFor="high"
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                Alta Prioridade
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-2">
              <RadioGroupItem value="critical" id="critical" />
              <Label
                htmlFor="critical"
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                Prioridade Crítica
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    );
  },
};

// Tipo de exame
export const ExamType: Story = {
  render: () => {
    const [examType, setExamType] = useState('');

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Tipo de Exame
          </CardTitle>
          <CardDescription>
            Selecione o tipo de exame a ser realizado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={examType} onValueChange={setExamType}>
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="blood" id="blood" />
              <div className="flex items-center gap-3 flex-1">
                <Droplets className="h-5 w-5 text-red-500" />
                <div>
                  <Label htmlFor="blood" className="font-medium cursor-pointer">
                    Exame de Sangue
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Hemograma, glicemia, colesterol
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="urine" id="urine" />
              <div className="flex items-center gap-3 flex-1">
                <Droplets className="h-5 w-5 text-yellow-500" />
                <div>
                  <Label htmlFor="urine" className="font-medium cursor-pointer">
                    Exame de Urina
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Urina tipo 1, urocultura
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="imaging" id="imaging" />
              <div className="flex items-center gap-3 flex-1">
                <Activity className="h-5 w-5 text-blue-500" />
                <div>
                  <Label
                    htmlFor="imaging"
                    className="font-medium cursor-pointer"
                  >
                    Exame de Imagem
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Raio-X, ultrassom, tomografia
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="cardio" id="cardio" />
              <div className="flex items-center gap-3 flex-1">
                <Heart className="h-5 w-5 text-red-500" />
                <div>
                  <Label
                    htmlFor="cardio"
                    className="font-medium cursor-pointer"
                  >
                    Exame Cardiológico
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    ECG, ecocardiograma, teste ergométrico
                  </p>
                </div>
              </div>
            </div>
          </RadioGroup>

          {examType && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800 font-medium">
                  Exame selecionado: {examType === 'blood' && 'Exame de Sangue'}
                  {examType === 'urine' && 'Exame de Urina'}
                  {examType === 'imaging' && 'Exame de Imagem'}
                  {examType === 'cardio' && 'Exame Cardiológico'}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  },
};

// Horário de atendimento
export const AppointmentTime: Story = {
  render: () => {
    const [timeSlot, setTimeSlot] = useState('');

    const timeSlots = [
      { value: '08:00', label: '08:00', available: true },
      { value: '08:30', label: '08:30', available: true },
      { value: '09:00', label: '09:00', available: false },
      { value: '09:30', label: '09:30', available: true },
      { value: '10:00', label: '10:00', available: true },
      { value: '10:30', label: '10:30', available: false },
      { value: '11:00', label: '11:00', available: true },
      { value: '11:30', label: '11:30', available: true },
    ];

    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horário de Atendimento
          </CardTitle>
          <CardDescription>Selecione um horário disponível</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={timeSlot} onValueChange={setTimeSlot}>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map(slot => (
                <div
                  key={slot.value}
                  className={`relative ${!slot.available ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem
                      value={slot.value}
                      id={slot.value}
                      disabled={!slot.available}
                    />
                    <Label
                      htmlFor={slot.value}
                      className={`cursor-pointer ${
                        !slot.available ? 'text-muted-foreground' : ''
                      }`}
                    >
                      {slot.label}
                    </Label>
                  </div>
                  {!slot.available && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 rounded-lg">
                      <span className="text-xs text-red-600 font-medium">
                        Ocupado
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </RadioGroup>

          {timeSlot && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  Horário selecionado: <strong>{timeSlot}</strong>
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  },
};

// Método de pagamento
export const PaymentMethod: Story = {
  render: () => {
    const [paymentMethod, setPaymentMethod] = useState('insurance');

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Método de Pagamento
          </CardTitle>
          <CardDescription>
            Como você gostaria de pagar pela consulta?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="insurance" id="insurance" />
              <div className="flex items-center gap-3 flex-1">
                <Shield className="h-5 w-5 text-blue-500" />
                <div>
                  <Label
                    htmlFor="insurance"
                    className="font-medium cursor-pointer"
                  >
                    Plano de Saúde
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Cobertura pelo convênio médico
                  </p>
                </div>
              </div>
              <Badge variant="secondary">Sem custo</Badge>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="cash" id="cash" />
              <div className="flex items-center gap-3 flex-1">
                <CreditCard className="h-5 w-5 text-green-500" />
                <div>
                  <Label htmlFor="cash" className="font-medium cursor-pointer">
                    Dinheiro
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Pagamento em espécie
                  </p>
                </div>
              </div>
              <Badge variant="outline">R$ 150,00</Badge>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="card" id="card" />
              <div className="flex items-center gap-3 flex-1">
                <CreditCard className="h-5 w-5 text-purple-500" />
                <div>
                  <Label htmlFor="card" className="font-medium cursor-pointer">
                    Cartão de Crédito/Débito
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Pagamento com cartão
                  </p>
                </div>
              </div>
              <Badge variant="outline">R$ 150,00</Badge>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="pix" id="pix" />
              <div className="flex items-center gap-3 flex-1">
                <CreditCard className="h-5 w-5 text-orange-500" />
                <div>
                  <Label htmlFor="pix" className="font-medium cursor-pointer">
                    PIX
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Transferência instantânea
                  </p>
                </div>
              </div>
              <Badge variant="outline">R$ 145,00</Badge>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    );
  },
};

// Avaliação de satisfação
export const SatisfactionRating: Story = {
  render: () => {
    const [rating, setRating] = useState('');

    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Avaliação do Atendimento
          </CardTitle>
          <CardDescription>
            Como você avalia o atendimento recebido?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={rating} onValueChange={setRating}>
            <div className="flex items-center space-x-3 p-2">
              <RadioGroupItem value="excellent" id="excellent" />
              <Label
                htmlFor="excellent"
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                Excelente
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-2">
              <RadioGroupItem value="good" id="good" />
              <Label
                htmlFor="good"
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="flex">
                  {[1, 2, 3, 4].map(star => (
                    <Star
                      key={star}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <Star className="h-4 w-4 text-gray-300" />
                </div>
                Bom
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-2">
              <RadioGroupItem value="average" id="average" />
              <Label
                htmlFor="average"
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="flex">
                  {[1, 2, 3].map(star => (
                    <Star
                      key={star}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  {[4, 5].map(star => (
                    <Star key={star} className="h-4 w-4 text-gray-300" />
                  ))}
                </div>
                Regular
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-2">
              <RadioGroupItem value="poor" id="poor" />
              <Label
                htmlFor="poor"
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="flex">
                  {[1, 2].map(star => (
                    <Star
                      key={star}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  {[3, 4, 5].map(star => (
                    <Star key={star} className="h-4 w-4 text-gray-300" />
                  ))}
                </div>
                Ruim
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-2">
              <RadioGroupItem value="terrible" id="terrible" />
              <Label
                htmlFor="terrible"
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="flex">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {[2, 3, 4, 5].map(star => (
                    <Star key={star} className="h-4 w-4 text-gray-300" />
                  ))}
                </div>
                Péssimo
              </Label>
            </div>
          </RadioGroup>

          {rating && (
            <div className="mt-4">
              <Button className="w-full">Enviar Avaliação</Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  },
};

// RadioGroup desabilitado
export const Disabled: Story = {
  render: () => (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>Opções Desabilitadas</CardTitle>
        <CardDescription>Exemplo de RadioGroup desabilitado</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup disabled defaultValue="option2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option1" id="disabled1" />
            <Label htmlFor="disabled1">Opção 1</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option2" id="disabled2" />
            <Label htmlFor="disabled2">Opção 2 (Selecionada)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option3" id="disabled3" />
            <Label htmlFor="disabled3">Opção 3</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  ),
};

// RadioGroup simples
export const Simple: Story = {
  render: () => (
    <div className="space-y-3">
      <h3 className="font-medium">Selecione uma opção:</h3>
      <RadioGroup defaultValue="yes">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes" id="yes" />
          <Label htmlFor="yes">Sim</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id="no" />
          <Label htmlFor="no">Não</Label>
        </div>
      </RadioGroup>
    </div>
  ),
};
