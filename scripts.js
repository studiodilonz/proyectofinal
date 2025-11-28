// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add animation classes to elements
document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(element => {
    observer.observe(element);
});

// Enhanced Form Handling
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const service = document.getElementById('service').value;
        const message = document.getElementById('message').value.trim();

        // Basic validation
        if (!name || !email || !message) {
            e.preventDefault();
            showNotification('Por favor, completa todos los campos obligatorios.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            e.preventDefault();
            showNotification('Por favor, ingresa un correo electrónico válido.', 'error');
            return;
        }

        // If validation passes, allow form submission to process_contact.php
        // The PHP script will handle the database insertion and show success/error messages
    });
}

// Notification system
function showNotification(message, type) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Style notification
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '10px';
    notification.style.color = '#fff';
    notification.style.fontWeight = 'bold';
    notification.style.zIndex = '10000';
    notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    notification.style.maxWidth = '300px';

    if (type === 'success') {
        notification.style.backgroundColor = '#28a745';
    } else {
        notification.style.backgroundColor = '#dc3545';
    }

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});



// Add loading animation to page
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Parallax effect for hero section (subtle)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
    }
});

// Service card hover effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click tracking for social links
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', function(e) {
        // For WhatsApp, Instagram, and TikTok links, don't prevent default
        if (!this.href.includes('wa.me') && !this.href.includes('instagram.com') && !this.href.includes('tiktok.com')) {
            e.preventDefault();
            showNotification('Red social próximamente disponible.', 'error');
        }
    });
});

// Service tabs functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');

                const category = this.getAttribute('data-category');

                // Show/hide cards based on category
                serviceCards.forEach(card => {
                    if (category === 'todos' || card.getAttribute('data-category') === category) {
                        card.style.display = 'block';
                        // Show images only when clicking on tabs
                        const image = card.querySelector('.service-image');
                        if (image) {
                            image.style.display = 'block';
                        }
                    } else {
                        card.style.display = 'none';
                        // Hide images for non-active categories
                        const image = card.querySelector('.service-image');
                        if (image) {
                            image.style.display = 'none';
                        }
                    }
                });
            });
        });
    }
});

// Service card click handlers for modal
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card[data-service]');
    const modal = document.getElementById('service-modal');
    const closeModal = document.querySelector('.close-modal');

    if (serviceCards.length > 0 && modal) {
        // Service data
        const serviceData = {
            // Refrigeration services
            aires: {
                title: 'Mantenimiento de Aires Acondicionados',
                image: 'imagenes/Mantenimiento de Aires Acondicionados09.jpg',
                description: 'Servicio completo de mantenimiento preventivo y correctivo para sistemas de aire acondicionado. Garantizamos el óptimo funcionamiento de su equipo durante todo el año.',
                features: [
                    'Limpieza profunda de filtros y serpentines',
                    'Verificación y recarga de refrigerante',
                    'Calibración de termostatos',
                    'Inspección de componentes eléctricos',
                    'Limpieza de drenajes y eliminación de obstrucciones',
                    'Pruebas de funcionamiento y eficiencia'
                ]
            },
            neveras: {
                title: 'Reparación de Neveras y Congeladores',
                image: 'imagenes/nevera09.jpg',
                description: 'Diagnóstico profesional y reparación especializada de neveras, congeladores y equipos de refrigeración comercial. Solucionamos cualquier problema técnico.',
                features: [
                    'Diagnóstico electrónico avanzado',
                    'Reparación de compresores y motores',
                    'Reemplazo de evaporadores y condensadores',
                    'Reparación de sistemas de descongelamiento',
                    'Calibración de termostatos',
                    'Reparación de puertas y sellos'
                ]
            },
            industrial: {
                title: 'Sistemas de Refrigeración Industrial',
                image: 'imagenes/Sistemas de Refrigeración Industrial09.jpg',
                description: 'Instalación, mantenimiento y reparación de sistemas de refrigeración industrial para almacenes, fábricas y comercios. Tecnología de vanguardia para máxima eficiencia.',
                features: [
                    'Instalación de cámaras frigoríficas',
                    'Mantenimiento de vitrinas refrigeradas',
                    'Sistemas de climatización industrial',
                    'Monitoreo continuo de temperaturas',
                    'Optimización energética',
                    'Certificación de cumplimiento normativo'
                ]
            },
            equipos: {
                title: 'Reparación de Equipos de Refrigeración',
                image: 'imagenes/Reparación de Equipos de Refrigeración09.jpg',
                description: 'Servicio técnico especializado para dispensadores de agua, máquinas de hielo y equipos comerciales de refrigeración. Reparaciones rápidas y garantizadas.',
                features: [
                    'Reparación de dispensadores de agua',
                    'Mantenimiento de máquinas de hielo',
                    'Reparación de equipos comerciales',
                    'Reemplazo de componentes defectuosos',
                    'Limpieza y desinfección',
                    'Pruebas de funcionamiento'
                ]
            },
            temperatura: {
                title: 'Control de Temperatura y Monitoreo',
                image: 'imagenes/Control de Temperatura y Monitoreo09.jpg',
                description: 'Instalación de sistemas avanzados de monitoreo continuo para mantener temperaturas óptimas en almacenes, cámaras y áreas refrigeradas.',
                features: [
                    'Instalación de sensores de temperatura',
                    'Sistemas de monitoreo remoto',
                    'Alertas automáticas por SMS/email',
                    'Registros históricos de temperaturas',
                    'Certificación HACCP',
                    'Mantenimiento preventivo programado'
                ]
            },
            refrigerante: {
                title: 'Recarga y Mantenimiento de Refrigerante',
                image: 'imagenes/Recarga y Mantenimiento de Refrigerante09.jpg',
                description: 'Recarga ecológica de refrigerantes con productos certificados. Detección de fugas y mantenimiento preventivo para prolongar la vida útil de sus equipos.',
                features: [
                    'Recarga con refrigerantes ecológicos R-134a, R-410A',
                    'Detección de fugas con equipos especializados',
                    'Recuperación y reciclaje de refrigerantes',
                    'Mantenimiento preventivo',
                    'Certificación EPA para manejo de refrigerantes',
                    'Garantía en trabajos realizados'
                ]
            },
            // Electricity services
            electricidad_residencial: {
                title: 'Instalaciones Eléctricas Residenciales',
                image: 'imagenes/Instalaciones Eléctricas Residenciales09.jpg',
                description: 'Instalación completa de sistemas eléctricos en viviendas, incluyendo cableado, tomas, interruptores y sistemas de iluminación. Cumplimos con todas las normativas de seguridad.',
                features: [
                    'Instalación de cableado estructurado',
                    'Colocación de tomas e interruptores',
                    'Sistemas de iluminación LED',
                    'Instalación de breakers y tableros eléctricos',
                    'Certificación de instalaciones',
                    'Garantía en trabajos realizados'
                ]
            },
            electricidad_industrial: {
                title: 'Instalaciones Eléctricas Industriales',
                image: 'imagenes/Instalaciones Eléctricas industriales09.jpg',
                description: 'Soluciones eléctricas para empresas, fábricas y comercios con sistemas de alta capacidad y seguridad industrial. Diseñamos sistemas eficientes y seguros.',
                features: [
                    'Instalación de transformadores y subestaciones',
                    'Sistemas de distribución eléctrica',
                    'Instalación de motores y equipos industriales',
                    'Sistemas de control y automatización',
                    'Certificación industrial',
                    'Mantenimiento preventivo programado'
                ]
            },
            reparacion_electrica: {
                title: 'Reparación y Mantenimiento Eléctrico',
                image: 'imagenes/Reparación y Mantenimiento Eléctrico09.jpg',
                description: 'Diagnóstico y reparación de fallos eléctricos, mantenimiento preventivo y actualización de instalaciones existentes. Servicio rápido y profesional.',
                features: [
                    'Diagnóstico de fallos eléctricos',
                    'Reparación de circuitos y conexiones',
                    'Reemplazo de componentes defectuosos',
                    'Actualización de instalaciones antiguas',
                    'Inspección de seguridad eléctrica',
                    'Certificación de reparaciones'
                ]
            },
            // Plumbing services
            plomeria_general: {
                title: 'Servicios de Plomería General',
                image: 'imagenes/Servicios de Plomería General09.jpg',
                description: 'Instalación y reparación de tuberías, grifería, sanitarios y sistemas de agua potable y desagüe. Trabajamos con materiales de alta calidad.',
                features: [
                    'Instalación de tuberías de agua y desagüe',
                    'Reparación de grifería y sanitarios',
                    'Instalación de calentadores de agua',
                    'Reparación de fugas y obstrucciones',
                    'Mantenimiento preventivo',
                    'Garantía en instalaciones'
                ]
            },
            plomeria_emergencias: {
                title: 'Plomería de Emergencias',
                image: 'imagenes/Plomería de Emergencias09.jpg',
                description: 'Servicio 24/7 para emergencias de plomería: fugas, inundaciones, obstrucciones y reparaciones urgentes. Respuesta inmediata garantizada.',
                features: [
                    'Servicio de emergencias 24 horas',
                    'Reparación inmediata de fugas',
                    'Desobstrucción de tuberías',
                    'Extracción de agua por inundaciones',
                    'Reparaciones urgentes',
                    'Atención prioritaria'
                ]
            }
        };

        // Add click event to each service card
        serviceCards.forEach(card => {
            card.addEventListener('click', function() {
                const service = this.getAttribute('data-service');
                const data = serviceData[service];

                if (data) {
                    // Populate modal
                    document.getElementById('modal-title').textContent = data.title;
                    document.getElementById('modal-image').src = data.image;
                    document.getElementById('modal-description').textContent = data.description;

                    // Clear and populate features
                    const featuresList = document.getElementById('modal-features');
                    featuresList.innerHTML = '';
                    data.features.forEach(feature => {
                        const li = document.createElement('li');
                        li.textContent = feature;
                        featuresList.appendChild(li);
                    });

                    // Show modal
                    modal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        // Close modal when clicking X
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }

        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
});
