import { Router } from "oak";
import { StatusCodes } from "http-status-codes";
import { postgresqlConnection } from "@/cores/config/postgresql.config.js";
import { sendSuccess } from "@/utils/response.utils.js";

const healthRouter = new Router();

// Health check endpoint
healthRouter.get("/health", async (ctx) => {
    try {
        // Test database connection
        await postgresqlConnection();
        
        // Return health status
        return sendSuccess(
            ctx,
            {
                status: "healthy",
                timestamp: new Date().toISOString(),
                database: "connected",
                service: "StreamShare Backend API"
            },
            StatusCodes.OK
        );
    } catch (error) {
        // If database connection fails, return unhealthy status
        ctx.response.status = StatusCodes.SERVICE_UNAVAILABLE;
        ctx.response.body = {
            status: "unhealthy",
            timestamp: new Date().toISOString(),
            database: "disconnected",
            service: "StreamShare Backend API",
            error: error.message
        };
    }
});

export default healthRouter;
