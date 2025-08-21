# Email Collection System Setup Guide

This guide will walk you through setting up the complete email collection system with Airtable integration and React Email templates.

## 🎯 Overview

The system consists of:
- **Frontend Form**: Collects email + beta testing preference
- **Airtable Integration**: Stores all email signups with metadata
- **React Email Templates**: Beautiful, responsive welcome emails
- **Resend Service**: Reliable email delivery
- **API Endpoint**: Handles the complete flow

## 📋 Prerequisites

1. **Airtable Account** (Free tier is sufficient)
2. **Resend Account** (Free tier allows 3,000 emails/month)
3. **Domain** (for email sending - can use subdomain)

## 🔧 Step-by-Step Setup

### 1. Airtable Setup

#### Create Your Base
1. Go to [Airtable](https://airtable.com) and create a new base
2. Create a table called **"Email Signups"** (or customize the name)

#### Set Up Table Structure
Your table should have these fields (exact field names are important):

| Field Name | Field Type | Description |
|------------|------------|-------------|
| `Email` | Single line text | Primary field - the email address |
| `Beta Tester` | Checkbox | Whether user opted for beta testing |
| `Source` | Single select | Where signup came from (website, landing_page, etc.) |
| `Signup Date` | Date and time | When user signed up |
| `Status` | Single select | Active, Unsubscribed, Bounced |
| `Welcome Email Sent` | Checkbox | Whether welcome email was delivered |
| `Welcome Email Sent Date` | Date and time | When welcome email was sent |
| `Last Updated` | Date and time | Last modification timestamp |

#### Get Your Credentials
1. **Base ID**: From your base URL: `https://airtable.com/app12345678/tbl87654321`
   - Base ID is the part that starts with `app` (e.g., `app12345678`)
2. **API Key**: Go to [Airtable Account](https://airtable.com/account) → Generate API Key
   - ⚠️ **Important**: Use Personal Access Token (new method) instead of API Key

#### Create Personal Access Token (Recommended)
1. Go to [Airtable Developer Hub](https://airtable.com/developers/web/api/introduction)
2. Create a Personal Access Token with these scopes:
   - `data.records:read`
   - `data.records:write`
   - `schema.bases:read`

### 2. Resend Setup

#### Create Account and Domain
1. Sign up at [Resend](https://resend.com)
2. **Add and verify your domain**:
   - Go to Domains → Add Domain
   - Add DNS records to your domain provider
   - Wait for verification (usually 5-10 minutes)

#### Get API Key
1. Go to API Keys → Create API Key
2. Give it a descriptive name like "COMPT Email Service"
3. Copy the API key (starts with `re_`)

#### Set Up Sending Domain
- Your emails will be sent from addresses like `hello@yourdomain.com`
- Make sure your domain is verified before testing

### 3. Environment Variables Setup

Create or update your `.env` file in the `/backend` directory:

```bash
# Airtable Configuration
AIRTABLE_API_KEY=your_personal_access_token_here
AIRTABLE_BASE_ID=app12345678
AIRTABLE_TABLE_NAME=Email Signups

# Resend Configuration
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=hello@yourdomain.com
REPLY_TO_EMAIL=support@yourdomain.com

# Optional: Customize email settings
# FROM_NAME=COMPT Team
# COMPANY_NAME=COMPT
```

### 4. Testing the Setup

#### Test Email Service
```bash
# Start your backend server
npm run dev

# Test the service status
curl http://localhost:3001/api/email-service/status
```

#### Send Test Email
```bash
curl -X POST http://localhost:3001/api/email-service/test \
  -H "Content-Type: application/json" \
  -d '{
    "testEmail": "your-test-email@gmail.com",
    "templateType": "welcome",
    "isBetaTester": true
  }'
```

#### Test Full Signup Flow
```bash
curl -X POST http://localhost:3001/api/email-signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "isBetaTester": true,
    "firstName": "Test User",
    "source": "landing_page"
  }'
```

## 🎨 Frontend Integration

Here's how to integrate with your frontend form:

```javascript
// Frontend form submission example
const handleEmailSignup = async (formData) => {
  try {
    const response = await fetch('/api/email-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        isBetaTester: formData.betaTesting, // true/false from checkbox
        firstName: formData.firstName, // optional
        source: 'landing_page' // track where signup came from
      })
    });

    const result = await response.json();
    
    if (result.success) {
      // Show success message
      console.log('Signup successful!', result);
    } else {
      // Handle errors (duplicate email, validation, etc.)
      console.error('Signup failed:', result.error);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

## 📊 Monitoring and Analytics

### Service Health Check
Monitor your services with:
```bash
GET /api/email-service/status
```

### Airtable Dashboard
- Use Airtable's built-in views to segment users
- Create views for Beta Testers vs Regular Users
- Track email delivery status
- Export data for external analytics

### Email Analytics
- Resend provides delivery, open, and click tracking
- Access via Resend dashboard or API
- Set up webhooks for real-time events

## 🔒 Security Considerations

### Environment Variables
- Never commit API keys to version control
- Use different keys for development/production
- Rotate keys periodically

### Rate Limiting
Consider adding rate limiting to prevent abuse:

```javascript
// Add to your middleware
const rateLimit = require('express-rate-limit');

const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 signups per IP per 15 minutes
  message: 'Too many signups from this IP'
});

app.post('/api/email-signup', signupLimiter, async (req, res) => {
  // ... existing code
});
```

### Input Validation
The system includes validation, but consider adding:
- Email format validation on frontend
- Honeypot fields for bot protection
- CAPTCHA for high-volume sites

## 🚀 Production Deployment

### Environment Setup
1. Set all environment variables on your hosting platform
2. Ensure domain DNS is properly configured
3. Test email delivery in production environment

### Monitoring
- Set up logging for email delivery failures
- Monitor Airtable API rate limits
- Track signup conversion rates

### Backup Strategy
- Airtable provides automatic backups
- Consider exporting data regularly
- Have a plan for service downtime

## 🎯 Email Templates Customization

### Modifying Templates
Templates are in `/backend/emails/templates/`:
- `WelcomeBeta.jsx` - For beta testers
- `WelcomeRegular.jsx` - For regular users

### Adding New Templates
1. Create new `.jsx` file in templates folder
2. Add to `/backend/emails/templates/index.js`
3. Update email service to use new template

### Styling Guidelines
- Use inline styles (email client compatibility)
- Test across multiple email clients
- Ensure mobile responsiveness
- Include plain text version

## 🛠️ Troubleshooting

### Common Issues

#### "AIRTABLE_API_KEY environment variable is required"
- Check your `.env` file exists and has the correct key
- Restart your server after adding environment variables

#### "Failed to verify domain" (Resend)
- Check DNS records are correctly added
- Wait up to 24 hours for DNS propagation
- Use DNS checker tools to verify records

#### "Template 'welcomeBeta' not found"
- Ensure React Email templates are properly imported
- Check file extensions (.jsx vs .js)
- Verify template names in index.js

#### Email not sending
1. Check Resend dashboard for delivery status
2. Verify FROM_EMAIL domain is verified
3. Check recipient email isn't in spam folder
4. Review server logs for error details

### Debug Mode
Enable detailed logging by setting:
```bash
NODE_ENV=development
DEBUG=email:*
```

## 📈 Next Steps

### Advanced Features to Consider
1. **Email Automation**: Set up drip campaigns for beta testers
2. **Segmentation**: Create user segments based on behavior
3. **A/B Testing**: Test different email templates
4. **Webhooks**: Handle email events (opens, clicks, bounces)
5. **Unsubscribe Flow**: Add unsubscribe management
6. **Admin Dashboard**: Build interface for managing subscribers

### Analytics Integration
- Google Analytics events for signups
- Mixpanel/Amplitude for user tracking
- Custom dashboard for email metrics

## 🆘 Support

If you run into issues:
1. Check the server logs for error details
2. Verify all environment variables are set
3. Test each service independently
4. Check the status endpoints for service health

## 📚 Additional Resources

- [Airtable API Documentation](https://airtable.com/developers/web/api/introduction)
- [Resend Documentation](https://resend.com/docs)
- [React Email Documentation](https://react.email/docs/introduction)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**🎉 You're all set!** Your email collection system is ready to handle signups, store data, and send beautiful welcome emails based on user preferences.
