# Use official Deno runtime image
FROM denoland/deno:1.46.3

# Set working directory
WORKDIR /app

# Copy package management files
COPY deno.json deno.lock ./

# Copy source code
COPY src/ ./src/
COPY app.js ./

# Create .env file (environment variables will be injected by Render)
# Note: In production, Render will provide these as environment variables
RUN echo "PORT=3999" > .env

# Cache dependencies for faster builds
RUN deno cache --lock=deno.lock app.js

# Expose the port the app runs on
EXPOSE 3999

# Health check endpoint (optional but recommended)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3999/api/v1/health || exit 1

# Command to run the application
CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read=.env", "app.js"]
