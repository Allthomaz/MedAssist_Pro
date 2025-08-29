import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  Suspense,
  lazy,
} from 'react';
import { MedicalLayout } from '@/components/layout/MedicalLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { VirtualizedList } from '@/components/ui/VirtualizedList';

// Lazy load heavy components
const PatientForm = lazy(() => import('@/components/patients/PatientForm'));
const PatientProfile = lazy(() =>
  import('@/components/patients/PatientProfile').then(module => ({
    default: module.PatientProfile,
  }))
);
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/database.types';
import { useAuth } from '@/stores/useAuthStore';
import {
  Search,
  Plus,
  Phone,
  Mail,
  Calendar,
  MoreVertical,
  Filter,
  Loader2,
  ArrowLeft,
} from 'lucide-react';

/**
 * Componente otimizado para renderizar itens individuais da lista de pacientes
 * Utiliza React.memo para evitar re-renderizações desnecessárias
 * Suporta virtualização com react-window
 */
const PatientItem = React.memo<{
  patient: Patient;
  onSelect: (id: string) => void;
  calculateAge: (birthDate: string) => number;
  style?: React.CSSProperties;
}>(({ patient, onSelect, calculateAge, style }) => {
  // Memoiza as iniciais do paciente para evitar recálculos
  const patientInitials = useMemo(() => {
    return patient.full_name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2);
  }, [patient.full_name]);

  // Memoiza a idade do paciente
  const patientAge = useMemo(() => {
    return calculateAge(patient.birth_date);
  }, [patient.birth_date, calculateAge]);

  return (
    <div style={style}>
      <Card
        className="premium-patient-card cursor-pointer premium-fade-in mb-4"
        onClick={() => onSelect(patient.id)}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-medical-blue/10 text-medical-blue">
                  {patientInitials}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {patient.full_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {patientAge} anos
                  </p>
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
                    Cadastrado em:{' '}
                    {new Date(patient.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={
                      patient.status === 'ativo'
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
    </div>
  );
});

PatientItem.displayName = 'PatientItem';

type Patient = Database['public']['Tables']['patients']['Row'];

// Loading component for Suspense fallback
const ComponentLoader = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-6 w-6 animate-spin" />
  </div>
);

// Dados serão carregados do Supabase

/**
 * Componente principal de pacientes otimizado com React.memo
 */
const PatientsComponent = React.memo(() => {
  const { user } = useAuth();
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Constantes para virtualização
  const PATIENT_ITEM_HEIGHT = 180; // Altura aproximada de cada item de paciente
  const VIRTUALIZATION_THRESHOLD = 50; // Número mínimo de itens para ativar virtualização

  const loadPatients = useCallback(async () => {
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
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      loadPatients();
    }
  }, [user?.id, loadPatients]);

  const calculateAge = useCallback((birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  }, []);

  const filteredPatients = useMemo(
    () =>
      patients.filter(
        patient =>
          patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (patient.email &&
            patient.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (patient.phone && patient.phone.includes(searchTerm)) ||
          (patient.mobile_phone && patient.mobile_phone.includes(searchTerm))
      ),
    [patients, searchTerm]
  );

  /**
   * Componente de item virtualizado para react-window
   */
  const VirtualizedPatientItem = useCallback(
    ({
      index,
      style,
      data,
    }: {
      index: number;
      style: React.CSSProperties;
      data: Patient[];
    }) => {
      const patient = data[index];
      return (
        <PatientItem
          key={patient.id}
          patient={patient}
          onSelect={setSelectedPatientId}
          calculateAge={calculateAge}
          style={style}
        />
      );
    },
    [calculateAge]
  );

  /**
   * Determina se deve usar virtualização baseado no número de itens
   */
  const shouldUseVirtualization =
    filteredPatients.length >= VIRTUALIZATION_THRESHOLD;

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
          <Suspense fallback={<ComponentLoader />}>
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
          </Suspense>
        </div>
      </MedicalLayout>
    );
  }

  if (showPatientForm) {
    return (
      <MedicalLayout>
        <Suspense fallback={<ComponentLoader />}>
          <PatientForm
            onSuccess={() => {
              setShowPatientForm(false);
              loadPatients(); // Recarrega a lista de pacientes
            }}
            onCancel={() => setShowPatientForm(false)}
          />
        </Suspense>
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
                  onChange={e => setSearchTerm(e.target.value)}
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
        <div ref={listContainerRef} className="grid gap-4">
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
                  {searchTerm
                    ? 'Nenhum paciente encontrado com os critérios de busca.'
                    : 'Nenhum paciente cadastrado ainda.'}
                </div>
              </CardContent>
            </Card>
          ) : shouldUseVirtualization ? (
            // Lista virtualizada para muitos itens
            <div className="border rounded-lg">
              <VirtualizedList
                items={filteredPatients}
                itemHeight={PATIENT_ITEM_HEIGHT}
                height={Math.min(
                  600,
                  filteredPatients.length * PATIENT_ITEM_HEIGHT
                )}
                renderItem={VirtualizedPatientItem}
                className="p-2"
                overscanCount={3}
              />
            </div>
          ) : (
            // Lista normal para poucos itens
            filteredPatients.map(patient => (
              <PatientItem
                key={patient.id}
                patient={patient}
                onSelect={setSelectedPatientId}
                calculateAge={calculateAge}
              />
            ))
          )}
        </div>
      </div>
    </MedicalLayout>
  );
});

PatientsComponent.displayName = 'PatientsComponent';

export default PatientsComponent;
