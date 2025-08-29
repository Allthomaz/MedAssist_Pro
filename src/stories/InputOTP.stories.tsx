import { Meta, StoryObj } from '@storybook/react-vite';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield,
  Smartphone,
  Mail,
  Lock,
  Key,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  Settings,
  FileText,
  Database,
  Stethoscope,
} from 'lucide-react';
import { useState } from 'react';

const meta: Meta<typeof InputOTP> = {
  title: 'UI/InputOTP',
  component: InputOTP,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente InputOTP para entrada de códigos de verificação e autenticação no MedAssist Pro. Usado para autenticação de dois fatores, códigos de acesso e verificações de segurança.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    maxLength: {
      control: 'number',
      description: 'Número máximo de caracteres',
    },
    onComplete: {
      action: 'completed',
      description: 'Callback executado quando o código é completado',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// OTP básico de 6 dígitos
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Código de Verificação
          </CardTitle>
          <CardDescription>
            Digite o código de 6 dígitos enviado para seu dispositivo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={value} onChange={setValue}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Código atual:{' '}
              <span className="font-mono">{value || '------'}</span>
            </p>
            <Badge variant={value.length === 6 ? 'default' : 'secondary'}>
              {value.length}/6 dígitos
            </Badge>
          </div>

          <Button className="w-full" disabled={value.length !== 6}>
            Verificar Código
          </Button>
        </CardContent>
      </Card>
    );
  },
};

// Autenticação de dois fatores
export const TwoFactorAuth: Story = {
  render: () => {
    const [otpValue, setOtpValue] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const handleVerify = () => {
      setIsVerifying(true);
      // Simular verificação
      setTimeout(() => {
        setIsVerifying(false);
        setIsVerified(true);
      }, 2000);
    };

    return (
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Autenticação de Dois Fatores
          </CardTitle>
          <CardDescription>
            Acesso ao sistema médico requer verificação adicional
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isVerified ? (
            <>
              <Alert>
                <Smartphone className="h-4 w-4" />
                <AlertDescription>
                  Código enviado via SMS para ****-**1234
                </AlertDescription>
              </Alert>

              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otpValue}
                  onChange={setOtpValue}
                  disabled={isVerifying}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="flex justify-between items-center">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Expira em 5:00
                </Badge>
                <Button variant="link" size="sm">
                  Reenviar código
                </Button>
              </div>

              <Button
                className="w-full"
                disabled={otpValue.length !== 6 || isVerifying}
                onClick={handleVerify}
              >
                {isVerifying ? 'Verificando...' : 'Autenticar'}
              </Button>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-green-800">
                  Autenticação Bem-sucedida
                </h3>
                <p className="text-sm text-green-600">
                  Acesso liberado ao sistema médico
                </p>
              </div>
              <Button className="w-full">Acessar Dashboard</Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  },
};

// Código de acesso do paciente
export const PatientAccessCode: Story = {
  render: () => {
    const [accessCode, setAccessCode] = useState('');

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Código de Acesso do Paciente
          </CardTitle>
          <CardDescription>
            Digite o código fornecido pela recepção para acessar seus dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <InputOTP maxLength={4} value={accessCode} onChange={setAccessCode}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Código:{' '}
              <span className="font-mono text-lg">{accessCode || '----'}</span>
            </p>
            <Badge variant={accessCode.length === 4 ? 'default' : 'outline'}>
              {accessCode.length}/4 dígitos
            </Badge>
          </div>

          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              Este código permite acesso aos seus exames e consultas
            </AlertDescription>
          </Alert>

          <Button className="w-full" disabled={accessCode.length !== 4}>
            Acessar Prontuário
          </Button>
        </CardContent>
      </Card>
    );
  },
};

// Código de autorização médica
export const MedicalAuthCode: Story = {
  render: () => {
    const [authCode, setAuthCode] = useState('');

    return (
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Autorização Médica
          </CardTitle>
          <CardDescription>
            Código de autorização para procedimentos especiais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Procedimento requer autorização do médico responsável
            </AlertDescription>
          </Alert>

          <div className="flex justify-center">
            <InputOTP maxLength={8} value={authCode} onChange={setAuthCode}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
                <InputOTPSlot index={6} />
                <InputOTPSlot index={7} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="font-medium">Procedimento:</p>
              <p className="text-muted-foreground">Ressonância Magnética</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Médico:</p>
              <p className="text-muted-foreground">Dr. Silva</p>
            </div>
          </div>

          <div className="text-center">
            <Badge variant={authCode.length === 8 ? 'default' : 'outline'}>
              {authCode.length}/8 caracteres
            </Badge>
          </div>

          <Button className="w-full" disabled={authCode.length !== 8}>
            Autorizar Procedimento
          </Button>
        </CardContent>
      </Card>
    );
  },
};

// Código de emergência
export const EmergencyCode: Story = {
  render: () => {
    const [emergencyCode, setEmergencyCode] = useState('');

    return (
      <Card className="w-[400px] border-red-200">
        <CardHeader className="bg-red-50">
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            Código de Emergência
          </CardTitle>
          <CardDescription className="text-red-600">
            Acesso rápido para situações de emergência médica
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Use apenas em casos de emergência real
            </AlertDescription>
          </Alert>

          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={emergencyCode}
              onChange={setEmergencyCode}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="text-center">
            <Badge
              variant={emergencyCode.length === 6 ? 'destructive' : 'outline'}
              className={emergencyCode.length === 6 ? 'bg-red-600' : ''}
            >
              {emergencyCode.length}/6 dígitos
            </Badge>
          </div>

          <Button
            className="w-full bg-red-600 hover:bg-red-700"
            disabled={emergencyCode.length !== 6}
          >
            Ativar Protocolo de Emergência
          </Button>
        </CardContent>
      </Card>
    );
  },
};

// Código de configuração do sistema
export const SystemConfigCode: Story = {
  render: () => {
    const [configCode, setConfigCode] = useState('');

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuração do Sistema
          </CardTitle>
          <CardDescription>
            Código de administrador para acessar configurações avançadas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <InputOTP maxLength={5} value={configCode} onChange={setConfigCode}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Nível de acesso:</span>
              <Badge variant="outline">
                {configCode.length >= 5 ? 'Administrador' : 'Limitado'}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <Badge
                variant={configCode.length === 5 ? 'default' : 'secondary'}
              >
                {configCode.length}/5 dígitos
              </Badge>
            </div>
          </div>

          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription>
              Acesso às configurações de banco de dados e segurança
            </AlertDescription>
          </Alert>

          <Button
            className="w-full"
            disabled={configCode.length !== 5}
            variant="outline"
          >
            Acessar Configurações
          </Button>
        </CardContent>
      </Card>
    );
  },
};
