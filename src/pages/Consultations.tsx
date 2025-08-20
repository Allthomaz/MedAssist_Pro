import React, { useState, useEffect } from 'react';
import { MedicalLayout } from '@/components/layout/MedicalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ConsultationDetail } from '@/components/consultations/ConsultationDetail';
import { supabase } from '@/integrations/supabase/client';
import { 
  Video, 
  Clock, 
  User, 
  Calendar,
  Play,
  Pause,
  Square,
  Mic,
  MicOff,
  VideoOff,
  Settings,
  FileText,
  Brain,
  Plus,
  Eye
} from 'lucide-react';

interface Patient {
  id: string;
  full_name: string;
  patient_number: string;
}

interface Consultation {
  id: string;
  patient_id: string;
  consultation_date: string;
  consultation_time: string;
  consultation_type: string;
  status: string;
  has_recording: boolean;
  document_generated: boolean;
  actual_duration?: number;
  patients?: Patient;
}

const Consultations = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState<string | null>(null);
  const [showNewConsultation, setShowNewConsultation] = useState(false);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('consultations')
        .select(`
          *,
          patients (
            id,
            full_name,
            patient_number
          )
        `)
        .order('consultation_date', { ascending: false })
        .order('consultation_time', { ascending: false })
        .limit(20);

      if (error) throw error;
      setConsultations(data || []);
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'agendada': 'Agendada',
      'em_andamento': 'Em Andamento',
      'finalizada': 'Finalizada',
      'cancelada': 'Cancelada',
      'nao_compareceu': 'Não Compareceu'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'agendada': 'bg-blue-100 text-blue-700 border-blue-200',
      'em_andamento': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'finalizada': 'bg-green-100 text-green-700 border-green-200',
      'cancelada': 'bg-red-100 text-red-700 border-red-200',
      'nao_compareceu': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    return `${minutes} min`;
  };

  if (selectedConsultation) {
    return (
      <MedicalLayout>
        <div className="space-y-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedConsultation(null)}
            className="gap-2"
          >
            ← Voltar para Lista
          </Button>
          <ConsultationDetail consultationId={selectedConsultation} />
        </div>
      </MedicalLayout>
    );
  }

  return (
    <MedicalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Consultas</h1>
            <p className="text-muted-foreground">
              Gerencie consultas com gravação e automação de documentos
            </p>
          </div>
          <Button variant="medical" className="gap-2" onClick={() => setShowNewConsultation(true)}>
            <Plus className="w-4 h-4" />
            Nova Consulta
          </Button>
        </div>

        {/* Video Interface Demo */}
        <Card className="bg-gradient-to-r from-medical-blue/5 to-primary/5 border-medical-blue/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5 text-medical-blue" />
              Interface de Consulta Virtual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mock Video Area */}
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative">
              <div className="text-center text-white space-y-2">
                <VideoOff className="w-12 h-12 mx-auto opacity-50" />
                <p className="text-sm opacity-75">Área de vídeo da consulta</p>
              </div>
              
              {/* Recording Indicator */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-medical-alert/90 text-white px-3 py-1 rounded-full text-sm">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                Gravando
              </div>
            </div>

            {/* Video Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button variant="medical-ghost" size="sm">
                <Mic className="w-4 h-4" />
              </Button>
              <Button variant="medical-ghost" size="sm">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="medical-alert" size="lg" className="gap-2">
                <Square className="w-4 h-4" />
                Finalizar Consulta
              </Button>
              <Button variant="medical-ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>

            <div className="bg-card rounded-lg p-4 border">
              <h4 className="font-medium text-foreground mb-2">Fluxo de Automação</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-medical-success text-white flex items-center justify-center text-xs">1</div>
                  Gravação da consulta
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-medical-blue text-white flex items-center justify-center text-xs">2</div>
                  Transcrição automática
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-accent text-foreground flex items-center justify-center text-xs">3</div>
                  Geração do documento
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Consultations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-medical-blue" />
              Consultas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue"></div>
                <span className="ml-2 text-muted-foreground">Carregando consultas...</span>
              </div>
            ) : consultations.length === 0 ? (
              <div className="text-center p-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Nenhuma consulta encontrada</p>
                <Button variant="medical" onClick={() => setShowNewConsultation(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agendar Primeira Consulta
                </Button>
              </div>
            ) : (
              consultations.map((consultation) => (
                <div key={consultation.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-medical-blue/10 text-medical-blue">
                        {consultation.patients?.full_name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'P'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium text-foreground">
                          {consultation.patients?.full_name || 'Paciente não encontrado'}
                        </h4>
                        <Badge variant="outline">
                          {consultation.consultation_type.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(consultation.consultation_date)} às {consultation.consultation_time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDuration(consultation.actual_duration)}
                        </span>
                        {consultation.has_recording && (
                          <span className="flex items-center gap-1 text-purple-600">
                            <Mic className="w-4 h-4" />
                            Gravação
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={getStatusColor(consultation.status)}>
                      {getStatusLabel(consultation.status)}
                    </Badge>
                    
                    {consultation.document_generated && (
                      <Button variant="medical-outline" size="sm" className="gap-2">
                        <FileText className="w-4 h-4" />
                        Ver Documento
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => setSelectedConsultation(consultation.id)}
                    >
                      <Eye className="w-4 h-4" />
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Integration Notice */}
        <Card className="bg-accent/50 border-medical-blue/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-medical-blue/10">
                <Video className="w-5 h-5 text-medical-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Funcionalidades Avançadas</h3>
                <p className="text-sm text-muted-foreground">
                  Para ativar gravação de vídeo, transcrição automática e geração de documentos com IA, conecte ao Supabase e configure as integrações necessárias.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MedicalLayout>
  );
};

export default Consultations;