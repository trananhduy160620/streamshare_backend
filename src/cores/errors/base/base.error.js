import { StatusCodes } from "http-status-codes";

export class BaseError extends Error {
    constructor({
        message,
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
        errorCode = "UNKNOWN_ERROR",
        details = null,
    }) {
        super(message);

        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.details = details;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    toJSON() {
        return {
            success: false,
            error: {
                name: this.name,
                message: this.message,
                code: this.errorCode,
                statusCode: this.statusCode,
                details: this.details,
            },
        };
    }
}
