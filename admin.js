// Admin Panel JavaScript
// Global variables
let currentUser = null;
let currentSection = 'dashboard';
let servicesData = [];
let messagesData = [];
let imagesData = [];
let aboutContent = '';
let contactData = {};

// DOM Elements
const loginOverlay = document.getElementById('login-overlay');
const adminPanel = document.getElementById('admin-panel');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const sidebarMenu = document.querySelectorAll('.menu-item');
const contentSections = document.querySelectorAll('.content-section');
const pageTitle = document.getElementById('page-title');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const adminSidebar = document.querySelector('.admin-sidebar');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check if user is already logged in
    checkLoginStatus();

    // Initialize event listeners
    initializeEventListeners();

    // Load initial data
    loadData();
}

// Check login status
function checkLoginStatus() {
    const savedUser = localStorage.getItem('adminUser');
    const savedLoginTime = localStorage.getItem('adminLoginTime');

    if (savedUser && savedLoginTime) {
        const loginTime = new Date(savedLoginTime);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);

        // Auto logout after 24 hours
        if (hoursDiff < 24) {
            currentUser = JSON.parse(savedUser);
            showAdminPanel();
            return;
        } else {
            localStorage.removeItem('adminUser');
            localStorage.removeItem('adminLoginTime');
        }
    }

    showLoginScreen();
}

// Initialize event listeners
function initializeEventListeners() {
    // Login form
    loginForm.addEventListener('submit', handleLogin);

    // Logout
    logoutBtn.addEventListener('click', handleLogout);

    // Sidebar navigation
    sidebarMenu.forEach(item => {
        item.addEventListener('click', () => switchSection(item.dataset.section));
    });

    // Sidebar toggle
    sidebarToggle.addEventListener('click', toggleSidebar);

    // Quick actions
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', () => handleQuickAction(btn.dataset.action));
    });

    // Service management
    document.getElementById('add-service-btn').addEventListener('click', () => openServiceModal());
    document.getElementById('save-service-btn').addEventListener('click', saveService);
    document.getElementById('cancel-service-btn').addEventListener('click', closeModal);

    // About editor
    document.getElementById('save-about-btn').addEventListener('click', saveAboutContent);

    // Contact editor
    document.getElementById('save-contact-btn').addEventListener('click', saveContactData);

    // Image management
    document.getElementById('upload-zone').addEventListener('click', () => document.getElementById('image-upload').click());
    document.getElementById('image-upload').addEventListener('change', handleImageUpload);
    document.getElementById('upload-image-btn').addEventListener('click', () => document.getElementById('image-upload').click());

    // Messages
    document.getElementById('refresh-messages-btn').addEventListener('click', loadMessages);

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Click outside modal to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    });

    // Service form preview
    document.getElementById('service-title').addEventListener('input', updateServicePreview);
    document.getElementById('service-description').addEventListener('input', updateServicePreview);
    document.getElementById('service-icon').addEventListener('input', updateServicePreview);

    // Editor toolbar
    document.querySelectorAll('.toolbar-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            executeCommand(btn.dataset.command);
        });
    });

    // About editor input
    document.getElementById('about-editor').addEventListener('input', updateAboutPreview);
}

// Handle login
function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    // Simple authentication (in production, use proper authentication)
    if (username === 'admin' && password === 'admin123') {
        currentUser = {
            username: username,
            name: 'Administrador',
            role: 'admin'
        };

        localStorage.setItem('adminUser', JSON.stringify(currentUser));
        localStorage.setItem('adminLoginTime', new Date().toISOString());

        showAdminPanel();
        showToast('Bienvenido al panel de administración', 'success');
    } else {
        showLoginMessage('Usuario o contraseña incorrectos', 'error');
    }
}

// Handle logout
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminLoginTime');
    showLoginScreen();
    showToast('Sesión cerrada exitosamente', 'info');
}

// Show login screen
function showLoginScreen() {
    loginOverlay.style.display = 'flex';
    adminPanel.style.display = 'none';
}

// Show admin panel
function showAdminPanel() {
    loginOverlay.style.display = 'none';
    adminPanel.style.display = 'flex';
    document.getElementById('user-name').textContent = currentUser.name;

    // Load dashboard data
    updateDashboard();
}

// Switch sections
function switchSection(sectionName) {
    // Update active menu item
    sidebarMenu.forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

    // Update active content section
    contentSections.forEach(section => section.classList.remove('active'));
    document.getElementById(`${sectionName}-section`).classList.add('active');

    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        services: 'Gestión de Servicios',
        about: 'Editor de Acerca de',
        contact: 'Información de Contacto',
        images: 'Gestión de Imágenes',
        messages: 'Mensajes de Contacto'
    };
    pageTitle.textContent = titles[sectionName] || 'Panel de Administración';

    currentSection = sectionName;

    // Close sidebar on mobile
    if (window.innerWidth <= 1024) {
        adminSidebar.classList.remove('show');
    }
}

// Toggle sidebar
function toggleSidebar() {
    adminSidebar.classList.toggle('show');
}

// Handle quick actions
function handleQuickAction(action) {
    switch (action) {
        case 'add-service':
            switchSection('services');
            openServiceModal();
            break;
        case 'edit-about':
            switchSection('about');
            break;
        case 'edit-contact':
            switchSection('contact');
            break;
        case 'upload-image':
            switchSection('images');
            document.getElementById('image-upload').click();
            break;
        case 'view-messages':
            switchSection('messages');
            break;
        case 'export-data':
            exportData();
            break;
    }
}

// Load data from localStorage
function loadData() {
    servicesData = JSON.parse(localStorage.getItem('servicesData')) || getDefaultServices();
    messagesData = JSON.parse(localStorage.getItem('contactMessages')) || [];
    imagesData = JSON.parse(localStorage.getItem('imagesData')) || [];
    aboutContent = localStorage.getItem('aboutContent') || getDefaultAboutContent();
    contactData = JSON.parse(localStorage.getItem('contactData')) || getDefaultContactData();

    // Update UI
    updateServicesList();
    updateMessagesList();
    updateImagesGrid();
    updateAboutEditor();
    updateContactForm();
    updateDashboard();
}

// Update dashboard
function updateDashboard() {
    document.getElementById('services-count').textContent = servicesData.length;
    document.getElementById('messages-count').textContent = messagesData.filter(m => !m.read).length;
    document.getElementById('images-count').textContent = imagesData.length;
    document.getElementById('visits-count').textContent = Math.floor(Math.random() * 1000) + 500; // Mock data

    // Update message count in sidebar
    const unreadCount = messagesData.filter(m => !m.read).length;
    const messageCountEl = document.getElementById('message-count');
    messageCountEl.textContent = unreadCount;
    messageCountEl.style.display = unreadCount > 0 ? 'inline-block' : 'none';
}

// Services Management
function updateServicesList() {
    const servicesList = document.getElementById('services-list');
    servicesList.innerHTML = '';

    if (servicesData.length === 0) {
        servicesList.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">No hay servicios registrados</p>';
        return;
    }

    servicesData.sort((a, b) => a.order - b.order).forEach((service, index) => {
        const serviceItem = document.createElement('div');
        serviceItem.className = 'service-item';
        serviceItem.draggable = true;
        serviceItem.dataset.index = index;

        serviceItem.innerHTML = `
            <div class="service-info">
                <h4>${service.title}</h4>
                <p>${service.description.substring(0, 100)}${service.description.length > 100 ? '...' : ''}</p>
                <span class="service-category">${getCategoryName(service.category)}</span>
            </div>
            <div class="service-actions">
                <button class="btn-small btn-edit" onclick="editService(${index})">
                    <i class="fas fa-edit"></i>
                    Editar
                </button>
                <button class="btn-small btn-delete" onclick="deleteService(${index})">
                    <i class="fas fa-trash"></i>
                    Eliminar
                </button>
            </div>
        `;

        // Drag and drop functionality
        serviceItem.addEventListener('dragstart', handleDragStart);
        serviceItem.addEventListener('dragover', handleDragOver);
        serviceItem.addEventListener('drop', handleDrop);

        servicesList.appendChild(serviceItem);
    });
}

function getCategoryName(category) {
    const categories = {
        electricidad: 'Electricidad',
        plomeria: 'Plomería',
        refrigeracion: 'Refrigeración'
    };
    return categories[category] || category;
}

function openServiceModal(serviceIndex = null) {
    const modal = document.getElementById('service-modal');
    const form = document.getElementById('service-form');
    const title = document.getElementById('service-modal-title');

    if (serviceIndex !== null) {
        // Edit mode
        const service = servicesData[serviceIndex];
        title.textContent = 'Editar Servicio';
        document.getElementById('service-title').value = service.title;
        document.getElementById('service-description').value = service.description;
        document.getElementById('service-category').value = service.category;
        document.getElementById('service-icon').value = service.icon;
        document.getElementById('service-image').value = service.image || '';
        document.getElementById('service-order').value = service.order;
        form.dataset.editIndex = serviceIndex;
    } else {
        // Add mode
        title.textContent = 'Agregar Servicio';
        form.reset();
        document.getElementById('service-icon').value = 'fas fa-tools';
        document.getElementById('service-order').value = servicesData.length + 1;
        delete form.dataset.editIndex;
    }

    updateServicePreview();
    modal.style.display = 'block';
}

function updateServicePreview() {
    const title = document.getElementById('service-title').value || 'Título del Servicio';
    const description = document.getElementById('service-description').value || 'Descripción del servicio aparecerá aquí...';
    const icon = document.getElementById('service-icon').value || 'fas fa-tools';

    document.getElementById('preview-title').textContent = title;
    document.getElementById('preview-description').textContent = description;
    document.getElementById('preview-icon').className = icon;
}

function saveService() {
    const form = document.getElementById('service-form');
    const formData = new FormData(form);
    const serviceData = {
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        icon: formData.get('icon'),
        image: formData.get('image') || null,
        order: parseInt(formData.get('order')) || 1
    };

    if (form.dataset.editIndex) {
        // Edit existing service
        const index = parseInt(form.dataset.editIndex);
        servicesData[index] = { ...servicesData[index], ...serviceData };
        showToast('Servicio actualizado exitosamente', 'success');
    } else {
        // Add new service
        servicesData.push(serviceData);
        showToast('Servicio agregado exitosamente', 'success');
    }

    // Save to localStorage
    localStorage.setItem('servicesData', JSON.stringify(servicesData));

    // Update UI
    updateServicesList();
    updateDashboard();
    closeModal();
}

function editService(index) {
    openServiceModal(index);
}

function deleteService(index) {
    if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
        servicesData.splice(index, 1);
        localStorage.setItem('servicesData', JSON.stringify(servicesData));
        updateServicesList();
        updateDashboard();
        showToast('Servicio eliminado exitosamente', 'success');
    }
}

// Drag and drop for service ordering
let draggedIndex = null;

function handleDragStart(e) {
    draggedIndex = parseInt(e.target.dataset.index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.target.style.opacity = '0.5';
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDrop(e) {
    e.preventDefault();
    const targetIndex = parseInt(e.target.closest('.service-item').dataset.index);

    if (draggedIndex !== targetIndex) {
        // Reorder services
        const draggedService = servicesData[draggedIndex];
        servicesData.splice(draggedIndex, 1);
        servicesData.splice(targetIndex, 0, draggedService);

        // Update order numbers
        servicesData.forEach((service, index) => {
            service.order = index + 1;
        });

        localStorage.setItem('servicesData', JSON.stringify(servicesData));
        updateServicesList();
    }

    e.target.style.opacity = '1';
}

// About Editor
function updateAboutEditor() {
    document.getElementById('about-editor').innerHTML = aboutContent;
    updateAboutPreview();
}

function updateAboutPreview() {
    const content = document.getElementById('about-editor').innerHTML;
    document.getElementById('about-preview').innerHTML = content;
}

function saveAboutContent() {
    const content = document.getElementById('about-editor').innerHTML;
    aboutContent = content;
    localStorage.setItem('aboutContent', content);
    showToast('Contenido de "Acerca de" guardado exitosamente', 'success');
}

function executeCommand(command) {
    document.execCommand(command, false, null);
    document.getElementById('about-editor').focus();
}

// Contact Editor
function updateContactForm() {
    document.getElementById('contact-phone').value = contactData.phone || '';
    document.getElementById('contact-email').value = contactData.email || '';
    document.getElementById('contact-address').value = contactData.address || '';
    document.getElementById('contact-hours').value = contactData.hours || '';
    document.getElementById('contact-emergency').value = contactData.emergency || '';
}

function saveContactData() {
    const form = document.getElementById('contact-form');
    const formData = new FormData(form);

    contactData = {
        phone: formData.get('phone'),
        email: formData.get('email'),
        address: formData.get('address'),
        hours: formData.get('hours'),
        emergency: formData.get('emergency')
    };

    localStorage.setItem('contactData', JSON.stringify(contactData));
    showToast('Información de contacto guardada exitosamente', 'success');
}

// Image Management
function updateImagesGrid() {
    const imagesGrid = document.getElementById('images-grid');
    imagesGrid.innerHTML = '';

    if (imagesData.length === 0) {
        imagesGrid.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666; grid-column: 1 / -1;">No hay imágenes subidas</p>';
        return;
    }

    imagesData.forEach((image, index) => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';

        imageItem.innerHTML = `
            <img src="${image.url}" alt="${image.name}" class="image-preview">
            <div class="image-info">
                <h4>${image.name}</h4>
                <span class="image-category">${getCategoryName(image.category || 'general')}</span>
            </div>
            <div class="image-actions">
                <button class="btn-view" onclick="viewImage(${index})">
                    <i class="fas fa-eye"></i>
                    Ver
                </button>
            </div>
        `;

        imagesGrid.appendChild(imageItem);
    });
}

function handleImageUpload(e) {
    const files = e.target.files;
    if (files.length === 0) return;

    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = {
                    name: file.name,
                    url: e.target.result,
                    size: file.size,
                    type: file.type,
                    uploadedAt: new Date().toISOString(),
                    category: 'general'
                };

                imagesData.push(imageData);
                localStorage.setItem('imagesData', JSON.stringify(imagesData));
                updateImagesGrid();
                updateDashboard();
            };
            reader.readAsDataURL(file);
        }
    });

    showToast(`${files.length} imagen(es) subida(s) exitosamente`, 'success');
}

function viewImage(index) {
    const image = imagesData[index];
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');

    modalImage.src = image.url;
    modal.style.display = 'block';

    // Update delete button
    document.getElementById('delete-image-btn').onclick = () => {
        if (confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
            imagesData.splice(index, 1);
            localStorage.setItem('imagesData', JSON.stringify(imagesData));
            updateImagesGrid();
            updateDashboard();
            closeModal();
            showToast('Imagen eliminada exitosamente', 'success');
        }
    };
}

// Messages Management
function updateMessagesList() {
    const messagesList = document.getElementById('messages-list');
    messagesList.innerHTML = '';

    if (messagesData.length === 0) {
        messagesList.innerHTML = `
            <div class="no-messages">
                <i class="fas fa-envelope-open"></i>
                <p>No hay mensajes de contacto</p>
            </div>
        `;
        return;
    }

    messagesData.forEach((message, index) => {
        const messageItem = document.createElement('div');
        messageItem.className = `message-item ${!message.read ? 'unread' : ''}`;
        messageItem.onclick = () => viewMessage(index);

        const date = new Date(message.timestamp).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        messageItem.innerHTML = `
            <div class="message-header">
                <span class="message-sender">${message.name}</span>
                <span class="message-date">${date}</span>
            </div>
            <p class="message-preview">${message.message.substring(0, 100)}${message.message.length > 100 ? '...' : ''}</p>
            <span class="message-service">${message.service || 'General'}</span>
        `;

        messagesList.appendChild(messageItem);
    });
}

function loadMessages() {
    messagesData = JSON.parse(localStorage.getItem('contactMessages')) || [];
    updateMessagesList();
    updateDashboard();
    showToast('Mensajes actualizados', 'info');
}

function viewMessage(index) {
    const message = messagesData[index];
    const modal = document.getElementById('message-modal');
    const details = document.getElementById('message-details');

    const date = new Date(message.timestamp).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    details.innerHTML = `
        <div class="message-detail-item">
            <div class="message-detail-label">Nombre:</div>
            <div class="message-detail-value">${message.name}</div>
        </div>
        <div class="message-detail-item">
            <div class="message-detail-label">Correo:</div>
            <div class="message-detail-value">${message.email}</div>
        </div>
        <div class="message-detail-item">
            <div class="message-detail-label">Teléfono:</div>
            <div class="message-detail-value">${message.phone || 'No especificado'}</div>
        </div>
        <div class="message-detail-item">
            <div class="message-detail-label">Servicio:</div>
            <div class="message-detail-value">${message.service || 'General'}</div>
        </div>
        <div class="message-detail-item">
            <div class="message-detail-label">Fecha:</div>
            <div class="message-detail-value">${date}</div>
        </div>
        <div class="message-detail-item">
            <div class="message-detail-label">Mensaje:</div>
            <div class="message-detail-value">${message.message}</div>
        </div>
    `;

    modal.style.display = 'block';

    // Mark as read
    document.getElementById('mark-read-btn').onclick = () => {
        message.read = true;
        localStorage.setItem('contactMessages', JSON.stringify(messagesData));
        updateMessagesList();
        updateDashboard();
        showToast('Mensaje marcado como leído', 'success');
    };
}

// Modal functions
function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Toast notifications
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type} show`;

    toast.innerHTML = `
        <div class="toast-message">${message}</div>
        <div class="toast-time">${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 5000);
}

// Show login message
function showLoginMessage(message, type) {
    const messageEl = document.getElementById('login-message');
    messageEl.textContent = message;
    messageEl.className = `login-message ${type}`;
    messageEl.style.display = 'block';

    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
}

// Export data
function exportData() {
    const data = {
        services: servicesData,
        messages: messagesData,
        images: imagesData,
        about: aboutContent,
        contact: contactData,
        exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-admin-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Datos exportados exitosamente', 'success');
}

// Default data
function getDefaultServices() {
    return [
        {
            title: 'Instalaciones Eléctricas',
            description: 'Instalación completa de sistemas eléctricos residenciales e industriales, incluyendo cableado, tomas, interruptores y tableros eléctricos.',
            category: 'electricidad',
            icon: 'fas fa-bolt',
            image: 'imagenes/Instalaciones Eléctricas Residenciales09.jpg',
            order: 1
        },
        {
            title: 'Reparaciones Eléctricas',
            description: 'Diagnóstico y reparación de fallos eléctricos, mantenimiento preventivo y actualización de instalaciones existentes.',
            category: 'electricidad',
            icon: 'fas fa-tools',
            image: 'imagenes/Reparación y Mantenimiento Eléctrico09.jpg',
            order: 2
        },
        {
            title: 'Servicios de Plomería',
            description: 'Instalación y reparación de tuberías, grifería, sanitarios y sistemas de agua potable y desagüe.',
            category: 'plomeria',
            icon: 'fas fa-wrench',
            image: 'imagenes/Servicios de Plomería General09.jpg',
            order: 3
        },
        {
            title: 'Mantenimiento de Aires',
            description: 'Servicio completo de mantenimiento preventivo y correctivo para sistemas de aire acondicionado.',
            category: 'refrigeracion',
            icon: 'fas fa-snowflake',
            image: 'imagenes/Mantenimiento de Aires Acondicionados09.jpg',
            order: 4
        }
    ];
}

function getDefaultAboutContent() {
    return `
        <h2>Acerca de Nosotros</h2>
        <p>En Multiservicios Eléctricos, somos líderes en soluciones integrales para electricidad, plomería y refrigeración. Nuestra empresa ha crecido gracias a la confianza de nuestros clientes y al compromiso inquebrantable con la excelencia en cada proyecto.</p>
        <h3>Misión</h3>
        <p>Proporcionar servicios de alta calidad en electricidad, plomería y refrigeración, superando las expectativas de nuestros clientes con soluciones innovadoras, seguras y eficientes.</p>
        <h3>Visión</h3>
        <p>Ser la empresa de referencia en República Dominicana para servicios multiservicios, reconocida por nuestra profesionalidad, innovación tecnológica y compromiso con la satisfacción del cliente.</p>
        <h3>Valores</h3>
        <ul>
            <li>Integridad y Honestidad</li>
            <li>Excelencia Técnica</li>
            <li>Innovación Constante</li>
            <li>Compromiso con el Cliente</li>
            <li>Puntualidad y Eficiencia</li>
        </ul>
    `;
}

function getDefaultContactData() {
    return {
        phone: '+1 (829) 696-2202',
        email: 'studiodilonz@gmail.com',
        address: 'C-4, Santiago de los Caballeros 51000, República Dominicana',
        hours: '24/7',
        emergency: '24/7'
    };
}
