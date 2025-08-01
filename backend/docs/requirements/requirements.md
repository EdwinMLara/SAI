# Administración de Productos

## Introducción

Este documento describe los requerimientos para el desarrollo de un microservicio orientado a la administración y automatización de procesos actualmente realizados de manera manual en INSOEL . El objetivo principal es optimizar la gestión de operaciones internas, facilitando el control y seguimiento de pedidos, productos y pagos.

## Procesos a Automatizar

### 1. Gestión, Administración y Control de Notas para Proveedores

El sistema debe permitir la gestión integral de pedidos realizados a proveedores de productos. Cada pedido incluirá información relevante para su administración, tales como:

- Detalles del producto: descripción, precios, estado de entrega, entre otros.
- Control de estados: los productos pueden ser entregados, devueltos, cancelados o no recibidos. El sistema debe registrar y gestionar estos estados para mantener un control preciso de cada pedido.
- Asociación de usuario solicitante: cada producto solicitado debe estar vinculado al usuario responsable, permitiendo la trazabilidad de la solicitud y la entrega.
- Registro de comprobante de pago: el usuario debe poder cargar una imagen como comprobante de pago final, facilitando el seguimiento de sus pagos y productos adquiridos.

## Objetivos

- Automatizar la gestión de pedidos y productos para reducir errores y tiempos de procesamiento.
- Mejorar la trazabilidad de las solicitudes y entregas.
- Facilitar el registro y validación de pagos por parte de los usuarios.
- Proporcionar herramientas para el control eficiente de estados de productos y pedidos.
