import { StatusCodes } from "http-status-codes";
import { verifyToken } from "@/utils/jwt.utils.js";
import { sendError } from "@/utils/response.utils.js";

const authenticateToken = async (ctx, next) => {
    try {
        const header = ctx.request.headers.get("Authorization");
        if (!header || !header.startsWith("Bearer ")) {
            return sendError(
                ctx,
                "Access Denied: No token provided.",
                StatusCodes.FORBIDDEN,
            );
        }

        const token = header.split(" ")[1];
        const decoded = await verifyToken({ token });

        if (!decoded) {
            return sendError(
                ctx,
                "Invalid or expired token.",
                StatusCodes.FORBIDDEN,
            );
        }

        ctx.state.user = decoded;
        await next();
    } catch (err) {
        return sendError(
            ctx,
            "Authentication failed.",
            StatusCodes.UNAUTHORIZED,
            err,
        );
    }
};

export default authenticateToken;
