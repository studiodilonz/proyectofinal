# Instrucciones para Conectar el Proyecto a XAMPP

## Paso 1: Instalar y Ejecutar XAMPP
1. Descarga e instala XAMPP desde https://www.apachefriends.org/es/index.html
2. Abre el Panel de Control de XAMPP
3. Inicia los módulos Apache y MySQL haciendo clic en "Start"

## Paso 2: Configurar la Base de Datos
1. Abre tu navegador y ve a http://localhost/phpmyadmin
2. Crea una nueva base de datos llamada `multiservicios_contactos`
3. Selecciona la base de datos recién creada
4. Ve a la pestaña "Importar"
5. Haz clic en "Seleccionar archivo" y elige el archivo `database_setup.sql` de tu proyecto
6. Haz clic en "Continuar" para ejecutar el script SQL

## Paso 3: Colocar los Archivos en XAMPP
Tu proyecto actual está en: `c:/Users/Admin/OneDrive/Documentos/GitHub/proyectofinal`

Para que funcione con XAMPP, necesitas copiar los archivos a la carpeta `htdocs` de XAMPP:

1. Abre el Explorador de Archivos
2. Navega a `C:\xampp\htdocs`
3. Crea una nueva carpeta llamada `proyectofinal` (o el nombre que prefieras)
4. Copia todos los archivos de tu proyecto actual a `C:\xampp\htdocs\proyectofinal`

Archivos necesarios:
- contactos.html
- process_contact.php
- styles.css
- scripts.js
- imagenes/ (carpeta completa)

## Paso 4: Probar el Formulario
1. Abre tu navegador
2. Ve a: `http://localhost/proyectofinal/contactos.html`
3. Llena y envía el formulario de contacto
4. Verifica en phpMyAdmin que los datos se hayan guardado en la tabla `contactos`

## Notas Importantes
- Asegúrate de que Apache y MySQL estén ejecutándose en XAMPP
- Si cambias las credenciales de MySQL en XAMPP, actualiza `process_contact.php` con los nuevos valores
- El usuario por defecto de MySQL en XAMPP es `root` con contraseña vacía

## Solución de Problemas
- Si no puedes acceder a phpMyAdmin, verifica que MySQL esté corriendo
- Si el formulario no envía datos, revisa la consola del navegador (F12) para errores
- Asegúrate de que los archivos estén en la carpeta correcta de htdocs
