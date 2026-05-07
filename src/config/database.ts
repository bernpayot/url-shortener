import "dotenv/config";
import { Pool } from "pg";
import requireEnv from "./env-checker.js";

const pool = new Pool({
  host: requireEnv("DB_HOST"),
  port: Number(requireEnv("DB_PORT")),
  user: requireEnv("DB_USER"),
  password: requireEnv("DB_PASSWORD"),
  database: requireEnv("DB_NAME"),
});

async function connectDatabase(): Promise<void> {
  try {
    const client = await pool.connect();

    await client.query("SELECT 1");
    console.log("Successfully connected to postgresql database.");

    client.release();
  } catch (err) {
    console.error("Postgresql Database connection error:", err);
    process.exit(1);
  }
}

export { pool, connectDatabase };
