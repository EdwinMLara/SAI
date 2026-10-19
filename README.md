# SAI - Sistema de Administración INSOEL

This service is designed for processing and storing documents for INSOEL.

**Please review the documentation included in each independent folder before attempting any changes.**

## Structure

`Client` Contains the frontend of the SAI system, including UI components and client-side logic.  
`Backend` Contains the backend logic for the SAI system, including API endpoints, database connections, and business logic.

## Node Version

The defined Node.js engine version for this project is **22.15.0**. Please ensure you are using this version for development and deployment.

## Installation

1. Clone the repository
2. Select the branch you decide to collaborate on and start by installing the dependencies of the defined workspace

### Recommendation

You may install the `nodemon` dependency globally to streamline testing during development:

```bash
npm install -g nodemon
```

## Requirements

1. Environment variables are required. Each workspace includes a `.env.example` file as a template — copy it to `.env` and fill in the values, or request them from the team.

## Documentation

- [Backend documentation index](./backend/docs/index.docs.md)

## Internal Contributions

1. Create a personal branch.
2. Create feature-specific branches.
3. Frequently sync external changes.
4. Test Commit
