import React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Img,
} from '@react-email/components';

/**
 * Welcome Email Template for Regular Users
 * 
 * This template is sent to users who signed up but didn't opt for beta testing.
 * It includes:
 * - Warm welcome message
 * - Information about COMPT and what to expect
 * - Social links and ways to stay connected
 * - General updates schedule
 */
export default function WelcomeRegular({ userEmail = "user@example.com" }) {
  const previewText = "Welcome to COMPT - Thank you for joining our community!";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={logoSection}>
            <Img
              src="https://your-domain.com/logo.png" // Replace with your actual logo URL
              width="120"
              height="40"
              alt="COMPT Logo"
              style={logo}
            />
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>
              🎉 Welcome to COMPT!
            </Heading>

            <Text style={text}>
              Hi there,
            </Text>

            <Text style={text}>
              Thank you for joining COMPT! We're excited to have you as part of our 
              community as we work to revolutionize AI-powered collaborative ideation 
              and problem-solving.
            </Text>

            <Text style={text}>
              <strong>What is COMPT?</strong>
            </Text>

            <Section style={infoBox}>
              <Text style={infoText}>
                COMPT is an innovative platform that harnesses the power of AI to help 
                teams and individuals brainstorm, ideate, and solve complex problems 
                through intelligent collaboration. We're building the future of 
                creative thinking and strategic planning.
              </Text>
            </Section>

            <Text style={text}>
              <strong>What can you expect from us:</strong>
            </Text>

            <Section style={expectationsList}>
              <Text style={expectationItem}>📬 Monthly updates on our development progress</Text>
              <Text style={expectationItem}>🚀 Announcements about major milestones and launches</Text>
              <Text style={expectationItem}>💡 Insights into AI collaboration and productivity tips</Text>
              <Text style={expectationItem}>🎯 Early access opportunities for new features</Text>
              <Text style={expectationItem}>👥 Invitations to community events and webinars</Text>
            </Section>

            <Text style={text}>
              We believe in building something truly valuable, and we'll only reach out 
              when we have meaningful updates to share. No spam, just genuine progress 
              updates and valuable content.
            </Text>

            {/* Call to Action Buttons */}
            <Section style={buttonContainer}>
              <Button
                pX={20}
                pY={12}
                style={primaryButton}
                href="https://your-domain.com/about" // Replace with actual about page URL
              >
                Learn More About COMPT
              </Button>
            </Section>

            <Text style={text}>
              Want to stay more connected? Follow us on social media for behind-the-scenes 
              content and quick updates:
            </Text>

            {/* Social Links */}
            <Section style={socialSection}>
              <Button
                pX={16}
                pY={8}
                style={socialButton}
                href="https://twitter.com/compt_ai" // Replace with actual social URLs
              >
                Twitter
              </Button>
              <Button
                pX={16}
                pY={8}
                style={socialButton}
                href="https://linkedin.com/company/compt-ai"
              >
                LinkedIn
              </Button>
              <Button
                pX={16}
                pY={8}
                style={socialButton}
                href="https://github.com/compt-ai"
              >
                GitHub
              </Button>
            </Section>

            <Section style={feedbackBox}>
              <Text style={feedbackText}>
                <strong>💬 We'd love to hear from you!</strong>
              </Text>
              <Text style={feedbackText}>
                Have questions, suggestions, or just want to say hi? Reply to this email 
                or reach out to us at <strong>hello@compt.ai</strong> - we read every message!
              </Text>
            </Section>

            <Text style={text}>
              Thank you for being part of our journey. We can't wait to show you what 
              we're building! 🚀
            </Text>

            <Text style={signature}>
              Best regards,<br />
              The COMPT Team
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              You're receiving this email because you signed up for COMPT updates at{' '}
              <span style={footerEmail}>{userEmail}</span>
            </Text>
            
            <Text style={footerText}>
              Want to change your email preferences?{' '}
              <a href="https://your-domain.com/preferences" style={footerLink}>
                Manage preferences
              </a>{' '}
              or{' '}
              <a href="https://your-domain.com/unsubscribe" style={footerLink}>
                unsubscribe
              </a>
            </Text>

            <Text style={footerText}>
              Interested in beta testing?{' '}
              <a href="https://your-domain.com/beta-signup" style={footerLink}>
                Join our beta program
              </a>
            </Text>

            <Text style={footerText}>
              COMPT • Made with ❤️ for AI collaboration
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styling for the email template
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  padding: '45px',
  margin: '40px auto',
  borderRadius: '8px',
  maxWidth: '600px',
};

const logoSection = {
  textAlign: 'center',
  marginBottom: '32px',
};

const logo = {
  margin: '0 auto',
};

const content = {
  margin: '0 auto',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: 'bold',
  lineHeight: '1.4',
  margin: '0 0 24px 0',
  textAlign: 'center',
};

const text = {
  color: '#484848',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
};

const infoBox = {
  margin: '20px 0',
  padding: '20px',
  backgroundColor: '#f0f8ff',
  borderRadius: '6px',
  border: '1px solid #b3d9ff',
};

const infoText = {
  color: '#1a365d',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0',
  fontStyle: 'italic',
};

const expectationsList = {
  margin: '20px 0',
  padding: '20px',
  backgroundColor: '#f0fff4',
  borderRadius: '6px',
  border: '1px solid #9ae6b4',
};

const expectationItem = {
  color: '#484848',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 8px 0',
};

const buttonContainer = {
  textAlign: 'center',
  margin: '24px 0',
};

const primaryButton = {
  backgroundColor: '#007ee6',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  border: 'none',
  cursor: 'pointer',
};

const socialSection = {
  textAlign: 'center',
  margin: '24px 0',
};

const socialButton = {
  backgroundColor: '#ffffff',
  borderRadius: '4px',
  color: '#484848',
  fontSize: '14px',
  fontWeight: 'normal',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  border: '1px solid #d1d5db',
  cursor: 'pointer',
  margin: '0 8px 8px 0',
};

const feedbackBox = {
  margin: '32px 0',
  padding: '20px',
  backgroundColor: '#fffbf0',
  borderRadius: '6px',
  border: '1px solid #fed7aa',
  textAlign: 'center',
};

const feedbackText = {
  color: '#484848',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 8px 0',
};

const signature = {
  color: '#484848',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '32px 0 0 0',
};

const footer = {
  borderTop: '1px solid #e6e6e6',
  paddingTop: '20px',
  marginTop: '32px',
};

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '0 0 8px 0',
  textAlign: 'center',
};

const footerEmail = {
  color: '#484848',
  fontWeight: 'bold',
};

const footerLink = {
  color: '#007ee6',
  textDecoration: 'none',
};
