// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.services = JSON.parse(localStorage.getItem('adminServices')) || [];
        this.messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        this.images = JSON.parse(localStorage.getItem('adminImages')) || [];
        this.init();
    }

    init() {
        this.checkAuth();
        this.setupEventListeners();
        this.loadDashboard();
        this.updateStats();
    }

    checkAuth() {
        const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
        if (!isLoggedIn) {
            // Show login section and hide admin panel
            document.getElementById('login-section').style.display = 'block';
            document.getElementById('admin-container').style.display = 'none';
            this.setupLoginForm();
        } else {
            // Show admin panel and hide login section
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('admin-container').style.display = 'block';
        }
    }

    setupLoginForm() {
        const loginForm = document.getElementById('admin-login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('username').value.trim();
                const password = document.getElementById('password').value.trim();

                if (username === 'admin' && password === 'admin123') {
                    sessionStorage.setItem('adminLoggedIn', 'true');
                    document.getElementById('login-section').style.display = 'none';
                    document.getElementById('admin-container').style.display = 'block';
                    this.showNotification('Inicio de sesión exitoso', 'success');
                    this.loadDashboard();
                    this.updateStats();
                } else {
                    this.showNotification('Usuario o contraseña incorrectos.', 'error');
                }
            });
        }
    }

    setupEventListeners() {
        // Sidebar navigation
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.getAttribute('data-section');
                this.switchSection(section);
            });
        });

        // Sidebar toggle
        document.getElementById('sidebar-toggle').addEventListener('click', () => {
            document.querySelector('.admin-sidebar').classList.toggle('show');
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => {
            sessionStorage.removeItem('adminLoggedIn');
            window.location.href = 'index.html';
        });

        // Services
        this.setupServicesListeners();

        // Messages
        this.setupMessagesListeners();

        // Images
        this.setupImagesListeners();

        // Settings
        this.setupSettingsListeners();

        // Modal closes
        this.setupModalListeners();
    }

    switchSection(section) {
        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Hide all sections
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });

        // Show selected section
        document.getElementById(`${section}-section`).classList.add('active');

        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            services: 'Gestión de Servicios',
            messages: 'Mensajes de Contacto',
            images: 'Gestión de Imágenes',
            settings: 'Configuración'
        };
        document.getElementById('page-title').textContent = titles[section];

        // Load section data
        this.currentSection = section;
        this.loadSectionData(section);
    }

    loadSectionData(section) {
        switch(section) {
            case 'services':
                this.loadServices();
                break;
            case 'messages':
                this.loadMessages();
                break;
            case 'images':
                this.loadImages();
                break;
        }
    }

    // Dashboard
    loadDashboard() {
        this.updateStats();
        this.loadRecentActivity();
    }

    updateStats() {
        const totalMessages = this.messages.length;
        const unreadMessages = this.messages.filter(m => !m.read).length;
        const totalServices = this.services.length;
        const totalImages = this.images.length;

        document.getElementById('total-messages').textContent = totalMessages;
        document.getElementById('unread-messages').textContent = unreadMessages;
        document.getElementById('total-services').textContent = totalServices;
        document.getElementById('total-images').textContent = totalImages;
    }

    loadRecentActivity() {
        const activityList = document.getElementById('recent-activity');
        const recentItems = [];

        // Add recent messages
        const recentMessages = this.messages.slice(-3).reverse();
        recentMessages.forEach(msg => {
            recentItems.push({
                icon: 'envelope',
                text: `Nuevo mensaje de ${msg.name}`,
                time: this.getTimeAgo(msg.timestamp)
            });
        });

        // Add recent services
        const recentServices = this.services.slice(-2).reverse();
        recentServices.forEach(service => {
            recentItems.push({
                icon: 'tools',
                text: `Servicio "${service.title}" agregado`,
                time: 'Recientemente'
            });
        });

        // Add recent images
        const recentImages = this.images.slice(-2).reverse();
        recentImages.forEach(image => {
            recentItems.push({
                icon: 'image',
                text: `Imagen "${image.name}" subida`,
                time: 'Recientemente'
            });
        });

        // Show recent activity or default message
        if (recentItems.length > 0) {
            activityList.innerHTML = recentItems.slice(0, 5).map(item => `
                <div class="activity-item">
                    <i class="fas fa-${item.icon}"></i>
                    <div class="activity-content">
                        <p>${item.text}</p>
                        <span class="activity-time">${item.time}</span>
                    </div>
                </div>
            `).join('');
        } else {
            activityList.innerHTML = `
                <div class="activity-item">
                    <i class="fas fa-info-circle"></i>
                    <div class="activity-content">
                        <p>Panel de administración inicializado</p>
                        <span class="activity-time">Ahora mismo</span>
                    </div>
                </div>
            `;
        }
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now - time;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Ahora mismo';
        if (minutes < 60) return `Hace ${minutes} minutos`;
        if (hours < 24) return `Hace ${hours} horas`;
        return `Hace ${days} días`;
    }

    // Services Management
    setupServicesListeners() {
        document.getElementById('add-service-btn').addEventListener('click', () => {
            this.openServiceModal();
        });

        document.getElementById('service-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveService();
        });

        document.getElementById('service-cancel-btn').addEventListener('click', () => {
            this.closeServiceModal();
        });

        // Event delegation for edit and delete buttons
        document.getElementById('services-grid').addEventListener('click', (e) => {
            console.log('Click detected on services-grid');
            const target = e.target.closest('button');
            console.log('Target button:', target);
            if (!target) return;

            const serviceCard = target.closest('.service-card');
            console.log('Service card:', serviceCard);
            if (!serviceCard) return;

            const index = parseInt(serviceCard.getAttribute('data-index'));
            console.log('Index:', index);

            if (target.classList.contains('edit-btn')) {
                console.log('Edit button clicked');
                this.editService(index);
            } else if (target.classList.contains('delete-btn')) {
                console.log('Delete button clicked');
                this.deleteService(index);
            }
        });
    }

    loadServices() {
        const container = document.getElementById('services-grid');

        if (this.services.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-tools"></i>
                    <h3>No hay servicios</h3>
                    <p>Agrega tu primer servicio para comenzar</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.services.map((service, index) => `
            <div class="service-card" data-index="${index}">
                <div class="service-header">
                    <div class="service-title">${service.title}</div>
                    <span class="service-category">${service.category}</span>
                </div>
                <div class="service-content">
                    <div class="service-description">${service.description}</div>
                    <div class="service-actions">
                        <button class="edit-btn">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="delete-btn">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    openServiceModal(serviceIndex = null) {
        const modal = document.getElementById('service-modal');
        const title = document.getElementById('service-modal-title');
        const form = document.getElementById('service-form');

        if (serviceIndex !== null) {
            const service = this.services[serviceIndex];
            title.textContent = 'Editar Servicio';
            document.getElementById('service-id').value = serviceIndex;
            document.getElementById('service-title').value = service.title;
            document.getElementById('service-description').value = service.description;
            document.getElementById('service-category').value = service.category;
            document.getElementById('service-image').value = service.image || '';
        } else {
            title.textContent = 'Agregar Servicio';
            form.reset();
            document.getElementById('service-id').value = '';
        }

        modal.style.display = 'block';
    }

    closeServiceModal() {
        document.getElementById('service-modal').style.display = 'none';
    }

    saveService() {
        const serviceId = document.getElementById('service-id').value;
        const service = {
            title: document.getElementById('service-title').value,
            description: document.getElementById('service-description').value,
            category: document.getElementById('service-category').value,
            image: document.getElementById('service-image').value,
            createdAt: new Date().toISOString()
        };

        if (serviceId === '') {
            this.services.push(service);
        } else {
            this.services[parseInt(serviceId)] = service;
        }

        this.saveServices();
        this.loadServices();
        this.updateStats();
        this.updateWebsiteServices(); // Update the main website
        this.closeServiceModal();
        this.showNotification('Servicio guardado exitosamente', 'success');
    }

    editService(index) {
        this.openServiceModal(index);
    }

    deleteService(index) {
        if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
            this.services.splice(index, 1);
            this.saveServices();
            this.loadServices();
            this.updateStats();
            this.updateWebsiteServices(); // Update the main website
            this.showNotification('Servicio eliminado', 'success');
        }
    }

    saveServices() {
        localStorage.setItem('adminServices', JSON.stringify(this.services));
    }

    // Messages Management
    setupMessagesListeners() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.getAttribute('data-filter');
                this.filterMessages(filter);
            });
        });
    }

    loadMessages(filter = 'all') {
        const container = document.getElementById('messages-list');
        let filteredMessages = this.messages;

        switch(filter) {
            case 'unread':
                filteredMessages = this.messages.filter(m => !m.read);
                break;
            case 'read':
                filteredMessages = this.messages.filter(m => m.read);
                break;
        }

        if (filteredMessages.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-envelope"></i>
                    <h3>No hay mensajes</h3>
                    <p>${filter === 'unread' ? 'Todos los mensajes han sido leídos' : 'No hay mensajes en esta categoría'}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredMessages.reverse().map((message, index) => {
            const originalIndex = this.messages.indexOf(message);
            const date = new Date(message.timestamp).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            return `
                <div class="message-item ${message.read ? '' : 'unread'}" onclick="adminPanel.openMessageModal(${originalIndex})">
                    <div class="message-header">
                        <div class="message-sender">${message.name}</div>
                        <div class="message-date">${date}</div>
                    </div>
                    <div class="message-preview">${message.message.substring(0, 100)}${message.message.length > 100 ? '...' : ''}</div>
                    <span class="message-service">${message.service}</span>
                </div>
            `;
        }).join('');
    }

    filterMessages(filter) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        this.loadMessages(filter);
    }

    openMessageModal(index) {
        const message = this.messages[index];
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
                <div class="message-detail-label">Email:</div>
                <div class="message-detail-value">${message.email}</div>
            </div>
            <div class="message-detail-item">
                <div class="message-detail-label">Teléfono:</div>
                <div class="message-detail-value">${message.phone}</div>
            </div>
            <div class="message-detail-item">
                <div class="message-detail-label">Servicio:</div>
                <div class="message-detail-value">${message.service}</div>
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

        // Setup action buttons
        document.getElementById('mark-read-btn').onclick = () => this.markAsRead(index);
        document.getElementById('delete-message-btn').onclick = () => this.deleteMessage(index);

        modal.style.display = 'block';

        // Mark as read
        if (!message.read) {
            this.markAsRead(index, false);
        }
    }

    markAsRead(index, reload = true) {
        this.messages[index].read = true;
        this.saveMessages();
        if (reload) {
            this.loadMessages();
            this.updateStats();
            this.closeMessageModal();
            this.showNotification('Mensaje marcado como leído', 'success');
        }
    }

    deleteMessage(index) {
        if (confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
            this.messages.splice(index, 1);
            this.saveMessages();
            this.loadMessages();
            this.updateStats();
            this.closeMessageModal();
            this.showNotification('Mensaje eliminado', 'success');
        }
    }

    closeMessageModal() {
        document.getElementById('message-modal').style.display = 'none';
    }

    saveMessages() {
        localStorage.setItem('contactMessages', JSON.stringify(this.messages));
    }

    // Images Management
    setupImagesListeners() {
        document.getElementById('upload-image-btn').addEventListener('click', () => {
            this.openImageModal();
        });

        document.getElementById('image-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.uploadImage();
        });

        document.getElementById('image-cancel-btn').addEventListener('click', () => {
            this.closeImageModal();
        });

        document.getElementById('image-file').addEventListener('change', (e) => {
            this.previewImage(e);
        });
    }

    loadImages() {
        const container = document.getElementById('images-grid');

        if (this.images.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-image"></i>
                    <h3>No hay imágenes</h3>
                    <p>Sube tu primera imagen para comenzar</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.images.map((image, index) => `
            <div class="image-card">
                <img src="${image.url}" alt="${image.name}" class="image-preview">
                <div class="image-info">
                    <div class="image-name">${image.name}</div>
                    <span class="image-category">${image.category}</span>
                    <div class="image-actions">
                        <button class="view-btn" onclick="adminPanel.viewImage('${image.url}')">
                            <i class="fas fa-eye"></i> Ver
                        </button>
                        <button class="image-delete-btn" onclick="adminPanel.deleteImage(${index})">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    openImageModal() {
        document.getElementById('image-modal').style.display = 'block';
    }

    closeImageModal() {
        const modal = document.getElementById('image-modal');
        const preview = document.getElementById('image-preview');
        const form = document.getElementById('image-form');

        modal.style.display = 'none';
        if (preview) preview.style.display = 'none';
        if (form) form.reset();
    }

    previewImage(e) {
        const file = e.target.files[0];
        const preview = document.getElementById('image-preview');

        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }

    uploadImage() {
        const fileInput = document.getElementById('image-file');
        const file = fileInput.files[0];

        if (!file) {
            this.showNotification('Por favor selecciona una imagen', 'error');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            this.showNotification('La imagen es demasiado grande. Máximo 5MB.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const image = {
                name: document.getElementById('image-name').value,
                category: document.getElementById('image-category').value,
                url: e.target.result,
                uploadedAt: new Date().toISOString(),
                size: file.size
            };

            this.images.push(image);
            this.saveImages();
            this.loadImages();
            this.updateStats();
            this.closeImageModal();
            this.showNotification('Imagen subida exitosamente', 'success');
        };

        reader.readAsDataURL(file);
    }

    viewImage(url) {
        window.open(url, '_blank');
    }

    deleteImage(index) {
        if (confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
            this.images.splice(index, 1);
            this.saveImages();
            this.loadImages();
            this.updateStats();
            this.showNotification('Imagen eliminada', 'success');
        }
    }

    saveImages() {
        localStorage.setItem('adminImages', JSON.stringify(this.images));
    }

    // Settings Management
    setupSettingsListeners() {
        document.getElementById('change-password-btn').addEventListener('click', () => {
            this.openPasswordModal();
        });

        document.getElementById('password-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.changePassword();
        });

        document.getElementById('password-cancel-btn').addEventListener('click', () => {
            this.closePasswordModal();
        });

        document.getElementById('clear-data-btn').addEventListener('click', () => {
            this.clearAllData();
        });
    }

    openPasswordModal() {
        document.getElementById('password-modal').style.display = 'block';
    }

    closePasswordModal() {
        document.getElementById('password-modal').style.display = 'none';
        document.getElementById('password-form').reset();
    }

    changePassword() {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Simple validation (in production, this would be more secure)
        if (newPassword !== confirmPassword) {
            this.showNotification('Las contraseñas no coinciden', 'error');
            return;
        }

        if (newPassword.length < 6) {
            this.showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }

        // In a real app, this would update the password securely
        this.showNotification('Contraseña cambiada exitosamente', 'success');
        this.closePasswordModal();
    }

    clearAllData() {
        if (confirm('¿Estás seguro de que quieres eliminar TODOS los datos? Esta acción no se puede deshacer.')) {
            localStorage.removeItem('adminServices');
            localStorage.removeItem('contactMessages');
            localStorage.removeItem('adminImages');

            this.services = [];
            this.messages = [];
            this.images = [];

            this.updateStats();
            this.loadDashboard();
            this.showNotification('Todos los datos han sido eliminados', 'warning');
        }
    }

    // Modal Management
    setupModalListeners() {
        // Service modal
        document.getElementById('service-modal-close').addEventListener('click', () => {
            this.closeServiceModal();
        });

        // Message modal
        document.getElementById('message-modal-close').addEventListener('click', () => {
            this.closeMessageModal();
        });

        // Image modal
        document.getElementById('image-modal-close').addEventListener('click', () => {
            this.closeImageModal();
        });

        // Password modal
        document.getElementById('password-modal-close').addEventListener('click', () => {
            this.closePasswordModal();
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    // Update Website Services
    updateWebsiteServices() {
        // This function will update the main website pages with the new services
        // For now, we'll store the services in a way that can be accessed by other pages
        localStorage.setItem('websiteServices', JSON.stringify(this.services));
        this.showNotification('Sitio web actualizado con los nuevos servicios', 'success');
    }

    // Utility Functions
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.adminPanel = new AdminPanel();
});
