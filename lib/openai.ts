// This is a real implementation for OpenAI integration
// It sends the audio blob to OpenAI's Whisper API for transcription
// Then sends the transcript to OpenAI's GPT API for summarization and speaker diarization
// NOTE: This function is intended to be called from a Next.js API route (server-side), not directly from the browser.

/**
 * Transcribes and summarizes an audio recording with speaker diarization
 * @param audioBlob - The audio recording as a blob
 * @returns Promise containing transcript with speakers and summary
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

  let rawTranscript = '';
  let transcriptWithSpeakers = '';
  let summary = '';

  try {
    // Step 1: Whisper API - Transcribe audio
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
    rawTranscript = whisperData.text;
    console.log('Raw transcript:', rawTranscript);

    // Step 2: GPT-4 API - Add speaker diarization
    console.log('Adding speaker diarization with GPT-4...');
    const speakerPrompt = `Analyze this meeting transcript and identify different speakers. 

Instructions:
1. Listen for natural conversation breaks, different voices, and speaking patterns
2. Identify when different people are speaking
3. Format the transcript as: "Speaker 1: [what they said]", "Speaker 2: [what they said]", etc.
4. Use "Speaker 1", "Speaker 2", "Speaker 3", etc. for labels
5. Preserve all the original content, just add speaker labels
6. If it's clearly one person speaking throughout, just use "Speaker 1"

Transcript to analyze:
${rawTranscript}

Please format the transcript with speaker labels:`;

    const speakerRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert at identifying different speakers in conversation transcripts. Format transcripts with clear speaker labels.' },
          { role: 'user', content: speakerPrompt },
        ],
        max_tokens: 2000,
        temperature: 0.3,
      }),
    });

    if (!speakerRes.ok) {
      const errorText = await speakerRes.text();
      console.error('GPT-4 Speaker API error:', errorText);
      // Fallback to raw transcript if speaker diarization fails
      transcriptWithSpeakers = rawTranscript;
    } else {
      const speakerData = await speakerRes.json();
      transcriptWithSpeakers = speakerData.choices?.[0]?.message?.content || rawTranscript;
      console.log('Transcript with speakers:', transcriptWithSpeakers);
    }

    // Step 3: GPT-4 API - Summarize the transcript with speakers
    console.log('Generating summary with GPT-4...');
    const summaryPrompt = `Summarize this meeting transcript in bullet points. Focus on key points, decisions, and action items.

Transcript:
${transcriptWithSpeakers}

Please provide a concise summary with bullet points:`;

    const summaryRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Summarize meeting transcripts in clear bullet points, highlighting key decisions and action items.' },
          { role: 'user', content: summaryPrompt },
        ],
        max_tokens: 512,
        temperature: 0.5,
      }),
    });

    if (!summaryRes.ok) {
      const errorText = await summaryRes.text();
      console.error('GPT-4 Summary API error:', errorText);
      throw new Error('Failed to summarize transcript.');
    }

    const summaryData = await summaryRes.json();
    summary = summaryData.choices?.[0]?.message?.content || '';
    console.log('Summary:', summary);

    return { transcript: transcriptWithSpeakers, summary };
  } catch (error) {
    console.error('Error in transcribeAndSummarise:', error);
    throw error;
  }
} 