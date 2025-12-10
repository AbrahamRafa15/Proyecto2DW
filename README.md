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