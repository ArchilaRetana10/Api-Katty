Esta es una API construida con Node.js, Express y PostgreSQL, cuyo objetivo es gestionar usuarios, mensajes y relaciones de seguidores.
La aplicación implementa un sistema de autenticación con almacenado en cookies seguras, lo que permite mantener la sesión activa sin necesidad de enviar manualmente tokens en cada petición.
De esta manera, los usuarios pueden:

Registrarse.
Publicar y consultar mensajes.
Seguir y dejar de seguir a otros usuarios.
Consultar quiénes lo siguen y a quiénes sigue.
Ver mensajes de los usuarios que sigue.
Y cerrar sesióm.

**Tecnologias utilizadas**
- Node.js: Nos permite construir la API y manejar las peticiones HTTP.
- Express.js: Simplifica la creación de rutas.
- PostgreSQL: Sistema de base de datos.
- bcrypt: Para encriptar contraseñas
- jsonwebtoken: Para validar los tokens
- cookie-parser: Permite leer y manejar cookies HTTP-only.
- dayjs: Formateo de fechas.
- dotenv: Manejo de variables de entorno.

**Estructura**
CarpetaProyecto/
  controllers/
     UserController.js
     MensajeController.js
     SeguidorController.js
  database/
     db.js
  route/
    user.js
    mensaje.js
    seguidor.js
 .env # Variables de entorno
 index.js # Punto de entrada de la aplicación
 package.json

**Base de datos**
    CREATE TABLE usuarios (
     id SERIAL PRIMARY KEY,
     correo VARCHAR(100) UNIQUE NOT NULL,
     contrasena VARCHAR(255) NOT NULL,
     nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE mensajes (
     id SERIAL PRIMARY KEY,
     usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
     contenido TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE seguidores (
     id SERIAL PRIMARY KEY,
     seguidor_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
     seguido_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
     created_at TIMESTAMP DEFAULT NOW()
    );

**Endpoint**
Si te gustaria ver como funciona entra al archivo AQUI.yaml y veras como utilizar cada uno de los metodos.

