# Gestión de Biblioteca — Frontend

Aplicación web para administrar usuarios, libros, ejemplares físicos y préstamos de una biblioteca.

## Funcionalidades

- CRUD de usuarios con validación de correo duplicado y fecha de nacimiento.
- CRUD de libros con creación automática de ejemplares físicos.
- Consulta de ejemplares disponibles por ISBN.
- Registro y devolución de préstamos.
- Filtros de préstamos por usuario y por libro, combinables.
- Estados de préstamo: Programado, Activo, Vencido y Devuelto.
- Mensajes de error en español.
- Interfaz responsive tipo panel administrativo con sidebar lateral.

## Tecnologías

- React
- TypeScript
- Vite
- React Router
- Axios
- CSS
- Docker
- Nginx

## Requisitos previos

**Con Docker:**

- Docker Desktop o Docker Engine.
- Docker Compose.

**Para desarrollo local:**

- Node.js 24 o compatible.
- npm.
- Backend ejecutándose en `http://localhost:8080`.

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `VITE_API_BASE_URL` | URL base de la API | `http://localhost:8080/api/v1` |
| `FRONTEND_PORT` | Puerto publicado del Frontend | `3000` |

- `.env` no se versiona.
- `.env.example` contiene el ejemplo de configuración.
- El Frontend no maneja secretos ni credenciales.
- `VITE_API_BASE_URL` se aplica durante el proceso de compilación de Vite.

## Ejecución con Docker

```bash
git clone https://github.com/JhonBobadilla/library-management-web.git
cd library-management-web
docker compose up -d --build
docker compose ps
```

La aplicación queda disponible en `http://localhost:3000`.

### Detener el contenedor

```bash
docker compose down
```

## Ejecución local

```bash
npm ci
npm run dev
```

## Rutas disponibles

| Ruta | Módulo |
|------|--------|
| `/users` | Usuarios |
| `/books` | Libros |
| `/loans` | Préstamos |

## Relación con el Backend

El Frontend consume el Backend a través de `VITE_API_BASE_URL`. La instancia central de Axios se encuentra en `src/config/api.ts` y usa un único valor de respaldo. No se repite la URL en componentes ni servicios.

El Backend se ejecuta por separado:

- Repositorio del Backend: https://github.com/JhonBobadilla/library-management-api
- API por defecto: http://localhost:8080/api/v1
- Healthcheck: http://localhost:8080/actuator/health

## Estructura principal

```
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── .dockerignore
├── src/
│   ├── components/
│   │   ├── books/
│   │   ├── layout/
│   │   ├── loans/
│   │   └── users/
│   ├── config/
│   ├── pages/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
```

## Verificación

```bash
npm run build
npm run lint
```

## Consideraciones importantes

- Nginx permite recargar directamente `/users`, `/books` y `/loans` sin producir 404.
- El Backend debe permitir solicitudes desde el origen del Frontend.
- La aplicación consume datos reales del Backend; no utiliza datos simulados.
- Un usuario con préstamos registrados no puede eliminarse.
- Un libro con préstamos registrados no puede eliminarse.
- Un usuario solo puede tener un préstamo abierto.
- Al cambiar `VITE_API_BASE_URL` en Docker se debe reconstruir la imagen con `docker compose build`.
- El archivo `.env.example` es la única plantilla de variables; no se incluyen archivos `.env` reales en el repositorio.
- El Frontend no incluye autenticación ni control de roles.
