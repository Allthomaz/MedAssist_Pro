import { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  Heart, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  User, 
  FileText, 
  Phone, 
  Mail,
  Stethoscope,
  Pill,
  Activity
} from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente Checkbox para seleções múltiplas e confirmações no MedAssist Pro.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Estado marcado/desmarcado'
    },
    disabled: {
      control: 'boolean',
      description: 'Estado desabilitado'
    },
    id: {
      control: 'text',
      description: 'ID do checkbox'
    }
  }
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// Checkbox básico
export const Default: Story = {
  args: {
    id: 'default-checkbox'
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} />
      <Label htmlFor={args.id}>Aceito os termos</Label>
    </div>
  )
};

// Checkbox marcado
export const Checked: Story = {
  args: {
    id: 'checked-checkbox',
    checked: true
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} />
      <Label htmlFor={args.id}>Opção selecionada</Label>
    </div>
  )
};

// Checkbox desabilitado
export const Disabled: Story = {
  args: {
    id: 'disabled-checkbox',
    disabled: true
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} />
      <Label htmlFor={args.id} className="opacity-50">Opção desabilitada</Label>
    </div>
  )
};

// Checkbox com ícone
export const WithIcon: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="icon-checkbox" />
      <Label htmlFor="icon-checkbox" className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-medical-blue" />
        Aceito a política de privacidade
      </Label>
    </div>
  )
};

// Checkboxes médicos
export const MedicalConsent: Story = {
  render: () => {
    const [consents, setConsents] = useState({
      treatment: false,
      data: false,
      emergency: false,
      research: false
    });
    
    const handleConsentChange = (key: keyof typeof consents) => {
      setConsents(prev => ({ ...prev, [key]: !prev[key] }));
    };
    
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-medical-blue" />
            Termos de Consentimento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="treatment-consent" 
              checked={consents.treatment}
              onCheckedChange={() => handleConsentChange('treatment')}
            />
            <Label htmlFor="treatment-consent" className="text-sm leading-relaxed">
              Autorizo o tratamento médico proposto e estou ciente dos riscos e benefícios
              <Badge className="ml-2 bg-red-500 text-white text-xs">
                Obrigatório
              </Badge>
            </Label>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="data-consent" 
              checked={consents.data}
              onCheckedChange={() => handleConsentChange('data')}
            />
            <Label htmlFor="data-consent" className="text-sm leading-relaxed flex items-start gap-2">
              <Shield className="h-4 w-4 text-medical-blue mt-0.5 flex-shrink-0" />
              Autorizo o uso dos meus dados médicos para fins de tratamento e acompanhamento
            </Label>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="emergency-consent" 
              checked={consents.emergency}
              onCheckedChange={() => handleConsentChange('emergency')}
            />
            <Label htmlFor="emergency-consent" className="text-sm leading-relaxed flex items-start gap-2">
              <Phone className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              Autorizo contato com familiares em caso de emergência médica
            </Label>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="research-consent" 
              checked={consents.research}
              onCheckedChange={() => handleConsentChange('research')}
            />
            <Label htmlFor="research-consent" className="text-sm leading-relaxed">
              Aceito participar de pesquisas médicas (opcional)
            </Label>
          </div>
          
          <Button 
            className="w-full mt-4" 
            variant="medical"
            disabled={!consents.treatment || !consents.data}
          >
            Confirmar Consentimentos
          </Button>
        </CardContent>
      </Card>
    );
  }
};

// Checkbox de sintomas
export const SymptomChecker: Story = {
  render: () => {
    const [symptoms, setSymptoms] = useState({
      fever: false,
      cough: false,
      headache: false,
      fatigue: false,
      nausea: false,
      chest_pain: false
    });
    
    const handleSymptomChange = (key: keyof typeof symptoms) => {
      setSymptoms(prev => ({ ...prev, [key]: !prev[key] }));
    };
    
    const selectedCount = Object.values(symptoms).filter(Boolean).length;
    
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-medical-blue" />
            Sintomas Apresentados
            <Badge variant="outline">
              {selectedCount} selecionados
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="fever" 
              checked={symptoms.fever}
              onCheckedChange={() => handleSymptomChange('fever')}
            />
            <Label htmlFor="fever" className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Febre (acima de 37.5°C)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="cough" 
              checked={symptoms.cough}
              onCheckedChange={() => handleSymptomChange('cough')}
            />
            <Label htmlFor="cough" className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Tosse persistente
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="headache" 
              checked={symptoms.headache}
              onCheckedChange={() => handleSymptomChange('headache')}
            />
            <Label htmlFor="headache" className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              Dor de cabeça
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="fatigue" 
              checked={symptoms.fatigue}
              onCheckedChange={() => handleSymptomChange('fatigue')}
            />
            <Label htmlFor="fatigue" className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Fadiga ou cansaço excessivo
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="nausea" 
              checked={symptoms.nausea}
              onCheckedChange={() => handleSymptomChange('nausea')}
            />
            <Label htmlFor="nausea" className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Náusea ou vômito
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="chest-pain" 
              checked={symptoms.chest_pain}
              onCheckedChange={() => handleSymptomChange('chest_pain')}
            />
            <Label htmlFor="chest-pain" className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              Dor no peito
              <Badge className="bg-red-500 text-white text-xs">
                Urgente
              </Badge>
            </Label>
          </div>
          
          {selectedCount > 0 && (
            <div className="mt-4 p-3 bg-medical-light rounded-lg">
              <p className="text-sm text-medical-blue font-medium">
                {selectedCount} sintoma(s) selecionado(s)
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Essas informações ajudarão no diagnóstico
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
};

// Checkbox de medicamentos
export const MedicationHistory: Story = {
  render: () => {
    const [medications, setMedications] = useState({
      hypertension: false,
      diabetes: false,
      cholesterol: false,
      anticoagulant: false,
      antidepressant: false,
      painkiller: false
    });
    
    const handleMedicationChange = (key: keyof typeof medications) => {
      setMedications(prev => ({ ...prev, [key]: !prev[key] }));
    };
    
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-medical-blue" />
            Medicamentos em Uso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="hypertension-med" 
              checked={medications.hypertension}
              onCheckedChange={() => handleMedicationChange('hypertension')}
            />
            <Label htmlFor="hypertension-med" className="text-sm">
              Medicamentos para hipertensão (ex: Losartana, Enalapril)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="diabetes-med" 
              checked={medications.diabetes}
              onCheckedChange={() => handleMedicationChange('diabetes')}
            />
            <Label htmlFor="diabetes-med" className="text-sm">
              Medicamentos para diabetes (ex: Metformina, Insulina)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="cholesterol-med" 
              checked={medications.cholesterol}
              onCheckedChange={() => handleMedicationChange('cholesterol')}
            />
            <Label htmlFor="cholesterol-med" className="text-sm">
              Medicamentos para colesterol (ex: Sinvastatina)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="anticoagulant-med" 
              checked={medications.anticoagulant}
              onCheckedChange={() => handleMedicationChange('anticoagulant')}
            />
            <Label htmlFor="anticoagulant-med" className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Anticoagulantes (ex: Varfarina, Rivaroxabana)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="antidepressant-med" 
              checked={medications.antidepressant}
              onCheckedChange={() => handleMedicationChange('antidepressant')}
            />
            <Label htmlFor="antidepressant-med" className="text-sm">
              Antidepressivos (ex: Sertralina, Fluoxetina)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="painkiller-med" 
              checked={medications.painkiller}
              onCheckedChange={() => handleMedicationChange('painkiller')}
            />
            <Label htmlFor="painkiller-med" className="text-sm">
              Analgésicos regulares (ex: Dipirona, Paracetamol)
            </Label>
          </div>
        </CardContent>
      </Card>
    );
  }
};

// Checkbox de notificações
export const NotificationSettings: Story = {
  render: () => {
    const [notifications, setNotifications] = useState({
      appointments: true,
      reminders: true,
      results: true,
      emergency: true,
      marketing: false,
      research: false
    });
    
    const handleNotificationChange = (key: keyof typeof notifications) => {
      setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };
    
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-medical-blue" />
            Preferências de Notificação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-medical-blue">Notificações Essenciais</h4>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="appointments" 
                checked={notifications.appointments}
                onCheckedChange={() => handleNotificationChange('appointments')}
              />
              <Label htmlFor="appointments" className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-medical-blue" />
                Lembretes de consultas
                <Badge className="bg-medical-blue text-white text-xs">
                  Recomendado
                </Badge>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="reminders" 
                checked={notifications.reminders}
                onCheckedChange={() => handleNotificationChange('reminders')}
              />
              <Label htmlFor="reminders" className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-medical-blue" />
                Lembretes de medicamentos
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="results" 
                checked={notifications.results}
                onCheckedChange={() => handleNotificationChange('results')}
              />
              <Label htmlFor="results" className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-medical-blue" />
                Resultados de exames
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="emergency" 
                checked={notifications.emergency}
                onCheckedChange={() => handleNotificationChange('emergency')}
              />
              <Label htmlFor="emergency" className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Alertas de emergência
                <Badge className="bg-red-500 text-white text-xs">
                  Crítico
                </Badge>
              </Label>
            </div>
          </div>
          
          <div className="space-y-3 pt-2 border-t">
            <h4 className="font-medium text-sm text-muted-foreground">Notificações Opcionais</h4>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="marketing" 
                checked={notifications.marketing}
                onCheckedChange={() => handleNotificationChange('marketing')}
              />
              <Label htmlFor="marketing" className="text-sm">
                Novidades e promoções
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="research" 
                checked={notifications.research}
                onCheckedChange={() => handleNotificationChange('research')}
              />
              <Label htmlFor="research" className="text-sm">
                Convites para pesquisas médicas
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
};

// Estados de checkbox
export const CheckboxStates: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="unchecked" />
        <Label htmlFor="unchecked">Não marcado</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox id="checked" checked />
        <Label htmlFor="checked">Marcado</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-unchecked" disabled />
        <Label htmlFor="disabled-unchecked" className="opacity-50">Desabilitado (não marcado)</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-checked" disabled checked />
        <Label htmlFor="disabled-checked" className="opacity-50">Desabilitado (marcado)</Label>
      </div>
    </div>
  )
};

// Checkbox com validação
export const WithValidation: Story = {
  render: () => {
    const [isChecked, setIsChecked] = useState(false);
    const [showError, setShowError] = useState(false);
    
    const handleSubmit = () => {
      if (!isChecked) {
        setShowError(true);
      } else {
        setShowError(false);
        alert('Formulário enviado com sucesso!');
      }
    };
    
    return (
      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="terms-validation" 
            checked={isChecked}
            onCheckedChange={(checked) => {
              setIsChecked(checked as boolean);
              if (checked) setShowError(false);
            }}
            className={showError ? 'border-red-500' : ''}
          />
          <div className="space-y-1">
            <Label htmlFor="terms-validation" className="text-sm leading-relaxed">
              Li e aceito os termos de uso e política de privacidade
              <span className="text-red-500 ml-1">*</span>
            </Label>
            {showError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Este campo é obrigatório
              </p>
            )}
          </div>
        </div>
        
        <Button onClick={handleSubmit} variant="medical">
          Enviar Formulário
        </Button>
      </div>
    );
  }
};