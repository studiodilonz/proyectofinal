// Service tabs functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    // Function to filter services based on category
    function filterServices(category) {
        serviceCards.forEach(card => {
            const image = card.querySelector('.service-image');
            if (category === 'todos' || card.getAttribute('data-category') === category) {
                card.style.display = 'block';
                if (image) {
                    image.style.display = 'block';
                }
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Set up tab button event listeners
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active class on buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Filter the services
                const category = this.getAttribute('data-category');
                filterServices(category);
            });
        });
    }

    // Initially filter services to show 'todos'
    const initialCategory = document.querySelector('.tab-btn.active')?.getAttribute('data-category') || 'todos';
    filterServices(initialCategory);
});

// Service card click handlers for modal
document.addEventListener('DOMContentLoaded', function() {
    // Wait for services to load before setting up modal handlers
    setTimeout(() => {
        setupServiceModal();
    }, 100);
});

function setupServiceModal() {
    const serviceCards = document.querySelectorAll('.service-card[data-service]');
    const modal = document.getElementById('service-modal');
    const closeModal = document.querySelector('.close-modal');

    if (serviceCards.length > 0 && modal) {
        // Default service data for detailed modals
        const defaultServiceData = {
            // Refrigeration services
            aires: {
                title: 'Mantenimiento de Aires Acondicionados',
                image: 'imagenes/Mantenimiento de Aires Acondicionados.jpg',
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
                image: 'imagenes/nevera.jpg',
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
                image: 'imagenes/Sistemas de Refrigeración Industrial.jpg',
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
                image: 'imagenes/Reparación de Equipos de Refrigeración.jpg',
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
                image: 'imagenes/Control de Temperatura y Monitoreo.jpg',
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
                image: 'imagenes/Recarga y Mantenimiento de Refrigerante.jpg',
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
                image: 'imagenes/Instalaciones Eléctricas Residenciales.jpg',
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
                image: 'imagenes/Instalaciones Eléctricas industriales.jpg',
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
                image: 'imagenes/Reparación y Mantenimiento Eléctrico.jpg',
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
                image: 'imagenes/Servicios de Plomería General.jpg',
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
                image: 'imagenes/Plomería de Emergencias.jpg',
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
                const serviceKey = this.getAttribute('data-service');
                let data = defaultServiceData[serviceKey];

                // If not in default data, check if it's an admin service
                if (!data && window.servicesData) {
                    const adminService = window.servicesData.find(s => s.dataService === serviceKey || s.dataService === 'admin-service-' + Array.from(serviceCards).indexOf(this));
                    if (adminService) {
                        data = {
                            title: adminService.title,
                            image: adminService.image || 'imagenes/default-service.jpg',
                            description: adminService.description,
                            features: [
                                'Servicio personalizado',
                                'Atención profesional',
                                'Garantía en trabajos',
                                'Presupuesto sin compromiso'
                            ]
                        };
                    }
                }

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
                    modal.classList.add('show');
                    modal.classList.remove('fade-in');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        // Close modal when clicking X
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                modal.classList.add('fade-in');
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            });
        }

        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.classList.add('fade-in');
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });

        // Optional: Remove modal from tab order and add event listener for animation end to handle display none equivalently
    }
}

// Service card hover effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});
