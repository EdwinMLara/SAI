# Modelo de Producto

## Objetivo

El modelo de producto tiene como finalidad almacenar y estructurar la información relevante de cada producto gestionado en el sistema, permitiendo su análisis, control y consulta eficiente. Es una pieza fundamental para la administración de inventarios y la gestión comercial.

## Campos del Modelo

- **key**: Clave única del producto, compuesta por caracteres numéricos y generada por el proveedor. Funciona como índice principal del modelo.

- **description**: Texto descriptivo del producto.

- **prices**: Objeto que contiene los diferentes precios asociados al producto:
  - **distribution**: Precio de distribución del producto.
  - **wholesale**: Precio de mayoreo.
  - **mid_wholesale**: Precio de medio mayoreo.
  - **retail**: Precio al público.
