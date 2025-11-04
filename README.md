🛍️ Sharumi — E-commerce Full Stack

Sharumi es un proyecto de e-commerce desarrollado como parte de mi proceso de aprendizaje en desarrollo web full stack.
Combina un backend en Node.js + Express + Sequelize (MySQL) y un frontend en React para ofrecer una experiencia completa de gestión de productos, categorías, usuarios y mensajes, tanto desde la vista pública como desde una zona administrativa.
El objetivo fue construir un entorno funcional y escalable, aplicando buenas prácticas en arquitectura, control de datos y comunicación entre capas.


⚙️ Instalación y Ejecución

🔸 Requisitos previos

Node.js (v18 o superior)
MySQL instalado y corriendo

Git

🔹 Clonar el repositorio
git clone https://github.com/andreclopez/ProyectoSharumi
cd sharumi

🔹 Instalar dependencias
Backend
cd backend
npm install

Frontend
cd ../frontend
npm install

🔹 Configurar base de datos
Crear una base de datos MySQL llamada sharumi_db y configurar el archivo .env en /backend con tus credenciales:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=sharumi_db
PORT=3001

🔹 Ejecutar el proyecto
En dos terminales separadas:

Backend: 
cd backend
npm run dev


Frontend:
cd frontend
npm start

La aplicación estará disponible en http://localhost:3000


⚙️🔧 Tecnologías utilizadas

🔄 Backend

Node.js

Express.js

Sequelize ORM

MySQL

Dotenv

Nodemon

Helmet

🔄 Frontend

React.js

Material UI

Axios

React Router DOM

Context API


🔗 Endpoints principales

Productos

GET /productos → Listado de productos

GET /productos/:id → Detalle de producto

POST /productos → Crear producto

PUT /productos/:id → Editar producto

DELETE /productos/:id → Eliminar producto (soft o hard)

Categorías

GET /categorias → Listado de categorías

GET /categorias/:id → Detalle de categoría

POST /categorias → Crear categoría

PUT /categorias/:id → Editar categoría

DELETE /categorias/:id → Eliminar categoría

Usuarios

GET /usuarios → Listado de usuarios

POST /usuarios → Crear usuario

PUT /usuarios/:id → Editar usuario

DELETE /usuarios/:id → Eliminar usuario

Mensajes

GET /mensajes → Ver mensajes

POST /mensajes → Enviar mensaje


✳️ Pruebas funcionales realizadas

Módulos cubiertos

Usuarios, Productos, Categorías

Crear / Editar / Borrar funcionando correctamente.

Listado visible con navegación por páginas (desde el dashboard y desde cada página admin).

Soft delete y Hard delete

Usuarios y Productos cuentan con ambas opciones:

Soft delete → Inactiva el registro.

Hard delete → Elimina definitivamente el registro.

Paginación (backend y frontend)

Incorporada con parámetros page y limit.

Formato de respuesta incluye data y pagination.


📝 Changelog (última versión)

✨ Zona de administración creada con dashboard y secciones de Usuarios, Productos y Categorías.

➕ CRUD completo en cada sección (crear, editar, borrar).

🔄 Paginación implementada en backend (page, limit) y conectada en frontend (Usuarios y Categorías).

🗑️ Soft delete y Hard delete en Usuarios y Productos.

⚡ Mejora UX: al crear un producto se actualiza la tabla sin recargar la página.

🐛 Correcciones menores en controladores y servicios para mantener consistencia en formato de respuesta { success, message, data, pagination }.


💭 Reflexión final

Sharumi me permitió aplicar de forma integrada los conocimientos adquiridos sobre desarrollo full stack.
Aprendí a diseñar bases de datos relacionales, a estructurar controladores y rutas de manera coherente, y a comunicar frontend y backend con claridad.
También me ayudó a fortalecer la lógica de negocio, mejorar la usabilidad, y ganar confianza en la integración completa de una aplicación real.


