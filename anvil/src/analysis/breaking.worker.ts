import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { BREAKING_PROMPT } from '../ai/prompts/breaking.prompt';
import { DiffChunk } from './types';
import { Finding, WorkerResult } from './types';
import { PullRequestFile } from '../integrations/github/github.types';
import { AnalysisType } from '../db/types';

@Injectable()
export class BreakingWorker {
  constructor(private readonly ai: AiService) {}

  async analyze(
    chunks: DiffChunk[],
    rawFiles: PullRequestFile[],
  ): Promise<WorkerResult> {
    const allFindings: Finding[] = [];

    for (const chunk of chunks) {
      const diffContent = formatChunkWithContext(chunk, rawFiles);
      const findings = await this.ai.analyzeChunk(
        BREAKING_PROMPT,
        diffContent,
        AnalysisType.BREAKING,
      );
      allFindings.push(...findings);
    }

    return { workerType: AnalysisType.BREAKING, findings: allFindings };
  }
}

function formatChunkWithContext(
  chunk: DiffChunk,
  rawFiles: PullRequestFile[],
): string {
  return chunk.files
    .map((f) => {
      const raw = rawFiles.find((r) => r.filename === f.filename);
      return `### ${f.filename}\n${raw?.patch ?? '(no patch available)'}`;
    })
    .join('\n\n');
}
