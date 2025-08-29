import React, { useState, useEffect } from 'react';
import { Settings, Save, Bell, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/stores/useAuthStore';
import { NotificationPreferenceValue } from '@/types/common';
import { toast } from 'sonner';

interface NotificationPreference {
  id: string;
  user_id: string;
  notification_type: string;
  in_app_enabled: boolean;
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  whatsapp_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  allowed_days: number[];
  created_at: string;
  updated_at: string;
}

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Tipos de notificação disponíveis
  const notificationTypes = [
    { key: 'appointment_reminder', label: 'Lembretes de Consulta', icon: Bell },
    {
      key: 'appointment_confirmation',
      label: 'Confirmações de Agendamento',
      icon: Bell,
    },
    {
      key: 'appointment_cancellation',
      label: 'Cancelamentos de Consulta',
      icon: Bell,
    },
    { key: 'document_ready', label: 'Documentos Prontos', icon: Mail },
    {
      key: 'consultation_completed',
      label: 'Consultas Finalizadas',
      icon: Bell,
    },
    { key: 'system_updates', label: 'Atualizações do Sistema', icon: Settings },
  ];

  // Buscar preferências do usuário
  const fetchPreferences = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao buscar preferências:', error);
        return;
      }

      setPreferences(data || []);
    } catch (error) {
      console.error('Erro ao buscar preferências:', error);
    } finally {
      setLoading(false);
    }
  };

  // Salvar preferências
  const savePreferences = async () => {
    if (!user) return;

    try {
      setSaving(true);

      // Deletar preferências existentes
      await supabase
        .from('notification_preferences')
        .delete()
        .eq('user_id', user.id);

      // Inserir novas preferências
      if (preferences.length > 0) {
        const { error } = await supabase
          .from('notification_preferences')
          .insert(
            preferences.map(pref => ({
              ...pref,
              user_id: user.id,
            }))
          );

        if (error) {
          console.error('Erro ao salvar preferências:', error);
          toast.error('Erro ao salvar preferências');
          return;
        }
      }

      toast.success('Preferências salvas com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      toast.error('Erro ao salvar preferências');
    } finally {
      setSaving(false);
    }
  };

  // Atualizar preferência específica
  const updatePreference = (
    notificationType: string,
    field: keyof NotificationPreference,
    value: NotificationPreferenceValue
  ) => {
    setPreferences(prev => {
      const existingIndex = prev.findIndex(
        p => p.notification_type === notificationType
      );

      if (existingIndex >= 0) {
        // Atualizar existente
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          [field]: value,
          updated_at: new Date().toISOString(),
        };
        return updated;
      } else {
        // Criar novo
        return [
          ...prev,
          {
            id: `${notificationType}_${user?.id}`,
            user_id: user?.id || '',
            notification_type: notificationType,
            in_app_enabled: field === 'in_app_enabled' ? value : true,
            email_enabled: field === 'email_enabled' ? value : true,
            sms_enabled: field === 'sms_enabled' ? value : false,
            push_enabled: field === 'push_enabled' ? value : true,
            whatsapp_enabled: field === 'whatsapp_enabled' ? value : false,
            quiet_hours_start: '22:00',
            quiet_hours_end: '08:00',
            allowed_days: [1, 2, 3, 4, 5, 6, 0],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            [field]: value,
          },
        ];
      }
    });
  };

  // Obter preferência específica
  const getPreference = (notificationType: string) => {
    return preferences.find(p => p.notification_type === notificationType);
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchPreferences();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações de Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">
                Carregando preferências...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {notificationTypes.map(type => {
                const Icon = type.icon;
                const preference = getPreference(type.key);

                return (
                  <Card key={type.key}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Icon className="h-4 w-4" />
                        {type.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">No App</span>
                          <Switch
                            checked={preference?.in_app_enabled || false}
                            onCheckedChange={checked =>
                              updatePreference(
                                type.key,
                                'in_app_enabled',
                                checked
                              )
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm">E-mail</span>
                          <Switch
                            checked={preference?.email_enabled || false}
                            onCheckedChange={checked =>
                              updatePreference(
                                type.key,
                                'email_enabled',
                                checked
                              )
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm">SMS</span>
                          <Switch
                            checked={preference?.sms_enabled || false}
                            onCheckedChange={checked =>
                              updatePreference(type.key, 'sms_enabled', checked)
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm">Push</span>
                          <Switch
                            checked={preference?.push_enabled || false}
                            onCheckedChange={checked =>
                              updatePreference(
                                type.key,
                                'push_enabled',
                                checked
                              )
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={savePreferences} disabled={saving}>
              {saving ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Salvando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Preferências
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
