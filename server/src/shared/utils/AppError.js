/**
 * App Error - Custome error class for handling application-specfic errors with additional context.
 * This class can be extended in the future to include additional properties or methods as needed.
 */
 
class AppError extends Error {
    constructor(message, statusCode = 500 , errors = null) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.errors = errors;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;