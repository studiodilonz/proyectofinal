<?php
$conexion = new mysqli("localhost", "root", "", "mipagina_db");

if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}
// echo "Conectado correctamente";
?>
