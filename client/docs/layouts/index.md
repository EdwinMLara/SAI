# Módulos (layouts)

## Objetivo

Dar una visión general de los módulos de negocio del cliente. Cada layout agrupa su propio ruteo, páginas, hooks, componentes y utilidades, y expone lo reutilizable desde `index.ts`.

## Estructura común

```
layouts/<Modulo>/
  config/Routing.tsx   → rutas del módulo
  pages/               → pantallas
  hooks/               → estado y llamadas a servicios
  ui/                  → componentes propios del módulo
  utils/               → funciones puras (cálculo, formato, exportación)
  index.ts             → barrel de lo reutilizable
```

El ruteo de cada módulo se monta en `AppRoutes.tsx` bajo una ruta comodín (`/invoices/*`, `/products/*`, etc.).

Si vas a crear un módulo nuevo, copia la estructura de `SalesNotes`: es el más completo (lista, alta, detalle y una pantalla aparte). `Authentication` es la excepción: no tiene `config/Routing.tsx`, sus rutas viven en `AppRoutes.tsx` y la carpeta se llama `autentication`, con la errata histórica.

## `Authentication`

Ubicación: `src/layouts/autentication/` (el ruteo se define directamente en `AppRoutes.tsx`).

- **Páginas:** `LoginForm`, `RegisterForm`, `ForgotPasswordForm`, `ResetPasswordForm`, `ChangePasswordForm`.
- **Hooks:** `useLogin`, `useRegister`, `useForgotPassword`, `useResetPassword`, `useChangePassword`, `useValidations`.
- Cubre los flujos de [autenticación del backend](../../../backend/docs/workflows/register.md).

## `Invoices`

Ubicación: `src/layouts/Invoices/`

| Ruta | Página |
|---|---|
| `/invoices` | `InvoicesList` |
| `/invoices/upload` | `UploadInvoice` |
| `/invoices/:id` | `InvoiceDetail` |

- **Hooks:** `useInvoices`, `useInvoiceUpload`, `useInvoiceDetail`.
- **UI:** `InvoiceTable`, `InvoiceForm`, `InvoicePayments`, `ProductEditTable`, `UploadInvoiceSection`.
- **Utilidades:** `exportInvoicesToExcel.ts` genera el Excel mensual con `xlsx-js-style`.
- Cubre la [carga y gestión de facturas](../../../backend/docs/workflows/invoice-upload.md).

## `Products`

Ubicación: `src/layouts/Products/`

| Ruta | Página | Acceso |
|---|---|---|
| `/products/search` | `SearchProduct` | Autenticado |
| `/products/quotations` | `Quotations` | Autenticado |
| `/products/database` | `DatabaseProduct` | `admin` (`AdminProtected`) |

- **Hooks:** `useProductSearch`, `useSearchOptions`, `useProcessFile`, `useUpload`, `useLastUpdate`.
- **UI:** `searchproduct/` (búsqueda y tarjetas) y `databaseproduct/` (carga masiva, vista previa, resumen y errores).
- Cubre el [catálogo y reemplazo de productos](../../../backend/docs/workflows/product-replace.md).

## `SalesNotes`

Ubicación: `src/layouts/SalesNotes/`

| Ruta | Página |
|---|---|
| `/sales-notes` | `SalesNotesList` |
| `/sales-notes/new` | `CreateSalesNote` |
| `/sales-notes/:reference` | `SalesNoteDetail` |
| `/sales-notes/:reference/fiscal` | `UpdateFiscalStamp` |

Documentación detallada: [Notas de venta](./sales-notes.md).

## `Users`

Ubicación: `src/layouts/Users/` — todo el módulo está protegido con `AdminProtected`.

| Ruta | Página |
|---|---|
| `/users/all` | `UsersList` |
| `/users/invites` | `Invites` |

- **Hooks:** `useUsers`, `useInvites`.
- **UI:** `UserListTable`, `InviteForm`, `InviteList`.
- Cubre el [listado de usuarios](../../../backend/docs/workflows/users.md) y las [invitaciones](../../../backend/docs/workflows/invites.md).
