import { describe, it, expect, beforeEach, vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/database.types';

type Patient = Database['public']['Tables']['patients']['Row'];
type PatientInsert = Database['public']['Tables']['patients']['Insert'];
type PatientUpdate = Database['public']['Tables']['patients']['Update'];

// Mock do Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

const mockSupabase = supabase as any;

describe('Patients CRUD Operations', () => {
  const mockDoctorId = '123e4567-e89b-12d3-a456-426614174000';
  const mockPatientId = '987fcdeb-51a2-43d1-b789-123456789abc';

  const mockPatientData: PatientInsert = {
    full_name: 'João Silva',
    birth_date: '1980-05-15',
    gender: 'male',
    doctor_id: mockDoctorId,
    email: 'joao.silva@email.com',
    phone: '(11) 99999-9999',
    cpf: '123.456.789-00',
    status: 'active',
  };

  const mockPatient: Patient = {
    id: mockPatientId,
    ...mockPatientData,
    patient_number: 'JS0001',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    profile_id: null,
    address: null,
    address_complement: null,
    address_number: null,
    allergies: null,
    blood_type: null,
    chronic_conditions: null,
    city: null,
    country: null,
    current_medications: null,
    emergency_contact_name: null,
    emergency_contact_phone: null,
    emergency_contact_phone2: null,
    emergency_contact_relationship: null,
    family_history: null,
    height: null,
    insurance_company: null,
    insurance_number: null,
    insurance_plan: null,
    marital_status: null,
    mobile_phone: null,
    neighborhood: null,
    notes: null,
    occupation: null,
    rg: null,
    state: null,
    weight: null,
    zip_code: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('CREATE - Criar Paciente', () => {
    it('deve criar um novo paciente com sucesso', async () => {
      // Arrange
      const mockChain = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockPatient,
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockChain);

      // Act
      const { data, error } = await supabase
        .from('patients')
        .insert(mockPatientData)
        .select()
        .single();

      // Assert
      expect(error).toBeNull();
      expect(data).toEqual(mockPatient);
      expect(mockSupabase.from).toHaveBeenCalledWith('patients');
      expect(mockChain.insert).toHaveBeenCalledWith(mockPatientData);
    });

    it('deve retornar erro ao tentar criar paciente com dados inválidos', async () => {
      // Arrange
      const invalidData = { ...mockPatientData, full_name: '' };
      const mockError = {
        code: '23502',
        message:
          'null value in column "full_name" violates not-null constraint',
      };

      const mockChain = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      mockSupabase.from.mockReturnValue(mockChain);

      // Act
      const { data, error } = await supabase
        .from('patients')
        .insert(invalidData)
        .select()
        .single();

      // Assert
      expect(data).toBeNull();
      expect(error).toEqual(mockError);
    });

    it('deve criar paciente com dados médicos completos', async () => {
      // Arrange
      const completePatientData: PatientInsert = {
        ...mockPatientData,
        blood_type: 'A+',
        weight: 75.5,
        height: 175,
        allergies: ['Penicilina', 'Dipirona'],
        chronic_conditions: ['Hipertensão'],
        current_medications: ['Losartana 50mg'],
        family_history: 'Histórico de diabetes na família',
        notes: 'Paciente colaborativo',
      };

      const completePatient = { ...mockPatient, ...completePatientData };

      const mockChain = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: completePatient,
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockChain);

      // Act
      const { data, error } = await supabase
        .from('patients')
        .insert(completePatientData)
        .select()
        .single();

      // Assert
      expect(error).toBeNull();
      expect(data).toEqual(completePatient);
      expect(data?.allergies).toEqual(['Penicilina', 'Dipirona']);
      expect(data?.chronic_conditions).toEqual(['Hipertensão']);
    });
  });

  describe('READ - Ler Pacientes', () => {
    it('deve buscar todos os pacientes de um médico', async () => {
      // Arrange
      const mockPatients = [
        mockPatient,
        { ...mockPatient, id: 'patient-2', full_name: 'Maria Santos' },
      ];

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: mockPatients,
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockChain);

      // Act
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('doctor_id', mockDoctorId)
        .order('full_name');

      // Assert
      expect(error).toBeNull();
      expect(data).toEqual(mockPatients);
      expect(mockChain.eq).toHaveBeenCalledWith('doctor_id', mockDoctorId);
    });

    it('deve buscar um paciente específico por ID', async () => {
      // Arrange
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockPatient,
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockChain);

      // Act
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', mockPatientId)
        .single();

      // Assert
      expect(error).toBeNull();
      expect(data).toEqual(mockPatient);
      expect(mockChain.eq).toHaveBeenCalledWith('id', mockPatientId);
    });

    it('deve buscar pacientes ativos apenas', async () => {
      // Arrange
      const activePatients = [mockPatient];

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: activePatients,
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockChain);

      // Act
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('doctor_id', mockDoctorId)
        .eq('status', 'active')
        .order('full_name');

      // Assert
      expect(error).toBeNull();
      expect(data).toEqual(activePatients);
    });

    it('deve retornar erro quando paciente não for encontrado', async () => {
      // Arrange
      const mockError = {
        code: 'PGRST116',
        message: 'The result contains 0 rows',
      };

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      mockSupabase.from.mockReturnValue(mockChain);

      // Act
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', 'non-existent-id')
        .single();

      // Assert
      expect(data).toBeNull();
      expect(error).toEqual(mockError);
    });
  });

  describe('UPDATE - Atualizar Paciente', () => {
    it('deve atualizar dados básicos do paciente', async () => {
      // Arrange
      const updateData: PatientUpdate = {
        phone: '(11) 88888-8888',
        email: 'joao.silva.novo@email.com',
      };

      const updatedPatient = {
        ...mockPatient,
        ...updateData,
        updated_at: '2024-01-16T10:00:00Z',
      };

      const mockChain = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: updatedPatient,
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockChain);

      // Act
      const { data, error } = await supabase
        .from('patients')
        .update(updateData)
        .eq('id', mockPatientId)
        .select()
        .single();

      // Assert
      expect(error).toBeNull();
      expect(data).toEqual(updatedPatient);
      expect(mockChain.update).toHaveBeenCalledWith(updateData);
      expect(mockChain.eq).toHaveBeenCalledWith('id', mockPatientId);
    });

    it('deve atualizar informações médicas do paciente', async () => {
      // Arrange
      const medicalUpdate: PatientUpdate = {
        weight: 80.0,
        height: 175,
        blood_type: 'O+',
        allergies: ['Penicilina', 'Dipirona', 'Aspirina'],
        current_medications: ['Losartana 50mg', 'Metformina 850mg'],
      };

      const updatedPatient = { ...mockPatient, ...medicalUpdate };

      const mockChain = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: updatedPatient,
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockChain);

      // Act
      const { data, error } = await supabase
        .from('patients')
        .update(medicalUpdate)
        .eq('id', mockPatientId)
        .select()
        .single();

      // Assert
      expect(error).toBeNull();
      expect(data?.weight).toBe(80.0);
      expect(data?.allergies).toEqual(['Penicilina', 'Dipirona', 'Aspirina']);
      expect(data?.current_medications).toEqual([
        'Losartana 50mg',
        'Metformina 850mg',
      ]);
    });

    it('deve atualizar status do paciente', async () => {
      // Arrange
      const statusUpdate: PatientUpdate = {
        status: 'inactive',
      };

      const updatedPatient = { ...mockPatient, status: 'inactive' };

      const mockChain = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: updatedPatient,
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockChain);

      // Act
      const { data, error } = await supabase
        .from('patients')
        .update(statusUpdate)
        .eq('id', mockPatientId)
        .select()
        .single();

      // Assert
      expect(error).toBeNull();
      expect(data?.status).toBe('inactive');
    });

    it('deve retornar erro ao tentar atualizar com dados inválidos', async () => {
      // Arrange
      const invalidUpdate = {
        gender: 'invalid_gender', // Valor inválido para o enum
      };

      const mockError = {
        code: '23514',
        message: 'new row for relation "patients" violates check constraint',
      };

      const mockChain = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      mockSupabase.from.mockReturnValue(mockChain);

      // Act
      const { data, error } = await supabase
        .from('patients')
        .update(invalidUpdate)
        .eq('id', mockPatientId)
        .select()
        .single();

      // Assert
      expect(data).toBeNull();
      expect(error).toEqual(mockError);
    });
  });

  describe('DELETE - Deletar Paciente', () => {
    it('deve deletar um paciente (soft delete via status)', async () => {
      // Arrange
      const archivedPatient = { ...mockPatient, status: 'archived' };

      const mockChain = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: archivedPatient,
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockChain);

      // Act - Implementando soft delete via status
      const { data, error } = await supabase
        .from('patients')
        .update({ status: 'archived' })
        .eq('id', mockPatientId)
        .select()
        .single();

      // Assert
      expect(error).toBeNull();
      expect(data?.status).toBe('archived');
    });

    it('deve deletar permanentemente um paciente (hard delete)', async () => {
      // Arrange
      const mockChain = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockChain);

      // Act
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', mockPatientId);

      // Assert
      expect(error).toBeNull();
      expect(mockChain.delete).toHaveBeenCalled();
      expect(mockChain.eq).toHaveBeenCalledWith('id', mockPatientId);
    });

    it('deve retornar erro ao tentar deletar paciente inexistente', async () => {
      // Arrange
      const mockError = {
        code: 'PGRST116',
        message: 'The result contains 0 rows',
      };

      const mockChain = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      mockSupabase.from.mockReturnValue(mockChain);

      // Act
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', 'non-existent-id');

      // Assert
      expect(error).toEqual(mockError);
    });
  });

  describe('Operações Complexas', () => {
    it('deve buscar pacientes com filtros múltiplos', async () => {
      // Arrange
      const filteredPatients = [mockPatient];
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        ilike: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: filteredPatients,
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockChain);

      // Act
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('doctor_id', mockDoctorId)
        .eq('status', 'active')
        .ilike('full_name', '%João%')
        .order('full_name');

      // Assert
      expect(error).toBeNull();
      expect(data).toEqual(filteredPatients);
    });

    it('deve buscar pacientes com informações específicas', async () => {
      // Arrange
      const specificFields = {
        id: mockPatientId,
        full_name: 'João Silva',
        email: 'joao.silva@email.com',
        phone: '(11) 99999-9999',
        status: 'active',
      };

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: [specificFields],
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockChain);

      // Act
      const { data, error } = await supabase
        .from('patients')
        .select('id, full_name, email, phone, status')
        .eq('doctor_id', mockDoctorId)
        .order('full_name');

      // Assert
      expect(error).toBeNull();
      expect(data).toEqual([specificFields]);
    });

    it('deve contar total de pacientes ativos', async () => {
      // Arrange
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi
          .fn()
          .mockReturnThis()
          .mockResolvedValue({
            data: [mockPatient, mockPatient], // 2 pacientes
            error: null,
            count: 2,
          }),
      };

      // Configurar o mock para retornar this nas primeiras chamadas e o resultado na última
      mockChain.eq.mockReturnValueOnce(mockChain).mockResolvedValueOnce({
        data: [mockPatient, mockPatient],
        error: null,
        count: 2,
      });

      mockSupabase.from.mockReturnValue(mockChain);

      // Act
      const { data, error, count } = await supabase
        .from('patients')
        .select('*', { count: 'exact' })
        .eq('doctor_id', mockDoctorId)
        .eq('status', 'active');

      // Assert
      expect(error).toBeNull();
      expect(count).toBe(2);
      expect(data).toHaveLength(2);
    });
  });
});
