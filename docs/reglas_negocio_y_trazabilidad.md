# Reglas de Negocio, MVP y Trazabilidad — Escuela Deportiva IERD Duitama

> Este archivo cubre lo que exige la *Guía de análisis, desarrollo y sustentación* (SENA — J. Ropero) y que no estaba documentado: reglas de negocio, matriz de trazabilidad y preguntas de sustentación (secciones 9, 38, 43-44 de la guía).

## 1. Reglas de negocio (RN)

| ID | Regla | Dónde se aplica |
|---|---|---|
| RN-01 | Un estudiante no puede tener más de un registro de asistencia el mismo día. | `UNIQUE(estudiante_id, fecha)` en tabla `asistencias`. |
| RN-02 | Un correo puede tener varias cuentas, pero nunca dos del mismo rol. | `UNIQUE(email, rol)` en `usuarios` + validación en `register`. |
| RN-03 | Si el registrante es un padre, se crea automáticamente la cuenta de su hijo/a con el documento como contraseña. | `authController.register`. |
| RN-04 | Un estudiante nuevo vinculado por auto-registro queda en grupo `Sin asignar` hasta que el staff le asigne uno real. | `authController.register` + ENUM de `estudiantes.grupo`. |
| RN-05 | Solo `admin` puede eliminar estudiantes, profesores y pagos; `profesor` puede gestionar estudiantes, asistencia y notas, pero no eliminarlos ni gestionar pagos. | Middlewares `adminOnly` / `profesorOnly` en las rutas. |
| RN-06 | Un padre o estudiante solo puede ver el detalle de su propio registro, nunca el de otro. | Middleware `ownerOrStaff`. |
| RN-07 | Las calificaciones de técnica, táctica y actitud deben estar entre 1 y 5. | `CHECK` en tabla `notas`. |
| RN-08 | Un token de recuperación de contraseña es de un solo uso y expira 1 hora después de generarse. | `resetPassword` + columnas `reset_password_*`. |
| RN-09 | Nunca se revela si un fallo de login o de "olvidé mi contraseña" se debe a que el correo no existe o a que el dato es incorrecto. | Mensajes genéricos en `login` y `forgotPassword`. |

Estas reglas son las que se convirtieron en restricciones SQL (`UNIQUE`, `CHECK`, `FOREIGN KEY ... ON DELETE`) y en middlewares de backend — no en triggers, porque la complejidad de este proyecto no lo justificaba.

---

## 2. MVP y priorización

```
MVP Escuela IERD
Login (multi-rol)
 ↓
Registro padre-hijo
 ↓
CRUD estudiantes
 ↓
Registro de asistencia
 ↓
Registro de notas
 ↓
Registro de pagos
 ↓
Edición de perfil
```

**Fuera del MVP (backlog):** horarios, reportes exportables, dashboard de indicadores, noticias, torneos y sedes. Ver detalle en `requerimientos_funcionales_ierd.md`.

---

## 3. Matriz de trazabilidad

| Requisito | Historia | Regla de negocio | Backend | Frontend |
|---|---|---|---|---|
| RF-001 | HU-001 | RN-02, RN-09 | `POST /auth/login` | `pages/Login` |
| RF-002 | HU-002 | RN-02, RN-03, RN-04 | `POST /auth/register` | `pages/Login` |
| RF-003 | HU-003 | RN-08, RN-09 | `POST /auth/forgot-password`, `/reset-password` | `pages/Login` |
| RF-004 | HU-004 | RN-05 | `POST /estudiantes` | `pages/Admin`, `pages/Profesor` |
| RF-005 | HU-005 | RN-06 | `GET /estudiantes`, `GET /estudiantes/:id` | `pages/Admin`, `pages/Profesor`, `pages/Estudiante` |
| RF-006 | HU-006 | RN-05 | `PUT /estudiantes/:id` | `pages/Admin`, `pages/Profesor` |
| RF-007 | HU-007 | RN-05 | `DELETE /estudiantes/:id` | `pages/Admin` |
| RF-008/009 | HU-008 | RN-05 | `/profesores` | `pages/Admin` |
| RF-010/011 | HU-009 | RN-01, RN-05 | `/asistencias`, `/asistencias/grupo` | `pages/Profesor` |
| RF-012 | HU-010 | RN-05, RN-07 | `/notas`, `/notas/grupo` | `pages/Profesor` |
| RF-013/014 | HU-011 | RN-05 | `/pagos` | `pages/Admin`, `pages/Estudiante` |
| RF-015 | HU-012 | RN-06 | `PUT /auth/profile` | `pages/*` (perfil compartido) |



