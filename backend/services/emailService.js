import { Resend } from 'resend';
import { render } from '@react-email/render';
import { templates, getTemplateSubject } from '../emails/templates/index.js';

/**
 * Email Service using Resend
 * 
 * This service handles:
 * - Sending welcome emails using React Email templates
 * - Template rendering to HTML and plain text
 * - Email delivery tracking and error handling
 * - Different email types based on user preferences
 * 
 * SETUP REQUIRED:
 * - RESEND_API_KEY: Your Resend API key
 * - FROM_EMAIL: The email address emails will be sent from (must be verified in Resend)
 * - REPLY_TO_EMAIL: Optional reply-to email address
 */
class EmailService {
  constructor() {
    this.resend = null;
    this.fromEmail = process.env.FROM_EMAIL || 'hello@compt.ai';
    this.replyToEmail = process.env.REPLY_TO_EMAIL || 'support@compt.ai';
    this.initialize();
  }

  /**
   * Initialize Resend service
   * Validates required environment variables and creates Resend instance
   */
  initialize() {
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY environment variable is required');
      throw new Error('RESEND_API_KEY environment variable is required');
    }

    try {
      // Initialize Resend with API key
      this.resend = new Resend(process.env.RESEND_API_KEY);
      
      console.log('✅ Email service initialized successfully');
      console.log(`📧 Sending from: ${this.fromEmail}`);
      console.log(`↩️ Reply to: ${this.replyToEmail}`);
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error.message);
      throw error;
    }
  }

  /**
   * Render a React Email template to HTML and plain text
   * @param {string} templateName - Name of the template to render
   * @param {Object} props - Props to pass to the template component
   * @returns {Promise<Object>} - Object containing html and text versions
   */
  async renderTemplate(templateName, props = {}) {
    try {
      const Template = templates[templateName];
      
      if (!Template) {
        throw new Error(`Template '${templateName}' not found`);
      }

      console.log(`🎨 Rendering template: ${templateName}`);

      // Render template to HTML
      const html = await render(Template(props));
      
      // Render template to plain text (fallback for email clients that don't support HTML)
      const text = await render(Template(props), { plainText: true });

      return { html, text };
    } catch (error) {
      console.error('❌ Error rendering template:', error);
      throw new Error(`Failed to render template '${templateName}': ${error.message}`);
    }
  }

  /**
   * Send a welcome email based on user preferences
   * @param {Object} emailData - Email recipient and content data
   * @param {string} emailData.email - Recipient email address
   * @param {boolean} emailData.isBetaTester - Whether the user is a beta tester
   * @param {string} [emailData.firstName] - Optional first name for personalization
   * @returns {Promise<Object>} - Email sending result
   */
  async sendWelcomeEmail(emailData) {
    const { email, isBetaTester, firstName } = emailData;

    // Validate required fields
    if (!email || !email.includes('@')) {
      throw new Error('Valid email address is required');
    }

    if (typeof isBetaTester !== 'boolean') {
      throw new Error('isBetaTester must be a boolean value');
    }

    try {
      // Determine which template to use based on beta tester status
      const templateName = isBetaTester ? 'welcomeBeta' : 'welcomeRegular';
      const subject = getTemplateSubject(templateName);

      console.log(`📤 Sending ${templateName} welcome email to: ${email}`);

      // Prepare template props
      const templateProps = {
        userEmail: email,
        firstName: firstName || null,
      };

      // Render the template
      const { html, text } = await this.renderTemplate(templateName, templateProps);

      // Prepare email data for Resend
      const emailPayload = {
        from: this.fromEmail,
        to: [email],
        subject: subject,
        html: html,
        text: text,
        reply_to: this.replyToEmail,
        // Add tags for tracking and analytics
        tags: [
          { name: 'campaign', value: 'welcome' },
          { name: 'user_type', value: isBetaTester ? 'beta_tester' : 'regular' },
          { name: 'template', value: templateName }
        ]
      };

      // Send the email using Resend
      const result = await this.resend.emails.send(emailPayload);

      console.log('✅ Email sent successfully:', result.data?.id || result.id);

      return {
        success: true,
        emailId: result.data?.id || result.id,
        templateUsed: templateName,
        recipientEmail: email,
        subject: subject,
        sentAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Error sending welcome email:', error);
      
      // Handle specific Resend errors
      if (error.name === 'ResendAPIError') {
        throw new Error(`Email service error: ${error.message}`);
      }

      // Handle template rendering errors
      if (error.message.includes('Failed to render template')) {
        throw error;
      }

      // Generic error
      throw new Error(`Failed to send welcome email: ${error.message}`);
    }
  }

  /**
   * Send a custom email (for future use - admin notifications, updates, etc.)
   * @param {Object} emailData - Email data
   * @param {string|Array} emailData.to - Recipient email address(es)
   * @param {string} emailData.subject - Email subject
   * @param {string} emailData.html - HTML content
   * @param {string} [emailData.text] - Plain text content (optional)
   * @param {Array} [emailData.tags] - Optional tags for tracking
   * @returns {Promise<Object>} - Email sending result
   */
  async sendCustomEmail(emailData) {
    const { to, subject, html, text, tags = [] } = emailData;

    // Validate required fields
    if (!to) {
      throw new Error('Recipient email address is required');
    }

    if (!subject || !html) {
      throw new Error('Subject and HTML content are required');
    }

    try {
      console.log(`📤 Sending custom email to: ${Array.isArray(to) ? to.join(', ') : to}`);
      console.log(`📋 Subject: ${subject}`);

      // Prepare email payload
      const emailPayload = {
        from: this.fromEmail,
        to: Array.isArray(to) ? to : [to],
        subject: subject,
        html: html,
        reply_to: this.replyToEmail,
        tags: [
          { name: 'campaign', value: 'custom' },
          ...tags
        ]
      };

      // Add plain text if provided
      if (text) {
        emailPayload.text = text;
      }

      // Send the email
      const result = await this.resend.emails.send(emailPayload);

      console.log('✅ Custom email sent successfully:', result.data?.id || result.id);

      return {
        success: true,
        emailId: result.data?.id || result.id,
        recipientEmails: Array.isArray(to) ? to : [to],
        subject: subject,
        sentAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Error sending custom email:', error);
      throw new Error(`Failed to send custom email: ${error.message}`);
    }
  }

  /**
   * Get email sending statistics (for monitoring purposes)
   * Note: Resend doesn't provide built-in analytics, but this method can be extended
   * to integrate with external analytics services or databases
   * @returns {Object} - Basic service status
   */
  getServiceStatus() {
    return {
      initialized: !!this.resend,
      fromEmail: this.fromEmail,
      replyToEmail: this.replyToEmail,
      availableTemplates: Object.keys(templates),
      status: 'active'
    };
  }

  /**
   * Test email functionality (useful for health checks)
   * @param {string} testEmail - Email address to send test email to
   * @returns {Promise<Object>} - Test result
   */
  async sendTestEmail(testEmail) {
    if (!testEmail || !testEmail.includes('@')) {
      throw new Error('Valid test email address is required');
    }

    try {
      console.log(`🧪 Sending test email to: ${testEmail}`);

      const emailPayload = {
        from: this.fromEmail,
        to: [testEmail],
        subject: 'COMPT Email Service Test',
        html: `
          <h2>Email Service Test</h2>
          <p>This is a test email to verify that the COMPT email service is working correctly.</p>
          <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
          <p><strong>Service status:</strong> ✅ Active</p>
        `,
        text: `
          Email Service Test
          
          This is a test email to verify that the COMPT email service is working correctly.
          
          Sent at: ${new Date().toISOString()}
          Service status: ✅ Active
        `,
        tags: [
          { name: 'campaign', value: 'test' },
          { name: 'purpose', value: 'health_check' }
        ]
      };

      const result = await this.resend.emails.send(emailPayload);

      console.log('✅ Test email sent successfully:', result.data?.id || result.id);

      return {
        success: true,
        emailId: result.data?.id || result.id,
        testEmail: testEmail,
        sentAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Test email failed:', error);
      throw new Error(`Test email failed: ${error.message}`);
    }
  }
}

// Create and export singleton instance
const emailService = new EmailService();
export { emailService };
