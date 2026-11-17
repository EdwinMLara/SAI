# SAI System Client

Frontend del Sistema de Administración INSOEL (SAI): interfaz de usuario, ruteo, sesión y comunicación con la API.

---

## Requisitos

- Node.js **22.15.0** (versión definida en `package.json`).
- Backend del SAI en ejecución (ver [backend/README.md](../backend/README.md)).

## Estructura del proyecto

Directorio principal: `src/`

- `components/`: componentes base (`ui/`), estructura visual (`semantic/`) y helpers de presentación.
- `context/`: contextos globales de sesión, tema y menú lateral.
- `core/`: configuración de Axios, variables de entorno, interfaces y servicios por módulo.
- `hooks/`: hooks globales (`useTokenRefresh`).
- `layouts/`: módulos de negocio (autenticación, facturas, notas de venta, productos y usuarios).
- `pages/`: páginas de nivel superior y de autenticación.
- `routes/`: definición de rutas y guards (`Protected`, `AdminProtected`).

---

## Instalación y puesta en marcha

1. Ubicarse en la carpeta `client/`.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Crear un archivo `.env` a partir de [`.env.example`](./.env.example) y completar los valores.
4. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

Scripts disponibles:

- `npm run dev`: servidor de desarrollo de Vite (`--host`).
- `npm run build`: verificación de tipos y build de producción.
- `npm run lint`: verificación de código con ESLint.
- `npm run preview`: sirve el build de producción.

---

## Variables de entorno

Todas las variables del cliente deben llevar el prefijo `VITE_`:

- `VITE_NODE_ENV`: `development` o `production`.
- `VITE_API_HOST` / `VITE_API_PORT`: destino del proxy de Vite para `/api` (por defecto `localhost:3000`).
- `VITE_SERVER_IP` / `VITE_SERVER_PORT`: referencia del servidor backend.

Consulta [`.env.example`](./.env.example) para la plantilla.

---

## Documentación

La documentación completa está en [docs/index.docs.md](./docs/index.docs.md):

- [Arquitectura del cliente](./docs/architecture.md): stack, arranque, ruteo, contextos y alias.
- [Servicios y comunicación con la API](./docs/core/services.md): Axios, sesión y catálogo de servicios.
- [Visión general de los módulos](./docs/layouts/index.md)
- [Notas de venta](./docs/layouts/sales-notes.md): páginas, hooks, cálculo de importes y PDF.
- [Catálogo de componentes de UI](./docs/ui/index.ui.md)

La API que consume el cliente está documentada en [backend/docs/index.docs.md](../backend/docs/index.docs.md).

---

## Notas para desarrolladores

- Las vistas no llaman a Axios directamente: usan los servicios de `src/core/services/`.
- Los tipos compartidos con la API viven en `src/core/interfaces/`.
- Al crear una carpeta consumible por alias, regístrala en `vite.config.ts` y en `tsconfig.json` (no en `tsconfig.app.json`, que no define `paths`).
- Los textos visibles para el usuario van en español.
- Usa `Loading` para estados de carga y `Message` para avisos y errores.
- Ojo con el interceptor de Axios: no rechaza las promesas ante errores HTTP. Si tu servicio no valida `status`, un `try/catch` no va a atrapar el `400`. En notas de venta se usa `ensureOk` para lanzar el error explícitamente; sigue ese patrón en servicios nuevos.

---

## Pruebas

Todavía no hay infraestructura de tests configurada en el cliente. Este apartado se actualizará cuando se incorporen.

---

## Contribuciones

Actualmente el repositorio está reservado para el equipo de desarrollo de INSOEL.
