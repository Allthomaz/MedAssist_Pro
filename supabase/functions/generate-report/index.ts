import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

interface GenerateReportRequest {
  transcription: string;
  intention: string;
  timestamp: string;
}

interface GenerateReportResponse {
  title: string;
  content: string;
  success: boolean;
  error?: string;
}

// Função para gerar documento médico baseado na transcrição e intenção
function generateMedicalDocument(
  transcription: string,
  intention: string
): { title: string; content: string } {
  const timestamp = new Date().toLocaleString('pt-BR');

  // Análise da intenção para determinar o tipo de documento
  const intentionLower = intention.toLowerCase();

  let title = 'Documento Médico';
  let template = '';

  if (
    intentionLower.includes('relatório') ||
    intentionLower.includes('relatorio')
  ) {
    title = 'Relatório Clínico';
    template = generateClinicalReport(transcription, timestamp);
  } else if (intentionLower.includes('laudo')) {
    title = 'Laudo Médico';
    template = generateMedicalReport(transcription, timestamp);
  } else if (
    intentionLower.includes('prescrição') ||
    intentionLower.includes('prescricao') ||
    intentionLower.includes('receita')
  ) {
    title = 'Prescrição Médica';
    template = generatePrescription(transcription, timestamp);
  } else if (intentionLower.includes('atestado')) {
    title = 'Atestado Médico';
    template = generateMedicalCertificate(transcription, timestamp);
  } else if (
    intentionLower.includes('evolução') ||
    intentionLower.includes('evolucao') ||
    intentionLower.includes('prontuário') ||
    intentionLower.includes('prontuario')
  ) {
    title = 'Evolução Clínica';
    template = generateClinicalEvolution(transcription, timestamp);
  } else {
    // Documento genérico baseado na intenção
    title = intention.charAt(0).toUpperCase() + intention.slice(1);
    template = generateGenericDocument(transcription, intention, timestamp);
  }

  return { title, content: template };
}

// Template para Relatório Clínico
function generateClinicalReport(
  transcription: string,
  timestamp: string
): string {
  return (
    `RELATÓRIO CLÍNICO

Data: ${timestamp}

` +
    `HISTÓRIA CLÍNICA:
${extractSection(transcription, ['história', 'queixa', 'sintomas', 'hda'])}

` +
    `EXAME FÍSICO:
${extractSection(transcription, ['exame físico', 'exame', 'inspeção', 'palpação'])}

` +
    `AVALIAÇÃO:
${extractSection(transcription, ['avaliação', 'diagnóstico', 'impressão', 'conclusão'])}

` +
    `CONDUTA:
${extractSection(transcription, ['conduta', 'tratamento', 'orientações', 'plano'])}

` +
    `OBSERVAÇÕES:
${extractAdditionalInfo(transcription)}

` +
    `_______________________________
Assinatura do Médico
CRM: [Número do CRM]`
  );
}

// Template para Laudo Médico
function generateMedicalReport(
  transcription: string,
  timestamp: string
): string {
  return (
    `LAUDO MÉDICO

Data: ${timestamp}

` +
    `DADOS DO EXAME:
${extractSection(transcription, ['exame', 'procedimento', 'método'])}

` +
    `ACHADOS:
${extractSection(transcription, ['achados', 'resultados', 'observações', 'alterações'])}

` +
    `CONCLUSÃO:
${extractSection(transcription, ['conclusão', 'diagnóstico', 'impressão', 'resultado'])}

` +
    `RECOMENDAÇÕES:
${extractSection(transcription, ['recomendações', 'orientações', 'seguimento'])}

` +
    `_______________________________
Médico Responsável
CRM: [Número do CRM]`
  );
}

// Template para Prescrição Médica
function generatePrescription(
  transcription: string,
  timestamp: string
): string {
  return (
    `PRESCRIÇÃO MÉDICA

Data: ${timestamp}

` +
    `PACIENTE: [Nome do Paciente]
` +
    `IDADE: [Idade]

` +
    `MEDICAMENTOS PRESCRITOS:
${extractMedications(transcription)}

` +
    `ORIENTAÇÕES GERAIS:
${extractSection(transcription, ['orientações', 'cuidados', 'recomendações'])}

` +
    `RETORNO:
${extractSection(transcription, ['retorno', 'reavaliação', 'seguimento'])}

` +
    `_______________________________
Médico Prescritor
CRM: [Número do CRM]`
  );
}

// Template para Atestado Médico
function generateMedicalCertificate(
  transcription: string,
  timestamp: string
): string {
  return (
    `ATESTADO MÉDICO

Data: ${timestamp}

` +
    `Atesto para os devidos fins que o(a) paciente [Nome do Paciente] ` +
    `esteve sob meus cuidados médicos e necessita de afastamento de suas atividades ` +
    `por motivo de saúde.

` +
    `DIAGNÓSTICO (CID-10):
${extractSection(transcription, ['diagnóstico', 'cid', 'doença', 'condição'])}

` +
    `PERÍODO DE AFASTAMENTO:
${extractSection(transcription, ['afastamento', 'repouso', 'licença', 'dias'])}

` +
    `OBSERVAÇÕES:
${extractAdditionalInfo(transcription)}

` +
    `_______________________________
Médico Assistente
CRM: [Número do CRM]`
  );
}

// Template para Evolução Clínica
function generateClinicalEvolution(
  transcription: string,
  timestamp: string
): string {
  return (
    `EVOLUÇÃO CLÍNICA

Data: ${timestamp}

` +
    `EVOLUÇÃO:
${extractSection(transcription, ['evolução', 'melhora', 'piora', 'estado', 'quadro'])}

` +
    `EXAME FÍSICO ATUAL:
${extractSection(transcription, ['exame', 'sinais vitais', 'estado geral'])}

` +
    `CONDUTA:
${extractSection(transcription, ['conduta', 'medicação', 'ajuste', 'mudança'])}

` +
    `PLANO:
${extractSection(transcription, ['plano', 'seguimento', 'próximos passos'])}

` +
    `_______________________________
Médico Responsável
CRM: [Número do CRM]`
  );
}

// Template genérico
function generateGenericDocument(
  transcription: string,
  intention: string,
  timestamp: string
): string {
  return (
    `${intention.toUpperCase()}

Data: ${timestamp}

` +
    `CONTEÚDO:
${transcription}

` +
    `RESUMO:
${generateSummary(transcription)}

` +
    `_______________________________
Médico Responsável
CRM: [Número do CRM]`
  );
}

// Função auxiliar para extrair seções específicas da transcrição
function extractSection(transcription: string, keywords: string[]): string {
  const lines = transcription.split('\n');
  const relevantLines: string[] = [];

  for (const line of lines) {
    const lineLower = line.toLowerCase();
    if (keywords.some(keyword => lineLower.includes(keyword))) {
      relevantLines.push(line);
      // Adiciona as próximas 2-3 linhas como contexto
      const currentIndex = lines.indexOf(line);
      for (let i = 1; i <= 3 && currentIndex + i < lines.length; i++) {
        const nextLine = lines[currentIndex + i];
        if (nextLine.trim() && !relevantLines.includes(nextLine)) {
          relevantLines.push(nextLine);
        }
      }
    }
  }

  return relevantLines.length > 0
    ? relevantLines.join('\n')
    : 'Informação não especificada na transcrição.';
}

// Função auxiliar para extrair medicamentos
function extractMedications(transcription: string): string {
  const medicationKeywords = [
    'mg',
    'ml',
    'comprimido',
    'cápsula',
    'gotas',
    'vezes ao dia',
    'de 8 em 8',
    'de 12 em 12',
  ];
  const lines = transcription.split('\n');
  const medications: string[] = [];

  for (const line of lines) {
    const lineLower = line.toLowerCase();
    if (medicationKeywords.some(keyword => lineLower.includes(keyword))) {
      medications.push(`• ${line.trim()}`);
    }
  }

  return medications.length > 0
    ? medications.join('\n')
    : '• [Medicamentos a serem especificados]';
}

// Função auxiliar para extrair informações adicionais
function extractAdditionalInfo(transcription: string): string {
  const lines = transcription.split('\n');
  const additionalInfo = lines
    .filter(line => line.trim().length > 10)
    .slice(-3) // Pega as últimas 3 linhas relevantes
    .join('\n');

  return additionalInfo || 'Nenhuma observação adicional.';
}

// Função para gerar resumo
function generateSummary(transcription: string): string {
  const sentences = transcription
    .split(/[.!?]+/)
    .filter(s => s.trim().length > 10);
  const summary = sentences.slice(0, 3).join('. ');
  return summary || 'Resumo não disponível.';
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verificar método HTTP
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Método não permitido. Use POST.' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse do body da requisição
    const requestBody: GenerateReportRequest = await req.json();

    // Validação dos campos obrigatórios
    if (!requestBody.transcription || !requestBody.intention) {
      return new Response(
        JSON.stringify({
          error: 'Campos obrigatórios: transcription e intention',
          success: false,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validação do tamanho da transcrição
    if (requestBody.transcription.length < 10) {
      return new Response(
        JSON.stringify({
          error: 'Transcrição muito curta. Mínimo de 10 caracteres.',
          success: false,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Gerar o documento
    const { title, content } = generateMedicalDocument(
      requestBody.transcription.trim(),
      requestBody.intention.trim()
    );

    // Resposta de sucesso
    const response: GenerateReportResponse = {
      title,
      content,
      success: true,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro na geração do documento:', error);

    return new Response(
      JSON.stringify({
        error: 'Erro interno do servidor ao gerar documento',
        success: false,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

/* Para testar localmente:
curl -X POST http://localhost:54321/functions/v1/generate-report \
  -H "Content-Type: application/json" \
  -d '{
    "transcription": "Paciente relata dor de cabeça há 3 dias, sem febre. Exame físico normal. Prescrevo analgésico.",
    "intention": "Gerar relatório clínico resumido",
    "timestamp": "2024-01-15T10:30:00Z"
  }'
*/
