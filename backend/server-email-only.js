import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { emailOnlyService } from './services/emailOnlyService.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:8080', // Your frontend URL
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Email server is running' });
});

// Form submission endpoint
app.post('/api/tally-submit', async (req, res) => {
  try {
    const { email, feedback, source } = req.body;

    // Validate required fields
    if (!email || !email.includes('@')) {
      return res.status(400).json({ 
        success: false,
        error: 'Valid email address is required' 
      });
    }

    console.log('📝 Processing form submission:', { 
      email, 
      hasFeedback: !!feedback,
      source: source || 'website'
    });

    // Process the form submission through email service
    const result = await emailOnlyService.submitEmailForm({
      email,
      feedback,
      source: source || 'website'
    });

    console.log('✅ Form submission processed successfully');

    // Return success response
    res.json({
      success: true,
      message: result.message,
      data: result.data,
      emails: result.emails
    });

  } catch (error) {
    console.error('❌ Error processing form submission:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process form submission', 
      details: error.message 
    });
  }
});

// Service status
app.get('/api/tally/status', (req, res) => {
  try {
    const serviceStatus = emailOnlyService.getServiceStatus();
    
    res.json({
      success: true,
      service: 'email-only',
      ...serviceStatus,
      environment: {
        hasAdminEmail: !!process.env.ADMIN_EMAIL,
        hasResendKey: !!process.env.RESEND_API_KEY,
        emailServiceAvailable: serviceStatus.emailServiceAvailable
      }
    });

  } catch (error) {
    console.error('Error getting service status:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get service status', 
      details: error.message 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Email server running on port ${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📧 Ready to handle email submissions!`);
});
