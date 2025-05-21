// public/js/context-menu.js

document.addEventListener('DOMContentLoaded', () => {
    const contextMenu = document.createElement('div');
    contextMenu.id = 'serviceContextMenu';
    contextMenu.className = 'absolute z-10 w-40 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none hidden';
    document.body.appendChild(contextMenu);

    /**
     * Displays the context menu at the specified button's position.
     * @param {HTMLElement} button - The button element that triggered the context menu.
     * @param {string} serviceId - The ID of the service related to the context menu.
     */
    function showContextMenu(button, serviceId) {
        // Fetch context menu HTML dynamically (optional, could also be a string)
        // For now, using a string based on the pre-created HTML file content
        contextMenu.innerHTML = `
            <a href="#" class="flex items-center p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm" data-action="rename" data-id="${serviceId}">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                </svg>
                Rename
            </a>
            <a href="#" class="flex items-center p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm" data-action="edit" data-id="${serviceId}">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Edit
            </a>
            <a href="#" class="flex items-center p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-sm" data-action="delete" data-id="${serviceId}">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456-.45a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m-1.022.165L5.93 19.673a2.25 2.25 0 002.244 2.077h7.132a2.25 2.25 0 002.244-2.077L19.58 5.345zm-11.405-1.59.342-1.023a1.125 1.125 0 012.012 0l.342 1.023a1.125 1.125 0 01-2.012 0zm-.163 4.924l-.001.002-.002.002zm-.75 0l-.001.002-.002.002z"/>
                </svg>
                Delete
            </a>
        `;

        const rect = button.getBoundingClientRect();
        contextMenu.style.top = `${rect.bottom + window.scrollY}px`;
        contextMenu.style.left = `${rect.left + window.scrollX}px`;
        contextMenu.classList.remove('hidden');

        // Add event listeners for context menu options (will implement later)
        contextMenu.querySelectorAll('a').forEach(item => {
            item.onclick = (e) => {
                e.preventDefault();
                const action = item.getAttribute('data-action');
                const id = item.getAttribute('data-id');
                console.log(`${action} service with id: ${id}`); // Placeholder action
                hideContextMenu();
            };
        });
    }

    /**
     * Hides the context menu.
     */
    function hideContextMenu() {
        contextMenu.classList.add('hidden');
    }

    // Hide context menu when clicking outside
    document.addEventListener('click', (e) => {
        // Check if the click is outside the context menu and not on a button that opens it
        if (!contextMenu.contains(e.target) && !e.target.closest('.group button')) {
            hideContextMenu();
        }
    });

    // Hide context menu when scrolling
    window.addEventListener('scroll', hideContextMenu);

    // Expose showContextMenu globally so service-item.js can use it
    window.showContextMenu = showContextMenu;
    window.hideContextMenu = hideContextMenu; // Expose hideContextMenu as well
}); 