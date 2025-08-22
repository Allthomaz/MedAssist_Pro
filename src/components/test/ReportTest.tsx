import React, { useState } from 'react';
import { FileText, Download, Loader2, AlertCircle, CheckCircle, User, Calendar, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReportService } from '@/services/reportService';
import { supabase } from '@/integrations/supabase/client';

interface MockPatient {
  id: string;
  name: string;
  email: string;
  phone: string;
  birth_date: string;
  gender: string;
  medical_record_number: string;
}

interface MockConsultation {
  id: string;
  consultation_date: string;
  consultation_type: string;
  chief_complaint: string;
  diagnosis: string;
  treatment_plan: string;
  notes: string;
  doctor_name: string;
  doctor_crm: string;
}

interface MockTranscription {
  id: string;
  transcript_text: string;
  confidence_score: number;
  language_detected: string;
  word_count: number;
  created_at: string;
}

const ReportTest: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [generatedReportUrl, setGeneratedReportUrl] = useState<string | null>(null);

  // Estados para dados de teste
  const [patient, setPatient] = useState<MockPatient>({
    id: 'test-patient-1',
    name: 'João Silva Santos',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-9999',
    birth_date: '1985-03-15',
    gender: 'Masculino',
    medical_record_number: 'MR001234'
  });

  const [consultation, setConsultation] = useState<MockConsultation>({
    id: 'test-consultation-1',
    consultation_date: new Date().toISOString(),
    consultation_type: 'Consulta de Rotina',
    chief_complaint: 'Dor de cabeça frequente há 2 semanas',
    diagnosis: 'Cefaleia tensional. Possível relação com estresse ocupacional.',
    treatment_plan: 'Prescrição de analgésico, recomendação de exercícios de relaxamento e acompanhamento em 15 dias.',
    notes: 'Paciente relata melhora com repouso. Orientado sobre técnicas de gerenciamento de estresse.',
    doctor_name: 'Dr. Maria Fernanda Costa',
    doctor_crm: 'CRM/SP 123456'
  });

  const [transcriptions, setTranscriptions] = useState<MockTranscription[]>([
    {
      id: 'test-transcription-1',
      transcript_text: 'Paciente do sexo masculino, 38 anos, comparece à consulta relatando episódios de cefaleia há aproximadamente duas semanas. Refere dor de intensidade moderada, localizada na região frontal e temporal bilateral. A dor piora com o estresse e melhora com repouso. Nega náuseas, vômitos ou alterações visuais. Exame físico sem alterações significativas. Sinais vitais estáveis.',
      confidence_score: 0.95,
      language_detected: 'pt-BR',
      word_count: 65,
      created_at: new Date().toISOString()
    },
    {
      id: 'test-transcription-2',
      transcript_text: 'Paciente trabalha em escritório, permanece muitas horas em frente ao computador. Relata aumento do estresse no trabalho nas últimas semanas. Nega uso de medicamentos contínuos. História familiar negativa para enxaqueca. Orientado sobre postura adequada no trabalho e técnicas de relaxamento.',
      confidence_score: 0.92,
      language_detected: 'pt-BR',
      word_count: 48,
      created_at: new Date(Date.now() + 300000).toISOString() // 5 minutos depois
    }
  ]);

  const generateTestReport = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      setSuccess(null);
      setGeneratedReportUrl(null);

      // Criar dados de teste no formato esperado pelo ReportService
      const mockReportData = {
        patient,
        consultation,
        transcriptions
      };

      // Usar o método privado createPDFReport através de uma abordagem alternativa
      // Como o método é privado, vamos criar o PDF diretamente aqui
      const reportBlob = await createMockPDFReport(mockReportData);
      
      // Criar URL temporária para download
      const url = URL.createObjectURL(reportBlob);
      setGeneratedReportUrl(url);
      
      setSuccess('Relatório de teste gerado com sucesso!');
      
      // Limpar mensagem de sucesso após 5 segundos
      setTimeout(() => setSuccess(null), 5000);
      
    } catch (err) {
      console.error('Erro ao gerar relatório de teste:', err);
      setError('Erro ao gerar relatório de teste. Verifique os dados e tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const createMockPDFReport = async (data: any): Promise<Blob> => {
    // Importar jsPDF dinamicamente
    const { default: jsPDF } = await import('jspdf');
    
    const doc = new jsPDF();
    let yPosition = 20;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Configurar fonte padrão
    doc.setFont('helvetica');

    // Cabeçalho
    doc.setFontSize(20);
    doc.setTextColor(41, 128, 185); // Azul
    doc.text('RELATÓRIO MÉDICO - TESTE', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('MedAssist - Sistema de Gestão Médica', pageWidth / 2, yPosition, { align: 'center' });
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
      `Email: ${data.patient.email}`,
      `Telefone: ${data.patient.phone}`,
      `Data de Nascimento: ${new Date(data.patient.birth_date).toLocaleDateString('pt-BR')}`,
      `Gênero: ${data.patient.gender}`,
      `Prontuário: ${data.patient.medical_record_number}`
    ];

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
      `Data: ${new Date(data.consultation.consultation_date).toLocaleDateString('pt-BR')}`,
      `Tipo: ${data.consultation.consultation_type}`,
      `Médico: ${data.consultation.doctor_name}`,
      `CRM: ${data.consultation.doctor_crm}`,
      `Queixa Principal: ${data.consultation.chief_complaint}`
    ];

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

      data.transcriptions.forEach((transcription: any, index: number) => {
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
        doc.text(`Confiança: ${(transcription.confidence_score * 100).toFixed(1)}% | Palavras: ${transcription.word_count}`, margin, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        
        // Quebrar texto em linhas
        const lines = doc.splitTextToSize(transcription.transcript_text, contentWidth);
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

    // Diagnóstico e Tratamento
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('DIAGNÓSTICO E TRATAMENTO', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    doc.setTextColor(41, 128, 185);
    doc.text('Diagnóstico:', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const diagnosisLines = doc.splitTextToSize(data.consultation.diagnosis, contentWidth);
    diagnosisLines.forEach((line: string) => {
      doc.text(line, margin, yPosition);
      yPosition += 5;
    });
    yPosition += 8;

    doc.setFontSize(12);
    doc.setTextColor(41, 128, 185);
    doc.text('Plano de Tratamento:', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const treatmentLines = doc.splitTextToSize(data.consultation.treatment_plan, contentWidth);
    treatmentLines.forEach((line: string) => {
      doc.text(line, margin, yPosition);
      yPosition += 5;
    });

    // Observações
    if (data.consultation.notes) {
      yPosition += 15;
      
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('OBSERVAÇÕES', margin, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const notesLines = doc.splitTextToSize(data.consultation.notes, contentWidth);
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
        `Relatório de teste gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')} - Página ${i} de ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    return doc.output('blob');
  };

  const downloadReport = () => {
    if (generatedReportUrl) {
      const link = document.createElement('a');
      link.href = generatedReportUrl;
      link.download = `relatorio_teste_${new Date().getTime()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const updatePatientField = (field: keyof MockPatient, value: string) => {
    setPatient(prev => ({ ...prev, [field]: value }));
  };

  const updateConsultationField = (field: keyof MockConsultation, value: string) => {
    setConsultation(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Teste de Geração de Relatórios Médicos
        </h1>
        <p className="text-gray-600">
          Teste a funcionalidade de geração de relatórios médicos em PDF
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dados do Paciente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Dados do Paciente
            </CardTitle>
            <CardDescription>
              Informações do paciente para o relatório de teste
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="patient-name">Nome Completo</Label>
              <Input
                id="patient-name"
                value={patient.name}
                onChange={(e) => updatePatientField('name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="patient-email">Email</Label>
              <Input
                id="patient-email"
                type="email"
                value={patient.email}
                onChange={(e) => updatePatientField('email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="patient-phone">Telefone</Label>
              <Input
                id="patient-phone"
                value={patient.phone}
                onChange={(e) => updatePatientField('phone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="patient-birth">Data de Nascimento</Label>
              <Input
                id="patient-birth"
                type="date"
                value={patient.birth_date}
                onChange={(e) => updatePatientField('birth_date', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="patient-gender">Gênero</Label>
              <Select value={patient.gender} onValueChange={(value) => updatePatientField('gender', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Feminino">Feminino</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="patient-record">Número do Prontuário</Label>
              <Input
                id="patient-record"
                value={patient.medical_record_number}
                onChange={(e) => updatePatientField('medical_record_number', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Dados da Consulta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Dados da Consulta
            </CardTitle>
            <CardDescription>
              Informações da consulta médica
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="consultation-type">Tipo de Consulta</Label>
              <Input
                id="consultation-type"
                value={consultation.consultation_type}
                onChange={(e) => updateConsultationField('consultation_type', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="doctor-name">Nome do Médico</Label>
              <Input
                id="doctor-name"
                value={consultation.doctor_name}
                onChange={(e) => updateConsultationField('doctor_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="doctor-crm">CRM</Label>
              <Input
                id="doctor-crm"
                value={consultation.doctor_crm}
                onChange={(e) => updateConsultationField('doctor_crm', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="chief-complaint">Queixa Principal</Label>
              <Textarea
                id="chief-complaint"
                value={consultation.chief_complaint}
                onChange={(e) => updateConsultationField('chief_complaint', e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="diagnosis">Diagnóstico</Label>
              <Textarea
                id="diagnosis"
                value={consultation.diagnosis}
                onChange={(e) => updateConsultationField('diagnosis', e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="treatment-plan">Plano de Tratamento</Label>
              <Textarea
                id="treatment-plan"
                value={consultation.treatment_plan}
                onChange={(e) => updateConsultationField('treatment_plan', e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={consultation.notes}
                onChange={(e) => updateConsultationField('notes', e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transcrições */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Transcrições de Áudio
          </CardTitle>
          <CardDescription>
            Transcrições que serão incluídas no relatório
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transcriptions.map((transcription, index) => (
              <div key={transcription.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">Transcrição {index + 1}</h4>
                  <div className="text-sm text-gray-500">
                    Confiança: {(transcription.confidence_score * 100).toFixed(1)}% | 
                    Palavras: {transcription.word_count}
                  </div>
                </div>
                <Textarea
                  value={transcription.transcript_text}
                  onChange={(e) => {
                    const newTranscriptions = [...transcriptions];
                    newTranscriptions[index].transcript_text = e.target.value;
                    newTranscriptions[index].word_count = e.target.value.split(' ').length;
                    setTranscriptions(newTranscriptions);
                  }}
                  rows={4}
                  className="mt-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <Card>
        <CardHeader>
          <CardTitle>Gerar Relatório</CardTitle>
          <CardDescription>
            Clique no botão abaixo para gerar o relatório médico em PDF
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            
            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                <CheckCircle className="h-4 w-4" />
                {success}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                onClick={generateTestReport}
                disabled={isGenerating}
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                {isGenerating ? 'Gerando...' : 'Gerar Relatório PDF'}
              </Button>

              {generatedReportUrl && (
                <Button
                  onClick={downloadReport}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Baixar Relatório
                </Button>
              )}
            </div>

            {generatedReportUrl && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  ✅ Relatório gerado com sucesso! Use o botão "Baixar Relatório" para fazer o download.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportTest;