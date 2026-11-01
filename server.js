const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Dynamic Proxy Route for Browsing
app.get('/browse', async(req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send('Error: Please provide a URL. Example: /browse?url=https://ipinfo.io');
    }

    try {
        // Fetch the target website from the cloud server's location
        const response = await axios({
            method: req.method,
            url: targetUrl,
            headers: {
                // Pass a standard browser user-agent to avoid being blocked
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            responseType: 'arraybuffer' // Handles both text/HTML and binary files (images, etc.)
        });

        // Forward the content type (HTML, JSON, image, etc.) back to you
        res.set('Content-Type', response.headers['content-type']);
        res.send(response.data);

    } catch (error) {
        res.status(500).send(`Failed to fetch target URL: ${error.message}`);
    }
});

// Homepage
app.get('/', (req, res) => {
    res.send('Dynamic Remote Proxy is Live! Use the endpoint: /browse?url=https://your-target-site.com');
});

app.listen(PORT, () => {
    console.log(`Dynamic proxy running on port ${PORT}`);
});