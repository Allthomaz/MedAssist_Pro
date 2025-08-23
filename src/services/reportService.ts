import jsPDF from 'jspdf';
import { supabase } from '@/integrations/supabase/client';

/**
 * Informações básicas do paciente para geração de relatórios
 * @interface PatientInfo
 */
interface PatientInfo {
  /** ID único do paciente */
  id: string;
  /** Nome completo do paciente */
  name: string;
  /** Email do paciente (opcional) */
  email?: string;
  /** Telefone do paciente (opcional) */
  phone?: string;
  /** Data de nascimento no formato ISO (opcional) */
  birth_date?: string;
  /** Gênero do paciente (opcional) */
  gender?: string;
  /** Número do prontuário médico (opcional) */
  medical_record_number?: string;
}

/**
 * Informações da consulta médica para relatórios
 * @interface ConsultationInfo
 */
interface ConsultationInfo {
  /** ID único da consulta */
  id: string;
  /** Data e hora da consulta no formato ISO */
  consultation_date: string;
  /** Tipo de consulta (ex: primeira_consulta, retorno, emergencia) */
  consultation_type: string;
  /** Queixa principal do paciente (opcional) */
  chief_complaint?: string;
  /** Diagnóstico médico (opcional) */
  diagnosis?: string;
  /** Plano de tratamento prescrito (opcional) */
  treatment_plan?: string;
  /** Observações adicionais (opcional) */
  notes?: string;
  /** Nome do médico responsável (opcional) */
  doctor_name?: string;
  /** CRM do médico (opcional) */
  doctor_crm?: string;
}

/**
 * Dados de transcrição de áudio médico
 * @interface TranscriptionInfo
 */
interface TranscriptionInfo {
  /** ID único da transcrição */
  id: string;
  /** Texto transcrito do áudio */
  transcript_text: string;
  /** Score de confiança da transcrição (0-1) */
  confidence_score: number;
  /** Idioma detectado na transcrição */
  language_detected: string;
  /** Número total de palavras transcritas */
  word_count: number;
  /** Data de criação da transcrição no formato ISO */
  created_at: string;
}

/**
 * Estrutura completa de dados para geração de relatório médico
 * @interface ReportData
 */
interface ReportData {
  /** Informações do paciente */
  patient: PatientInfo;
  /** Informações da consulta */
  consultation: ConsultationInfo;
  /** Lista de transcrições associadas */
  transcriptions: TranscriptionInfo[];
  /** Resumo opcional da consulta */
  summary?: string;
}

/**
 * Serviço para geração e gerenciamento de relatórios médicos em PDF
 *
 * Este serviço oferece funcionalidades completas para:
 * - Geração de relatórios de consulta em formato PDF
 * - Armazenamento seguro no Supabase Storage
 * - Download e recuperação de relatórios
 * - Formatação profissional com dados do paciente, consulta e transcrições
 *
 * @class ReportService
 * @example
 * ```typescript
 * // Gerar relatório de consulta
 * const reportBlob = await ReportService.generateConsultationReport(consultationId);
 *
 * // Salvar no storage
 * const filePath = await ReportService.saveReportToStorage(consultationId, reportBlob);
 *
 * // Baixar relatório
 * const reportData = await ReportService.downloadReport(filePath);
 * ```
 */
export class ReportService {
  /**
   * Formata uma data ISO para o padrão brasileiro com hora
   * @private
   * @param {string} dateString - Data no formato ISO
   * @returns {string} Data formatada (dd/mm/aaaa hh:mm)
   */
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

  /**
   * Formata uma data de nascimento para o padrão brasileiro
   * @private
   * @param {string} dateString - Data no formato ISO
   * @returns {string} Data formatada (dd/mm/aaaa)
   */
  private static formatBirthDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  /**
   * Calcula a idade em anos com base na data de nascimento
   * @private
   * @param {string} birthDate - Data de nascimento no formato ISO
   * @returns {number} Idade em anos completos
   */
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

  /**
   * Gera um relatório completo de consulta médica em formato PDF
   *
   * Busca todos os dados relacionados à consulta (paciente, médico, transcrições)
   * e gera um PDF profissionalmente formatado com:
   * - Cabeçalho com informações do sistema
   * - Dados completos do paciente (incluindo idade calculada)
   * - Informações da consulta e médico responsável
   * - Transcrições de áudio com timestamps e scores de confiança
   * - Diagnóstico e plano de tratamento
   * - Observações médicas
   * - Rodapé com data/hora de geração e numeração de páginas
   *
   * @param {string} consultationId - ID único da consulta
   * @returns {Promise<Blob>} Promise que resolve com o PDF gerado como Blob
   * @throws {Error} Quando há falha na busca de dados ou geração do PDF
   *
   * @example
   * ```typescript
   * try {
   *   const reportBlob = await ReportService.generateConsultationReport('123e4567-e89b-12d3-a456-426614174000');
   *   // Usar o blob para download ou armazenamento
   * } catch (error) {
   *   console.error('Erro ao gerar relatório:', error);
   * }
   * ```
   */
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

  /**
   * Cria um documento PDF estruturado com os dados da consulta
   *
   * Esta função implementa um algoritmo complexo de formatação que:
   * - Gerencia quebras de página automáticas baseadas na posição Y
   * - Aplica formatação consistente (fontes, cores, espaçamentos)
   * - Estrutura o conteúdo em seções bem definidas
   * - Adiciona rodapé com numeração de páginas
   *
   * @private
   * @param {ReportData} data - Dados completos da consulta para o relatório
   * @returns {Blob} Arquivo PDF como Blob pronto para download/armazenamento
   */
  private static createPDFReport(data: ReportData): Blob {
    const doc = new jsPDF();
    let yPosition = 20;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    // Configuração inicial da fonte padrão para todo o documento
    doc.setFont('helvetica');

    // Cabeçalho principal do documento com formatação destacada
    doc.setFontSize(20);
    doc.setTextColor(41, 128, 185); // Azul institucional
    doc.text('RELATÓRIO MÉDICO', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Subtítulo com identificação do sistema
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('MedAssist - Sistema de Gestão Médica', pageWidth / 2, yPosition, {
      align: 'center',
    });
    yPosition += 20;

    // Linha separadora visual para delimitar o cabeçalho
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

    // Seção de transcrições com controle inteligente de quebra de página
    if (data.transcriptions.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('TRANSCRIÇÕES', margin, yPosition);
      yPosition += 10;

      // Processa cada transcrição individualmente com algoritmo de paginação
      data.transcriptions.forEach((transcription, index) => {
        // Quebra de página preventiva para evitar títulos órfãos
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        // Cabeçalho da transcrição com numeração sequencial
        doc.setFontSize(12);
        doc.setTextColor(41, 128, 185);
        doc.text(`Transcrição ${index + 1}`, margin, yPosition);
        yPosition += 8;

        // Metadados da transcrição (timestamp, confiança, contagem de palavras)
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

        // Algoritmo de quebra automática de texto longo em múltiplas linhas
        const lines = doc.splitTextToSize(
          transcription.transcript_text,
          contentWidth
        );

        // Renderiza cada linha com controle rigoroso de quebra de página
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

    // Adiciona rodapé padronizado em todas as páginas do documento
    // Este loop itera por todas as páginas criadas durante o processo de formatação
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i); // Navega para a página específica
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150); // Cor cinza clara para o rodapé

      // Rodapé centralizado com timestamp de geração e numeração sequencial
      doc.text(
        `Relatório gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')} - Página ${i} de ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    // Retorna o PDF finalizado como Blob para download ou armazenamento
    return doc.output('blob');
  }

  /**
   * Salva o relatório PDF no Supabase Storage e registra no banco de dados
   *
   * Realiza duas operações:
   * 1. Upload do arquivo PDF para o bucket 'reports'
   * 2. Registro da referência na tabela 'consultation_reports'
   *
   * O nome do arquivo é gerado automaticamente com timestamp para evitar conflitos.
   *
   * @param {string} consultationId - ID da consulta associada
   * @param {Blob} reportBlob - Arquivo PDF como Blob
   * @returns {Promise<string>} Promise que resolve com o caminho do arquivo no storage
   * @throws {Error} Quando há falha no upload ou registro no banco
   *
   * @example
   * ```typescript
   * const reportBlob = await ReportService.generateConsultationReport(consultationId);
   * const filePath = await ReportService.saveReportToStorage(consultationId, reportBlob);
   * console.log('Relatório salvo em:', filePath);
   * ```
   */
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

  /**
   * Baixa um relatório do Supabase Storage
   *
   * @param {string} filePath - Caminho do arquivo no storage
   * @returns {Promise<Blob>} Promise que resolve com o arquivo PDF como Blob
   * @throws {Error} Quando o arquivo não é encontrado ou há falha no download
   *
   * @example
   * ```typescript
   * try {
   *   const reportBlob = await ReportService.downloadReport('relatorio_consulta_123_1640995200000.pdf');
   *   // Criar URL para download no navegador
   *   const url = URL.createObjectURL(reportBlob);
   *   window.open(url);
   * } catch (error) {
   *   console.error('Erro ao baixar relatório:', error);
   * }
   * ```
   */
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

  /**
   * Busca todos os relatórios gerados para uma consulta específica
   *
   * Retorna uma lista ordenada por data de geração (mais recentes primeiro)
   * com metadados completos de cada relatório.
   *
   * @param {string} consultationId - ID da consulta
   * @returns {Promise<Array>} Promise que resolve com array de relatórios
   * @throws {Error} Quando há falha na consulta ao banco de dados
   *
   * @example
   * ```typescript
   * const reports = await ReportService.getConsultationReports(consultationId);
   * reports.forEach(report => {
   *   console.log(`Relatório: ${report.file_name}, gerado em: ${report.generated_at}`);
   * });
   * ```
   */
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
