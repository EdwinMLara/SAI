# SAI - Sistema de Administración INSOEL

Monorepo que contiene el backend (Node.js/TypeScript) y frontend (React/TypeScript) del Sistema de Administración INSOEL.

## 🚀 Configuración Inicial

### Instalación

```bash
npm install
```

Este comando instala todas las dependencias tanto de la raíz como de los workspaces (backend y client).

## 🛠️ Scripts Disponibles

### Desarrollo

- `npm run dev` - Ejecuta backend y client en paralelo
- `npm run dev:backend` - Solo ejecuta el backend en modo desarrollo
- `npm run dev:client` - Solo ejecuta el client en modo desarrollo

### Construcción

- `npm run build` - Construye todo el proyecto
- `npm run build:backend` - Construye solo el backend
- `npm run build:client` - Construye solo el client

### Linting

- `npm run lint` - Ejecuta linting en todo el código
- `npm run lint:fix` - Ejecuta linting y corrige automáticamente
- `npm run lint:backend` - Linting solo del backend
- `npm run lint:client` - Linting solo del client

## 📁 Estructura del Proyecto

```
sai/
├── .env                      # Variables de entorno compartidas
├── .prettierrc              # Configuración de Prettier
├── package.json             # Dependencias y scripts del monorepo
├── backend/                 # API Backend (Node.js + TypeScript)
├── client/                  # Frontend (React + TypeScript)
├── common/                  # Interfaces compartidas
└── packages/                # Paquetes compartidos
```

## 🔧 Variables de Entorno

El archivo `.env` en la raíz contiene todas las variables de entorno para ambos proyectos:

- **Backend**: Variables sin prefijo (NODE_ENV, SERVER_PORT, etc.)
- **Frontend**: Variables con prefijo VITE\_ (VITE_API_HOST, VITE_API_PORT, etc.)

## 📦 Gestión de Dependencias

### Dependencias Compartidas

Las siguientes dependencias se gestionan desde la raíz:

- `dotenv` - Variables de entorno
- `prettier` - Formateo de código
- `eslint` - Linting
- `typescript` - Soporte de TypeScript

### Dependencias Específicas

Cada workspace mantiene sus propias dependencias específicas:

**Backend:**

- Express, MongoDB, JWT, etc.

**Client:**

- React, Vite, Tailwind, etc.

## 🚀 Desarrollo

1. **Clonar el repositorio**

   ```bash
   git clone <repository-url>
   cd sai
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   - El archivo `.env` ya está configurado con valores de desarrollo

4. **Iniciar desarrollo**
   ```bash
   npm run dev
   ```

Esto iniciará:

- Backend en `http://localhost:5001`
- Frontend en `http://localhost:5173`

## 🏗️ Arquitectura

- **Monorepo**: Utilizando npm workspaces
- **Backend**: Node.js + TypeScript + Express + MongoDB
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Dependencias compartidas**: Gestionadas en la raíz del proyecto
- **Configuración unificada**: ESLint y Prettier compartidos

## 📄 Licencia

ISC
