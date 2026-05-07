import { createClient } from "redis";
import requireEnv from "./env.checker.js";

const client = createClient({
  url: requireEnv("REDIS_URL"),
});

async function connectRedis(): Promise<void> {
  await client.connect();
  console.log("Successfully connected to Redis.");
}

client.on("error", (err: Error) => {
  console.error("Redis connection error:", err);
});

export { client, connectRedis };
