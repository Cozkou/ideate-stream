/**
 * Email-Only Service for Form Submissions
 * 
 * This service handles email notifications without Tally integration
 * - Sends confirmation emails to users
 * - Sends notification emails to admin
 */

import { Resend } from 'resend';

class EmailOnlyService {
  constructor() {
    this.adminEmail = process.env.ADMIN_EMAIL || 'admin@compt.ai';
    
    // Initialize Resend
    this.resend = null;
    this.fromEmail = process.env.FROM_EMAIL || 'hello@compt.ai';
    this.replyToEmail = process.env.REPLY_TO_EMAIL || 'support@compt.ai';
    
    // Initialize Resend service
    if (process.env.RESEND_API_KEY) {
      this.resend = new Resend(process.env.RESEND_API_KEY);
      console.log('✅ Resend initialized with key:', process.env.RESEND_API_KEY.substring(0, 10) + '...');
    } else {
      console.warn('⚠️ RESEND_API_KEY not found - emails will be skipped');
    }
    
    console.log('✅ Email-only service initialized');
    console.log(`👤 Admin notifications: ${this.adminEmail}`);
    console.log(`📧 From email: ${this.fromEmail}`);
  }

  /**
   * Submit email form data and handle email notifications
   */
  async submitEmailForm(formData) {
    const { email, feedback, source } = formData;

    // Validate required fields
    if (!email || !email.includes('@')) {
      throw new Error('Valid email address is required');
    }

    console.log('📤 Processing email form submission:', { 
      email, 
      hasFeedback: !!feedback,
      source: source || 'website'
    });

    try {
      // Send confirmation email to user
      let userEmailResult = null;
      if (this.resend) {
        try {
          userEmailResult = await this.sendUserConfirmationEmail(email);
          console.log('✅ User confirmation email sent');
        } catch (emailError) {
          console.warn('⚠️ Failed to send user confirmation email:', emailError.message);
        }
      }

      // Send notification email to admin
      let adminEmailResult = null;
      if (this.resend) {
        try {
          adminEmailResult = await this.sendAdminNotificationEmail({
            userEmail: email,
            feedback,
            source,
            submittedAt: new Date().toISOString()
          });
          console.log('✅ Admin notification email sent');
        } catch (emailError) {
          console.warn('⚠️ Failed to send admin notification email:', emailError.message);
        }
      }

      return {
        success: true,
        message: 'Form submitted successfully! Check your email for confirmation.',
        data: {
          email,
          submittedAt: new Date().toISOString(),
          source: source || 'website'
        },
        emails: {
          userConfirmation: {
            success: !!userEmailResult,
            emailId: userEmailResult?.id || null,
            error: !userEmailResult ? 'Resend not configured or failed to send' : null
          },
          adminNotification: {
            success: !!adminEmailResult,
            emailId: adminEmailResult?.id || null,
            error: !adminEmailResult ? 'Resend not configured or failed to send' : null
          }
        }
      };

    } catch (error) {
      console.error('❌ Error processing form submission:', error);
      throw new Error(`Form submission failed: ${error.message}`);
    }
  }

  /**
   * Send simple confirmation email to the user
   */
  async sendUserConfirmationEmail(userEmail) {
    if (!this.resend) {
      throw new Error('Resend not configured');
    }

    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0891b2;">Welcome to COMPT!</h2>
          <p>Thank you for joining our waitlist. We're excited to have you on board!</p>
          <p>You'll be among the first to know when COMPT launches and get early access to our collaborative AI ideation platform.</p>
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0891b2;">What's Next?</h3>
            <ul>
              <li>We'll send you updates as we get closer to launch</li>
              <li>You'll get early access when we're ready</li>
              <li>Follow us for the latest updates</li>
            </ul>
          </div>
          <p>Best regards,<br/>The COMPT Team</p>
          <hr style="margin: 30px 0; border: 0; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">
            This email was sent because you signed up for the COMPT waitlist.
          </p>
        </div>
      `;

      const text = `
        Welcome to COMPT!
        
        Thank you for joining our waitlist. We're excited to have you on board!
        
        You'll be among the first to know when COMPT launches and get early access to our collaborative AI ideation platform.
        
        What's Next?
        - We'll send you updates as we get closer to launch
        - You'll get early access when we're ready
        - Follow us for the latest updates
        
        Best regards,
        The COMPT Team
        
        This email was sent because you signed up for the COMPT waitlist.
      `;

      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to: [userEmail],
        subject: 'Welcome to COMPT - You\'re on the waitlist!',
        html: html,
        text: text,
        reply_to: this.replyToEmail
      });

      return result.data || result;

    } catch (error) {
      console.error('❌ Failed to send user confirmation email:', error);
      throw new Error(`User confirmation email failed: ${error.message}`);
    }
  }

  /**
   * Send notification email to admin about new form submission
   */
  async sendAdminNotificationEmail(submissionData) {
    if (!this.resend) {
      throw new Error('Resend not configured');
    }

    const { userEmail, feedback, source, submittedAt } = submissionData;

    try {
      const subject = `🎉 New COMPT Waitlist Signup: ${userEmail}`;
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0891b2; border-bottom: 2px solid #0891b2; padding-bottom: 10px;">
            📧 New Waitlist Signup
          </h2>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0c4a6e;">Submission Details</h3>
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>Source:</strong> ${source || 'Website'}</p>
            <p><strong>Submitted At:</strong> ${new Date(submittedAt).toLocaleString()}</p>
          </div>

          ${feedback ? `
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #92400e;">Feedback/Message</h3>
              <p style="white-space: pre-wrap; font-style: italic;">${feedback}</p>
            </div>
          ` : ''}

          <div style="margin-top: 30px; padding: 20px; background-color: #d1fae5; border-radius: 8px; border-left: 4px solid #10b981;">
            <h3 style="margin-top: 0; color: #065f46;">Next Steps</h3>
            <ul style="color: #065f46;">
              <li>User has been added to your waitlist</li>
              <li>A welcome email has been sent to the user</li>
              <li>Consider following up based on their feedback</li>
            </ul>
          </div>

          <hr style="margin: 30px 0; border: 0; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            This notification was sent automatically by your COMPT waitlist system.
          </p>
        </div>
      `;

      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to: [this.adminEmail],
        subject: subject,
        html: html,
        reply_to: this.replyToEmail
      });

      return result.data || result;

    } catch (error) {
      console.error('❌ Failed to send admin notification email:', error);
      throw new Error(`Admin notification email failed: ${error.message}`);
    }
  }

  /**
   * Get service status
   */
  getServiceStatus() {
    return {
      initialized: true,
      adminEmail: this.adminEmail,
      fromEmail: this.fromEmail,
      resendConfigured: !!this.resend,
      emailServiceAvailable: !!this.resend,
      status: 'active'
    };
  }
}

// Create and export singleton instance
const emailOnlyService = new EmailOnlyService();
export { emailOnlyService };
