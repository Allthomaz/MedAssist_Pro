import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  Suspense,
  lazy,
} from 'react';
import { MedicalLayout } from '@/components/layout/MedicalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { NewConsultationModal } from '@/components/consultations/NewConsultationModal';

// Lazy load heavy components
const ConsultationDetail = lazy(() =>
  import('@/components/consultations/ConsultationDetail').then(module => ({
    default: module.ConsultationDetail,
  }))
);
import { supabase } from '@/integrations/supabase/client';
import {
  Video,
  Clock,
  Calendar,
  Mic,
  FileText,
  Eye,
  Stethoscope,
  Brain,
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

/**
 * Componente otimizado para renderizar um item da lista de consultas
 * Utiliza React.memo para evitar re-renderizações desnecessárias
 */
interface ConsultationItemProps {
  consultation: Consultation;
  onSelect: (id: string) => void;
  formatDate: (date: string) => string;
  formatDuration: (minutes?: number) => string;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

const ConsultationItemComponent: React.FC<ConsultationItemProps> = ({
  consultation,
  onSelect,
  formatDate,
  formatDuration,
  getStatusColor,
  getStatusLabel,
}) => {
  /**
   * Memoiza as iniciais do paciente para evitar recálculos
   */
  const patientInitials = useMemo(() => {
    return (
      consultation.patients?.full_name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2) || 'P'
    );
  }, [consultation.patients?.full_name]);

  /**
   * Memoiza o tipo de consulta formatado
   */
  const formattedConsultationType = useMemo(() => {
    return consultation.consultation_type.replace('_', ' ').toUpperCase();
  }, [consultation.consultation_type]);

  return (
    <div className="flex items-center justify-between p-5 rounded-xl border border-medical-blue/20 hover:border-medical-blue/40 bg-gradient-to-r from-white to-medical-blue/5 hover:from-medical-blue/5 hover:to-medical-green/5 transition-all duration-300 shadow-sm hover:shadow-md">
      <div className="flex items-center gap-4">
        <Avatar className="w-12 h-12 ring-2 ring-medical-blue/20">
          <AvatarFallback className="bg-gradient-to-r from-medical-blue to-medical-green text-white font-semibold">
            {patientInitials}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h4 className="font-medium text-foreground">
              {consultation.patients?.full_name || 'Paciente não encontrado'}
            </h4>
            <Badge variant="outline">{formattedConsultationType}</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(consultation.consultation_date)} às{' '}
              {consultation.consultation_time}
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
        <Badge
          variant="outline"
          className={getStatusColor(consultation.status)}
        >
          {getStatusLabel(consultation.status)}
        </Badge>

        {consultation.has_recording && (
          <Badge
            variant="secondary"
            className="gap-1 bg-gradient-to-r from-medical-blue/10 to-medical-green/10 text-medical-blue border-medical-blue/20"
          >
            <Mic className="w-3 h-3" />
            Áudio
          </Badge>
        )}

        {consultation.document_generated && (
          <Badge
            variant="secondary"
            className="gap-1 bg-gradient-to-r from-medical-green/10 to-medical-blue/10 text-medical-green border-medical-green/20"
          >
            <FileText className="w-3 h-3" />
            Relatório
          </Badge>
        )}

        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-medical-blue/30 text-medical-blue hover:bg-medical-blue hover:text-white transition-all duration-300"
          onClick={() => onSelect(consultation.id)}
        >
          <Eye className="w-4 h-4" />
          Visualizar
        </Button>
      </div>
    </div>
  );
};

/**
 * Componente otimizado com React.memo
 */
const ConsultationItem = React.memo(ConsultationItemComponent);

const Consultations = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState<
    string | null
  >(null);
  const [showNewConsultation, setShowNewConsultation] = useState(false);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  const fetchConsultations = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('consultations')
        .select(
          `
          *,
          patients (
            id,
            full_name,
            patient_number
          )
        `
        )
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
  }, []);

  const statusMap = useMemo(
    () => ({
      agendada: 'Agendada',
      em_andamento: 'Em Andamento',
      finalizada: 'Finalizada',
      cancelada: 'Cancelada',
      nao_compareceu: 'Não Compareceu',
    }),
    []
  );

  const colorMap = useMemo(
    () => ({
      agendada: 'bg-blue-100 text-blue-700 border-blue-200',
      em_andamento: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      finalizada: 'bg-green-100 text-green-700 border-green-200',
      cancelada: 'bg-red-100 text-red-700 border-red-200',
      nao_compareceu: 'bg-gray-100 text-gray-700 border-gray-200',
    }),
    []
  );

  const getStatusLabel = useCallback(
    (status: string) => {
      return statusMap[status] || status;
    },
    [statusMap]
  );

  const getStatusColor = useCallback(
    (status: string) => {
      return colorMap[status] || 'bg-gray-100 text-gray-700 border-gray-200';
    },
    [colorMap]
  );

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }, []);

  const formatDuration = useCallback((minutes?: number) => {
    if (!minutes) return 'N/A';
    return `${minutes} min`;
  }, []);

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
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue mr-2"></div>
                <span className="text-muted-foreground">
                  Carregando detalhes da consulta...
                </span>
              </div>
            }
          >
            <ConsultationDetail consultationId={selectedConsultation} />
          </Suspense>
        </div>
      </MedicalLayout>
    );
  }

  return (
    <MedicalLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-medical-blue/5 to-medical-green/5 rounded-2xl p-8 border border-medical-blue/10">
          <div className="text-center space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
                Consultas Médicas
              </h1>
              <p className="text-muted-foreground text-base max-w-2xl mx-auto">
                Sistema inteligente de transcrição e análise médica
              </p>
            </div>
            <Button
              variant="medical"
              className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-medical-blue to-medical-green hover:from-medical-blue/90 hover:to-medical-green/90 px-8 py-3 text-lg"
              onClick={() => setShowNewConsultation(true)}
            >
              <Stethoscope className="w-5 h-5" />
              Nova Consulta
            </Button>
          </div>
        </div>

        {/* New Consultation Modal */}
        <NewConsultationModal
          isOpen={showNewConsultation}
          onClose={() => setShowNewConsultation(false)}
          onConsultationCreated={() => {
            setShowNewConsultation(false);
            fetchConsultations(); // Refresh the consultations list
          }}
        />

        {/* Recent Consultations */}
        <Card className="min-h-[600px] shadow-2xl border-0 bg-gradient-to-br from-white via-gray-50/30 to-medical-blue/5 dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-700/30 rounded-3xl overflow-hidden backdrop-blur-md">
          <div className="relative">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-medical-blue/3 via-transparent to-medical-green/3 opacity-50"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-medical-blue/8 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-medical-green/8 to-transparent rounded-full blur-2xl"></div>

            <CardHeader className="relative bg-gradient-to-r from-medical-blue/8 via-medical-blue/5 to-medical-green/8 border-b border-medical-blue/15 backdrop-blur-sm">
              <CardTitle className="flex items-center justify-center gap-4 py-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-medical-blue to-medical-green shadow-lg ring-2 ring-white/20">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl text-medical-blue dark:text-medical-green font-bold">
                  Transcrição Inteligente
                </span>
              </CardTitle>
            </CardHeader>
          </div>
          <CardContent className="relative p-8 space-y-6">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue"></div>
                <span className="ml-2 text-muted-foreground">
                  Carregando consultas...
                </span>
              </div>
            ) : consultations.length === 0 ? (
              <div className="text-center p-12">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-medical-blue/20 to-medical-green/20 rounded-full blur-xl"></div>
                  <Stethoscope className="relative w-20 h-20 text-medical-blue mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 bg-gradient-to-r from-medical-blue to-medical-green bg-clip-text text-transparent">
                  Bem-vindo ao Sistema de Transcrição
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
                  Clique em "Nova Consulta" para começar sua primeira
                  transcrição inteligente
                </p>
              </div>
            ) : (
              consultations.map(consultation => (
                <ConsultationItem
                  key={consultation.id}
                  consultation={consultation}
                  onSelect={setSelectedConsultation}
                  formatDate={formatDate}
                  formatDuration={formatDuration}
                  getStatusColor={getStatusColor}
                  getStatusLabel={getStatusLabel}
                />
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
                <h3 className="font-semibold text-foreground">
                  Funcionalidades Avançadas
                </h3>
                <p className="text-sm text-muted-foreground">
                  Para ativar gravação de vídeo, transcrição automática e
                  geração de documentos com IA, conecte ao Supabase e configure
                  as integrações necessárias.
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
