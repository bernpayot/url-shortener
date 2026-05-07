import express from "express";
import urlRouter from "./routes/url.routes.js";
import { connectDatabase } from "./config/database.js";
import { connectRedis } from "./config/redis.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use("/", urlRouter);
app.use(errorHandler);

async function bootstrap() {
  await connectDatabase();
  await connectRedis();
  app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });
}

bootstrap().catch(console.error);
