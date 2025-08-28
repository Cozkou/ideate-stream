import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    // Get environment variables
    const fromEmail = process.env.FROM_EMAIL || 'compt@buildersbrew.co';
    const adminEmail = process.env.ADMIN_EMAIL || 'compt@buildersbrew.co';

    // Send confirmation email to user
    let userEmailResult = null;
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

      userEmailResult = await resend.emails.send({
        from: fromEmail,
        to: [email],
        subject: 'Welcome to COMPT - You\'re on the waitlist!',
        html: html,
        reply_to: fromEmail
      });

      console.log('✅ User confirmation email sent');
    } catch (emailError) {
      console.warn('⚠️ Failed to send user confirmation email:', emailError.message);
    }

    // Send notification email to admin
    let adminEmailResult = null;
    try {
      const submittedAt = new Date().toISOString();
      const subject = `🎉 New COMPT Waitlist Signup: ${email}`;
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0891b2; border-bottom: 2px solid #0891b2; padding-bottom: 10px;">
            📧 New Waitlist Signup
          </h2>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0c4a6e;">Submission Details</h3>
            <p><strong>Email:</strong> ${email}</p>
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

      adminEmailResult = await resend.emails.send({
        from: fromEmail,
        to: [adminEmail],
        subject: subject,
        html: html,
        reply_to: fromEmail
      });

      console.log('✅ Admin notification email sent');
    } catch (emailError) {
      console.warn('⚠️ Failed to send admin notification email:', emailError.message);
    }

    // Return success response
    res.status(200).json({
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
          emailId: userEmailResult?.data?.id || userEmailResult?.id || null,
          error: !userEmailResult ? 'Failed to send' : null
        },
        adminNotification: {
          success: !!adminEmailResult,
          emailId: adminEmailResult?.data?.id || adminEmailResult?.id || null,
          error: !adminEmailResult ? 'Failed to send' : null
        }
      }
    });

  } catch (error) {
    console.error('❌ Error processing form submission:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process form submission', 
      details: error.message 
    });
  }
}
