import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const notionApiKey = process.env.NOTION_API_KEY;
    const notionDatabaseId = process.env.NOTION_DATABASE_ID;

    if (!notionApiKey || !notionDatabaseId) {
      return NextResponse.json({
        error: 'Missing environment variables',
        hasApiKey: !!notionApiKey,
        hasDatabaseId: !!notionDatabaseId,
        apiKeyPrefix: notionApiKey?.substring(0, 7) || 'none',
        databaseIdLength: notionDatabaseId?.length || 0
      });
    }

    // Test 1: Check database access
    console.log('Testing Notion database access...');
    const dbResponse = await fetch(`https://api.notion.com/v1/databases/${notionDatabaseId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Notion-Version': '2022-06-28',
      },
    });

    if (!dbResponse.ok) {
      const dbError = await dbResponse.text();
      return NextResponse.json({
        error: 'Database access failed',
        status: dbResponse.status,
        statusText: dbResponse.statusText,
        errorDetails: dbError,
        databaseId: notionDatabaseId,
        apiKeyPrefix: notionApiKey.substring(0, 7)
      });
    }

    const dbData = await dbResponse.json();
    
    // Test 2: Try to create a test page
    console.log('Testing page creation...');
    const testBody = {
      parent: {
        database_id: notionDatabaseId
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: 'Test Page - ' + new Date().toISOString(),
              },
            },
          ],
        },
        Transcript: {
          rich_text: [
            {
              text: {
                content: 'This is a test transcript.',
              },
            },
          ],
        },
        Summary: {
          rich_text: [
            {
              text: {
                content: 'This is a test summary.',
              },
            },
          ],
        },
      },
    };

    const pageResponse = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testBody),
    });

    if (!pageResponse.ok) {
      const pageError = await pageResponse.text();
      return NextResponse.json({
        error: 'Page creation failed',
        status: pageResponse.status,
        statusText: pageResponse.statusText,
        errorDetails: pageError,
        requestBody: testBody,
        databaseId: notionDatabaseId,
        apiKeyPrefix: notionApiKey.substring(0, 7)
      });
    }

    const pageData = await pageResponse.json();

    return NextResponse.json({
      success: true,
      databaseInfo: {
        title: dbData.title?.[0]?.plain_text || 'Untitled',
        properties: Object.keys(dbData.properties || {}),
        id: dbData.id
      },
      testPageCreated: {
        id: pageData.id,
        url: pageData.url
      },
      environment: {
        apiKeyPrefix: notionApiKey.substring(0, 7),
        databaseId: notionDatabaseId,
        databaseIdLength: notionDatabaseId.length
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      error: 'Test failed',
      message: error.message,
      stack: error.stack
    });
  }
} 