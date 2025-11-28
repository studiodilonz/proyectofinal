<?php
include 'conexion.php';

// Recibir datos del formulario
$nombre = $_POST['nombre'];
$correo = $_POST['correo'];
$mensaje = $_POST['mensaje'];

// Insertar en la base
$sql = "INSERT INTO contactos (nombre, correo, mensaje) 
        VALUES ('$nombre', '$correo', '$mensaje')";

if ($conexion->query($sql) === TRUE) {
    echo "Datos guardados correctamente";
} else {
    echo "Error: " . $conexion->error;
}
?>
