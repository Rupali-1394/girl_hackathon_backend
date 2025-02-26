const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

class AIService {
    constructor() {
        try {
            if (!process.env.AI_STUDIO_API_KEY) {
                throw new Error('AI Studio API key is not configured');
            }
            this.genAI = new GoogleGenerativeAI(process.env.AI_STUDIO_API_KEY.trim());
            // Use gemini-1.5-flash for faster responses
            this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            console.log('AI Service initialized successfully');
        } catch (error) {
            console.error('Error initializing AI Service:', error);
            throw error;
        }
    }

    async generateChatResponse(message) {
        try {
            console.log('Generating response for:', message);
            const prompt = `You are a tax advisor. Please provide advice about: ${message}. 
                          Keep the response clear and concise.`;
            
            const result = await this.model.generateContent(prompt);
            const response = result.response.text();
            
            console.log('Generated response:', response);
            return response;

        } catch (error) {
            console.error('Chat Error:', error);
            throw error;
        }
    }

    async analyzeTaxDocument(documentText) {
        try {
            const prompt = `
                Analyze this tax document and provide:
                1. Key financial information summary
                2. Tax implications
                3. Potential deductions
                4. Areas of concern

                Document: ${documentText}
            `;
            
            const result = await this.model.generateContent(prompt);
            const analysis = result.response.text();
            
            return {
                analysis: analysis,
                status: 'success'
            };
        } catch (error) {
            console.error('Document Analysis Error:', error);
            throw new Error('Failed to analyze tax document');
        }
    }
}

module.exports = new AIService();