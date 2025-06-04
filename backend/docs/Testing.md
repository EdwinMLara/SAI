# Testing Documentation

## Overview

The project uses Jest and Supertest to perform automated testing on application controllers. These tests ensure correct functionality and help identify issues early during development.

## Configuration

The file `jest.config.ts` contains all necessary configurations to run tests located in `/tests/`. Ensure the dependencies are properly installed to avoid compilation errors.

### Steps to Set Up Tests

- Install required packages
-

## Folder Structure

- **`tests/`**: Contains all test files
- **`tests/mocks/`**: Stores custom mocks for isolating components and improving code cleanliness
- **`tests/assets/`**: Holds digital assets used for simulating database uploads

## How to Implement a Test

### Create a New Test

1. Use the naming convention `controller_name.controller.test.ts` for test files.
2. Create mocks (if needed) in `mocks/controller_name.controller.mock.ts`.
3. Import relevant models and mocks.

### Example Test Structure

```typescript
import supertest from 'supertest';
import app from '../src/app';
import * as mockController from './mocks/controller_name.controller.mock';

const request = supertest(app);

describe('Test for MyController', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks
  });

  it('should handle successful creation', async () => {
    jest
      .spyOn(mockController, 'create')
      .mockResolvedValue({ id: 1, name: 'Test' });

    const response = await request
      .post('/api/resource')
      .send({ name: 'Test' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
```

### Key Practices

1. **Isolate functionality**: Use mocks to avoid external dependencies.
2. **Cover all cases**: Test success scenarios, edge cases, and errors.
3. **Use specific assertions**: Verify both status codes and response structure.
4. **Ensure independence**: Each test should run independently.

## Running Tests

```bash
# Run tests
npm test
```

## Mocking Guidelines

- **Service Mocks**:

  ```typescript
  jest.spyOn(service, 'methodName').mockResolvedValue(mockData);
  ```

- **Database Mocks**:

  ```typescript
  jest.spyOn(Model, 'functionName').mockResolvedValue(mockResult);
  ```

- **External API Mocks**:
  ```typescript
  jest.spyOn(axios, 'get').mockResolvedValue({ data: apiResponse });
  ```
