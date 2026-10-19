# Archivos: documentos y tickets (Supabase Storage)

## Objetivo

Documentar el almacenamiento de archivos binarios (PDF de facturas y tickets/comprobantes) en **Supabase Storage**. Los dos módulos son simétricos: sólo cambian el bucket, el prefijo del nombre de archivo y el mensaje de respuesta.

## Endpoints

| Endpoint | Método | Controlador | Protección |
|---|---|---|---|
| `/api/documents?invoiceId=` | POST | `Document.uploadFile` | `Identity` + Multer |
| `/api/documents?invoiceId=` | GET | `Document.readDocumentURL` | `Identity` |
| `/api/documents?invoiceId=` | PUT | `Document.updateDocument` | `Identity` + Multer |
| `/api/documents?invoiceId=` | DELETE | `Document.deleteDocument` | `Identity` |
| `/api/tickets?ticketId=` | POST | `Ticket.uploadFile` | `Identity` + Multer |
| `/api/tickets?ticketId=` | GET | `Ticket.readTicketURL` | `Identity` |
| `/api/tickets?ticketId=` | PUT | `Ticket.updateTicket` | `Identity` + Multer |
| `/api/tickets?ticketId=` | DELETE | `Ticket.deleteTicket` | `Identity` |

## Convención de nombres

| Módulo | Bucket (variable de entorno) | Nombre del archivo |
|---|---|---|
| Documents | `BUCKET_DOCS` | `document_{invoiceId}.pdf` |
| Tickets | `BUCKET_TICKET` | `ticket_{ticketId}.pdf` |

El identificador (`invoiceId` / `ticketId`) se recibe como **query string**, no en el body.

## Recepción de archivos

- **Content-Type:** `multipart/form-data` con el campo `file`.
- **Límite:** 5 MB, almacenamiento en memoria (`memoryStorage`).
- **Filtro de tipos (Multer):** `.xml`, `application/xml`, `text/xml`, `application/pdf`, `image/jpeg`. Cualquier otro tipo responde `415`.
- Si no se envía archivo, responde `400`.

## Flujo por operación

### Subir — `POST`

1. Se construye el nombre del archivo y se verifica que **no** exista (`comprobeInexistence`).
2. Se sube a Supabase con `upsert: false` (no sobrescribe).
3. Se retorna la **URL pública** del archivo.

### Consultar — `GET`

1. Se verifica que el archivo exista (`comprobeExistence`; `404` en caso contrario).
2. Se retorna su URL pública (no descarga el contenido).

### Actualizar — `PUT`

1. Se verifica la existencia del archivo.
2. Se elimina el archivo anterior y se sube el nuevo (misma operación `delete` + `upload`).
3. Se retorna la nueva URL pública.

### Eliminar — `DELETE`

1. Se verifica la existencia del archivo.
2. Se elimina del bucket. Respuesta `200`.

## Configuración requerida

- `SUPA_URL` y `SUPA_KEY`: credenciales del proyecto Supabase (`src/config/supabase.ts`).
- `BUCKET_DOCS` / `BUCKET_TICKET`: nombres de los buckets, que deben existir y tener acceso público habilitado.

## Nota de integración

El campo `document` del [modelo de Factura](../datadase/models/invoice.model.md) guarda la URL del PDF; el módulo de documentos no actualiza ese campo automáticamente, la asociación la realiza el cliente.
