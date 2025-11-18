// Admin Scripts - Gestión de contenido administrativo

// Verificar autenticación al cargar cualquier página de admin
function checkAdminAuth() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    }
}

// Logout functionality
function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('adminLoggedIn');
            window.location.href = 'index.html';
        });
    }
}

// Gestión de Servicios
class ServicesManager {
    constructor() {
        this.services = JSON.parse(localStorage.getItem('adminServices')) || [];
        this.init();
    }

    init() {
        this.loadServices();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const addBtn = document.getElementById('add-service-btn');
        const modal = document.getElementById('service-modal');
        const closeModal = document.querySelector('.close-modal');
        const cancelBtn = document.getElementById('cancel-btn');
        const form = document.getElementById('service-form');

        if (addBtn) {
            addBtn.addEventListener('click', () => this.openModal());
        }

        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeModal());
        }

        if (form) {
            form.addEventListener('submit', (e) => this.saveService(e));
        }

        // Cerrar modal al hacer click fuera
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    loadServices() {
        const container = document.getElementById('services-list');
        if (!container) return;

        container.innerHTML = '';

        if (this.services.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No hay servicios registrados aún.</p>';
            return;
        }

        this.services.forEach((service, index) => {
            const serviceElement = this.createServiceElement(service, index);
            container.appendChild(serviceElement);
        });
    }

    createServiceElement(service, index) {
        const div = document.createElement('div');
        div.className = 'service-item';

        div.innerHTML = `
            <div class="service-info">
                <h4>${service.title}</h4>
                <p>${service.description}</p>
                <span class="service-category">${service.category}</span>
            </div>
            <div class="service-actions">
                <button class="btn btn-small btn-edit" onclick="servicesManager.editService(${index})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-small btn-delete" onclick="servicesManager.deleteService(${index})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        `;

        return div;
    }

    openModal(serviceIndex = null) {
        const modal = document.getElementById('service-modal');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('service-form');

        if (serviceIndex !== null) {
            // Edit mode
            const service = this.services[serviceIndex];
            title.textContent = 'Editar Servicio';
            document.getElementById('service-id').value = serviceIndex;
            document.getElementById('service-title').value = service.title;
            document.getElementById('service-description').value = service.description;
            document.getElementById('service-category').value = service.category;
            document.getElementById('service-image').value = service.image || '';
        } else {
            // Add mode
            title.textContent = 'Agregar Nuevo Servicio';
            form.reset();
            document.getElementById('service-id').value = '';
        }

        modal.style.display = 'block';
    }

    closeModal() {
        const modal = document.getElementById('service-modal');
        modal.style.display = 'none';
    }

    saveService(e) {
        e.preventDefault();

        const serviceId = document.getElementById('service-id').value;
        const service = {
            title: document.getElementById('service-title').value,
            description: document.getElementById('service-description').value,
            category: document.getElementById('service-category').value,
            image: document.getElementById('service-image').value,
            createdAt: new Date().toISOString()
        };

        if (serviceId === '') {
            // Add new service
            this.services.push(service);
        } else {
            // Update existing service
            this.services[parseInt(serviceId)] = service;
        }

        this.saveToStorage();
        this.loadServices();
        this.closeModal();

        // Show success message
        this.showMessage('Servicio guardado exitosamente', 'success');
    }

    editService(index) {
        this.openModal(index);
    }

    deleteService(index) {
        if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
            this.services.splice(index, 1);
            this.saveToStorage();
            this.loadServices();
            this.showMessage('Servicio eliminado', 'success');
        }
    }

    saveToStorage() {
        localStorage.setItem('adminServices', JSON.stringify(this.services));
    }

    showMessage(message, type) {
        // Simple notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            padding: 1rem;
            border-radius: 5px;
            z-index: 1000;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
}

// Gestión de Imágenes
class ImagesManager {
    constructor() {
        this.images = JSON.parse(localStorage.getItem('adminImages')) || [];
        this.init();
    }

    init() {
        this.loadImages();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const uploadBtn = document.getElementById('upload-image-btn');
        const modal = document.getElementById('image-modal');
        const closeModal = document.querySelector('.close-modal');
        const cancelBtn = document.getElementById('cancel-upload-btn');
        const form = document.getElementById('image-form');
        const fileInput = document.getElementById('image-file');

        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => this.openModal());
        }

        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeModal());
        }

        if (form) {
            form.addEventListener('submit', (e) => this.uploadImage(e));
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.previewImage(e));
        }

        // Cerrar modal al hacer click fuera
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    loadImages() {
        const container = document.getElementById('images-grid');
        if (!container) return;

        container.innerHTML = '';

        if (this.images.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem; grid-column: 1 / -1;">No hay imágenes subidas aún.</p>';
            return;
        }

        this.images.forEach((image, index) => {
            const imageElement = this.createImageElement(image, index);
            container.appendChild(imageElement);
        });
    }

    createImageElement(image, index) {
        const div = document.createElement('div');
        div.className = 'image-item';

        div.innerHTML = `
            <img src="${image.url}" alt="${image.name}" class="image-preview">
            <div class="image-info">
                <h4>${image.name}</h4>
                <span class="image-category">${image.category}</span>
                <div class="image-actions">
                    <button class="btn btn-small btn-edit" onclick="imagesManager.viewImage('${image.url}')">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    <button class="btn btn-small btn-delete" onclick="imagesManager.deleteImage(${index})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `;

        return div;
    }

    openModal() {
        const modal = document.getElementById('image-modal');
        modal.style.display = 'block';
    }

    closeModal() {
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

    uploadImage(e) {
        e.preventDefault();

        const fileInput = document.getElementById('image-file');
        const file = fileInput.files[0];

        if (!file) {
            alert('Por favor selecciona una imagen');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('La imagen es demasiado grande. Máximo 5MB.');
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
            this.saveToStorage();
            this.loadImages();
            this.closeModal();
            this.showMessage('Imagen subida exitosamente', 'success');
        };

        reader.readAsDataURL(file);
    }

    viewImage(url) {
        window.open(url, '_blank');
    }

    deleteImage(index) {
        if (confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
            this.images.splice(index, 1);
            this.saveToStorage();
            this.loadImages();
            this.showMessage('Imagen eliminada', 'success');
        }
    }

    saveToStorage() {
        localStorage.setItem('adminImages', JSON.stringify(this.images));
    }

    showMessage(message, type) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            padding: 1rem;
            border-radius: 5px;
            z-index: 1000;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
}

// Gestión de Mensajes
class MessagesManager {
    constructor() {
        this.messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        this.init();
    }

    init() {
        this.loadMessages();
        this.setupEventListeners();
        this.updateStats();
    }

    setupEventListeners() {
        const modal = document.getElementById('message-modal');
        const closeModal = document.querySelector('.close-modal');

        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal());
        }

        // Cerrar modal al hacer click fuera
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    loadMessages() {
        const container = document.getElementById('messages-list');
        if (!container) return;

        container.innerHTML = '';

        if (this.messages.length === 0) {
            container.innerHTML = `
                <div class="no-messages">
                    <i class="fas fa-inbox"></i>
                    <p>No hay mensajes nuevos</p>
                </div>
            `;
            return;
        }

        // Mostrar mensajes más recientes primero
        const sortedMessages = [...this.messages].reverse();

        sortedMessages.forEach((message, index) => {
            const messageElement = this.createMessageElement(message, this.messages.length - 1 - index);
            container.appendChild(messageElement);
        });
    }

    createMessageElement(message, originalIndex) {
        const div = document.createElement('div');
        div.className = `message-item ${message.read ? '' : 'unread'}`;

        const date = new Date(message.timestamp).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        div.innerHTML = `
            <div class="message-header">
                <span class="message-sender">${message.name}</span>
                <span class="message-date">${date}</span>
            </div>
            <div class="message-preview">${message.message.substring(0, 100)}${message.message.length > 100 ? '...' : ''}</div>
            <span class="message-service">${message.service}</span>
        `;

        div.addEventListener('click', () => this.openMessageModal(originalIndex));

        return div;
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
        const markReadBtn = document.getElementById('mark-read-btn');
        const deleteBtn = document.getElementById('delete-message-btn');

        if (markReadBtn) {
            markReadBtn.onclick = () => this.markAsRead(index);
        }

        if (deleteBtn) {
            deleteBtn.onclick = () => this.deleteMessage(index);
        }

        modal.style.display = 'block';

        // Mark as read if not already
        if (!message.read) {
            this.markAsRead(index, false);
        }
    }

    closeModal() {
        const modal = document.getElementById('message-modal');
        modal.style.display = 'none';
    }

    markAsRead(index, reload = true) {
        this.messages[index].read = true;
        this.saveToStorage();
        if (reload) {
            this.loadMessages();
            this.updateStats();
            this.closeModal();
            this.showMessage('Mensaje marcado como leído', 'success');
        }
    }

    deleteMessage(index) {
        if (confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
            this.messages.splice(index, 1);
            this.saveToStorage();
            this.loadMessages();
            this.updateStats();
            this.closeModal();
            this.showMessage('Mensaje eliminado', 'success');
        }
    }

    updateStats() {
        const totalElement = document.getElementById('total-messages');
        if (totalElement) {
            const total = this.messages.length;
            const unread = this.messages.filter(m => !m.read).length;
            totalElement.textContent = `${total} mensaje${total !== 1 ? 's' : ''}`;
        }
    }

    saveToStorage() {
        localStorage.setItem('contactMessages', JSON.stringify(this.messages));
    }

    showMessage(message, type) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            padding: 1rem;
            border-radius: 5px;
            z-index: 1000;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
}

// Initialize managers when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    setupLogout();

    // Initialize appropriate manager based on page
    if (document.getElementById('services-list')) {
        window.servicesManager = new ServicesManager();
    }

    if (document.getElementById('images-grid')) {
        window.imagesManager = new ImagesManager();
    }

    if (document.getElementById('messages-list')) {
        window.messagesManager = new MessagesManager();
    }
});
