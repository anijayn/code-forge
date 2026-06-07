import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { SECURITY_PROMPT } from '../ai/prompts/security.prompt';
import { DiffChunk, Finding, WorkerResult } from './types';
import { AnalysisType } from '../db/types';

@Injectable()
export class SecurityWorker {
  constructor(private readonly ai: AiService) {}

  async analyze(chunks: DiffChunk[]): Promise<WorkerResult> {
    const allFindings: Finding[] = [];

    for (const chunk of chunks) {
      const diffContent = formatChunk(chunk);
      const findings = await this.ai.analyzeChunk(
        SECURITY_PROMPT,
        diffContent,
        AnalysisType.SECURITY,
      );
      allFindings.push(...findings);
    }

    return { workerType: AnalysisType.SECURITY, findings: allFindings };
  }
}

function formatChunk(chunk: DiffChunk): string {
  return chunk.files
    .map((f) => {
      const lines = f.addedLines
        .map((l) => `+${l.lineNumber}: ${l.content}`)
        .join('\n');
      return `### ${f.filename}\n${lines}`;
    })
    .join('\n\n');
}
