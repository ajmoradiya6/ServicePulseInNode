/**
 * Creates and returns the HTML element for a single service item.
 * Attaches event listeners to the options button.
 * @param {object} service - The service data.
 * @param {function} showContextMenu - Function to display the context menu.
 * @returns {HTMLElement} The service item div element.
 */
function createServiceItem(service, showContextMenu) {
    const serviceElement = document.createElement('div');
    serviceElement.className = 'flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 group';
    serviceElement.innerHTML = `
        <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/>
            </svg>
            <span class="text-gray-700">${service.name}</span>
        </div>
        <button class="p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity" data-id="${service.id}">
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 6v.01M12 12v.01M12 18v.01"/>
            </svg>
        </button>
    `;

    // Add event listener to the options button
    const optionsButton = serviceElement.querySelector('button');
    optionsButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the service item click from happening
        showContextMenu(e.target, service.id);
    });

    return serviceElement;
}

/**
 * Adds a service item to the services list.
 * @param {object} service - The service data.
 */
function addServiceToList(service) {
    const servicesList = document.getElementById('servicesList');
    if (servicesList) {
        // Assuming showContextMenu is globally available
        const serviceElement = createServiceItem(service, showContextMenu);
        servicesList.prepend(serviceElement); // Add to the beginning
    }
} 