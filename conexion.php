<?php
$conexion = new mysqli("localhost", "root", "", "multiservicios_contactos");

if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}
// echo "Conectado correctamente";
?>
