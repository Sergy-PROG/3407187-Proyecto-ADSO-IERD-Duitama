# Historias de Usuario — Sistema Escuela Deportiva IERD Duitama

> Actualizadas según los roles y endpoints realmente implementados en `backend/routes` y `backend/controllers`.
> Roles del sistema: **Administrador**, **Profesor**, **Estudiante**, **Padre/Acudiente**.

## HU-001: Inicio de Sesión

| Campo | Descripción |
|---|---|
| **COMO** | Usuario registrado (admin, profesor, estudiante o padre) |
| **QUIERO** | Iniciar sesión con mi correo y contraseña |
| **PARA** | Acceder a las funciones permitidas según mi rol |
| **CRITERIOS DE ACEPTACIÓN** | - El sistema valida correo y contraseña contra `usuarios`.<br>- Si el correo tiene varias cuentas (ej. padre + hijo), se prueba la contraseña contra cada una hasta encontrar coincidencia.<br>- Si no coincide, responde con el mismo mensaje genérico "Credenciales incorrectas" (no revela cuál dato falló).<br>- Si es correcto, entrega un JWT válido por 7 días con `id`, `email` y `rol`. |

---

## HU-002: Registro de cuenta (padre + estudiante)

| Campo | Descripción |
|---|---|
| **COMO** | Padre/acudiente nuevo |
| **QUIERO** | Registrarme junto con los datos de mi hijo/a |
| **PARA** | Que ambos podamos acceder al sistema con cuentas separadas |
| **CRITERIOS DE ACEPTACIÓN** | - No pueden existir dos cuentas con el mismo correo **y** mismo rol.<br>- Al registrar un padre con datos de hijo (`hijo`, `documentoHijo`), el sistema crea automáticamente una cuenta `rol = estudiante` con el mismo correo del padre y contraseña = documento del hijo (hasheada).<br>- Se crea o vincula el registro en `estudiantes`, quedando en grupo `Sin asignar` hasta que el staff le asigne un grupo real. |

---

## HU-003: Recuperación de Contraseña

| Campo | Descripción |
|---|---|
| **COMO** | Usuario registrado |
| **QUIERO** | Recuperar mi contraseña mediante correo electrónico |
| **PARA** | Volver a acceder a mi cuenta en caso de olvido |
| **CRITERIOS DE ACEPTACIÓN** | - El usuario ingresa correo y rol (porque un correo puede tener varias cuentas).<br>- El sistema responde siempre con un mensaje genérico, exista o no la cuenta.<br>- Si existe, genera un token de un solo uso, guarda solo su hash SHA-256 y lo envía por correo; el token vence en 1 hora.<br>- Al confirmar, la nueva contraseña debe tener mínimo 8 caracteres y se guarda con hash bcrypt. |

---

## HU-004: Registro de Estudiantes

| Campo | Descripción |
|---|---|
| **COMO** | Administrador o Profesor |
| **QUIERO** | Registrar nuevos estudiantes en el roster |
| **PARA** | Mantener actualizada la información de los deportistas |
| **CRITERIOS DE ACEPTACIÓN** | - Nombre, documento y grupo son obligatorios.<br>- El documento debe ser único; si ya existe, se informa el conflicto (409).<br>- Si faltan migraciones o el `grupo` enviado no es válido para el ENUM actual, se informa el error específico en vez de un error genérico. |

---

## HU-005: Consulta de Estudiantes

| Campo | Descripción |
|---|---|
| **COMO** | Administrador o Profesor |
| **QUIERO** | Consultar la lista completa de estudiantes |
| **PARA** | Acceder rápidamente a sus datos |
| **CRITERIOS DE ACEPTACIÓN** | - Lista ordenada por nombre.<br>- Un padre o estudiante solo puede consultar el detalle (`GET /:id`) de su propio registro (`ownerOrStaff`); staff puede consultar cualquiera. |

---

## HU-006: Actualización de Estudiantes

| Campo | Descripción |
|---|---|
| **COMO** | Administrador o Profesor |
| **QUIERO** | Modificar la información de un estudiante (grupo, foto, logros, estado) |
| **PARA** | Mantener los datos actualizados |
| **CRITERIOS DE ACEPTACIÓN** | - Solo staff (admin/profesor) puede editar.<br>- Los "logros" se guardan y devuelven como arreglo, aunque internamente se almacenen como JSON en texto. |

---

## HU-007: Eliminación de Estudiantes

| Campo | Descripción |
|---|---|
| **COMO** | Administrador |
| **QUIERO** | Eliminar el registro de un estudiante |
| **PARA** | Mantener organizada la base de datos |
| **CRITERIOS DE ACEPTACIÓN** | - Solo el rol `admin` puede eliminar (no basta con ser profesor).<br>- Al eliminar, se eliminan en cascada sus pagos, asistencias y notas asociadas. |

---

## HU-008: Gestión de Profesores

| Campo | Descripción |
|---|---|
| **COMO** | Administrador |
| **QUIERO** | Registrar, editar y eliminar profesores |
| **PARA** | Controlar la información del personal deportivo |
| **CRITERIOS DE ACEPTACIÓN** | - Crear/editar/eliminar es exclusivo de `admin`.<br>- Consultar la lista está disponible para cualquier usuario autenticado. |

---

## HU-009: Registro de Asistencia

| Campo | Descripción |
|---|---|
| **COMO** | Profesor |
| **QUIERO** | Registrar la asistencia de los estudiantes de mi grupo |
| **PARA** | Llevar control de participación en los entrenamientos |
| **CRITERIOS DE ACEPTACIÓN** | - Solo staff (admin/profesor) puede crear, editar o eliminar asistencia.<br>- Un mismo estudiante no puede tener dos registros de asistencia en la misma fecha (restricción única `estudiante_id + fecha`).<br>- Se puede consultar por grupo y, opcionalmente, filtrar por fecha. |

---

## HU-010: Registro de Notas de Desempeño

| Campo | Descripción |
|---|---|
| **COMO** | Profesor |
| **QUIERO** | Registrar calificaciones de técnica, táctica y actitud |
| **PARA** | Dar seguimiento al desempeño deportivo de cada estudiante |
| **CRITERIOS DE ACEPTACIÓN** | - Solo staff puede crear, editar o eliminar notas.<br>- Cada valor (técnica, táctica, actitud) debe estar entre 1 y 5.<br>- Se puede consultar todas las notas o filtrar por grupo. |

---

## HU-011: Gestión de Pagos

| Campo | Descripción |
|---|---|
| **COMO** | Administrador |
| **QUIERO** | Registrar y controlar los pagos de cada estudiante |
| **PARA** | Llevar el control financiero de la escuela |
| **CRITERIOS DE ACEPTACIÓN** | - Crear, editar y eliminar pagos es exclusivo de `admin`.<br>- Cualquier usuario autenticado puede consultar pagos (el frontend filtra por estudiante para padres/estudiantes).<br>- Cada pago tiene estado `Pagado` o `Pendiente`. |

---

## HU-012: Edición de Perfil

| Campo | Descripción |
|---|---|
| **COMO** | Usuario autenticado |
| **QUIERO** | Editar mi nombre, apodo, teléfono, cumpleaños y foto |
| **PARA** | Mantener mi información personal actualizada |
| **CRITERIOS DE ACEPTACIÓN** | - Solo se puede editar el propio perfil (identificado por el JWT).<br>- No se puede cambiar correo ni rol desde este endpoint. |

---

## Matriz de Cobertura (RF → HU)

| Requisito Funcional | Historia de Usuario |
|---|---|
| RF-001 | HU-001 |
| RF-002 | HU-002 |
| RF-003 | HU-003 |
| RF-004 | HU-004 |
| RF-005 | HU-005 |
| RF-006 | HU-006 |
| RF-007 | HU-007 |
| RF-008 | HU-008 |
| RF-009 | HU-009 |
| RF-010 | HU-010 |
| RF-011 | HU-011 |
| RF-012 | HU-012 |
| RF-013 | HU-001 |
| RF-014 | HU-005 |
