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

// Component styles
const componentStyles = {
    serviceItem: `
        .service-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
            margin: 4px 0;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .service-item:hover {
            background-color: #f5f5f5;
        }
        .service-item.active {
            background-color: #2196F3;
        }
        .service-item.active .service-name {
            color: white;
        }
        .service-item.active .service-dot {
            background-color: white;
        }
        .service-item.active .material-icons {
            color: white;
        }
        .service-info {
            display: flex;
            align-items: center;
            flex: 1;
            min-width: 0;
        }
        .service-dot {
            width: 8px;
            height: 8px;
            background-color: #666;
            border-radius: 50%;
        }
        .service-name {
            font-size: 14px;
            color: #333;
            margin-left: 8px;
        }
        .options-button {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4px;
            border: none;
            background: none;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s;
            height: 24px;
            width: 24px;
            border-radius: 4px;
        }
        .options-button:hover {
            background-color: rgba(0, 0, 0, 0.05);
        }
        .service-item:hover .options-button {
            opacity: 1;
        }
        .options-menu {
            position: absolute;
            background: white;
            border: 1px solid #ddd;
            border-radius: 6px;
            padding: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            z-index: 1000;
        }
        .menu-item {
            display: flex;
            align-items: center;
            width: 100%;
            text-align: left;
            padding: 8px 12px;
            border: none;
            background: none;
            cursor: pointer;
            color: #333;
            font-size: 14px;
            transition: background-color 0.2s;
        }
        .menu-item:hover {
            background-color: #f5f5f5;
        }
        .material-icons {
            font-size: 20px;
            margin-right: 8px;
            color: #666;
        }
    `
};

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = componentStyles.serviceItem;
document.head.appendChild(styleSheet);

// Add Material Icons font
const materialIconsLink = document.createElement('link');
materialIconsLink.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
materialIconsLink.rel = 'stylesheet';
document.head.appendChild(materialIconsLink);

// Modern Material Icons
const icons = {
    more: '<span class="material-icons">more_vert</span>',
    start: '<span class="material-icons">play_arrow</span>',
    stop: '<span class="material-icons">stop</span>',
    restart: '<span class="material-icons">refresh</span>'
};

// Show options menu
function showOptions(serviceId, event) {
    const menu = document.createElement('div');
    menu.className = 'options-menu';
    
    const options = [
        { text: 'Start', icon: icons.start, action: () => startService(serviceId) },
        { text: 'Stop', icon: icons.stop, action: () => stopService(serviceId) },
        { text: 'Restart', icon: icons.restart, action: () => restartService(serviceId) }
    ];
    
    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'menu-item';
        button.innerHTML = `${option.icon}${option.text}`;
        button.onclick = option.action;
        menu.appendChild(button);
    });
    
    document.body.appendChild(menu);
    
    // Get the clicked button's position from the event
    const rect = event.target.getBoundingClientRect();
    
    // Position the menu at the top-right of the button
    menu.style.top = `${rect.top + window.scrollY}px`;
    menu.style.left = `${rect.right + window.scrollX}px`;
    
    // If menu would go off-screen to the right, align it to the left of the button
    if (rect.right + menu.offsetWidth > window.innerWidth) {
        menu.style.left = `${rect.left + window.scrollX - menu.offsetWidth}px`;
    }
    
    // If menu would go off-screen to the bottom, show it above the button
    if (rect.top + menu.offsetHeight > window.innerHeight) {
        menu.style.top = `${rect.bottom + window.scrollY - menu.offsetHeight}px`;
    }
    
    document.addEventListener('click', function removeMenu(e) {
        if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener('click', removeMenu);
        }
    });
}

// Create a service item
function createServiceItem(service) {
    const div = document.createElement('div');
    div.className = 'service-item';
    
    const infoDiv = document.createElement('div');
    infoDiv.className = 'service-info';
    
    const dot = document.createElement('div');
    dot.className = 'service-dot';
    
    const name = document.createElement('span');
    name.className = 'service-name';
    name.textContent = service.name;
    
    const button = document.createElement('button');
    button.className = 'options-button';
    button.innerHTML = icons.more;
    
    button.onclick = (e) => {
        e.stopPropagation();
        showOptions(service.id, e);
    };
    
    div.onclick = () => {
        document.querySelectorAll('.service-item').forEach(item => {
            item.classList.remove('active');
        });
        div.classList.add('active');
        connectToSignalR(service);
    };
    
    infoDiv.appendChild(dot);
    infoDiv.appendChild(name);
    div.appendChild(infoDiv);
    div.appendChild(button);
    
    return div;
}

// SignalR connection
let connection = null;

function connectToSignalR(service) {
    // Close existing connection if any
    if (connection) {
        connection.stop();
    }
    
    // Create new connection
    const hubUrl = `http://${service.url}:${service.port}/healthhub`;
    console.log('Connecting to:', hubUrl);
    
    connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl)
        .withAutomaticReconnect()
        .build();
    
    // Handle health updates
    connection.on('ReceiveHealthUpdate', updateHealthMetrics);
    
    // Start connection
    connection.start()
        .then(() => {
            console.log('Connected!');
            updateHealthMetrics({ status: 'Connected' });
        })
        .catch(err => {
            console.error('Connection failed:', err);
            updateHealthMetrics({ status: 'Error' });
        });
}

// Update health metrics display
function updateHealthMetrics(data) {
    // Create or update health cards
    const container = document.getElementById('healthMetrics') || createHealthContainer();
    
    // Update status
    updateCard(container, 'status', 'Status', data.status || 'Unknown', data.status === 'Connected' ? 'green' : 'red');
    
    // Update memory
    if (data.memoryUsage) {
        updateCard(container, 'memory', 'Memory Usage', data.memoryUsage + '%');
    }
    
    // Update CPU
    if (data.cpuUsage) {
        updateCard(container, 'cpu', 'CPU Usage', data.cpuUsage + '%');
    }
    
    // Update connections
    if (data.activeConnections) {
        updateCard(container, 'connections', 'Active Connections', data.activeConnections);
    }
}

// Create health metrics container
function createHealthContainer() {
    const container = document.createElement('div');
    container.id = 'healthMetrics';
    container.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; padding: 10px;';
    document.body.appendChild(container);
    return container;
}

// Update a single health card
function updateCard(container, id, title, value, color = 'black') {
    let card = document.getElementById(id) || createCard(id);
    card.innerHTML = `
        <div style="${styles.healthTitle}">${title}</div>
        <div style="${styles.healthValue}; color: ${color}">${value}</div>
    `;
    if (!card.parentElement) {
        container.appendChild(card);
    }
}

// Create a health card
function createCard(id) {
    const card = document.createElement('div');
    card.id = id;
    card.style.cssText = styles.healthCard;
    return card;
}

// Service control functions
function startService(id) {
    console.log('Starting service:', id);
    // Add your start logic here
}

function stopService(id) {
    console.log('Stopping service:', id);
    // Add your stop logic here
}

function restartService(id) {
    console.log('Restarting service:', id);
    // Add your restart logic here
}

// Make functions available globally
window.createServiceItem = createServiceItem;
window.addServiceToList = addServiceToList; 