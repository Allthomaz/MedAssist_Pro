import React, { useState } from 'react';
import { MedicalLayout } from '@/components/layout/MedicalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { N8nIntegrationSettings } from '@/components/settings/N8nIntegrationSettings';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Monitor,
  Smartphone,
  Globe,
  Key,
  UserCircle,
  Stethoscope,
  Webhook
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    appointments: true,
    reports: true
  });

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram atualizadas com sucesso.",
    });
  };

  return (
    <MedicalLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="w-8 h-8 text-medical-blue" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
            <p className="text-muted-foreground">Gerencie suas preferências e configurações do sistema</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Segurança
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Aparência
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Dados
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Webhook className="w-4 h-4" />
              Integrações
            </TabsTrigger>
          </TabsList>

          {/* Perfil */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCircle className="w-5 h-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nome Completo
                    </Label>
                    <Input id="name" placeholder="Dr. João Silva" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty" className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" />
                      Especialidade
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione sua especialidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clinica-geral">Clínica Geral</SelectItem>
                        <SelectItem value="cardiologia">Cardiologia</SelectItem>
                        <SelectItem value="pediatria">Pediatria</SelectItem>
                        <SelectItem value="ginecologia">Ginecologia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      E-mail
                    </Label>
                    <Input id="email" type="email" placeholder="dr.joao@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Telefone
                    </Label>
                    <Input id="phone" placeholder="(11) 99999-9999" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notificações */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Preferências de Notificação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <Label>Notificações por E-mail</Label>
                        <p className="text-sm text-muted-foreground">Receber notificações importantes por e-mail</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.email} 
                      onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <Label>Notificações Push</Label>
                        <p className="text-sm text-muted-foreground">Receber notificações no navegador</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.push} 
                      onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <Label>SMS</Label>
                        <p className="text-sm text-muted-foreground">Receber lembretes por SMS</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.sms} 
                      onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Segurança */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Configurações de Segurança
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Senha Atual
                    </Label>
                    <div className="relative">
                      <Input 
                        id="current-password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Digite sua senha atual" 
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      Nova Senha
                    </Label>
                    <Input id="new-password" type="password" placeholder="Digite sua nova senha" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      Confirmar Nova Senha
                    </Label>
                    <Input id="confirm-password" type="password" placeholder="Confirme sua nova senha" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Autenticação de Dois Fatores</Label>
                    <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Configurar 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aparência */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Personalização da Interface
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="flex items-center gap-2 mb-3">
                      <Monitor className="w-4 h-4" />
                      Tema
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Escuro</SelectItem>
                        <SelectItem value="system">Sistema</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="flex items-center gap-2 mb-3">
                      <Globe className="w-4 h-4" />
                      Idioma
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es-ES">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dados */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Gerenciamento de Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5 text-blue-500" />
                      <div>
                        <Label>Exportar Dados</Label>
                        <p className="text-sm text-muted-foreground">Baixar todos os seus dados em formato JSON</p>
                      </div>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Exportar
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Upload className="w-5 h-5 text-green-500" />
                      <div>
                        <Label>Importar Dados</Label>
                        <p className="text-sm text-muted-foreground">Importar dados de backup</p>
                      </div>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Importar
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
                    <div className="flex items-center gap-3">
                      <Trash2 className="w-5 h-5 text-red-500" />
                      <div>
                        <Label className="text-red-600">Excluir Conta</Label>
                        <p className="text-sm text-muted-foreground">Remover permanentemente sua conta e todos os dados</p>
                      </div>
                    </div>
                    <Button variant="destructive" className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Integrações */}
          <TabsContent value="integrations" className="space-y-6">
            <N8nIntegrationSettings onSaved={handleSave} />
          </TabsContent>
        </Tabs>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Restaurar Padrões
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </MedicalLayout>
  );
}