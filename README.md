# Task Manager — Full Stack

Gestor de tareas **Kanban** full stack: **React + Vite + TypeScript** (frontend), **Node.js +
Express + TypeScript** (backend), **PostgreSQL** en Docker vía **Prisma**, y **autenticación JWT**
con contraseñas hasheadas con **bcrypt**. El proyecto está en `sesion7/task-manager-react/`.

- Tablero de 4 columnas (Ideas · Por hacer · En progreso · Hecho) con arrastrar y soltar.
- CRUD completo de tareas persistido en PostgreSQL.
- Login que protege el acceso; las rutas de tareas exigen un token válido.

> Las carpetas `sesion2`–`sesion6` son ejercicios previos del curso.

---

## Setup — levantar el proyecto desde cero

**Requisitos:** Node.js 24+, Docker Desktop **instalado y corriendo**, git.

### 1) Backend (terminal 1)

```bash
cd sesion7/task-manager-react/backend

cp .env.example .env          # crea el .env (no viene en el clone); edita JWT_SECRET si quieres
docker compose up -d          # PostgreSQL (la 1ª vez descarga la imagen postgres:18)
npm install
npx prisma migrate deploy     # crea las tablas Task y User
npx prisma generate           # genera el Prisma Client
npm run seed                  # usuario de demo + tareas de ejemplo
npm run dev                   # → http://localhost:3000
```

### 2) Frontend (terminal 2)

```bash
cd sesion7/task-manager-react
npm install
npm run dev                   # → http://localhost:5173
```

Abre **http://localhost:5173** e inicia sesión con **`admin@test.com`** / **`123456`**.

---

## Puertos

| Puerto | Servicio |
|--------|----------|
| 3000 | Backend (Express) |
| 5173 | Frontend (Vite) |
| 5432 | PostgreSQL (Docker) |
| 5555 | Prisma Studio (`npx prisma studio`, opcional) |

## Si algo falla

- **`Falta JWT_SECRET en el .env`** → no creaste el `.env` (`cp .env.example .env`).
- **`Can't reach database server`** → falta `docker compose up -d` o Docker no está corriendo.
- **Login siempre 401** → falta `npm run seed` (no hay usuarios en la base).
- **El frontend no carga tareas** → el backend no está corriendo en el puerto 3000.
