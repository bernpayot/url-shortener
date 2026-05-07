import express from "express";
import { connectDatabase } from "./config/database.js";
import { connectRedis } from "./config/redis.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

async function bootstrap() {
  await connectDatabase();
  await connectRedis();
  app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });
}

bootstrap().catch(console.error);
