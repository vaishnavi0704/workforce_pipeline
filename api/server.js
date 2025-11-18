// server.js - Server for Dynamic Workforce Planning Agent
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (CSS, JS, images, etc.)
app.use('/api', express.static('api'));
app.use(express.static('.'));

// Route to serve the main HTML with injected environment variables
app.get('/', (req, res) => {
    // Read the HTML file
    let html = fs.readFileSync('index.html', 'utf8');
    
    // Replace the hardcoded API key with the environment variable
    // We'll inject it as a script tag that sets a global variable
    const scriptInjection = `
    <script>
        // Environment variables injected by server
        window.ENV = {
            OPENAI_API_KEY: '${process.env.OPENAI_API_KEY || ''}',
            // Add other environment variables if needed
        };
        
        // Override the hardcoded API key
        const OPENAI_API_KEY = window.ENV.OPENAI_API_KEY;
    </script>
    `;
    
    // Inject the script right after the opening <head> tag
    html = html.replace('<head>', `<head>${scriptInjection}`);
    
    // Send the modified HTML
    res.send(html);
});

// API endpoint to get environment variables (alternative approach)
app.get('/api/config', (req, res) => {
    // Only send non-sensitive config or properly secured endpoints
    res.json({
        // Never send API keys directly to the client in production
        // This is just for local development
        apiKeyConfigured: !!process.env.OPENAI_API_KEY
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`OpenAI API Key configured: ${process.env.OPENAI_API_KEY ? 'Yes' : 'No'}`);
});