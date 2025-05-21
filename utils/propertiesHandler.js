const fs = require('fs');
const path = require('path');

const PROPERTIES_FILE_PATH = 'C:\\Akshay\\RegisteredService.properties';

// Ensure the directory exists
function ensureDirectoryExists() {
    const dir = path.dirname(PROPERTIES_FILE_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Read services from properties file
function readServices() {
    try {
        ensureDirectoryExists();
        if (!fs.existsSync(PROPERTIES_FILE_PATH)) {
            return [];
        }

        const content = fs.readFileSync(PROPERTIES_FILE_PATH, 'utf8');
        const services = [];
        
        // Parse properties file format
        const lines = content.split('\n');
        let currentService = null;

        for (const line of lines) {
            if (line.trim() === '') continue;
            
            if (line.startsWith('service.')) {
                if (currentService) {
                    services.push(currentService);
                }
                const serviceId = line.split('=')[0].split('.')[1];
                currentService = { id: serviceId };
            } else if (currentService) {
                const [key, value] = line.split('=');
                if (key && value) {
                    currentService[key.trim()] = value.trim();
                }
            }
        }

        if (currentService) {
            services.push(currentService);
        }

        return services;
    } catch (error) {
        console.error('Error reading services:', error);
        return [];
    }
}

// Write services to properties file
function writeServices(services) {
    try {
        ensureDirectoryExists();
        let content = '';

        services.forEach((service, index) => {
            // Ensure service has all required fields
            const serviceData = {
                id: service.id || Date.now().toString(),
                name: service.name || '',
                url: service.url || '',
                port: service.port || ''
            };

            content += `service.${serviceData.id}=\n`;
            content += `name=${serviceData.name}\n`;
            content += `url=${serviceData.url}\n`;
            content += `port=${serviceData.port}\n`;
            if (index < services.length - 1) {
                content += '\n';
            }
        });

        // Write to file with error handling
        try {
            fs.writeFileSync(PROPERTIES_FILE_PATH, content, 'utf8');
            console.log('Successfully wrote to properties file');
            return true;
        } catch (writeError) {
            console.error('Error writing to file:', writeError);
            return false;
        }
    } catch (error) {
        console.error('Error in writeServices:', error);
        return false;
    }
}

module.exports = {
    readServices,
    writeServices
}; 