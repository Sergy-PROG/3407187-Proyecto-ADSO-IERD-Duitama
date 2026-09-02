# Diccionario de Datos — Sistema Escuela Deportiva IERD Duitama

> Actualizado a partir del esquema real implementado (Knex/MySQL: `backend/migrations/*`).
> Reemplaza el diseño anterior (Deportista/Entrenador/Categoría/Torneo/Sede), que **no llegó a implementarse**.

## Tabla: usuarios

**Descripción:** Cuentas de acceso al sistema. Un mismo correo puede tener **varias cuentas** (una por rol) — por ejemplo, un padre y su hijo/a comparten el correo del padre, cada uno con su propia contraseña.

| Campo | Tipo de Dato | Restricciones | Descripción |
|---|---|---|---|
| id | INTEGER | PK, AUTO_INCREMENT | Identificador único. |
| nombre | VARCHAR(120) | NOT NULL | Nombre completo. |
| email | VARCHAR(120) | NOT NULL | Correo de acceso. |
| password | VARCHAR(255) | NOT NULL | Hash bcrypt de la contraseña (nunca texto plano). |
| rol | ENUM | NOT NULL | `admin`, `profesor`, `estudiante`, `padre`. |
| apodo | VARCHAR(60) | NULL | Alias mostrado en la interfaz. |
| telefono | VARCHAR(20) | NULL | Contacto. |
| cumpleanos | DATE | NULL | Fecha de nacimiento. |
| foto | MEDIUMTEXT | NULL | Foto de perfil (base64). |
| hijo | VARCHAR(120) | NULL | Nombre del hijo/a (solo si `rol = padre`). |
| parentesco | VARCHAR(60) | NULL | Relación con el hijo/a (solo si `rol = padre`). |
| reset_password_token | VARCHAR(255) | NULL | Hash SHA-256 del token de recuperación (nunca el token en crudo). |
| reset_password_expires | DATETIME | NULL | Vencimiento del token (1 hora tras solicitarse). |
| created_at / updated_at | TIMESTAMP | NOT NULL | Auditoría. |

**Restricción compuesta:** `UNIQUE(email, rol)` — permite padre + hijo con el mismo correo, pero no dos cuentas duplicadas del mismo rol con el mismo correo.

---

## Tabla: estudiantes

**Descripción:** Roster deportivo. Es el equivalente al antiguo "Deportista".

| Campo | Tipo de Dato | Restricciones | Descripción |
|---|---|---|---|
| id | INTEGER | PK, AUTO_INCREMENT | Identificador único. |
| nombre | VARCHAR(120) | NOT NULL | Nombre del estudiante. |
| documento | VARCHAR(30) | NOT NULL, UNIQUE | Documento de identidad. |
| grupo | ENUM | NOT NULL | `Infantil`, `Prejuvenil`, `Juvenil`, `Femenino`, `Sin asignar`. |
| acudiente | VARCHAR(120) | NULL | Nombre del acudiente. |
| estado | ENUM | DEFAULT 'Activo' | `Activo` / `Inactivo`. |
| foto | MEDIUMTEXT | NULL | Foto (base64). |
| logros | TEXT | NULL | Arreglo JSON de logros/insignias (ej. `["asistencia","tecnica"]`). |
| usuario_id | INTEGER | FK, NULL | Referencia a `usuarios.id` (cuenta con la que el estudiante inicia sesión). `ON DELETE SET NULL`. |
| created_at / updated_at | TIMESTAMP | NOT NULL | Auditoría. |

**Nota de diseño:** `grupo` reemplaza a la antigua tabla `CATEGORIA`. Se implementó como ENUM fijo dentro de `estudiantes`, no como tabla independiente — decisión que simplifica el modelo porque los grupos son fijos y no requieren edad_minima/edad_maxima ni entrenador asignado como se planeaba originalmente.

---

## Tabla: profesores

**Descripción:** Equivalente al antiguo "Entrenador".

| Campo | Tipo de Dato | Restricciones | Descripción |
|---|---|---|---|
| id | INTEGER | PK, AUTO_INCREMENT | Identificador único. |
| nombre | VARCHAR(120) | NOT NULL | Nombre del profesor. |
| email | VARCHAR(120) | NOT NULL, UNIQUE | Correo. |
| especialidad | VARCHAR(120) | NULL | Área deportiva. |
| foto | VARCHAR(255) | NULL | Foto de perfil. |
| created_at / updated_at | TIMESTAMP | NOT NULL | Auditoría. |

---

## Tabla: pagos

**Descripción:** Control de pagos por estudiante (no existía en el diseño anterior).

| Campo | Tipo de Dato | Restricciones | Descripción |
|---|---|---|---|
| id | INTEGER | PK, AUTO_INCREMENT | Identificador único. |
| estudiante_id | INTEGER | FK, NOT NULL | Referencia a `estudiantes.id`. `ON DELETE CASCADE`. |
| concepto | VARCHAR(120) | NOT NULL | Motivo del pago (mensualidad, uniforme, etc.). |
| monto | DECIMAL(10,2) | NOT NULL | Valor del pago. |
| estado | ENUM | DEFAULT 'Pendiente' | `Pagado` / `Pendiente`. |
| fecha | DATE | NOT NULL | Fecha del pago o vencimiento. |
| created_at / updated_at | TIMESTAMP | NOT NULL | Auditoría. |

---

## Tabla: asistencias

**Descripción:** Registro de asistencia por sesión de entrenamiento.

| Campo | Tipo de Dato | Restricciones | Descripción |
|---|---|---|---|
| id | INTEGER | PK, AUTO_INCREMENT | Identificador único. |
| estudiante_id | INTEGER | FK, NOT NULL | Referencia a `estudiantes.id`. `ON DELETE CASCADE`. |
| fecha | DATE | NOT NULL | Fecha del entrenamiento. |
| estado | ENUM | NOT NULL | `Presente`, `Ausente`, `Justificado`. |
| grupo | ENUM | NOT NULL | Grupo del estudiante en ese momento (denormalizado para consultas rápidas por grupo). |
| created_at / updated_at | TIMESTAMP | NOT NULL | Auditoría. |

**Restricción compuesta:** `UNIQUE(estudiante_id, fecha)` → un estudiante solo puede tener **un** registro de asistencia por día. Esta es la regla de negocio equivalente a RN-01 del proyecto.

---

## Tabla: notas

**Descripción:** Calificación de desempeño deportivo (reemplaza en la práctica a `SESION_ENTRENAMIENTO`, que no se implementó).

| Campo | Tipo de Dato | Restricciones | Descripción |
|---|---|---|---|
| id | INTEGER | PK, AUTO_INCREMENT | Identificador único. |
| estudiante_id | INTEGER | FK, NOT NULL | Referencia a `estudiantes.id`. `ON DELETE CASCADE`. |
| fecha | DATE | NOT NULL | Fecha de evaluación. |
| tecnica | DECIMAL(3,1) | NOT NULL, CHECK 1–5 | Calificación técnica. |
| tactica | DECIMAL(3,1) | NOT NULL, CHECK 1–5 | Calificación táctica. |
| actitud | DECIMAL(3,1) | NOT NULL, CHECK 1–5 | Calificación actitudinal. |
| grupo | ENUM | NOT NULL | Grupo del estudiante en ese momento. |
| created_at / updated_at | TIMESTAMP | NOT NULL | Auditoría. |

---

## Tablas planeadas y NO implementadas

Estas tablas aparecían en el diseño original pero **no existen en la base de datos real**. Se documentan aquí para que la sustentación sea honesta sobre el alcance del MVP:

| Tabla planeada | Estado | Equivalente real |
|---|---|---|
| CATEGORIA | No implementada | `estudiantes.grupo` (ENUM) |
| HORARIO | No implementada | — |
| SESION_ENTRENAMIENTO | No implementada | `notas` (cumple un rol similar) |
| NOTICIA | No implementada | — |
| REPORTE | No implementada | — |
| SEDE | No implementada | — |
| TORNEO / PARTICIPACION_TORNEO | No implementada | — |

Si estas funcionalidades se retoman, deben tratarse como **backlog post-MVP**, no como deuda técnica del entregable actual.
