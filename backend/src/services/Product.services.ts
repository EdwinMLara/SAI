/**
 * ============================================================================
 * Product.services.ts — Servicio de productos (backend)
 * ============================================================================
 *
 * CAMBIOS REALIZADOS (resumen):
 *
 * 1. Se eliminaron las transacciones de MongoDB de la función replaceAllProducts.
 *    - ANTES: Se usaba session.startTransaction(), commitTransaction() y
 *      abortTransaction(). Esto es una característica de MongoDB que permite
 *      agrupar varias operaciones de escritura en una sola unidad atómica.
 *      Si algo falla, se deshace todo (rollback). Si todo va bien, se confirma
 *      todo de golpe (commit).
 *    - PROBLEMA: MongoDB Atlas tiene distintos "tiers" (niveles de servicio).
 *      El tier gratuito (M0) NO soporta transacciones. Solo los tiers de pago
 *      (M10 en adelante) las permiten. Al intentar usar transacciones en M0,
 *      MongoDB lanzaba un error que provocaba el 500 en el endpoint.
 *    - SOLUCIÓN: Se reemplazaron las transacciones por operaciones simples
 *      secuenciales. Se perdió la atomicidad (si falla a mitad, quedan datos
 *      parciales), pero ahora funciona en el tier gratuito.
 *
 * 2. Se implementó inserción por lotes (batch inserts).
 *    - ANTES: Se hacía un solo insertMany() con todos los productos (~15,000)
 *      de una sola vez.
 *    - PROBLEMA: Enviar 15,000 documentos de golpe causaba timeouts tanto en
 *      el servidor Express como en la conexión con MongoDB Atlas. El servidor
 *      de desarrollo (nodemon + ts-node) no estaba preparado para manejar
 *      payloads de esa magnitud en una sola operación, y la conexión a la base
 *      de datos se cortaba antes de completar la inserción. Solo se lograban
 *      insertar ~26 productos antes del error.
 *    - SOLUCIÓN: Se implementó un sistema de lotes (batches) con un tamaño fijo
 *      de 1,000 documentos por lote. En lugar de insertar 15,000 de golpe, se
 *      insertan 1,000, luego otros 1,000, y así sucesivamente hasta completar
 *      todos. Esto reduce la carga por operación y permite que MongoDB Atlas
 *      procese los datos de forma más eficiente sin agotar sus recursos.
 *
 * 3. Se agregó manejo de errores parciales con ordered: false.
 *    - El parámetro { ordered: false } le indica a MongoDB que, si un documento
 *      en el lote falla por alguna razón (por ejemplo, un campo duplicado o un
 *      dato inválido), NO detenga la inserción de los demás documentos del
 *      mismo lote. Sin esto, ordered: true (el comportamiento por defecto)
 *      detiene toda la inserción del lote en el primer error.
 *    - Cuando hay un error con ordered: false, MongoDB lanza un
 *      MongoBulkWriteError que incluye la propiedad insertedCount, que indica
 *      cuántos documentos SÍ se insertaron correctamente antes del error.
 *      Capturamos ese conteo para saber cuántos productos realmente se guardaron.
 *
 * 4. Se hizo que DatabaseUpdateModel.create() no bloquee la respuesta.
 *    - ANTES: Si la creación del registro de actualización fallaba (por ejemplo,
 *      por un problema de conexión o validación), toda la función lanzaba un
 *      error y el endpoint respondía con 500, aunque los productos SÍ se
 *      habían guardado correctamente.
 *    - SOLUCIÓN: Se envolvió en su propio try/catch para que, si falla, solo
 *      se registre el error en consola pero no detenga el flujo. El registro
 *      de actualización es meramente informativo (saber cuándo fue la última
 *      vez que se actualizó la base de productos), no es crítico para el
 *      funcionamiento del sistema.
 *
 * Conceptos clave:
 * - MongoDB Atlas: Servicio en la nube para bases de datos MongoDB.
 * - M0 (tier gratuito): Versión gratuita con limitaciones (sin transacciones,
 *   límite de almacenamiento, menos recursos de CPU/ RAM).
 * - Transacciones (ACID): Mecanismo que garantiza que un grupo de operaciones
 *   se complete completamente o no se ejecute nada. Atomicidad.
 * - InsertMany: Operación de MongoDB para insertar múltiples documentos en una
 *   sola llamada, más eficiente que hacerlo uno por uno.
 * - Lotes (Batches): Técnica de dividir un conjunto grande de datos en grupos
 *   más pequeños para procesarlos de forma más manageable.
 * - Ordered vs Unordered writes: En writes ordenados, el primer error detiene
 *   todo. En writes no ordenados, se continúan insertando los documentos
 *   restantes ignorando los que fallan.
 * - Payload: La cantidad de datos que se envían en una sola petición/requisición.
 * ============================================================================
 */

import ProductModel from '@models/Product.model';
import DatabaseUpdateModel from '@models/extras/DatabaseUpdate.model';

import { ProductInterface } from '@interfaces/Product.interfaces';

import responses from '@responses';
import AppError from '@utils/AppError';

/* ------------------ Code ------------------ */

export async function createProduct(product: ProductInterface): Promise<void> {
  try {
    const newProduct = new ProductModel(product);
    await newProduct.save();
  } catch (error) {
    throw error;
  }
}

export async function getProduct(
  keyProduct: string
): Promise<ProductInterface> {
  try {
    const response = await ProductModel.findOne({ key: keyProduct });

    if (!response) {
      throw new AppError(responses.Product.notFound, 404);
    }

    return response as ProductInterface;
  } catch (error) {
    throw error;
  }
}

export async function deleteProduct(keyProduct: string): Promise<void> {
  try {
    await ProductModel.deleteOne({ key: keyProduct });
  } catch (error) {
    throw error;
  }
}

export async function existProduct(keyProduct: string): Promise<boolean> {
  try {
    const product = await ProductModel.findOne({ key: keyProduct });
    return !!product;
  } catch (error) {
    throw error;
  }
}

/**
 * replaceAllProducts — Reemplaza todos los productos de la base de datos.
 *
 * FLUJO ACTUAL:
 * 1. Se eliminan TODOS los productos existentes (deleteMany).
 * 2. Se insertan los nuevos productos en lotes de 1,000 (batch insert).
 *    - Cada lote se envía con { ordered: false } para que un error en un
 *      documento no detenga la inserción del resto del lote.
 *    - Si un lote falla parcialmente, se captura el insertedCount del error
 *      para saber cuántos documentos SÍ se insertaron.
 *    - Se imprime en consola el conteo de inserciones por lote para debug.
 * 3. Se crea (o actualiza) un registro en DatabaseUpdates que indica cuándo
 *    fue la última actualización completa de productos y cuántos se insertaron.
 *    Este registro es informativo y no bloquea la operación principal.
 *
 * FLUJO ANTES (con transacciones):
 * 1. session.startTransaction() — Inicia una sesión transaccional.
 * 2. deleteMany() — Elimina todos los productos DENTRO de la transacción.
 * 3. insertMany() — Inserta todos los productos de una vez DENTRO de la transacción.
 * 4. create() — Crea el registro de actualización DENTRO de la transacción.
 * 5. commitTransaction() — Confirma todo. Si algo falla en los pasos 2-4,
 *    abortTransaction() deshace todo.
 * 6. Si hay error → abortTransaction() revierte los cambios.
 *
 * NOTA: Esta función fue modificada para funcionar con MongoDB Atlas M0
 * (tier gratuito) que no soporta transacciones. Si se migra a un tier de pago
 * (M10+), se puede restaurar la versión con transacciones para mayor seguridad.
 */
export async function replaceAllProducts(
  data: ProductInterface[]
): Promise<void> {
  try {
    // Paso 1: Eliminar todos los productos existentes.
    // deleteMany({}) sin filtro elimina TODOS los documentos de la colección.
    // Esto es necesario porque es un "reemplazo completo": se borra todo y se
    // vuelve a insertar. Equivale a un "truncar + recargar".
    await ProductModel.deleteMany({});

    // Paso 2: Insertar productos en lotes (batches).
    // BATCH_SIZE define cuántos documentos se envían por cada operación insertMany.
    // Elegimos 1,000 porque es un número suficientemente grande para ser eficiente
    // (menos llamadas a la base de datos) pero pequeño suficiente para no causar
    // timeouts en MongoDB Atlas M0.
    const BATCH_SIZE = 1000;
    let insertedCount = 0;

    // El bucle recorre el array completo de productos, tomando porciones
    // de BATCH_SIZE en cada iteración.
    // Ejemplo con 15,000 productos:
    //   Iteración 1: data[0] a data[999]     → 1,000 productos
    //   Iteración 2: data[1000] a data[1999] → 1,000 productos
    //   ...
    //   Iteración 15: data[14000] a data[14999] → 1,000 productos
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      // slice(i, i + BATCH_SIZE) extrae una porción del array original.
      // No modifica el array original, crea un nuevo array con esos elementos.
      const batch = data.slice(i, i + BATCH_SIZE);

      try {
        // insertMany inserta múltiples documentos en una sola llamada a MongoDB.
        // { ordered: false } significa "no ordenado":
        //   - Si un documento del lote falla (dato duplicado, campo inválido, etc.),
        //     los demás documentos del lote SIGUEN insertándose.
        //   - Sin esto (ordered: true por defecto), el primer documento que falle
        //     detendría la inserción de todo el lote restante.
        //   - MongoDB retorna un array con los documentos insertados exitosamente.
        const result = await ProductModel.insertMany(batch, { ordered: false });
        insertedCount += result.length;
      } catch (e: any) {
        // Cuando ordered: false encuentra errores, lanza un MongoBulkWriteError.
        // Este objeto de error tiene la propiedad "insertedCount" que indica
        // cuántos documentos SÍ se insertaron antes de que ocurriera el error.
        // Por ejemplo: si hay 1,000 documentos y el documento #500 tiene un
        // problema, insertedCount será 499 (los primeros 499 se guardaron).
        if (e.insertedCount) {
          insertedCount += e.insertedCount;
        }
        console.error(`Error en lote ${i / BATCH_SIZE + 1}:`, e.message);
      }
    }

    // Log informativo: cuántos productos se insertaron vs cuántos se enviaron.
    // Si insertedCount < data.length, significa que algunos documentos fallaron.
    console.log(`Productos insertados: ${insertedCount}/${data.length}`);

    // Paso 3: Registrar la actualización en la tabla DatabaseUpdates.
    // Este registro es MERAMENTE INFORMATIVO. Sirve para saber:
    //   - Cuándo fue la última vez que se actualizaron los productos (timestamp).
    //   - Cuántos productos se insertaron realmente (totalRecords).
    // Si esta operación falla, no afecta los productos ya insertados.
    try {
      await DatabaseUpdateModel.create({
        type: 'PRODUCTS_FULL_REPLACE',
        timestamp: new Date(),
        totalRecords: insertedCount,
      });
    } catch (e) {
      console.error('Error al guardar registro de actualización:', e);
    }
  } catch (error) {
    throw error;
  }
}

export async function getLastDatabaseUpdate(): Promise<Date | null> {
  try {
    const lastUpdate = await DatabaseUpdateModel.findOne({
      type: 'PRODUCTS_FULL_REPLACE',
    })
      .sort({ timestamp: -1 })
      .exec();

    return lastUpdate ? lastUpdate.timestamp : null;
  } catch (error) {
    throw error;
  }
}
