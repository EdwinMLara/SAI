# Modelo de Nota de venta

## Objetivo

Guarda las ventas internas del negocio: cliente, partidas, importes y el **sello fiscal** del CFDI timbrado. La idea es que una nota viva en un solo documento, desde que es un borrador hasta que queda timbrada, y que sirva tanto para imprimir como para exportar a PDF.

**Archivo:** `src/models/SalesNote.model.ts` (colección `SalesNotes`)

## Campos del Modelo

- **reference**: Identificador funcional de la nota (texto legible, p. ej. `NV-20261026-1234`). Es **único** y obligatorio; se usa como filtro en consulta, edición y borrado.

- **date**: Fecha de la venta. Obligatoria; por defecto, la fecha de creación.

- **customer**: Datos del cliente.
  - **name**: Nombre o razón social. Obligatorio.
  - **rfc**: RFC del cliente. Opcional; se normaliza a mayúsculas.
  - **email**: Correo del cliente. Opcional; se normaliza a minúsculas.
  - **phone**: Teléfono. Opcional.
  - **address**: Dirección. Opcional.

- **products**: Arreglo de partidas. Cada partida contiene:
  - **type**: Tipo de partida. `enum` con valores `resale` (reventa), `new` (producto nuevo) o `service` (servicio). Por defecto `resale`.
  - **description**: Descripción del producto o servicio. Obligatoria.
  - **quantity**: Cantidad. Obligatoria, mayor o igual a `0`.
  - **purchasePrice**: Precio de compra. Sólo aplica a partidas de tipo `resale`; en los demás tipos el backend lo deja en `0`.
  - **unitPrice**: Precio unitario de venta. Obligatorio, mayor o igual a `0`.
  - **subtotal**: `quantity × unitPrice` (calculado por el backend).
  - **iva**: `subtotal × 0.16` (calculado por el backend).
  - **total**: `subtotal + iva` (calculado por el backend).

- **subtotal**: Suma de los subtotales de las partidas. Por defecto `0`.

- **iva**: Suma del IVA de las partidas. Por defecto `0`.

- **total**: Suma de subtotal e IVA. Por defecto `0`.

- **comments**: Comentarios u observaciones de la venta (opcional).

- **terms**: Términos y condiciones de la venta (opcional).

- **fiscalStamp**: Datos del CFDI timbrado. Mientras la nota es borrador, todos los campos permanecen en `null`.
  - **satStamp**: Sello digital del SAT (`SelloSAT`).
  - **issuerStamp**: Sello digital del emisor (`SelloCFD`).
  - **originalString**: Cadena original del timbre.
  - **stampedAt**: Fecha y hora de timbrado.
  - **qrString**: Cadena/URL para el código QR de verificación del SAT.

- **status**: Estado de la nota. `enum` con valores `draft` (borrador) o `stamped` (timbrada). Por defecto `draft`.

- **createdAt** / **updatedAt**: Marcas de tiempo generadas automáticamente (`timestamps: true`).

## Relaciones

No tiene relaciones: es una entidad independiente. El cliente y las partidas se guardan embebidos, así que la nota conserva los datos de la venta aunque después cambie el catálogo de productos o se elimine un usuario.

## Notas

- Los importes (`subtotal`, `iva`, `total` de la nota y de cada partida) los calcula el backend con `helpers.normalizeTotals`; el cliente los envía, pero el servidor los sobrescribe.
- La `reference` no puede modificarse mediante `PUT /api/sales-notes`; se elimina del body antes del `$set`.
- La edición de la nota no altera su `status`; el sello fiscal se gestiona con `PATCH /api/sales-notes/fiscal` o con la carga de XML.
- Si agregas o cambias un campo, actualiza también la interfaz del cliente (`client/src/core/interfaces/SalesNote.interfaces.ts`) y el formulario `SalesNoteForm`; si no, el payload se arma incompleto y el error aparece del lado del backend.
- El flujo completo se describe en [Notas de venta](../../workflows/sales-notes.md).
