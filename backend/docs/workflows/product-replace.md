# Productos: catálogo y reemplazo completo

## Objetivo

Documentar la administración del catálogo de productos, con énfasis en la carga masiva desde el cliente (archivo Excel) mediante el reemplazo completo de la colección.

## Endpoints

| Endpoint | Método | Controlador | Protección |
|---|---|---|---|
| `/api/products/replaceAll` | POST | `Product.replaceAllProducts` | `Identity` |
| `/api/products/lastUpdate` | GET | `Product.getLastUpdate` | `Identity` |
| `/api/products?key=` | GET | `Product.getProduct` | `Identity` |
| `/api/products` | POST | `Product.createProduct` | `Identity` |
| `/api/products?key=` | DELETE | `Product.deleteProduct` | `Identity` |

Controlador: `src/controllers/Product.controller.ts`.

> `POST` y `DELETE` de productos son operaciones unitarias pensadas para administración; el cliente actual sólo usa `replaceAll` y `lastUpdate`.

## Reemplazo completo — `POST /api/products/replaceAll`

### Payload

Un arreglo de productos (`ProductInterface[]`) en el body JSON, proveniente del procesamiento del archivo Excel en el cliente (hoja `.xlsx`/`.xls` convertida a JSON por la librería `xlsx`).

### Flujo (`Product.services.replaceAllProducts`)

1. **Borrado total**: `deleteMany({})` elimina todos los documentos de la colección ("truncar + recargar").
2. **Inserción por lotes**: se recorre el arreglo en batches de **1,000 documentos** con `insertMany(batch, { ordered: false })`.
   - `ordered: false` permite que un documento inválido no detenga el resto del lote.
   - Si MongoDB lanza `MongoBulkWriteError`, se captura `insertedCount` para contabilizar los documentos que sí se insertaron.
3. **Registro de la actualización**: se crea un documento en `DatabaseUpdates` con `type: 'PRODUCTS_FULL_REPLACE'`, timestamp y total de registros insertados. Esta operación está en su propio `try/catch`: si falla, sólo se registra en consola y no bloquea la respuesta.

### Consideraciones importantes

- **No usa transacciones**: MongoDB Atlas M0 (tier gratuito) no las soporta. Por eso, si el proceso falla a mitad, pueden quedar datos parciales. Si el proyecto se migra a un tier M10+, se puede restaurar la versión transaccional.
- El tamaño de lote (1,000) se eligió para evitar timeouts en Express y en la conexión con Atlas (~15,000 productos por carga).
- Respuesta `200` con mensaje de reemplazo exitoso.

## Última actualización — `GET /api/products/lastUpdate`

Retorna el `timestamp` del registro `DatabaseUpdates` más reciente de tipo `PRODUCTS_FULL_REPLACE`, o `null` si nunca se ha ejecutado.

```json
{
  "status": 200,
  "data": { "message": "...", "lastUpdate": "2026-10-01T12:00:00.000Z" }
}
```

## Operaciones unitarias

- **Crear** `POST /api/products`: valida que la `key` no exista (`comprobeInexistence`) y guarda el producto.
- **Obtener** `GET /api/products?key=`: busca por `key`; `404` si no existe.
- **Eliminar** `GET` → `DELETE /api/products?key=`: `404` si no existe.

La estructura completa se describe en el [Modelo de Producto](../datadase/models/products.model.md).
