// public/js/context-menu.js

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
        <div class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2" data-action="edit">
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span>Edit</span>
        </div>
        <div class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2 text-red-600" data-action="delete">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            <span>Delete</span>
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

        const serviceElement = document.querySelector(`[data-id="${currentServiceId}"]`).closest('.flex.items-center.justify-between');
        
        switch (action) {
            case 'edit':
                await handleEdit(serviceElement);
                break;
            case 'delete':
                await handleDelete(serviceElement);
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

async function handleEdit(serviceElement) {
    try {
        // Get the service data from the element's data attributes
        const serviceId = currentServiceId;
        
        // Create edit modal
        const modal = document.createElement('div');
        modal.id = 'editServiceModal';
        modal.className = 'fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 hidden';
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
        modal.classList.remove('hidden');

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
                    // Update the service element
                    serviceElement.querySelector('span').textContent = updatedService.name;
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

async function handleDelete(serviceElement) {
    if (!confirm('Are you sure you want to delete this service?')) {
        return;
    }

    try {
        const response = await fetch(`/api/services/${currentServiceId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            serviceElement.remove();
        } else {
            throw new Error('Failed to delete service');
        }
    } catch (error) {
        console.error('Error deleting service:', error);
        alert('Failed to delete service');
    }
}

// Make functions available globally
window.showContextMenu = showContextMenu;
window.hideContextMenu = hideContextMenu; 