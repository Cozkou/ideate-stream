# Ideate Stream Backend

This backend service handles PDF content extraction, text processing, and OpenAI-powered summarization for the Ideate Stream application.

## Features

- **PDF Upload & Processing**: Extract text content from PDF files
- **OpenAI Summarization**: Automatically summarize PDF content using GPT-3.5-turbo
- **Text File Upload**: Handle plain text file uploads
- **Text Paste**: Store pasted text content
- **Session Storage**: Store all processed content with findable keys
- **Context Retrieval**: Easy access to stored content for later use
- **Email Collection**: Tally form integration with automated email notifications
- **Agent Team Generation**: COMPT agent team creation and management

## Quick Start

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**:
   Create a `.env` file in the backend directory:
   ```env
   # Core Configuration
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001
   NODE_ENV=development
   SESSION_SECRET=your_session_secret_here
   
   # Email Service (Optional - for email collection)
   RESEND_API_KEY=re_your_api_key_here
   FROM_EMAIL=hello@yourdomain.com
   REPLY_TO_EMAIL=support@yourdomain.com
   
   # Tally Integration (Optional - for form submissions)
   TALLY_FORM_ID=your_tally_form_id
   ADMIN_EMAIL=admin@yourdomain.com
   
   # Airtable Integration (Optional - for data storage)
   AIRTABLE_API_KEY=your_airtable_api_key
   AIRTABLE_BASE_ID=your_base_id
   AIRTABLE_TABLE_NAME=Email Signups
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

### Tally Form Submission
- **POST** `/api/tally-submit`
- Submit email forms via Tally integration with automated emails
- **Body**: 
  ```json
  {
    "email": "user@example.com",
    "feedback": "Optional feedback message",
    "source": "landing_page"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Thank you! Your submission has been received.",
    "data": {
      "email": "user@example.com",
      "submittedAt": "2024-01-15T10:30:00.000Z",
      "source": "landing_page"
    },
    "services": {
      "tally": {"success": true},
      "emails": {
        "userConfirmation": {"success": true, "emailId": "..."},
        "adminNotification": {"success": true, "emailId": "..."}
      }
    }
  }
  ```

### Email Service Status
- **GET** `/api/email-service/status`
- Check email service configuration and status

### Tally Service Status  
- **GET** `/api/tally/status`
- Check Tally integration configuration and status

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
│   ├── storageService.js  # Session storage management
│   ├── emailService.js    # Email sending via Resend
│   ├── tallyService.js    # Tally form integration
│   ├── airtableService.js # Airtable data storage
│   └── agentService.js    # COMPT agent generation
├── emails/
│   └── templates/         # React Email templates
├── EMAIL_SETUP.md         # Email service setup guide
├── TALLY_SETUP.md         # Tally integration setup guide
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

# Test Tally form submission
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","feedback":"Test message","source":"api_test"}' \
  http://localhost:3001/api/tally-submit

# Test email service status
curl http://localhost:3001/api/email-service/status

# Test Tally service status  
curl http://localhost:3001/api/tally/status
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
