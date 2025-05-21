const express = require('express');
const path = require('path');
const { readServices, writeServices } = require('./utils/propertiesHandler');

const app = express();
const port = process.env.PORT || 3003;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.get('/api/services', (req, res) => {
    const services = readServices();
    res.json(services);
});

// Get a single service by ID
app.get('/api/services/:id', (req, res) => {
    try {
        const services = readServices();
        const service = services.find(s => s.id === req.params.id);
        if (service) {
            res.json(service);
        } else {
            res.status(404).json({ error: 'Service not found' });
        }
    } catch (error) {
        console.error('Error fetching service by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/services', (req, res) => {
    const services = readServices();
    const newService = {
        id: Date.now().toString(),
        ...req.body
    };
    services.push(newService);
    
    if (writeServices(services)) {
        res.json(newService);
    } else {
        res.status(500).json({ error: 'Failed to save service' });
    }
});

app.delete('/api/services/:id', (req, res) => {
    const services = readServices();
    const filteredServices = services.filter(service => service.id !== req.params.id);
    
    if (writeServices(filteredServices)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: 'Failed to delete service' });
    }
});

app.put('/api/services/:id', (req, res) => {
    try {
        const services = readServices();
        const index = services.findIndex(service => service.id === req.params.id);
        
        if (index !== -1) {
            // Preserve the existing ID
            const updatedService = {
                ...services[index],
                ...req.body,
                id: req.params.id // Ensure ID doesn't change
            };
            
            services[index] = updatedService;
            
            if (writeServices(services)) {
                console.log('Successfully updated service:', updatedService);
                res.json(updatedService);
            } else {
                console.error('Failed to write services to file');
                res.status(500).json({ error: 'Failed to update service' });
            }
        } else {
            console.error('Service not found:', req.params.id);
            res.status(404).json({ error: 'Service not found' });
        }
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve the main HTML file for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
}); 