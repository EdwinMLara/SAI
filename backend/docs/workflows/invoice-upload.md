# Facturas: carga de XML, consulta y gestión

## Objetivo

Documentar el ciclo de vida de las facturas: alta mediante archivos XML CFDI, alta manual, consulta paginada, consulta completa por mes (exportación a Excel), edición y borrado.

## Endpoints

| Endpoint | Método | Controlador | Protección |
|---|---|---|---|
| `/api/invoices/upload` | POST | `Invoice.uploadXML` | `Identity` + Multer |
| `/api/invoices/list` | GET | `Invoice.getAllInvoices` | `Identity` |
| `/api/invoices/by-month` | GET | `Invoice.getInvoicesByMonth` | `Identity` |
| `/api/invoices` | POST | `Invoice.createInvoice` | `Identity` |
| `/api/invoices?id=` | GET | `Invoice.getInvoice` | `Identity` |
| `/api/invoices` | PUT | `Invoice.updateInvoice` | `Identity` |
| `/api/invoices?id=` | DELETE | `Invoice.deleteInvoice` | `Identity` |

Controlador: `src/controllers/Invoice.controller.ts`.

## Carga de XML CFDI — `POST /api/invoices/upload`

### Recepción

- **Content-Type:** `multipart/form-data` con el campo `file`.
- **Tipos admitidos:** `.xml` (el filtro de Multer también acepta PDF y JPEG para otros módulos).
- **Tamaño máximo:** 5 MB (memoria temporal, no se escribe en disco).

### Parseo (`helpers/InvoiceXML.helpers.ts`)

Se usa `fast-xml-parser` para convertir el XML en un objeto y extraer:

- **invoiceId**: UUID del Timbre Fiscal Digital (`Complemento.TimbreFiscalDigital@UUID`).
- **reference**: `Serie-Folio` (o sólo `Folio` si no hay serie).
- **Emisor / Receptor**: RFC y nombre de ambas partes.
- **date**: fecha del comprobante; **expiration**: fecha + 30 días.
- **products[]**: cada `Concepto` se transforma en un producto con:
  - `key`: `NoIdentificacion` o `ClaveProdServ`, limpiando ceros a la izquierda.
  - `claveProdServ`, `claveUnidad`, `description`, `quantity`.
  - `prices.payment` = `ValorUnitario`; `iva` e `priceWithIva` calculados desde los `Traslados` con impuesto `002` (IVA 16%).

Si el XML no contiene el nodo `Comprobante`, se responde `400` con mensaje de formato inválido.

### Validación y persistencia

1. `helpers.comprobeInexistence(invoiceId)`: si la factura ya existe, responde `409`.
2. Se guarda el documento en MongoDB.
3. Respuesta `200` con la factura parseada.

## Consulta paginada — `GET /api/invoices/list`

### Parámetros de query

| Parámetro | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `page` | número ≥ 1 | `1` | Página a consultar |
| `limit` | número ≥ 1 | `5` | Resultados por página |
| `month` | `YYYY-MM` | — | Filtra facturas cuya `date` caiga en ese mes |

### Comportamiento

- El filtro por mes se traduce a un rango `date >= inicio del mes && date < inicio del siguiente`.
- Los resultados se ordenan por `date` descendente.
- Se ejecutan en paralelo la consulta, el conteo total y la agregación de totales por mes (`Promise.all`).
- `monthTotals` agrupa subtotal, IVA, total y conteo por mes (`YYYY-MM`).

### Respuesta

```json
{
  "status": 200,
  "data": {
    "message": "...",
    "invoices": [],
    "total": 42,
    "totalPages": 9,
    "page": 1,
    "limit": 5,
    "monthTotals": [
      { "month": "2026-01", "subtotal": 0, "iva": 0, "total": 0, "count": 0 }
    ]
  }
}
```

## Consulta completa por mes — `GET /api/invoices/by-month`

Devuelve **todas** las facturas de un mes sin paginar, ordenadas por `date` descendente. Se usa para exportar el mes completo sin depender de la página visible.

### Parámetros de query

| Parámetro | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `month` | `YYYY-MM` | — | Filtra facturas cuya `date` caiga en ese mes |

Si `month` no se envía (o no tiene el formato `YYYY-MM`), se devuelven todas las facturas.

### Respuesta

```json
{
  "status": 200,
  "data": {
    "message": "...",
    "invoices": []
  }
}
```

## Exportación a Excel (cliente)

El frontend agrega el botón **“Descargar facturas del mes”** al final de cada grupo mensual de la lista. Al pulsarlo:

1. `core/services/Invoices.services.ts` → `getInvoicesByMonth(month)` llama a `GET /api/invoices/by-month`.
2. `layouts/Invoices/utils/exportInvoicesToExcel.ts` genera el archivo `facturas-YYYY-MM.xlsx` con la librería `xlsx-js-style` (fork de `xlsx` que sí escribe estilos). Se importa de forma dinámica, por lo que solo se descarga al pulsar el botón.

El Excel se arma como un reporte: cada factura ocupa un bloque independiente (separado por filas en blanco) con su encabezado (referencia, UUID, RFC/nombre de emisor y receptor, fecha, vencimiento, subtotal, IVA y total) y debajo la tabla de sus productos (código, clave producto/servicio, clave unidad, descripción, cantidad, estado, valor unitario, IVA y precio con IVA). Cada bloque usa bordes y colores de marca (encabezados en azul, filas alternas con fondo gris claro) para diferenciar claramente filas y columnas, y al final se agregan los totales del mes.

Lógica orquestada por `hooks/useInvoices.ts` → `exportMonth`, con los estados `exportingMonth` y `exportError`.


## CRUD manual

- **Crear** `POST /api/invoices`: valida unicidad de `invoiceId` y guarda el body completo.
- **Obtener** `GET /api/invoices?id=`: retorna la factura o `404`.
- **Actualizar** `PUT /api/invoices`: usa `invoiceId` del body como filtro, elimina `_id` y `__v` antes del `$set`; `404` si no coincide.
- **Eliminar** `DELETE /api/invoices?id=`: `404` si no existía.

> La estructura completa de los documentos se describe en el [Modelo de Factura](../datadase/models/invoice.model.md).

## Documento PDF asociado

El PDF de la factura no se guarda en el campo `document` desde este módulo: se gestiona por separado mediante el [módulo de archivos](./files.md) (`/api/documents`), que nombra el archivo `document_{invoiceId}.pdf`.
