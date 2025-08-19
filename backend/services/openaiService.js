import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

class OpenAIService {
  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY not found in environment variables');
    }
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Use GPT-3.5-turbo as the cheap model for summarization
    this.model = 'gpt-3.5-turbo';
    this.maxTokens = 500; // Keep summaries concise
  }

  /**
   * Summarize text content using OpenAI
   * @param {string} text - The text content to summarize
   * @param {object} options - Optional parameters
   * @returns {Promise<string>} - Summarized text
   */
  async summarizeText(text, options = {}) {
    try {
      if (!text || text.trim().length === 0) {
        throw new Error('No text content provided for summarization');
      }

      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured');
      }

      console.log(`Summarizing text with OpenAI (${text.length} characters)...`);

      const maxInputLength = 12000; // Rough character limit to stay under token limits
      let inputText = text;

      // Truncate if text is too long
      if (text.length > maxInputLength) {
        inputText = text.substring(0, maxInputLength) + '... [truncated]';
        console.log(`Text truncated to ${maxInputLength} characters for processing`);
      }

      const systemPrompt = options.systemPrompt || 
        "You are an expert at creating concise, informative summaries. " +
        "Focus on the main points, key ideas, and important details. " +
        "Keep the summary clear and well-structured.";

      const userPrompt = options.userPrompt || 
        `Please provide a concise summary of the following text, highlighting the main points and key information:\n\n${inputText}`;

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user", 
            content: userPrompt
          }
        ],
        max_tokens: options.maxTokens || this.maxTokens,
        temperature: options.temperature || 0.3, // Lower temperature for more consistent summaries
        top_p: 0.9,
      });

      if (!response.choices || response.choices.length === 0) {
        throw new Error('No response received from OpenAI');
      }

      const summary = response.choices[0].message.content.trim();
      
      console.log(`Successfully generated summary (${summary.length} characters)`);
      console.log(`Tokens used: ${response.usage?.total_tokens || 'unknown'}`);

      return summary;

    } catch (error) {
      console.error('Error with OpenAI summarization:', error);
      
      // Provide helpful error messages
      if (error.message.includes('API key')) {
        throw new Error('OpenAI API key is invalid or not configured');
      } else if (error.message.includes('quota')) {
        throw new Error('OpenAI API quota exceeded');
      } else if (error.message.includes('rate')) {
        throw new Error('OpenAI API rate limit exceeded. Please try again later.');
      }
      
      throw new Error(`Failed to summarize text: ${error.message}`);
    }
  }

  /**
   * Generate a title for text content
   * @param {string} text - The text content
   * @returns {Promise<string>} - Generated title
   */
  async generateTitle(text) {
    try {
      if (!text || text.trim().length === 0) {
        return 'Untitled Content';
      }

      const shortText = text.substring(0, 1000); // Use first 1000 chars for title generation

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content: "Generate a short, descriptive title (maximum 60 characters) for the given text content."
          },
          {
            role: "user",
            content: `Generate a title for this content:\n\n${shortText}`
          }
        ],
        max_tokens: 20,
        temperature: 0.5
      });

      return response.choices[0].message.content.trim().replace(/['"]/g, '');

    } catch (error) {
      console.error('Error generating title:', error);
      return 'Generated Content';
    }
  }

  /**
   * Check if OpenAI service is properly configured
   * @returns {boolean} - True if properly configured
   */
  isConfigured() {
    return !!process.env.OPENAI_API_KEY;
  }

  /**
   * Test the OpenAI connection
   * @returns {Promise<boolean>} - True if connection successful
   */
  async testConnection() {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [{ role: "user", content: "Hello" }],
        max_tokens: 5
      });
      
      return response.choices && response.choices.length > 0;
    } catch (error) {
      console.error('OpenAI connection test failed:', error);
      return false;
    }
  }
}

export const openaiService = new OpenAIService();
