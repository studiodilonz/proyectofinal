<?php
// Configuración de la base de datos
$servername = "localhost";
$username = "root"; // Usuario por defecto de XAMPP
$password = ""; // Contraseña por defecto de XAMPP (vacía)
$dbname = "multiservicios_contactos";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Verificar si el formulario fue enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener datos del formulario
    $nombre = $_POST['name'];
    $email = $_POST['email'];
    $telefono = $_POST['phone'];
    $servicio = $_POST['service'];
    $mensaje = $_POST['message'];

    // Preparar y ejecutar la consulta
    $stmt = $conn->prepare("INSERT INTO contactos (nombre, email, telefono, servicio, mensaje) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $nombre, $email, $telefono, $servicio, $mensaje);

    if ($stmt->execute()) {
        echo "<script>alert('Mensaje enviado exitosamente. Gracias por contactarnos.'); window.location.href='contactos.html';</script>";
    } else {
        echo "<script>alert('Error al enviar el mensaje. Por favor, inténtalo de nuevo.'); window.location.href='contactos.html';</script>";
    }

    $stmt->close();
}

$conn->close();
?>
