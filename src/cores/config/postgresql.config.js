import { load } from "dotenv";
import { Pool } from "postgres";
import { logger } from "@/utils/logger.utils.js";

await load({ envPath: ".env", export: true });

const DATABASE_URL = Deno.env.get("DATABASE_URL");

if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
}

const pool = new Pool(DATABASE_URL, 3, true);
const client = await pool.connect();

// const client = new Client({
//     user: Deno.env.get("POSTGRESQL_USERNAME"),
//     password: Deno.env.get("POSTGRESQL_PASSWORD"),
//     database: Deno.env.get("POSTGRESQL_DBNAME"),
//     hostname: Deno.env.get("POSTGRESQL_HOST"),
//     port: Number(Deno.env.get("POSTGRESQL_PORT")),
// });

const postgresqlConnection = async () => {
    try {
        await client.queryObject("SELECT 1");
        client.release();
        logger.debug("The connection to PostgreSQL successfully.");
    } catch (error) {
        logger.error(`The connection to PostgreSQL failed: ${error}`);
    }
};

export { client, postgresqlConnection };
