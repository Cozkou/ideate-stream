import express from 'express';
import cors from 'cors';
import session from 'express-session';
import multer from 'multer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { pdfService } from './services/pdfService.js';
import { openaiService } from './services/openaiService.js';
import StorageService from './services/storageService.js';
import { agentService } from './services/agentService.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and text files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize storage service with session
app.use((req, res, next) => {
  req.storage = new StorageService(req.session);
  next();
});

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Upload PDF and process
app.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    console.log('Processing PDF upload:', req.file.originalname);

    // Extract text from PDF
    const extractedText = await pdfService.extractText(req.file.buffer);
    
    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from PDF' });
    }

    // Summarize with OpenAI
    const summary = await openaiService.summarizeText(extractedText);

    // Store in session storage
    const storageKey = req.storage.storePdfSummary({
      filename: req.file.originalname,
      originalText: extractedText,
      summary: summary,
      uploadedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'PDF processed successfully',
      storageKey: storageKey,
      filename: req.file.originalname,
      summary: summary,
      originalTextLength: extractedText.length
    });

  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ 
      error: 'Failed to process PDF', 
      details: error.message 
    });
  }
});

// Upload text file
app.post('/upload-text', upload.single('textFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No text file uploaded' });
    }

    console.log('Processing text file upload:', req.file.originalname);

    const textContent = req.file.buffer.toString('utf-8');

    // Store in session storage (no summarization needed)
    const storageKey = req.storage.storeText({
      filename: req.file.originalname,
      content: textContent,
      type: 'file_upload',
      uploadedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Text file processed successfully',
      storageKey: storageKey,
      filename: req.file.originalname,
      contentLength: textContent.length
    });

  } catch (error) {
    console.error('Error processing text file:', error);
    res.status(500).json({ 
      error: 'Failed to process text file', 
      details: error.message 
    });
  }
});

// Handle pasted text
app.post('/paste-text', async (req, res) => {
  try {
    const { text, title } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'No text content provided' });
    }

    console.log('Processing pasted text, length:', text.length);

    // Store in session storage
    const storageKey = req.storage.storeText({
      title: title || 'Pasted Text',
      content: text.trim(),
      type: 'paste',
      uploadedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Text stored successfully',
      storageKey: storageKey,
      contentLength: text.length
    });

  } catch (error) {
    console.error('Error storing pasted text:', error);
    res.status(500).json({ 
      error: 'Failed to store text', 
      details: error.message 
    });
  }
});

// Get stored context data
app.get('/context/:key', (req, res) => {
  try {
    const key = req.params.key;
    const data = req.storage.getContext(key);

    if (!data) {
      return res.status(404).json({ error: 'Context not found' });
    }

    res.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Error retrieving context:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve context', 
      details: error.message 
    });
  }
});

// List all stored context
app.get('/context', (req, res) => {
  try {
    const allContext = req.storage.getAllContext();
    
    res.json({
      success: true,
      contexts: allContext
    });

  } catch (error) {
    console.error('Error listing contexts:', error);
    res.status(500).json({ 
      error: 'Failed to list contexts', 
      details: error.message 
    });
  }
});

// COMPT Agent Generation Routes

// Generate agent team from goal
app.post('/api/agentize', async (req, res) => {
  try {
    const { goal, maxAgents } = req.body;

    if (!goal || goal.trim().length === 0) {
      return res.status(400).json({ error: 'Goal is required' });
    }

    const maxAgentsNum = Math.min(Math.max(parseInt(maxAgents) || 5, 3), 7);

    console.log(`Generating agent team for goal: "${goal}" (max: ${maxAgentsNum})`);

    // Generate the agent team
    const result = await agentService.generateAgentTeam(goal, maxAgentsNum);
    
    if (!result || !result.team) {
      return res.status(500).json({ error: 'Failed to generate agent team' });
    }

    // Store the team in session storage
    const teamId = req.storage.storeAgentTeam(result.team);

    res.json({
      success: true,
      team: result.team,
      message: `Generated team with ${result.team.agents.length} agents`,
      teamId: teamId
    });

  } catch (error) {
    console.error('Error in /api/agentize:', error);
    res.status(500).json({ 
      error: 'Failed to generate agent team', 
      details: error.message 
    });
  }
});

// Get COMPT space (for sessionStorage sync)
app.get('/api/compt/space', (req, res) => {
  try {
    const space = req.storage.getComptSpace();
    
    res.json({
      success: true,
      space: space
    });

  } catch (error) {
    console.error('Error getting COMPT space:', error);
    res.status(500).json({ 
      error: 'Failed to get COMPT space', 
      details: error.message 
    });
  }
});

// Update COMPT space (from sessionStorage)
app.put('/api/compt/space', (req, res) => {
  try {
    const { space } = req.body;
    
    if (!space) {
      return res.status(400).json({ error: 'Space data is required' });
    }

    const updated = req.storage.updateComptSpace(space);
    
    if (!updated) {
      return res.status(400).json({ error: 'Invalid space data format' });
    }

    res.json({
      success: true,
      message: 'COMPT space updated successfully'
    });

  } catch (error) {
    console.error('Error updating COMPT space:', error);
    res.status(500).json({ 
      error: 'Failed to update COMPT space', 
      details: error.message 
    });
  }
});

// Get specific agent team
app.get('/api/compt/team/:teamId', (req, res) => {
  try {
    const { teamId } = req.params;
    const team = req.storage.getAgentTeam(teamId);
    
    if (!team) {
      return res.status(404).json({ error: 'Agent team not found' });
    }

    res.json({
      success: true,
      team: team
    });

  } catch (error) {
    console.error('Error getting agent team:', error);
    res.status(500).json({ 
      error: 'Failed to get agent team', 
      details: error.message 
    });
  }
});

// Get all agent teams
app.get('/api/compt/teams', (req, res) => {
  try {
    const teams = req.storage.getAllAgentTeams();
    
    res.json({
      success: true,
      teams: teams,
      count: teams.length
    });

  } catch (error) {
    console.error('Error getting agent teams:', error);
    res.status(500).json({ 
      error: 'Failed to get agent teams', 
      details: error.message 
    });
  }
});

// Delete agent team
app.delete('/api/compt/team/:teamId', (req, res) => {
  try {
    const { teamId } = req.params;
    const deleted = req.storage.deleteAgentTeam(teamId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Agent team not found' });
    }

    res.json({
      success: true,
      message: 'Agent team deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting agent team:', error);
    res.status(500).json({ 
      error: 'Failed to delete agent team', 
      details: error.message 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum 10MB allowed.' });
    }
    return res.status(400).json({ error: error.message });
  }
  
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
