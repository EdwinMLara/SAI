/**
 * Custom error class for application-specific errors
 * Extends the base Error class with HTTP status codes and original error tracking
 * Used throughout the application for consistent error handling and logging
 */
class AppError extends Error {
   public statusCode: number;
   public originalError?: unknown;

   /**
    * Creates a new AppError instance
    * @param message - Error message describing what went wrong
    * @param statusCode - HTTP status code (defaults to 500)
    * @param originalError - Optional original error object for debugging
    */
   constructor(
      message: string,
      statusCode: number = 500,
      originalError?: unknown
   ) {
      super(message || 'Internal server error');
      Object.setPrototypeOf(this, AppError.prototype);
      this.statusCode = statusCode;
      if (originalError) {
         this.originalError = originalError;
      }
   }
}

export default AppError;
