import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Environment variables test (using .env file)',
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    openAIKeyLength: process.env.OPENAI_API_KEY?.length || 0,
    openAIKeyPrefix: process.env.OPENAI_API_KEY?.substring(0, 7) || 'none',
    hasNotionKey: !!process.env.NOTION_API_KEY,
    notionKeyLength: process.env.NOTION_API_KEY?.length || 0,
    notionKeyPrefix: process.env.NOTION_API_KEY?.substring(0, 7) || 'none',
    hasNotionDB: !!process.env.NOTION_DATABASE_ID,
    notionDBLength: process.env.NOTION_DATABASE_ID?.length || 0,
    nodeEnv: process.env.NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter(key => 
      key.includes('OPENAI') || key.includes('NOTION')
    ),
    totalEnvVars: Object.keys(process.env).length
  });
} 