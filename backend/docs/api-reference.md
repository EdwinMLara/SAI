# Referencia de la API

## Convención general

- **Prefijo base:** todas las rutas se montan bajo `/api` (`src/routes/api.routes.ts`).
- **Formato de respuesta:** el `ResponseMiddleware` envuelve toda respuesta en la estructura `{ status, data }`, donde `data` contiene `message` y los campos adicionales.
- **Errores:** el `ErrorMiddleware` responde `{ status, data: { message } }` con el código HTTP correspondiente.
- **Autenticación:** cookies HTTPOnly (`accessToken` / `refreshToken`), salvo las rutas bajo `/api/auth/` que están exentas del middleware `Identity`.

## Endpoints

### Autenticación — `/api/auth`

| Método | Ruta | Descripción | Protección |
|---|---|---|---|
| POST | `/auth/register` | Registro con invitación previa | Libre |
| POST | `/auth/login` | Inicio de sesión | Libre |
| GET | `/auth/refresh` | Renueva ambos tokens | Libre |
| POST | `/auth/logout` | Cierra la sesión | Libre |
| GET | `/auth/session` | Estado de la sesión | `SessionChecker` |
| POST | `/auth/forgot-password` | Envía correo de restablecimiento | Libre |
| POST | `/auth/reset-password` | Restablece con token | Libre |

### Administración — `/api/admin` (rol `admin`)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/admin/invites` | Crea una invitación |
| GET | `/admin/invites` | Lista invitaciones del admin |
| DELETE | `/admin/invites` | Elimina invitación por `email` |

### Facturas — `/api/invoices`

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/invoices/upload` | Alta desde XML CFDI (`multipart/form-data`) |
| GET | `/invoices/list` | Lista paginada (`page`, `limit`, `month`) |
| POST | `/invoices` | Alta manual |
| GET | `/invoices?id=` | Consulta por `invoiceId` |
| PUT | `/invoices` | Actualiza por `invoiceId` |
| DELETE | `/invoices?id=` | Elimina por `invoiceId` |

### Notas de venta — `/api/sales-notes`

| Método | Ruta | Descripción | Protección |
|---|---|---|---|
| GET | `/sales-notes/list` | Lista paginada (`page`, `limit`) | `Identity` |
| GET | `/sales-notes?reference=` | Consulta por `reference` | `Identity` |
| POST | `/sales-notes` | Alta de nota (borrador o timbrada) | `Identity` |
| PUT | `/sales-notes` | Actualiza por `reference` | `Identity` |
| DELETE | `/sales-notes?reference=` | Elimina por `reference` | `Identity` |
| PATCH | `/sales-notes/fiscal` | Captura manual del sello fiscal | `Identity` |
| POST | `/sales-notes/fiscal/xml/parse` | Extrae el sello de un XML (`multipart/form-data`) | `Identity` + Multer |
| POST | `/sales-notes/fiscal/xml` | Guarda el sello extraído de un XML (`reference` + `file`) | `Identity` + Multer |

> El detalle del flujo, el cálculo de importes y la extracción del sello fiscal están en [Notas de venta](./workflows/sales-notes.md).

### Productos — `/api/products`

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/products/replaceAll` | Reemplazo completo del catálogo |
| GET | `/products/lastUpdate` | Fecha de la última carga masiva |
| GET | `/products?key=` | Consulta por `key` |
| POST | `/products` | Alta unitaria |
| DELETE | `/products?key=` | Baja unitaria |

### Documentos y tickets

| Método | Ruta | Descripción |
|---|---|---|
| POST/GET/PUT/DELETE | `/documents?invoiceId=` | CRUD del PDF de la factura (Supabase) |
| POST/GET/PUT/DELETE | `/tickets?ticketId=` | CRUD del ticket/comprobante (Supabase) |

### Usuarios — `/api/user`

| Método | Ruta | Descripción | Protección |
|---|---|---|---|
| GET | `/user/list` | Lista de usuarios | `Identity` + `Authorize('admin')` |
| PUT | `/user` | Actualiza datos (renueva cookie) | `Identity` |
| POST | `/user/change-password` | Cambio de contraseña | `Identity` |

## Middlewares por ruta

| Middleware | Rol |
|---|---|
| `Identity` | Valida el par de cookies; exento bajo `/api/auth/`. Si el access expiró pero el refresh es válido, responde `401` con `refresh: true`. |
| `SessionChecker` | Analiza los tokens sin rechazar la petición (usado sólo en `/auth/session`). |
| `Authorize(...roles)` | Verifica `req.user.role` contra los roles permitidos; `403` si no coincide. |
| `FileFilter` (Multer) | Valida tipo y tamaño (5 MB) de `multipart/form-data`. |

## Documentación relacionada

- Flujos: [registro](./workflows/register.md), [login](./workflows/login.md), [sesión](./workflows/session.md), [recuperación de contraseña](./workflows/password-recovery.md), [invitaciones](./workflows/invites.md), [usuarios](./workflows/users.md), [facturas](./workflows/invoice-upload.md), [notas de venta](./workflows/sales-notes.md), [productos](./workflows/product-replace.md), [archivos](./workflows/files.md).
- Arquitectura: [middlewares y pipeline](./architecture.md).
- Logging: [Sistema de Logging](./Logging.md).
