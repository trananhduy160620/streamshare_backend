import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { sendError } from "@/utils/response.utils.js";

export const validateBody = (schema) => async (ctx, next) => {
    try {
        const body = ctx.state.body;
        if (!body) {
            return sendError(
                ctx,
                "Request body is missing",
                StatusCodes.BAD_REQUEST
            );
        }

        schema.parse(body);

        await next();
    } catch (err) {
        if (err instanceof z.ZodError) {
            const formattedErrors = err.issues.map((e) => ({
                path: e.path.join("."),
                message: e.message,
            }));
            console.log(err)
            return sendError(
                ctx,
                "Validation failed",
                StatusCodes.BAD_REQUEST,
                err.issues,
                formattedErrors
            );
        }
    }
};
