# Aplicación de administración de tareas pendientes

## Descripción del proyecto

Este proyecto proporciona una API RESTful para administrar tareas pendientes utilizando Node.js, Express, MongoDB y Docker. La API permite a los usuarios realizar operaciones CRUD en elementos pendientes e incluye opciones de filtrado avanzadas para mostrar elementos según su estado de finalización, ID o título. El proyecto está en contenedores utilizando Docker para facilitar el despliegue y su desarrollo (scaling).

## Features

- **Create**: Añade nuevas tareas.
- **Read**: Obtener elementos existentes, con filtrado opcional usando query.
- **Update**: Modificar detalles de tareas pendientes existentes(título o estado).
- **Delete**: Eliminar items.
- **Filter**: Ver tareas que están basadas ya sea en ID, título o estado.

## Tech Stack

- **Node.js** y **Express**: Para construir el backend.
- **MongoDB**: Como base de datos
- **Docker** y **Docker Compose**: Para contenerización y fácil despliegue.

## Primero pasos

### Prerrequisitos

- Docker
- Docker Compose
- Node.js

### Instalación

1. **Clonar el repositorio:**

El siguiente comando clonara el repositorio.

```Github CLI
gh repo clone Jachacon12/proyectos-inesdi
```

2. **Usar version correcta de Node.js:**

Este paso es para asegurarse que la version de Node es la correcta, basandose en el archivo [​.nvmrc](https://github.com/Jachacon12/proyectos-inesdi/blob/933b62bc3817a613829b0ab8fd0efe917051df2c/.nvmrc)

```bash
nvm use
```

3. **Instalar paquetes necesarios:**

   Este paso es para asegurarse que todos los paquetes necesarios esten correctamente instalados localmente

```bash
yarn install
```

O

```bash
yarn
```

4. **Construir y ejecutar los contenedores Docker**

Este paso construirá las imágenes y contenedores necesarios.
Ya que los servicios de MongoDB han sido previamente definidos en el Docker compose, la base de datos comenzará automáticamente con el contenedor.

Un comando ha sido asignado para generar datos mockup ([seeder](https://github.com/Jachacon12/proyectos-inesdi/blob/d4898a74d1c060d498d2da768e1a2242c825cc51/src/scripts/seedDB.js)) para que la base de datos no esté vacía.

```bash
yarn build
```

o directamente

```bash
docker-compose up --build
```

## Usage

Una vez que la aplicación esté siendo ejecutada, usted puede interactuar con la API a través de los siguientes endpoints:

| REQUEST | QUERY                    | BODY                                                  | DESCRIPTION                                                                                                                                                           |
| ------- | ------------------------ | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST    | `/todos`                 | `{ "title": "Preparar la cena", "completed": false }` | Añade una nueva tarea.                                                                                                                                                |
| GET     | `/todos?query`           |                                                       | Obtener elementos existentes, con filtrado opcional usando query                                                                                                      |
| GET     | `/todos:id`              |                                                       | Obtener elemento basado en su ID.                                                                                                                                     |
| PATCH   | `/todos:id`              | `{ "title": "Updated Title", "completed": true }`     | Modificar detalles de tarea basándose en su ID.                                                                                                                       |
| PATCH   | `/todos?completed=false` | `{ "completed": true }`                               | Modificar detalles de tareas existentes basándose en condiciones definidas en el query.                                                                               |
| DELETE  | `/todos:id`              |                                                       | Eliminar tarea basado en su ID.                                                                                                                                       |
| DELETE  | `/todos?completed=true`  |                                                       | Eliminar tareas existentes basándose en condiciones definidas en el query.                                                                                            |
| PUT     | `/todos:id`              | `{ "title": "Updated Title", "completed": true }`     | Modificar o crear tarea basándose en su id. En nuestro modelo el título es un campo obligatorio, por lo tanto tenemos que agregarlo al body cuando queramos usar PUT. |

> En nuestro modelo el título es un campo obligatorio, por lo tanto tenemos que agregarlo al body cuando queramos usar PUT.

## Ejemplos

### POST

- Agregar un elemento:

```bash
curl -X POST http://localhost:3000/todos \
 	-H "Content-Type: application/json" \
 	-d '{"title": "Limpiar escritorio", "completed": false}'
```

- Agregar múltiples elementos:

```bash
curl -X POST http://localhost:3000/todos \
 	-H "Content-Type: application/json" \
 	-d '[{"title": "Limpiar el carro", "completed": false},{"title": "Leer teoría", "completed": false}]'
```

### GET

- Obtener elementos existentes:

```bash
curl "http://localhost:3000/todos"
```

- Obtener elementos que cumplan cierta condición utilizando query:

```bash
curl "http://localhost:3000/todos?completed=true"

curl "http://localhost:3000/todos?completed=false"
```

- Obtener elemento basado en su ID:
  > **Nota:** el ID debe ser uno válido según la sintaxis previamente definida en el [esquema](https://github.com/Jachacon12/proyectos-inesdi/blob/d4898a74d1c060d498d2da768e1a2242c825cc51/src/models/todo.js). (ejemplo de ID valido: 663f717de12de232d32614d1)

```bash
curl "http://localhost:3000/todos/myId"
```

### PATCH

- Modificar elemento basándose en su ID:

```bash
curl -X PATCH http://localhost:3000/todos/663f6e78e12de232d32614c1 \
 	-H "Content-Type: application/json" \
 	-d '{"title": "Limpiar el garage", "completed": true}'
```

- Modificar elementos usando condiciones en el query:
  Este ejemplo filtra todos los elementos que tengan status _completed = false_, y los actualizará utilizando el body JSON, en este caso será _completed = true_

```bash
curl -X PATCH "http://localhost:3000/todos?completed=false" \
 	-H "Content-Type: application/json" \
 	-d '{"completed": true}'
```

### DELETE

- Eliminar elementos que cumplan cierta condición utilizando query:

```bash
curl -X DELETE "http://localhost:3000/todos?completed=true"
```

- Eliminar elemento basándose en su ID:
  > **Nota:** el ID debe ser uno válido según la sintaxis previamente definida en el [esquema](https://github.com/Jachacon12/proyectos-inesdi/blob/d4898a74d1c060d498d2da768e1a2242c825cc51/src/models/todo.js). (ejemplo de ID valido: 663f717de12de232d32614d1)

```bash
curl -X DELETE "http://localhost:3000/todos/myId"
```

### PUT

- Modificar o crear elemento basándose en su ID:
  > **Nota:** El ID debe ser válido y el body JSON debe incluir un título (title).

```bash
curl -X PUT -H "Content-Type: application/json" -d '{"title": "Mi nuevo título de tarea", "completed": false}' http://localhost:3000/todos/663f7231e02de232d32614d3
```

## Mejoras a futuro

- **Advanced Querying:** Ampliar las capacidades de filtrado para admitir queries más complejas.

- **Frontend Integration:** Desarrollar una aplicación front-end para consumir la API.

- **CI/CD Pipeline:** Configurar un pipeline de integración e implementación continua para agilizar el desarrollo y la implementación.
