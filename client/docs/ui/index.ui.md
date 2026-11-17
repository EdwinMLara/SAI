# Catálogo de componentes de UI

## Objetivo

Los componentes base que expone `@ui` (`src/components/ui/index.ui.ts`). Son pocos y deliberadamente simples; si algo se repite en dos layouts, es candidato a subir aquí. Se importan desde el barrel:

```tsx
import { Button, Input, Message } from '@ui/index.ui';
```

## Componentes disponibles

| Componente | Archivo | Propósito |
|---|---|---|
| `Alert` | `Alert.tsx` | Diálogo de confirmación con acciones. |
| `Button` | `Button.tsx` | Botón con variantes (`primary`, `secondary`, `ghost`). |
| `Checkbox` | `Checkbox.tsx` | Casilla de verificación. |
| `Icon` | `Icon.tsx` | Icono de `react-icons` por nombre. |
| `IconButton` | `IconButton.tsx` | Botón con icono y texto opcional. |
| `Input` | `Input.tsx` | Campo de texto con label/error. |
| `InputFile` | `InputFile.tsx` | Selector de archivos con validación y vista previa. |
| `Loading` | `Loading.tsx` | Indicador de carga con mensaje. |
| `Message` | `Message.tsx` | Aviso en línea (`success`, `warning`, `error`, `info`, `neutral`). |

## Convenciones

- Todo el estilo se hace con clases de Tailwind y los tokens del tema (`bg-card`, `text-primary-color`, `border-light`, etc.).
- Los textos visibles van en español.
- Los estados de carga usan `Loading`; los avisos y errores de operación usan `Message`.
- `InputFile` es el componente estándar para subir archivos: recibe `accept`, `onChange` y, opcionalmente, `onContinue`/`continueLabel` para confirmar la selección antes de procesar.

En la práctica se usan pocos: `Button`, `Input`, `Message` y `Loading` cubren casi todo. No metas lógica de negocio en estos componentes; reciben props y devuelven markup.

## Documentos individuales

- [Alert](./Alert.ui.md)
- [Button](./Button.ui.md)
- [Icon](./Icon.ui.md)
- [IconButton](./IconButton.ui.md)
- [InputFile](./InputFile.ui.md)

> Los documentos `Modal.ui.md`, `Notification.ui.md` y `Table.ui.md` corresponden a componentes que **no** forman parte del barrel actual (`index.ui.ts`). Hoy los avisos se resuelven con `Message` y las tablas se implementan directamente en cada layout. Consérvalos sólo como referencia histórica.

## Pendientes

- `Input` y `Message` no tienen documento propio; el uso está resumido en este índice.
- Si se retoman `Modal` o `Notification`, conviene crear el componente, exportarlo en el barrel y actualizar estos docs en el mismo cambio.
