const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3003;

// In-memory storage for services
let services = [];

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.get('/api/services', (req, res) => {
    res.json(services);
});

app.post('/api/services', (req, res) => {
    const { name, url, port } = req.body;
    const service = {
        id: Date.now().toString(),
        name,
        url,
        port,
        createdAt: new Date()
    };
    services.unshift(service); // Add to beginning of array
    res.status(201).json(service);
});

// Serve the main HTML file for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
}); 