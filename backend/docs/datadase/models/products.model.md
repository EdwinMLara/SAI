# Modelo de Producto

## Objetivo

El modelo de producto tiene como finalidad almacenar y estructurar la información relevante de cada producto gestionado en el sistema, permitiendo su análisis, control y consulta eficiente. Es una pieza fundamental para la administración de inventarios y la gestión comercial. La colección se repone por completo en cada carga masiva de Excel (ver [Reemplazo de productos](../../workflows/product-replace.md)).

**Archivo:** `src/models/Product.model.ts` (colección `Products`)

## Campos del Modelo

- **key**: Clave única del producto, compuesta por caracteres numéricos y generada por el proveedor. Funciona como índice principal del modelo (única y obligatoria).

- **clave**: Clave que hace referencia a la imagen del producto. Es obligatoria pero **no** es única: algunas claves se repiten en la base de datos, por lo que no se definió como índice.

- **description**: Texto descriptivo del producto. Obligatorio.

- **prices**: Objeto que contiene los diferentes precios asociados al producto (todos numéricos, obligatorios, con valor por defecto `0`):
  - **distribution**: Precio de distribución del producto.
  - **wholesale**: Precio de mayoreo.
  - **mid_wholesale**: Precio de medio mayoreo.
  - **retail**: Precio al público.
