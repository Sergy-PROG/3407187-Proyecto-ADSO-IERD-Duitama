# Diagramas de Actividad — Escuela Deportiva IERD Duitama

## 1. Registro de usuario (padre + estudiante)

```mermaid
flowchart TD
    A(["Padre/Estudiante ingresa a Login"]) --> B["Clic en `Registrarse`"]
    B --> C["Completa formulario: nombre, correo, contraseña, rol"]
    C --> D{"¿Es rol = padre y llenó datos del hijo?"}
    D -- No --> E["POST /api/auth/register"]
    D -- Sí --> F["Incluye hijo + documentoHijo en el mismo POST"]
    F --> E
    E --> G{"¿Ya existe cuenta con ese email + rol?"}
    G -- Sí --> H["400: 'Ya existe una cuenta de este tipo con ese correo'"]
    G -- No --> I["Hashea password con bcrypt"]
    I --> J["INSERT en usuarios"]
    J --> K{"¿rol = padre?"}
    K -- No --> L["201: cuenta creada"]
    K -- Sí --> M["Crea/vincula cuenta 'estudiante' password = documento del hijo"]
    M --> N["Crea/vincula fila en estudiantes grupo = 'Sin asignar'"]
    N --> L
    H --> O(["Fin"])
    L --> P(["Usuario puede iniciar sesión de inmediato"])
```    

## 2. Inicio de sesión

```mermaid
flowchart TD
    A([Usuario abre Login]) --> B[Ingresa email + contraseña]
    B --> C[POST /api/auth/login]
    C --> D[Backend busca todas las cuentas<br/>con ese email]
    D --> E{¿Existe al menos<br/>una cuenta?}
    E -- No --> F[401: 'Credenciales incorrectas']
    E -- Sí --> G[Compara contraseña contra<br/>cada cuenta encontrada]
    G --> H{¿Alguna coincide?}
    H -- No --> F
    H -- Sí --> I[Genera JWT con id, email, rol<br/>válido 7 días]
    I --> J[200: token + datos de usuario]
    J --> K[Frontend guarda sesión<br/>en AuthContext]
    K --> L[Redirige según rol:<br/>admin / profesor / estudiante-padre]
    F --> M([Fin])
    L --> N([Fin])
```

---

## 3. Recuperación de contraseña

```mermaid
flowchart TD
    A([Usuario olvidó su contraseña]) --> B[Ingresa email + rol]
    B --> C[POST /api/auth/forgot-password]
    C --> D{¿Existe cuenta<br/>con ese email+rol?}
    D -- No --> E[200: mensaje genérico<br/>'si existe, se enviará un correo']
    D -- Sí --> F[Genera token aleatorio<br/>guarda solo su hash SHA-256<br/>expira en 1 hora]
    F --> E
    E --> G([Usuario recibe el mismo mensaje<br/>en ambos casos])
    G --> H[Usuario ingresa token + nueva contraseña]
    H --> I[POST /api/auth/reset-password]
    I --> J{¿Token válido<br/>y no expirado?}
    J -- No --> K[400: 'Token inválido o expirado']
    J -- Sí --> L[Hashea nueva contraseña con bcrypt<br/>limpia el token usado]
    L --> M[200: contraseña actualizada]
    K --> N([Fin])
    M --> O([Usuario inicia sesión con<br/>la nueva contraseña])
```

---

## 4. Registro de asistencia (regla de negocio RN-01)

```mermaid
flowchart TD
    A([Profesor abre su panel]) --> B[Selecciona grupo y fecha]
    B --> C[Sistema carga estudiantes del grupo]
    C --> D[Profesor marca estado por estudiante:<br/>Presente / Ausente / Justificado]
    D --> E[POST /api/asistencias por estudiante]
    E --> F{Middleware: ¿rol admin<br/>o profesor?}
    F -- No --> G[403: acceso denegado]
    F -- Sí --> H[INSERT en asistencias]
    H --> I{¿Ya existe registro<br/>estudiante+fecha?}
    I -- Sí --> J[MySQL rechaza: ER_DUP_ENTRY]
    J --> K[500: error genérico<br/>⚠️ no es mensaje amigable hoy]
    I -- No --> L[201: asistencia guardada]
    G --> M([Fin])
    K --> M
    L --> N([Frontend refleja el registro<br/>en la vista del grupo])
```

---

## 5. Consulta propia (padre/estudiante) — regla `ownerOrStaff`

```mermaid
flowchart TD
    A([Padre/Estudiante autenticado]) --> B[GET /api/estudiantes/:id]
    B --> C{Middleware ownerOrStaff:<br/>¿es admin o profesor?}
    C -- Sí --> F[Devuelve el registro solicitado]
    C -- No --> D{¿El id pedido es<br/>su propio estudiante_id?}
    D -- Sí --> F
    D -- No --> E[403: no puede ver<br/>datos de otro estudiante]
    F --> G([Frontend muestra perfil,<br/>notas, asistencia, pagos])
    E --> H([Fin])
```

> ⚠️ Nota honesta: esta protección `ownerOrStaff` solo está implementada en `GET /estudiantes/:id`. Las listas `GET /pagos`, `GET /asistencias` y `GET /notas` **no** tienen este filtro — solo exigen estar autenticado (ver `rf_por_capa.md`, deuda técnica #2).    

