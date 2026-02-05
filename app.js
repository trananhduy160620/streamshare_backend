// Import required dependencies for the application
import { load } from "dotenv"; // Load environment variables from .env file
import { Application as App } from "oak"; // Oak framework for HTTP server
import { oakCors } from "oak_cors"; // CORS middleware for cross-origin requests
import { StatusCodes } from "http-status-codes"; // HTTP status codes constants
import { logger } from "@/utils/logger.utils.js"; // Custom logger utility
import { postgresqlConnection } from "@/cores/config/postgresql.config.js"; // Database connection
import {
    userRouter,
    mediaRouter,
    ratingRouter,
    healthRouter,
} from "@/routers/index.js"; // API route handlers
import { parseFormBody } from "@/utils/parse.utils.js"; // Form data parsing utility
import { registerRouters } from "@/utils/router.utils.js"; // Router registration utility
import { sendError } from "@/utils/response.utils.js"; // Error response utility

// Load environment variables from .env file and make them available globally
// This includes database credentials, JWT secrets, port configuration, etc.
await load({ envPath: ".env", export: true });

// Initialize Oak application instance
// This will handle HTTP requests, middleware, and routing
const app = new App();

// Configure CORS (Cross-Origin Resource Sharing) middleware
// Allows frontend applications from different origins to access this API
app.use(
    oakCors({
        origin: "*", // Allow requests from any origin (configure appropriately for production)
    }),
);

// Global Error Handling Middleware
// Catches all unhandled errors throughout the application
// Provides consistent error response format and logging
app.use(async (ctx, next) => {
    try {
        // Continue to the next middleware or route handler
        await next();
    } catch (err) {
        // Log the error for debugging purposes
        logger.error(`Unhandled error: ${err}`);

        // Send standardized error response to client
        return sendError(
            ctx, // Oak context object
            "Internal server error", // User-friendly error message
            StatusCodes.INTERNAL_SERVER_ERROR, // HTTP 500 status code
            err?.message ?? err, // Detailed error message (if available)
            null, // Additional error data (if any)
        );
    }
});

// Body Parser Middleware
// Processes incoming request bodies and parses them into usable format
// Supports both JSON and form-encoded data
app.use(async (ctx, next) => {
    // Skip parsing if request has no body
    if (!ctx.request.hasBody) return await next();

    // Get content type from request headers
    const contentType = ctx.request.headers.get("content-type") || "";
    let payload = null;

    // Handle JSON data (most common for APIs)
    if (contentType.includes("application/json")) {
        // Parse JSON body and store in ctx.state.body for downstream handlers
        payload = await ctx.request.body({ type: "json" }).value;
        ctx.state.body = payload;
    }
    // Handle form data (for file uploads or traditional forms)
    else if (contentType.includes("application/x-www-form-urlencoded")) {
        const formPayload = await ctx.request.body({ type: "form" }).value;

        // Convert URLSearchParams to object
        if (formPayload instanceof URLSearchParams) {
            ctx.state.body = parseFormBody(formPayload);
        }
        // Handle object form data
        else if (typeof formPayload === "object") {
            ctx.state.body = formPayload;
        }
        // Default to empty object if parsing fails
        else {
            ctx.state.body = {};
        }
    }

    // Continue to next middleware or route handler
    await next();
});

// Register API Routes
// Sets up all application endpoints with their respective prefixes
// Organizes routes by feature (users, media, ratings)
registerRouters(app, [
    { router: userRouter, prefix: "/api/v1/users" }, // User management endpoints
    { router: mediaRouter, prefix: "/api/v1/media" }, // Media management endpoints
    { router: ratingRouter, prefix: "/api/v1/ratings" }, // Rating management endpoints
    { router: healthRouter, prefix: "/api/v1" }, // Health check endpoint
]);

// Main Application Bootstrap Function
// Initializes database connection and starts the HTTP server
const runApp = async () => {
    try {
        // Get port from environment variables or default to 5555
        const port = Number(Deno.env.get("PORT") ?? 5555);

        // Log server startup message
        logger.debug(`Server running on http://localhost:${port}.`);

        // Initialize PostgreSQL database connection
        await postgresqlConnection();

        // Start listening for HTTP requests
        await app.listen({ port: port });
    } catch (error) {
        // Log any startup errors
        logger.error(`Run Application failed: ${error}.`);
    }
};

// Start the application
// This is the entry point that kicks off the entire server
await runApp();
