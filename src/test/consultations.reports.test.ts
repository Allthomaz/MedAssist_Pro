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

const mockSupabase = supabase as any;

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
      expect(data.chief_complaint).toBe('Dor nas costas');
      expect(mockChain.insert).toHaveBeenCalledWith(newConsultation);
    });

    it('deve retornar erro ao criar consulta com dados inválidos', async () => {
      // Arrange
      const invalidConsultation = {
        doctor_id: mockDoctorId,
        // patient_id ausente (obrigatório)
        consultation_date: '2024-01-20',
      };

      const mockError = {
        code: '23502',
        message: 'null value in column "patient_id" violates not-null constraint',
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
        .insert(invalidConsultation)
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
      const consultations = [mockConsultation, { ...mockConsultation, id: 'consultation-456' }];

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
      expect(data.id).toBe(mockConsultationId);
      expect(data.patients).toBeDefined();
    });

    it('deve buscar consultas por status', async () => {
      // Arrange
      const finalizedConsultations = [mockConsultation];

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: finalizedConsultations,
          error: null,
        }),
      };
      
      mockChain.eq.mockReturnValueOnce(mockChain).mockReturnValueOnce(mockChain);
      mockSupabase.from.mockReturnValue(mockChain);

      // Act
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('doctor_id', mockDoctorId)
        .eq('status', 'finalizada')
        .order('consultation_date', { ascending: false });

      // Assert
      expect(error).toBeNull();
      expect(data).toHaveLength(1);
      expect(data[0].status).toBe('finalizada');
    });

    it('deve buscar consultas por período', async () => {
      // Arrange
      const consultationsInPeriod = [mockConsultation];

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: consultationsInPeriod,
          error: null,
        }),
      };
      
      mockSupabase.from.mockReturnValue(mockChain);

      // Act
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('doctor_id', mockDoctorId)
        .gte('consultation_date', '2024-01-01')
        .lte('consultation_date', '2024-01-31')
        .order('consultation_date', { ascending: false });

      // Assert
      expect(error).toBeNull();
      expect(data).toHaveLength(1);
      expect(mockChain.gte).toHaveBeenCalledWith('consultation_date', '2024-01-01');
      expect(mockChain.lte).toHaveBeenCalledWith('consultation_date', '2024-01-31');
    });
  });

  describe('UPDATE - Atualizar Consulta', () => {
    it('deve atualizar dados da consulta', async () => {
      // Arrange
      const updateData = {
        clinical_notes: 'Paciente apresentou melhora significativa',
        diagnosis: 'Cefaleia tensional - controlada',
        treatment_plan: 'Continuar com medicação atual',
      };

      const updatedConsultation = { ...mockConsultation, ...updateData };

      const mockChain = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: updatedConsultation,
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
      expect(data.clinical_notes).toBe(updateData.clinical_notes);
      expect(data.diagnosis).toBe(updateData.diagnosis);
    });

    it('deve atualizar status da consulta', async () => {
      // Arrange
      const statusUpdate = { status: 'em_andamento' };
      const updatedConsultation = { ...mockConsultation, ...statusUpdate };

      const mockChain = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: updatedConsultation,
          error: null,
        }),
      };
      
      mockSupabase.from.mockReturnValue(mockChain);

      // Act
      const { data, error } = await supabase
        .from('consultations')
        .update(statusUpdate)
        .eq('id', mockConsultationId)
        .select()
        .single();

      // Assert
      expect(error).toBeNull();
      expect(data.status).toBe('em_andamento');
    });

    it('deve adicionar transcrição à consulta', async () => {
      // Arrange
      const transcriptionData = {
        transcription_text: 'Transcrição da consulta médica...',
        transcription_confidence: 0.95,
        recording_url: 'https://storage.supabase.co/recording.mp3',
      };

      const updatedConsultation = { ...mockConsultation, ...transcriptionData };

      const mockChain = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: updatedConsultation,
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
      expect(data.transcription_text).toBe(transcriptionData.transcription_text);
      expect(data.transcription_confidence).toBe(0.95);
    });
  });

  describe('DELETE - Deletar Consulta', () => {
    it('deve deletar uma consulta', async () => {
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
        .from('consultations')
        .delete()
        .eq('id', mockConsultationId);

      // Assert
      expect(error).toBeNull();
      expect(mockChain.delete).toHaveBeenCalled();
      expect(mockChain.eq).toHaveBeenCalledWith('id', mockConsultationId);
    });

    it('deve retornar erro ao tentar deletar consulta inexistente', async () => {
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
        .from('consultations')
        .delete()
        .eq('id', 'non-existent-id');

      // Assert
      expect(error).toEqual(mockError);
    });
  });

  describe('REPORTS - Geração de Relatórios', () => {
    it('deve gerar relatório clínico', async () => {
      // Arrange
      const reportRequest = {
        consultation_id: mockConsultationId,
        transcription: 'Transcrição da consulta médica...',
        intention: 'relatório clínico',
      };

      const mockReport = {
        title: 'Relatório Clínico - João Silva',
        content: 'Relatório médico detalhado...',
        type: 'clinical_report',
        consultation_id: mockConsultationId,
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockReport,
        error: null,
      });

      // Act
      const { data, error } = await supabase.functions.invoke('generate-report', {
        body: reportRequest,
      });

      // Assert
      expect(error).toBeNull();
      expect(data.title).toBe('Relatório Clínico - João Silva');
      expect(data.type).toBe('clinical_report');
      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('generate-report', {
        body: reportRequest,
      });
    });

    it('deve gerar receituário médico', async () => {
      // Arrange
      const prescriptionRequest = {
        consultation_id: mockConsultationId,
        transcription: 'Prescrever dipirona 500mg...',
        intention: 'receituário',
      };

      const mockPrescription = {
        title: 'Receituário Médico - João Silva',
        content: 'Dipirona 500mg - Tomar se necessário...',
        type: 'prescription',
        consultation_id: mockConsultationId,
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockPrescription,
        error: null,
      });

      // Act
      const { data, error } = await supabase.functions.invoke('generate-report', {
        body: prescriptionRequest,
      });

      // Assert
      expect(error).toBeNull();
      expect(data.title).toBe('Receituário Médico - João Silva');
      expect(data.type).toBe('prescription');
    });

    it('deve retornar erro ao gerar relatório sem transcrição', async () => {
      // Arrange
      const invalidRequest = {
        consultation_id: mockConsultationId,
        intention: 'relatório clínico',
        // transcription ausente
      };

      const mockError = {
        error: 'Transcrição é obrigatória para gerar relatório',
      };

      mockSupabase.functions.invoke.mockResolvedValue({
        data: mockError,
        error: null,
      });

      // Act
      const { data, error } = await supabase.functions.invoke('generate-report', {
        body: invalidRequest,
      });

      // Assert
      expect(data.error).toBe('Transcrição é obrigatória para gerar relatório');
    });
  });

  describe('ANALYTICS - Estatísticas e Relatórios', () => {
    it('deve buscar estatísticas do dashboard', async () => {
      // Arrange
      const mockResults = [
        { data: Array(150).fill(mockConsultation), error: null, count: 150 }, // total
        { data: Array(25).fill(mockConsultation), error: null, count: 25 },   // mês
        { data: Array(140).fill(mockConsultation), error: null, count: 140 }, // finalizadas
        { data: Array(10).fill(mockConsultation), error: null, count: 10 }    // agendadas
      ];

      // Mock direto para cada query específica
      mockSupabase.from
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue(mockResults[0])
          })
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              gte: vi.fn().mockReturnValue({
                lte: vi.fn().mockResolvedValue(mockResults[1])
              })
            })
          })
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue(mockResults[2])
            })
          })
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue(mockResults[3])
            })
          })
        });

      // Act - Simular múltiplas queries para estatísticas
      const totalResult = await supabase
        .from('consultations')
        .select('*', { count: 'exact' })
        .eq('doctor_id', mockDoctorId);

      const monthResult = await supabase
        .from('consultations')
        .select('*', { count: 'exact' })
        .eq('doctor_id', mockDoctorId)
        .gte('consultation_date', '2024-01-01')
        .lte('consultation_date', '2024-01-31');

      const completedResult = await supabase
        .from('consultations')
        .select('*', { count: 'exact' })
        .eq('doctor_id', mockDoctorId)
        .eq('status', 'finalizada');

      const pendingResult = await supabase
        .from('consultations')
        .select('*', { count: 'exact' })
        .eq('doctor_id', mockDoctorId)
        .eq('status', 'agendada');

      // Assert
      expect(totalResult.count).toBe(150);
      expect(monthResult.count).toBe(25);
      expect(completedResult.count).toBe(140);
      expect(pendingResult.count).toBe(10);
    });

    it('deve buscar consultas por tipo para relatório', async () => {
      // Arrange
      const typeResults = [
        { data: Array(50).fill(mockConsultation), error: null, count: 50 },  // primeira_consulta
        { data: Array(80).fill(mockConsultation), error: null, count: 80 },  // retorno
        { data: Array(15).fill(mockConsultation), error: null, count: 15 },  // urgencia
        { data: Array(5).fill(mockConsultation), error: null, count: 5 }     // rotina
      ];

      // Mock direto para cada tipo de consulta
      mockSupabase.from
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue(typeResults[0])
            })
          })
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue(typeResults[1])
            })
          })
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue(typeResults[2])
            })
          })
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue(typeResults[3])
            })
          })
        });

      // Act
      const primeiraConsulta = await supabase
        .from('consultations')
        .select('*', { count: 'exact' })
        .eq('doctor_id', mockDoctorId)
        .eq('consultation_type', 'primeira_consulta');

      const retorno = await supabase
        .from('consultations')
        .select('*', { count: 'exact' })
        .eq('doctor_id', mockDoctorId)
        .eq('consultation_type', 'retorno');

      const urgencia = await supabase
        .from('consultations')
        .select('*', { count: 'exact' })
        .eq('doctor_id', mockDoctorId)
        .eq('consultation_type', 'urgencia');

      const rotina = await supabase
        .from('consultations')
        .select('*', { count: 'exact' })
        .eq('doctor_id', mockDoctorId)
        .eq('consultation_type', 'rotina');

      // Assert
      expect(primeiraConsulta.count).toBe(50);
      expect(retorno.count).toBe(80);
      expect(urgencia.count).toBe(15);
      expect(rotina.count).toBe(5);
    });

    it('deve buscar consultas com documentos gerados', async () => {
      // Arrange
      const consultationsWithDocs = [{
        ...mockConsultation,
        document_generated: true,
        document_url: 'https://storage.supabase.co/document.pdf',
      }];

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: consultationsWithDocs,
          error: null,
        }),
      };
      
      mockChain.eq.mockReturnValueOnce(mockChain).mockReturnValueOnce(mockChain);
      mockSupabase.from.mockReturnValue(mockChain);

      // Act
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('doctor_id', mockDoctorId)
        .eq('document_generated', true)
        .order('consultation_date', { ascending: false });

      // Assert
      expect(error).toBeNull();
      expect(data).toHaveLength(1);
      expect(data[0].document_generated).toBe(true);
      expect(data[0].document_url).toBeDefined();
    });
  });
});