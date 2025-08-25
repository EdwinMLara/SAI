# Documentación del Monorepo SAI

## Estructura General

```
sai/
├── backend/        # API y lógica de servidor (Node.js + TypeScript)
├── client/         # Frontend (React + TypeScript)
├── common/         # Interfaces y tipos compartidos (opcional)
├── docs/           # Documentación del proyecto
├── package.json    # Configuración principal y workspaces
├── package-lock.json
├── .env            # Variables de entorno compartidas
├── .prettierrc     # Configuración de Prettier
├── eslint.config.js# Configuración de ESLint (flat config)
└── ...
```

## Instalación de dependencias

- Para instalar todas las dependencias de todos los workspaces:
  ```bash
  npm install
  ```
  o
  ```bash
  npm run install:all
  ```

- Para instalar una dependencia solo en un workspace:
  ```bash
  npm install <paquete> --workspace=backend
  npm install <paquete> --workspace=client
  ```
  Para devDependencies:
  ```bash
  npm install <paquete> -D --workspace=backend
  npm install <paquete> -D --workspace=client
  ```

## Scripts principales (desde la raíz)

- `npm run dev`        → Ejecuta backend y client en paralelo
- `npm run lint`       → Lint para ambos workspaces
- `npm run lint:fix`   → Lint con fix para ambos
- `npm run prettier`   → Verifica formato con Prettier
- `npm run format`     → Formatea todo con Prettier

## Variables de entorno

- Todas las variables están en el archivo `.env` de la raíz.
- El backend y el client leen desde este archivo.
- Para el frontend, usa variables con prefijo `VITE_`.

## package-lock.json

- Solo existe en la raíz. No debe haber package-lock.json en los workspaces.

## Buenas prácticas

- Mantén dependencias compartidas en la raíz.
- Solo agrega dependencias específicas en el workspace correspondiente.
- Usa los scripts de la raíz para tareas globales.
- No dupliques configuraciones de ESLint, Prettier, etc.

## ¿Dudas?

¡Pregunta a tu equipo o revisa este archivo antes de modificar la estructura!
