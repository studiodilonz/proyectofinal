-- Script SQL para crear la base de datos y tabla para formularios de contacto
-- Ejecutar este script en phpMyAdmin o MySQL Command Line de XAMPP

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS multiservicios_contactos;

-- Usar la base de datos
USE multiservicios_contactos;

-- Crear la tabla para almacenar los envíos del formulario
CREATE TABLE IF NOT EXISTS contactos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    servicio VARCHAR(100),
    mensaje TEXT NOT NULL,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar un registro de ejemplo (opcional)
INSERT INTO contactos (nombre, email, telefono, servicio, mensaje) VALUES
('Juan Pérez', 'juan@example.com', '809-123-4567', 'electricidad', 'Necesito una instalación eléctrica.');
