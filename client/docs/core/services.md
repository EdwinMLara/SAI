# Servicios y comunicación con la API

## Objetivo

Cómo se habla con el backend desde el cliente: configuración de Axios, forma de las respuestas y qué función cubre cada endpoint. Si sólo necesitas saber a qué llamar, salta al [catálogo](#catálogo-de-servicios).

## Configuración global de Axios

Archivo: `src/core/config/axios.config.ts` (se importa por efecto secundario en `main.tsx`).

- **`baseURL: '/api'`**: todas las llamadas son relativas (p. ej. `axios.get('/invoices/list')` llama a `/api/invoices/list`).
- **`withCredentials: true`**: envía y recibe las cookies `accessToken` / `refreshToken`.
- **`timeout: 300000`** (5 min): pensado para operaciones pesadas, como el reemplazo masivo de productos.
- En desarrollo, el proxy de `vite.config.ts` redirige `/api` al backend indicado por `VITE_API_HOST` / `VITE_API_PORT` (también con timeout de 5 min).

## Forma de las respuestas

El backend envuelve **todas** las respuestas en `{ status, data }`. El interceptor de respuesta del cliente las reescribe a una forma más cómoda:

```json
{ "status": 200, "message": "...", "all": { ... } }
```

- **`status`**: código de estado.
- **`message`**: `data.message`, o el `message` raíz si existe.
- **`all`**: el contenido útil (`data`), donde viven los campos del módulo (`invoice`, `note`, `invoices`, `users`, etc.).

Por eso los servicios leen `response.data.all?.<campo>` y devuelven objetos ya normalizados.

### Manejo de errores

Aquí hay una trampa común: el interceptor de errores **no rechaza** la promesa. Devuelve una respuesta con `status`, `message` y `all` a partir del cuerpo del error. En la práctica, un `try/catch` normal no atrapa un `400` o `404`; hay que revisar `response.status`.

> Excepción: los servicios de notas de venta y la carga de XML de facturas llaman a `ensureOk` y sí lanzan un `Error` cuando `status >= 400`, para que las páginas muestren el mensaje con `Message`. Si escribes un servicio nuevo, decide desde el inicio cuál de los dos comportamientos quieres y sé consistente.

## Renovación automática de sesión

Cuando el backend responde `401` con `{ access: false, refresh: true }` (access expirado pero refresh vigente), el interceptor:

1. Marca la petición como reintentada (`_retry`).
2. Llama a `GET /auth/refresh`.
3. Reintenta la petición original y libera la cola de peticiones en espera.
4. Si el refresh falla, emite el evento `auth:logout`; `AuthProvider` limpia la sesión y redirige a `/auth/login`.

Como respaldo, el hook `src/hooks/useTokenRefresh.ts` consulta `GET /auth/session` cada 5 minutos y refresca o cierra la sesión según corresponda.

## Catálogo de servicios

Todos los servicios viven en `src/core/services/` y usan los tipos de `src/core/interfaces/`.

### `Auth.services.ts`

| Función | Endpoint |
|---|---|
| `login(user)` | `POST /auth/login` |
| `register(user)` | `POST /auth/register` |
| `session()` | `GET /auth/session` |
| `refresh()` | `GET /auth/refresh` |
| `logout()` | `POST /auth/logout` |
| `forgotPassword(user)` | `POST /auth/forgot-password` |
| `resetPassword(data)` | `POST /auth/reset-password` |
| `changePassword(data)` | `POST /user/change-password` |

### `Invoices.services.ts`

| Función | Endpoint |
|---|---|
| `getAllInvoices({ page, limit, month })` | `GET /invoices/list` |
| `getInvoicesByMonth(month)` | `GET /invoices/by-month` |
| `uploadXML(file)` | `POST /invoices/upload` (`multipart/form-data`) |
| `getInvoice(invoiceId)` | `GET /invoices?id=` |
| `updateInvoice(invoice)` | `PUT /invoices` |
| `deleteInvoice(invoiceId)` | `DELETE /invoices?id=` |

### `SalesNotes.services.ts`

| Función | Endpoint |
|---|---|
| `getAllSalesNotes({ page, limit })` | `GET /sales-notes/list` |
| `getSalesNote(reference)` | `GET /sales-notes?reference=` |
| `createSalesNote(note)` | `POST /sales-notes` |
| `updateFiscalStamp(data)` | `PATCH /sales-notes/fiscal` |
| `parseFiscalStampXml(file)` | `POST /sales-notes/fiscal/xml/parse` (`multipart/form-data`) |
| `uploadFiscalStampXml(reference, file)` | `POST /sales-notes/fiscal/xml` (`multipart/form-data`) |
| `deleteSalesNote(reference)` | `DELETE /sales-notes?reference=` |

### `Products.services.ts`

| Función | Endpoint |
|---|---|
| `getProduct(query)` | `GET /products` |
| `replaceAllProducts(products)` | `POST /products/replaceAll` |
| `getLastUpdate()` | `GET /products/lastUpdate` |

### `Users.services.ts`

| Función | Endpoint |
|---|---|
| `getAllUsers()` | `GET /user/list` (sólo `admin`) |

### `Invites.services.ts`

| Función | Endpoint |
|---|---|
| `createInvite(email, role)` | `POST /admin/invites` |
| `getInvites()` | `GET /admin/invites` |
| `deleteInvite(email)` | `DELETE /admin/invites` |

## Convenciones y detalles

- Un servicio por módulo, con funciones `async` que devuelven un objeto plano `{ status, message, ...datos }`.
- Los tipos de entrada/salida van en `src/core/interfaces/`.
- Las vistas no llaman a Axios directamente; siempre pasan por un servicio. Si te encuentras un `axios` suelto en un componente, es deuda técnica.
- Los identificadores viajan por `query` (`?id=`, `?reference=`), no en la ruta. Es fácil equivocarse al agregar un endpoint nuevo.
- `all` es el nombre que quedó para el contenido útil de la respuesta. No es bonito, pero está en todos los servicios; no lo cambies sólo en uno.

## Pendientes

- El backend expone `PUT /sales-notes`, pero el cliente todavía no tiene `updateSalesNote` ni pantalla de edición: hoy una nota se crea o se borra, pero no se modifica. Si se necesita editar, hay que agregar el servicio y una ruta tipo `/sales-notes/:reference/edit`.
- `Users.services.ts` sólo lista usuarios; no hay funciones para actualizar el perfil ni para cambiar contraseña, aunque el backend sí las tiene. El cambio de contraseña se hace desde `Auth.services.ts`.
- No hay tests de servicios ni mocks de Axios.

La API de referencia completa está en [backend/docs/api-reference.md](../../../backend/docs/api-reference.md).
