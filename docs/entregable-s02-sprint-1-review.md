# Sprint Review — Sprint 1: Dominio y Persistencia

**Proyecto:** Escuela Deportiva IERD Duitama
**Fecha:** Agosto 2026
**Responsable:** Sergy-PROG

---

## 1. Objetivo del Sprint

Modelar el dominio de datos del proyecto (Estudiante, Profesor, Pago, Asistencia, Nota)
y persistirlo mediante migraciones versionadas, sentando la base de datos del sistema.

## 2. Historias completadas

- [x] [HU] Modelar el dominio y persistirlo — Estudiantes, Pagos, Asistencias, Notas

## 3. Entregables verificables

| Entregable | Estado |
|---|---|
| Modelo de dominio documentado (`docs/modelo-de-dominio.md`) | ✅ Completado |
| Migraciones de Knex (6 tablas) | ✅ Completado |
| `.env` / `.env.example` configurados y protegidos | ✅ Completado |
| CI (lint + test) funcionando | ✅ Completado |
| Servicio `db` en `docker-compose.yml` | ❌ Pendiente |
| Migraciones aplicadas contra base de datos real | ❌ Pendiente |

## 4. Qué funcionó bien

- El flujo de Git (feature → PR → CI → merge) quedó consolidado y se repitió sin problemas
  en cada entrega del sprint.
- El modelo de dominio fue directo de definir gracias a que las entidades ya estaban
  claras desde las historias de usuario iniciales.

## 5. Qué no funcionó / bloqueos

- Instalación de Docker Desktop bloqueada por falta de espacio en disco y limitaciones
  de hardware en el equipo principal de trabajo.
- Como consecuencia, no fue posible levantar el servicio `db` ni correr las migraciones
  contra una base de datos real dentro de este sprint.

## 6. Aprendizajes

- Proteger `.env` desde el inicio del proyecto evita exponer credenciales por accidente
  (se detectó y corrigió un caso real de `.env` subido al repositorio).
- Cambiar de dispositivo de trabajo requiere reinstalar dependencias (`npm install`)
  y reconfigurar el remoto de Git si no se clona el repo de cero.

## 7. Próximos pasos (Sprint 2)

- Resolver instalación de Docker en un equipo con recursos suficientes.
- Levantar el servicio `db` y correr `npx knex migrate:latest`.
- Continuar con Dockerfiles esqueleto de backend y frontend.