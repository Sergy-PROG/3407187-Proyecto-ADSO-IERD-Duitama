# 📋 Documentación Técnica - IERD Duitama

## Proyecto: Escuela Deportiva IERD - Sistema de Gestión

---

## 1. Stack del Proyecto

| Capa | Tecnología elegida | Versión |
|------|-------------------|---------|
| **Backend** | Node.js + Express | Node: v18+, Express: 4.x |
| **Frontend** | React + Vite | React: 18.2.0, Vite: 4.5.0 |
| **Base de datos** | JSON Server (desarrollo) | 1.0.0-beta.15 |
| **Contenedores** | Docker + Docker Compose (obligatorio, sin alternativa) | — |
| **Estilos** | Tailwind CSS | 3.3.5 |
| **Animaciones** | Framer Motion | 10.16.4 |
| **Iconos** | Iconify (lucide) | 4.1.0 |
| **HTTP Client** | Fetch API (nativo) | — |

---

## 2. Idioma

| Elemento | Idioma |
|----------|--------|
| Nomenclatura técnica (variables, funciones, clases, tablas, ramas, commits) | Inglés |
| Comentarios y documentación | Español |

**Ejemplo:**
```javascript
// Calcula el promedio general del estudiante en el período actual
const calculateStudentAverage = (studentId) => {
  // Obtiene todas las notas del estudiante
  const notas = getNotasByEstudiante(studentId);
  // ...
}
```

---

## 3. Reglas de Nombrado

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Variables | `camelCase` | `userEmail`, `studentName`, `totalPagos` |
| Funciones / métodos | `camelCase` | `getActiveUsers()`, `updateStudent()` |
| Componentes React | `PascalCase` | `StudentProgressCard`, `AchievementBadge` |
| Hooks React | `use + PascalCase` | `useAuth`, `useData` |
| Constantes | `UPPER_SNAKE_CASE` | `API_URL`, `MAX_LOGIN_ATTEMPTS` |
| Archivos de componente | `PascalCase.jsx` | `UserProfileCard.jsx` |
| Archivos utilitarios | `camelCase.js` | `formatDate.js`, `helpers.js` |
| Archivos de contexto | `PascalCase.jsx` | `AuthContext.jsx`, `DataContext.jsx` |
| Tablas (BD) | `snake_case`, plural | `usuarios`, `estudiantes`, `asistencias` |
| Campos (BD) | `snake_case` | `created_at`, `estudiante_id`, `is_active` |
| Llave primaria | `id` | `id` |
| Llave foránea | `<tabla_singular>_id` | `estudiante_id`, `grupo_id` |

---

## 4. Estructura del Proyecto

```
escuelaIERD/
├── backend/                          # Backend API
│   ├── config/
│   │   └── database.cjs              # Conexión a BD
│   ├── controllers/                  # Controladores
│   │   ├── authController.cjs
│   │   ├── estudianteController.cjs
│   │   ├── profesorController.cjs
│   │   ├── pagoController.cjs
│   │   ├── asistenciaController.cjs
│   │   └── notaController.cjs
│   ├── middleware/
│   │   └── auth.cjs                  # Middleware de autenticación
│   ├── routes/                       # Rutas de la API
│   │   ├── authRoutes.cjs
│   │   ├── estudianteRoutes.cjs
│   │   ├── profesorRoutes.cjs
│   │   ├── pagoRoutes.cjs
│   │   ├── asistenciaRoutes.cjs
│   │   └── notaRoutes.cjs
│   ├── .env                          # Variables de entorno
│   ├── database.sql                  # Script de BD (MySQL)
│   └── server.cjs                    # Servidor principal
├── src/                              # Frontend React
│   ├── assets/                       # Imágenes estáticas
│   ├── components/                   # Componentes reutilizables
│   │   ├── common/                   # Componentes comunes
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProfileModal.jsx
│   │   │   └── Animations.jsx
│   │   └── layout/                   # Componentes de layout
│   ├── context/                      # Contextos de React
│   │   ├── AuthContext.jsx           # Autenticación
│   │   └── DataContext.jsx           # Datos globales
│   ├── pages/                        # Páginas
│   │   ├── Home/                     # Página principal
│   │   │   ├── Home.jsx
│   │   │   └── sections/
│   │   ├── Login/                    # Login
│   │   │   └── Login.jsx
│   │   ├── Admin/                    # Panel Administrador
│   │   │   ├── Admin.jsx
│   │   │   └── components/
│   │   │       ├── StatsCard.jsx
│   │   │       ├── RecentActivity.jsx
│   │   │       └── ProgressBar.jsx
│   │   ├── Profesor/                 # Panel Profesor
│   │   │   ├── Profesor.jsx
│   │   │   └── components/
│   │   │       ├── StudentProgressCard.jsx
│   │   │       └── AchievementBadge.jsx
│   │   └── Estudiante/               # Panel Estudiante
│   │       ├── Estudiante.jsx
│   │       └── components/
│   │           ├── GoalCard.jsx
│   │           └── StudentStats.jsx
│   ├── services/                     # Servicios de API
│   │   └── api.js
│   ├── hooks/                        # Custom hooks
│   ├── utils/                        # Utilidades
│   ├── App.jsx                       # Componente principal
│   ├── App.css                       # Estilos globales
│   ├── main.jsx                      # Punto de entrada
│   └── index.css                     # Configuración de Tailwind
├── .gitignore
├── db.json                           # Base de datos JSON
├── index.html
├── package.json
├── package-lock.json
├── tailwind.config.js                # Configuración de Tailwind
├── postcss.config.js                 # Configuración de PostCSS
└── vite.config.js                    # Configuración de Vite
```

---

## 5. Indentación y Formato

| Stack | Indentación | Line length | Formatter |
|-------|-------------|-------------|-----------|
| **JavaScript/React** | 2 espacios | 100 | Prettier |
| **CSS/Tailwind** | 2 espacios | 100 | Prettier |
| **JSON** | 2 espacios | — | Prettier |

---

## 6. Convenciones de Código

### 6.1 Componentes React

```jsx
// ✅ Correcto
export default function StudentProgressCard({ student }) {
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    // ...
  };

  return (
    <div className="bg-white rounded-2xl p-5">
      {/* Contenido */}
    </div>
  );
}

// ❌ Incorrecto
export default function StudentProgressCard({ student }) {
  return <div>...</div>; // Sin lógica organizada
}
```

### 6.2 Hooks

```jsx
// ✅ Correcto - Orden consistente de hooks
const { user } = useAuth();
const { data, loading } = useData();
const [activeTab, setActiveTab] = useState('inicio');
const [showModal, setShowModal] = useState(false);
```

### 6.3 API Llamadas

```javascript
// ✅ Correcto - Manejo de errores consistente
export const api = {
  async getEstudiantes() {
    try {
      const res = await fetch(`${API_URL}/estudiantes`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error en getEstudiantes:', error);
      return [];
    }
  }
};
```

---

## 7. Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/register` | Registrar usuario |
| GET | `/api/auth/profile` | Obtener perfil |
| PUT | `/api/auth/profile` | Actualizar perfil |
| GET | `/api/estudiantes` | Listar estudiantes |
| POST | `/api/estudiantes` | Crear estudiante |
| PUT | `/api/estudiantes/:id` | Actualizar estudiante |
| DELETE | `/api/estudiantes/:id` | Eliminar estudiante |
| GET | `/api/profesores` | Listar profesores |
| POST | `/api/profesores` | Crear profesor |
| PUT | `/api/profesores/:id` | Actualizar profesor |
| DELETE | `/api/profesores/:id` | Eliminar profesor |
| GET | `/api/pagos` | Listar pagos |
| POST | `/api/pagos` | Crear pago |
| PUT | `/api/pagos/:id` | Actualizar pago |
| DELETE | `/api/pagos/:id` | Eliminar pago |
| GET | `/api/asistencias` | Listar asistencias |
| POST | `/api/asistencias` | Crear asistencia |
| PUT | `/api/asistencias/:id` | Actualizar asistencia |
| DELETE | `/api/asistencias/:id` | Eliminar asistencia |
| GET | `/api/notas` | Listar notas |
| POST | `/api/notas` | Crear nota |
| PUT | `/api/notas/:id` | Actualizar nota |
| DELETE | `/api/notas/:id` | Eliminar nota |

---

## 8. Modelos de Datos

### 8.1 Usuario (usuarios)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | integer | Llave primaria |
| nombre | string | Nombre completo |
| email | string | Correo electrónico (único) |
| password | string | Contraseña encriptada |
| rol | enum | admin, profesor, estudiante, padre |
| apodo | string | Apodo opcional |
| telefono | string | Teléfono de contacto |
| cumpleanos | date | Fecha de nacimiento |
| foto | string | URL de la foto de perfil |
| hijo | string | Hijo (solo para padres) |
| parentesco | string | Parentesco (solo para padres) |

### 8.2 Estudiante (estudiantes)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | integer | Llave primaria |
| nombre | string | Nombre completo |
| documento | string | Documento de identidad |
| grupo | enum | Infantil, Prejuvenil, Juvenil, Femenino |
| acudiente | string | Nombre del acudiente |
| estado | enum | Activo, Inactivo |
| foto | string | URL de la foto |
| logros | array | Lista de logros obtenidos |

### 8.3 Profesor (profesores)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | integer | Llave primaria |
| nombre | string | Nombre completo |
| email | string | Correo electrónico |
| especialidad | string | Especialidad del profesor |
| foto | string | URL de la foto |

### 8.4 Pago (pagos)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | integer | Llave primaria |
| estudiante_id | integer | FK a estudiantes |
| concepto | string | Concepto del pago |
| monto | decimal | Monto del pago |
| estado | enum | Pagado, Pendiente |
| fecha | date | Fecha del pago |

### 8.5 Asistencia (asistencias)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | integer | Llave primaria |
| estudiante_id | integer | FK a estudiantes |
| fecha | date | Fecha de la asistencia |
| estado | enum | Presente, Ausente, Justificado |
| grupo | enum | Infantil, Prejuvenil, Juvenil, Femenino |

### 8.6 Nota (notas)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | integer | Llave primaria |
| estudiante_id | integer | FK a estudiantes |
| fecha | date | Fecha de la evaluación |
| tecnica | decimal | Nota técnica (1-5) |
| tactica | decimal | Nota táctica (1-5) |
| actitud | decimal | Nota de actitud (1-5) |
| grupo | enum | Infantil, Prejuvenil, Juvenil, Femenino |

---

## 9. Roles y Permisos

| Rol | Permisos |
|-----|----------|
| **Admin** | CRUD completo de estudiantes, profesores, pagos, usuarios, asistencias, notas |
| **Profesor** | CRUD de estudiantes, asistencias, notas; gestión de logros |
| **Estudiante** | Visualización de su perfil, notas, asistencia, horario, metas |
| **Padre** | Visualización del perfil de su hijo/a, notas, asistencia |

---

## 10. Convenciones de Git

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Ramas | `feature/nombre-slug` | `feature/login-imagenes` |
| Commits | `feat: descripción` | `feat: agregar login con imágenes por rol` |

**Tipos de commits:**
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Documentación
- `style:` Estilos (formato, semicolon, etc.)
- `refactor:` Refactorización de código
- `test:` Tests
- `chore:` Mantenimiento

---

## 11. Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor backend | `5000` |
| `DB_HOST` | Host de la base de datos | `localhost` |
| `DB_USER` | Usuario de la base de datos | `root` |
| `DB_PASSWORD` | Contraseña de la base de datos | `""` |
| `DB_NAME` | Nombre de la base de datos | `escuela_ierd` |
| `JWT_SECRET` | Secreto para JWT | `tu_secreto_jwt_muy_seguro` |
| `VITE_API_URL` | URL de la API (frontend) | `http://localhost:5000/api` |

---

## 12. Scripts de NPM

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el frontend en modo desarrollo |
| `npm run build` | Construye el proyecto para producción |
| `npm run preview` | Vista previa de la versión construida |
| `npm run server` | Inicia el backend (JSON Server) |
| `npm run server-dev` | Inicia el backend con nodemon (MySQL) |
| `npm start` | Inicia backend + frontend concurrentemente |

---

## 13. Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | `admin@ierdduitama.com` | `admin123` |
| Profesor | `profesor@ierdduitama.com` | `profe123` |
| Estudiante | `santiago@iestudiante.com` | `1123456789` |
| Padre | `laura@correo.com` | `1123456789` |

---

## 14. Documentación del Código

### Cabecera de archivo (ejemplo)

```javascript
/**
 * Módulo: Profesor.jsx
 * Qué: Panel de gestión para profesores
 * Para qué: Permite a los profesores gestionar estudiantes, asistencias, notas y logros
 * Impacto: Si falla, los profesores no pueden gestionar su información académica
 */
```

### Comentarios de funciones

```javascript
/**
 * Calcula el promedio de un estudiante en base a sus notas
 * @param {number} estudianteId - ID del estudiante
 * @returns {number} - Promedio redondeado a 1 decimal
 */
const getPromedioByEstudiante = (estudianteId) => {
  // ...
};
```

---

**Documentación generada por:**
- Proyecto: Escuela Deportiva IERD Duitama
- Fecha: 2025
- Tecnologías: React, Node.js, Express, MySQL, JSON Server, Tailwind CSS
