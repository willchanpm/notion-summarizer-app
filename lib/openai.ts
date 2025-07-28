// This is a real implementation for OpenAI integration
// It sends the audio blob to OpenAI's Whisper API for transcription
// Then sends the transcript to OpenAI's GPT API for summarization
// NOTE: This function is intended to be called from a Next.js API route (server-side), not directly from the browser.

/**
 * Transcribes and summarizes an audio recording
 * @param audioBlob - The audio recording as a blob
 * @returns Promise containing transcript and summary
 */
export async function transcribeAndSummarise(audioBlob: Blob): Promise<{
  transcript: string;
  summary: string;
}> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OpenAI API key in environment variables.');
  }

  // Use the native FormData in Node.js (undici) or browser
  let FormDataImpl: typeof FormData;
  if (typeof window === 'undefined') {
    // @ts-ignore
    FormDataImpl = (await import('undici')).FormData;
  } else {
    FormDataImpl = FormData;
  }

  // Prepare form data for Whisper API
  const formData = new FormDataImpl();
  // In Node.js, audioBlob is already a Blob (from API route), so just append
  formData.append('file', audioBlob, 'audio.webm');
  formData.append('model', 'whisper-1');

  let transcript = '';
  let summary = '';

  try {
    // Whisper API: Transcribe audio
    console.log('Sending audio to OpenAI Whisper API...');
    const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`
        // Note: Do NOT set Content-Type header when sending FormData
      },
      body: formData,
    } as any); // as any to satisfy TS for undici FormData

    if (!whisperRes.ok) {
      const errorText = await whisperRes.text();
      console.error('Whisper API error:', errorText);
      throw new Error('Failed to transcribe audio.');
    }

    const whisperData = await whisperRes.json();
    transcript = whisperData.text;
    console.log('Transcript:', transcript);

    // GPT-4 API: Summarise transcript
    console.log('Sending transcript to OpenAI GPT-4 for summarisation...');
    const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Summarise this meeting transcript in bullet points' },
          { role: 'user', content: transcript },
        ],
        max_tokens: 512,
        temperature: 0.5,
      }),
    });

    if (!gptRes.ok) {
      const errorText = await gptRes.text();
      console.error('GPT-4 API error:', errorText);
      throw new Error('Failed to summarise transcript.');
    }

    const gptData = await gptRes.json();
    summary = gptData.choices?.[0]?.message?.content || '';
    console.log('Summary:', summary);

    return { transcript, summary };
  } catch (error) {
    console.error('Error in transcribeAndSummarise:', error);
    throw error;
  }
} 