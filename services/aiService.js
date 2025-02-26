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
                As a tax document analyzer, please analyze this document and provide:
                1. A summary of key financial information
                2. Important tax implications
                3. Potential deductions or credits
                4. Any red flags or areas of concern
                
                Document: ${documentText}
                
                Format the response with clear sections and bullet points.
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

            console.log('Generating response for:', messages[0].text);
            
            const result = await this.model.generateContent({
                contents: [{ parts: [{ text: messages[0].text }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 800,
                }
            });

            if (!result || !result.response) {
                throw new Error('Failed to generate AI response');
            }

            const response = result.response;
            const text = response.text();
            
            if (!text) {
                throw new Error('Empty response from AI');
            }
            
            console.log('Generated response:', text);
            return text;

        } catch (error) {
            console.error('AI Service Error:', error);
            throw new Error(error.message || 'Failed to generate response');
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