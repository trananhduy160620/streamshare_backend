import { load } from "dotenv";
import { Client } from "postgres";
import { logger } from "@/utils/logger.utils.js";

await load({ envPath: ".env", export: true });

const client = new Client({
    user: Deno.env.get("POSTGRESQL_USERNAME"),
    password: Deno.env.get("POSTGRESQL_PASSWORD"),
    database: Deno.env.get("POSTGRESQL_DBNAME"),
    hostname: Deno.env.get("POSTGRESQL_HOST"),
    port: Number(Deno.env.get("POSTGRESQL_PORT")),
});

const postgresqlConnection = async () => {
    try {
        await client.connect();
        logger.debug("The connection to PostgreSQL successfully.");
    } catch (error) {
        logger.error(`The connection to PostgreSQL failed: ${error}`);
    }
};

export { client, postgresqlConnection };
