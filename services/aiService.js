const { GoogleGenerativeAI } = require("@google/generative-ai");

class AIService {
    constructor() {
        try {
            this.genAI = new GoogleGenerativeAI(process.env.AI_STUDIO_API_KEY);
            this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
            console.log('AI Service initialized successfully');
        } catch (error) {
            console.error('Error initializing AI Service:', error);
            throw error;
        }
    }

    async generateTaxAdvice(userInput) {
        try {
            const prompt = this.createTaxPrompt(userInput);
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return this.formatResponse(response.text());
        } catch (error) {
            console.error('AI Service Error:', error.response?.data || error.message);
            throw new Error('Failed to generate tax advice');
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
            const response = await result.response;
            
            return {
                analysis: this.formatResponse(response.text()),
                status: 'success'
            };
        } catch (error) {
            console.error('Document Analysis Error:', error.response?.data || error.message);
            throw new Error('Failed to analyze tax document');
        }
    }

    async generateChatResponse(messages) {
        try {
            if (!messages || !messages[0]?.text) {
                throw new Error('Invalid input message');
            }

            console.log('API Key:', process.env.AI_STUDIO_API_KEY ? 'Present' : 'Missing');
            console.log('Input Message:', messages[0].text);

            const result = await this.model.generateContent({
                contents: [{ parts: [{ text: messages[0].text }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 800,
                }
            });

            console.log('AI Response:', result?.response?.text());
            return result.response.text();

        } catch (error) {
            console.error('Detailed AI Error:', {
                message: error.message,
                stack: error.stack,
                response: error.response?.data
            });
            throw new Error(`AI Service Error: ${error.message}`);
        }
    }

    createTaxPrompt(userInput) {
        return `
            As a tax expert, please provide comprehensive advice about: ${userInput}

            Please structure your response as follows:
            
            ## Overview
            [Provide a brief summary of the topic]

            ## Key Points
            • [List main points with bullet points]
            • [Use **bold** for emphasis on important terms]
            
            ## Detailed Explanation
            [Provide detailed information with proper formatting]
            
            ## Tax Implications
            • [List relevant tax implications]
            • [Include tax code references where applicable]
            
            ## Recommendations
            • [Provide actionable recommendations]
            • [Include any relevant deadlines or time-sensitive information]
            
            ## Important Notice
            [Include disclaimer about consulting tax professionals]

            Format the response using markdown syntax for better readability.
        `;
    }

    formatResponse(text) {
        // Add markdown formatting if not present
        let formattedText = text;

        // Add headers if none exist
        if (!text.includes('#')) {
            formattedText = `## Response\n\n${text}`;
        }

        // Format bullet points
        formattedText = formattedText.replace(/(?:^|\n)[-*]\s/g, '\n• ');

        // Add emphasis to important terms
        const importantTerms = [
            'deduction', 'credit', 'exemption', 'deadline', 'required',
            'must', 'IRS', 'tax return', 'penalty', 'income'
        ];

        importantTerms.forEach(term => {
            const regex = new RegExp(`\\b${term}\\b`, 'gi');
            formattedText = formattedText.replace(regex, `**${term}**`);
        });

        // Add disclaimer if not present
        if (!formattedText.toLowerCase().includes('disclaimer') && 
            !formattedText.toLowerCase().includes('consult')) {
            formattedText += `\n\n## Disclaimer\nThis is general information only. Please consult with a qualified tax professional for advice specific to your situation.`;
        }

        // Clean up formatting
        return formattedText
            .replace(/\n{3,}/g, '\n\n')  // Remove extra newlines
            .replace(/\s+•/g, '\n•')      // Fix bullet point spacing
            .replace(/\n\s+/g, '\n')      // Remove extra spaces at line starts
            .trim();
    }
}

module.exports = new AIService(); 