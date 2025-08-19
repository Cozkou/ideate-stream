import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import StorageService from './services/storageService.js';
import { agentService } from './services/agentService.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Agentize endpoint: http://localhost:${PORT}/api/agentize`);
});
