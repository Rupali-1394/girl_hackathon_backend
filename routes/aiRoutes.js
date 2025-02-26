const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        console.log('Received message:', message);
        
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ 
                error: 'Please provide a valid question.' 
            });
        }

        const response = await aiService.generateChatResponse([{
            text: message,
            sender: 'user'
        }]);

        console.log('AI Response:', response);

        res.json({ 
            message: response,
            status: 'success'
        });
    } catch (error) {
        console.error('Route Error:', error);
        res.status(500).json({ 
            error: error.message || 'An error occurred. Please try again.',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
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