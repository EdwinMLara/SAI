# Logging with Winston / Registro de logs con Winston

### Overview

This project uses [Winston](https://github.com/winstonjs/winston) as the logging library to manage logs effectively across different environments (development, production). Below is a guide to understanding the configuration and usage.

### Configuration

The logger is configured in `src/utils/logger.ts` and adapts to the `NODE_ENV` environment variable:

- **`debug` level**: Used in development mode for detailed logs.
- **`info` level**: Used in production mode to show only essential logs.

export default logger;

### Usage

Import the `logger` object to log messages anywhere in your project:

```typescript name=src/index.ts
import logger from './utils/logger';

// Example logs
logger.debug('This is a debug message');
logger.info('This is an informational message');
logger.error('This is an error message');
```

### Practices

1. **Log Levels**:

   - Use `debug` for verbose details during development.
   - Use `info` for general events in production.
   - Use `error` for critical issues.

2. **Do not overuse logging**:
   - Log only meaningful and actionable information.
