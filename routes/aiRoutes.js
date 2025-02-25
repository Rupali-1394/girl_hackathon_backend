const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ 
                error: 'Please provide a valid question.' 
            });
        }

        const response = await aiService.generateChatResponse([{
            text: message,
            sender: 'user'
        }]);

        res.json({ 
            message: response,
            status: 'success'
        });
    } catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json({ 
            error: 'An error occurred. Please try again.',
            details: error.message
        });
    }
});

router.post('/analyze-document', async (req, res) => {
    try {
        const { document } = req.body;
        const analysis = await aiService.analyzeTaxDocument(document);
        res.json(analysis);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 