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
        const lines = content.split(/\r?\n/).map(line => line.trim()).filter(line => line !== ''); // Handle both \r\n and \n, trim whitespace, filter empty lines
        let currentService = null;

        for (const line of lines) {
            if (line.trim() === '') continue;
            
            if (line.startsWith('service.')) {
                if (currentService) {
                    services.push(currentService);
                }
                const parts = line.split('.');
                let serviceId = parts[1]; // Get the ID after 'service.'
                // Remove trailing = if present
                if (serviceId.endsWith('=')) {
                    serviceId = serviceId.slice(0, -1);
                }
                currentService = { id: serviceId };
            } else if (currentService) {
                const [key, value] = line.split('=');
                if (key) { // Check if key exists
                    currentService[key.trim()] = value ? value.trim() : ''; // Assign empty string if no value
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
            // Ensure service has all required fields and a valid ID
            const serviceData = {
                id: service.id || Date.now().toString(), // Ensure ID exists
                name: service.name || '',
                url: service.url || '',
                port: service.port || ''
            };

            // Only add service data if it has a valid ID
            if (serviceData.id) {
                content += 'service.' + serviceData.id + '\r\n';
                content += `name=${serviceData.name}\r\n`;
                content += `url=${serviceData.url}\r\n`;
                content += `port=${serviceData.port}\r\n`;
                if (index < services.length - 1) {
                    content += '\r\n';
                }
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

// Delete a service by ID from properties file
async function deleteService(serviceId) {
    try {
        const services = readServices();
        const filteredServices = services.filter(service => service.id !== serviceId);

        if (writeServices(filteredServices)) {
            console.log(`Service with ID ${serviceId} deleted from properties file.`);
            return true;
        } else {
            console.error(`Failed to delete service with ID ${serviceId} from properties file.`);
            return false;
        }
    } catch (error) {
        console.error(`Error deleting service with ID ${serviceId}:`, error);
        return false;
    }
}

module.exports = {
    readServices,
    writeServices,
    deleteService
}; 