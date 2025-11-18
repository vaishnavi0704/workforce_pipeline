// api-proxy.js - Secure backend proxy for OpenAI API calls
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Proxy endpoint for OpenAI API
app.post('/api/chat', async (req, res) => {
    try {
        // Validate request
        if (!req.body.messages) {
            return res.status(400).json({ error: 'Messages are required' });
        }

        // Make the API call to OpenAI from the backend
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: req.body.model || 'gpt-4o-mini',
                messages: req.body.messages,
                max_tokens: req.body.max_tokens || 150
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error?.message || 'OpenAI API error');
        }

        res.json(data);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ 
            error: 'Failed to process request',
            message: error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        apiKeyConfigured: !!process.env.OPENAI_API_KEY 
    });
});

app.listen(PORT, () => {
    console.log(`API Proxy server running on http://localhost:${PORT}`);
    console.log(`OpenAI API Key configured: ${process.env.OPENAI_API_KEY ? 'Yes' : 'No'}`);
});