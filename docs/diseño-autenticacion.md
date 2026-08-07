# Diseño de Autenticación y Autorización

## 1. Modelo elegido: JWT

Se elige **JWT (JSON Web Token)** sobre sesión con cookie.

**Justificación:** el frontend (React + Vite) consume la API como cliente separado del
backend (Node/Express), sin servidor de vistas compartido. Un modelo de sesión con cookie
requeriría manejo de CORS con credenciales y estado compartido en el servidor, mientras que
JWT permite autenticación *stateless*, coherente con la arquitectura desacoplada
backend/frontend ya definida en el proyecto.

## 2. Hashing de contraseñas

- **Librería:** `bcryptjs`
- **Cost factor:** `SALT_ROUNDS = 10` (estándar recomendado, balance seguridad/rendimiento)

### Flujo de registro

1. El cliente envía `email` + `password` en texto plano por HTTPS a `POST /api/auth/register`
2. El backend valida que el correo no esté registrado
3. El backend genera el hash: `bcrypt.hash(password, SALT_ROUNDS)`
4. Se guarda en la tabla `usuarios`: `email`, `password` (el HASH), `rol`, `nombre`, etc.
5. **Nunca se guarda ni se devuelve la contraseña en texto plano** — ni en la base de datos,
   ni en logs, ni en las respuestas de la API (`getProfile` selecciona columnas explícitas
   sin `password`)

Ver implementación en `backend/controllers/authController.cjs`.

## 3. Roles y tabla de permisos

### Roles del sistema

- `admin`
- `profesor`
- `estudiante`
- `padre`

### Tabla de endpoints protegidos

| Endpoint | Middleware | Rol(es) permitido(s) |
|---|---|---|
| `POST /api/auth/login` | ninguno | público |
| `POST /api/auth/register` | ninguno | público |
| `GET /api/auth/profile` | `authMiddleware` | cualquier autenticado |
| `PUT /api/auth/profile` | `authMiddleware` | cualquier autenticado |
| `GET /api/estudiantes` | `authMiddleware` + `profesorOnly` | `profesor`, `admin` |
| `GET /api/estudiantes/:id` | `authMiddleware` + `ownerOrStaff` | dueño del recurso, `profesor`, `admin` |
| `POST /api/estudiantes` | `authMiddleware` + `adminOnly` | `admin` |
| `PUT /api/estudiantes/:id` | `authMiddleware` + `adminOnly` | `admin` |
| `DELETE /api/estudiantes/:id` | `authMiddleware` + `adminOnly` | `admin` |
| `GET /api/profesores` | `authMiddleware` + `adminOnly` | `admin` |
| `POST /api/profesores` | `authMiddleware` + `adminOnly` | `admin` |
| `PUT /api/profesores/:id` | `authMiddleware` + `adminOnly` | `admin` |
| `DELETE /api/profesores/:id` | `authMiddleware` + `adminOnly` | `admin` |
| `GET /api/pagos` | `authMiddleware` + `adminOnly` | `admin` |
| `POST /api/pagos` | `authMiddleware` + `adminOnly` | `admin` |
| `PUT /api/pagos/:id` | `authMiddleware` + `adminOnly` | `admin` |
| `DELETE /api/pagos/:id` | `authMiddleware` + `adminOnly` | `admin` |
| `GET /api/asistencias` | `authMiddleware` | cualquier autenticado |
| `POST /api/asistencias` | `authMiddleware` + `profesorOnly` | `profesor`, `admin` |
| `PUT /api/asistencias/:id` | `authMiddleware` + `profesorOnly` | `profesor`, `admin` |
| `DELETE /api/asistencias/:id` | `authMiddleware` + `profesorOnly` | `profesor`, `admin` |
| `GET /api/notas` | `authMiddleware` | cualquier autenticado |
| `POST /api/notas` | `authMiddleware` + `profesorOnly` | `profesor`, `admin` |
| `PUT /api/notas/:id` | `authMiddleware` + `profesorOnly` | `profesor`, `admin` |
| `DELETE /api/notas/:id` | `authMiddleware` + `profesorOnly` | `profesor`, `admin` |

### Middleware `ownerOrStaff`

Permite acceso si el usuario es `admin`/`profesor`, o si el `estudiante_id` del recurso
solicitado corresponde al usuario autenticado (comparando `usuario_id` en la tabla
`estudiantes` contra el `id` del token JWT). Requiere la columna `usuario_id` en
`estudiantes` (migración `add_usuario_id_to_estudiantes`).

Implementado en `backend/middleware/auth.cjs`.

### Mejora pendiente (próximo sprint)

Los endpoints de `notas`, `asistencias` y `pagos` actualmente no exponen una ruta
`/estudiante/:estudianteId`, por lo que un `estudiante` o `padre` no puede aún consultar
solo sus propios registros en esos recursos — requiere agregar esa ruta y aplicar
`ownerOrStaff`. El caso del rol `padre` (ver información del hijo, no la propia) también
queda pendiente de diseño de relación en base de datos.

## 4. Manejo de errores

- **401 (no autenticado):** token ausente o inválido — devuelto por `authMiddleware`
- **403 (autenticado sin permiso):** rol o dueño del recurso no coincide — devuelto por
  `adminOnly`, `profesorOnly`, `ownerOrStaff`
- **Credenciales inválidas:** el mismo mensaje genérico (`'Credenciales incorrectas'`) y el
  mismo código (401) se devuelven sin importar si falló el email o la contraseña — evita
  filtrar si un correo existe en el sistema

## 5. Verificación funcional pendiente

- [ ] Levantar `docker compose up db`
- [ ] Correr `npx knex migrate:latest` (incluye `add_usuario_id_to_estudiantes`)
- [ ] Probar con Postman/Insomnia: login como `estudiante`, verificar 200 en su propio
      `GET /api/estudiantes/:id` y 403 en el de otro estudiante
- [ ] Probar `GET /api/estudiantes` como `estudiante` → debe responder 403