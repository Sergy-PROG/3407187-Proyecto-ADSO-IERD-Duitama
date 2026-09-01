# Modelo de Dominio — Escuela Deportiva IERD Duitama (corregido)

> Corregido contra `backend/migrations/` y `backend/controllers/` reales. Cambios marcados con **⚠️**.

## 1. Entidades y Value Objects

| Sustantivo | Tipo | Justificación |
|---|---|---|
| Usuario | Entidad | ⚠️ **Faltaba por completo.** Tiene identidad propia (id), independiente de a quién representa; controla acceso y rol. |
| Estudiante | Entidad | Tiene identidad propia (id), persiste en el tiempo con historial de notas/asistencias/pagos. |
| Profesor | Entidad | Tiene identidad propia, independiente de sus datos. |
| Pago | Entidad | Cada pago es un evento único con su propio ciclo (`Pendiente` → `Pagado`). |
| Asistencia | Entidad | Cada registro es único (estudiante + fecha). |
| Nota | Entidad | Cada evaluación es un evento único en el tiempo. |
| Grupo | Value Object | Definido solo por su valor: `Infantil`, `Prejuvenil`, `Juvenil`, `Femenino`, **`Sin asignar`** ⚠️ (faltaba este valor, usado como estado inicial de un estudiante recién auto-registrado). |
| Rol | Value Object | ⚠️ **Faltaba.** Definido solo por su valor: `admin`, `profesor`, `estudiante`, `padre`. Determina qué puede hacer un Usuario. |

---

## 2. Relación Usuario ↔ Estudiante ⚠️ (sección faltante)

Un `Usuario` y un `Estudiante` son **entidades distintas** aunque representen a la misma persona:

- Un `Estudiante` puede existir **sin** cuenta de usuario (ej. un menor que aún no tiene credenciales propias).
- Un `Usuario` con `rol = estudiante` o `rol = padre` puede estar **vinculado** a un `Estudiante` mediante `estudiantes.usuario_id` (FK opcional, `ON DELETE SET NULL`).
- Un mismo `email` puede tener **dos** filas en `usuarios` (una `padre` y una `estudiante`), nunca dos con el mismo `rol`.

Esto no es una relación de agregado (no hay cascada de negocio Usuario→Estudiante); es una relación de referencia simple.

---

## 3. ¿Agregado con raíz `Estudiante`? — aclaración importante ⚠️

La versión anterior de este documento afirmaba que `Estudiante` es una **raíz de agregado** en el sentido de DDD (Domain-Driven Design), y que `Pago`, `Asistencia` y `Nota` "no se modifican de forma independiente sin pasar por el estudiante dueño".

**Esto es una intención de diseño, no lo que hace el código actualmente.** En el backend real:
- No existen clases de dominio, repositorios ni un "agregado" como objeto.
- Cada controlador (`pagoController`, `asistenciaController`, `notaController`) ejecuta `INSERT`/`UPDATE`/`DELETE` **directamente** sobre su tabla con `pool.query(...)`, sin pasar por el estudiante ni por ninguna capa intermedia.
- Lo único que "protege" la relación es la `FOREIGN KEY ... ON DELETE CASCADE`: si se borra un estudiante, MySQL borra sus pagos/asistencias/notas — pero eso es integridad referencial de base de datos, no un patrón de agregado en la capa de aplicación.

**Conclusión correcta para la sustentación:** el modelo conceptual usa `Estudiante` como el "centro" natural del dominio (por eso las demás tablas cuelgan de él), pero el proyecto **no implementa** el patrón formal de Agregado/Repositorio de DDD — es una arquitectura CRUD directa sobre tablas relacionadas. Decirlo así es más defendible que afirmar un patrón que no está en el código.

---

## 4. Relaciones y Cardinalidad

| Relación | Cardinalidad | Dueño de la relación (FK) |
|---|---|---|
| Usuario — Estudiante | 1:0..1 ⚠️ (faltaba) | `Estudiante.usuario_id` → `Usuario.id`, nullable, `ON DELETE SET NULL` |
| Estudiante — Pago | 1:N | `Pago.estudiante_id` → `Estudiante.id`, `ON DELETE CASCADE` |
| Estudiante — Asistencia | 1:N | `Asistencia.estudiante_id` → `Estudiante.id`, `ON DELETE CASCADE` |
| Estudiante — Nota | 1:N | `Nota.estudiante_id` → `Estudiante.id`, `ON DELETE CASCADE` |

---

## 5. Regla de negocio: asistencia única por día

> Un estudiante no puede tener dos registros de `Asistencia` en la misma fecha.

**Corrección respecto a la versión anterior ⚠️:** el documento previo decía que esta regla se valida "en la capa de servicio del backend, antes de insertar el registro, con mensajes de error claros". **Esto no ocurre.** Revisando `asistenciaController.createAsistencia`, el controlador hace un `INSERT` directo sin verificar duplicados antes:

```javascript
const [result] = await pool.query(
  'INSERT INTO asistencias (estudiante_id, fecha, estado, grupo) VALUES (?, ?, ?, ?)',
  [estudiante_id, fecha, estado, grupo]
);
```

La regla se cumple **únicamente** porque la migración `20260806002620_create_asistencias_table.js` define `UNIQUE(estudiante_id, fecha)`. Si se viola, MySQL lanza `ER_DUP_ENTRY`, que el `catch` genérico del controlador convierte en un `500 - "Error del servidor"` — **no** en un mensaje claro para el usuario final.

**Deuda técnica a reconocer en sustentación:** falta una validación explícita en el controlador que traduzca ese error de MySQL en un mensaje entendible (ej. "Ya existe un registro de asistencia para este estudiante en esta fecha"), similar a lo que sí hace `estudianteController` con el documento duplicado.

---

## 6. Esquema mínimo (migraciones reales)

Ver `backend/migrations/` — nombres reales ⚠️ (la versión anterior los abrevió sin el timestamp real de Knex):

- `20260806002609_create_usuarios_table.js`
- `20260806002612_create_estudiantes_table.js`
- `20260806002614_create_profesores_table.js`
- `20260806002618_create_pagos_table.js`
- `20260806002620_create_asistencias_table.js`
- `20260806002622_create_notas_table.js`
- `20260807191733_add_usuario_id_to_estudiantes.js` ⚠️ (faltaba mencionar; agrega la relación Usuario↔Estudiante)
- `20260813120000_add_logros_to_estudiantes.js`
- `20260815130000_email_rol_unique_usuarios.js` ⚠️ (faltaba; es la migración que crea `UNIQUE(email, rol)`)
- `20260816090000_add_sin_asignar_grupo_estudiantes.js` ⚠️ (faltaba; agrega el valor `Sin asignar` al ENUM)
- `20260820140000_foto_mediumtext.js` ⚠️ (faltaba; cambia `foto` a `MEDIUMTEXT` para soportar imágenes en base64)
- `20260825000000_add_password_reset_to_usuarios.js` ⚠️ (faltaba; agrega `reset_password_token` y `reset_password_expires`)

Ver detalle completo de columnas y tipos en `docs/documentacion-tecnica-ierd-duitama.md`, sección 8.
