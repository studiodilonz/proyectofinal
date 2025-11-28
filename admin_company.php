<?php
require_once 'admin_check.php';
require_once 'conexion.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Obtener toda la información de la empresa
        $result = $conexion->query("SELECT * FROM informacion_empresa ORDER BY tipo");
        $info = array();
        while ($row = $result->fetch_assoc()) {
            $info[$row['tipo']] = $row['contenido'];
        }
        echo json_encode($info);
        break;

    case 'PUT':
        // Actualizar información de la empresa
        $data = json_decode(file_get_contents('php://input'), true);

        $success = true;
        $errors = array();

        foreach ($data as $tipo => $contenido) {
            $tipo_escaped = $conexion->real_escape_string($tipo);
            $contenido_escaped = $conexion->real_escape_string($contenido);

            // Verificar si existe el registro
            $check = $conexion->query("SELECT id FROM informacion_empresa WHERE tipo = '$tipo_escaped'");

            if ($check->num_rows > 0) {
                // Actualizar
                $sql = "UPDATE informacion_empresa SET contenido = '$contenido_escaped', updated_at = NOW() WHERE tipo = '$tipo_escaped'";
            } else {
                // Insertar
                $sql = "INSERT INTO informacion_empresa (tipo, contenido, updated_at) VALUES ('$tipo_escaped', '$contenido_escaped', NOW())";
            }

            if (!$conexion->query($sql)) {
                $success = false;
                $errors[] = "Error en $tipo: " . $conexion->error;
            }
        }

        if ($success) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'errors' => $errors]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
}
?>
