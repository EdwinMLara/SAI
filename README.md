# SAI - INSOEL Administration System

Monorepo for backend (Node.js/TypeScript) and frontend (React/TypeScript).

## Quick Start

```bash
git clone <repository-url>
cd sai
npm install
```

## Main Scripts (root)

- `npm run dev` – Run backend and client in parallel
- `npm run lint` – Lint all workspaces
- `npm run lint:fix` – Lint and fix all workspaces
- `npm run prettier` – Check formatting
- `npm run format` – Format all code

## Structure

```
sai/
├── .env              # Shared environment variables
├── .prettierrc        # Prettier config
├── eslint.config.js   # ESLint config (flat config)
├── package.json       # Monorepo config & workspaces
├── package-lock.json  # Single lockfile for all
├── backend/           # API (Node.js + TypeScript)
├── client/            # Frontend (React + TypeScript)
├── common/            # Shared interfaces (optional)
└── docs/              # Documentation
```

## Environment Variables

- All variables are in the root `.env` file.
- Backend and client both read from this file.
- For frontend, use variables with the `VITE_` prefix.

## Dependencies

- Shared dev dependencies (eslint, prettier, typescript, etc.) are installed in the root.
- To add a dependency to a workspace:
   ```bash
   npm install <package> --workspace=backend
   npm install <package> --workspace=client
   # For devDependencies:
   npm install <package> -D --workspace=backend
   npm install <package> -D --workspace=client
   ```

## package-lock.json

- Only exists in the root. Do not add lockfiles in workspaces.

## Best Practices

- Keep shared dev dependencies in the root.
- Add specific dependencies only to the relevant workspace.
- Use root scripts for global tasks.
- Do not duplicate ESLint, Prettier, or config files.

## License

ISC
