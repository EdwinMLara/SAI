# Sistema de Logging

## Objetivo

Explicar la configuración y el uso del registro de eventos del backend, tal como lo enlaza el `README.md` de esta carpeta.

## Componente

- **Utilidad:** `src/utils/Logger.utils.ts` (Winston).
- **Uso:** se importa `log({ level, message, metadata })` desde cualquier módulo.
- **Modelo de persistencia:** [Modelo de Logs](./datadase/models/logs.model.md) (`src/models/Logs.model.ts`).

## Niveles utilizados

- **`debug`**: eventos de arranque y operación del servidor (por ejemplo, `Express server on ...`).
- **`error`**: errores capturados por el middleware de errores.

## Comportamiento por entorno

La configuración cambia según la variable `NODE_ENV`:

### Desarrollo (`NODE_ENV` distinto de `production`)

- Transporte: **consola** (`winston.transports.Console`).
- Nivel: `debug`.
- Formato legible: `timestamp [level]: message`, y si el error tiene stack trace se imprime debajo.

### Producción (`NODE_ENV=production`)

- Transporte: **custom `MongoTransport`** que guarda cada log como un documento en la colección **`logs`** de MongoDB.
- Nivel: `info`.
- Formato: JSON con timestamp.
- Sólo se persisten logs que incluyan `metadata`; si `stackTrace` está vacío se guarda `'-'`.

## Metadatos

Interfaz `LogMetadata` (`src/interfaces/Logs.interfaces.ts`):

- **user**: nombre del usuario o `'Undefined'`.
- **clientIp**: IP del cliente.
- **stackTrace**: traza de la pila del error.
- **endpoint**: ruta de la petición.
- **method**: método HTTP.
- **statusCode**: código de estado de la respuesta.

## Punto principal de registro

El middleware de errores (`src/middlewares/Error.middleware.ts`) registra **todos** los errores que llegan a él antes de responder:

```ts
log({
  level: 'error',
  message: `${err.message} | ORIGINAL: ${originalError.message}`,
  metadata: {
    user: req.user?.name || 'Undefined',
    clientIp: req.ip,
    stackTrace: (originalError?.stack || err.stack),
    endpoint: req.path,
    method: req.method,
    statusCode: returnCode,
  },
});
```

## Buenas prácticas

- Registrar con `log()` en lugar de `console.log` para que los eventos queden centralizados.
- En producción, siempre adjuntar `metadata`: sin ella el log no se persiste en MongoDB.
- Los logs de negocio deben usar el nivel correspondiente y mensajes autoexplicativos en español.
