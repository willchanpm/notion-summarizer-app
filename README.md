# 🎤 Notion Meeting Summarizer

A Next.js web application that records meetings, transcribes them using OpenAI's Whisper API, generates summaries with GPT-4, and saves everything to Notion. **Now with automatic speaker diarization!**

## ✨ Features

- **🎙️ Audio Recording**: Record meetings directly in your browser using the MediaRecorder API
- **🤖 AI Transcription**: Convert speech to text using OpenAI's Whisper API
- **👥 Speaker Diarization**: Automatically identify and label different speakers in the conversation
- **📝 AI Summarization**: Generate bullet-point summaries using OpenAI's GPT-4
- **📚 Notion Integration**: Automatically save transcripts and summaries to your Notion database
- **🎨 Modern UI**: Clean, responsive interface with dark green theme
- **🔒 Secure**: API keys are kept secure on the server side

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- OpenAI API key
- Notion API key and database ID

### Installation

1. **Clone the repository**
   ```bash
   git clone "https://github.com/willchanpm/notion-summarizer-app"
   cd notion-summarizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   # OpenAI API Key (get from https://platform.openai.com/api-keys)
   OPENAI_API_KEY=sk-your-openai-api-key-here
   
   # Notion API Key (get from https://www.notion.so/my-integrations)
   NOTION_API_KEY=secret-your-notion-api-key-here
   
   # Notion Database ID (32-character UUID from your database URL)
   NOTION_DATABASE_ID=your-32-character-database-id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Setup Instructions

### OpenAI Setup

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `sk-`)
4. Add it to your `.env` file

### Notion Setup

1. **Create a Notion Integration**
   - Go to [Notion Integrations](https://www.notion.so/my-integrations)
   - Click "New integration"
   - Give it a name (e.g., "Meeting Summarizer")
   - Copy the "Internal Integration Token" (starts with `secret_`)

2. **Create a Database**
   - Create a new database in Notion
   - Add these properties:
     - `Name` (Title type)
     - `Transcript` (Text type)
     - `Summary` (Text type)

3. **Get the Database ID**
   - Open your database in Notion
   - Copy the URL
   - The database ID is the 32-character string after the last `/` and before any `?` or `#`
   - Example: `https://notion.so/workspace/Database-23ef2688cd848046b0000e38a01825f8` → ID: `23ef2688cd848046b0000e38a01825f8`

4. **Connect Integration to Database**
   - Open your database in Notion
   - Click "..." → "Add connections"
   - Select your integration
   - Click "Confirm"

## 🎯 How to Use

1. **Navigate to the Record Page**
   - Click "🎤 Start Recording" on the homepage
   - Or go directly to `/record`

2. **Record Your Meeting**
   - Click "Start Recording" to begin
   - Speak clearly into your microphone
   - **Multiple speakers are automatically detected and labeled**
   - Click "Stop Recording" when finished

3. **Wait for Processing**
   - The app will show "Transcribing..." while processing
   - This may take 15-45 seconds depending on audio length
   - Processing includes: transcription → speaker diarization → summarization

4. **Review Results**
   - View the full transcript with speaker labels (Speaker 1, Speaker 2, etc.)
   - Read the AI-generated summary
   - Both are displayed in a clean, readable format

5. **Save to Notion**
   - Click "📝 Save to Notion" to store the results
   - A new page will be created in your Notion database
   - You'll see a success message when complete

## 🏗️ Project Structure

```
notion-summarizer/
├── app/
│   ├── api/
│   │   ├── transcribe-and-summarise/route.ts  # OpenAI API endpoint
│   │   ├── push-to-notion/route.ts            # Notion API endpoint
│   │   └── test-env/route.ts                  # Environment test endpoint
│   ├── record/
│   │   └── page.tsx                           # Recording page
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                               # Homepage
├── components/
│   ├── Recorder.tsx                           # Audio recording component
│   └── SummaryCard.tsx                        # Results display component
├── lib/
│   ├── openai.ts                              # OpenAI API functions (with speaker diarization)
│   └── notion.ts                              # Notion API functions
├── .env                                       # Environment variables
└── README.md
```

## 🔧 API Endpoints

### `/api/transcribe-and-summarise`
- **Method**: POST
- **Body**: FormData with audio file
- **Returns**: `{ transcript: string, summary: string }`
- **Features**: Whisper transcription + GPT-4 speaker diarization + GPT-4 summarization

### `/api/push-to-notion`
- **Method**: POST
- **Body**: `{ transcript: string, summary: string }`
- **Returns**: `{ success: boolean }`

### `/api/test-env`
- **Method**: GET
- **Returns**: Environment variable status for debugging

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | `sk-...` |
| `NOTION_API_KEY` | Your Notion integration token | `secret_...` |
| `NOTION_DATABASE_ID` | Your Notion database ID | `23ef2688cd848046b0000e38a01825f8` |

## 🔒 Security

- API keys are stored in environment variables
- All API calls are made server-side via Next.js API routes
- No sensitive data is exposed to the client
- Audio processing happens securely on the server

## 🎤 Speaker Diarization

The app now automatically identifies different speakers in your meetings:

- **Automatic Detection**: GPT-4 analyzes conversation patterns to identify speaker changes
- **Speaker Labels**: Each speaker is labeled as "Speaker 1", "Speaker 2", etc.
- **Visual Formatting**: Speaker labels are highlighted in the transcript display
- **Fallback**: If speaker detection fails, the raw transcript is still provided

## 🐛 Troubleshooting

### Common Issues

**"Missing OpenAI API key"**
- Check that `OPENAI_API_KEY` is set in your `.env` file
- Ensure the key starts with `sk-`

**"Missing Notion API key"**
- Check that `NOTION_API_KEY` is set in your `.env` file
- Ensure the key starts with `secret_`

**"Database access failed"**
- Verify your Notion integration has access to the database
- Check that the database ID is exactly 32 characters
- Ensure the integration is connected to the database

**"Property validation error"**
- Make sure your Notion database has the required properties:
  - `Name` (Title type)
  - `Transcript` (Text type)
  - `Summary` (Text type)

**"Speaker diarization not working"**
- This is normal for very short recordings or single-speaker content
- The app will fallback to the raw transcript if speaker detection fails
- Longer conversations with multiple speakers work best

### Debug Tools

- Visit `/api/test-env` to check environment variables
- Visit `/api/test-notion` to test Notion integration
- Check browser console and server logs for detailed error messages

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review the debug endpoints
3. Open an issue on GitHub

---

**Happy meeting summarizing! 🎉**
