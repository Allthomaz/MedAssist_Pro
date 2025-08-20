import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AudioRecorder } from './AudioRecorder';
import ReportGenerator from './ReportGenerator';
import { supabase } from '@/integrations/supabase/client';
import {
  Calendar,
  Clock,
  User,
  FileText,
  Save,
  Edit,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  Pill,
  ClipboardList,
  Mic
} from 'lucide-react';

interface Patient {
  id: string;
  patient_number: string;
  full_name: string;
  birth_date: string;
  gender: string;
}

interface Consultation {
  id: string;
  patient_id: string;
  consultation_date: string;
  consultation_time: string;
  consultation_type: string;
  consultation_mode: string;
  status: string;
  chief_complaint?: string;
  clinical_notes?: string;
  diagnosis?: string;
  treatment_plan?: string;
  prescriptions?: string;
  follow_up_date?: string;
  has_recording: boolean;
  created_at: string;
  updated_at: string;
}

interface ConsultationDetailProps {
  consultationId: string;
  onSave?: (consultation: Consultation) => void;
  onStatusChange?: (status: string) => void;
}

export const ConsultationDetail: React.FC<ConsultationDetailProps> = ({
  consultationId,
  onSave,
  onStatusChange
}) => {
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasRecording, setHasRecording] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState('');

  // Estados para os campos editáveis
  const [formData, setFormData] = useState({
    chief_complaint: '',
    clinical_notes: '',
    diagnosis: '',
    treatment_plan: '',
    prescriptions: '',
    follow_up_date: ''
  });

  useEffect(() => {
    fetchConsultationData();
  }, [consultationId]);

  useEffect(() => {
    if (consultation) {
      setFormData({
        chief_complaint: consultation.chief_complaint || '',
        clinical_notes: consultation.clinical_notes || '',
        diagnosis: consultation.diagnosis || '',
        treatment_plan: consultation.treatment_plan || '',
        prescriptions: consultation.prescriptions || '',
        follow_up_date: consultation.follow_up_date || ''
      });
      setHasRecording(consultation.has_recording);
    }
  }, [consultation]);

  const fetchConsultationData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar dados da consulta
      const { data: consultationData, error: consultationError } = await supabase
        .from('consultations')
        .select('*')
        .eq('id', consultationId)
        .single();

      if (consultationError) throw consultationError;
      setConsultation(consultationData);

      // Buscar dados do paciente
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('id, patient_number, full_name, birth_date, gender')
        .eq('id', consultationData.patient_id)
        .single();

      if (patientError) throw patientError;
      setPatient(patientData);

    } catch (err) {
      console.error('Erro ao carregar dados da consulta:', err);
      setError('Erro ao carregar dados da consulta');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!consultation) return;

    try {
      setSaving(true);
      setError(null);

      const { data, error } = await supabase
        .from('consultations')
        .update({
          ...formData,
          has_recording: hasRecording,
          updated_at: new Date().toISOString()
        })
        .eq('id', consultationId)
        .select()
        .single();

      if (error) throw error;

      setConsultation(data);
      setIsEditing(false);

      if (onSave) {
        onSave(data);
      }

    } catch (err) {
      console.error('Erro ao salvar consulta:', err);
      setError('Erro ao salvar consulta');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!consultation) return;

    try {
      const { data, error } = await supabase
        .from('consultations')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', consultationId)
        .select()
        .single();

      if (error) throw error;

      setConsultation(data);

      if (onStatusChange) {
        onStatusChange(newStatus);
      }

    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      setError('Erro ao atualizar status da consulta');
    }
  };

  const handleRecordingComplete = (recordingId: string) => {
    setHasRecording(true);
    // Atualizar automaticamente o status has_recording na consulta
    supabase
      .from('consultations')
      .update({ has_recording: true })
      .eq('id', consultationId)
      .then(() => {
        console.log('Status de gravação atualizado');
      });
  };

  const handleTranscriptionComplete = (transcriptionId: string, text: string) => {
    setTranscriptionText(text);
    // Adicionar automaticamente a transcrição às notas clínicas
    setFormData(prev => ({
      ...prev,
      clinical_notes: prev.clinical_notes 
        ? `${prev.clinical_notes}\n\n--- Transcrição Automática ---\n${text}`
        : `--- Transcrição Automática ---\n${text}`
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'em_andamento':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'finalizada':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelada':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'agendada':
        return 'Agendada';
      case 'em_andamento':
        return 'Em Andamento';
      case 'finalizada':
        return 'Finalizada';
      case 'cancelada':
        return 'Cancelada';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando consulta...</p>
        </div>
      </div>
    );
  }

  if (error || !consultation || !patient) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error || 'Consulta não encontrada'}</p>
          <Button onClick={fetchConsultationData} variant="outline">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header da Consulta */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">
                  {consultation.consultation_type.replace('_', ' ').toUpperCase()}
                </h1>
                <Badge className={getStatusColor(consultation.status)}>
                  {getStatusLabel(consultation.status)}
                </Badge>
                {hasRecording && (
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                    <Mic className="w-3 h-3 mr-1" />
                    Com Gravação
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {patient.full_name} (#{patient.patient_number})
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(consultation.consultation_date)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {consultation.consultation_time}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {patient.gender === 'male' ? 'Masculino' : patient.gender === 'female' ? 'Feminino' : 'Outro'}, 
                {calculateAge(patient.birth_date)} anos
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {consultation.status === 'agendada' && (
                <Button 
                  onClick={() => handleStatusChange('em_andamento')}
                  className="gap-2"
                  variant="medical"
                >
                  <CheckCircle className="w-4 h-4" />
                  Iniciar Consulta
                </Button>
              )}
              
              {consultation.status === 'em_andamento' && (
                <Button 
                  onClick={() => handleStatusChange('finalizada')}
                  className="gap-2"
                  variant="medical"
                >
                  <CheckCircle className="w-4 h-4" />
                  Finalizar Consulta
                </Button>
              )}
              
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                className="gap-2"
              >
                <Edit className="w-4 h-4" />
                {isEditing ? 'Cancelar' : 'Editar'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Coluna Esquerda - Dados da Consulta */}
        <div className="space-y-6">
          {/* Queixa Principal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Queixa Principal
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={formData.chief_complaint}
                  onChange={(e) => setFormData(prev => ({ ...prev, chief_complaint: e.target.value }))}
                  placeholder="Descreva a queixa principal do paciente..."
                  className="min-h-[100px]"
                />
              ) : (
                <p className="text-sm whitespace-pre-wrap">
                  {consultation.chief_complaint || 'Não informado'}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Notas Clínicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Notas Clínicas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={formData.clinical_notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, clinical_notes: e.target.value }))}
                  placeholder="Anote observações, exames físicos, sintomas..."
                  className="min-h-[200px]"
                />
              ) : (
                <p className="text-sm whitespace-pre-wrap">
                  {consultation.clinical_notes || 'Nenhuma nota registrada'}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Diagnóstico */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-green-500" />
                Diagnóstico
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={formData.diagnosis}
                  onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
                  placeholder="Diagnóstico médico..."
                  className="min-h-[100px]"
                />
              ) : (
                <p className="text-sm whitespace-pre-wrap">
                  {consultation.diagnosis || 'Diagnóstico não definido'}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coluna Direita - Tratamento e Gravação */}
        <div className="space-y-6">
          {/* Plano de Tratamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-purple-500" />
                Plano de Tratamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={formData.treatment_plan}
                  onChange={(e) => setFormData(prev => ({ ...prev, treatment_plan: e.target.value }))}
                  placeholder="Descreva o plano de tratamento..."
                  className="min-h-[150px]"
                />
              ) : (
                <p className="text-sm whitespace-pre-wrap">
                  {consultation.treatment_plan || 'Plano não definido'}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Prescrições */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-red-500" />
                Prescrições
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={formData.prescriptions}
                  onChange={(e) => setFormData(prev => ({ ...prev, prescriptions: e.target.value }))}
                  placeholder="Medicamentos prescritos, dosagens, instruções..."
                  className="min-h-[150px]"
                />
              ) : (
                <p className="text-sm whitespace-pre-wrap">
                  {consultation.prescriptions || 'Nenhuma prescrição'}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Data de Retorno */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-500" />
                Retorno
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Input
                  type="date"
                  value={formData.follow_up_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, follow_up_date: e.target.value }))}
                />
              ) : (
                <p className="text-sm">
                  {consultation.follow_up_date 
                    ? formatDate(consultation.follow_up_date)
                    : 'Não agendado'
                  }
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Gravação de Áudio */}
      {consultation.status === 'em_andamento' && (
        <AudioRecorder
          consultationId={consultationId}
          onRecordingComplete={handleRecordingComplete}
          onTranscriptionComplete={handleTranscriptionComplete}
        />
      )}

      {/* Gerador de Relatórios */}
      <ReportGenerator
        consultationId={consultation.id}
        transcriptionText={consultation.clinical_notes || ''}
        patientName={patient.full_name}
        doctorName="Dr. [Nome do Médico]"
      />

      {/* Botões de Ação */}
      {isEditing && (
        <div className="flex items-center gap-2 pt-4">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2"
            variant="medical"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
          
          <Button
            onClick={() => {
              setIsEditing(false);
              // Resetar formulário
              if (consultation) {
                setFormData({
                  chief_complaint: consultation.chief_complaint || '',
                  clinical_notes: consultation.clinical_notes || '',
                  diagnosis: consultation.diagnosis || '',
                  treatment_plan: consultation.treatment_plan || '',
                  prescriptions: consultation.prescriptions || '',
                  follow_up_date: consultation.follow_up_date || ''
                });
              }
            }}
            variant="outline"
          >
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
};