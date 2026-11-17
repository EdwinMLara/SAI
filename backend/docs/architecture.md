# Arquitectura del backend

## Objetivo

Describir el pipeline de peticiones, los middlewares transversales y las utilidades transversales compartidas por todos los módulos.

## Pipeline de una petición

Definido en `src/index.ts`:

```
Cliente
  → express.json / express.urlencoded (límite 50mb)
  → cookie-parser
  → CORS
  → RequestMiddleware
  → ResponseMiddleware
  → /api (rutas)
  → 404 handler
  → ErrorMiddleware
```

## Middlewares (`src/middlewares/`)

### Request.middleware.ts — validación de la petición

Se ejecuta **antes** de las rutas y decide si la petición es aceptable:

- Exemptos: `GET`, `DELETE` y `POST /logout` (pasan directo).
- `multipart/form-data` en rutas que contengan `/tickets`, `/documents`, `/invoices` o `/sales-notes` (los uploads).
- Para JSON: exige `Content-Type` y, en `POST`/`PUT`/`PATCH`, un body no vacío (`400` en caso contrario).
- Para `multipart` en otras rutas: exige que exista `req.file` (`400`).
- Cualquier otro `Content-Type`: `415`.

### Response.middleware.ts — envoltura de respuesta

Sobrescribe `res.json` para que **toda** respuesta tenga la forma:

```json
{ "status": <código HTTP>, "data": { "message": "...", ... } }
```

Los clientes deben leer siempre dentro de `data`.

### Auth.middleware.ts — protección

- **`Identity`**: lee `accessToken` y `refreshToken` de las cookies y valida el par.
  - Sin refresh válido → `401 { access: false, refresh: false }`.
  - Refresh válido pero access expirado → `401 { access: false, refresh: true }` (el interceptor del cliente renueva y reintenta).
  - Ambos válidos → adjunta `req.user` (`id`, `name`, `role`, `email`) y continúa.
  - Rutas bajo `/api/auth/` están exentas.
- **`SessionChecker`**: misma validación pero **nunca** rechaza; sólo adjunta `req.tokenStatus` (y `req.user` si el access es válido).
- **`Authorize(...roles)`**: compara `req.user.role` (case-insensitive) con los roles permitidos → `403` si no coincide.

### Error.middleware.ts — manejo de errores

- Determina el código: `err.statusCode` si es `AppError`, o `500`.
- **Registra el error** en el [sistema de Logging](./Logging.md) con metadatos (usuario, IP, stack, endpoint, método, status).
- Responde `{ status, data: { message } }`. Errores no clasificados usan el mensaje genérico `Error interno del servidor`.

### Multer.middleware.ts — subida de archivos

- Almacenamiento en memoria, límite de 5 MB.
- Acepta: `.xml`, XML por MIME type, `application/pdf` e `image/jpeg`; el resto rechaza con `415`.
- Exporta `requireFile`, que exige la presencia del campo `file` (`400` si falta).

## Utilidades transversales (`src/utils/`)

- **`AppError.ts`**: clase de error con `statusCode` y `originalError` opcional; es el contrato entre helpers/servicios y el middleware de errores.
- **`responses/`**: catálogo centralizado de mensajes (`System`, `User`, `Product`, `Invoice`, `SalesNote`, `Invite`, `Document`, `Ticket`, `Auth`). Los controladores nunca escriben mensajes "pelados": siempre referencian este catálogo, lo que unifica textos y facilita la localización.
- **`auth/crypt.ts`**: bcrypt con 10 rondas (`encrypt`, `compareHash`).
- **`auth/tokens.ts`**: generación/verificación de JWT — access (1 h), refresh (15 d), genérico (30 d) y reset (15 min), todos firmados con `JWT_SECRET`.
- **`cookies/`**: emisión y limpieza de cookies HTTPOnly + filtrado de datos públicos del usuario (nunca se retorna la contraseña).
- **`env.ts`**: carga y **validación obligatoria** de las 15 variables de entorno; el proceso falla al arrancar si falta alguna.
- **`Logger.utils.ts`**: ver [Sistema de Logging](./Logging.md).

## CORS

Configurado con `credentials: true` y un filtro de `origin` por regex que permite:

- `localhost`, `127.0.0.1` y `[::1]` con cualquier puerto.
- Redes privadas: `192.168.x.x`, `10.x.x.x` y `172.16–31.x.x`.

Cualquier otro origen es rechazado.

## Apagado elegante (graceful shutdown)

Al recibir `SIGTERM` o `SIGINT`:

1. Se deja de aceptar conexiones nuevas (`server.close`).
2. Se desconecta de MongoDB.
3. Si en 10 segundos no termina, se fuerza la salida con código `1`.

## Alias de rutas (tsconfig)

El backend importa con alias (`@controllers`, `@services`, `@helpers`, `@middlewares`, `@models`, `@utils`, `@responses`, `@auth`, `@config`, `@interfaces`, `@types`, `@routes`) en lugar de rutas relativas. Al añadir carpetas nuevas hay que registrar el alias en `tsconfig.json` y en los scripts de ejecución (`tsconfig-paths`).
