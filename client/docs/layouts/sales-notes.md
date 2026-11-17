# Notas de venta (cliente)

## Objetivo

La parte visual del módulo: rutas, pantallas, formularios, cálculo de importes y PDF. La lógica de negocio y los endpoints están en [Notas de venta (backend)](../../../backend/docs/workflows/sales-notes.md); aquí sólo se explica cómo se usa desde el navegador.

## Ubicación

`src/layouts/SalesNotes/`

```
config/Routing.tsx
hooks/
  useSalesNotes.ts
  useSalesNoteDetail.ts
pages/
  SalesNotesList.tsx
  CreateSalesNote.tsx
  SalesNoteDetail.tsx
  UpdateFiscalStamp.tsx
ui/
  SalesNoteForm.tsx
  SalesNoteView.tsx
  SalesNoteTable.tsx
  FiscalStampForm.tsx
utils/
  calculations.ts
  format.ts
  exportSalesNoteToPdf.ts
index.ts
```

`index.ts` reexporta hooks y componentes reutilizables para que las páginas importen desde `../`.

## Rutas

Montadas bajo `/sales-notes` desde `AppRoutes.tsx`:

| Ruta | Página | Descripción |
|---|---|---|
| `/sales-notes` | `SalesNotesList` | Lista paginada con acciones Ver / Sello fiscal / Eliminar |
| `/sales-notes/new` | `CreateSalesNote` | Alta de nota (con o sin sello fiscal) |
| `/sales-notes/:reference` | `SalesNoteDetail` | Vista de la nota, impresión y descarga de PDF |
| `/sales-notes/:reference/fiscal` | `UpdateFiscalStamp` | Agregar o actualizar el sello fiscal |

El módulo aparece en el menú lateral como **Notas de venta** (`components/semantic/items.ts`), con subítems “Lista de notas” y “Nueva nota”.

## Hooks

### `useSalesNotes.ts`

Estado de la lista: `notes`, `isLoading`, `error`, `total`, `totalPages`, `page`, `limit` (10 fijo).

- `fetchNotes()`: solicita `{ page, limit }`; si la página actual queda vacía tras un borrado, retrocede una página.
- `goToPage(page)`: valida límites antes de cambiar de página.
- `remove(reference)`: elimina y recarga la lista.

### `useSalesNoteDetail.ts`

Recibe la `reference` por parámetro y expone `note`, `isLoading`, `error`, `setNote` y `refresh()`. Carga la nota al montar y cuando cambia la referencia.

## Páginas

### `SalesNotesList`

- Carga las notas con `useSalesNotes`.
- Delega la tabla en `SalesNoteTable`, que muestra referencia, cliente, fecha, total, estado (`Borrador` / `Timbrada`) y acciones.
- La eliminación pide confirmación (`window.confirm`) y muestra el error de la operación con `Message`.
- Paginación con botones Anterior / Siguiente y contador “Mostrando X-Y de N”.

### `CreateSalesNote`

- Genera una **referencia** inicial con el formato `NV-YYYYMMDD-XXXX` (4 dígitos aleatorios); el usuario puede editarla.
- Fecha por defecto: hoy (`toDateInput`).
- Empieza con una partida vacía y permite agregar/quitar partidas.
- El **sello fiscal es opcional**:
  - Si no se marca “Agregar sello fiscal ahora”, la nota se guarda como **borrador**.
  - Si se marca, ofrece dos modos: **Subir XML** (extrae el sello) o **Capturar manualmente**.
- Valida localmente referencia, nombre del cliente, al menos una partida y datos de cada partida; si el sello está activo, valida también sus campos.
- Arma el payload, envía `POST /sales-notes` y navega al detalle de la nota creada.

### `SalesNoteDetail`

- Carga la nota con `useSalesNoteDetail` y la muestra con `SalesNoteView`.
- Acciones: volver a la lista, **Actualizar sello fiscal**, **Imprimir** (`window.print()`) y **Descargar PDF**.
- La generación del PDF se hace en el navegador con `exportSalesNoteToPdf`.

### `UpdateFiscalStamp`

- Carga la nota y precarga el formulario con el sello existente (si lo hay).
- Permite **subir un XML timbrado**, que se envía a `POST /sales-notes/fiscal/xml` y guarda el sello directamente; al terminar, redirige al detalle.
- También permite **capturar manualmente** los datos y guardarlos con `PATCH /sales-notes/fiscal`.
- El título cambia según el estado: “Agregar sello fiscal” (borrador) o “Actualizar sello fiscal” (timbrada).

## Componentes

### `SalesNoteForm`

Formulario de datos generales y partidas.

- **Datos generales**: referencia, fecha, nombre del cliente (obligatorio), RFC, correo, teléfono y dirección.
- **Partidas**: tipo (`Producto de reventa`, `Producto nuevo`, `Servicio`), descripción, cantidad, precio de compra (sólo reventa), precio de venta y los importes calculados de IVA y total.
- **Comentarios y condiciones**: dos textareas opcionales.
- Cada cambio en una partida recalcula sus importes con `calculateProduct`.

### `FiscalStampForm`

Captura los datos del sello: RFC (opcional), fecha de timbrado, sello SAT, sello del emisor, cadena original y cadena para el código QR.

- `validateFiscalStampDraft` exige los cinco datos del sello y una fecha válida.
- `showRfc` permite ocultar el campo RFC (se usa en la creación, donde ya existe en los datos del cliente).

### `SalesNoteTable`

Tabla de la lista. Muestra un `Message` de error si lo hay y un estado vacío cuando no existen notas.

### `SalesNoteView`

Vista de solo lectura de la nota (layout tipo documento) usada por el detalle y la impresión.

## Cálculo de importes (`utils/calculations.ts`)

Replica la regla del backend para mostrar los importes en vivo:

- `IVA_RATE = 0.16`.
- **Subtotal** = `cantidad × precio unitario` (redondeado a 2 decimales con `round2`).
- **IVA** = `subtotal × 0.16`.
- **Total** = `subtotal + IVA`.
- `calculateNoteTotals` suma subtotal e IVA de todas las partidas.
- `purchasePrice` sólo aplica a partidas de tipo `resale`; en los demás tipos el payload lo envía en `0`.

> Aunque el cliente calcula y envía los importes, el backend los recalcula y los sobrescribe.

## Formato (`utils/format.ts`)

- `round2`: redondeo a 2 decimales.
- `formatCurrency`: moneda `es-MX` / `MXN`.
- `formatDate` / `formatDateTime`: fechas en `es-MX`.
- `toDateInput` / `toDatetimeLocal`: conversión a valores de `<input type="date">` y `<input type="datetime-local">`.

## Exportación a PDF (`utils/exportSalesNoteToPdf.ts`)

Genera un PDF A4 con **jsPDF** y **jspdf-autotable**, sin backend:

1. Carga el logo desde `/logo-nota.png` (si falla, continúa sin logo).
2. Encabezado con logo, título “NOTA DE VENTA”, referencia, fecha y estado (`Timbrada` / `Borrador`).
3. Sección **Cliente** (nombre, RFC, correo, teléfono, dirección).
4. Sección **Productos** (tipo, descripción, cantidad, precio unitario, IVA y total).
5. Caja de **totales** (subtotal, IVA, total general).
6. **Comentarios** y **Términos y condiciones** si existen.
7. Sección **Sello fiscal**: si está timbrada, dibuja el **código QR** (con `qrcode`) y los sellos/cadenas; si no, indica que aún no tiene sello.
8. Pie de página con referencia y numeración (`Página X de Y`).
9. Guarda el archivo como `Nota-<referencia>.pdf` (se limpian caracteres no seguros).

El documento maneja saltos de página automáticos (`ensureSpace`) y encabezado de continuación.

## Detalles que no son obvios

- **La referencia se genera al azar**: `NV-YYYYMMDD-XXXX` con cuatro dígitos aleatorios. No se consulta al servidor antes de guardar, así que una colisión termina en `409`. Es poco probable, pero pasa.
- **No hay pantalla de edición**: el detalle sólo permite ver, imprimir, descargar y cambiar el sello. Para corregir datos hay que borrar y volver a crear (el backend sí tiene `PUT`, pero el cliente no lo usa).
- **El sello se guarda distinto según la pantalla**: en la creación viaja dentro del `POST /sales-notes`; en el detalle se usa `PATCH /fiscal` o `POST /fiscal/xml`. El parseo (`/fiscal/xml/parse`) sólo previsualiza.
- **El PDF se arma en el navegador**, no en el backend. Si el logo no carga, el PDF sale igual, sin logo; no es un error fatal.
- **El límite de la lista está fijo en 10** desde el hook. Si se necesita otro tamaño, hay que abrir el parámetro.

## Pendientes

- Falta la edición de notas (servicio + ruta + formulario reutilizando `SalesNoteForm`).
- No hay tests del cálculo de importes ni de la exportación a PDF; son justo las partes donde un cambio silencioso se nota hasta que el cliente recibe el documento.
- El borrado usa `window.confirm`; si se quiere algo más integrado, `Alert` ya resuelve confirmaciones con acciones.
