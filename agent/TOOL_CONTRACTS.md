# Tool Contracts — PatchGarden

> **Version:** 1.0.0  
> **Last Updated:** 2026-10-25

---

## Overview

This document defines the contracts for all tools available to the PatchGarden agent. All tools are implemented as TypeScript functions in `packages/core/src/tools/`. No tool accepts or executes raw AI-generated shell strings.

---

## Tool: `runTests`

**Purpose:** Run the test suite for a given repository worktree.

```typescript
interface RunTestsInput {
  worktreePath: string;   // Must be within workspace allowlist
  testCommand: 'jest' | 'vitest' | 'mocha' | 'npm test'; // Allowlisted only
  timeoutSeconds: number; // 10–300, default 120
  memoryMB: number;       // 64–512, default 256
}

interface RunTestsOutput {
  exitCode: number;
  stdout: string;         // Max 100KB, truncated if longer
  stderr: string;         // Max 50KB, truncated if longer
  durationMs: number;
  timedOut: boolean;
}
```

**Restrictions:**
- `worktreePath` is validated against workspace allowlist before use.
- `testCommand` is matched against the allowlist; arbitrary strings are rejected.
- Process is killed after `timeoutSeconds` with SIGKILL.
- stdout and stderr are buffered to the specified limits.

---

## Tool: `runGitCommand`

**Purpose:** Execute a read-only Git command against a repository.

```typescript
interface RunGitCommandInput {
  repoPath: string;
  subcommand: 'log' | 'diff' | 'status' | 'show' | 'ls-files' | 'worktree';
  args: string[];         // Each arg validated — no shell metacharacters
}

interface RunGitCommandOutput {
  exitCode: number;
  stdout: string;         // Max 200KB
  stderr: string;
  durationMs: number;
}
```

**Restrictions:**
- Only allowlisted subcommands are accepted.
- Args are validated for shell metacharacters before passing.
- Write subcommands (`commit`, `push`, `merge`, `rebase`) are NOT available here.

---

## Tool: `createWorktree`

**Purpose:** Create an isolated Git worktree for patch testing.

```typescript
interface CreateWorktreeInput {
  repoPath: string;
  worktreeBase: string;  // Base directory; must be within workspace root
  jobId: string;
}

interface CreateWorktreeOutput {
  worktreePath: string;
  success: boolean;
  error?: string;
}
```

**Restrictions:**
- `worktreeBase` must be within the configured workspace root.
- Worktree directory includes `jobId` to avoid collisions.

---

## Tool: `applyDiff`

**Purpose:** Apply a unified diff to a worktree directory.

```typescript
interface ApplyDiffInput {
  worktreePath: string;
  diffContent: string;   // Unified diff format only
  maxLinesChanged: number; // Default 50; soft limit triggers warning
}

interface ApplyDiffOutput {
  success: boolean;
  appliedFiles: string[];
  rejectedChunks: number;
  diffHash: string;      // SHA-256 of the applied diff
}
```

**Restrictions:**
- Diff is applied only to `worktreePath` (validated).
- Files referenced in the diff must exist within `worktreePath`.
- No binary patch support; text diffs only.
- Rejects diffs that modify files outside the worktree.

---

## Tool: `readFile`

**Purpose:** Read a file from a repository for evidence collection.

```typescript
interface ReadFileInput {
  filePath: string;       // Must be within workspace allowlist
  maxBytes: number;       // Default 102400 (100KB)
}

interface ReadFileOutput {
  content: string;        // Redacted of secrets
  truncated: boolean;
  sizeBytes: number;
}
```

**Restrictions:**
- `filePath` is validated against allowlist before reading.
- Symlinks are checked and rejected if they point outside the workspace.
- Content is passed through the secret redactor before returning.

---

## Tool: `queryModel`

**Purpose:** Send a structured prompt to the local Gemma model via Ollama.

```typescript
interface QueryModelInput {
  prompt: string;         // Sanitized, token-limited
  systemPrompt: string;   // Defined in worker/prompts/
  schema: JSONSchema;     // Output must conform to this schema
  timeoutSeconds: number; // Default 120
  model: string;          // Must match OLLAMA_MODEL env var
}

interface QueryModelOutput {
  rawOutput: string;
  parsedOutput: object | null;  // null if schema validation fails
  validationErrors: string[];
  modelLatencyMs: number;
  promptTokens: number;
  completionTokens: number;
}
```

**Restrictions:**
- `prompt` must have had secret redaction applied.
- `model` must match the allowlisted model name from configuration.
- Output is validated against `schema` before being returned as `parsedOutput`.
- `rawOutput` is logged (sanitized) but never executed.

---

## Tool: `writeEvidence`

**Purpose:** Persist evidence artifacts for a job.

```typescript
interface WriteEvidenceInput {
  jobId: string;
  evidenceType: 'baseline' | 'diagnostic' | 'analysis' | 'patch' | 'verification';
  content: object;
  timestamp: string;      // ISO 8601 UTC
}

interface WriteEvidenceOutput {
  artifactPath: string;
  success: boolean;
}
```

**Restrictions:**
- Writes only to `jobs/{jobId}/evidence/` within the configured data directory.
- `content` is JSON-serialized and validated before writing.
- Existing evidence is not overwritten; a new timestamped file is created.

---

## Tool: `updateJobState`

**Purpose:** Update the job record in SQLite.

```typescript
interface UpdateJobStateInput {
  jobId: string;
  stage: WorkflowStage;
  status: JobStatus;
  metadata?: Record<string, unknown>;
}

interface UpdateJobStateOutput {
  success: boolean;
  updatedAt: string;
}
```

**Restrictions:**
- Transitions are validated against the workflow state machine before writing.
- Invalid transitions are rejected with a `StateTransitionError`.

---

*Any tool not listed here does not exist. Agents must not improvise tool calls.*
