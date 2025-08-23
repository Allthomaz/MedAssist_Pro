import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import {
  UserCircle,
  Settings,
  User,
  Palette,
  Save,
  X,
  ArrowRight,
  Briefcase,
  Phone,
  Sparkles,
  Monitor,
} from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { useNavigate } from 'react-router-dom';

interface ProfileConfigModalProps {
  children: React.ReactNode;
}

const PROFESSIONAL_SPECIALTIES = [
  { specialty: 'Medicina Geral', title: 'Dr.' },
  { specialty: 'Psicologia', title: 'Psic.' },
  { specialty: 'Terapia', title: 'Ter.' },
  { specialty: 'Nutrição', title: 'Nutr.' },
  { specialty: 'Enfermagem', title: 'Enf.' },
  { specialty: 'Fisioterapia', title: 'Ft.' },
  { specialty: 'Odontologia', title: 'Dr.' },
  { specialty: 'Medicina Veterinária', title: 'Dr.' },
];

const USER_ROLES = [
  { value: 'doctor', label: 'Profissional da Saúde' },
  { value: 'patient', label: 'Paciente' },
];

export function ProfileConfigModal({ children }: ProfileConfigModalProps) {
  const { profile } = useProfile();
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [role, setRole] = useState(profile?.role || 'doctor');
  const [customTitle, setCustomTitle] = useState('');
  const [useCustomTitle, setUseCustomTitle] = useState(false);
  const [crm, setCrm] = useState(profile?.crm || '');
  const [specialty, setSpecialty] = useState(profile?.specialty || '');
  const [phone, setPhone] = useState(profile?.phone || '');

  // Theme preferences
  const { theme, setTheme } = useTheme();
  const [compactMode, setCompactMode] = useState(false);

  // Initialize theme state
  useEffect(() => {
    if (profile?.custom_title) {
      setCustomTitle(profile.custom_title);
      setUseCustomTitle(true);
    }
  }, [profile]);

  const selectedRole = USER_ROLES.find(r => r.value === role);
  const selectedSpecialty = PROFESSIONAL_SPECIALTIES.find(
    s => s.specialty === specialty
  );
  const displayTitle =
    useCustomTitle && customTitle
      ? customTitle
      : selectedSpecialty?.title || 'Dr.';

  const validateForm = () => {
    const errors: string[] = [];

    if (!fullName.trim()) {
      errors.push('Nome completo é obrigatório');
    }

    if (fullName.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    }

    if (useCustomTitle && !customTitle.trim()) {
      errors.push('Título personalizado não pode estar vazio');
    }

    if (
      phone &&
      !/^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/.test(phone.replace(/\D/g, ''))
    ) {
      errors.push('Formato de telefone inválido');
    }

    return errors;
  };

  const navigate = useNavigate();

  const handleSave = async (redirectToDashboard = false) => {
    if (!user?.id) {
      toast({
        title: 'Erro',
        description: 'Usuário não encontrado',
        variant: 'destructive',
      });
      return;
    }

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      toast({
        title: 'Erro de Validação',
        description: validationErrors.join(', '),
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const updateData = {
        full_name: fullName.trim(),
        role: role,
        custom_title:
          useCustomTitle && customTitle.trim() ? customTitle.trim() : null,
        crm: crm.trim() || null,
        specialty: specialty.trim() || null,
        phone: phone.trim() || null,
        theme_preference: theme as 'light' | 'dark' | 'system',
        compact_mode: compactMode,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: redirectToDashboard
          ? 'Configurações salvas! Redirecionando para o dashboard...'
          : 'Configurações salvas com sucesso!',
      });

      setOpen(false);

      if (redirectToDashboard) {
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);
      } else {
        // Refresh the page to update the profile data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Erro',
        description:
          error instanceof Error
            ? error.message
            : 'Erro ao salvar configurações',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    setFullName(profile?.full_name || '');
    setRole(profile?.role || 'doctor');
    setCustomTitle('');
    setUseCustomTitle(false);
    setCrm(profile?.crm || '');
    setSpecialty(profile?.specialty || '');
    setPhone(profile?.phone || '');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Settings className="w-5 h-5 text-medical-600" />
            Configurações do Perfil
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Preview Card */}
          <div className="bg-gradient-to-r from-medical-50 to-medical-100 dark:from-medical-900/20 dark:to-medical-800/20 p-4 rounded-lg border border-medical-200 dark:border-medical-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-medical-gradient flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-medical-900 dark:text-medical-100">
                  {displayTitle} {fullName || 'Seu Nome'}
                </h3>
                <p className="text-sm text-medical-600 dark:text-medical-400">
                  {selectedRole?.label || 'Usuário'}
                  {specialty && ` • ${specialty}`}
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-medical-600" />
              <h3 className="font-medium text-medical-900 dark:text-medical-100">
                Informações Pessoais
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-medical-600" />
                  Nome Completo
                </Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Digite seu nome completo"
                  className="medical-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-medical-600" />
                  Telefone
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="medical-input"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Professional Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-medical-600" />
              <h3 className="font-medium text-medical-900 dark:text-medical-100">
                Informações Profissionais
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-medical-600" />
                  Profissão
                </Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="medical-input">
                    <SelectValue placeholder="Selecione seu tipo de usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_ROLES.map(roleOption => (
                      <SelectItem
                        key={roleOption.value}
                        value={roleOption.value}
                      >
                        {roleOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="crm" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-medical-600" />
                  CRM/Registro
                </Label>
                <Input
                  id="crm"
                  value={crm}
                  onChange={e => setCrm(e.target.value)}
                  placeholder="Ex: CRM 123456"
                  className="medical-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialty" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-medical-600" />
                Especialidade
              </Label>
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger className="medical-input">
                  <SelectValue placeholder="Selecione sua especialidade" />
                </SelectTrigger>
                <SelectContent>
                  {PROFESSIONAL_SPECIALTIES.map(specialtyOption => (
                    <SelectItem
                      key={specialtyOption.specialty}
                      value={specialtyOption.specialty}
                    >
                      {specialtyOption.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Title Customization */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-medical-600" />
              <h3 className="font-medium text-medical-900 dark:text-medical-100">
                Personalização do Título
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="useCustomTitle"
                checked={useCustomTitle}
                onCheckedChange={setUseCustomTitle}
              />
              <Label
                htmlFor="useCustomTitle"
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-medical-600" />
                Usar título personalizado
              </Label>
            </div>

            {useCustomTitle && (
              <div className="space-y-2">
                <Label
                  htmlFor="customTitle"
                  className="flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-medical-600" />
                  Título Personalizado
                </Label>
                <Input
                  id="customTitle"
                  value={customTitle}
                  onChange={e => setCustomTitle(e.target.value)}
                  placeholder="Ex: Prof., Dra., Mestre"
                  className="medical-input"
                />
                <p className="text-xs text-muted-foreground">
                  Este título aparecerá no seu dashboard
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Theme Preferences */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-medical-600" />
              <h3 className="font-medium text-medical-900 dark:text-medical-100">
                Preferências de Interface
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="darkMode" className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-medical-600" />
                    Modo Escuro
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Ativar tema escuro da interface
                  </p>
                </div>
                <Switch
                  id="darkMode"
                  checked={theme === 'dark'}
                  onCheckedChange={checked =>
                    setTheme(checked ? 'dark' : 'light')
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label
                    htmlFor="compactMode"
                    className="flex items-center gap-2"
                  >
                    <Monitor className="w-4 h-4 text-medical-600" />
                    Modo Compacto
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Interface mais compacta com menos espaçamento
                  </p>
                </div>
                <Switch
                  id="compactMode"
                  checked={compactMode}
                  onCheckedChange={setCompactMode}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
            className="order-3 sm:order-1"
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button
            onClick={() => handleSave(false)}
            disabled={loading || !fullName.trim()}
            variant="outline"
            className="order-2 sm:order-2 border-medical-600 text-medical-600 hover:bg-medical-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar Apenas'}
          </Button>
          <Button
            onClick={() => handleSave(true)}
            disabled={loading || !fullName.trim()}
            className="order-1 sm:order-3 bg-medical-gradient hover:opacity-90 shadow-lg"
          >
            <Save className="w-4 h-4 mr-2" />
            <ArrowRight className="w-4 h-4 ml-1" />
            {loading ? 'Salvando...' : 'Salvar e Ir para Dashboard'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
