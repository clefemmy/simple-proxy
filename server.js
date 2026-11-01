const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
// Use the cloud host's dynamic port, or fallback to 3000 locally
const PORT = process.env.PORT || 3000;

// Dynamic Proxy Route
app.use('/proxy', createProxyMiddleware({
    target: 'https://httpbin.org', // Change this to your destination API/site
    changeOrigin: true, // Vital for masking: rewrites host header to match target
    secure: true,
    onProxyReq: (proxyReq, req, res) => {
        // Optional: Remove headers that might leak original info
        proxyReq.removeHeader('x-forwarded-for');
    }
}));

app.get('/', (req, res) => {
    res.send('Remote Proxy Server is Live and Masking!');
});

app.listen(PORT, () => {
    console.log(`Proxy running on port ${PORT}`);
});