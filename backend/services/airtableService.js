import Airtable from 'airtable';

/**
 * Airtable Service for managing email signups
 * 
 * This service handles:
 * - Storing email signups with beta testing preferences
 * - Preventing duplicate entries
 * - Providing structured data for email campaigns
 * 
 * SETUP REQUIRED:
 * - AIRTABLE_API_KEY: Your Airtable personal access token
 * - AIRTABLE_BASE_ID: The ID of your Airtable base
 * - AIRTABLE_TABLE_NAME: The name of your table (default: 'Email Signups')
 */
class AirtableService {
  constructor() {
    this.base = null;
    this.tableName = process.env.AIRTABLE_TABLE_NAME || 'Email Signups';
    this.initialize();
  }

  /**
   * Initialize Airtable connection
   * Validates required environment variables and creates base connection
   */
  initialize() {
    if (!process.env.AIRTABLE_API_KEY) {
      console.error('❌ AIRTABLE_API_KEY environment variable is required');
      throw new Error('AIRTABLE_API_KEY environment variable is required');
    }

    if (!process.env.AIRTABLE_BASE_ID) {
      console.error('❌ AIRTABLE_BASE_ID environment variable is required');
      throw new Error('AIRTABLE_BASE_ID environment variable is required');
    }

    try {
      // Configure Airtable with API key
      Airtable.configure({
        endpointUrl: 'https://api.airtable.com',
        apiKey: process.env.AIRTABLE_API_KEY
      });

      // Create base connection
      this.base = Airtable.base(process.env.AIRTABLE_BASE_ID);
      
      console.log('✅ Airtable service initialized successfully');
      console.log(`📋 Using table: ${this.tableName}`);
    } catch (error) {
      console.error('❌ Failed to initialize Airtable service:', error.message);
      throw error;
    }
  }

  /**
   * Check if an email already exists in the table
   * @param {string} email - Email address to check
   * @returns {Promise<boolean>} - True if email exists, false otherwise
   */
  async emailExists(email) {
    try {
      const records = await this.base(this.tableName)
        .select({
          filterByFormula: `{Email} = "${email}"`,
          maxRecords: 1
        })
        .firstPage();

      return records.length > 0;
    } catch (error) {
      console.error('❌ Error checking email existence:', error);
      throw new Error(`Failed to check email existence: ${error.message}`);
    }
  }

  /**
   * Add a new email signup to Airtable
   * @param {Object} signupData - The signup data
   * @param {string} signupData.email - Email address
   * @param {boolean} signupData.isBetaTester - Whether user opted for beta testing
   * @param {string} [signupData.source] - Optional source tracking (e.g., 'landing_page')
   * @returns {Promise<Object>} - Created record data
   */
  async addEmailSignup(signupData) {
    const { email, isBetaTester, source = 'website' } = signupData;

    // Validate required fields
    if (!email || !email.includes('@')) {
      throw new Error('Valid email address is required');
    }

    if (typeof isBetaTester !== 'boolean') {
      throw new Error('isBetaTester must be a boolean value');
    }

    try {
      // Check if email already exists
      const exists = await this.emailExists(email);
      if (exists) {
        throw new Error('Email address already exists in our database');
      }

      // Prepare record data for Airtable
      // Note: Field names should match your Airtable table structure
      const recordData = {
        'Email': email,
        'Beta Tester': isBetaTester,
        'Source': source,
        'Signup Date': new Date().toISOString(),
        'Status': 'Active', // Default status
        'Welcome Email Sent': false, // Will be updated after email is sent
        'Last Updated': new Date().toISOString()
      };

      console.log('📝 Adding email signup to Airtable:', { 
        email, 
        isBetaTester, 
        source 
      });

      // Create the record
      const createdRecord = await this.base(this.tableName).create([
        {
          fields: recordData
        }
      ]);

      console.log('✅ Email signup added successfully:', createdRecord[0].id);

      // Return formatted response
      return {
        success: true,
        recordId: createdRecord[0].id,
        data: {
          email: email,
          isBetaTester: isBetaTester,
          source: source,
          signupDate: recordData['Signup Date']
        }
      };

    } catch (error) {
      console.error('❌ Error adding email signup:', error);
      
      // Handle specific Airtable errors
      if (error.error && error.error.type) {
        switch (error.error.type) {
          case 'INVALID_REQUEST_MISSING_FIELDS':
            throw new Error('Required fields missing in Airtable table');
          case 'INVALID_REQUEST_INVALID_FIELD_FOR_TABLE':
            throw new Error('Invalid field names - please check your Airtable table structure');
          case 'REQUEST_TIMEOUT':
            throw new Error('Request timeout - please try again');
          default:
            throw new Error(`Airtable error: ${error.error.message || error.message}`);
        }
      }

      throw error;
    }
  }

  /**
   * Update a record to mark that welcome email was sent
   * @param {string} recordId - Airtable record ID
   * @returns {Promise<Object>} - Updated record data
   */
  async markWelcomeEmailSent(recordId) {
    try {
      const updatedRecord = await this.base(this.tableName).update([
        {
          id: recordId,
          fields: {
            'Welcome Email Sent': true,
            'Welcome Email Sent Date': new Date().toISOString(),
            'Last Updated': new Date().toISOString()
          }
        }
      ]);

      console.log('✅ Marked welcome email as sent for record:', recordId);
      return updatedRecord[0];
    } catch (error) {
      console.error('❌ Error updating welcome email status:', error);
      throw new Error(`Failed to update welcome email status: ${error.message}`);
    }
  }

  /**
   * Get all email signups (for admin purposes)
   * @param {Object} options - Query options
   * @param {number} [options.maxRecords=100] - Maximum records to retrieve
   * @param {string} [options.filterFormula] - Airtable filter formula
   * @returns {Promise<Array>} - Array of signup records
   */
  async getAllSignups(options = {}) {
    const { maxRecords = 100, filterFormula } = options;

    try {
      const queryOptions = {
        maxRecords: maxRecords,
        sort: [{ field: 'Signup Date', direction: 'desc' }]
      };

      if (filterFormula) {
        queryOptions.filterByFormula = filterFormula;
      }

      const records = await this.base(this.tableName)
        .select(queryOptions)
        .firstPage();

      return records.map(record => ({
        id: record.id,
        ...record.fields
      }));
    } catch (error) {
      console.error('❌ Error retrieving signups:', error);
      throw new Error(`Failed to retrieve signups: ${error.message}`);
    }
  }

  /**
   * Get beta testers only (for targeted campaigns)
   * @returns {Promise<Array>} - Array of beta tester records
   */
  async getBetaTesters() {
    return this.getAllSignups({
      filterFormula: '{Beta Tester} = TRUE()'
    });
  }

  /**
   * Get non-beta users (for general updates)
   * @returns {Promise<Array>} - Array of non-beta user records
   */
  async getNonBetaUsers() {
    return this.getAllSignups({
      filterFormula: '{Beta Tester} = FALSE()'
    });
  }
}

// Create and export singleton instance
const airtableService = new AirtableService();
export { airtableService };
