import type { PullRequestFile } from '../integrations/github/github.types';
import { AddedLine, DiffChunk, ParsedDiff } from './types';

const CHARS_PER_TOKEN = 4;
const MAX_TOKENS_PER_CHUNK = 4000;

export function parseDiff(files: PullRequestFile[]): ParsedDiff[] {
  return files
    .filter((file) => file.patch && file.status !== 'removed')
    .map((file) => ({
      filename: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      addedLines: extractAddedLines(file.patch ?? ''),
    }));
}

export function chunkDiff(diffs: ParsedDiff[]): DiffChunk[] {
  const chunks: DiffChunk[] = [];
  let currentChunk: DiffChunk = {
    files: [],
    tokenEstimate: 0,
  };

  for (const diff of diffs) {
    const diffTokens = estimateTokens(diff);

    if (diffTokens > MAX_TOKENS_PER_CHUNK) {
      if (currentChunk.files.length > 0) {
        chunks.push(currentChunk);
        currentChunk = { files: [], tokenEstimate: 0 };
      }

      chunks.push({
        files: [diff],
        tokenEstimate: diffTokens,
      });

      continue;
    }

    if (currentChunk.tokenEstimate + diffTokens > MAX_TOKENS_PER_CHUNK) {
      chunks.push(currentChunk);
      currentChunk = { files: [], tokenEstimate: 0 };
    }

    currentChunk.files.push(diff);
    currentChunk.tokenEstimate += diffTokens;
  }

  if (currentChunk.files.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

function extractAddedLines(patch: string): AddedLine[] {
  const lines = patch.split('\n');
  const addedLines: AddedLine[] = [];
  let currentLineNumber = 0;

  for (const line of lines) {
    const hunkMatch = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hunkMatch) {
      currentLineNumber = Number.parseInt(hunkMatch[1], 10) - 1;
      continue;
    }

    if (line.startsWith('-')) {
      continue;
    }

    if (line.startsWith('+')) {
      currentLineNumber += 1;
      addedLines.push({
        lineNumber: currentLineNumber,
        content: line.slice(1),
      });
      continue;
    }

    currentLineNumber += 1;
  }

  return addedLines;
}

function estimateTokens(diff: ParsedDiff): number {
  const text =
    diff.filename +
    '\n' +
    diff.addedLines.map((line) => line.content).join('\n');

  return Math.ceil(text.length / CHARS_PER_TOKEN);
}
