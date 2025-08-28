/**
 * Simple Tally Service for Form Submissions and Email Notifications
 * 
 * This service handles:
 * - Submitting form data to Tally
 * - Sending simple emails using Resend (without React Email templates)
 * - Form validation and error handling
 */

import { Resend } from 'resend';

class TallyServiceSimple {
  constructor() {
    // Tally form configuration
    this.tallyFormId = process.env.TALLY_FORM_ID || 'w2jbzj';
    this.adminEmail = process.env.ADMIN_EMAIL || 'admin@compt.ai';
    
    // Initialize Resend
    this.resend = null;
    this.fromEmail = process.env.FROM_EMAIL || 'hello@compt.ai';
    this.replyToEmail = process.env.REPLY_TO_EMAIL || 'support@compt.ai';
    
    // Initialize Resend service
    if (process.env.RESEND_API_KEY) {
      this.resend = new Resend(process.env.RESEND_API_KEY);
      console.log('✅ Resend initialized');
    } else {
      console.warn('⚠️ RESEND_API_KEY not found - emails will be skipped');
    }
    
    // Tally API base URL
    this.tallyApiBase = 'https://tally.so/api/forms';
    
    console.log('✅ Simple Tally service initialized');
    console.log(`📋 Form ID: ${this.tallyFormId}`);
    console.log(`👤 Admin notifications: ${this.adminEmail}`);
    console.log(`📧 From email: ${this.fromEmail}`);
  }

  /**
   * Submit email form data to Tally and handle email notifications
   */
  async submitEmailForm(formData) {
    const { email, feedback, source } = formData;

    // Validate required fields
    if (!email || !email.includes('@')) {
      throw new Error('Valid email address is required');
    }

    console.log('📤 Processing Tally form submission:', { 
      email, 
      hasFeedback: !!feedback,
      source: source || 'website'
    });

    try {
      // Step 1: Submit to Tally form
      const tallyResult = await this.submitToTally({
        email,
        feedback,
        source
      });

      console.log('✅ Submitted to Tally successfully');

      // Step 2: Send confirmation email to user
      let userEmailResult = null;
      if (this.resend) {
        try {
          userEmailResult = await this.sendUserConfirmationEmail(email);
          console.log('✅ User confirmation email sent');
        } catch (emailError) {
          console.warn('⚠️ Failed to send user confirmation email:', emailError.message);
        }
      }

      // Step 3: Send notification email to admin
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
        message: 'Form submitted successfully',
        data: {
          email,
          submittedAt: new Date().toISOString(),
          source: source || 'website'
        },
        tally: {
          success: true,
          response: tallyResult
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
   * Submit form data to Tally
   */
  async submitToTally(data) {
    const { email, feedback, source } = data;

    try {
      const tallyUrl = `${this.tallyApiBase}/${this.tallyFormId}/responses`;
      
      // Prepare form fields for Tally
      const formFields = {
        email: email
      };

      // Add optional fields if provided
      if (feedback) {
        formFields.feedback = feedback;
      }
      
      if (source) {
        formFields.source = source;
      }

      const response = await fetch(tallyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          fields: formFields
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Tally API error (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      console.log('📋 Tally submission successful');

      return result;

    } catch (error) {
      console.error('❌ Tally submission failed:', error);
      throw new Error(`Failed to submit to Tally: ${error.message}`);
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
              <li>User has been added to Tally form responses</li>
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

      const text = `
        New COMPT Waitlist Signup: ${userEmail}
        
        Submission Details:
        - Email: ${userEmail}
        - Source: ${source || 'Website'}
        - Submitted At: ${new Date(submittedAt).toLocaleString()}
        
        ${feedback ? `Feedback/Message:\n${feedback}\n\n` : ''}
        
        Next Steps:
        - User has been added to Tally form responses
        - A welcome email has been sent to the user
        - Consider following up based on their feedback
        
        This notification was sent automatically by your COMPT waitlist system.
      `;

      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to: [this.adminEmail],
        subject: subject,
        html: html,
        text: text,
        reply_to: this.replyToEmail
      });

      return result.data || result;

    } catch (error) {
      console.error('❌ Failed to send admin notification email:', error);
      throw new Error(`Admin notification email failed: ${error.message}`);
    }
  }

  /**
   * Test the service
   */
  async testService(testEmail) {
    if (!testEmail || !testEmail.includes('@')) {
      throw new Error('Valid test email address is required');
    }

    try {
      console.log('🧪 Testing Tally service with email:', testEmail);

      const result = await this.submitEmailForm({
        email: testEmail,
        feedback: 'This is a test submission from the Tally service.',
        source: 'api_test'
      });

      console.log('✅ Tally service test completed successfully');
      return result;

    } catch (error) {
      console.error('❌ Tally service test failed:', error);
      throw new Error(`Test failed: ${error.message}`);
    }
  }

  /**
   * Get service status
   */
  getServiceStatus() {
    return {
      initialized: true,
      tallyFormId: this.tallyFormId,
      adminEmail: this.adminEmail,
      fromEmail: this.fromEmail,
      tallyApiBase: this.tallyApiBase,
      resendConfigured: !!this.resend,
      emailServiceAvailable: !!this.resend,
      status: 'active'
    };
  }
}

// Create and export singleton instance
const tallyServiceSimple = new TallyServiceSimple();
export { tallyServiceSimple };
