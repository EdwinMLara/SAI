# SAI System Backend

This repository contains the backend logic for the SAI system, including API endpoints, database connections, and business logic.

---

## Requirements

- Node.js >= 18.x (v22.15 or higher recommended)

## Project Structure

Main directory: `src/`

- `config/`: Database configuration and connection.
- `controllers/`: Business logic and endpoint controllers.
- `interfaces/`: TypeScript interfaces for business logic.
- `middlewares/`: Custom middlewares for validation and request handling.
- `models/`: Schemas and data access logic.
- `services/`: Services that interact directly with the database.
- `routes/`: API route definitions and handlers.
- `tests/`: Automated test cases.
- `types/`: Base types for system components.
- `utils/`: General utilities and helpers.
- `validations/`: Input validation logic.

---

## Installation and Getting Started

1. Clone the repository and navigate to the project directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root with the environment variables defined by the team (see below for required variables).
4. Start the server in development mode:
   ```bash
   npm run dev
   ```

---

## Environment Variables

Make sure your `.env` file is properly configured. Minimum required variables:

- `DATABASE_URL`: Database connection string.
- `NODE_ENV`: Environment mode (`development` or `production`).
- `JWT_SECRET`: Secret key for JWT signing and verification.
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key.
- `SUPABASE_URL`: Your Supabase project URL.

You can add other variables as needed for your environment.

---

## Documentation

- [Logging](./docs/Logging.md): Explains the logging configuration and usage.

---

## Testing

To run automated tests:

```bash
npm test
```

Before running tests, make sure any changes in models, interfaces, and controllers are reflected in the corresponding tests.

---

## Developer Notes

- When adding a new property to process and store in the database, ensure the changes are reflected in the interfaces and models sections. If needed, adjust the controllers accordingly. After implementing these updates, verify that the tests align with your modifications.

---

## Contributions

Currently, the repository is reserved for the INSOEL development team.
