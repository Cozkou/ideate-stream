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
 * Welcome Email Template for Beta Testers
 * 
 * This template is sent to users who opted into beta testing.
 * It includes:
 * - Personalized welcome message
 * - Information about beta testing program
 * - Call-to-action buttons
 * - Contact information for feedback
 */
export default function WelcomeBeta({ userEmail = "user@example.com" }) {
  const previewText = "Welcome to COMPT Beta - Help us shape the future of AI collaboration!";

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
              🚀 Welcome to COMPT Beta!
            </Heading>

            <Text style={text}>
              Hi there,
            </Text>

            <Text style={text}>
              Thank you for joining COMPT and opting into our beta testing program! 
              We're thrilled to have you as one of our early adopters who will help 
              shape the future of AI-powered collaborative ideation.
            </Text>

            <Text style={text}>
              <strong>As a beta tester, you'll get:</strong>
            </Text>

            <Section style={benefitsList}>
              <Text style={benefitItem}>✨ Early access to new features before anyone else</Text>
              <Text style={benefitItem}>🛠️ Direct input on product development</Text>
              <Text style={benefitItem}>📧 Regular updates on our progress and milestones</Text>
              <Text style={benefitItem}>🎯 Exclusive beta tester perks and recognition</Text>
              <Text style={benefitItem}>📞 Priority support and direct communication with our team</Text>
            </Section>

            <Text style={text}>
              We'll be sending you regular updates about:
            </Text>

            <Section style={updatesList}>
              <Text style={updateItem}>🔥 New feature releases and improvements</Text>
              <Text style={updateItem}>📊 Behind-the-scenes development insights</Text>
              <Text style={updateItem}>💡 Beta testing opportunities and feedback requests</Text>
              <Text style={updateItem}>🗓️ Upcoming beta testing sessions and calls</Text>
              <Text style={updateItem}>🏆 Product milestones and achievements</Text>
            </Section>

            {/* Call to Action Buttons */}
            <Section style={buttonContainer}>
              <Button
                pX={20}
                pY={12}
                style={primaryButton}
                href="https://your-domain.com/beta-dashboard" // Replace with actual beta dashboard URL
              >
                Access Beta Dashboard
              </Button>
            </Section>

            <Section style={buttonContainer}>
              <Button
                pX={20}
                pY={12}
                style={secondaryButton}
                href="https://your-domain.com/feedback" // Replace with feedback form URL
              >
                Share Feedback
              </Button>
            </Section>

            <Text style={text}>
              Got questions or want to chat about COMPT? Simply reply to this email 
              or reach out to us at <strong>beta@compt.ai</strong> - we love hearing from our community!
            </Text>

            <Text style={text}>
              Thank you for being part of our journey. Let's build something amazing together! 🎉
            </Text>

            <Text style={signature}>
              Best regards,<br />
              The COMPT Team
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              You're receiving this email because you signed up for COMPT beta testing at{' '}
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

const benefitsList = {
  margin: '20px 0',
  padding: '20px',
  backgroundColor: '#f8f9ff',
  borderRadius: '6px',
  border: '1px solid #e1e8ff',
};

const benefitItem = {
  color: '#484848',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 8px 0',
};

const updatesList = {
  margin: '20px 0',
  padding: '20px',
  backgroundColor: '#fff8f0',
  borderRadius: '6px',
  border: '1px solid #ffe4cc',
};

const updateItem = {
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

const secondaryButton = {
  backgroundColor: '#ffffff',
  borderRadius: '6px',
  color: '#007ee6',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  border: '1px solid #007ee6',
  cursor: 'pointer',
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
