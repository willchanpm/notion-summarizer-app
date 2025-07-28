import { NextRequest, NextResponse } from 'next/server';
import { transcribeAndSummarise } from '../../../lib/openai';

export const runtime = 'nodejs'; // Ensure this runs on the Node.js runtime

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming form data
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No audio file provided.' }, { status: 400 });
    }

    // Call the OpenAI logic
    const { transcript, summary } = await transcribeAndSummarise(file);
    return NextResponse.json({ transcript, summary });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 