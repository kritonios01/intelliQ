class UsageError extends Error {
    constructor(msg, statusCode) {
        super(msg);

        this.statusCode = statusCode;
        this.error = `error`;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = UsageError;