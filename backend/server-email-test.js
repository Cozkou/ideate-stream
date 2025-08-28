import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { tallyServiceSimple as tallyService } from './services/tallyServiceSimple.js';

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
  res.json({ status: 'OK', message: 'Email test server is running' });
});

// Tally form submission endpoint
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

    console.log('📝 Processing Tally form submission:', { 
      email, 
      hasFeedback: !!feedback,
      source: source || 'website'
    });

    // Process the form submission through Tally service
    const result = await tallyService.submitEmailForm({
      email,
      feedback,
      source: source || 'website'
    });

    console.log('✅ Tally form submission processed successfully');

    // Return success response
    res.json({
      success: true,
      message: 'Thank you! Your submission has been received.',
      data: result.data,
      services: {
        tally: result.tally,
        emails: result.emails
      }
    });

  } catch (error) {
    console.error('❌ Error processing Tally form submission:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process form submission', 
      details: error.message 
    });
  }
});

// Tally service status
app.get('/api/tally/status', (req, res) => {
  try {
    const tallyStatus = tallyService.getServiceStatus();
    
    res.json({
      success: true,
      service: 'tally',
      ...tallyStatus,
      environment: {
        hasTallyFormId: !!process.env.TALLY_FORM_ID,
        hasAdminEmail: !!process.env.ADMIN_EMAIL,
        hasResendKey: !!process.env.RESEND_API_KEY,
        emailServiceAvailable: tallyStatus.emailServiceAvailable
      }
    });

  } catch (error) {
    console.error('Error getting Tally service status:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get Tally service status', 
      details: error.message 
    });
  }
});

// Test Tally service
app.post('/api/tally/test', async (req, res) => {
  try {
    const { testEmail } = req.body;

    if (!testEmail || !testEmail.includes('@')) {
      return res.status(400).json({ 
        success: false,
        error: 'Valid test email address is required' 
      });
    }

    console.log('🧪 Testing Tally service integration');

    // Test the complete Tally service flow
    const result = await tallyService.testService(testEmail);

    res.json({
      success: true,
      message: 'Tally service test completed successfully',
      result: result
    });

  } catch (error) {
    console.error('Error testing Tally service:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to test Tally service', 
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
  console.log(`🚀 Email test server running on port ${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📧 Ready to test Tally email integration!`);
});
