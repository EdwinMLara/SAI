# Modelo de Factura

## Objetivo

El modelo de factura tiene como finalidad gestionar y almacenar toda la información relevante de las facturas emitidas por los proveedores, permitiendo el control, seguimiento y análisis de los pedidos y productos recibidos en el sistema.

## Campos del Modelo

- **invoiceId**: Identificador primario de la factura, generado en el pedido emitido por el proveedor. Es una cadena numérica.

- **reference**: Identificador secundario con valor institucional para el proveedor. Es una cadena alfanumérica relevante para la gestión interna.

- **date**: Fecha de generación del pedido, almacenada como tipo de dato Date.

- **expiration**: Fecha de vencimiento del crédito, almacenada como tipo de dato Date.

- **products**: Arreglo de objetos del tipo Product, que contiene información funcional y estructural de cada producto incluido en la factura. Cada objeto Product incluye:
  - **key**: Clave única del producto.
  - **description**: Descripción del producto.
  - **quantity**: Cantidad de producto especificada en la factura.
  - **status**: Estado de post-entrega del pedido (recibido, devuelto, cancelado, backorder).
  - **prices**: Objeto con los precios del producto al momento de la factura:
    - **distribution**: Precio de distribución.
    - **wholesale**: Precio de mayoreo.
    - **mid_wholesale**: Precio de medio mayoreo.
    - **retail**: Precio al público.
  - **user_config**: Configuración del producto asociada al usuario solicitante:
    - **userName**: Identificador del usuario (4 dígitos alfanuméricos definidos al crear la cuenta).
    - **needs**: Cantidad del producto que el usuario solicitó y tomará del total recibido.
    - **use**: Objeto Destination con información asignada por el usuario en una venta:
      - **use_factor**: Motivo o factor de uso asignado por el usuario.
      - **gain_factor**: Ganancia obtenida tras la venta.
      - **pay**: Precio final del producto tras la venta.
- **payments**: Información de pagos realizados por cada usuario, incluyendo:
  - **userName**: Identificador del usuario.
  - **transaction**: Identificador de la transacción de pago.
  - **date**: Fecha en que se realizó el pago.
  - **amount**: Cantidad pagada por el usuario.
  - **status**: Estado del pago.
  - **voucher**: URL de la imagen del comprobante de pago.
- **document**: URL de la factura expedida por el distribuidor en formato PDF.
