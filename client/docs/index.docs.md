# Documentación SAI — Cliente

Índice de la documentación técnica del frontend del Sistema de Administración INSOEL (SAI).

Si es tu primera vez en el proyecto, empieza por [Arquitectura del cliente](./architecture.md) y luego por [Servicios y comunicación con la API](./core/services.md). Con eso ya puedes ubicar cualquier módulo.

## Arquitectura

- [Arquitectura del cliente](./architecture.md): stack, arranque de la aplicación, ruteo, contextos, interceptor de Axios y alias de importación.
- [Servicios y comunicación con la API](./core/services.md): convención de respuesta, manejo de sesión y catálogo de servicios por módulo.

## Módulos (layouts)

- [Visión general de los módulos](./layouts/index.md): autenticación, facturas, productos, notas de venta y usuarios.
- [Notas de venta](./layouts/sales-notes.md): páginas, hooks, formularios, cálculo de importes y exportación a PDF.

## Componentes de UI

- [Catálogo de componentes](./ui/index.ui.md): componentes exportados por `@ui` y convenciones de uso.
- Documentos individuales:
  - [Alert](./ui/Alert.ui.md)
  - [Button](./ui/Button.ui.md)
  - [Icon](./ui/Icon.ui.md)
  - [IconButton](./ui/IconButton.ui.md)
  - [InputFile](./ui/InputFile.ui.md)

## Documentación del backend

La API que consume este cliente está documentada en [backend/docs/index.docs.md](../../backend/docs/index.docs.md).
