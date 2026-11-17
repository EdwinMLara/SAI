# SAI System Backend

Lógica del backend del sistema SAI: API REST, conexión a base de datos y lógica de negocio.

---

## Requisitos

- Node.js >= 18.x (se recomienda v22.15 o superior)
- MongoDB Atlas (el tier gratuito M0 es suficiente; ver [consideraciones](./docs/workflows/product-replace.md))
- Proyecto Supabase con los buckets de almacenamiento configurados

## Estructura del proyecto

Directorio principal: `src/`

- `config/`: Configuración y conexión de base de datos, correo (SMTP) y Supabase.
- `controllers/`: Controladores de los endpoints (validación de entrada y orquestación).
- `helpers/`: Lógica de validación y previa de cada módulo (unicidad, existencia, parseo XML).
- `interfaces/`: Interfaces de TypeScript de la lógica de negocio.
- `middlewares/`: Middlewares de autenticación, validación de peticiones, respuestas, errores y subida de archivos.
- `models/`: Esquemas Mongoose (incluye `models/extras/`).
- `routes/`: Definición de rutas (`api.routes.ts` y `routes/modules/`).
- `services/`: Servicios que interactúan directamente con la base de datos y Supabase.
- `types/`: Tipos base del sistema (incluye la extensión de `Express.Request`).
- `utils/`: Utilidades generales: manejo de errores, tokens, cookies, logging, respuestas y validación de entorno.

---

## Instalación y puesta en marcha

1. Clonar el repositorio y ubicarse en la carpeta `backend/`.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Crear un archivo `.env` en la raíz del proyecto con las variables de entorno (ver [.env.example](./.env.example)).
4. Iniciar el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

Scripts disponibles:

- `npm run dev`: servidor con recarga automática (nodemon + ts-node).
- `npm run lint`: verificación de código con ESLint.

---

## Variables de entorno

`src/utils/env.ts` valida que estén definidas **todas** estas variables al arrancar; si falta alguna, el proceso falla con `Missing environment variable: <NOMBRE>`:

- `NODE_ENV`: Modo de entorno (`development` o `production`).
- `MONGO_URI`: Cadena de conexión a MongoDB Atlas.
- `SUPA_URL`: URL del proyecto Supabase.
- `SUPA_KEY`: Clave de acceso de Supabase.
- `JWT_SECRET`: Clave secreta para firmar y verificar los JWT (sesión y reset).
- `BUCKET_DOCS`: Nombre del bucket de Supabase para documentos (PDF de facturas).
- `BUCKET_TICKET`: Nombre del bucket de Supabase para tickets/comprobantes.
- `SERVER_IP`: IP en la que escucha Express.
- `SERVER_PORT`: Puerto en el que escucha Express.
- `ORIGIN_SERVER`: URL pública del cliente (se usa para generar el enlace de restablecimiento de contraseña).
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`: Configuración del servidor de correo para envío de notificaciones.

Consulta [.env.example](./.env.example) para una plantilla lista para completar.

---

## Documentación

La documentación completa está en [docs/index.docs.md](./docs/index.docs.md):

- [Referencia de la API](./docs/api-reference.md)
- [Arquitectura del backend](./docs/architecture.md)
- [Logging](./docs/Logging.md): configuración y uso del registro de eventos.
- [Flujos de trabajo](./docs/workflows/register.md): registro, login, sesión, contraseñas, invitaciones, usuarios, facturas, notas de venta, productos y archivos.
- [Modelado de la base de datos](./docs/datadase/modelado.md)

---

## Notas para desarrolladores

- Al añadir una propiedad que se almacene en la base de datos, refleja el cambio en las `interfaces/` y en el `models/` correspondiente, y ajusta los `controllers/` y `services/` si es necesario.
- Los mensajes de respuesta deben agregarse al catálogo centralizado en `src/utils/responses/` en lugar de escribirlos en los controladores.
- Al crear una nueva carpeta consumible por alias, regístrala en `tsconfig.json` (`paths`).

## Pruebas

Todavía no hay infraestructura de tests configurada (Jest está instalado como dependencia de desarrollo, pero falta la configuración y los casos de prueba). Este apartado se actualizará cuando se incorporen.

---

## Contribuciones

Actualmente el repositorio está reservado para el equipo de desarrollo de INSOEL.
