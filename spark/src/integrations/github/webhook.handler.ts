import { Router } from "express";
import { enqueueAnalysis } from "../../queue/producer";
import { logger } from "../../logger/logger";
import { GitHubPullRequestEvent } from "./types";
import { HANDLED_ACTIONS } from "./constants";
import { validateSignature } from "./signature";

export const githubWebhookRouter = Router();

githubWebhookRouter.post("/", async (req, res) => {
  const event = req.headers["x-github-event"];

  // Ignores other events than pull requests
  if (event !== "pull_request") {
    logger.log(`Ignoring event ${event}`);

    res.status(200).json({
      message: "ignored",
    });

    return;
  }

  const payload = JSON.parse(
    (req.body as Buffer).toString(),
  ) as GitHubPullRequestEvent;

  // Ignores other actions other than open/synchronize
  if (!HANDLED_ACTIONS.has(payload.action)) {
    logger.log(`Ignoring action ${payload.action}`);

    res.status(200).json({
      message: "ignored",
    });

    return;
  }

  res.status(200).json({
    message: "accepted",
  });

  const signature = req.headers["x-hub-signature-256"] as string | undefined;
  const secret = process.env.GITHUB_WEBHOOK_SECRET ?? "";

  // Ignores payloads with mismatching signature
  if (!validateSignature(req.body as Buffer, signature, secret)) {
    logger.warn("Invalid signature");

    res.status(401).json({
      error: "Invalid signature",
    });

    return;
  }

  try {
    await enqueueAnalysis({
      prNumber: payload.pull_request.number,
      repoFullName: payload.repository.full_name,
      headSha: payload.pull_request.head.sha,
      baseBranch: payload.pull_request.base.ref,
      title: payload.pull_request.title,
      author: payload.pull_request.user.login,
      installationId: payload.installation.id,
    });

    logger.log(`Enqueued PR #${payload.pull_request.number}`);
  } catch (error) {
    logger.error("Failed to enqueue job", error);
  }
});
