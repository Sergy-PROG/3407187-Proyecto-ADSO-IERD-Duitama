# Solución: Login no funcionaba (Escuela IERD)

## Problemas encontrados

1. **`api.js` con URL hardcodeada**: `API_URL = 'http://localhost:5001'` (puerto de `json-server`, mock viejo). No leía `VITE_API_URL`, así que los cambios en esa variable no tenían efecto.

2. **Endpoint de login incorrecto**: `AuthContext.jsx` llamaba a `api.getUsuarioByEmail(email)` → `GET /usuarios?email=...` (estilo `json-server`). El backend real (Express) no tiene esa ruta; el login es `POST /api/auth/login`.

3. **Comparación de password en texto plano**: el frontend hacía `usuario.password === password`, pero el backend guarda contraseñas hasheadas con `bcrypt`. Nunca podía coincidir.

4. **Build de Docker no reflejaba cambios**: el hash del bundle (`index-XXXX.js`) no cambiaba entre builds → causado por no reconstruir con `--no-cache` tras editar código, o por caché del navegador.

5. **Nginx sin `try_files`**: al recargar una ruta de React Router (ej. `/login`), Nginx devolvía 404 porque buscaba un archivo físico con ese nombre en vez de servir `index.html`.

6. **`updateProfile` del backend no devolvía el usuario actualizado**, solo un mensaje de éxito.

7. **Usuarios de prueba inexistentes**: la base de datos solo tenía un usuario (`admin@test.com`, password desconocida). No había usuarios con rol `estudiante`, `profesor` ni `padre`.

## Soluciones aplicadas

### `src/services/api.js`
- URL corregida: `const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';`
- Se agregaron métodos `login()`, `register()`, `getProfile()`, `updateProfile()` que consumen `/api/auth/*` con el token JWT en el header `Authorization`.

### `src/context/AuthContext.jsx`
- `login()` ahora usa `api.login(email, password)`, guarda el `token` devuelto (junto con la sesión) en `localStorage`/`sessionStorage`.
- `register()` y `updateProfile()` adaptados a los nuevos métodos de `api.js`.
- `logout()` también limpia el token guardado.

### `backend/controllers/authController.cjs`
- `updateProfile` ahora vuelve a consultar el usuario tras el `UPDATE` y devuelve `{ success, user }`.

### Docker / Nginx
- Se creó `nginx.conf` con:
  ```nginx
  location / {
      try_files $uri $uri/ /index.html;
  }
  ```
- `Dockerfile` del frontend actualizado para copiarlo: `COPY nginx.conf /etc/nginx/conf.d/default.conf`.
- Rebuild sin caché tras cada cambio: `docker compose build --no-cache frontend`.

### Usuarios de prueba
Creados vía `POST /api/auth/register` (hashea password automáticamente):

| Rol | Email | Password |
|---|---|---|
| Admin | `admin@ierdduitama.com` | `TuPasswordSegura123` |
| Estudiante | `estudiante@ierdduitama.com` | `Estudiante123` |
| Profesor | `profesor@ierdduitama.com` | `Profesor123` |
| Padre | `padre@ierdduitama.com` | `Padre123` |

## Pendientes / recomendaciones
- Confirmar si `getUsuarioByEmail` (endpoint `/usuarios?email=`) se sigue usando en otro lugar de la app; si no, se puede eliminar.
- Guardar las credenciales de prueba en un archivo local (ej. `CREDENCIALES_PRUEBA.md`, agregado a `.gitignore`) para no perderlas.
- Verificar `nombre`, `apodo`, `telefono`, etc. se envían completos en el formulario de edición de perfil, para que el `UPDATE` en `authController.cjs` no sobrescriba campos con `NULL`.
- Revisar el resto de la app (Admin, Estudiante, Profesor, rutas anidadas) tras el salto de versión mayor de `vite@8` / `react-router-dom@7`, aunque `npm audit` ya reporta 0 vulnerabilidades en frontend y backend.
