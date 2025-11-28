# Sistema de Administración - Lista de Tareas

## Base de Datos
- [x] Actualizar database_setup.sql con tablas para admin, servicios e información de empresa
- [x] Crear tabla de administradores (id, username, password_hash, created_at)
- [x] Crear tabla de servicios (id, titulo, descripcion, categoria, imagen, icono, detalles, activo)
- [x] Crear tabla de informacion_empresa (id, tipo, contenido, updated_at)

## Backend PHP
- [ ] Crear admin_login.php para autenticación
- [ ] Crear admin_logout.php para cerrar sesión
- [ ] Crear admin_check.php para verificar sesión activa
- [ ] Crear admin_services.php para CRUD de servicios
- [ ] Crear admin_company.php para gestión de información de empresa
- [ ] Crear admin_dashboard.php como panel principal

## Frontend Admin
- [ ] Crear login.html con diseño moderno
- [ ] Crear admin.html como dashboard principal
- [ ] Crear admin_services.html para gestión de servicios
- [ ] Crear admin_company.html para gestión de información
- [x] Crear estilos específicos para admin (admin_styles.css)

## Integración con Sitio Público
- [ ] Modificar servicios.html para cargar servicios desde BD
- [ ] Modificar acerca.html para cargar info desde BD
- [ ] Modificar contactos.html para cargar info desde BD
- [ ] Actualizar scripts.js para trabajar con datos dinámicos

## Seguridad
- [ ] Implementar hash de contraseñas
- [ ] Validar sesiones en todas las páginas admin
- [ ] Sanitizar inputs para prevenir SQL injection
- [ ] Implementar protección CSRF básica

## Testing
- [ ] Probar login/logout
- [ ] Probar CRUD de servicios
- [ ] Probar gestión de información de empresa
- [ ] Verificar que el sitio público funcione correctamente
