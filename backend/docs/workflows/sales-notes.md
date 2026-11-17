# Notas de venta: creación, gestión y sello fiscal

## Objetivo

Las notas de venta son el registro interno de una venta: cliente, partidas e importes. Se capturan a mano y pueden quedarse como **borrador** o llevar el **sello fiscal** de un CFDI ya timbrado. El sello se puede pegar a mano o sacar de un XML; aquí está el camino completo, de la captura al PDF.

## Endpoints

| Endpoint | Método | Controlador | Protección |
|---|---|---|---|
| `/api/sales-notes/list` | GET | `SalesNote.getAllSalesNotes` | `Identity` |
| `/api/sales-notes?reference=` | GET | `SalesNote.getSalesNote` | `Identity` |
| `/api/sales-notes` | POST | `SalesNote.createSalesNote` | `Identity` |
| `/api/sales-notes` | PUT | `SalesNote.updateSalesNote` | `Identity` |
| `/api/sales-notes?reference=` | DELETE | `SalesNote.deleteSalesNote` | `Identity` |
| `/api/sales-notes/fiscal` | PATCH | `SalesNote.updateFiscalStamp` | `Identity` |
| `/api/sales-notes/fiscal/xml/parse` | POST | `SalesNote.parseFiscalStampXml` | `Identity` + Multer |
| `/api/sales-notes/fiscal/xml` | POST | `SalesNote.uploadFiscalStampXml` | `Identity` + Multer |

Controlador: `src/controllers/SalesNote.controller.ts`.

> La **referencia** (`reference`) es el identificador funcional de la nota: es única y se usa como filtro en consulta, edición y borrado. No se recibe por `id`, sino por `query` (`GET`/`DELETE`) o dentro del body (`PUT`).

## Modelo de datos

El detalle campo por campo está en el [Modelo de Nota de venta](../datadase/models/salesnote.model.md). Para ubicarse rápido:

- **reference** (único): identificador legible de la nota (p. ej. `NV-20261026-1234`).
- **customer**: datos del cliente (`name` obligatorio; `rfc`, `email`, `phone`, `address` opcionales).
- **products[]**: partidas con `type` (`resale` | `new` | `service`), descripción, cantidad, precios e importes.
- **fiscalStamp**: sellos y cadenas del CFDI timbrado.
- **status**: `draft` o `stamped`.

## Cálculo de importes

Aquí hay una regla que conviene tener clara: el backend **no usa** los totales que manda el cliente. `helpers.normalizeTotals` vuelve a calcular todo. Suena redundante, pero evita diferencias cuando alguien manipula el payload o cuando el redondeo del navegador no coincide. Si algún día cambia la tasa de IVA, hazlo en los dos lados para que la vista previa no se desfase.

1. **Cantidad y precio unitario** se convierten a número (valores inválidos → `0`).
2. **Subtotal** = `cantidad × precio unitario` (redondeado a 2 decimales).
3. **IVA** = `subtotal × 0.16` (constante `IVA_RATE`).
4. **Total de la partida** = `subtotal + IVA`.
5. **`purchasePrice`** (precio de compra) sólo se conserva para partidas de tipo `resale`; en `new` y `service` se fuerza a `0`.
6. Los **totales de la nota** se obtienen sumando subtotal e IVA de todas las partidas.

> El mismo criterio (16% de IVA y redondeo a 2 decimales) se replica en el cliente (`layouts/SalesNotes/utils/calculations.ts`) para mostrar los importes en vivo mientras se captura.

## Crear — `POST /api/sales-notes`

### Campos recibidos

```json
{
  "reference": "NV-20261026-1234",
  "date": "2026-10-26T12:00:00.000Z",
  "customer": {
    "name": "Cliente de ejemplo",
    "rfc": "ABC010101AAA",
    "email": "cliente@correo.com",
    "phone": "555 555 5555",
    "address": "Calle, número, colonia, ciudad"
  },
  "products": [
    {
      "type": "resale",
      "description": "Producto de ejemplo",
      "quantity": 2,
      "purchasePrice": 80,
      "unitPrice": 120
    }
  ],
  "comments": "Observaciones de la venta",
  "terms": "Condiciones de pago y entrega",
  "fiscalStamp": {
    "satStamp": "...",
    "issuerStamp": "...",
    "originalString": "||1.1|...||",
    "stampedAt": "2026-10-26T12:00:00.000Z",
    "qrString": "https://verificacfdi.facturaelectronica.sat.gob.mx/?id=..."
  }
}
```

### Qué ocurre al guardar

1. **Validación mínima** (`helpers.validatePayload`): `reference`, `customer.name` y al menos una partida en `products`. En caso contrario, `400`.
2. **Unicidad** (`helpers.comprobeInexistence`): si ya existe una nota con esa `reference`, responde `409`.
3. **Normalización de importes** con `helpers.normalizeTotals`.
4. **Fecha**: si no se envía, se usa la fecha actual.
5. **Sello fiscal opcional**:
   - Si `fiscalStamp` trae algún dato (`helpers.hasAnyFiscalData`), se valida completo y la nota se guarda con `status: 'stamped'`.
   - Si no trae datos, se guarda con `status: 'draft'` y un `fiscalStamp` vacío.
6. **Persistencia** en la colección `SalesNotes`.
7. **Respuesta `201`** con la nota creada.

## Consulta paginada — `GET /api/sales-notes/list`

### Parámetros de query

| Parámetro | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `page` | número ≥ 1 | `1` | Página a consultar |
| `limit` | número ≥ 1 | `10` | Resultados por página |

Los resultados se ordenan por `date` descendente. La consulta y el conteo total se ejecutan en paralelo (`Promise.all`).

### Respuesta

```json
{
  "status": 200,
  "data": {
    "message": "...",
    "notes": [],
    "total": 42,
    "totalPages": 5,
    "page": 1,
    "limit": 10
  }
}
```

## Consulta por referencia — `GET /api/sales-notes?reference=`

- Si falta `reference`, responde `400`.
- Si la nota no existe, responde `404`.
- Retorna `{ message, note }`.

## Actualizar — `PUT /api/sales-notes`

Recibe el mismo payload que la creación, incluida la `reference` (que actúa como filtro).

1. Se validan los campos mínimos y se comprueba que la nota exista (`404` si no).
2. Se recalculan los importes.
3. Se eliminan del body `_id`, `__v`, `createdAt`, `updatedAt` y `reference` antes del `$set` (la referencia no se modifica).
4. Respuesta `200` con la nota actualizada.

> La edición **no** cambia el `status` ni el `fiscalStamp`; para eso existe el endpoint de sello fiscal.

## Sello fiscal

El sello fiscal reúne los datos del CFDI timbrado:

- **satStamp**: sello digital del SAT (`SelloSAT`).
- **issuerStamp**: sello digital del emisor (`SelloCFD`).
- **originalString**: cadena original del timbre.
- **stampedAt**: fecha de timbrado.
- **qrString**: cadena/URL para el código QR de verificación.

### Captura manual — `PATCH /api/sales-notes/fiscal`

**Campos recibidos:**

```json
{
  "reference": "NV-20261026-1234",
  "rfc": "ABC010101AAA",
  "fiscalStamp": {
    "satStamp": "...",
    "issuerStamp": "...",
    "originalString": "||1.1|...||",
    "stampedAt": "2026-10-26T12:00:00.000Z",
    "qrString": "https://verificacfdi.facturaelectronica.sat.gob.mx/?id=..."
  }
}
```

1. `helpers.validateFiscalStamp` exige los cinco datos del sello y una fecha válida (`400` en caso contrario).
2. Se verifica que la nota exista.
3. Se actualiza `customer.rfc` (si se envía), `fiscalStamp` y `status: 'stamped'`.
4. Respuesta `200` con la nota actualizada.

### Parseo de XML (sin guardar) — `POST /api/sales-notes/fiscal/xml/parse`

- **Content-Type:** `multipart/form-data` con el campo `file` (XML del CFDI).
- **Tamaño máximo:** 5 MB (memoria temporal).
- Extrae los datos del timbre y **no modifica** la nota. Sirve para previsualizar el sello antes de asociarlo.

### Carga de XML (guardar) — `POST /api/sales-notes/fiscal/xml`

- **Content-Type:** `multipart/form-data` con los campos `reference` y `file`.
- Verifica que la nota exista, parsea el XML y guarda directamente el sello con `status: 'stamped'`.
- Respuesta `200` con `{ message, note, fiscalStamp }`.

### Extracción desde el XML (`helpers/SalesNoteXML.helpers.ts`)

Con `fast-xml-parser` se localiza `Comprobante → Complemento → TimbreFiscalDigital` y se leen sus atributos:

| Dato | Origen en el XML |
|---|---|
| `uuid` | `@_UUID` |
| `satStamp` | `@_SelloSAT` |
| `issuerStamp` | `@_SelloCFD` |
| `stampedAt` | `@_FechaTimbrado` |
| `originalString` | Se construye como `\|\|version\|uuid\|fecha\|RfcProvCertif\|SelloCFD\|NoCertificadoSAT\|\|` |
| `qrString` | Se construye con la URL de verificación del SAT (`id`, `re`, `rr`, `tt`, `fe`) |
| `rfc` | RFC del `Receptor` |

Si el XML no contiene `Comprobante`, no tiene timbre o le faltan datos esenciales, responde `400` con un mensaje específico del catálogo `SalesNote.responses`.

## Eliminar — `DELETE /api/sales-notes?reference=`

- Si falta `reference`, responde `400`; si la nota no existe, `404`.
- Elimina el documento y responde `200`.

## Detalles que suelen causar dudas

- **`/fiscal/xml/parse` vs `/fiscal/xml`**: el primero sólo lee y devuelve el sello; el segundo lo guarda. Si estás probando el parseo, no esperes ver cambios en la nota.
- **La referencia no se puede editar**: en `PUT` se descarta del body. Si necesitas corregirla, hay que borrar y volver a crear la nota.
- **`PUT` no toca el sello**: cambiar el sello o pasar de borrador a timbrada es responsabilidad de `PATCH /fiscal` o de la carga de XML.
- **El cliente calcula, pero el servidor manda**: los importes que ves en pantalla se recalculan al guardar. Si algo no cuadra, revisa primero `normalizeTotals`.
- **Subida de XML**: el límite es de 5 MB y el archivo se procesa en memoria; no se escribe en disco.

## Errores que te vas a encontrar

- **400**: falta `reference`, `customer.name` o partidas; XML inválido o sello incompleto.
- **404**: la nota no existe.
- **409**: ya hay una nota con esa `reference`.

## Documentación relacionada

- [Modelo de Nota de venta](../datadase/models/salesnote.model.md)
- [Referencia de la API](../api-reference.md)
- [Modelado de la base de datos](../datadase/modelado.md)
