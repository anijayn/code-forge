import { Severity, AnalysisType } from '../db/types';

export interface Finding {
  file: string;
  line: number;
  severity: Severity;
  category: string;
  explanation: string;
  fix: string;
  workerType: AnalysisType;
}

export interface WorkerResult {
  workerType: AnalysisType;
  findings: Finding[];
}

export interface AddedLine {
  lineNumber: number;
  content: string;
}

export interface ParsedDiff {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  addedLines: AddedLine[];
}

export interface DiffChunk {
  files: ParsedDiff[];
  tokenEstimate: number;
}
