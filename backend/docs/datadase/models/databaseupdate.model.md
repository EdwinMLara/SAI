# Modelo de Actualización de Base de Datos

## Objetivo del modelo

Registra cuándo se ejecutó la última carga masiva del catálogo de productos y cuántos registros se insertaron realmente. Es una tabla meramente informativa que alimenta el endpoint `GET /api/products/lastUpdate`.

**Archivo:** `src/models/extras/DatabaseUpdate.model.ts` (colección `DatabaseUpdates`)

## Campos del Modelo

- **type**: Tipo de operación registrada. Actualmente el único valor utilizado es `PRODUCTS_FULL_REPLACE` (reemplazo completo del catálogo).

- **timestamp**: Fecha y hora de la operación. Por defecto, la fecha de creación del documento.

- **totalRecords**: Número total de registros insertados exitosamente. Puede ser menor que el total enviado si algunos documentos fallaron durante la inserción por lotes.

## Notas

- La creación de este registro está envuelta en un `try/catch` propio: si falla, no bloquea la respuesta del reemplazo de productos (ver [Reemplazo de productos](../../workflows/product-replace.md)).
- La consulta `lastUpdate` toma el documento más reciente de tipo `PRODUCTS_FULL_REPLACE`, ordenando por `timestamp` descendente.
