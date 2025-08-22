import jsPDF from 'jspdf';
import { supabase } from '@/integrations/supabase/client';

interface PatientInfo {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  gender?: string;
  medical_record_number?: string;
}

interface ConsultationInfo {
  id: string;
  consultation_date: string;
  consultation_type: string;
  chief_complaint?: string;
  diagnosis?: string;
  treatment_plan?: string;
  notes?: string;
  doctor_name?: string;
  doctor_crm?: string;
}

interface TranscriptionInfo {
  id: string;
  transcript_text: string;
  confidence_score: number;
  language_detected: string;
  word_count: number;
  created_at: string;
}

interface ReportData {
  patient: PatientInfo;
  consultation: ConsultationInfo;
  transcriptions: TranscriptionInfo[];
  summary?: string;
}

export class ReportService {
  private static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private static formatBirthDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  private static calculateAge(birthDate: string): number {
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
  }

  static async generateConsultationReport(
    consultationId: string
  ): Promise<Blob> {
    try {
      // Buscar dados da consulta
      const { data: consultation, error: consultationError } = await supabase
        .from('consultations')
        .select(
          `
          *,
          patients (*),
          users (name, email)
        `
        )
        .eq('id', consultationId)
        .single();

      if (consultationError) throw consultationError;

      // Buscar transcrições da consulta
      const { data: transcriptions, error: transcriptionsError } =
        await supabase
          .from('transcriptions')
          .select('*')
          .eq('consultation_id', consultationId)
          .order('created_at', { ascending: true });

      if (transcriptionsError) throw transcriptionsError;

      const reportData: ReportData = {
        patient: consultation.patients,
        consultation: {
          ...consultation,
          doctor_name: consultation.users?.name,
        },
        transcriptions: transcriptions || [],
      };

      return this.createPDFReport(reportData);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      throw new Error('Falha ao gerar relatório da consulta');
    }
  }

  private static createPDFReport(data: ReportData): Blob {
    const doc = new jsPDF();
    let yPosition = 20;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    // Configurar fonte padrão
    doc.setFont('helvetica');

    // Cabeçalho
    doc.setFontSize(20);
    doc.setTextColor(41, 128, 185); // Azul
    doc.text('RELATÓRIO MÉDICO', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('MedAssist - Sistema de Gestão Médica', pageWidth / 2, yPosition, {
      align: 'center',
    });
    yPosition += 20;

    // Linha separadora
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;

    // Informações do Paciente
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('DADOS DO PACIENTE', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);

    const patientInfo = [
      `Nome: ${data.patient.name}`,
      `Email: ${data.patient.email || 'Não informado'}`,
      `Telefone: ${data.patient.phone || 'Não informado'}`,
    ];

    if (data.patient.birth_date) {
      const age = this.calculateAge(data.patient.birth_date);
      patientInfo.push(
        `Data de Nascimento: ${this.formatBirthDate(data.patient.birth_date)} (${age} anos)`
      );
    }

    if (data.patient.gender) {
      patientInfo.push(`Gênero: ${data.patient.gender}`);
    }

    if (data.patient.medical_record_number) {
      patientInfo.push(`Prontuário: ${data.patient.medical_record_number}`);
    }

    patientInfo.forEach(info => {
      doc.text(info, margin, yPosition);
      yPosition += 6;
    });

    yPosition += 10;

    // Informações da Consulta
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('DADOS DA CONSULTA', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);

    const consultationInfo = [
      `Data: ${this.formatDate(data.consultation.consultation_date)}`,
      `Tipo: ${data.consultation.consultation_type}`,
      `Médico: ${data.consultation.doctor_name || 'Não informado'}`,
    ];

    if (data.consultation.chief_complaint) {
      consultationInfo.push(
        `Queixa Principal: ${data.consultation.chief_complaint}`
      );
    }

    consultationInfo.forEach(info => {
      doc.text(info, margin, yPosition);
      yPosition += 6;
    });

    yPosition += 15;

    // Transcrições
    if (data.transcriptions.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('TRANSCRIÇÕES', margin, yPosition);
      yPosition += 10;

      data.transcriptions.forEach((transcription, index) => {
        // Verificar se precisa de nova página
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(12);
        doc.setTextColor(41, 128, 185);
        doc.text(`Transcrição ${index + 1}`, margin, yPosition);
        yPosition += 8;

        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Data: ${this.formatDate(transcription.created_at)} | Confiança: ${(transcription.confidence_score * 100).toFixed(1)}% | Palavras: ${transcription.word_count}`,
          margin,
          yPosition
        );
        yPosition += 10;

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);

        // Quebrar texto em linhas
        const lines = doc.splitTextToSize(
          transcription.transcript_text,
          contentWidth
        );
        lines.forEach((line: string) => {
          if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, margin, yPosition);
          yPosition += 5;
        });

        yPosition += 10;
      });
    }

    // Diagnóstico e Plano de Tratamento
    if (data.consultation.diagnosis || data.consultation.treatment_plan) {
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('DIAGNÓSTICO E TRATAMENTO', margin, yPosition);
      yPosition += 10;

      if (data.consultation.diagnosis) {
        doc.setFontSize(12);
        doc.setTextColor(41, 128, 185);
        doc.text('Diagnóstico:', margin, yPosition);
        yPosition += 8;

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const diagnosisLines = doc.splitTextToSize(
          data.consultation.diagnosis,
          contentWidth
        );
        diagnosisLines.forEach((line: string) => {
          doc.text(line, margin, yPosition);
          yPosition += 5;
        });
        yPosition += 8;
      }

      if (data.consultation.treatment_plan) {
        doc.setFontSize(12);
        doc.setTextColor(41, 128, 185);
        doc.text('Plano de Tratamento:', margin, yPosition);
        yPosition += 8;

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const treatmentLines = doc.splitTextToSize(
          data.consultation.treatment_plan,
          contentWidth
        );
        treatmentLines.forEach((line: string) => {
          doc.text(line, margin, yPosition);
          yPosition += 5;
        });
      }
    }

    // Observações
    if (data.consultation.notes) {
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('OBSERVAÇÕES', margin, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const notesLines = doc.splitTextToSize(
        data.consultation.notes,
        contentWidth
      );
      notesLines.forEach((line: string) => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, margin, yPosition);
        yPosition += 5;
      });
    }

    // Rodapé
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Relatório gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')} - Página ${i} de ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    return doc.output('blob');
  }

  static async saveReportToStorage(
    consultationId: string,
    reportBlob: Blob
  ): Promise<string> {
    try {
      const fileName = `relatorio_consulta_${consultationId}_${Date.now()}.pdf`;

      const { data, error } = await supabase.storage
        .from('reports')
        .upload(fileName, reportBlob, {
          contentType: 'application/pdf',
        });

      if (error) throw error;

      // Salvar referência no banco de dados
      await supabase.from('consultation_reports').insert({
        consultation_id: consultationId,
        file_name: fileName,
        file_path: data.path,
        report_type: 'consultation_summary',
        generated_at: new Date().toISOString(),
      });

      return data.path;
    } catch (error) {
      console.error('Erro ao salvar relatório:', error);
      throw new Error('Falha ao salvar relatório no armazenamento');
    }
  }

  static async downloadReport(filePath: string): Promise<Blob> {
    try {
      const { data, error } = await supabase.storage
        .from('reports')
        .download(filePath);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao baixar relatório:', error);
      throw new Error('Falha ao baixar relatório');
    }
  }

  static async getConsultationReports(consultationId: string) {
    try {
      const { data, error } = await supabase
        .from('consultation_reports')
        .select('*')
        .eq('consultation_id', consultationId)
        .order('generated_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar relatórios:', error);
      throw new Error('Falha ao buscar relatórios da consulta');
    }
  }
}

export default ReportService;
