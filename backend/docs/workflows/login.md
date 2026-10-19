# Inicio de sesión

## Objetivo

Autenticar a un usuario con su correo y contraseña, y establecer la sesión mediante cookies HTTPOnly.

## Ruta

- **Endpoint:** `POST /api/auth/login`
- **Controlador:** `src/controllers/Auth.controller.ts` → `login`
- **Autenticación:** no requiere sesión (prefijo `/api/auth/` exento de `Identity`).

## Campos recibidos

- **email**: Correo electrónico (se normaliza a minúsculas).
- **password**: Contraseña en texto plano.

Si alguno de los dos campos falta, se responde `400`.

## Flujo

1. **Búsqueda del usuario** por correo (`User.services.getIdUser` → `getUserByObject`). Si no existe, se propaga el error correspondiente.
2. **Comparación de la contraseña** con bcrypt (`Auth.services.login` → `compareHash`). Si no coincide, se responde `401`.
3. **Emisión de sesión**: se generan y envían dos cookies HTTPOnly:
   - `accessToken`: 1 hora de vigencia, contiene `id`, `name`, `role` y `email`.
   - `refreshToken`: 15 días de vigencia, contiene únicamente `id`.
4. **Respuesta `200`** con un mensaje de éxito.

## Cookies emitidas

| Cookie | Vigencia | Contenido | Atributos |
|---|---|---|---|
| `accessToken` | 1 h | Payload del usuario | `httpOnly`, `sameSite: strict`, `secure` (solo producción), `path: /` |
| `refreshToken` | 15 d | `{ id }` | Ídem |

## Relación con otros flujos

- La sesión se valida con [estado de sesión](./session.md) y se renueva con `GET /api/auth/refresh`.
- El cliente renueva el `accessToken` automáticamente mediante el interceptor de Axios y el hook `useTokenRefresh`.
