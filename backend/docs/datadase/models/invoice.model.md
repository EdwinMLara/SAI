# Modelo de Factura

## Objetivo

El modelo de factura tiene como finalidad gestionar y almacenar toda la información relevante de las facturas emitidas por los proveedores, permitiendo el control, seguimiento y análisis de los pedidos y productos recibidos en el sistema.

**Archivo:** `src/models/Invoice.model.ts` (colección `Invoices`)

## Campos del Modelo

- **invoiceId**: Identificador primario de la factura. Al cargar desde XML corresponde al UUID del Timbre Fiscal Digital. Único y obligatorio.

- **reference**: Identificador secundario con valor institucional para el proveedor (`Serie-Folio` al cargar desde XML).

- **emisorRfc** / **emisorNombre**: RFC y nombre del emisor de la factura.

- **receptorRfc** / **receptorNombre**: RFC y nombre del receptor de la factura.

- **date**: Fecha de generación del comprobante.

- **expiration**: Fecha de vencimiento del crédito (al cargar desde XML se calcula como `date + 30 días`).

- **subtotal**: Subtotal de la factura (valor por defecto `0`).

- **total**: Total de la factura (valor por defecto `0`).

- **products**: Arreglo de objetos con la información funcional y estructural de cada producto incluido en la factura. Cada objeto contiene:
  - **key**: Clave única del producto (se limpian los ceros a la izquierda al cargar desde XML).
  - **claveProdServ**: Clave de producto o servicio del catálogo CFDI.
  - **claveUnidad**: Clave de unidad de medida del catálogo CFDI.
  - **description**: Descripción del producto.
  - **quantity**: Cantidad de producto especificada en la factura.
  - **status**: Estado de post-entrega del pedido (recibido, devuelto, cancelado, backorder).
  - **prices**: Objeto con los precios del producto al momento de la factura:
    - **payment**: Precio unitario (`ValorUnitario` del XML).
    - **iva**: Monto de IVA calculado desde los traslados del XML (impuesto `002`, 16%).
    - **priceWithIva**: Precio unitario más IVA.
    - **distribution**: Precio de distribución.
    - **wholesale**: Precio de mayoreo.
    - **mid_wholesale**: Precio de medio mayoreo.
    - **retail**: Precio al público.
  - **user_config**: Configuración del producto asociada a cada usuario solicitante:
    - **name**: Nombre del usuario solicitante.
    - **role**: Rol del usuario solicitante.
    - **needs**: Cantidad del producto que el usuario solicitó y tomará del total recibido.
    - **use**: Objeto con la información asignada por el usuario en una venta:
      - **use_factor**: Motivo o factor de uso asignado por el usuario.
      - **gain_factor**: Ganancia obtenida tras la venta.
      - **pay**: Precio final del producto tras la venta.
- **payments**: Información de pagos realizados por cada usuario, incluyendo:
  - **user**: Identificador del usuario que realiza el pago.
  - **transaction**: Identificador de la transacción de pago.
  - **date**: Fecha en que se realizó el pago.
  - **amount**: Cantidad pagada por el usuario.
  - **status**: Estado del pago.
  - **voucher**: URL de la imagen del comprobante de pago.
- **document**: URL del PDF de la factura expedida por el distribuidor. Se gestiona mediante el [módulo de documentos](../../workflows/files.md) (`document_{invoiceId}.pdf` en Supabase Storage).

## Notas

- Los campos `subtotal`, `total`, `emisor*` y `receptor*` se extraen del XML CFDI; en altas manuales tienen valores por defecto.
- `_id` y `__v` se excluyen del body en las operaciones de actualización.
