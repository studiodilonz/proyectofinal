<?php
require_once 'admin_check.php';
require_once 'conexion.php';

// Obtener estadísticas para el dashboard
$stats = array();

// Contar servicios activos
$result = $conexion->query("SELECT COUNT(*) as total FROM servicios WHERE activo = 1");
$stats['servicios_activos'] = $result->fetch_assoc()['total'];

// Contar mensajes de contacto
$result = $conexion->query("SELECT COUNT(*) as total FROM contactos");
$stats['total_contactos'] = $result->fetch_assoc()['total'];

// Contar mensajes no leídos (últimos 7 días)
$result = $conexion->query("SELECT COUNT(*) as total FROM contactos WHERE fecha_envio >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
$stats['contactos_recientes'] = $result->fetch_assoc()['total'];

// Obtener servicios por categoría
$result = $conexion->query("SELECT categoria, COUNT(*) as total FROM servicios WHERE activo = 1 GROUP BY categoria");
$categorias = array();
while ($row = $result->fetch_assoc()) {
    $categorias[$row['categoria']] = $row['total'];
}
$stats['categorias'] = $categorias;

// Obtener últimos 5 mensajes de contacto
$result = $conexion->query("SELECT id, nombre, email, servicio, fecha_envio FROM contactos ORDER BY fecha_envio DESC LIMIT 5");
$ultimos_contactos = array();
while ($row = $result->fetch_assoc()) {
    $ultimos_contactos[] = $row;
}
$stats['ultimos_contactos'] = $ultimos_contactos;

header('Content-Type: application/json');
echo json_encode($stats);
?>
