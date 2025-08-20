import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import {
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  Pill,
  FileText,
  Clock,
  Edit,
  Plus,
  Activity
} from 'lucide-react';

interface Patient {
  id: string;
  patient_number: string;
  full_name: string;
  birth_date: string;
  gender: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  allergies?: string[];
  current_medications?: string[];
  chronic_conditions?: string[];
  family_history?: string;
  insurance_company?: string;
  insurance_number?: string;
  notes?: string;
  status: string;
  created_at: string;
}

interface Consultation {
  id: string;
  consultation_date: string;
  consultation_time: string;
  consultation_type: string;
  status: string;
  chief_complaint?: string;
  diagnosis?: string;
  treatment_plan?: string;
  clinical_notes?: string;
}

interface PatientProfileProps {
  patientId: string;
  onEdit?: () => void;
  onNewConsultation?: () => void;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({
  patientId,
  onEdit,
  onNewConsultation
}) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatientData();
  }, [patientId]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      
      // Buscar dados do paciente
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();

      if (patientError) throw patientError;
      setPatient(patientData);

      // Buscar consultas do paciente
      const { data: consultationsData, error: consultationsError } = await supabase
        .from('consultations')
        .select('*')
        .eq('patient_id', patientId)
        .order('consultation_date', { ascending: false });

      if (consultationsError) throw consultationsError;
      setConsultations(consultationsData || []);

    } catch (err) {
      console.error('Erro ao carregar dados do paciente:', err);
      setError('Erro ao carregar dados do paciente');
    } finally {
      setLoading(false);
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'archived':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getConsultationStatusColor = (status: string) => {
    switch (status) {
      case 'finalizada':
        return 'bg-green-100 text-green-700';
      case 'agendada':
        return 'bg-blue-100 text-blue-700';
      case 'em_andamento':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelada':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dados do paciente...</p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Paciente não encontrado'}</p>
          <Button onClick={fetchPatientData} variant="outline">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header do Paciente */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-medical-blue/10 text-medical-blue text-lg">
                  {patient.full_name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-2">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{patient.full_name}</h1>
                  <p className="text-muted-foreground">Paciente #{patient.patient_number}</p>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {calculateAge(patient.birth_date)} anos
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {patient.gender === 'male' ? 'Masculino' : patient.gender === 'female' ? 'Feminino' : 'Outro'}
                  </div>
                  {patient.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {patient.phone}
                    </div>
                  )}
                  {patient.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {patient.email}
                    </div>
                  )}
                </div>
                
                <Badge className={getStatusColor(patient.status)}>
                  {patient.status === 'active' ? 'Ativo' : 
                   patient.status === 'inactive' ? 'Inativo' : 'Arquivado'}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="medical" className="gap-2" onClick={onNewConsultation}>
                <Plus className="w-4 h-4" />
                Nova Consulta
              </Button>
              <Button variant="outline" className="gap-2" onClick={onEdit}>
                <Edit className="w-4 h-4" />
                Editar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs com informações detalhadas */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="consultations">Consultas</TabsTrigger>
          <TabsTrigger value="medical">Dados Médicos</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Resumo das Consultas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-medical-blue" />
                  Resumo das Consultas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-medical-blue">{consultations.length}</div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {consultations.filter(c => c.status === 'finalizada').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Finalizadas</div>
                  </div>
                </div>
                
                {consultations.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Última consulta:</p>
                    <p className="font-medium">{formatDate(consultations[0].consultation_date)}</p>
                    {consultations[0].chief_complaint && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {consultations[0].chief_complaint}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informações Médicas Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Informações Médicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {patient.allergies && patient.allergies.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Alergias:</p>
                    <div className="flex flex-wrap gap-1">
                      {patient.allergies.map((allergy, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {patient.current_medications && patient.current_medications.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Medicamentos:</p>
                    <div className="flex flex-wrap gap-1">
                      {patient.current_medications.slice(0, 3).map((medication, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {medication}
                        </Badge>
                      ))}
                      {patient.current_medications.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{patient.current_medications.length - 3} mais
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
                {patient.chronic_conditions && patient.chronic_conditions.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Condições Crônicas:</p>
                    <div className="flex flex-wrap gap-1">
                      {patient.chronic_conditions.map((condition, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-yellow-50 text-yellow-700">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="consultations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-medical-blue" />
                Histórico de Consultas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {consultations.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhuma consulta registrada</p>
                  <Button 
                    variant="medical" 
                    className="mt-4 gap-2" 
                    onClick={onNewConsultation}
                  >
                    <Plus className="w-4 h-4" />
                    Agendar Primeira Consulta
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {consultations.map((consultation) => (
                    <div key={consultation.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">
                              {consultation.consultation_type.replace('_', ' ').toUpperCase()}
                            </h4>
                            <Badge className={getConsultationStatusColor(consultation.status)}>
                              {consultation.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(consultation.consultation_date)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {consultation.consultation_time}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {consultation.chief_complaint && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Queixa Principal:</p>
                          <p className="text-sm">{consultation.chief_complaint}</p>
                        </div>
                      )}
                      
                      {consultation.diagnosis && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Diagnóstico:</p>
                          <p className="text-sm">{consultation.diagnosis}</p>
                        </div>
                      )}
                      
                      {consultation.treatment_plan && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Plano de Tratamento:</p>
                          <p className="text-sm">{consultation.treatment_plan}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Alergias */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Alergias
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patient.allergies && patient.allergies.length > 0 ? (
                  <div className="space-y-2">
                    {patient.allergies.map((allergy, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {allergy}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhuma alergia registrada</p>
                )}
              </CardContent>
            </Card>

            {/* Medicamentos Atuais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-blue-500" />
                  Medicamentos Atuais
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patient.current_medications && patient.current_medications.length > 0 ? (
                  <div className="space-y-2">
                    {patient.current_medications.map((medication, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {medication}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhum medicamento registrado</p>
                )}
              </CardContent>
            </Card>

            {/* Condições Crônicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-yellow-500" />
                  Condições Crônicas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patient.chronic_conditions && patient.chronic_conditions.length > 0 ? (
                  <div className="space-y-2">
                    {patient.chronic_conditions.map((condition, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          {condition}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhuma condição crônica registrada</p>
                )}
              </CardContent>
            </Card>

            {/* Histórico Familiar */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico Familiar</CardTitle>
              </CardHeader>
              <CardContent>
                {patient.family_history ? (
                  <p className="text-sm">{patient.family_history}</p>
                ) : (
                  <p className="text-muted-foreground">Nenhum histórico familiar registrado</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Informações de Contato */}
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {patient.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{patient.email}</span>
                  </div>
                )}
                
                {patient.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{patient.phone}</span>
                  </div>
                )}
                
                {(patient.address || patient.city || patient.state) && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                    <div>
                      {patient.address && <div>{patient.address}</div>}
                      {(patient.city || patient.state) && (
                        <div className="text-muted-foreground">
                          {patient.city}{patient.city && patient.state && ', '}{patient.state}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informações do Plano de Saúde */}
            <Card>
              <CardHeader>
                <CardTitle>Plano de Saúde</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {patient.insurance_company ? (
                  <div>
                    <p className="font-medium">{patient.insurance_company}</p>
                    {patient.insurance_number && (
                      <p className="text-sm text-muted-foreground">Número: {patient.insurance_number}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhum plano de saúde registrado</p>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Observações */}
          {patient.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{patient.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};