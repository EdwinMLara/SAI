class AppError extends Error {
  public statusCode: number;
  public originalError?: unknown;

  constructor(message: string, statusCode: number = 500, originalError?: unknown) {
    super(message || 'Internal server error');
    Object.setPrototypeOf(this, AppError.prototype);
    this.statusCode = statusCode;
    if (originalError) {
      this.originalError = originalError;
    }
  }
}

export default AppError;
