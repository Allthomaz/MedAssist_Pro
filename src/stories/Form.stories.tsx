import { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Pill,
  Stethoscope,
  Activity,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Shield,
  Eye,
  EyeOff,
  UserCheck,
  Building,
  CreditCard,
  Thermometer,
  Droplets,
  Weight,
  Ruler,
  Brain,
  TestTube,
} from 'lucide-react';
import { useState } from 'react';

const meta: Meta<typeof Form> = {
  title: 'UI/Form',
  component: Form,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente Form para criação de formulários robustos com validação no MedAssist Pro.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Schema para cadastro de paciente
const patientSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos'),
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
  gender: z.enum(['masculino', 'feminino', 'outro'], {
    required_error: 'Selecione o gênero',
  }),
  address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  emergencyContact: z.string().min(10, 'Contato de emergência é obrigatório'),
  medicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  currentMedications: z.string().optional(),
  insuranceProvider: z.string().optional(),
  insuranceNumber: z.string().optional(),
});

// Formulário de cadastro de paciente
export const PatientRegistration: Story = {
  render: () => {
    const form = useForm<z.infer<typeof patientSchema>>({
      resolver: zodResolver(patientSchema),
      defaultValues: {
        name: '',
        email: '',
        phone: '',
        cpf: '',
        birthDate: '',
        address: '',
        emergencyContact: '',
        medicalHistory: '',
        allergies: '',
        currentMedications: '',
        insuranceProvider: '',
        insuranceNumber: '',
      },
    });

    function onSubmit(values: z.infer<typeof patientSchema>) {
      console.log('Dados do paciente:', values);
    }

    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Cadastro de Paciente
          </CardTitle>
          <CardDescription>
            Preencha as informações do paciente para criar um novo prontuário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Informações Pessoais */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <h3 className="text-lg font-medium">Informações Pessoais</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="João Silva Santos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <Input placeholder="000.000.000-00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Data de Nascimento
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gênero</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o gênero" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="masculino">Masculino</SelectItem>
                            <SelectItem value="feminino">Feminino</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Contato */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <h3 className="text-lg font-medium">Contato</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          E-mail
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="joao@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="(11) 99999-9999" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Endereço Completo
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Rua das Flores, 123, Centro, São Paulo - SP"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Contato de Emergência
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Maria Silva - (11) 88888-8888"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Nome e telefone de uma pessoa para contato em
                        emergências
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Informações Médicas */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <h3 className="text-lg font-medium">Informações Médicas</h3>
                </div>

                <FormField
                  control={form.control}
                  name="medicalHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Histórico Médico</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Doenças prévias, cirurgias, condições crônicas..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        Alergias
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Medicamentos, alimentos, substâncias..."
                          className="min-h-[60px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentMedications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Pill className="h-4 w-4" />
                        Medicações Atuais
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Medicamentos em uso, dosagens, frequência..."
                          className="min-h-[60px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Convênio */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <h3 className="text-lg font-medium">Convênio Médico</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="insuranceProvider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operadora</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Unimed, Bradesco Saúde, SUS..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="insuranceNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número da Carteirinha</FormLabel>
                        <FormControl>
                          <Input placeholder="123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
                <Button type="submit" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Cadastrar Paciente
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  },
};

// Schema para sinais vitais
const vitalSignsSchema = z.object({
  temperature: z.string().min(1, 'Temperatura é obrigatória'),
  bloodPressureSystolic: z.string().min(1, 'Pressão sistólica é obrigatória'),
  bloodPressureDiastolic: z.string().min(1, 'Pressão diastólica é obrigatória'),
  heartRate: z.string().min(1, 'Frequência cardíaca é obrigatória'),
  respiratoryRate: z.string().min(1, 'Frequência respiratória é obrigatória'),
  oxygenSaturation: z.string().min(1, 'Saturação de oxigênio é obrigatória'),
  weight: z.string().optional(),
  height: z.string().optional(),
  bmi: z.string().optional(),
  notes: z.string().optional(),
});

// Formulário de sinais vitais
export const VitalSigns: Story = {
  render: () => {
    const form = useForm<z.infer<typeof vitalSignsSchema>>({
      resolver: zodResolver(vitalSignsSchema),
      defaultValues: {
        temperature: '',
        bloodPressureSystolic: '',
        bloodPressureDiastolic: '',
        heartRate: '',
        respiratoryRate: '',
        oxygenSaturation: '',
        weight: '',
        height: '',
        bmi: '',
        notes: '',
      },
    });

    function onSubmit(values: z.infer<typeof vitalSignsSchema>) {
      console.log('Sinais vitais:', values);
    }

    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Registro de Sinais Vitais
          </CardTitle>
          <CardDescription>
            Registre os sinais vitais do paciente durante a consulta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Sinais Vitais Básicos */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  <h3 className="text-lg font-medium">Sinais Vitais</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4" />
                          Temperatura (°C)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="36.5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="heartRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          FC (bpm)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="72" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="respiratoryRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>FR (rpm)</FormLabel>
                        <FormControl>
                          <Input placeholder="16" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Pressão Arterial (mmHg)</Label>
                    <div className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name="bloodPressureSystolic"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="120" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <span className="text-muted-foreground">x</span>
                      <FormField
                        control={form.control}
                        name="bloodPressureDiastolic"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="80" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="oxygenSaturation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Droplets className="h-4 w-4" />
                          SpO2 (%)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="98" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Medidas Antropométricas */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  <h3 className="text-lg font-medium">
                    Medidas Antropométricas
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Weight className="h-4 w-4" />
                          Peso (kg)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="70.5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Altura (cm)</FormLabel>
                        <FormControl>
                          <Input placeholder="175" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bmi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IMC</FormLabel>
                        <FormControl>
                          <Input placeholder="23.0" {...field} />
                        </FormControl>
                        <FormDescription>
                          Calculado automaticamente
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Observações
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Observações sobre os sinais vitais..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
                <Button type="submit" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Salvar Sinais Vitais
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  },
};

// Schema para login
const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  rememberMe: z.boolean().default(false),
});

// Formulário de login simples
export const LoginForm: Story = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<z.infer<typeof loginSchema>>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
        email: '',
        password: '',
        rememberMe: false,
      },
    });

    function onSubmit(values: z.infer<typeof loginSchema>) {
      console.log('Login:', values);
    }

    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Shield className="h-5 w-5" />
            MedAssist Pro
          </CardTitle>
          <CardDescription>Faça login para acessar o sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      E-mail
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Digite sua senha"
                          className="pr-10"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Lembrar de mim</FormLabel>
                      <FormDescription>
                        Manter login por 30 dias
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  },
};

// Schema para exame laboratorial
const labTestSchema = z.object({
  testType: z.string().min(1, 'Tipo de exame é obrigatório'),
  requestDate: z.string().min(1, 'Data da solicitação é obrigatória'),
  urgency: z.enum(['rotina', 'urgente', 'emergencia'], {
    required_error: 'Selecione a urgência',
  }),
  fastingRequired: z.boolean().default(false),
  clinicalIndication: z.string().min(5, 'Indicação clínica é obrigatória'),
  observations: z.string().optional(),
});

// Formulário de solicitação de exame
export const LabTestRequest: Story = {
  render: () => {
    const form = useForm<z.infer<typeof labTestSchema>>({
      resolver: zodResolver(labTestSchema),
      defaultValues: {
        testType: '',
        requestDate: '',
        urgency: 'rotina',
        fastingRequired: false,
        clinicalIndication: '',
        observations: '',
      },
    });

    function onSubmit(values: z.infer<typeof labTestSchema>) {
      console.log('Solicitação de exame:', values);
    }

    return (
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Solicitação de Exame Laboratorial
          </CardTitle>
          <CardDescription>
            Preencha os dados para solicitar um exame laboratorial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="testType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Exame</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de exame" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hemograma">
                          Hemograma Completo
                        </SelectItem>
                        <SelectItem value="glicemia">
                          Glicemia de Jejum
                        </SelectItem>
                        <SelectItem value="colesterol">
                          Perfil Lipídico
                        </SelectItem>
                        <SelectItem value="tsh">TSH</SelectItem>
                        <SelectItem value="creatinina">Creatinina</SelectItem>
                        <SelectItem value="urina">Exame de Urina</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="requestDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Data da Solicitação
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="urgency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urgência</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="rotina" id="rotina" />
                            <Label htmlFor="rotina">Rotina</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="urgente" id="urgente" />
                            <Label htmlFor="urgente">Urgente</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="emergencia"
                              id="emergencia"
                            />
                            <Label htmlFor="emergencia">Emergência</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="fastingRequired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Jejum Obrigatório
                      </FormLabel>
                      <FormDescription>
                        Paciente deve estar em jejum de 12 horas
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clinicalIndication"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Indicação Clínica
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva a indicação clínica para o exame..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Justificativa médica para a solicitação do exame
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="observations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações Adicionais</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Observações especiais, medicamentos em uso..."
                        className="min-h-[60px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
                <Button type="submit" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Solicitar Exame
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  },
};

// Formulário básico simples
export const BasicForm: Story = {
  render: () => {
    const basicSchema = z.object({
      name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
      email: z.string().email('E-mail inválido'),
      message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
    });

    const form = useForm<z.infer<typeof basicSchema>>({
      resolver: zodResolver(basicSchema),
      defaultValues: {
        name: '',
        email: '',
        message: '',
      },
    });

    function onSubmit(values: z.infer<typeof basicSchema>) {
      console.log('Formulário básico:', values);
    }

    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Formulário Básico</CardTitle>
          <CardDescription>
            Exemplo de formulário simples com validação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome" {...field} />
                    </FormControl>
                    <FormDescription>
                      Este é o seu nome de exibição público.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensagem</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Digite sua mensagem..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Enviar
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  },
};
