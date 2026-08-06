# Modelo de Dominio — Escuela Deportiva IERD Duitama

## 1. Entidades y Value Objects

| Sustantivo | Tipo | Justificación |
|---|---|---|
| Estudiante | Entidad | Tiene identidad propia (id), persiste en el tiempo con historial de notas/asistencias/pagos |
| Profesor | Entidad | Tiene identidad propia, independiente de sus datos |
| Pago | Entidad | Cada pago es un evento único con su propio ciclo (pendiente → pagado) |
| Asistencia | Entidad | Cada registro es único (estudiante + fecha) |
| Nota | Entidad | Cada evaluación es un evento único en el tiempo |
| Grupo | Value Object | Definido solo por su valor (Infantil, Prejuvenil, Juvenil, Femenino), sin identidad propia |

## 2. Agregado

**Raíz de agregado:** `Estudiante`

`Pago`, `Asistencia` y `Nota` pertenecen al agregado de `Estudiante` — no se modifican de forma independiente sin pasar por el estudiante dueño.

## 3. Relaciones y Cardinalidad

| Relación | Cardinalidad | Dueño de la relación |
|---|---|---|
| Estudiante — Pago | 1:N | `Pago` referencia a `Estudiante` (`estudiante_id`) |
| Estudiante — Asistencia | 1:N | `Asistencia` referencia a `Estudiante` (`estudiante_id`) |
| Estudiante — Nota | 1:N | `Nota` referencia a `Estudiante` (`estudiante_id`) |

## 4. Regla de negocio no garantizable solo por el esquema

> Un estudiante no puede tener dos registros de `Asistencia` en la misma fecha.

Esta regla se refuerza parcialmente con una restricción `UNIQUE(estudiante_id, fecha)` en la base de datos, pero la validación completa (incluyendo mensajes de error claros al usuario) se aplica en la **capa de servicio** del backend, antes de insertar el registro.

## 5. Esquema mínimo

Ver migraciones en `backend/migrations/`:
- `create_usuarios_table.js`
- `create_estudiantes_table.js`
- `create_profesores_table.js`
- `create_pagos_table.js`
- `create_asistencias_table.js`
- `create_notas_table.js`

Ver detalle completo de columnas y tipos en `docs/documentacion-tecnica-ierd-duitama.md`, sección 8.