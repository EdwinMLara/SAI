# Documentación de Interfaces de Modelo de Negocio

Este documento describe todas las interfaces utilizadas para los modelos de negocio del sistema SAI, explicando el propósito y uso de cada propiedad.

## User.interfaces.ts

### UserInt

Interface principal para la creación y gestión completa de usuarios en el sistema.

| Propiedad  | Tipo                           | Propósito                                                                      |
| ---------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `image`    | `string?`                      | URL o ruta de la imagen de perfil del usuario (opcional)                       |
| `name`     | `string`                       | Nombre completo del usuario para identificación personal                       |
| `username` | `string`                       | Nombre de usuario único para autenticación y identificación en el sistema      |
| `phone`    | `string`                       | Número telefónico para contacto y verificaciones de seguridad                  |
| `email`    | `string`                       | Correo electrónico para autenticación, notificaciones y recuperación de cuenta |
| `password` | `string`                       | Contraseña encriptada para autenticación segura                                |
| `role`     | `'super' \| 'admin' \| 'user'` | Nivel de permisos: super (máximos), admin (gestión), user (básicos)            |

### UserChangesInt

Interface para actualización de datos de usuario, excluye el rol para evitar escalación no autorizada.

| Propiedad  | Tipo      | Propósito                                                       |
| ---------- | --------- | --------------------------------------------------------------- |
| `image`    | `string?` | Nueva imagen de perfil (opcional)                               |
| `name`     | `string`  | Actualización del nombre completo                               |
| `username` | `string`  | Cambio de nombre de usuario (debe validar unicidad)             |
| `phone`    | `string`  | Actualización de número telefónico                              |
| `password` | `string`  | Nueva contraseña (debe ser encriptada antes del almacenamiento) |
| `email`    | `string`  | Nuevo correo electrónico (requiere verificación)                |

### PublicUserInt

Interface para mostrar información de usuario sin datos sensibles como la contraseña.

| Propiedad  | Tipo                           | Propósito                                        |
| ---------- | ------------------------------ | ------------------------------------------------ |
| `image`    | `string?`                      | Imagen de perfil visible públicamente            |
| `name`     | `string`                       | Nombre completo para mostrar en interfaces       |
| `username` | `string`                       | Identificador público del usuario                |
| `phone`    | `string`                       | Contacto visible para otros usuarios autorizados |
| `email`    | `string`                       | Email visible para comunicaciones internas       |
| `role`     | `'super' \| 'admin' \| 'user'` | Rol visible para determinar permisos en UI       |

## Product.interfaces.ts

### DetailsProduct

Interface para detalles específicos del producto requeridos para cumplimiento fiscal y regulatorio.

| Propiedad | Tipo     | Propósito                                                                           |
| --------- | -------- | ----------------------------------------------------------------------------------- |
| `brand`   | `string` | Marca del producto para identificación comercial y filtrado                         |
| `satCode` | `string` | Código SAT (Sistema de Administración Tributaria) para cumplimiento fiscal mexicano |

### PricesProductInt

Interface para diferentes niveles de precios según el tipo de cliente y volumen de compra.

| Propiedad       | Tipo     | Propósito                                                         |
| --------------- | -------- | ----------------------------------------------------------------- |
| `distribution`  | `number` | Precio para distribuidores mayoristas (volumen alto, margen bajo) |
| `wholesale`     | `number` | Precio mayorista estándar (volumen medio-alto)                    |
| `mid_wholesale` | `number` | Precio semi-mayorista (volumen medio)                             |
| `retail`        | `number` | Precio al menudeo/detalle (volumen bajo, margen alto)             |

### ProductInt

Interface principal del producto que integra toda la información comercial.

| Propiedad     | Tipo               | Propósito                                                       |
| ------------- | ------------------ | --------------------------------------------------------------- |
| `code`        | `string`           | Código interno único del producto para inventario               |
| `key`         | `string`           | Clave alternativa o código de barras para identificación rápida |
| `description` | `string`           | Descripción detallada del producto para catálogo y búsquedas    |
| `prices`      | `PricesProductInt` | Estructura de precios por niveles de cliente                    |
| `details`     | `DetailsProduct`   | Información adicional de marca y códigos fiscales               |

## Invoice.interfaces.ts

### DestinationInvoiceInt

Interface para configurar el destino y uso de productos por usuario en una factura.

| Propiedad | Tipo     | Propósito                                                              |
| --------- | -------- | ---------------------------------------------------------------------- |
| `pay`     | `number` | Monto que debe pagar el usuario por su parte de los productos          |
| `gain`    | `number` | Ganancia esperada o margen de utilidad para el usuario                 |
| `use`     | `string` | Descripción del uso previsto de los productos (reventa, consumo, etc.) |

### UserInvoiceInt

Interface para configuración específica de cada usuario dentro de una factura compartida.

| Propiedad | Tipo                    | Propósito                                                  |
| --------- | ----------------------- | ---------------------------------------------------------- |
| `userId`  | `unknown`               | Identificador del usuario asociado a esta configuración    |
| `needs`   | `number`                | Cantidad de productos que necesita este usuario específico |
| `use`     | `DestinationInvoiceInt` | Configuración de pago, ganancia y uso para este usuario    |

### PricesInt

Interface extendida de precios que incluye el cálculo de pago específico.

| Propiedad                    | Tipo     | Propósito                                                                   |
| ---------------------------- | -------- | --------------------------------------------------------------------------- |
| `payment`                    | `number` | Precio final calculado que debe pagarse (puede incluir descuentos/recargos) |
| _hereda de PricesProductInt_ | -        | Todos los niveles de precio base del producto                               |

### ProductInvoiceInt

Interface para productos dentro de una factura con configuraciones específicas de usuarios.

| Propiedad           | Tipo               | Propósito                                                  |
| ------------------- | ------------------ | ---------------------------------------------------------- |
| `productkey`        | `string`           | Clave del producto referenciado en la factura              |
| `description`       | `string`           | Descripción del producto copiada al momento de facturación |
| `quantityReception` | `number`           | Cantidad recibida/confirmada del producto                  |
| `statusReception`   | `string`           | Estado de recepción (pendiente, parcial, completo, etc.)   |
| `prices`            | `PricesProductInt` | Precios aplicados en el momento de la facturación          |
| `userConfig`        | `UserInvoiceInt[]` | Configuraciones individuales de cada usuario participante  |

### PaymentsInvoiceInt

Interface para registrar pagos realizados contra una factura.

| Propiedad         | Tipo      | Propósito                                                      |
| ----------------- | --------- | -------------------------------------------------------------- |
| `userId`          | `unknown` | Usuario que realizó el pago                                    |
| `transactionId`   | `string`  | Identificador único de la transacción bancaria/sistema de pago |
| `transactionDate` | `Date`    | Fecha y hora exacta del pago                                   |
| `amount`          | `number`  | Monto pagado en la transacción                                 |
| `status`          | `string`  | Estado del pago (pendiente, confirmado, rechazado, etc.)       |
| `voucherURL`      | `string`  | URL del comprobante de pago o recibo                           |

### InvoiceInt

Interface principal de la factura que integra toda la información comercial y de pagos.

| Propiedad     | Tipo                   | Propósito                                            |
| ------------- | ---------------------- | ---------------------------------------------------- |
| `invoiceId`   | `string`               | Identificador único de la factura                    |
| `documentId`  | `string`               | Identificador del documento fiscal oficial           |
| `initDate`    | `Date`                 | Fecha de creación/inicio de la factura               |
| `expiration`  | `Date`                 | Fecha límite para pagos y cumplimiento               |
| `products`    | `ProductInvoiceInt[]`  | Lista de productos incluidos con sus configuraciones |
| `payments`    | `PaymentsInvoiceInt[]` | Historial de todos los pagos realizados              |
| `documentURL` | `string`               | URL del documento fiscal oficial (PDF, XML, etc.)    |

## Invite.interfaces.ts

### InviteInt

Interface para invitaciones de nuevos usuarios al sistema.

| Propiedad      | Tipo                           | Propósito                                                          |
| -------------- | ------------------------------ | ------------------------------------------------------------------ |
| `senderId`     | `unknown`                      | ID del usuario que envía la invitación (para auditoría y permisos) |
| `invitedEmail` | `string`                       | Correo electrónico del usuario invitado para envío de notificación |
| `asignedRole`  | `'super' \| 'admin' \| 'user'` | Rol que se asignará al usuario una vez acepte la invitación        |

## Notas de Implementación

### Consideraciones de Seguridad
