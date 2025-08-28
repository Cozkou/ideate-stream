/**
 * Tally Service for Form Submissions and Email Notifications
 * 
 * This service handles:
 * - Submitting form data to Tally
 * - Sending confirmation emails to users
 * - Sending notification emails to admin
 * - Form validation and error handling
 * 
 * SETUP REQUIRED:
 * - TALLY_FORM_ID: Your Tally form ID
 * - ADMIN_EMAIL: Email address to receive notifications
 * - EMAIL_SERVICE: Must be configured for sending emails
 */

import { emailService } from './emailService.js';

class TallyService {
  constructor() {
    // Tally form configuration
    this.tallyFormId = process.env.TALLY_FORM_ID || 'w2jbzj'; // Default from LandingPage.tsx
    this.adminEmail = process.env.ADMIN_EMAIL || 'admin@compt.ai';
    
    // Tally API base URL
    this.tallyApiBase = 'https://tally.so/api/forms';
    
    console.log('✅ Tally service initialized');
    console.log(`📋 Form ID: ${this.tallyFormId}`);
    console.log(`👤 Admin notifications: ${this.adminEmail}`);
  }

  /**
   * Submit email form data to Tally and handle email notifications
   * @param {Object} formData - Form submission data
   * @param {string} formData.email - User's email address
   * @param {string} [formData.feedback] - Optional feedback/message from user
   * @param {string} [formData.source] - Source of the form submission
   * @returns {Promise<Object>} - Submission result
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
      try {
        userEmailResult = await this.sendUserConfirmationEmail(email);
        console.log('✅ User confirmation email sent');
      } catch (emailError) {
        console.warn('⚠️ Failed to send user confirmation email:', emailError.message);
        // Don't fail the whole process for this
      }

      // Step 3: Send notification email to admin
      let adminEmailResult = null;
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
        // Don't fail the whole process for this
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
            emailId: userEmailResult?.emailId || null,
            error: !userEmailResult ? 'Failed to send' : null
          },
          adminNotification: {
            success: !!adminEmailResult,
            emailId: adminEmailResult?.emailId || null,
            error: !adminEmailResult ? 'Failed to send' : null
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
   * @param {Object} data - Form data to submit
   * @returns {Promise<Object>} - Tally API response
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
   * Send confirmation email to the user
   * @param {string} userEmail - User's email address
   * @returns {Promise<Object>} - Email sending result
   */
  async sendUserConfirmationEmail(userEmail) {
    try {
      // Use the existing welcome email template for regular users
      const result = await emailService.sendWelcomeEmail({
        email: userEmail,
        isBetaTester: false, // Default to regular welcome email
        firstName: null
      });

      return result;

    } catch (error) {
      console.error('❌ Failed to send user confirmation email:', error);
      throw new Error(`User confirmation email failed: ${error.message}`);
    }
  }

  /**
   * Send notification email to admin about new form submission
   * @param {Object} submissionData - Data about the form submission
   * @returns {Promise<Object>} - Email sending result
   */
  async sendAdminNotificationEmail(submissionData) {
    const { userEmail, feedback, source, submittedAt } = submissionData;

    try {
      // Create admin notification email content
      const subject = `New Email Signup: ${userEmail}`;
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            📧 New Email Signup
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #495057;">Submission Details</h3>
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>Source:</strong> ${source || 'Website'}</p>
            <p><strong>Submitted At:</strong> ${new Date(submittedAt).toLocaleString()}</p>
          </div>

          ${feedback ? `
            <div style="background-color: #e9ecef; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #495057;">Feedback/Message</h3>
              <p style="white-space: pre-wrap; font-style: italic;">${feedback}</p>
            </div>
          ` : ''}

          <div style="margin-top: 30px; padding: 20px; background-color: #d4edda; border-radius: 8px; border-left: 4px solid #28a745;">
            <h3 style="margin-top: 0; color: #155724;">Next Steps</h3>
            <ul style="color: #155724;">
              <li>User has been added to your email list via Tally</li>
              <li>A confirmation email has been sent to the user</li>
              <li>Consider following up based on their feedback</li>
            </ul>
          </div>

          <hr style="margin: 30px 0; border: 0; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 12px; text-align: center;">
            This notification was sent automatically by your COMPT email system.
          </p>
        </div>
      `;

      const text = `
        New Email Signup: ${userEmail}
        
        Submission Details:
        - Email: ${userEmail}
        - Source: ${source || 'Website'}
        - Submitted At: ${new Date(submittedAt).toLocaleString()}
        
        ${feedback ? `Feedback/Message:\n${feedback}\n\n` : ''}
        
        Next Steps:
        - User has been added to your email list via Tally
        - A confirmation email has been sent to the user
        - Consider following up based on their feedback
        
        This notification was sent automatically by your COMPT email system.
      `;

      // Send the admin notification email
      const result = await emailService.sendCustomEmail({
        to: this.adminEmail,
        subject: subject,
        html: html,
        text: text,
        tags: [
          { name: 'type', value: 'admin_notification' },
          { name: 'source', value: source || 'website' }
        ]
      });

      return result;

    } catch (error) {
      console.error('❌ Failed to send admin notification email:', error);
      throw new Error(`Admin notification email failed: ${error.message}`);
    }
  }

  /**
   * Test the Tally service with a test submission
   * @param {string} testEmail - Test email address
   * @returns {Promise<Object>} - Test result
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
   * Get service status and configuration
   * @returns {Object} - Service status information
   */
  getServiceStatus() {
    return {
      initialized: true,
      tallyFormId: this.tallyFormId,
      adminEmail: this.adminEmail,
      tallyApiBase: this.tallyApiBase,
      emailServiceAvailable: !!emailService,
      status: 'active'
    };
  }
}

// Create and export singleton instance
const tallyService = new TallyService();
export { tallyService };
