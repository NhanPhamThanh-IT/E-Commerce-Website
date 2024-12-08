class MyError extends Error {
    constructor(statusCode, message, desc = '') {
        super(message);
        this.statusCode = statusCode;
        this.desc = desc;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = MyError;