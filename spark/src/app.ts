import express from "express";
import { config } from "dotenv";
import { logger } from "./logger/logger";
import { enqueueAnalysis } from "./queue/producer";
import { githubWebhookRouter } from "./integrations/github/webhook.handler";

config();

const app = express();

const PORT = Number(process.env.PORT ?? 3002);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "spark",
  });
});

app.use(
  "/webhooks/github",
  // Express middleware to read request as raw Buffer and not parse it as JSON
  // Required for secure signature validation
  express.raw({ type: "application/json" }),
  githubWebhookRouter,
);

app.listen(PORT, () => {
  logger.log(`Spark running on port ${PORT}`);
});
