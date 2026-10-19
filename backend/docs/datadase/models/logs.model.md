# Modelo de Log

## Objetivo del modelo

El modelo de log persiste los eventos relevantes del sistema —en especial los errores— para su posterior auditoría y diagnóstico. Es la pieza de almacenamiento del [sistema de Logging](../../Logging.md); sólo se escriben documentos cuando `NODE_ENV=production`.

**Archivo:** `src/models/Logs.model.ts` (colección `logs`)

## Campos del Modelo

- **timestamp**: Fecha y hora en que se produjo el evento.

- **level**: Nivel del log (`debug`, `info`, `error`).

- **message**: Mensaje descriptivo del evento. En errores puede incluir el mensaje original concatenado (`... | ORIGINAL: ...`).

- **metadata**: Objeto con el contexto del evento (opcional a nivel de log, pero requerido si se define):
  - **user**: Nombre del usuario que originó la petición o `'Undefined'`.
  - **clientIp**: IP del cliente.
  - **stackTrace**: Traza de la pila del error; se guarda `'-'` si no existe.
  - **endpoint**: Ruta de la petición.
  - **method**: Método HTTP.
  - **statusCode**: Código de estado devuelto.

## Notas

- El subesquema de `metadata` está definido con `_id: false` para que Mongoose no genere identificadores internos.
- Los logs se insertan de forma asíncrona (`setImmediate`) para no bloquear el ciclo de respuesta de Express.
