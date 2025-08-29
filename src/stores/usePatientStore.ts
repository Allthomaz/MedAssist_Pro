import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { getErrorMessage } from '@/types/common';
import type { Database } from '@/types/supabase';

/**
 * Tipo do paciente baseado no schema do Supabase
 */
export type Patient = Database['public']['Tables']['patients']['Row'];

/**
 * Tipo para criação de paciente
 */
export type CreatePatientRequest =
  Database['public']['Tables']['patients']['Insert'];

/**
 * Tipo para atualização de paciente
 */
export type UpdatePatientRequest =
  Database['public']['Tables']['patients']['Update'];

/**
 * Filtros para busca de pacientes
 */
export interface PatientFilters {
  search?: string;
  status?: 'active' | 'inactive' | 'archived';
  gender?: string;
  ageRange?: {
    min?: number;
    max?: number;
  };
  hasInsurance?: boolean;
  bloodType?: string;
}

/**
 * Interface do estado do store de pacientes
 */
interface PatientState {
  // Estado
  patients: Patient[];
  selectedPatient: Patient | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  filters: PatientFilters;
  searchTerm: string;

  // Ações
  initialize: (doctorId: string) => Promise<void>;
  fetchPatients: (doctorId: string) => Promise<void>;
  fetchPatientById: (patientId: string) => Promise<Patient | null>;
  createPatient: (patientData: CreatePatientRequest) => Promise<Patient>;
  updatePatient: (
    patientId: string,
    updates: UpdatePatientRequest
  ) => Promise<Patient>;
  deletePatient: (patientId: string) => Promise<void>;
  setSelectedPatient: (patient: Patient | null) => void;
  setFilters: (filters: Partial<PatientFilters>) => void;
  setSearchTerm: (term: string) => void;
  clearPatients: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;

  // Getters computados
  getFilteredPatients: () => Patient[];
  getPatientById: (id: string) => Patient | undefined;
  getActivePatients: () => Patient[];
  getRecentPatients: (limit?: number) => Patient[];
}

/**
 * Função utilitária para calcular idade
 */
const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

/**
 * Função utilitária para filtrar pacientes
 */
const filterPatients = (
  patients: Patient[],
  filters: PatientFilters,
  searchTerm: string
): Patient[] => {
  return patients.filter(patient => {
    // Filtro de busca por texto
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        patient.full_name?.toLowerCase().includes(searchLower) ||
        patient.email?.toLowerCase().includes(searchLower) ||
        patient.phone?.includes(searchTerm) ||
        patient.mobile_phone?.includes(searchTerm) ||
        patient.patient_number?.toString().includes(searchTerm);

      if (!matchesSearch) return false;
    }

    // Filtro de status
    if (filters.status && patient.status !== filters.status) {
      return false;
    }

    // Filtro de gênero
    if (filters.gender && patient.gender !== filters.gender) {
      return false;
    }

    // Filtro de faixa etária
    if (filters.ageRange && patient.birth_date) {
      const age = calculateAge(patient.birth_date);
      if (filters.ageRange.min && age < filters.ageRange.min) return false;
      if (filters.ageRange.max && age > filters.ageRange.max) return false;
    }

    // Filtro de plano de saúde
    if (filters.hasInsurance !== undefined) {
      const hasInsurance = Boolean(patient.insurance_name);
      if (filters.hasInsurance !== hasInsurance) return false;
    }

    // Filtro de tipo sanguíneo
    if (filters.bloodType && patient.blood_type !== filters.bloodType) {
      return false;
    }

    return true;
  });
};

/**
 * Store Zustand para gerenciamento de pacientes
 *
 * Este store centraliza o estado dos pacientes do médico,
 * fornecendo funcionalidades para buscar, criar, atualizar,
 * deletar e filtrar pacientes.
 *
 * @example
 * ```tsx
 * function PatientList() {
 *   const {
 *     patients,
 *     loading,
 *     searchTerm,
 *     setSearchTerm,
 *     getFilteredPatients
 *   } = usePatientStore();
 *
 *   const filteredPatients = getFilteredPatients();
 *
 *   if (loading) return <div>Carregando pacientes...</div>;
 *
 *   return (
 *     <div>
 *       <input
 *         value={searchTerm}
 *         onChange={(e) => setSearchTerm(e.target.value)}
 *         placeholder="Buscar pacientes..."
 *       />
 *       {filteredPatients.map(patient => (
 *         <div key={patient.id}>
 *           <h3>{patient.full_name}</h3>
 *           <p>{patient.email}</p>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const usePatientStore = create<PatientState>()();
devtools(
  (set, get) => ({
    // Estado inicial
    patients: [],
    selectedPatient: null,
    loading: false,
    error: null,
    initialized: false,
    filters: {},
    searchTerm: '',

    /**
     * Inicializa o store com os pacientes do médico
     */
    initialize: async (doctorId: string) => {
      if (!doctorId) {
        set({
          patients: [],
          selectedPatient: null,
          loading: false,
          error: null,
          initialized: false,
        });
        return;
      }

      const { initialized } = get();
      if (initialized) return;

      set({ loading: true, error: null });

      try {
        await get().fetchPatients(doctorId);
        set({ initialized: true });
      } catch (error) {
        console.error('Erro ao inicializar pacientes:', error);
        set({
          error: `Erro ao inicializar pacientes: ${getErrorMessage(error)}`,
          loading: false,
        });
      }
    },

    /**
     * Busca todos os pacientes do médico
     */
    fetchPatients: async (doctorId: string) => {
      if (!doctorId) {
        set({
          patients: [],
          loading: false,
          error: null,
        });
        return;
      }

      set({ loading: true, error: null });

      try {
        console.log('PatientStore: Buscando pacientes para médico:', doctorId);

        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .eq('doctor_id', doctorId)
          .order('full_name');

        if (error) throw error;

        console.log('PatientStore: Pacientes encontrados:', data?.length || 0);

        set({
          patients: data || [],
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('PatientStore: Erro ao buscar pacientes:', error);
        set({
          error: `Erro ao carregar pacientes: ${getErrorMessage(error)}`,
          loading: false,
        });
      }
    },

    /**
     * Busca um paciente específico por ID
     */
    fetchPatientById: async (patientId: string) => {
      try {
        console.log('PatientStore: Buscando paciente por ID:', patientId);

        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .eq('id', patientId)
          .single();

        if (error) throw error;

        console.log('PatientStore: Paciente encontrado:', data?.full_name);

        // Atualizar o paciente no estado se já existir
        set(state => ({
          patients: state.patients.map(p => (p.id === patientId ? data : p)),
          selectedPatient: data,
        }));

        return data;
      } catch (error) {
        console.error('PatientStore: Erro ao buscar paciente:', error);
        set({ error: `Erro ao carregar paciente: ${getErrorMessage(error)}` });
        return null;
      }
    },

    /**
     * Cria um novo paciente
     */
    createPatient: async (patientData: CreatePatientRequest) => {
      set({ loading: true, error: null });

      try {
        console.log(
          'PatientStore: Criando novo paciente:',
          patientData.full_name
        );

        const { data, error } = await supabase
          .from('patients')
          .insert(patientData)
          .select()
          .single();

        if (error) throw error;

        console.log('PatientStore: Paciente criado com sucesso:', data.id);

        // Adicionar o novo paciente ao estado
        set(state => ({
          patients: [...state.patients, data],
          selectedPatient: data,
          loading: false,
        }));

        return data;
      } catch (error) {
        console.error('PatientStore: Erro ao criar paciente:', error);
        set({
          error: `Erro ao criar paciente: ${getErrorMessage(error)}`,
          loading: false,
        });
        throw error;
      }
    },

    /**
     * Atualiza um paciente existente
     */
    updatePatient: async (patientId: string, updates: UpdatePatientRequest) => {
      set({ loading: true, error: null });

      try {
        console.log('PatientStore: Atualizando paciente:', patientId);

        const { data, error } = await supabase
          .from('patients')
          .update(updates)
          .eq('id', patientId)
          .select()
          .single();

        if (error) throw error;

        console.log('PatientStore: Paciente atualizado com sucesso');

        // Atualizar o paciente no estado
        set(state => ({
          patients: state.patients.map(p => (p.id === patientId ? data : p)),
          selectedPatient:
            state.selectedPatient?.id === patientId
              ? data
              : state.selectedPatient,
          loading: false,
        }));

        return data;
      } catch (error) {
        console.error('PatientStore: Erro ao atualizar paciente:', error);
        set({
          error: `Erro ao atualizar paciente: ${getErrorMessage(error)}`,
          loading: false,
        });
        throw error;
      }
    },

    /**
     * Remove um paciente (soft delete - marca como arquivado)
     */
    deletePatient: async (patientId: string) => {
      set({ loading: true, error: null });

      try {
        console.log('PatientStore: Arquivando paciente:', patientId);

        const { error } = await supabase
          .from('patients')
          .update({ status: 'archived' })
          .eq('id', patientId);

        if (error) throw error;

        console.log('PatientStore: Paciente arquivado com sucesso');

        // Remover o paciente do estado ou atualizar status
        set(state => ({
          patients: state.patients.map(p =>
            p.id === patientId ? { ...p, status: 'archived' } : p
          ),
          selectedPatient:
            state.selectedPatient?.id === patientId
              ? null
              : state.selectedPatient,
          loading: false,
        }));
      } catch (error) {
        console.error('PatientStore: Erro ao arquivar paciente:', error);
        set({
          error: `Erro ao arquivar paciente: ${getErrorMessage(error)}`,
          loading: false,
        });
        throw error;
      }
    },

    /**
     * Define o paciente selecionado
     */
    setSelectedPatient: (patient: Patient | null) => {
      set({ selectedPatient: patient });
    },

    /**
     * Define filtros de busca
     */
    setFilters: (filters: Partial<PatientFilters>) => {
      set(state => ({
        filters: { ...state.filters, ...filters },
      }));
    },

    /**
     * Define o termo de busca
     */
    setSearchTerm: (term: string) => {
      set({ searchTerm: term });
    },

    /**
     * Limpa todos os pacientes do estado
     */
    clearPatients: () => {
      set({
        patients: [],
        selectedPatient: null,
        error: null,
        initialized: false,
        filters: {},
        searchTerm: '',
      });
    },

    /**
     * Define uma mensagem de erro
     */
    setError: (error: string | null) => {
      set({ error });
    },

    /**
     * Define o estado de loading
     */
    setLoading: (loading: boolean) => {
      set({ loading });
    },

    // Getters computados

    /**
     * Retorna pacientes filtrados baseado nos filtros e termo de busca
     */
    getFilteredPatients: () => {
      const { patients, filters, searchTerm } = get();
      return filterPatients(patients, filters, searchTerm);
    },

    /**
     * Busca um paciente por ID no estado atual
     */
    getPatientById: (id: string) => {
      const { patients } = get();
      return patients.find(p => p.id === id);
    },

    /**
     * Retorna apenas pacientes ativos
     */
    getActivePatients: () => {
      const { patients } = get();
      return patients.filter(p => p.status === 'active');
    },

    /**
     * Retorna os pacientes mais recentes
     */
    getRecentPatients: (limit = 5) => {
      const { patients } = get();
      return patients
        .filter(p => p.status === 'active')
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, limit);
    },
  }),
  {
    name: 'patient-store',
  }
);

/**
 * Hook de conveniência que mantém compatibilidade com a API anterior
 */
export const usePatients = () => {
  const store = usePatientStore();

  return {
    patients: store.patients,
    selectedPatient: store.selectedPatient,
    loading: store.loading,
    error: store.error,
    searchTerm: store.searchTerm,
    filters: store.filters,

    // Ações
    fetchPatients: store.fetchPatients,
    fetchPatientById: store.fetchPatientById,
    createPatient: store.createPatient,
    updatePatient: store.updatePatient,
    deletePatient: store.deletePatient,
    setSelectedPatient: store.setSelectedPatient,
    setFilters: store.setFilters,
    setSearchTerm: store.setSearchTerm,

    // Getters
    getFilteredPatients: store.getFilteredPatients,
    getPatientById: store.getPatientById,
    getActivePatients: store.getActivePatients,
    getRecentPatients: store.getRecentPatients,
  };
};
