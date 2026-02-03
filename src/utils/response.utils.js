import { StatusCodes, ReasonPhrases } from "http-status-codes";

/**
 * Send success response (Deno / Oak)
 * @param {Context} ctx - Oak context
 * @param {string} message - Response message
 * @param {object} data - Payload
 * @param {number} statusCode - HTTP status
 */
export const sendSuccess = (
    ctx,
    message,
    data = {},
    statusCode = StatusCodes.OK
) => {
    ctx.response.status = statusCode;
    ctx.response.body = {
        success: true,
        message,
        data,
    };
};

/**
 * Send error response (Deno / Oak)
 * @param {Context} ctx - Oak context
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status
 * @param {string|null} errorCode - Business error code
 */
export const sendError = (
    ctx,
    message,
    statusCode = StatusCodes.BAD_REQUEST,
    errorCode = null,
    details = null
) => {
    ctx.response.status = statusCode;
    ctx.response.body = {
        success: false,
        statusCode,
        message,
        errorCode,
        error: ReasonPhrases[statusCode] ?? "Error",
        details: details,
    };
};
