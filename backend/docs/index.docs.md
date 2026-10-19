# Documentación SAI — Backend

Índice de la documentación técnica del backend del Sistema de Administración INSOEL (SAI).

## Requerimientos

- [Requerimientos del negocio](./requirements/requirements.md): procesos a automatizar y objetivos del sistema.

## Arquitectura y API

- [Referencia de la API](./api-reference.md): todos los endpoints agrupados por módulo, con sus middlewares de protección.
- [Arquitectura del backend](./architecture.md): pipeline de peticiones, middlewares, utilidades transversales, CORS y apagado elegante.
- [Sistema de Logging](./Logging.md): configuración por entorno (consola en desarrollo, MongoDB en producción).

## Flujos de trabajo

- [Registro de usuarios](./workflows/register.md)
- [Inicio de sesión](./workflows/login.md)
- [Sesión, renovación y cierre](./workflows/session.md)
- [Recuperación y cambio de contraseña](./workflows/password-recovery.md)
- [Invitaciones](./workflows/invites.md)
- [Facturas: carga de XML CFDI y gestión](./workflows/invoice-upload.md)
- [Productos: catálogo y reemplazo completo](./workflows/product-replace.md)
- [Archivos: documentos y tickets (Supabase)](./workflows/files.md)

## Base de datos

Segmentación de la base de datos y modelado de la lógica de negocio:

- [Modelado de la base de datos](./datadase/modelado.md): visión general de las colecciones y sus relaciones.
- Modelos:
  - [Usuario](./datadase/models/users.model.md)
  - [Producto](./datadase/models/products.model.md)
  - [Factura](./datadase/models/invoice.model.md)
  - [Invitación](./datadase/models/invites.model.md)
  - [Log](./datadase/models/logs.model.md)
  - [Actualización de base de datos](./datadase/models/databaseupdate.model.md)
