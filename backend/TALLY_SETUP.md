# Tally Integration Setup Guide

This guide will help you set up the Tally form integration that handles email submissions and sends automated emails to both users and admins.

## 🎯 Overview

The Tally integration provides:
- **Form Submission**: Submits emails to your Tally form
- **User Confirmation**: Sends welcome emails to users who submit the form
- **Admin Notifications**: Sends notifications to you when someone submits the form
- **Error Handling**: Graceful handling of failures with proper error messages

## 📋 Prerequisites

1. **Tally Account** (Free tier is sufficient)
2. **Email Service Setup** (Resend + React Email templates)
3. **Environment Variables** configured

## 🔧 Step-by-Step Setup

### 1. Tally Form Setup

#### Create Your Tally Form
1. Go to [Tally](https://tally.so) and create a new form
2. Add the following fields:
   - **Email** (Email field, required)
   - **Feedback** (Long text field, optional)
   - **Source** (Hidden field for tracking, optional)

#### Get Your Form ID
1. From your Tally form URL: `https://tally.so/r/w2jbzj`
2. The Form ID is the part after `/r/`: `w2jbzj`
3. Copy this ID for your environment variables

### 2. Environment Variables Setup

Add these variables to your `.env` file in the `/backend` directory:

```bash
# Tally Configuration
TALLY_FORM_ID=w2jbzj  # Replace with your actual form ID
ADMIN_EMAIL=your-email@yourdomain.com  # Your email for notifications

# Email Service (Required for user confirmations and admin notifications)
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=hello@yourdomain.com
REPLY_TO_EMAIL=support@yourdomain.com
```

### 3. API Endpoints

The integration provides these endpoints:

#### Submit Form
```bash
POST /api/tally-submit
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "feedback": "Optional feedback message",
  "source": "landing_page"
}
```

**Response:**
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
    "tally": {
      "success": true,
      "response": { /* Tally API response */ }
    },
    "emails": {
      "userConfirmation": {
        "success": true,
        "emailId": "email-id-from-resend"
      },
      "adminNotification": {
        "success": true,
        "emailId": "admin-email-id"
      }
    }
  }
}
```

#### Service Status
```bash
GET /api/tally/status
```

#### Test Integration
```bash
POST /api/tally/test
```

**Request Body:**
```json
{
  "testEmail": "test@example.com"
}
```

## 🎨 Frontend Integration

The frontend forms have been updated to use the Tally service:

### Landing Page (`LandingPage.tsx`)
- Email submission form now uses `/api/tally-submit`
- Includes source tracking: `landing_page`
- Improved error handling and user feedback

### Waitlist Page (`WaitlistPage.tsx`)
- Email + feedback form uses `/api/tally-submit`
- Includes source tracking: `waitlist_page`
- Supports optional feedback messages

### Example Frontend Usage
```javascript
const handleSubmit = async (formData) => {
  try {
    const response = await fetch('/api/tally-submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        feedback: formData.feedback, // optional
        source: 'your_page_name'
      })
    });

    const result = await response.json();
    
    if (result.success) {
      // Show success message
      console.log('Form submitted successfully!');
    } else {
      // Handle errors
      console.error('Submission failed:', result.error);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

## 📧 Email Templates

### User Confirmation Email
- Uses existing `WelcomeRegular` template from React Email
- Sent automatically when form is submitted
- Professional welcome message

### Admin Notification Email
- Custom HTML template with submission details
- Includes user email, feedback, source, and timestamp
- Styled for easy reading and action

## 🧪 Testing the Integration

### 1. Test Service Status
```bash
curl http://localhost:3001/api/tally/status
```

### 2. Test Complete Flow
```bash
curl -X POST http://localhost:3001/api/tally/test \
  -H "Content-Type: application/json" \
  -d '{"testEmail": "your-test-email@gmail.com"}'
```

### 3. Test Form Submission
```bash
curl -X POST http://localhost:3001/api/tally-submit \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "feedback": "This is a test submission",
    "source": "api_test"
  }'
```

### 4. Frontend Testing
1. Start your backend: `npm run dev` (in `/backend`)
2. Start your frontend: `npm run dev` (in root)
3. Navigate to the landing page or waitlist page
4. Submit the email form
5. Check your email for the confirmation
6. Check the admin email for the notification

## 🔧 Customization

### Modify Admin Email Template
Edit the `sendAdminNotificationEmail` method in `/backend/services/tallyService.js`:

```javascript
// Customize the HTML template
const html = `
  <div style="font-family: Arial, sans-serif;">
    <!-- Your custom template here -->
  </div>
`;
```

### Add New Form Fields
1. Add fields to your Tally form
2. Update the `submitToTally` method in `tallyService.js`
3. Update frontend forms to include new fields

### Change User Confirmation Email
Modify the `sendUserConfirmationEmail` method to use different templates or create custom content.

## 📊 Monitoring

### Service Health Check
Monitor your integration with:
```bash
GET /api/tally/status
```

### Tally Dashboard
- View submissions in your Tally dashboard
- Export data for analysis
- Set up Tally webhooks for real-time notifications

### Email Analytics
- Use Resend dashboard to monitor email delivery
- Track open rates and click-through rates
- Monitor bounce rates and spam reports

## 🔒 Security Considerations

### Environment Variables
- Never commit API keys to version control
- Use different keys for development/production
- Rotate keys periodically

### Rate Limiting
Consider adding rate limiting to prevent abuse:

```javascript
const rateLimit = require('express-rate-limit');

const tallyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 submissions per IP per 15 minutes
  message: 'Too many form submissions from this IP'
});

app.post('/api/tally-submit', tallyLimiter, async (req, res) => {
  // ... existing code
});
```

### Input Validation
The service includes basic validation, but consider adding:
- Email format validation on frontend
- Honeypot fields for bot protection
- CAPTCHA for high-volume sites

## 🚨 Troubleshooting

### Common Issues

#### "TALLY_FORM_ID environment variable is required"
- Check your `.env` file exists and has the correct form ID
- Restart your server after adding environment variables

#### "Failed to submit to Tally"
- Verify your Tally form ID is correct
- Check that your form is published and accepting submissions
- Test the Tally API directly with curl

#### "User confirmation email failed"
- Ensure your email service (Resend) is properly configured
- Check the EMAIL_SETUP.md guide for email service setup
- Verify your FROM_EMAIL domain is verified in Resend

#### "Admin notification email failed"
- Check that ADMIN_EMAIL environment variable is set
- Verify the admin email address is valid
- Check server logs for specific error details

### Debug Mode
Enable detailed logging by setting:
```bash
NODE_ENV=development
DEBUG=tally:*
```

### Test Individual Components
```bash
# Test Tally submission only
curl -X POST https://tally.so/api/forms/YOUR_FORM_ID/responses \
  -H "Content-Type: application/json" \
  -d '{"fields": {"email": "test@example.com"}}'

# Test email service only
curl -X POST http://localhost:3001/api/email-service/test \
  -H "Content-Type: application/json" \
  -d '{"testEmail": "test@example.com"}'
```

## 🎉 You're All Set!

Your Tally integration is now ready to:
1. ✅ Collect email submissions via your forms
2. ✅ Store them in Tally for management
3. ✅ Send confirmation emails to users
4. ✅ Notify you via email when submissions come in
5. ✅ Handle errors gracefully

The integration provides a complete email collection and notification system that works seamlessly with your existing frontend forms.
