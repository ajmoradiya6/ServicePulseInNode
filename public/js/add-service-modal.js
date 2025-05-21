// public/js/add-service-modal.js

/**
 * Initializes the add service modal functionality.
 * @param {HTMLElement} addServiceButton - The button that opens the modal.
 * @param {HTMLElement} servicesListElement - The element where new services are listed.
 */
function initAddServiceModal(addServiceButton, servicesListElement) {
    const modal = document.getElementById('serviceModal');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const serviceForm = document.getElementById('serviceForm');

    function showModal() {
        modal.classList.remove('hidden');
    }

    function hideModal() {
        modal.classList.add('hidden');
        serviceForm.reset();
    }

    if (addServiceButton) addServiceButton.addEventListener('click', showModal);
    if (closeModal) closeModal.addEventListener('click', hideModal);
    if (cancelBtn) cancelBtn.addEventListener('click', hideModal);

    // Handle form submission
    if (serviceForm) {
        serviceForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const serviceData = {
                name: document.getElementById('serviceName').value,
                url: document.getElementById('serviceUrl').value,
                port: document.getElementById('portNumber').value
            };

            try {
                const response = await fetch('/api/services', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(serviceData)
                });

                if (response.ok) {
                    const service = await response.json();
                    // Use the provided servicesListElement
                    if (servicesListElement && typeof createServiceItem === 'function') {
                         const serviceElement = createServiceItem(service, window.showContextMenu); // Pass showContextMenu
                         servicesListElement.prepend(serviceElement);
                    }
                    hideModal();
                } else {
                    alert('Failed to add service');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to add service');
            }
        });
    }
}

// Expose the init function globally
window.initAddServiceModal = initAddServiceModal; 