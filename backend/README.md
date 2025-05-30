# Backend for SAI System

Contains the backend logic for the SAI system, including API endpoints, database connections, and business logic.

## Structure

### From `src/`

- `docs/`: Contains documentation for the backend, including configuration and usage guides.
- `routes/`: Defines the API endpoints and their handlers.
- `controllers/`: Implements the business logic for the application.
- `models/`: Defines the database schemas and data access logic.
- `middlewares/`: Contains custom middleware functions for request handling and validation.

## Setup

1. Run `npm install` to install all project dependencies.
2. Use `npm run dev` to start the development server in watch mode (for live updates during development).

## Documentación

- [Logging](./docs/LOGGING.md): Explains the logging configuration and how to use it.

## Notes

Ensure the `.env` file is properly configured. At a minimum, it should include:

- `DATABASE_URL`: The connection string for the database.
- `NODE_ENV`: The environment mode (`development`, `production`, etc.).
