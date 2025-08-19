import crypto from 'crypto';

class StorageService {
  constructor(session) {
    this.session = session;
    
    // Initialize context storage in session if it doesn't exist
    if (!this.session.contextStorage) {
      this.session.contextStorage = {
        pdfSummaries: {},
        textContent: {},
        metadata: {
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }
      };
    }

    // Initialize COMPT space storage for agent teams
    if (!this.session.comptSpace) {
      this.session.comptSpace = {
        teams: [],
        metadata: {
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Generate a unique storage key
   * @param {string} prefix - Prefix for the key
   * @param {string} identifier - Optional identifier (filename, title, etc.)
   * @returns {string} - Unique storage key
   */
  generateStorageKey(prefix, identifier = '') {
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex');
    const cleanIdentifier = identifier.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
    
    return `${prefix}_${cleanIdentifier}_${timestamp}_${random}`;
  }

  /**
   * Store PDF summary in session storage
   * @param {object} pdfData - PDF data object
   * @returns {string} - Storage key
   */
  storePdfSummary(pdfData) {
    const key = this.generateStorageKey('pdf', pdfData.filename);
    
    const storageData = {
      id: key,
      type: 'pdf_summary',
      filename: pdfData.filename,
      summary: pdfData.summary,
      originalTextLength: pdfData.originalText ? pdfData.originalText.length : 0,
      // Store original text only if it's not too large
      originalText: pdfData.originalText && pdfData.originalText.length < 50000 
        ? pdfData.originalText 
        : '[Original text too large - summary only]',
      uploadedAt: pdfData.uploadedAt,
      storedAt: new Date().toISOString()
    };

    this.session.contextStorage.pdfSummaries[key] = storageData;
    this.updateMetadata();
    
    console.log(`Stored PDF summary with key: ${key}`);
    return key;
  }

  /**
   * Store text content in session storage
   * @param {object} textData - Text data object
   * @returns {string} - Storage key
   */
  storeText(textData) {
    const identifier = textData.filename || textData.title || 'text';
    const key = this.generateStorageKey('text', identifier);
    
    const storageData = {
      id: key,
      type: textData.type || 'text', // 'file_upload' or 'paste'
      title: textData.title || textData.filename || 'Untitled',
      filename: textData.filename || null,
      content: textData.content,
      contentLength: textData.content.length,
      uploadedAt: textData.uploadedAt,
      storedAt: new Date().toISOString()
    };

    this.session.contextStorage.textContent[key] = storageData;
    this.updateMetadata();
    
    console.log(`Stored text content with key: ${key}`);
    return key;
  }

  /**
   * Retrieve context by storage key
   * @param {string} key - Storage key
   * @returns {object|null} - Stored context data
   */
  getContext(key) {
    if (!key) {
      return null;
    }

    // Check PDF summaries
    if (this.session.contextStorage.pdfSummaries[key]) {
      return this.session.contextStorage.pdfSummaries[key];
    }

    // Check text content
    if (this.session.contextStorage.textContent[key]) {
      return this.session.contextStorage.textContent[key];
    }

    return null;
  }

  /**
   * Get all stored context
   * @returns {object} - All stored context data
   */
  getAllContext() {
    const allContext = {
      pdfSummaries: { ...this.session.contextStorage.pdfSummaries },
      textContent: { ...this.session.contextStorage.textContent },
      metadata: { ...this.session.contextStorage.metadata }
    };

    // Create summary list for easy access
    const summaryList = [];
    
    // Add PDF summaries
    Object.values(allContext.pdfSummaries).forEach(item => {
      summaryList.push({
        key: item.id,
        type: item.type,
        title: item.filename,
        preview: item.summary.substring(0, 100) + (item.summary.length > 100 ? '...' : ''),
        storedAt: item.storedAt
      });
    });

    // Add text content
    Object.values(allContext.textContent).forEach(item => {
      summaryList.push({
        key: item.id,
        type: item.type,
        title: item.title,
        preview: item.content.substring(0, 100) + (item.content.length > 100 ? '...' : ''),
        storedAt: item.storedAt
      });
    });

    // Sort by storage date (newest first)
    summaryList.sort((a, b) => new Date(b.storedAt) - new Date(a.storedAt));

    return {
      summary: summaryList,
      total: summaryList.length,
      pdfCount: Object.keys(allContext.pdfSummaries).length,
      textCount: Object.keys(allContext.textContent).length,
      ...allContext
    };
  }

  /**
   * Search stored context by keywords
   * @param {string} query - Search query
   * @returns {array} - Matching context items
   */
  searchContext(query) {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const searchTerm = query.toLowerCase();
    const results = [];

    // Search PDF summaries
    Object.values(this.session.contextStorage.pdfSummaries).forEach(item => {
      if (
        item.filename.toLowerCase().includes(searchTerm) ||
        item.summary.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          ...item,
          matchType: 'pdf_summary'
        });
      }
    });

    // Search text content
    Object.values(this.session.contextStorage.textContent).forEach(item => {
      if (
        item.title.toLowerCase().includes(searchTerm) ||
        item.content.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          ...item,
          matchType: 'text_content'
        });
      }
    });

    // Sort by relevance (exact matches first, then by date)
    results.sort((a, b) => {
      const aExact = a.title.toLowerCase() === searchTerm;
      const bExact = b.title.toLowerCase() === searchTerm;
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      return new Date(b.storedAt) - new Date(a.storedAt);
    });

    return results;
  }

  /**
   * Delete context by key
   * @param {string} key - Storage key
   * @returns {boolean} - True if deleted successfully
   */
  deleteContext(key) {
    if (!key) {
      return false;
    }

    let deleted = false;

    if (this.session.contextStorage.pdfSummaries[key]) {
      delete this.session.contextStorage.pdfSummaries[key];
      deleted = true;
    }

    if (this.session.contextStorage.textContent[key]) {
      delete this.session.contextStorage.textContent[key];
      deleted = true;
    }

    if (deleted) {
      this.updateMetadata();
      console.log(`Deleted context with key: ${key}`);
    }

    return deleted;
  }

  /**
   * Clear all stored context
   * @returns {object} - Cleared data counts
   */
  clearAllContext() {
    const counts = {
      pdfSummaries: Object.keys(this.session.contextStorage.pdfSummaries).length,
      textContent: Object.keys(this.session.contextStorage.textContent).length
    };

    this.session.contextStorage = {
      pdfSummaries: {},
      textContent: {},
      metadata: {
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        clearedAt: new Date().toISOString()
      }
    };

    console.log(`Cleared all context - PDFs: ${counts.pdfSummaries}, Texts: ${counts.textContent}`);
    return counts;
  }

  /**
   * Update metadata timestamp
   */
  updateMetadata() {
    this.session.contextStorage.metadata.lastUpdated = new Date().toISOString();
  }

  /**
   * Store agent team in COMPT space
   * @param {object} team - Agent team object
   * @returns {string} - Team ID
   */
  storeAgentTeam(team) {
    if (!team || !team.id) {
      throw new Error('Invalid team object');
    }

    // Add or update team in the teams array
    const existingIndex = this.session.comptSpace.teams.findIndex(t => t.id === team.id);
    
    if (existingIndex >= 0) {
      this.session.comptSpace.teams[existingIndex] = team;
    } else {
      this.session.comptSpace.teams.push(team);
    }

    this.updateComptMetadata();
    console.log(`Stored agent team with ID: ${team.id}`);
    return team.id;
  }

  /**
   * Get agent team by ID
   * @param {string} teamId - Team ID
   * @returns {object|null} - Agent team or null
   */
  getAgentTeam(teamId) {
    if (!teamId) return null;
    return this.session.comptSpace.teams.find(team => team.id === teamId) || null;
  }

  /**
   * Get all agent teams
   * @returns {array} - Array of agent teams
   */
  getAllAgentTeams() {
    return [...this.session.comptSpace.teams];
  }

  /**
   * Delete agent team by ID
   * @param {string} teamId - Team ID
   * @returns {boolean} - True if deleted
   */
  deleteAgentTeam(teamId) {
    if (!teamId) return false;

    const initialLength = this.session.comptSpace.teams.length;
    this.session.comptSpace.teams = this.session.comptSpace.teams.filter(team => team.id !== teamId);
    
    const deleted = this.session.comptSpace.teams.length < initialLength;
    if (deleted) {
      this.updateComptMetadata();
      console.log(`Deleted agent team with ID: ${teamId}`);
    }

    return deleted;
  }

  /**
   * Get COMPT space data (for sessionStorage sync)
   * @returns {object} - COMPT space data
   */
  getComptSpace() {
    return {
      teams: [...this.session.comptSpace.teams],
      metadata: { ...this.session.comptSpace.metadata }
    };
  }

  /**
   * Update COMPT space from client data
   * @param {object} spaceData - Space data from client
   * @returns {boolean} - True if updated successfully
   */
  updateComptSpace(spaceData) {
    try {
      if (spaceData && Array.isArray(spaceData.teams)) {
        this.session.comptSpace.teams = spaceData.teams;
        this.updateComptMetadata();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating COMPT space:', error);
      return false;
    }
  }

  /**
   * Update COMPT metadata timestamp
   */
  updateComptMetadata() {
    this.session.comptSpace.metadata.lastUpdated = new Date().toISOString();
  }

  /**
   * Get storage statistics
   * @returns {object} - Storage statistics
   */
  getStorageStats() {
    const pdfCount = Object.keys(this.session.contextStorage.pdfSummaries).length;
    const textCount = Object.keys(this.session.contextStorage.textContent).length;
    const teamsCount = this.session.comptSpace.teams.length;
    
    return {
      totalItems: pdfCount + textCount + teamsCount,
      pdfSummaries: pdfCount,
      textContent: textCount,
      agentTeams: teamsCount,
      createdAt: this.session.contextStorage.metadata.createdAt,
      lastUpdated: this.session.contextStorage.metadata.lastUpdated
    };
  }
}

export { StorageService as default };
