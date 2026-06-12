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

## Detener aplicaciones

Presiona `Ctrl+C` en la terminal donde corriste el script.
El script intenta detener ambos procesos automaticamente.

## Usuario de prueba

Las credenciales para el usuario de prueba:
Email: "seller@example.com"
Password: "password123"

## Video recorrido
Ver el video [aquí](https://www.loom.com/share/2caf9e03114f455cbc4c135c09bb7198)