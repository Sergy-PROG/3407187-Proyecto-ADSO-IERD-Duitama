# Diccionario de Datos

## Tabla: USUARIO

**Descripción:** Almacena la información de acceso de los usuarios del sistema.

| Campo | Tipo de Dato | Restricciones | Descripción |
| :---- | :---- | :---- | :---- |
| id\_usuario | SERIAL | PK, NOT NULL | Identificador único del usuario. |
| nombre | VARCHAR(100) | NOT NULL | Nombre completo del usuario. |
| correo | VARCHAR(100) | NOT NULL, UNIQUE | Correo electrónico utilizado para iniciar sesión. |
| contraseña | VARCHAR(255) | NOT NULL | Contraseña cifrada del usuario. |
| rol | VARCHAR(20) | NOT NULL | Rol asignado (Administrador, Entrenador, Deportista). |
| estado | BOOLEAN | NOT NULL | Estado de la cuenta (activa o inactiva). |

---

## Tabla: DEPORTISTA

**Descripción:** Contiene la información personal de los deportistas registrados.

| Campo | Tipo de Dato | Restricciones | Descripción |
| :---- | :---- | :---- | :---- |
| id\_deportista | SERIAL | PK, NOT NULL | Identificador único del deportista. |
| documento | VARCHAR(20) | NOT NULL, UNIQUE | Número de documento del deportista. |
| nombre | VARCHAR(100) | NOT NULL | Nombre del deportista. |
| apellido | VARCHAR(100) | NOT NULL | Apellido del deportista. |
| fecha\_nacimiento | DATE | NOT NULL | Fecha de nacimiento. |
| telefono | VARCHAR(20) | NOT NULL | Número telefónico de contacto. |
| direccion | VARCHAR(150) | NOT NULL | Dirección de residencia. |
| id\_categoria | INTEGER | FK, NOT NULL | Categoría a la que pertenece el deportista. |

---

## Tabla: ENTRENADOR

**Descripción:** Almacena la información de los entrenadores.

| Campo | Tipo de Dato | Restricciones | Descripción |
| :---- | :---- | :---- | :---- |
| id\_entrenador | SERIAL | PK, NOT NULL | Identificador único del entrenador. |
| documento | VARCHAR(20) | NOT NULL, UNIQUE | Documento de identidad. |
| nombre | VARCHAR(100) | NOT NULL | Nombre del entrenador. |
| apellido | VARCHAR(100) | NOT NULL | Apellido del entrenador. |
| especialidad | VARCHAR(100) | NOT NULL | Área deportiva de especialización. |
| telefono | VARCHAR(20) | NOT NULL | Número telefónico. |

---

## Tabla: CATEGORIA

**Descripción:** Define las categorías deportivas de la escuela.

| Campo | Tipo de Dato | Restricciones | Descripción |
| :---- | :---- | :---- | :---- |
| id\_categoria | SERIAL | PK, NOT NULL | Identificador de la categoría. |
| nombre\_categoria | VARCHAR(50) | NOT NULL | Nombre de la categoría deportiva. |
| descripcion | TEXT | NULL | Descripción de la categoría. |
| edad\_minima | INTEGER | NOT NULL | Edad mínima permitida. |
| edad\_maxima | INTEGER | NOT NULL | Edad máxima permitida. |
| id\_entrenador | INTEGER | FK, NOT NULL | Entrenador responsable de la categoría. |

---

## Tabla: HORARIO

**Descripción:** Registra los horarios de entrenamiento.

| Campo | Tipo de Dato | Restricciones | Descripción |
| :---- | :---- | :---- | :---- |
| id\_horario | SERIAL | PK, NOT NULL | Identificador único del horario. |
| fecha | DATE | NOT NULL | Fecha del entrenamiento. |
| hora\_inicio | TIME | NOT NULL | Hora de inicio. |
| hora\_fin | TIME | NOT NULL | Hora de finalización. |
| lugar | VARCHAR(100) | NOT NULL | Lugar donde se realizará el entrenamiento. |
| id\_categoria | INTEGER | FK, NOT NULL | Categoría asociada al horario. |

---

## Tabla: SESION\_ENTRENAMIENTO

**Descripción:** Representa cada sesión programada de entrenamiento.

| Campo | Tipo de Dato | Restricciones | Descripción |
| :---- | :---- | :---- | :---- |
| id\_sesion | SERIAL | PK, NOT NULL | Identificador de la sesión. |
| fecha | DATE | NOT NULL | Fecha de la sesión. |
| tema | VARCHAR(100) | NOT NULL | Tema o actividad principal. |
| observaciones | TEXT | NULL | Comentarios adicionales. |
| id\_horario | INTEGER | FK, NOT NULL | Horario asociado a la sesión. |

---

## Tabla: ASISTENCIA

**Descripción:** Registra la asistencia de los deportistas a las sesiones.

| Campo | Tipo de Dato | Restricciones | Descripción |
| :---- | :---- | :---- | :---- |
| id\_asistencia | SERIAL | PK, NOT NULL | Identificador único de la asistencia. |
| fecha\_registro | DATE | NOT NULL | Fecha del registro. |
| estado | VARCHAR(20) | NOT NULL | Estado de asistencia (Presente, Ausente, Justificado). |
| id\_deportista | INTEGER | FK, NOT NULL | Deportista asociado. |
| id\_sesion | INTEGER | FK, NOT NULL | Sesión de entrenamiento asociada. |

---

## Tabla: NOTICIA

**Descripción:** Almacena noticias y comunicados publicados por la escuela.

| Campo | Tipo de Dato | Restricciones | Descripción |
| :---- | :---- | :---- | :---- |
| id\_noticia | SERIAL | PK, NOT NULL | Identificador de la noticia. |
| titulo | VARCHAR(200) | NOT NULL | Título de la noticia. |
| contenido | TEXT | NOT NULL | Contenido de la publicación. |
| fecha\_publicacion | DATE | NOT NULL | Fecha de publicación. |
| id\_usuario | INTEGER | FK, NOT NULL | Usuario que publica la noticia. |

---

## Tabla: REPORTE

**Descripción:** Almacena los reportes generados por el sistema.

| Campo | Tipo de Dato | Restricciones | Descripción |
| :---- | :---- | :---- | :---- |
| id\_reporte | SERIAL | PK, NOT NULL | Identificador del reporte. |
| tipo\_reporte | VARCHAR(50) | NOT NULL | Tipo de reporte generado. |
| fecha\_generacion | DATE | NOT NULL | Fecha de generación. |
| id\_usuario | INTEGER | FK, NOT NULL | Usuario que generó el reporte. |

---

## Tabla: ESTUDIANTE

**Descripción:** Almacena la información académica y personal de los estudiantes vinculados a la Escuela de Formación Deportiva.

| Campo | Tipo de Dato | Restricciones | Descripción |
| :---- | :---- | :---- | :---- |
| id\_estudiante | SERIAL | PK, NOT NULL | Identificador único del estudiante. |
| documento | VARCHAR(20) | NOT NULL, UNIQUE | Documento de identidad del estudiante. |
| nombre | VARCHAR(100) | NOT NULL | Nombre del estudiante. |
| apellido | VARCHAR(100) | NOT NULL | Apellido del estudiante. |
| fecha\_nacimiento | DATE | NOT NULL | Fecha de nacimiento. |
| grado | VARCHAR(20) | NOT NULL | Grado académico actual. |
| telefono | VARCHAR(20) | NULL | Número telefónico de contacto. |
| direccion | VARCHAR(150) | NULL | Dirección de residencia. |
| id\_categoria | INTEGER | FK | Categoría deportiva asignada. |

---

## Tabla: SEDE

**Descripción:** Almacena las sedes donde se desarrollan entrenamientos, torneos y actividades deportivas.

| Campo | Tipo de Dato | Restricciones | Descripción |
| :---- | :---- | :---- | :---- |
| id\_sede | SERIAL | PK, NOT NULL | Identificador único de la sede. |
| nombre\_sede | VARCHAR(100) | NOT NULL | Nombre de la sede deportiva. |
| direccion | VARCHAR(150) | NOT NULL | Dirección de la sede. |
| telefono | VARCHAR(20) | NULL | Teléfono de contacto. |
| capacidad | INTEGER | NULL | Capacidad máxima de asistentes. |
| estado | BOOLEAN | NOT NULL | Indica si la sede se encuentra activa. |

---

## Tabla: TORNEO

**Descripción:** Registra los torneos y competencias deportivas organizadas o en las que participa la escuela.

| Campo | Tipo de Dato | Restricciones | Descripción |
| :---- | :---- | :---- | :---- |
| id\_torneo | SERIAL | PK, NOT NULL | Identificador único del torneo. |
| nombre\_torneo | VARCHAR(100) | NOT NULL | Nombre oficial del torneo. |
| fecha\_inicio | DATE | NOT NULL | Fecha de inicio del torneo. |
| fecha\_fin | DATE | NOT NULL | Fecha de finalización del torneo. |
| categoria | VARCHAR(50) | NOT NULL | Categoría participante. |
| estado | VARCHAR(20) | NOT NULL | Estado del torneo (Programado, En curso, Finalizado). |
| id\_sede | INTEGER | FK, NOT NULL | Sede donde se realizará el torneo. |

---

## Tabla Intermedia: PARTICIPACION\_TORNEO

Esta tabla resuelve la relación **N:M** entre estudiantes y torneos.

**Descripción:** Registra la participación de los estudiantes en los diferentes torneos.

| Campo | Tipo de Dato | Restricciones | Descripción |
| :---- | :---- | :---- | :---- |
| id\_participacion | SERIAL | PK, NOT NULL | Identificador único de participación. |
| id\_estudiante | INTEGER | FK, NOT NULL | Estudiante participante. |
| id\_torneo | INTEGER | FK, NOT NULL | Torneo en el que participa. |
| posicion\_final | INTEGER | NULL | Posición obtenida al finalizar el torneo. |
| observaciones | TEXT | NULL | Comentarios o anotaciones relevantes. |

