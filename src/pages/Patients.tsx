import React, { useState, useEffect } from 'react';
import { MedicalLayout } from '@/components/layout/MedicalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PatientForm } from '@/components/patients/PatientForm';
import { PatientProfile } from '@/components/patients/PatientProfile';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/database.types';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin,
  MoreVertical,
  Filter,
  Loader2,
  ArrowLeft
} from 'lucide-react';

type Patient = Database['public']['Tables']['patients']['Row'];

// Dados serão carregados do Supabase

const Patients = () => {
  const { user } = useAuth();
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadPatients = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('doctor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar pacientes:', error);
        return;
      }

      setPatients(data || []);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadPatients();
    }
  }, [user?.id]);

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

  const filteredPatients = patients.filter(patient =>
    patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (patient.phone && patient.phone.includes(searchTerm)) ||
    (patient.mobile_phone && patient.mobile_phone.includes(searchTerm))
  );

  // Show patient profile if a patient is selected
  if (selectedPatientId) {
    return (
      <MedicalLayout>
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setSelectedPatientId(null)}
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Lista de Pacientes
          </Button>
          <PatientProfile 
            patientId={selectedPatientId}
            onEdit={() => {
              // TODO: Implement edit functionality
              console.log('Edit patient:', selectedPatientId);
            }}
            onNewConsultation={() => {
              // TODO: Implement new consultation functionality
              console.log('New consultation for patient:', selectedPatientId);
            }}
          />
        </div>
      </MedicalLayout>
    );
  }

  if (showPatientForm) {
    return (
      <MedicalLayout>
        <PatientForm
          onSuccess={() => {
            setShowPatientForm(false);
            loadPatients(); // Recarrega a lista de pacientes
          }}
          onCancel={() => setShowPatientForm(false)}
        />
      </MedicalLayout>
    );
  }

  return (
    <MedicalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pacientes</h1>
            <p className="text-muted-foreground">
              Gerencie o cadastro e histórico dos seus pacientes
            </p>
          </div>
          <Button 
            variant="medical" 
            className="gap-2 premium-button-primary"
            onClick={() => setShowPatientForm(true)}
          >
            <Plus className="w-4 h-4" />
            Novo Paciente
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="premium-form-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar pacientes por nome, email ou telefone..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Patients List */}
        <div className="grid gap-4">
          {loading ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Carregando pacientes...</span>
                </div>
              </CardContent>
            </Card>
          ) : filteredPatients.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">
                  {searchTerm ? 'Nenhum paciente encontrado com os critérios de busca.' : 'Nenhum paciente cadastrado ainda.'}
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredPatients.map((patient) => (
            <Card 
              key={patient.id} 
              className="premium-patient-card cursor-pointer premium-fade-in"
              onClick={() => setSelectedPatientId(patient.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-medical-blue/10 text-medical-blue">
                        {patient.full_name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-2">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{patient.full_name}</h3>
                        <p className="text-sm text-muted-foreground">{calculateAge(patient.birth_date)} anos</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {patient.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {patient.email}
                          </div>
                        )}
                        {(patient.phone || patient.mobile_phone) && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {patient.mobile_phone || patient.phone}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Cadastrado em: {new Date(patient.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant="outline" 
                          className={patient.status === 'ativo' 
                            ? 'bg-medical-success/10 text-medical-success border-medical-success/20' 
                            : 'bg-orange-100 text-orange-700 border-orange-200'
                          }
                        >
                          {patient.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </Badge>
                        {patient.patient_number && (
                          <span className="text-sm text-muted-foreground">
                            #{patient.patient_number}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="medical-outline" size="sm">
                      Nova Consulta
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </div>
      </div>
    </MedicalLayout>
  );
};

export default Patients;