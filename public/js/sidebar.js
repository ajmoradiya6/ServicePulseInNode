// public/js/sidebar.js

document.addEventListener('DOMContentLoaded', () => {
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
}); 