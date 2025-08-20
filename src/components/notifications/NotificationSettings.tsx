import React, { useState, useEffect } from 'react';
import { Settings, Save, Bell, Mail, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface NotificationPreference {
  id: string;
  user_id: string;
  notification_type: string;
  channel: 'in_app' | 'email' | 'sms';
  enabled: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
  quiet_hours_start?: string;
  quiet_hours_end?: string;
}

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Tipos de notificação disponíveis
  const notificationTypes = [
    { key: 'appointment_reminder', label: 'Lembretes de Consulta', icon: Bell },
    { key: 'appointment_confirmation', label: 'Confirmações de Agendamento', icon: Bell },
    { key: 'appointment_cancellation', label: 'Cancelamentos de Consulta', icon: Bell },
    { key: 'document_ready', label: 'Documentos Prontos', icon: Mail },
    { key: 'consultation_completed', label: 'Consultas Finalizadas', icon: Bell },
    { key: 'system_updates', label: 'Atualizações do Sistema', icon: Settings },
  ];

  // Canais de notificação
  const channels = [
    { key: 'in_app', label: 'No App', icon: Bell },
    { key: 'email', label: 'E-mail', icon: Mail },
    { key: 'sms', label: 'SMS', icon: Smartphone },
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
          .insert(preferences.map(pref => ({
            ...pref,
            user_id: user.id
          })));

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
    channel: 'in_app' | 'email' | 'sms',
    field: keyof NotificationPreference,
    value: any
  ) => {
    const preferenceId = `${notificationType}_${channel}`;
    
    setPreferences(prev => {
      const existing = prev.find(p => p.id === preferenceId);
      
      if (existing) {
        return prev.map(p => 
          p.id === preferenceId 
            ? { ...p, [field]: value }
            : p
        );
      } else {
        return [...prev, {
          id: preferenceId,
          user_id: user?.id || '',
          notification_type: notificationType,
          channel,
          enabled: field === 'enabled' ? value : false,
          frequency: field === 'frequency' ? value : 'immediate',
          [field]: value
        }];
      }
    });
  };

  // Obter preferência específica
  const getPreference = (notificationType: string, channel: 'in_app' | 'email' | 'sms') => {
    const preferenceId = `${notificationType}_${channel}`;
    return preferences.find(p => p.id === preferenceId);
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
              <p className="mt-2 text-muted-foreground">Carregando preferências...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {notificationTypes.map(type => {
                const Icon = type.icon;
                return (
                  <Card key={type.key}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Icon className="h-4 w-4" />
                        {type.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {channels.map(channel => {
                          const ChannelIcon = channel.icon;
                          const preference = getPreference(type.key, channel.key as any);
                          
                          return (
                            <div key={channel.key} className="border rounded-lg p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <ChannelIcon className="h-4 w-4" />
                                  <Label>{channel.label}</Label>
                                </div>
                                <Switch
                                  checked={preference?.enabled || false}
                                  onCheckedChange={(checked) => 
                                    updatePreference(type.key, channel.key as any, 'enabled', checked)
                                  }
                                />
                              </div>
                              
                              {preference?.enabled && (
                                <div className="space-y-2">
                                  <Label className="text-sm text-muted-foreground">Frequência</Label>
                                  <Select
                                    value={preference.frequency}
                                    onValueChange={(value) => 
                                      updatePreference(type.key, channel.key as any, 'frequency', value)
                                    }
                                  >
                                    <SelectTrigger className="h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="immediate">Imediato</SelectItem>
                                      <SelectItem value="daily">Diário</SelectItem>
                                      <SelectItem value="weekly">Semanal</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                            </div>
                          );
                        })}
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