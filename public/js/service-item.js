/**
 * Creates and returns the HTML element for a single service item.
 * Attaches event listeners to the options button.
 * @param {object} service - The service data.
 * @param {function} showContextMenu - Function to display the context menu.
 * @returns {HTMLElement} The service item div element.
 */
function createServiceItem(service, showContextMenu) {
    const serviceElement = document.createElement('div');
    serviceElement.className = 'flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 group cursor-pointer';
    serviceElement.innerHTML = `
        <div class="flex items-center space-x-2 flex-1 min-w-0">
            <!-- Gray dot icon -->
            <div class="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span class="text-gray-700 truncate">${service.name}</span>
        </div>
        <button class="p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity" data-id="${service.id}">
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 6v.01M12 12v.01M12 18v.01"/>
            </svg>
        </button>
    `;

    // Add event listener to the options button
    const optionsButton = serviceElement.querySelector('button');
    // Add cursor-pointer class to the button
    optionsButton.classList.add('cursor-pointer');
    
    optionsButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the service item click from happening
        showContextMenu(e.target, service.id);
    });

    // Add click listener to the service item for active state
    serviceElement.addEventListener('click', () => {
        // Remove 'active' class from any currently active service
        const currentActive = document.querySelector('.service-item.active');
        if (currentActive) {
            currentActive.classList.remove('active');
        }
        // Add 'active' class to the clicked service
        serviceElement.classList.add('active');
    });

    // Add a class to the service element for easier selection
    serviceElement.classList.add('service-item');

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