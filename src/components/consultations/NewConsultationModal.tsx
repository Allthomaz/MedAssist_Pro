import React, { useState, useEffect } from 'react';
import { X, Activity, Calendar, Clock, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AudioProcessor from './AudioProcessor';
import { cn } from '@/lib/utils';
import { PatientSearch } from './PatientSearch';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

interface NewConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsultationCreated?: () => void;
}

export const NewConsultationModal: React.FC<NewConsultationModalProps> = ({
  isOpen,
  onClose,
  onConsultationCreated,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimating(false);
      setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = 'unset';
      }, 300);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    if (isSaving) return;
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
      // Reset state on close
      setSelectedPatientId(null);
    }, 300);
  };

  const handleSaveConsultation = async (audioUrl: string, intention: string) => {
    if (!selectedPatientId) {
      toast.error('Erro ao salvar', { description: 'Nenhum paciente foi selecionado.' });
      return;
    }
    if (!user) {
      toast.error('Erro ao salvar', { description: 'Usuário não autenticado.' });
      return;
    }

    setIsSaving(true);
    try {
      const newConsultation = {
        patient_id: selectedPatientId,
        user_id: user.id,
        consultation_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        consultation_time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        consultation_type: 'gravada',
        status: 'em_processamento', // Status indicating transcription is in progress
        has_recording: true,
        audio_url: audioUrl,
        // The 'intention' could be stored in a metadata field if one exists
      };

      const { error } = await supabase.from('consultations').insert(newConsultation);

      if (error) {
        throw error;
      }

      toast.success('Consulta salva com sucesso!', {
        description: 'O processamento do áudio foi iniciado.',
      });

      if (onConsultationCreated) {
        onConsultationCreated();
      }
      handleClose();

    } catch (error: any) {
      console.error('Error saving consultation:', error);
      toast.error('Falha ao salvar a consulta', {
        description: error.message || 'Ocorreu um erro inesperado.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleProcessingComplete = (audioUrl: string, intention: string) => {
    console.log('Processamento completo:', { audioUrl, intention });
    handleSaveConsultation(audioUrl, intention);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
          isAnimating ? 'opacity-100' : 'opacity-0'
        )}
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div
        className={cn(
          'relative w-full max-w-6xl max-h-[90vh] mx-4 transition-all duration-300 ease-out',
          isAnimating
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4'
        )}
      >
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-md">
          <CardHeader className="relative pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-medical-blue to-blue-600 shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Nova Consulta
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Grave e processe sua consulta médica com IA
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
                disabled={isSaving}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Decorative gradient line */}
            <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-medical-blue/30 to-transparent" />
          </CardHeader>

          <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Patient Search */}
            <div className="mb-6 space-y-2">
              <Label htmlFor="patient-search" className="text-lg font-semibold text-gray-800">
                1. Selecione o Paciente
              </Label>
              <PatientSearch 
                onPatientSelect={setSelectedPatientId}
                selectedPatientId={selectedPatientId || undefined}
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Data</p>
                  <p className="text-xs text-blue-700">
                    {new Date().toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200/50">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/10">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-900">Horário</p>
                  <p className="text-xs text-green-700">
                    {new Date().toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/50">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/10">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-900">Tipo</p>
                  <p className="text-xs text-purple-700">Consulta Gravada</p>
                </div>
              </div>
            </div>

            {/* Audio Processor */}
            <div className="bg-gradient-to-br from-gray-50/50 to-white border border-gray-200/50 rounded-2xl p-6">
               <div className='mb-4 space-y-2'>
                <p className="text-lg font-semibold text-gray-800">
                  2. Grave ou faça o upload do áudio
                </p>
              </div>
              <AudioProcessor
                onProcessingComplete={handleProcessingComplete}
                className="border-0 shadow-none bg-transparent"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200/50">
              <Button
                variant="outline"
                onClick={handleClose}
                className="px-6 hover:bg-gray-50 transition-colors"
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button
                variant="medical"
                className="px-6 bg-gradient-to-r from-medical-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg transition-all duration-200"
                disabled={true} // Disabled as the main action is in AudioProcessor
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Consulta'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewConsultationModal;
