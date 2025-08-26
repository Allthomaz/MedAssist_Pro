import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

// Mock do Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    functions: {
      invoke: vi.fn(),
    },
    storage: {
      from: vi.fn(),
    },
  },
}));

const mockSupabase = supabase as unknown as {
  from: ReturnType<typeof vi.fn>;
  functions: { invoke: ReturnType<typeof vi.fn> };
  storage: { from: ReturnType<typeof vi.fn> };
};

describe('Consultations and Reports Integration Tests', () => {
  const mockDoctorId = 'ef14284c-594f-40d4-92ac-8f83f8f83ce3';
  const mockPatientId = 'patient-123';
  const mockConsultationId = 'consultation-123';

  const mockConsultation = {
    id: mockConsultationId,
    doctor_id: mockDoctorId,
    patient_id: mockPatientId,
    consultation_number: 'CONS25000001',
    consultation_date: '2024-01-15',
    consultation_time: '09:00:00',
    scheduled_duration: 30,
    actual_duration: 35,
    consultation_type: 'primeira_consulta',
    consultation_mode: 'presencial',
    status: 'finalizada',
    chief_complaint: 'Dor de cabeça frequente',
    consultation_reason: 'Consulta de rotina',
    clinical_notes: 'Paciente relatou cefaleia e tontura',
    diagnosis: 'Cefaleia tensional',
    treatment_plan: 'Repouso, hidratação adequada',
    prescriptions: 'Dipirona 500mg se necessário',
    follow_up_date: '2024-02-15',
    recording_url: null,
    transcription_text: null,
    transcription_confidence: null,
    document_generated: false,
    document_url: null,
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2024-01-15T09:35:00Z',
  };

  const mockPatient = {
    id: mockPatientId,
    full_name: 'João Silva',
    patient_number: 'P001',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('CREATE - Criar Consulta', () => {
    it('deve criar uma nova consulta', async () => {
      // Arrange
      const newConsultation = {
        doctor_id: mockDoctorId,
        patient_id: mockPatientId,
        consultation_date: '2024-01-20',
        consultation_time: '14:00:00',
        consultation_type: 'retorno',
        consultation_mode: 'presencial',
        chief_complaint: 'Dor nas costas',
      };

      const mockChain = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { ...mockConsultation, ...newConsultation },
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockChain);

      // Act
      const { data, error } = await supabase
        .from('consultations')
        .insert(newConsultation)
        .select()
        .single();

      // Assert
      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.chief_complaint).toBe('Dor nas costas');
      expect(mockChain.insert).toHaveBeenCalledWith(newConsultation);
    });

    it('deve retornar erro ao criar consulta com dados inválidos', async () => {
      // Arrange
      const mockError = {
        code: '23502',
        message:
          'null value in column "patient_id" violates not-null constraint',
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
        .from('consultations')
        .insert({
          doctor_id: mockDoctorId,
          consultation_date: '2024-01-20',
          consultation_time: '14:00:00',
          consultation_type: 'retorno',
          patient_id: null, // Intentionally undefined to trigger error
        })
        .select()
        .single();

      // Assert
      expect(data).toBeNull();
      expect(error).toEqual(mockError);
    });
  });

  describe('READ - Buscar Consultas', () => {
    it('deve buscar todas as consultas de um médico', async () => {
      // Arrange
      const consultations = [
        mockConsultation,
        { ...mockConsultation, id: 'consultation-456' },
      ];

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: consultations,
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockChain);

      // Act
      const { data, error } = await supabase
        .from('consultations')
        .select('*, patients(id, full_name, patient_number)')
        .eq('doctor_id', mockDoctorId)
        .order('consultation_date', { ascending: false });

      // Assert
      expect(error).toBeNull();
      expect(data).toHaveLength(2);
      expect(mockChain.eq).toHaveBeenCalledWith('doctor_id', mockDoctorId);
    });

    it('deve buscar consulta por ID', async () => {
      // Arrange
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { ...mockConsultation, patients: mockPatient },
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockChain);

      // Act
      const { data, error } = await supabase
        .from('consultations')
        .select('*, patients(id, full_name, patient_number)')
        .eq('id', mockConsultationId)
        .single();

      // Assert
      expect(error).toBeNull();
      expect(data?.id).toBe(mockConsultationId);
      expect(data?.patients).toBeDefined();
    });

    it('deve buscar consultas por status', async () => {
      // Arrange
      const consultations = [
        { ...mockConsultation, status: 'finalizada' },
        { ...mockConsultation, id: 'consultation-789', status: 'finalizada' },
      ];

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: consultations,
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockChain);

      // Act
      const { data, error } = await supabase
        .from('consultations')
        .select('*, patients(id, full_name, patient_number)')
        .eq('status', 'finalizada')
        .order('consultation_date', { ascending: false });

      // Assert
      expect(error).toBeNull();
      expect(data).toHaveLength(2);
      expect(data?.[0]?.status).toBe('finalizada');
    });
  });

  describe('UPDATE - Atualizar Consulta', () => {
    it('deve atualizar uma consulta existente', async () => {
      // Arrange
      const updateData = {
        clinical_notes: 'Paciente melhor, sem queixas.',
        diagnosis: 'Cefaleia tensional resolvida',
      };

      const mockChain = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { ...mockConsultation, ...updateData },
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockChain);

      // Act
      const { data, error } = await supabase
        .from('consultations')
        .update(updateData)
        .eq('id', mockConsultationId)
        .select()
        .single();

      // Assert
      expect(error).toBeNull();
      expect(data?.clinical_notes).toBe(updateData.clinical_notes);
      expect(data?.diagnosis).toBe(updateData.diagnosis);
    });

    it('deve atualizar o status da consulta', async () => {
      // Arrange
      const updateData = { status: 'em_andamento' };

      const mockChain = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { ...mockConsultation, ...updateData },
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockChain);

      // Act
      const { data, error } = await supabase
        .from('consultations')
        .update(updateData)
        .eq('id', mockConsultationId)
        .select()
        .single();

      // Assert
      expect(error).toBeNull();
      expect(data?.status).toBe('em_andamento');
    });

    it('deve atualizar a transcrição da consulta', async () => {
      // Arrange
      const transcriptionData = {
        transcription_text: 'Isso é uma transcrição de teste.',
        transcription_confidence: 0.95,
      };

      const mockChain = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { ...mockConsultation, ...transcriptionData },
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockChain);

      // Act
      const { data, error } = await supabase
        .from('consultations')
        .update(transcriptionData)
        .eq('id', mockConsultationId)
        .select()
        .single();

      // Assert
      expect(error).toBeNull();
      expect(data?.transcription_text).toBe(
        transcriptionData.transcription_text
      );
      expect(data?.transcription_confidence).toBe(0.95);
    });
  });

  describe('DELETE - Deletar Consulta', () => {
    it('deve deletar uma consulta', async () => {
      // Arrange
      const mockChain = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      };

      mockSupabase.from.mockReturnValue(mockChain);

      // Act
      const { error } = await supabase
        .from('consultations')
        .delete()
        .eq('id', mockConsultationId);

      // Assert
      expect(error).toBeNull();
      expect(mockChain.delete).toHaveBeenCalled();
      expect(mockChain.eq).toHaveBeenCalledWith('id', mockConsultationId);
    });
  });

  describe('RPC - Funções de Relatórios', () => {
    it('deve invocar a função rpc para obter o relatório de consultas', async () => {
      // Arrange
      const mockReport = [
        { month: 'Jan', count: 10 },
        { month: 'Feb', count: 12 },
      ];

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockReport,
        error: null,
      });

      // Act
      const { data, error } = await supabase.functions.invoke(
        'get_consultations_report',
        {
          body: { doctor_id: mockDoctorId, year: 2024 },
        }
      );

      // Assert
      expect(error).toBeNull();
      expect(data).toEqual(mockReport);
      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith(
        'get_consultations_report',
        {
          body: { doctor_id: mockDoctorId, year: 2024 },
        }
      );
    });
  });

  describe('Storage - Manipulação de Documentos', () => {
    it('deve fazer upload de um documento', async () => {
      // Arrange
      const mockFile = new File(['conteúdo do documento'], 'documento.pdf', {
        type: 'application/pdf',
      });
      const mockFilePath = `${mockDoctorId}/${mockConsultationId}/documento.pdf`;
      // const mockPublicUrl = `http://localhost:54321/storage/v1/object/public/documents/${mockFilePath}`;

      const mockUploadChain = {
        upload: vi.fn().mockResolvedValue({
          data: { path: mockFilePath },
          error: null,
        }),
      };

      mockSupabase.storage.from.mockReturnValue(mockUploadChain);

      // Act
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(mockFilePath, mockFile);

      // Assert
      expect(error).toBeNull();
      expect(data?.path).toBe(mockFilePath);
      expect(mockUploadChain.upload).toHaveBeenCalledWith(
        mockFilePath,
        mockFile
      );
    });

    it('deve obter uma URL de documento assinado', async () => {
      // Arrange
      const mockFilePath = `${mockDoctorId}/${mockConsultationId}/documento.pdf`;
      const mockSignedUrl = `http://localhost:54321/storage/v1/object/signed/documents/${mockFilePath}?token=mock_token`;

      const mockSignedUrlChain = {
        createSignedUrl: vi.fn().mockResolvedValue({
          data: { signedUrl: mockSignedUrl },
          error: null,
        }),
      };

      mockSupabase.storage.from.mockReturnValue(mockSignedUrlChain);

      // Act
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(mockFilePath, 60);

      // Assert
      expect(error).toBeNull();
      expect(data?.signedUrl).toBe(mockSignedUrl);
      expect(mockSignedUrlChain.createSignedUrl).toHaveBeenCalledWith(
        mockFilePath,
        60
      );
    });

    it('deve remover um documento', async () => {
      // Arrange
      const mockFilePath = `${mockDoctorId}/${mockConsultationId}/documento.pdf`;

      const mockRemoveChain = {
        remove: vi.fn().mockResolvedValue({
          data: [{ path: mockFilePath }],
          error: null,
        }),
      };

      mockSupabase.storage.from.mockReturnValue(mockRemoveChain);

      // Act
      const { data, error } = await supabase.storage
        .from('documents')
        .remove([mockFilePath]);

      // Assert
      expect(error).toBeNull();
      expect(data?.[0]?.path).toBe(mockFilePath);
      expect(mockRemoveChain.remove).toHaveBeenCalledWith([mockFilePath]);
    });
  });
});
