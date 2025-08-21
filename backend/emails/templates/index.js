/**
 * Email Templates Export Module
 * 
 * This module exports all email templates for use in the email service.
 * Templates are built using React Email components for consistent,
 * responsive, and professional-looking emails.
 */

// Import email templates
import WelcomeBeta from './WelcomeBeta.jsx';
import WelcomeRegular from './WelcomeRegular.jsx';

/**
 * Available email templates
 * Each template is a React component that can be rendered to HTML/text
 */
export const templates = {
  // Welcome email for beta testers
  welcomeBeta: WelcomeBeta,
  
  // Welcome email for regular subscribers
  welcomeRegular: WelcomeRegular,
};

/**
 * Template metadata for easier management
 * Contains information about each template including subject lines and descriptions
 */
export const templateMetadata = {
  welcomeBeta: {
    subject: 'Welcome to COMPT Beta - Let\'s Shape the Future Together! 🚀',
    description: 'Welcome email for users who opted into beta testing',
    category: 'welcome',
    audience: 'beta_testers'
  },
  
  welcomeRegular: {
    subject: 'Welcome to COMPT - Thank You for Joining! 🎉',
    description: 'Welcome email for regular subscribers',
    category: 'welcome',
    audience: 'regular_users'
  }
};

/**
 * Helper function to get template by name
 * @param {string} templateName - Name of the template to retrieve
 * @returns {React.Component|null} - Template component or null if not found
 */
export function getTemplate(templateName) {
  return templates[templateName] || null;
}

/**
 * Helper function to get template metadata by name
 * @param {string} templateName - Name of the template
 * @returns {Object|null} - Template metadata or null if not found
 */
export function getTemplateMetadata(templateName) {
  return templateMetadata[templateName] || null;
}

/**
 * Get subject line for a template
 * @param {string} templateName - Name of the template
 * @returns {string} - Subject line or default subject
 */
export function getTemplateSubject(templateName) {
  const metadata = getTemplateMetadata(templateName);
  return metadata?.subject || 'Welcome to COMPT';
}

// Default export for convenience
export default templates;
