# Backend for SAI System

Contains the backend logic for the SAI system, including API endpoints, database connections, and business logic.

## Structure

### From `src/`

- `docs/`: Contains documentation for the backend, including configuration and usage guides.
- `routes/`: Defines the API endpoints and their handlers.
- `controllers/`: Implements the business logic for the application.
- `models/`: Defines the database schemas and data access logic.
- `middlewares/`: Contains custom middleware functions for request handling and validation.
- `tests/`: Includes test cases for controller validation.

## Setup

1. Run `npm install` to install all project dependencies.
2. Use `npm run dev` to start the development server in watch mode (for live updates during development).

## Documentación

- [Logging](./docs/Logging.md): Explains the logging configuration and how to use it.
- [Testing](./docs/Testing.md): Explains the test configuration and how to use it.

## Notes

About changes

- When adding a new property to process and store in the database, ensure the changes are reflected in the interfaces and models sections. If needed, adjust the controllers accordingly. After implementing these updates, verify that the tests align with your modifications. Once complete, you may run a test validation using: `npm test`

Ensure the `.env` file is properly configured. At a minimum, it should include:

- `DATABASE_URL`: The connection string for the database.
- `NODE_ENV`: The environment mode (`development`, `production`, etc.).
