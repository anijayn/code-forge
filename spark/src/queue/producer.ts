import { Queue } from "bullmq";
import { config } from "dotenv";
import { QUEUES } from "./constants";
import { PrJobPayload } from "./types";

config();

const analyzePrQueue = new Queue(QUEUES.ANALYZE_PR, {
  connection: {
    host: process.env.REDIS_HOST ?? "localhost",
    port: Number(process.env.REDIS_PORT ?? 6379),
  },
});

export async function enqueueAnalysis(payload: PrJobPayload): Promise<void> {
  await analyzePrQueue.add(QUEUES.ANALYZE_PR, payload);
}
