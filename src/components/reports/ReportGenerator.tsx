import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { ReportService } from '../../services/reportService';

interface ReportGeneratorProps {
  consultationId: string;
  patientName: string;
  consultationDate: string;
  onReportGenerated?: (filePath: string) => void;
}

interface ConsultationReport {
  id: string;
  consultation_id: string;
  file_name: string;
  file_path: string;
  report_type: string;
  generated_at: string;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  consultationId,
  patientName,
  consultationDate,
  onReportGenerated,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [existingReports, setExistingReports] = useState<ConsultationReport[]>(
    []
  );
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    loadExistingReports();
  }, [consultationId]);

  const loadExistingReports = async () => {
    try {
      setLoadingReports(true);
      const reports =
        await ReportService.getConsultationReports(consultationId);
      setExistingReports(reports || []);
    } catch (err) {
      console.error('Erro ao carregar relatórios:', err);
    } finally {
      setLoadingReports(false);
    }
  };

  const generateReport = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      setSuccess(null);

      // Gerar o relatório PDF
      const reportBlob =
        await ReportService.generateConsultationReport(consultationId);

      // Salvar no armazenamento
      const filePath = await ReportService.saveReportToStorage(
        consultationId,
        reportBlob
      );

      setSuccess('Relatório gerado com sucesso!');

      // Recarregar lista de relatórios
      await loadExistingReports();

      // Callback para componente pai
      if (onReportGenerated) {
        onReportGenerated(filePath);
      }

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Erro ao gerar relatório:', err);
      setError('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = async (filePath: string, fileName: string) => {
    try {
      setIsDownloading(true);
      setError(null);

      const reportBlob = await ReportService.downloadReport(filePath);

      // Criar URL temporária e fazer download
      const url = URL.createObjectURL(reportBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao baixar relatório:', err);
      setError('Erro ao baixar relatório. Tente novamente.');
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Relatórios da Consulta
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Paciente: {patientName} • Data: {formatDate(consultationDate)}
          </p>
        </div>

        <button
          onClick={generateReport}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          {isGenerating ? 'Gerando...' : 'Gerar Relatório'}
        </button>
      </div>

      {/* Mensagens de Status */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
          <CheckCircle className="w-4 h-4" />
          {success}
        </div>
      )}

      {/* Lista de Relatórios Existentes */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">
          Relatórios Gerados
        </h4>

        {loadingReports ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Carregando relatórios...</span>
          </div>
        ) : existingReports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhum relatório gerado ainda</p>
            <p className="text-sm">
              Clique em "Gerar Relatório" para criar o primeiro
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {existingReports.map(report => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {report.file_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Gerado em {formatDate(report.generated_at)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    downloadReport(report.file_path, report.file_name)
                  }
                  disabled={isDownloading}
                  className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDownloading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {isDownloading ? 'Baixando...' : 'Baixar'}
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Informações sobre o Relatório */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h5 className="font-medium text-blue-900 mb-2">
          O que inclui o relatório:
        </h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Dados completos do paciente</li>
          <li>• Informações da consulta</li>
          <li>• Transcrições de áudio (se disponíveis)</li>
          <li>• Diagnóstico e plano de tratamento</li>
          <li>• Observações médicas</li>
        </ul>
      </div>
    </div>
  );
};

export default ReportGenerator;
