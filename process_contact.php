<?php
include "conexion.php";

// Recibir los datos del formulario
$nombre = $_POST['name'];
$correo = $_POST['email'];

// Insertar en la base de datos
$sql = "INSERT INTO contactos (nombre, correo) 
        VALUES ('$nombre', '$correo')";

if ($conexion->query($sql) === TRUE) {
    echo "Mensaje enviado correctamente.";
} else {
    echo "Error: " . $conexion->error;
}

$conexion->close();
?>

