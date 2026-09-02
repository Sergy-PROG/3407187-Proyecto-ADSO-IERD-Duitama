# Requerimientos Funcionales IERD Duitama

> Actualizado según el sistema realmente implementado (backend Node/Express + Knex/MySQL, frontend React).

## Requerimientos Funcionales (RF)

| ID | Requisito Funcional | Descripción |
|---|---|---|
| RF-001 | Autenticación de usuarios | El sistema debe permitir iniciar sesión con correo y contraseña, soportando múltiples cuentas (roles) bajo un mismo correo. |
| RF-002 | Registro con vínculo padre-hijo | Al registrarse como padre, el sistema debe crear automáticamente la cuenta del estudiante asociado (correo del padre + documento del hijo como contraseña). |
| RF-003 | Recuperación de contraseña | El sistema debe permitir recuperar la contraseña mediante un token de un solo uso enviado por correo, válido por 1 hora. |
| RF-004 | Registro de estudiantes | Administradores y profesores deben poder registrar nuevos estudiantes (nombre, documento, grupo). |
| RF-005 | Consulta de estudiantes | El sistema debe permitir consultar el roster completo (staff) o el propio registro (padre/estudiante). |
| RF-006 | Actualización de estudiantes | El staff debe poder actualizar grupo, estado, foto y logros de un estudiante. |
| RF-007 | Eliminación de estudiantes | Solo el administrador debe poder eliminar un estudiante, junto con sus pagos, asistencias y notas. |
| RF-008 | Gestión de profesores | El administrador debe poder registrar, actualizar y eliminar profesores. |
| RF-009 | Consulta de profesores | Cualquier usuario autenticado debe poder consultar la lista de profesores. |
| RF-010 | Gestión de asistencia | El staff debe poder registrar, editar y eliminar asistencia por estudiante y fecha, evitando duplicados el mismo día. |
| RF-011 | Consulta de asistencia por grupo | El sistema debe permitir filtrar asistencia por grupo y, opcionalmente, por fecha. |
| RF-012 | Gestión de notas de desempeño | El staff debe poder registrar, editar y eliminar calificaciones de técnica, táctica y actitud (rango 1–5). |
| RF-013 | Gestión de pagos | El administrador debe poder registrar, actualizar y eliminar pagos asociados a un estudiante. |
| RF-014 | Consulta de pagos | Cualquier usuario autenticado debe poder consultar los pagos (el frontend filtra por estudiante para roles no-staff). |
| RF-015 | Edición de perfil propio | Todo usuario autenticado debe poder editar su propia información de perfil. |

---

## Requerimientos No Funcionales (RNF)

### Seguridad

| ID | Requisito | Estado |
|---|---|---|
| RNF-001 | Las contraseñas se almacenan con hash bcrypt (nunca en texto plano). | Implementado. |
| RNF-002 | Los tokens de recuperación de contraseña se almacenan como hash SHA-256, nunca en crudo, y expiran en 1 hora. | Implementado. |
| RNF-003 | El acceso a los endpoints debe controlarse por rol mediante middleware (`adminOnly`, `profesorOnly`, `ownerOrStaff`). | Implementado. |
| RNF-004 | Las respuestas de autenticación no deben revelar si el error fue de correo o de contraseña. | Implementado. |
| RNF-005 | Las sesiones se controlan mediante JWT con expiración (7 días). | Implementado. |

### Rendimiento

| ID | Requisito | Estado |
|---|---|---|
| RNF-006 | Las consultas de asistencia y notas por grupo deben usar filtrado en la consulta SQL, no en el cliente. | Implementado (`WHERE e.grupo = ?`). |
| RNF-007 | El sistema debe responder a las consultas en un tiempo razonable bajo uso normal (sin carga de pruebas formal). | Pendiente de medición. |

### Usabilidad

| ID | Requisito | Estado |
|---|---|---|
| RNF-008 | Los mensajes de error deben ser específicos cuando la causa es identificable (documento duplicado, migración faltante, campo demasiado largo). | Implementado en `estudianteController`. |
| RNF-009 | La interfaz debe adaptarse a dispositivos móviles y de escritorio. | A verificar en frontend (Tailwind). |

### Mantenibilidad

| ID | Requisito | Estado |
|---|---|---|
| RNF-010 | La configuración sensible (credenciales de BD, JWT secret) debe vivir en variables de entorno, no en el código. | Implementado (`.env`, `.env.example`). |
| RNF-011 | Los cambios de esquema deben aplicarse mediante migraciones versionadas (Knex), no con `ALTER TABLE` manual. | Implementado (`backend/migrations/`). |

### Disponibilidad

| ID | Requisito | Estado |
|---|---|---|
| RNF-012 | El sistema debe informar cuando falta aplicar migraciones en vez de fallar con un error genérico. | Implementado (`ER_BAD_FIELD_ERROR`). |

---

## Resumen

| Categoría | Cantidad |
|---|---|
| Requerimientos Funcionales (RF) | 15 |
| RNF — Seguridad | 5 |
| RNF — Rendimiento | 2 |
| RNF — Usabilidad | 2 |
| RNF — Mantenibilidad | 2 |
| RNF — Disponibilidad | 1 |
| **Total de requerimientos** | **27** |

## Requisitos planeados y descartados del alcance actual

Los siguientes RF del diseño original **no se implementaron** y deben tratarse como backlog, no como pendiente del MVP actual: gestión de horarios, generación de reportes exportables, panel de indicadores/dashboard, publicación de noticias, gestión de torneos y sedes.
