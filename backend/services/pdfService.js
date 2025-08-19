import * as pdfjs from '@pdfjs/legacy-dist/build/pdf.mjs';

class PDFService {
  /**
   * Extract text content from a PDF buffer
   * @param {Buffer} pdfBuffer - The PDF file buffer
   * @returns {Promise<string>} - Extracted text content
   */
  async extractText(pdfBuffer) {
    try {
      console.log('Extracting text from PDF...');
      
      // Load PDF document
      const loadingTask = pdfjs.getDocument({
        data: pdfBuffer,
        verbosity: 0 // Suppress console warnings
      });
      
      const pdf = await loadingTask.promise;
      let fullText = '';

      // Extract text from each page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .map(item => item.str)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
          
        if (pageText) {
          fullText += pageText + ' ';
        }
      }

      // Clean up the extracted text
      const cleanedText = fullText
        .replace(/\s+/g, ' ')
        .replace(/\n\s*\n/g, '\n')
        .trim();

      if (!cleanedText || cleanedText.length < 10) {
        throw new Error('No meaningful text content found in PDF');
      }

      console.log(`Successfully extracted ${cleanedText.length} characters from ${pdf.numPages} pages`);

      return cleanedText;

    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
  }

  /**
   * Validate if a buffer contains a valid PDF
   * @param {Buffer} buffer - The file buffer to validate
   * @returns {boolean} - True if valid PDF
   */
  isValidPDF(buffer) {
    if (!buffer || buffer.length < 4) {
      return false;
    }

    // Check for PDF header signature
    const header = buffer.toString('ascii', 0, 4);
    return header === '%PDF';
  }

  /**
   * Get basic PDF information without extracting full content
   * @param {Buffer} pdfBuffer - The PDF file buffer
   * @returns {Promise<object>} - Basic PDF information
   */
  async getPDFInfo(pdfBuffer) {
    try {
      const loadingTask = pdfjs.getDocument({ data: pdfBuffer });
      const pdf = await loadingTask.promise;
      
      return {
        pages: pdf.numPages,
        hasText: true // Assume PDFs have text content
      };

    } catch (error) {
      console.error('Error getting PDF info:', error);
      throw new Error(`Failed to get PDF information: ${error.message}`);
    }
  }
}

export const pdfService = new PDFService();
