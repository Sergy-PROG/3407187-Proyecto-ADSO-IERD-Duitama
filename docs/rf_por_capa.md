# RF por Capa — Backend, Frontend y Base de Datos

> Para cada RF: qué capa lo resuelve, con qué mecanismo concreto, y por qué esa decisión es adecuada (o no) en el contexto real del proyecto.

---

## 1. Capa Backend

| RF | Mecanismo real | Por qué es una buena solución aquí |
|---|---|---|
| RF-001 Autenticación | `authController.login`: prueba la contraseña contra **todas** las filas con ese email hasta encontrar match; JWT sin estado (7 días) | El loop es necesario porque un correo puede tener 2 cuentas (padre+hijo); JWT evita guardar sesiones en servidor, lo cual escala mejor para una app pequeña sin infraestructura de sesión dedicada. |
| RF-002 Registro padre-hijo | Un solo endpoint hace 2-3 `INSERT` encadenados (usuario padre → usuario estudiante → estudiante) | Bueno para el usuario (un solo formulario, una sola llamada). **Punto débil real:** no está envuelto en una transacción Knex (`knex.transaction`) — si el segundo `INSERT` falla, el primero ya quedó guardado, dejando datos a medias. Vale la pena mencionarlo como mejora identificada. |
| RF-003 Recuperar contraseña | Token de un solo uso, hash SHA-256 en BD, expira en 1h | Correcto en diseño de seguridad (nunca se guarda el token en crudo). Débil en implementación: `emailService.cjs` no existe, así que el envío real de correo no funciona hoy — es deuda técnica ya documentada. |
| RF-004–007 CRUD estudiantes | `profesorOnly` para crear/leer/actualizar, `adminOnly` solo para eliminar | Refleja la operación real de una escuela: el profesor hace la gestión diaria, pero borrar historial completo de un estudiante es una decisión de mayor peso reservada al admin. |
| RF-008–009 Profesores | `adminOnly` para escribir, lectura abierta a cualquier autenticado | Los profesores son casi un catálogo de referencia (cambian poco); no vale la pena una regla de "dueño" como en estudiantes. |
| RF-010–011 Asistencia | `profesorOnly` para escribir; `UNIQUE(estudiante_id, fecha)` delegado a MySQL | Correcto delegar la regla "un registro por día" a la base de datos: así se cumple sin importar qué controlador o proceso futuro inserte datos. |
| RF-012 Notas | `profesorOnly` para escribir; **sin** validación de rango 1-5 en backend ni BD | Aquí la solución **no es buena**: nada impide guardar una nota de `99.9`. Es el hallazgo de deuda técnica más claro para mencionar en sustentación. |
| RF-013–014 Pagos | `adminOnly` para escribir; lectura solo con `authMiddleware`, **sin** filtro de dueño ⚠️ | La escritura está bien protegida (dinero = admin). La lectura **no** — cualquier usuario autenticado puede listar pagos de otros estudiantes vía API directa, aunque el frontend no lo muestre así. Es una brecha real, no solo teórica. |
| RF-015 Editar perfil | El endpoint usa `req.userId` del JWT, nunca un `:id` de la URL | Buena decisión: es imposible editar el perfil de otro aunque se manipule la petición, porque el "a quién" lo decide el token firmado, no un parámetro que el cliente controla. |

---

## 2. Capa Frontend

| RF | Mecanismo real | Por qué es una buena solución aquí |
|---|---|---|
| RF-001 / RF-015 | `AuthContext`: guarda `user` + token en `localStorage`/`sessionStorage`, expone `login()`/`logout()` a toda la app | Centralizar la sesión en un contexto evita que cada componente maneje su propio `fetch` de login; "recordarme" vs sesión temporal se resuelve eligiendo `localStorage` vs `sessionStorage`. |
| RF-002 | Formulario en `Login.jsx` que muestra campos de "hijo" solo si el rol elegido es `padre` | Un único formulario condicional es más simple de mantener que dos pantallas de registro separadas. |
| RF-003 | Flujo "olvidé mi contraseña" en `Login.jsx`, consumiendo `/forgot-password` y `/reset-password` | Reutiliza el mismo cliente `api.js`, sin lógica de red duplicada. |
| RF-004–007 | `Admin.jsx` / `Profesor.jsx` llaman a `addEstudiante`, `updateEstudiante`, `deleteEstudiante` del `DataContext`, que a su vez llama `api.js` | El componente de UI nunca sabe que existe un backend HTTP — solo llama funciones de contexto; si mañana cambia la API, solo se toca `DataContext`/`api.js`, no cada pantalla. |
| RF-008–009 | Mismo patrón en `Admin.jsx` para profesores | Consistencia: todas las entidades siguen el mismo patrón `dataContext.addX / updateX / deleteX`, reduce curva de aprendizaje del código para cualquiera que lo mantenga después. |
| RF-010 | `Profesor.jsx` con componentes propios (`StudentProgressCard`) para marcar asistencia por grupo | La UI está organizada por lo que el profesor hace a diario (su grupo), no por la tabla cruda — mejor usabilidad, cumple RNF de usabilidad de la guía. |
| RF-011 | Filtrado en frontend usando el estado ya cargado, o llamada directa a `/asistencias/grupo` | Tener ambos caminos (filtrar en memoria vs pedir ya filtrado al backend) da flexibilidad, aunque sería más consistente usar siempre el endpoint filtrado para no mover datos de más. |
| RF-012 | `AchievementBadge` / notas en `Profesor.jsx` | Igual patrón que asistencia — coherencia de diseño. |
| RF-013–014 | `Admin.jsx` (gestión completa) y `Estudiante.jsx` → `StudentStats` (solo lectura, filtrando `pagos` por su propio `estudianteId` en el cliente) | **Aquí el frontend "tapa" la brecha de seguridad del backend (RF-013–014 arriba)**: filtra visualmente los pagos ajenos, pero como vimos, eso no es una barrera real — solo evita que un usuario normal *vea por accidente* los datos, no que alguien con herramientas de red los pida directamente. |
| RF-015 | `ProfileModal.jsx` (componente común, reutilizado en los 3 paneles) | Un solo componente de edición de perfil evita triplicar el formulario en Admin/Profesor/Estudiante. |

---

## 3. Capa Base de Datos

| RF | Mecanismo real | Por qué es una buena solución aquí |
|---|---|---|
| RF-001 | `password` hasheado con bcrypt (columna `VARCHAR(255)`) | La BD nunca almacena el secreto real; aunque se filtre la base completa, las contraseñas no son legibles ni reversibles. |
| RF-002 | `UNIQUE(email, rol)` en `usuarios` | La regla "mismo correo, distinto rol" queda garantizada estructuralmente — ningún bug de aplicación puede violarla, porque MySQL la rechaza a nivel de motor. |
| RF-004 | `UNIQUE(documento)` en `estudiantes` | Evita duplicar el mismo estudiante por error humano, sin depender de que el backend recuerde validarlo (aunque también lo valida, es doble capa). |
| RF-007 | `FOREIGN KEY ... ON DELETE CASCADE` en pagos/asistencias/notas | Elimina huérfanos automáticamente; nadie tiene que escribir lógica manual de "borra también sus asistencias, sus notas, sus pagos". |
| RF-010 | `UNIQUE(estudiante_id, fecha)` en `asistencias` | Es el ejemplo más limpio del proyecto de una regla de negocio resuelta en el nivel correcto: no depende de que el frontend ni el backend "se acuerden" de chequear antes de insertar. |
| RF-012 | **Nada** — sin `CHECK` en `tecnica/tactica/actitud` | Aquí la BD **debería** tener la regla y no la tiene. Es la brecha más citable del proyecto: la capa que más garantiza integridad (la base de datos) es justo la que falta en este RF. |
| RF-013 | Sin restricción especial más allá de la FK | Razonable: no hay una regla de negocio estructural sobre pagos (montos libres, conceptos libres), así que no falta nada aquí a diferencia de RF-012. |

---

## 4. Lectura general para sustentar

- El patrón que más se repite y mejor defiende el proyecto es: **reglas de integridad estructural (unicidad, cascada) resueltas en la base de datos**, y **reglas de autorización (quién puede hacer qué) resueltas en middleware del backend**. Esa separación es coherente y fácil de explicar.
- El **frontend nunca es una barrera de seguridad real** en este proyecto — es una capa de conveniencia (oculta botones, filtra listas) que asume que el backend ya protegió lo importante. Eso es correcto como principio, **excepto** en pagos/asistencias/notas donde el backend no completó esa protección (falta `ownerOrStaff` en las lecturas).
- El RF con la brecha más clara de "buena intención, implementación incompleta" es **RF-012 (notas)**: el rango 1-5 se documenta y se espera, pero no se aplica en ninguna capa.

