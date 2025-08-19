# Ideate Stream Backend

This backend service handles PDF content extraction, text processing, and OpenAI-powered summarization for the Ideate Stream application.

## Features

- **PDF Upload & Processing**: Extract text content from PDF files
- **OpenAI Summarization**: Automatically summarize PDF content using GPT-3.5-turbo
- **Text File Upload**: Handle plain text file uploads
- **Text Paste**: Store pasted text content
- **Session Storage**: Store all processed content with findable keys
- **Context Retrieval**: Easy access to stored content for later use

## Quick Start

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**:
   Create a `.env` file in the backend directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001
   NODE_ENV=development
   SESSION_SECRET=your_session_secret_here
   ```

3. **Start the Server**:
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

4. **Test the Server**:
   Visit `http://localhost:3001/health` to verify the server is running.

## API Endpoints

### Upload PDF
- **POST** `/upload-pdf`
- Upload a PDF file for text extraction and summarization
- **Body**: Form data with `pdf` file field
- **Response**: 
  ```json
  {
    "success": true,
    "message": "PDF processed successfully",
    "storageKey": "pdf_filename_1234567890_abcd",
    "filename": "document.pdf",
    "summary": "AI-generated summary...",
    "originalTextLength": 5000
  }
  ```

### Upload Text File
- **POST** `/upload-text`
- Upload a text file for storage
- **Body**: Form data with `textFile` file field
- **Response**:
  ```json
  {
    "success": true,
    "message": "Text file processed successfully",
    "storageKey": "text_filename_1234567890_abcd",
    "filename": "document.txt",
    "contentLength": 1500
  }
  ```

### Paste Text
- **POST** `/paste-text`
- Store pasted text content
- **Body**: 
  ```json
  {
    "text": "Your pasted text content...",
    "title": "Optional title"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Text stored successfully",
    "storageKey": "text_Pasted_Text_1234567890_abcd",
    "contentLength": 200
  }
  ```

### Retrieve Context
- **GET** `/context/:key`
- Retrieve stored content by storage key
- **Response**: The stored content data

### List All Context
- **GET** `/context`
- List all stored context in the session
- **Response**:
  ```json
  {
    "success": true,
    "contexts": {
      "summary": [...],
      "total": 5,
      "pdfCount": 2,
      "textCount": 3,
      "pdfSummaries": {...},
      "textContent": {...}
    }
  }
  ```

## Storage Keys

The system generates unique, findable storage keys for all content:

- **PDF Summaries**: `pdf_filename_timestamp_random`
- **Text Content**: `text_title_timestamp_random`

These keys can be used to retrieve content later using the `/context/:key` endpoint.

## Configuration

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required for PDF summarization)
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment mode (development/production)
- `SESSION_SECRET`: Secret key for session management
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:5173)

### File Upload Limits

- Maximum file size: 10MB
- Supported PDF types: `application/pdf`
- Supported text types: `text/plain`

## OpenAI Integration

The service uses GPT-3.5-turbo for cost-effective summarization:

- **Model**: `gpt-3.5-turbo`
- **Max Tokens**: 500 (for concise summaries)
- **Temperature**: 0.3 (for consistent results)
- **Text Limit**: 12,000 characters (longer texts are truncated)

## Session Management

All content is stored in server-side sessions:

- Session-based storage (not persistent across server restarts)
- Automatic session cleanup after 24 hours
- Each user session maintains its own context storage

## Error Handling

The API provides detailed error messages for:

- Missing or invalid files
- OpenAI API issues (quota, rate limits, invalid keys)
- PDF processing errors
- File size violations
- Missing required fields

## Development

### Project Structure
```
backend/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── .env                   # Environment configuration
├── services/
│   ├── pdfService.js      # PDF text extraction
│   ├── openaiService.js   # OpenAI integration
│   └── storageService.js  # Session storage management
└── README.md              # This file
```

### Adding New Features

1. Create new service files in the `services/` directory
2. Add routes in `server.js`
3. Update storage service for new data types
4. Test with appropriate error handling

### Testing

Test all endpoints using tools like Postman, curl, or your frontend:

```bash
# Test health check
curl http://localhost:3001/health

# Test PDF upload
curl -X POST -F "pdf=@test.pdf" http://localhost:3001/upload-pdf

# Test text paste
curl -X POST -H "Content-Type: application/json" \
  -d '{"text":"Hello world","title":"Test"}' \
  http://localhost:3001/paste-text
```

## Troubleshooting

### Common Issues

1. **OpenAI API Key**: Ensure your API key is valid and has sufficient quota
2. **File Upload Errors**: Check file size (max 10MB) and type restrictions  
3. **Session Issues**: Sessions are memory-based and reset on server restart
4. **CORS Errors**: Verify `FRONTEND_URL` environment variable

### Logs

The server provides detailed console logging for:
- File uploads and processing
- OpenAI API calls and token usage
- Storage operations
- Error details

All errors include helpful messages to identify and resolve issues quickly.
