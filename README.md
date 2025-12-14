# Proyecto2DW
Segundo proyecto para la materia Introducción al Desarrollo Web

## Autores

Abraham Martínez Cerón  
Giuseppe Valencia Carrillo  
Xóchitl Axalli López Chavarría  
Diego Martinez Tinoco  

## Backend

```
PROYECTO2DW/
├── Backend/
│   ├── create_tables.sql   # Query para instanciar las BD en PostgreSQL 
│   ├── crud.py             # Contiene las operaciones de la API
│   ├── main.py             # Orquestador de la API
│   ├── utilsdb.py          # Archivo para comunicarse con la BD
```

### Create_tables.sql

Contiene las querys para las tablas de las Bases de Datos para PostgreSQL, tabla usuarios para poder identificar quiénes realizan las publicaciones; tabla de imágenes, para almacenar la URL y el título de la imagen publicada; y la tabla posts para las publicaciones de los usuarios

### crud.py

Contiene los métodos para inicializar o cerrar la conexión con la base de datos. Además, las operaciones para consultar, crear, actualizar y eliminar publicaciones. Se pueden obtener todas las publicaciones o una con un ID.

### main.py

Se encarga de orquestar toda la lógica del negocio.
- Obtiene el token de Spotify: si ha expirado el que se tenía, entonces solicita otro para el bearer. 
- Obtiene los nuevos lanzamientos en Spotify con la API que está implementada en Spotify y el token previamente obtenido. Se simplifican los datos para el frontend [name, artists, release_date, total_tracks y url]
- Se crean BaseModel para poder interpretar mejor los objetos de Python y que van a interactuar con el frontend: Imagen, PostCreate, PostUpdate y el Post.
- Se inicializa la base de datos al prender y se cierra al apagar la aplicación
- Se obtiene el usuario, en caso de no estar autorizado, se lanza un error `HTTP=401`
- Operaciones CRUD
    - GET: Se obtienen todos los posts o por id, se lanza un error `HTTP=404` en caso de no existir con ese ID
    - POST: Se crea un nuevo post y regresa su ID
    - PATCH: Se obtiene el post que se quiere actualizar, si no existe, se lanza error `HTTP=404`. En caso de que el usuario no sea el autor, se lanza error `HTTP=403`. Se regresa un JSON con la respuesta `updated`
    - DELETE: Se obtiene el post que se quiere actualizar, si no existe, se lanza error `HTTP=404`. En caso de que el usuario no sea el autor, se lanza error `HTTP=403`. Se regresa un JSON Con la respuesta `deleted`
    - HEALTH: Para comprobar que la API esté funcionando bien al igual que la API de Spotify

### Archivo requeriments.txt

El archivo requirements.txt se generó a partir del siguiente comando
```bash
pip freeze > requirements.txt
```

Las dependencias principales son
- fastapi
- uvicorn
- pydantic
- dotenv
- asyncpg

### Levantar el backend

Para levantar el backend, primero es necesario crear un ambiente virtual (con cualquier nombre, en nuestro caso) "proyecto2" en la carpeta Backend, después lo activamos y levantamos el servidor

```bash
cd Backend
python -m venv proyecto2
source ./proyecto2/bin/activate
fastapi dev main.py
```

### Enlace al health endpoint de la API

[health](http://127.0.0.1:8000/health)

Permite verificar que todo esté bien, esperamos una respuesta como la siguiente:
```JSON
{
  "status": "ok",
  "spotify": "ok"
}
```

### Pruebas rápidas
Puedes probar los endpoints fácilmente desde Swagger UI: [docs](http://127.0.0.1:8000/docs)

O desde la terminal con
```bash
curl http://127.0.0.1:8000/health
```
## Frontend

El frontend del proyecto está desarrollado en **React** y se encarga de mostrar el feed tipo Facebook, así como de permitir al usuario crear, actualizar y eliminar publicaciones consumiendo los endpoints del backend.

PROYECTO2DW/
├── Frontend/
│ ├── index.html
│ ├── package.json
│ ├── vite.config.js
│ ├── src/
│ │ ├── main.jsx
│ │ ├── App.jsx
│ │ ├── components/ # Componentes reutilizables del sitio (si aplica)
│ │ ├── pages/ # Vistas o secciones principales (si aplica)
│ │ ├── services/ # Lógica para llamadas al backend (fetch/axios) (si aplica)
│ │ └── assets/


### Tecnologías usadas

El frontend está construido con:
- React
- Vite
- Bootstrap

### Levantar el frontend

Se instala dependencias y después levanta el servidor de desarrollo:

```bash
cd Frontend
npm install
npm run dev
```
### Componentes

- Se muestran publicaciones con texto e imagen.
- Formulario para crear publicaciones.
- Actualizar y eliminar publicaciones (el backend valida autorización del usuario).
- Cuenta con modo claro/oscuro.

### Conexión con el backend

El frontend consume la API del backend para todas las operaciones de publicaciones (CRUD). Para que funcione correctamente:
- El backend debe estar corriendo.
- El frontend debe apuntar a esa URL base (ya sea mediante una constante en el código o mediante variables de entorno).

En caso de que el backend esté en otro puerto o dominio, se debe actualizar la URL base usada por el frontend.

#### Error de usuario
El backend valida que solo el autor de una publicación pueda actualizarla o eliminarla. Si el usuario no está autorizado:
- Se regresa `HTTP=401` si no se envía usuario.
- Se regresa `HTTP=403` si el usuario no es el autor del post.

