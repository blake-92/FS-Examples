# Presentación final — Task Manager Full Stack

Guía de estudio y guión para la exposición de cierre del módulo (15 min, 2 integrantes).
Basada en `guias-pdf/Sesion7/4-Guia Presentacion Final.pdf` y en el proyecto real
(`ejercicios/sesion7/task-manager-react/`).

> 🎯 **Frase que deben poder decir al cerrar:** *"Nuestra app pasó de ser un Task Manager en React
> a una aplicación full stack conectada a PostgreSQL y protegida con autenticación JWT."*

---

## 0. Antes de presentar (preparación, 10 min antes de su turno)

- [ ] **Docker encendido** y la base levantada:
  `cd ejercicios/sesion7/task-manager-react/backend && docker compose up -d`
- [ ] **Datos listos** (3 usuarios de demo, cada uno con sus tareas): `npm run seed`
- [ ] **Backend corriendo**: `npm run dev` (dice `Server running on port 3000`).
- [ ] **Frontend corriendo** (otra terminal): `npm run dev` (`http://localhost:5173`).
- [ ] **Prisma Studio** abierto en otra pestaña: `npx prisma studio` (`http://localhost:5555`).
- [ ] **Postman** con 3 peticiones guardadas: `POST /login`, `GET /profile` (con y sin token).
- [ ] **VS Code** abierto en el proyecto, con `backend/src/index.ts` y `src/App.tsx` a mano.
- [ ] **Diapositivas** abiertas en pantalla completa.
- [ ] Sesión cerrada en el navegador (para mostrar la **pantalla de login** desde cero).

> ⚠️ Si algo falla en vivo: explica **qué debería pasar** y muestra la evidencia (capturas de esta
> guía). No pierdas tiempo depurando frente a la clase.

---

## 1. Guión minuto a minuto (15 min · reparto entre 2)

Reparte por capas: **[A]** = quien domina el frontend, **[B]** = quien domina el backend/BD.
(Ajusta los nombres a los tuyos.)

| Tiempo | Quién | Qué hace / dice |
|---|---|---|
| **0-2 min** · Intro | [A] | Portada: nombre del proyecto, integrantes, **objetivo** (gestor de tareas Kanban full stack) y **tecnologías** (React, Express, Prisma, PostgreSQL, JWT, bcrypt, Docker). |
| **2-5 min** · Arquitectura + CRUD | [B] | Diagrama: cómo viaja una petición React → Express → Prisma → PostgreSQL. Explicar el **CRUD** (las 4 operaciones sobre las tareas) y el carril de auth (login → bcrypt → JWT → ruta protegida). |
| **5-11 min** · Demo en vivo | [A] y [B] | La demostración (ver checklist §3). [A] maneja el navegador; [B] muestra Prisma Studio y Postman. |
| **11-13 min** · Autenticación | [B] | Explicar login con usuario real, **bcrypt** (hash de contraseñas), **JWT** (token) y **ruta protegida**, apoyándose en el código. |
| **13-15 min** · Conclusión | [A] | Aprendizajes, dificultades y mejoras futuras. Cerrar con la frase guía. |

> Los **dos** deben hablar y **ambos** deben poder responder preguntas básicas del código y del flujo.

---

## 2. Contenido de las diapositivas (1 sección = 1 slide)

**Slide 1 — Portada**
- Título: *Task Manager Full Stack*
- Integrantes: [Nombre 1] · [Nombre 2]
- Módulo / materia / fecha.

**Slide 2 — Objetivo del proyecto**
- Un gestor de tareas tipo **Kanban** (columnas Ideas · Por hacer · En progreso · Hecho).
- Empezó como app de React (datos en memoria) y evolucionó a **full stack**: los datos se guardan
  de verdad en una base de datos y el acceso está protegido con **login**.

**Slide 3 — Tecnologías**
- **Frontend:** React + Vite + TypeScript.
- **Backend:** Node.js + Express + TypeScript.
- **Base de datos:** PostgreSQL (en Docker).
- **ORM:** Prisma.
- **Autenticación:** JWT (tokens) + bcrypt (hash de contraseñas).

**Slide 4 — Arquitectura (diagrama)**
- El diagrama del flujo (ver `arquitectura.svg` / la imagen que generes).
- Frase: *"El navegador nunca habla con la base directamente; siempre pasa por el backend."*

**Slide 5 — Prisma + PostgreSQL**
- PostgreSQL guarda **tareas** y **usuarios** en tablas.
- Prisma es el **traductor** entre TypeScript y SQL: `prisma.task.findMany()` → `SELECT * FROM "Task"`.
- Las tablas se crean con **migraciones** (`prisma migrate`).

**Slide 6 — CRUD: las 4 operaciones sobre las tareas**
- **CRUD** = Create, Read, Update, Delete: las 4 cosas que se pueden hacer con datos. Es **el
  corazón de la app** — todo el manejo de tareas son estas 4 operaciones sobre PostgreSQL.
- Cada acción de la app es un método HTTP que Express recibe y Prisma ejecuta:

  | | Operación | HTTP | Prisma | En la app |
  |---|---|---|---|---|
  | **C** | Crear | `POST /tasks` | `prisma.task.create()` | Agregar con el botón **+** |
  | **R** | Leer | `GET /tasks` | `prisma.task.findMany()` | Cargar el tablero al abrir |
  | **U** | Actualizar | `PUT /tasks/:id` | `prisma.task.update()` | Editar el texto o **mover** de columna |
  | **D** | Eliminar | `DELETE /tasks/:id` | `prisma.task.delete()` | Borrar con la papelera |
- Todas estas rutas están **protegidas** con el token (`requireAuth`) y son **por usuario**: cada
  quien solo ve y toca **sus propias** tareas (filtradas por el email del token; tocar una ajena → 404).

**Slide 7 — Autenticación: login, bcrypt, JWT y ruta protegida**
- **Login:** el usuario manda email + contraseña.
- **bcrypt:** la contraseña se guarda **hasheada** (`$2b$10$...`), nunca en texto plano; el login
  compara con `bcrypt.compare`.
- **JWT:** si las credenciales son correctas, el backend firma un **token** (caduca en 1h).
- **Ruta protegida:** las rutas de tareas exigen ese token (`Authorization: Bearer ...`); sin él → 401.

**Slide 8 — Capturas del proyecto**
- Pantalla de **login**, el **Kanban** con tareas, **Prisma Studio** mostrando las tablas `Task` y
  `User` (con la contraseña hasheada), y una respuesta de **Postman** con el token.

**Slide 9 — Conclusión**
- **Aprendizajes:** cómo se conecta un frontend con un backend y una base de datos; qué es un ORM;
  cómo funciona la autenticación con tokens.
- **Dificultades:** (personalízalo) p. ej. configurar Docker/Postgres, entender async/await, CORS,
  o el manejo del token en el frontend.
- **Mejoras futuras:** registro desde el frontend, refresh tokens, marcar "completada" como acción propia.

---

## 3. Checklist de la demo en vivo (orden exacto)

1. **VS Code:** mostrar la estructura de carpetas (`src/` del frontend, `backend/src/index.ts`,
   `backend/prisma/schema.prisma`). *"Aquí está el frontend, aquí el backend, aquí el modelo de datos."*
2. **Backend corriendo** (`npm run dev`) → señalar `Server running on port 3000`.
3. **Frontend corriendo** (`npm run dev`) → abrir `http://localhost:5173`.
4. **Pantalla de login** → iniciar sesión con `admin@test.com` / `123456`.
5. **(Read)** Las tareas aparecen → *"Estas tareas vienen de PostgreSQL, no del navegador."*
6. **(Create)** Agregar una tarea desde el input.
7. **(Update)** Editar una tarea y **mover otra** de columna (arrastrar y soltar).
8. **(Delete)** Eliminar una tarea con la papelera → *"Acabo de hacer las 4 operaciones del CRUD."*
9. **Recargar la página** → los cambios siguen ahí → *"Todo se guardó en la base de datos."*
10. **(Tareas por usuario)** Cerrar sesión y entrar como **`ana@test.com`** / `123456` → aparecen
    **otras** tareas (las de ana), no las de admin → *"Cada usuario ve solo las suyas."*
11. **Prisma Studio** (o `psql`) → abrir la tabla **Task** y mostrar que refleja lo que hiciste (y la
    columna `userId`, que indica el **dueño** de cada tarea).
12. **Postman → `POST /login`** → mostrar que el backend devuelve un **token**.
13. **Postman → `GET /profile` con `Authorization: Bearer <token>`** → responde los datos
    protegidos.
14. **`GET /profile` (o `/tasks`) sin token** → responde **401** → *"Sin token, no hay acceso."*
15. **(bcrypt)** En Prisma Studio, tabla **User** → mostrar que `password` es un **hash `$2b$10$...`**,
    no `123456`.

---

## 4. Talking points técnicos (qué decir de cada pieza)

| Tema | Qué decir (1-2 frases) |
|---|---|
| **Frontend (React)** | Muestra la interfaz y hace peticiones al backend con `fetch`. Guarda el token y lo manda en cada petición. |
| **Backend (Express)** | Recibe las peticiones HTTP y responde con JSON. Define las rutas (`/login`, `/tasks`, `/profile`). |
| **CRUD** | Las 4 operaciones sobre las tareas: Crear (`POST`), Leer (`GET`), Actualizar (`PUT`), Eliminar (`DELETE`). Cada una es una llamada de Prisma. Es el corazón de la app. |
| **Prisma** | ORM: conecta el backend con PostgreSQL. Escribimos TypeScript y él genera el SQL. |
| **PostgreSQL** | La base de datos real. Guarda las tareas y los usuarios en tablas, en disco. |
| **bcrypt** | Protege las contraseñas: guarda un **hash** irreversible, no la contraseña. Compara con `bcrypt.compare`. |
| **JWT** | Genera un **token** firmado al iniciar sesión, que prueba que el usuario ya se autenticó. Caduca en 1h. |
| **Ruta protegida** | Un middleware (`requireAuth`) revisa el token **antes** de dejar entrar a las rutas de tareas. |
| **Tareas por usuario** | Cada tarea tiene un **dueño** (`userId`). Las rutas filtran por el email del token, así cada quien ve solo las suyas; tocar una ajena → 404. |
| **Docker** | PostgreSQL corre en un contenedor: se levanta con un comando y no ensucia la máquina. |

---

## 5. Preguntas probables (y cómo responder)

- **¿Por qué el token caduca en 1 hora?** Seguridad: si te roban el token, deja de servir pronto.
  Para no re-loguear siempre, en producción se usan *refresh tokens*.
- **¿Por qué guardan la contraseña con bcrypt y no tal cual?** Para que, aunque alguien vea la base,
  no pueda leer las contraseñas. El hash es **irreversible**; ni nosotros sabemos la contraseña.
- **¿Se puede "desencriptar" el hash?** No. bcrypt no desencripta; en el login **re-calcula** el
  hash de lo que escribiste y lo compara (`bcrypt.compare`).
- **¿Qué pasa si cambian el `JWT_SECRET`?** Todos los tokens firmados con el secreto viejo dejan de
  ser válidos (la firma ya no cuadra) → todos tendrían que volver a iniciar sesión.
- **¿Qué es un ORM / por qué Prisma?** Un traductor entre el código y la base: escribimos
  `prisma.task.findMany()` en vez de SQL a mano, con autocompletado y tipos.
- **¿Dónde viven las tareas?** En la tabla `Task` de PostgreSQL. El array en memoria del inicio se
  perdía al reiniciar; la base no.
- **¿Por qué CORS?** El navegador bloquea que la página (`:5173`) llame a otro origen (`:3000`) a
  menos que el backend lo permita con CORS.
- **¿Qué pasa si mando una petición a `/tasks` sin token?** El middleware responde **401** y la
  petición nunca llega a la base.
- **¿Un usuario puede ver o editar las tareas de otro?** No. Cada consulta filtra por el dueño
  (el email del token). Si pides editar/borrar una tarea ajena por su `id`, la respuesta es **404**
  (para el servidor, "esa tarea tuya no existe"), y la tarea del otro queda intacta.

---

## 6. Frase de cierre

> *"En resumen: nuestra aplicación pasó de ser un Task Manager en React con datos en memoria a una
> aplicación **full stack** — React en el frontend, Express en el backend, Prisma y PostgreSQL para
> guardar los datos, y autenticación con JWT y bcrypt para protegerla. Gracias."*
