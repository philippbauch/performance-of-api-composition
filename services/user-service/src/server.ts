import { expressLogger, logger } from "@/logger";
import cors from "cors";
import express from "express";
import { Request, Response } from "express";

logger.info(process.env.DB_HOST || "undefined");

const app = express();

const PORT = process.env.PORT || 8081;

// Middleware
app.use(cors());
app.use(expressLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

const boot = async () => {
  logger.info("Boot server");
  run();
};

const run = () => {
  logger.info("Start server");
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};

boot();
