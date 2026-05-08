import express from "express";
import path from "path";
import urlRouter from "./routes/url.routes.js";
import * as viewController from "./controllers/view.controllers.js";
import { connectDatabase } from "./config/database.js";
import { connectRedis } from "./config/redis.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.get("/", viewController.renderIndex);
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
