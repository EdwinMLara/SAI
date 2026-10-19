# Modelado de la base de datos

## Objetivo

Este documento describe la segmentación de la base de datos del sistema SAI: los modelos que componen la lógica de negocio y dónde encontrar su especificación detallada.

**Motor:** MongoDB Atlas (compatibilidad con el tier gratuito M0; ver consideraciones en el [reemplazo de productos](../workflows/product-replace.md)).

## Colecciones

### 1. Usuarios

Modelo central de identificación, autenticación y roles. → [Modelo de Usuario](./models/users.model.md)

### 2. Productos

Catálogo de productos con precios por escalas; se repone por completo en cada carga masiva. → [Modelo de Producto](./models/products.model.md)

### 3. Facturas

Información fiscal de los comprobantes recibidos, sus productos, configuraciones por usuario y pagos. → [Modelo de Factura](./models/invoice.model.md)

### 4. Invitaciones

Autorizaciones previas al registro de nuevos usuarios, con el rol asignado. → [Modelo de Invitación](./models/invites.model.md)

### 5. Logs

Auditoría de eventos y errores (sólo en producción). → [Modelo de Log](./models/logs.model.md)

### 6. Actualizaciones de base de datos

Registro histórico de las cargas masivas de productos. → [Modelo de Actualización de Base de Datos](./models/databaseupdate.model.md)

## Relaciones principales

- **Invitación → Usuario**: `Invite.ref` almacena el `ObjectId` del administrador que creó la invitación.
- **Factura → Producto**: `Invoice.products[].key` referencia la `key` del catálogo de productos (sin constraint de integridad referencial; es una referencia lógica).
- **Factura → Usuario**: `Invoice.products[].user_config` y `Invoice.products[].payments` asocian registros por nombre/identificador de usuario.
