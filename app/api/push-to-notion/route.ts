import { NextRequest, NextResponse } from 'next/server';
import { pushToNotion } from '../../../lib/notion';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { transcript, summary } = await req.json();
    if (!transcript || !summary) {
      return NextResponse.json({ error: 'Missing transcript or summary.' }, { status: 400 });
    }
    const success = await pushToNotion({ transcript, summary });
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to push to Notion.' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 