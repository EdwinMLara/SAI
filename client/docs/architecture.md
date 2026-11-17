# Arquitectura del cliente

## Objetivo

Lo esencial para moverse por el frontend: con qué está hecho, cómo arranca, cómo se arma el ruteo y cómo se protege. Si vienes del backend, la parte que más te va a interesar es la comunicación con la API.

## Con qué está hecho

- **React 19** + **TypeScript** (modo `strict`).
- **Vite 7** como servidor de desarrollo y empaquetador.
- **React Router 7** para el ruteo.
- **Tailwind CSS 3** para estilos (tema claro/oscuro por clase `dark`).
- **Axios** para las peticiones HTTP.
- **framer-motion** para animaciones de layout.
- **jsPDF + jspdf-autotable** para generar PDF; **qrcode** para el QR del sello fiscal; **xlsx / xlsx-js-style** para Excel.

## Arranque de la aplicación

Definido en `src/main.tsx` y `src/App.tsx`:

```
main.tsx
  → importa global.css
  → importa @config/axios.config.ts (efecto secundario: configuración global de Axios)
  → createRoot(...).render(<App />)

App.tsx
  → BrowserRouter
    → AuthProvider        (sesión del usuario)
      → SidebarProvider   (estado del menú lateral)
        → Theme           (tema claro/oscuro)
          → AppRoutes
```

El orden importa: `AuthProvider` usa `useNavigate`, por lo que debe estar dentro de `BrowserRouter`; `AppRoutes` consume los tres contextos.

## Estructura del proyecto

Directorio principal: `src/`

- `components/`
  - `ui/`: componentes base (`Alert`, `Button`, `Checkbox`, `Icon`, `IconButton`, `Input`, `InputFile`, `Loading`, `Message`) reexportados por `@ui`.
  - `semantic/`: estructura de la app (`Header`, `Sidebar`, `Headings`) y `items.ts` con la definición del menú de navegación.
  - `helpers/`: piezas auxiliares de presentación (`Brand`, `ToggleTheme`).
- `context/`: contextos globales (`Auth`, `Theme`, `Sidebar`).
- `core/`
  - `common/env.ts`: lectura de variables `VITE_*`.
  - `config/axios.config.ts`: instancia global de Axios e interceptor de sesión.
  - `interfaces/`: tipos de datos compartidos con la API.
  - `services/`: funciones por módulo que llaman a la API.
- `hooks/`: hooks globales (`useTokenRefresh`).
- `layouts/`: módulos de negocio (`Authentication`, `Invoices`, `Products`, `SalesNotes`, `Users`). Cada layout agrupa `config/` (ruteo), `pages/`, `hooks/`, `ui/` y `utils/`, y expone lo reutilizable desde su `index.ts`.
- `pages/`: páginas de nivel superior y de autenticación (`Home`, `MainLayout`, `Authentication`, `ForgotPassword`, `ResetPassword`, `ChangePassword`, `NotFound`, `Restricted`).
- `routes/`: `AppRoutes.tsx` y los guards `Protected` y `AdminProtected`.
- `assets/` y `public/`: logos e imágenes estáticas.

## Ruteo

Definido en `src/routes/AppRoutes.tsx`.

### Rutas públicas

| Ruta | Componente |
|---|---|
| `/auth` | `Authentication` (login y registro) |
| `/auth/forgot-password` | `ForgotPassword` |
| `/auth/reset-password` | `ResetPassword` |
| `/restricted` | `Restricted` |

### Rutas protegidas

Cuelgan de `MainLayout` (header + sidebar) y están envueltas por `Protected`:

| Ruta | Módulo |
|---|---|
| `/` | `Home` |
| `/account/change-password` | `ChangePassword` |
| `/products/*` | `layouts/Products` → `/search`, `/quotations`, `/database` |
| `/invoices/*` | `layouts/Invoices` → `/`, `/upload`, `/:id` |
| `/sales-notes/*` | `layouts/SalesNotes` → `/`, `/new`, `/:reference`, `/:reference/fiscal` |
| `/users/*` | `layouts/Users` → `/all`, `/invites` |

Cualquier ruta no declarada cae en `NotFound` (`*`).

### Guards

- **`Protected`**: mientras `isLoading` muestra `Loading`; si no hay sesión redirige a `/auth` conservando la ubicación de origen en `state.from`.
- **`AdminProtected`**: además de exigir sesión, comprueba que `user.role === 'admin'`; si no, redirige a `/restricted`. Se usa en `Users` (todo el módulo) y en `Products/database`.

### Cosas que no son obvias del ruteo

- `AdminProtected` **no** aparece en `AppRoutes.tsx`: se aplica dentro del `Routing.tsx` de cada layout. Si agregas una pantalla administrativa, envuélvela ahí, no en las rutas generales.
- `AppRoutes` monta los módulos con `path="modulo/*"`; las rutas internas se definen con rutas relativas (`/`, `/new`, `/:id`), no con la ruta completa.
- Tanto `@/...` como `@...` funcionan, pero el resto del código usa sobre todo `@/` para páginas/contextos y `@services`, `@ui`, etc. para lo demás. No hay una regla estricta; sigue lo que ya hace el archivo que estés tocando.

## Contextos

### `Auth.context.tsx`

Mantiene `user`, `isAuthenticated` e `isLoading`.

- **Arranque**: consulta `GET /auth/session`. Si el access expiró pero el refresh es válido, llama a `GET /auth/refresh`.
- **`login` / `register`**: invocan los servicios y, al tener éxito, restauran la sesión.
- **`logout`**: llama a `POST /auth/logout` y limpia el estado.
- **Evento `auth:logout`**: escucha el evento global que dispara el interceptor de Axios cuando el refresh falla, limpia la sesión y navega a `/auth/login`.

### `Theme.context.tsx`

- Inicializa el tema desde `localStorage` o desde `prefers-color-scheme`.
- Aplica/quita la clase `dark` en `<html>`.
- Escucha cambios del tema del sistema sólo si el usuario no ha elegido uno manualmente.

### `Sidebar.context.tsx`

- Controla apertura/cierre del menú (`isOpen`, `toggle`, `open`, `close`).
- En pantallas menores a `768px` inicia cerrado y reacciona al `resize`.

## Comunicación con la API

Todo pasa por `src/core/config/axios.config.ts`, que se importa una sola vez en `main.tsx`. En corto:

- `baseURL: '/api'`, `withCredentials: true` y `timeout: 300000`.
- En desarrollo, el proxy de `vite.config.ts` manda `/api` al backend.
- El interceptor normaliza las respuestas y renueva el access token cuando el backend responde `401` con `refresh: true` y `access: false`.
- `useTokenRefresh` revisa la sesión cada 5 minutos como red de seguridad.

El detalle del envelope, los errores y la renovación está en [Servicios y comunicación con la API](./core/services.md).

## Alias de importación

Configurados en `vite.config.ts` y `tsconfig.json`:

| Alias | Ruta |
|---|---|
| `@` | `src` |
| `@components` | `src/components` |
| `@ui` | `src/components/ui` |
| `@services` | `src/core/services` |
| `@interfaces` | `src/core/interfaces` |
| `@common` | `src/core/common` |
| `@config` | `src/core/config` |
| `@pages` | `src/pages` |
| `@hooks` | `src/hooks` |
| `@context` | `src/context` |
| `@layouts` | `src/layouts` |
| `@routes` | `src/routes` |

La configuración conserva alias heredados sin carpeta asociada (`@managment`, `@contexts`, `@utils`); no se usan actualmente. Al crear una carpeta consumible por alias hay que registrarla en **ambos** archivos.

## Variables de entorno

Vite expone únicamente variables con prefijo `VITE_`. Se leen en `src/core/common/env.ts`:

- `VITE_NODE_ENV`: `development` o `production` (por defecto `development`).
- `VITE_SERVER_IP` / `VITE_SERVER_PORT`: referencia del backend.
- `VITE_API_HOST` / `VITE_API_PORT`: destino del proxy de Vite (usadas en `vite.config.ts`).

Consulta [`.env.example`](../.env.example) para la plantilla.

## Scripts

- `npm run dev`: servidor de desarrollo con `--host`.
- `npm run build`: verificación de tipos (`tsc -b`) y build de producción.
- `npm run lint`: ESLint.
- `npm run preview`: sirve el build de producción.

## Pendientes

- No hay tests configurados todavía. Si se agregan, conviene empezar por los servicios y por el cálculo de notas de venta, que es lo más fácil de romper sin darse cuenta.
- Los alias `@managment`, `@contexts` y `@utils` siguen declarados aunque no existan sus carpetas. No estorban, pero conviene limpiarlos cuando se toque la configuración.
