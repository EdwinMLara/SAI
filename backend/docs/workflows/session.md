# Sesión, renovación y cierre de sesión

## Objetivo

Gestionar el ciclo de vida de la sesión del usuario: consultar su estado, renovar los tokens y cerrar la sesión.

## Endpoints

| Endpoint | Método | Controlador | Protección |
|---|---|---|---|
| `/api/auth/session` | GET | `Auth.sessionState` | `SessionChecker` |
| `/api/auth/refresh` | GET | `Auth.refreshToken` | Libre (prefijo `/api/auth/`) |
| `/api/auth/logout` | POST | `Auth.logout` | Libre (prefijo `/api/auth/`) |

Controlador: `src/controllers/Auth.controller.ts`.

## Estado de sesión — `GET /api/auth/session`

El middleware `SessionChecker` no rechaza la petición: analiza ambas cookies y adjunta `req.tokenStatus` (`hasValidAccess`, `hasValidRefresh`). La respuesta indica:

- **`isAuthenticated`**: `true` si hay un `accessToken` válido con usuario identificable.
- **`user`**: datos públicos del usuario o `null`.
- **`access` / `refresh`**: validez de cada token.

Este endpoint permite al cliente decidir si redirigir al login o restaurar la sesión.

## Renovación — `GET /api/auth/refresh`

1. Lee la cookie `refreshToken`.
2. Verifica su firma y vigencia (`Auth.services.refreshUserTokens`). Si es inválida, responde `401`.
3. Extrae el `id` del payload y carga el usuario desde MongoDB.
4. Vuelve a emitir `accessToken` y `refreshToken` (rotación de ambos).
5. Responde `200` con `user`, `isAuthenticated: true`.

En el cliente, el interceptor de Axios invoca este endpoint automáticamente cuando una petición responde `401` con `refresh: true`, y reenvía las peticiones en cola tras la renovación.

## Cierre — `POST /api/auth/logout`

Elimina ambas cookies (`accessToken` y `refreshToken`) estableciendo su expiración en el pasado y responde `200`.

## Códigos de respuesta comunes

- **401**: sin cookies, `refreshToken` inválido o expirado.
- **401 con `access: false, refresh: true`**: el `accessToken` expiró pero el `refreshToken` sigue vigente → el cliente debe llamar `/auth/refresh`.
