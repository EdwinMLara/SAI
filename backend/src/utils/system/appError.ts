import res from '@system/responses';

class AppError extends Error {
   public statusCode: number;
   public originalError?: unknown;

   constructor(
      message: string,
      statusCode: number = 500,
      originalError?: unknown
   ) {
      super(message || res.system.serverError);
      Object.setPrototypeOf(this, AppError.prototype);
      this.statusCode = statusCode;
      if (originalError) {
         this.originalError = originalError;
      }
   }
}

export default AppError;
