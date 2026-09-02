# Casos de Uso y Módulos — Escuela Deportiva IERD Duitama

## 1. Casos de uso (documentación)

| ID | Caso de uso | Actor principal | Precondición | Flujo principal | Postcondición |
|---|---|---|---|---|---|
| CU-01 | Iniciar sesión | Todos | Tener cuenta en `usuarios` | Ingresa correo+contraseña → sistema prueba contraseña contra cada cuenta con ese correo → genera JWT | Sesión activa (token 7 días) |
| CU-02 | Registrar cuenta (padre+hijo) | Padre | No tener cuenta previa con ese correo+rol | Ingresa datos propios + datos del hijo → sistema crea usuario `padre` y usuario `estudiante` vinculados | 2 cuentas creadas, estudiante en grupo `Sin asignar` |
| CU-03 | Recuperar contraseña | Todos | Cuenta existente | Solicita reset → token generado (hash guardado, 1h) → confirma con token+nueva contraseña | Contraseña actualizada |
| CU-04 | Gestionar estudiantes (CRUD) | Admin, Profesor | Sesión con rol válido | Crear/editar estudiante; **eliminar solo Admin** | Roster actualizado |
| CU-05 | Gestionar profesores (CRUD) | Admin | Sesión admin | Crear/editar/eliminar profesor | Plantilla docente actualizada |
| CU-06 | Registrar asistencia | Profesor, Admin | Estudiante existe | Selecciona grupo+fecha → marca estado por estudiante → inserta | Asistencia guardada (única por estudiante/fecha) |
| CU-07 | Registrar notas de desempeño | Profesor, Admin | Estudiante existe | Ingresa técnica/táctica/actitud (1-5) → inserta | Nota guardada |
| CU-08 | Gestionar pagos | Admin | Estudiante existe | Registra concepto/monto/estado → consulta estado de cartera | Pago guardado/actualizado |
| CU-09 | Consultar mi información | Estudiante, Padre | Sesión activa, `ownerOrStaff` | Consulta su propio estudiante/asistencias/notas/pagos | Datos mostrados, sin acceso a terceros |
| CU-10 | Editar perfil propio | Todos | Sesión activa | Actualiza nombre, apodo, teléfono, foto, cumpleaños | Perfil actualizado |

---

## 2. Módulos del sistema

El aplicativo tiene **6 módulos**, uno por entidad de negocio (cada uno = 1 par routes/controller en el backend + 1 sección de UI):

| # | Módulo | Resuelve (RF) | Casos de uso |
|---|---|---|---|
| 1 | **Autenticación** (`auth`) | RF-001, RF-002, RF-003, RF-015 | CU-01, CU-02, CU-03, CU-10 |
| 2 | **Usuarios** (`usuarios`) | Soporte transversal (gestión de cuentas) | — |
| 3 | **Estudiantes** (`estudiantes`) | RF-004, RF-005, RF-006, RF-007 | CU-04, CU-09 |
| 4 | **Profesores** (`profesores`) | RF-008, RF-009 | CU-05 |
| 5 | **Asistencias** (`asistencias`) | RF-010, RF-011 | CU-06, CU-09 |
| 6 | **Notas** (`notas`) | RF-012 | CU-07, CU-09 |
| 7 | **Pagos** (`pagos`) | RF-013, RF-014 | CU-08, CU-09 |

*(7 módulos si se cuenta `usuarios` como módulo propio y no como parte de `auth`; 6 si se fusionan, porque comparten la tabla `usuarios`.)*

### Módulo más relevante: **Autenticación**

Es el más relevante porque **todos los demás módulos dependen de él**: ningún endpoint de estudiantes, asistencias, notas o pagos funciona sin el JWT que emite `auth`, y el rol que viene en ese JWT es lo que decide qué puede hacer cada módulo (`adminOnly`, `profesorOnly`, `ownerOrStaff`). Si `auth` falla, el sistema completo queda inaccesible — es el módulo con mayor "radio de impacto".

El segundo más relevante es **Estudiantes**, porque es el único al que **todos los demás módulos apuntan** (asistencias, notas y pagos existen solo en función de un `estudiante_id`).

---

## 3. Cómo se alimentan los módulos entre sí (lógica y arquitectura)

```
Cliente (React)
     ↓ fetch + Authorization: Bearer <token>
services/api.js  (capa única de acceso a la API)
     ↓
Express Router  →  middleware auth.cjs (valida JWT, agrega req.user)
     ↓
middleware de rol  →  adminOnly / profesorOnly / ownerOrStaff
     ↓
Controller  →  pool.query(SQL)  (mysql2, sin ORM ni capa de dominio)
     ↓
MySQL 8  →  restricciones (UNIQUE, FK, CHECK) aplican las reglas de negocio
```

**Flujo de dependencia entre módulos:**

1. **Auth** produce el JWT → **todos** los demás módulos lo consumen para saber quién eres y qué rol tienes.
2. **Estudiantes** es la entidad "padre" en la base de datos → **Asistencias**, **Notas** y **Pagos** dependen de que exista un `estudiante_id` válido (FK `ON DELETE CASCADE`).
3. **Usuarios** y **Estudiantes** se cruzan solo en el registro (CU-02): `auth.register` crea una fila en `usuarios` y otra en `estudiantes`, unidas por `estudiantes.usuario_id`.
4. No hay una capa de "servicios de dominio" intermedia: cada controlador llama SQL directo. La arquitectura es **CRUD en 3 capas** (frontend → API REST → BD), no DDD con agregados/repositorios — ya se dejó esa aclaración en `modelo-de-dominio.md`.

**Patrón arquitectónico general:** Cliente-Servidor de 3 capas, con autorización basada en roles (RBAC) resuelta en middleware, y reglas de integridad (unicidad, cascada, rango) resueltas en la base de datos en vez de en código de aplicación.

---

## 4. Ruta de conexión a la base de datos

Archivo: `backend/config/database.cjs`

```javascript
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'escuela_ierd',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
```

- Es un **pool de conexiones** (hasta 10 simultáneas), no una conexión única — así el backend soporta varias peticiones concurrentes sin abrir una conexión nueva por cada una.
- Los datos de conexión (`host`, `user`, `password`, `database`) vienen de variables de entorno (`.env`), nunca hardcodeados — cumple RNF-010.
- Cada `controller` importa este mismo `pool` (`require('../config/database.cjs')`) para ejecutar sus queries — es el único punto de entrada a MySQL en todo el backend.
- El esquema de esa base (`escuela_ierd`) se construye y versiona con **Knex** (`backend/knexfile.js` + `backend/migrations/`), no manualmente.
