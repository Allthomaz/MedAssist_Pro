import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranscribeRequest {
  recordingId: string;
  options?: {
    language?: string;
    prompt?: string;
    temperature?: number;
    response_format?: string;
  };
}

interface TranscribeResponse {
  transcription: string;
  confidence: number;
  language?: string;
  duration?: number;
  segments?: any[];
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verificar se é uma requisição POST
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse do body da requisição
    const { recordingId }: TranscribeRequest = await req.json();

    if (!recordingId) {
      return new Response(
        JSON.stringify({ error: 'Recording ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Inicializar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Buscar informações da gravação
    const { data: recording, error: recordingError } = await supabase
      .from('recordings')
      .select('*')
      .eq('id', recordingId)
      .single();

    if (recordingError || !recording) {
      return new Response(
        JSON.stringify({ error: 'Recording not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Atualizar status da gravação para 'processing'
    await supabase
      .from('recordings')
      .update({ 
        recording_status: 'processing',
        processing_started_at: new Date().toISOString()
      })
      .eq('id', recordingId);

    // Baixar arquivo de áudio do Storage
    const { data: audioFile, error: downloadError } = await supabase.storage
      .from('recordings')
      .download(recording.audio_file_name);

    if (downloadError || !audioFile) {
      await supabase
        .from('recordings')
        .update({ 
          recording_status: 'failed',
          processing_error: 'Failed to download audio file'
        })
        .eq('id', recordingId);

      return new Response(
        JSON.stringify({ error: 'Failed to download audio file' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Preparar dados para OpenAI Whisper API
    const openaiApiKey = Deno.env.get?.('OPENAI_API_KEY') ?? process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Criar FormData para envio ao OpenAI
    const formData = new FormData();
    formData.append('file', audioFile, recording.audio_file_name);
    formData.append('model', 'whisper-1');
    formData.append('language', recording.language_code || 'pt');
    formData.append('response_format', 'verbose_json');
    formData.append('timestamp_granularities[]', 'word');

    // Chamar OpenAI Whisper API
    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: formData,
    });

    if (!whisperResponse.ok) {
      const errorText = await whisperResponse.text();
      console.error('OpenAI API Error:', errorText);
      
      await supabase
        .from('recordings')
        .update({ 
          recording_status: 'failed',
          processing_error: `OpenAI API error: ${errorText}`
        })
        .eq('id', recordingId);

      return new Response(
        JSON.stringify({ error: 'Transcription service failed' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const whisperResult = await whisperResponse.json();
    
    // Extrair informações da resposta
    const transcriptionText = whisperResult.text || '';
    const confidence = whisperResult.segments?.reduce((acc: number, seg: any) => acc + (seg.avg_logprob || 0), 0) / (whisperResult.segments?.length || 1);
    const detectedLanguage = whisperResult.language || recording.language_code;
    const wordCount = transcriptionText.split(/\s+/).length;

    // Salvar transcrição no banco de dados
    const { data: transcriptionData, error: transcriptionError } = await supabase
      .from('transcriptions')
      .insert({
        recording_id: recordingId,
        consultation_id: recording.consultation_id,
        transcript_text: transcriptionText,
        language_detected: detectedLanguage,
        confidence_score: Math.max(0, Math.min(1, confidence + 1)), // Normalizar para 0-1
        word_count: wordCount,
        transcription_status: 'completed',
        transcription_service: 'openai',
        transcription_started_at: new Date().toISOString(),
        transcription_completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (transcriptionError) {
      console.error('Database error:', transcriptionError);
      
      await supabase
        .from('recordings')
        .update({ 
          recording_status: 'failed',
          processing_error: 'Failed to save transcription'
        })
        .eq('id', recordingId);

      return new Response(
        JSON.stringify({ error: 'Failed to save transcription' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Salvar segmentos detalhados se disponíveis
    if (whisperResult.segments && whisperResult.segments.length > 0) {
      const segments = whisperResult.segments.map((segment: any, index: number) => ({
        transcription_id: transcriptionData.id,
        start_time: segment.start,
        end_time: segment.end,
        text: segment.text,
        confidence: Math.max(0, Math.min(1, segment.avg_logprob + 1)),
        segment_order: index + 1,
        words: segment.words || null,
      }));

      await supabase
        .from('transcription_segments')
        .insert(segments);
    }

    // Atualizar status da gravação para 'completed'
    await supabase
      .from('recordings')
      .update({ 
        recording_status: 'completed',
        processing_completed_at: new Date().toISOString(),
        auto_transcribe: true
      })
      .eq('id', recordingId);

    // Atualizar consulta com informações da transcrição
    await supabase
      .from('consultations')
      .update({
        has_transcription: true,
        transcription_text: transcriptionText,
        transcription_confidence: Math.max(0, Math.min(1, confidence + 1))
      })
      .eq('id', recording.consultation_id);

    // Preparar resposta
    const response: TranscribeResponse = {
      transcription: transcriptionText,
      confidence: Math.max(0, Math.min(1, confidence + 1)),
      language: detectedLanguage,
      duration: whisperResult.duration
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Transcription error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});