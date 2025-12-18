import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.3.0';

interface Consultation {
  id: string;
  audio_url: string;
}

// Function to process the transcription and update the database
async function processTranscription(supabaseClient: SupabaseClient, consultation: Consultation) {
  try {
    console.log(`[${consultation.id}] Starting processing.`);

    // 1. Download audio file from Storage
    const urlParts = consultation.audio_url.split('/');
    const bucketName = urlParts[urlParts.length - 2];
    const filePath = urlParts[urlParts.length - 1];

    if (!bucketName || !filePath) {
      throw new Error('Invalid audio_url format');
    }

    const { data: audioFile, error: downloadError } = await supabaseClient.storage
      .from(bucketName)
      .download(filePath);

    if (downloadError || !audioFile) {
      throw new Error(`Failed to download audio file: ${downloadError?.message}`);
    }
    console.log(`[${consultation.id}] Audio file downloaded.`);

    // 2. Transcribe with OpenAI Whisper
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const formData = new FormData();
    formData.append('file', audioFile, filePath);
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'verbose_json');
    formData.append('language', 'pt');
    formData.append(
      'prompt',
      'Esta é uma transcrição de consulta médica. Inclua termos médicos precisos, nomes de medicamentos, procedimentos, sintomas e diagnósticos.'
    );

    const config = new Configuration({ apiKey: openaiApiKey });
    const openai = new OpenAIApi(config);
    
    // The library expects the `file` to be a specific type, but Deno's fetch handles FormData correctly.
    // We cast to `any` to bypass the type checking limitation here.
    const response = await openai.createTranscription(formData as any);

    if (response.status !== 200) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }
    console.log(`[${consultation.id}] Transcription successful.`);

    const whisperResult = response.data;
    const transcriptionText = whisperResult.text || '';

    // 3. (Optional) Generate Summary with GPT
    let summaryText = '';
    try {
        const summaryResponse = await openai.createChatCompletion({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'Você é um assistente médico especializado em criar resumos estruturados de consultas médicas no formato SOAP.' },
                { role: 'user', content: `Analise a seguinte transcrição de consulta médica e crie um resumo estruturado no formato SOAP (Subjetivo, Objetivo, Avaliação, Plano):\n\n**Transcrição:**\n${transcriptionText}` }
            ],
            temperature: 0.3,
            max_tokens: 1000,
        });
        summaryText = summaryResponse.data.choices[0]?.message?.content || 'Não foi possível gerar o resumo.';
        console.log(`[${consultation.id}] Summary generated.`);
    } catch(summaryError) {
        console.error(`[${consultation.id}] Error generating summary:`, summaryError);
        summaryText = 'Erro ao gerar resumo.';
    }


    // 4. Update the consultation record
    const { error: updateError } = await supabaseClient
      .from('consultations')
      .update({
        status: 'finalizada',
        has_transcription: true,
        transcription_text: transcriptionText,
        summary_text: summaryText, // Assuming a 'summary_text' column exists
      })
      .eq('id', consultation.id);

    if (updateError) {
      throw new Error(`Failed to update consultation record: ${updateError.message}`);
    }
    console.log(`[${consultation.id}] Consultation record updated.`);

    return { status: 200, message: `Consultation ${consultation.id} processed successfully.` };

  } catch (error) {
    console.error(`[${consultation.id}] Error in transcription pipeline:`, error.message);
    // Update the consultation to reflect the error
    await supabaseClient
      .from('consultations')
      .update({
        status: 'falha_processamento',
        processing_error: error.message,
      })
      .eq('id', consultation.id);
    return { status: 500, message: error.message };
  }
}


serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { record: consultation } = await req.json();

    if (!consultation || !consultation.id) {
        return new Response(JSON.stringify({ error: 'Invalid payload' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    // We don't wait for the processing to finish.
    // The trigger invokes the function, and we return a success response immediately.
    // The actual processing happens in the background.
    processTranscription(supabaseClient, consultation);

    return new Response(JSON.stringify({ message: 'Processing started' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
