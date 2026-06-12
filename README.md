# KS2

Proyecto fullstack con:
- Backend: Node.js + Express + Sequelize + PostgreSQL
- Frontend: React + Vite

## Requisitos del sistema

Se probo con el siguiente entorno:
- Ubuntu (o distribucion Linux similar)
- PostgreSQL 18.3
- Node.js v24.14.1
- npm (incluido con Node.js)

## Estructura del proyecto

- `ks2-backend/`: API, migraciones, seeders y scripts de base de datos.
- `ks2-frontend/`: aplicacion React.
- `start-ks2.sh`: script de arranque completo (instalacion + DB + backend + frontend).

## Configuracion de entorno

Debes crear el archivo `.env` dentro de `ks2-backend/`:

Ruta esperada:
- `ks2-backend/.env`

Contenido de ejemplo (copiado del entorno actual):

```env
DB_PORT=5432
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=real_state_management
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=2zOOTZJBFJUX6dbdRetnK51sRkLWqpB86BsypoGnL4I
JWT_EXPIRES_IN=7d
```

## Uso rapido (script unico)

Desde la raiz del proyecto (`ks2/`):

1. Dar permisos de ejecucion al script (solo una vez):

```bash
chmod +x start-ks2.sh
```

2. Ejecutar el script:

```bash
./start-ks2.sh
```

El script realiza automaticamente:
1. Instalacion de dependencias en backend y frontend (`npm install`).
2. Creacion/validacion de la base de datos (`npm run db:ensure`).
3. Ejecucion de migraciones (`npm run migrate`).
4. Limpieza y carga de datos semilla (`npm run seed:undo` y `npm run seed`).
5. Inicio del backend y frontend.

## URLs locales

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

## Ejecucion con Docker (recomendado para cualquier sistema)

Se incluye una solucion completa con contenedores para:
- PostgreSQL 18.3
- Backend (Node.js + Express)
- Frontend (Vite build servido por Nginx)

### Archivos Docker agregados

- `docker-compose.yml`
- `ks2-backend/Dockerfile`
- `ks2-backend/scripts/docker-entrypoint.sh`
- `ks2-backend/.dockerignore`
- `ks2-frontend/Dockerfile`
- `ks2-frontend/nginx.conf`
- `ks2-frontend/.dockerignore`

### Levantar todo el stack

Desde la raiz del proyecto (`ks2/`):

```bash
docker compose up --build
```

Si vienes de una version anterior de Compose/imagen y falla el arranque de `db`, limpia volumenes y vuelve a levantar:

```bash
docker-compose down -v --remove-orphans
docker-compose up --build
```

Este comando realiza automaticamente:
1. Construccion de imagenes de frontend y backend.
2. Inicio de PostgreSQL.
3. En backend: `db:ensure`, `migrate`, `seed:undo`, `seed` y luego `start`.
4. Inicio de frontend en Nginx con proxy `/api` hacia el backend.

### URLs con Docker

- Frontend: `http://localhost:8080`
- Backend (health): `http://localhost:3000/health`
- API base: `http://localhost:3000/api/v1`

Nota: la base de datos de Docker no se expone al host por defecto para evitar conflictos con PostgreSQL local en `5432`.
Si necesitas acceso desde tu host, agrega temporalmente este bloque al servicio `db` en `docker-compose.yml`:

```yaml
ports:
	- "5433:5432"
```

### Detener contenedores

```bash
docker compose down
```

Si tambien quieres eliminar volumenes (base de datos):

```bash
docker compose down -v
```

### Variables de entorno en Docker

Para Docker Compose ya se incluyen valores por defecto en `docker-compose.yml`, por lo que no es obligatorio crear `.env` para la ejecucion en contenedores.
Si deseas personalizarlos, puedes editar las variables en el servicio `backend` dentro de `docker-compose.yml`.

## Detener aplicaciones

Presiona `Ctrl+C` en la terminal donde corriste el script.
El script intenta detener ambos procesos automaticamente.

## Usuario de prueba

Las credenciales para el usuario de prueba:
Email: "seller@example.com"
Password: "password123"

## Video recorrido
Ver el video [aquí](https://www.loom.com/share/2caf9e03114f455cbc4c135c09bb7198)