import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  User,
  Calendar,
  MapPin,
  FileText,
  Heart,
  AlertTriangle,
  Save,
  ArrowLeft,
  Shield,
  Plus,
  X,
} from 'lucide-react';

import { MedicalLayout } from '@/components/layout/MedicalLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/stores/useAuthStore';

// Interface para dados do paciente
interface PatientData {
  // Dados pessoais
  fullName: string;
  email: string;
  phone: string;
  birthDate: Date | undefined;
  gender: string;
  cpf: string;
  rg: string;

  // Endereço
  address: string;
  addressNumber: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;

  // Contato de emergência
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;

  // Informações médicas
  bloodType: string;
  allergies: string[];
  medications: string[];
  medicalHistory: string;
  familyHistory: string;

  // Plano de saúde
  hasInsurance: boolean;
  insuranceName: string;
  insuranceNumber: string;

  // Observações
  observations: string;
}

const NewPatient = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');

  const [patientData, setPatientData] = useState<PatientData>({
    // Dados pessoais
    fullName: '',
    email: '',
    phone: '',
    birthDate: undefined,
    gender: '',
    cpf: '',
    rg: '',

    // Endereço
    address: '',
    addressNumber: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',

    // Contato de emergência
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',

    // Informações médicas
    bloodType: '',
    allergies: [],
    medications: [],
    medicalHistory: '',
    familyHistory: '',

    // Plano de saúde
    hasInsurance: false,
    insuranceName: '',
    insuranceNumber: '',

    // Observações
    observations: '',
  });

  useEffect(() => {
    document.title = 'Novo Paciente | MedAssist Pro';
  }, []);

  // Função para atualizar dados do paciente
  const updatePatientData = (field: keyof PatientData, value: unknown) => {
    setPatientData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Função para adicionar alergia
  const addAllergy = () => {
    if (
      newAllergy.trim() &&
      !patientData.allergies.includes(newAllergy.trim())
    ) {
      updatePatientData('allergies', [
        ...patientData.allergies,
        newAllergy.trim(),
      ]);
      setNewAllergy('');
    }
  };

  // Função para remover alergia
  const removeAllergy = (allergy: string) => {
    updatePatientData(
      'allergies',
      patientData.allergies.filter(a => a !== allergy)
    );
  };

  // Função para adicionar medicamento
  const addMedication = () => {
    if (
      newMedication.trim() &&
      !patientData.medications.includes(newMedication.trim())
    ) {
      updatePatientData('medications', [
        ...patientData.medications,
        newMedication.trim(),
      ]);
      setNewMedication('');
    }
  };

  // Função para remover medicamento
  const removeMedication = (medication: string) => {
    updatePatientData(
      'medications',
      patientData.medications.filter(m => m !== medication)
    );
  };

  // Função para validar CPF
  const validateCPF = (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) return false;

    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

    // Validar dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(10))) return false;

    return true;
  };

  // Função para validar formulário
  const validateForm = (): string[] => {
    const errors: string[] = [];

    // Validações obrigatórias
    if (!patientData.fullName.trim())
      errors.push('Nome completo é obrigatório');
    if (!patientData.phone.trim()) errors.push('Telefone é obrigatório');
    if (!patientData.birthDate) errors.push('Data de nascimento é obrigatória');
    if (!patientData.gender) errors.push('Gênero é obrigatório');

    // Validar CPF se preenchido
    if (patientData.cpf && !validateCPF(patientData.cpf)) {
      errors.push('CPF inválido');
    }

    // Validar email se preenchido
    if (
      patientData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientData.email)
    ) {
      errors.push('Email inválido');
    }

    return errors;
  };

  // Função para salvar paciente
  const handleSavePatient = async () => {
    if (!user) {
      alert('Usuário não autenticado');
      return;
    }

    const errors = validateForm();
    if (errors.length > 0) {
      alert('Erros encontrados:\n' + errors.join('\n'));
      return;
    }

    setLoading(true);

    try {
      const patientRecord = {
        doctor_id: user.id,
        full_name: patientData.fullName,
        email: patientData.email || null,
        phone: patientData.phone,
        birth_date: patientData.birthDate
          ? format(patientData.birthDate, 'yyyy-MM-dd')
          : null,
        gender: patientData.gender,
        cpf: patientData.cpf || null,
        rg: patientData.rg || null,

        // Endereço
        address: patientData.address || null,
        address_number: patientData.addressNumber || null,
        complement: patientData.complement || null,
        neighborhood: patientData.neighborhood || null,
        city: patientData.city || null,
        state: patientData.state || null,
        zip_code: patientData.zipCode || null,

        // Contato de emergência
        emergency_contact_name: patientData.emergencyContactName || null,
        emergency_contact_phone: patientData.emergencyContactPhone || null,
        emergency_contact_relation:
          patientData.emergencyContactRelation || null,

        // Informações médicas
        blood_type: patientData.bloodType || null,
        allergies:
          patientData.allergies.length > 0 ? patientData.allergies : null,
        medications:
          patientData.medications.length > 0 ? patientData.medications : null,
        medical_history: patientData.medicalHistory || null,
        family_history: patientData.familyHistory || null,

        // Plano de saúde
        has_insurance: patientData.hasInsurance,
        insurance_name: patientData.hasInsurance
          ? patientData.insuranceName
          : null,
        insurance_number: patientData.hasInsurance
          ? patientData.insuranceNumber
          : null,

        // Observações
        observations: patientData.observations || null,

        // Metadados
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('patients')
        .insert([patientRecord])
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar paciente:', error);
        alert('Erro ao salvar paciente. Tente novamente.');
        return;
      }

      alert('Paciente cadastrado com sucesso!');
      navigate('/patients');
    } catch (error) {
      console.error('Erro inesperado:', error);
      alert('Erro inesperado ao salvar paciente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para formatar CPF
  const formatCPF = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Função para formatar telefone
  const formatPhone = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 10) {
      return cleanValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  // Função para formatar CEP
  const formatZipCode = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  // Renderizar etapa 1 - Dados Pessoais
  const renderStep1 = () => (
    <div className="space-y-6">
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-medical-blue/10">
              <User className="w-5 h-5 text-medical-blue" />
            </div>
            Dados Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Nome Completo *
              </Label>
              <Input
                id="fullName"
                value={patientData.fullName}
                onChange={e => updatePatientData('fullName', e.target.value)}
                placeholder="Digite o nome completo do paciente"
                className="medical-input mt-2"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={patientData.email}
                onChange={e => updatePatientData('email', e.target.value)}
                placeholder="email@exemplo.com"
                className="medical-input mt-2"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium">
                Telefone *
              </Label>
              <Input
                id="phone"
                value={patientData.phone}
                onChange={e =>
                  updatePatientData('phone', formatPhone(e.target.value))
                }
                placeholder="(11) 99999-9999"
                className="medical-input mt-2"
                maxLength={15}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">
                Data de Nascimento *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal mt-2"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {patientData.birthDate ? (
                      format(patientData.birthDate, 'dd/MM/yyyy')
                    ) : (
                      <span>Selecione a data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={patientData.birthDate}
                    onSelect={date => updatePatientData('birthDate', date)}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label className="text-sm font-medium">Gênero *</Label>
              <Select
                value={patientData.gender}
                onValueChange={value => updatePatientData('gender', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione o gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                  <SelectItem value="nao_informar">
                    Prefiro não informar
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cpf" className="text-sm font-medium">
                CPF
              </Label>
              <Input
                id="cpf"
                value={patientData.cpf}
                onChange={e =>
                  updatePatientData('cpf', formatCPF(e.target.value))
                }
                placeholder="000.000.000-00"
                className="medical-input mt-2"
                maxLength={14}
              />
            </div>

            <div>
              <Label htmlFor="rg" className="text-sm font-medium">
                RG
              </Label>
              <Input
                id="rg"
                value={patientData.rg}
                onChange={e => updatePatientData('rg', e.target.value)}
                placeholder="00.000.000-0"
                className="medical-input mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Renderizar etapa 2 - Endereço e Contato de Emergência
  const renderStep2 = () => (
    <div className="space-y-6">
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-medical-blue/10">
              <MapPin className="w-5 h-5 text-medical-blue" />
            </div>
            Endereço
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Logradouro
              </Label>
              <Input
                id="address"
                value={patientData.address}
                onChange={e => updatePatientData('address', e.target.value)}
                placeholder="Rua, Avenida, etc."
                className="medical-input mt-2"
              />
            </div>

            <div>
              <Label htmlFor="addressNumber" className="text-sm font-medium">
                Número
              </Label>
              <Input
                id="addressNumber"
                value={patientData.addressNumber}
                onChange={e =>
                  updatePatientData('addressNumber', e.target.value)
                }
                placeholder="123"
                className="medical-input mt-2"
              />
            </div>

            <div>
              <Label htmlFor="complement" className="text-sm font-medium">
                Complemento
              </Label>
              <Input
                id="complement"
                value={patientData.complement}
                onChange={e => updatePatientData('complement', e.target.value)}
                placeholder="Apto, Bloco, etc."
                className="medical-input mt-2"
              />
            </div>

            <div>
              <Label htmlFor="neighborhood" className="text-sm font-medium">
                Bairro
              </Label>
              <Input
                id="neighborhood"
                value={patientData.neighborhood}
                onChange={e =>
                  updatePatientData('neighborhood', e.target.value)
                }
                placeholder="Nome do bairro"
                className="medical-input mt-2"
              />
            </div>

            <div>
              <Label htmlFor="city" className="text-sm font-medium">
                Cidade
              </Label>
              <Input
                id="city"
                value={patientData.city}
                onChange={e => updatePatientData('city', e.target.value)}
                placeholder="Nome da cidade"
                className="medical-input mt-2"
              />
            </div>

            <div>
              <Label htmlFor="state" className="text-sm font-medium">
                Estado
              </Label>
              <Input
                id="state"
                value={patientData.state}
                onChange={e => updatePatientData('state', e.target.value)}
                placeholder="SP"
                className="medical-input mt-2"
                maxLength={2}
              />
            </div>

            <div>
              <Label htmlFor="zipCode" className="text-sm font-medium">
                CEP
              </Label>
              <Input
                id="zipCode"
                value={patientData.zipCode}
                onChange={e =>
                  updatePatientData('zipCode', formatZipCode(e.target.value))
                }
                placeholder="00000-000"
                className="medical-input mt-2"
                maxLength={9}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            Contato de Emergência
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label
                htmlFor="emergencyContactName"
                className="text-sm font-medium"
              >
                Nome do Contato
              </Label>
              <Input
                id="emergencyContactName"
                value={patientData.emergencyContactName}
                onChange={e =>
                  updatePatientData('emergencyContactName', e.target.value)
                }
                placeholder="Nome completo"
                className="medical-input mt-2"
              />
            </div>

            <div>
              <Label
                htmlFor="emergencyContactPhone"
                className="text-sm font-medium"
              >
                Telefone
              </Label>
              <Input
                id="emergencyContactPhone"
                value={patientData.emergencyContactPhone}
                onChange={e =>
                  updatePatientData(
                    'emergencyContactPhone',
                    formatPhone(e.target.value)
                  )
                }
                placeholder="(11) 99999-9999"
                className="medical-input mt-2"
                maxLength={15}
              />
            </div>

            <div>
              <Label
                htmlFor="emergencyContactRelation"
                className="text-sm font-medium"
              >
                Parentesco
              </Label>
              <Input
                id="emergencyContactRelation"
                value={patientData.emergencyContactRelation}
                onChange={e =>
                  updatePatientData('emergencyContactRelation', e.target.value)
                }
                placeholder="Mãe, Pai, Cônjuge, etc."
                className="medical-input mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Renderizar etapa 3 - Informações Médicas
  const renderStep3 = () => (
    <div className="space-y-6">
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-medical-blue/10">
              <Heart className="w-5 h-5 text-medical-blue" />
            </div>
            Informações Médicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium">Tipo Sanguíneo</Label>
              <Select
                value={patientData.bloodType}
                onValueChange={value => updatePatientData('bloodType', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione o tipo sanguíneo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-sm font-medium mb-4 block">Alergias</Label>
            <div className="flex gap-2 mb-4">
              <Input
                value={newAllergy}
                onChange={e => setNewAllergy(e.target.value)}
                placeholder="Digite uma alergia"
                className="medical-input"
                onKeyPress={e => e.key === 'Enter' && addAllergy()}
              />
              <Button onClick={addAllergy} variant="outline" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {patientData.allergies.map((allergy, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {allergy}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-red-600"
                    onClick={() => removeAllergy(allergy)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-4 block">
              Medicamentos em Uso
            </Label>
            <div className="flex gap-2 mb-4">
              <Input
                value={newMedication}
                onChange={e => setNewMedication(e.target.value)}
                placeholder="Digite um medicamento"
                className="medical-input"
                onKeyPress={e => e.key === 'Enter' && addMedication()}
              />
              <Button onClick={addMedication} variant="outline" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {patientData.medications.map((medication, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {medication}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-red-600"
                    onClick={() => removeMedication(medication)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="medicalHistory" className="text-sm font-medium">
              Histórico Médico
            </Label>
            <Textarea
              id="medicalHistory"
              value={patientData.medicalHistory}
              onChange={e =>
                updatePatientData('medicalHistory', e.target.value)
              }
              placeholder="Descreva o histórico médico do paciente..."
              className="medical-input mt-2 min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="familyHistory" className="text-sm font-medium">
              Histórico Familiar
            </Label>
            <Textarea
              id="familyHistory"
              value={patientData.familyHistory}
              onChange={e => updatePatientData('familyHistory', e.target.value)}
              placeholder="Descreva o histórico familiar relevante..."
              className="medical-input mt-2 min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Renderizar etapa 4 - Plano de Saúde e Observações
  const renderStep4 = () => (
    <div className="space-y-6">
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            Plano de Saúde
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasInsurance"
              checked={patientData.hasInsurance}
              onCheckedChange={checked =>
                updatePatientData('hasInsurance', checked)
              }
            />
            <Label htmlFor="hasInsurance" className="text-sm font-medium">
              Possui plano de saúde
            </Label>
          </div>

          {patientData.hasInsurance && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="insuranceName" className="text-sm font-medium">
                  Nome do Plano
                </Label>
                <Input
                  id="insuranceName"
                  value={patientData.insuranceName}
                  onChange={e =>
                    updatePatientData('insuranceName', e.target.value)
                  }
                  placeholder="Ex: Unimed, Bradesco Saúde, etc."
                  className="medical-input mt-2"
                />
              </div>

              <div>
                <Label
                  htmlFor="insuranceNumber"
                  className="text-sm font-medium"
                >
                  Número da Carteirinha
                </Label>
                <Input
                  id="insuranceNumber"
                  value={patientData.insuranceNumber}
                  onChange={e =>
                    updatePatientData('insuranceNumber', e.target.value)
                  }
                  placeholder="Número da carteirinha"
                  className="medical-input mt-2"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100">
              <FileText className="w-5 h-5 text-yellow-600" />
            </div>
            Observações Gerais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="observations" className="text-sm font-medium">
              Observações
            </Label>
            <Textarea
              id="observations"
              value={patientData.observations}
              onChange={e => updatePatientData('observations', e.target.value)}
              placeholder="Informações adicionais sobre o paciente..."
              className="medical-input mt-2 min-h-[120px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const steps = [
    { number: 1, title: 'Dados Pessoais', icon: User },
    { number: 2, title: 'Endereço & Emergência', icon: MapPin },
    { number: 3, title: 'Informações Médicas', icon: Heart },
    { number: 4, title: 'Plano & Observações', icon: Shield },
  ];

  return (
    <MedicalLayout>
      <div className="space-y-8 p-6">
        {/* Header Premium */}
        <div className="premium-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/patients')}
                  className="p-2 hover:bg-muted"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <h1 className="medical-heading text-3xl font-bold">
                  Novo Paciente
                </h1>
              </div>
              <p className="medical-subheading text-lg">
                Cadastre um novo paciente no sistema
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/patients')}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSavePatient}
                disabled={loading}
                className="premium-button bg-medical-blue hover:bg-medical-blue/90 text-white shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Paciente
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <Card className="premium-card premium-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;

                return (
                  <div key={step.number} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          isActive
                            ? 'bg-medical-blue border-medical-blue text-white'
                            : isCompleted
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'bg-muted border-muted-foreground/30 text-muted-foreground'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-xs mt-2 font-medium ${
                          isActive
                            ? 'text-medical-blue'
                            : isCompleted
                              ? 'text-green-600'
                              : 'text-muted-foreground'
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>

                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-4 ${
                          isCompleted ? 'bg-green-500' : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Step Navigation */}
        <div className="flex justify-between items-center premium-fade-in">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Anterior
          </Button>

          <div className="flex gap-2">
            {steps.map(step => (
              <Button
                key={step.number}
                variant={currentStep === step.number ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentStep(step.number)}
                className={
                  currentStep === step.number
                    ? 'bg-medical-blue hover:bg-medical-blue/90'
                    : ''
                }
              >
                {step.number}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
            disabled={currentStep === 4}
          >
            Próximo
          </Button>
        </div>

        {/* Form Content */}
        <div className="premium-fade-in">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>
      </div>
    </MedicalLayout>
  );
};

export default NewPatient;
