// Sidebar resize functionality
const sidebar = document.getElementById('sidebar');
const resizer = document.getElementById('resizer');
let isResizing = false;
let lastDownX = 0;

if (resizer) {
    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        lastDownX = e.clientX;
        document.body.style.userSelect = 'none'; // Prevent text selection during resize
        document.body.style.cursor = 'col-resize';
    });
}

document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;

    const delta = e.clientX - lastDownX;
    const newWidth = sidebar.offsetWidth + delta;
    
    // Constrain width between 200px and 400px
    if (newWidth > 200 && newWidth < 400) {
        sidebar.style.width = `${newWidth}px`;
        lastDownX = e.clientX;
    }
});

document.addEventListener('mouseup', () => {
    isResizing = false;
    document.body.style.userSelect = ''; // Restore text selection
    document.body.style.cursor = '';
});

// Context menu functionality
let currentContextMenu = null;
let currentServiceId = null;

function showContextMenu(target, serviceId) {
    // Remove any existing context menu
    hideContextMenu();

    // Create context menu
    const contextMenu = document.createElement('div');
    contextMenu.className = 'absolute bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50';
    contextMenu.innerHTML = `
        <div class="px-4 py-2 ml-[5px] mr-[5px] hover:bg-gray-100 hover:rounded cursor-pointer flex items-center space-x-2" data-action="edit">
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            <span class="text-context-menu">Edit</span>
        </div>
        <div class="px-4 py-2 ml-[5px] mr-[5px] hover:bg-gray-100 hover:rounded cursor-pointer flex items-center space-x-2 text-red-600" data-action="delete">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            <span class="text-context-menu">Delete</span>
        </div>
    `;

    // Position the context menu
    const rect = target.getBoundingClientRect();
    contextMenu.style.top = `${rect.bottom + window.scrollY}px`;
    contextMenu.style.left = `${rect.left + window.scrollX}px`;

    // Add click handlers
    contextMenu.addEventListener('click', async (e) => {
        const action = e.target.closest('[data-action]')?.dataset.action;
        if (!action) return;

        // Pass serviceId directly to handlers
        const serviceElement = document.querySelector(`[data-id="${serviceId}"]`).closest('.flex.items-center.justify-between');
        
        switch (action) {
            case 'edit':
                await handleEdit(serviceElement, serviceId); // Pass serviceId to handleEdit
                break;
            case 'delete':
                await handleDelete(serviceElement, serviceId); // Pass serviceId to handleDelete
                break;
        }
        
        hideContextMenu();
    });

    // Add to DOM
    document.body.appendChild(contextMenu);
    currentContextMenu = contextMenu;
    currentServiceId = serviceId;

    // Hide on outside click
    document.addEventListener('click', hideContextMenu, { once: true });
}

function hideContextMenu() {
    if (currentContextMenu) {
        currentContextMenu.remove();
        currentContextMenu = null;
        currentServiceId = null;
    }
}

// Function to create a service item HTML element
function createServiceItem(service) {
    const serviceDiv = document.createElement('div');
    serviceDiv.className = 'service-item flex items-center justify-between';
    serviceDiv.setAttribute('data-id', service.id);
    serviceDiv.innerHTML = `
        <div class="service-info flex items-center flex-1 min-w-0">
            <span class="service-dot w-2 h-2 bg-gray-600 rounded-full"></span>
            <span class="service-name text-sm text-gray-800 ml-2 truncate">${service.name}</span>
        </div>
        <button class="options-button flex items-center justify-center p-1 border-none bg-none cursor-pointer opacity-0 transition-opacity duration-200 w-6 h-6 rounded-md">
            <span class="material-icons text-gray-500 text-base leading-none">more_vert</span>
        </button>
    `;

    // Add event listener to the options button
    serviceDiv.querySelector('.options-button').addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent service item click
        showContextMenu(event.currentTarget, service.id);
    });

    // Add event listener to the service item for selection (optional, if needed later)
    serviceDiv.addEventListener('click', () => {
        // Handle service item click, e.g., display details
        console.log('Service item clicked:', service.name);
        // Example: Add active class for styling
        document.querySelectorAll('.service-item').forEach(item => item.classList.remove('active'));
        serviceDiv.classList.add('active');
    });

    return serviceDiv;
}

// Function to load services from the backend
async function loadServices() {
    try {
        const response = await fetch('/api/services');
        if (!response.ok) {
            throw new Error('Failed to fetch services');
        }
        const services = await response.json();
        const servicesList = document.getElementById('servicesList');
        servicesList.innerHTML = ''; // Clear existing list
        services.forEach(service => {
            servicesList.appendChild(createServiceItem(service));
        });
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

// Call loadServices on page load
document.addEventListener('DOMContentLoaded', () => {
    loadServices();
    lucide.createIcons(); // Render Lucid icons
});

// Add Service Modal Functionality
const addServiceBtn = document.getElementById('addServiceBtn');
const serviceModal = document.getElementById('serviceModal');
const closeModalBtn = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const serviceForm = document.getElementById('serviceForm');

// Open modal
if (addServiceBtn) {
    addServiceBtn.addEventListener('click', () => {
        serviceModal.classList.remove('hidden');
    });
}

// Close modal function
const closeServiceModal = () => {
    serviceModal.classList.add('hidden');
    serviceForm.reset(); // Clear form on close
};

// Close modal listeners
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeServiceModal);
}

if (cancelBtn) {
    cancelBtn.addEventListener('click', closeServiceModal);
}

// Handle form submission
if (serviceForm) {
    serviceForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(serviceForm);
        // Map form data to expected server-side structure
        const serviceData = {
            name: formData.get('serviceName'),
            url: formData.get('serviceUrl'),
            port: formData.get('portNumber')
        };

        try {
            const response = await fetch('/api/services', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(serviceData),
            });

            if (response.ok) {
                // Service added successfully, reload the list
                loadServices();
                closeServiceModal();
            } else {
                // Handle errors, e.g., show a message
                alert('Failed to add service.');
            }
        } catch (error) {
            console.error('Error adding service:', error);
            alert('An error occurred while adding the service.');
        }
    });
}

async function handleDelete(serviceElement, serviceId) {
    const deleteModal = document.getElementById('deleteModal');
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    const cancelDeleteBtn = document.getElementById('cancelDelete');
    const closeDeleteModalBtn = document.getElementById('closeDeleteModal');

    // Show the modal
    deleteModal.classList.remove('hidden');

    // Handle confirm delete
    confirmDeleteBtn.onclick = async () => {
        deleteModal.classList.add('hidden');
        try {
            const response = await fetch(`/api/services/${serviceId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Service deleted successfully, remove the element from the DOM
                serviceElement.remove();
                console.log(`Service with ID ${serviceId} deleted.`);
            } else {
                throw new Error('Failed to delete service');
            }
        } catch (error) {
            console.error('Error deleting service:', error);
            alert('Failed to delete service.');
        }
    };

    // Handle cancel delete or close modal
    const closeModal = () => {
        deleteModal.classList.add('hidden');
    };

    cancelDeleteBtn.onclick = closeModal;
    closeDeleteModalBtn.onclick = closeModal;

    // Close modal if clicking outside
    deleteModal.onclick = (e) => {
        if (e.target === deleteModal) {
            closeModal();
        }
    };
}

async function handleEdit(serviceElement, serviceId) {
    try {
        // Create edit modal
        const modal = document.createElement('div');
        modal.id = 'editServiceModal';
        modal.className = 'fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
                <div class="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900">Edit Service</h3>
                    <button id="closeEditModal" class="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <form id="editServiceForm" class="p-4 space-y-4">
                    <div>
                        <label for="editServiceName" class="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                        <input type="text" id="editServiceName" name="name" required
                            class="block w-full border border-gray-300 rounded-md shadow-sm text-gray-800 text-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter service name">
                    </div>
                    <div>
                        <label for="editServiceUrl" class="block text-sm font-medium text-gray-700 mb-1">URL</label>
                        <input type="url" id="editServiceUrl" name="url" required
                            class="block w-full border border-gray-300 rounded-md shadow-sm text-gray-800 text-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter service URL">
                    </div>
                    <div>
                        <label for="editPortNumber" class="block text-sm font-medium text-gray-700 mb-1">Port Number</label>
                        <input type="number" id="editPortNumber" name="port" required
                            class="block w-full border border-gray-300 rounded-md shadow-sm text-gray-800 text-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter port number">
                    </div>
                    <div class="flex justify-end space-x-3 pt-4">
                                <button type="button" id="cancelEdit"
                                    class="px-5 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit"
                                    class="px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                `;

                // Add modal to body
                document.body.appendChild(modal);

                // Get form elements
                const form = document.getElementById('editServiceForm');
                const closeBtn = document.getElementById('closeEditModal');
                const cancelBtn = document.getElementById('cancelEdit');

                // Fetch current service data
                const response = await fetch(`/api/services/${serviceId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch service data');
                }
                const service = await response.json();

                // Pre-fill form with current data
                document.getElementById('editServiceName').value = service.name || '';
                document.getElementById('editServiceUrl').value = service.url || '';
                document.getElementById('editPortNumber').value = service.port || '';

                // Handle form submission
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    
                    const serviceData = {
                        name: document.getElementById('editServiceName').value,
                        url: document.getElementById('editServiceUrl').value,
                        port: document.getElementById('editPortNumber').value
                    };

                    try {
                        const response = await fetch(`/api/services/${serviceId}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(serviceData)
                        });

                        if (response.ok) {
                            const updatedService = await response.json();
                            // Update the service element's name
                            serviceElement.querySelector('.service-name').textContent = updatedService.name;
                            modal.remove();
                        } else {
                            throw new Error('Failed to update service');
                        }
                    } catch (error) {
                        console.error('Error updating service:', error);
                        alert('Failed to update service');
                    }
                });

                // Handle modal close
                const closeModal = () => {
                    modal.remove();
                };

                closeBtn.addEventListener('click', closeModal);
                cancelBtn.addEventListener('click', closeModal);
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        closeModal();
                    }
                });

            } catch (error) {
                console.error('Error in handleEdit:', error);
                alert('Failed to load service data');
            }
}
