// This is a real implementation for Notion integration
// It sends the transcript and summary to a Notion database using the Notion API

/**
 * Pushes transcript and summary data to Notion
 * @param data - Object containing transcript and summary
 * @returns Promise indicating success or failure
 */
export async function pushToNotion({ transcript, summary }: { transcript: string; summary: string; }): Promise<boolean> {
  // Type checks for environment variables
  if (!process.env.NOTION_DATABASE_ID) throw new Error("Missing NOTION_DATABASE_ID");
  if (!process.env.NOTION_API_KEY) throw new Error("Missing NOTION_API_KEY");

  const notionApiKey = process.env.NOTION_API_KEY;
  const notionDatabaseId = process.env.NOTION_DATABASE_ID;

  // Prepare the page title (first 50 chars of summary or 'Untitled')
  const title = summary?.slice(0, 50) || 'Untitled';

  // Prepare the request body with proper structure
  // Note: Property names must match exactly what's in your Notion database
  const body = {
    parent: {
      database_id: notionDatabaseId
    },
    properties: {
      // Try common property names - adjust these to match your database
      Name: {
        title: [
          {
            text: {
              content: title,
            },
          },
        ],
      },
      // Make these optional in case they don't exist in your database
      ...(transcript && {
        Transcript: {
          rich_text: [
            {
              text: {
                content: transcript,
              },
            },
          ],
        },
      }),
      ...(summary && {
        Summary: {
          rich_text: [
            {
              text: {
                content: summary,
              },
            },
          ],
        },
      }),
    },
  };

  try {
    console.log('Sending data to Notion...');
    console.log('Database ID (raw):', notionDatabaseId);
    console.log('Database ID type:', typeof notionDatabaseId);
    console.log('Database ID length:', notionDatabaseId.length);
    console.log('Title:', title);
    
    // Log the exact body structure before JSON.stringify
    console.log('Body parent.database_id:', body.parent.database_id);
    console.log('Body parent.database_id type:', typeof body.parent.database_id);
    
    const requestBody = JSON.stringify(body);
    console.log('Final JSON body:', requestBody);
    
    const res = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Notion API error:', errorText);
      console.error('Response status:', res.status);
      console.error('Response headers:', Object.fromEntries(res.headers.entries()));
      return false;
    }

    const data = await res.json();
    console.log('Successfully pushed to Notion:', data.id);
    console.log('Page URL:', data.url);
    return true;
  } catch (error) {
    console.error('Error in pushToNotion:', error);
    return false;
  }
} 