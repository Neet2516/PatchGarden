# Execution Protocol — PatchGarden

> **Version:** 1.0.0  
> **Last Updated:** 2026-10-25

---

## 1. Protocol Overview

This document specifies the exact execution steps an agent must follow to advance a job through the PatchGarden maintenance workflow. It supplements `AGENTS.md` (the operating contract) and the Temporal workflow definitions in `packages/worker/`.

---

## 2. Pre-Execution Checks

Before beginning any workflow execution:

```
1. Verify AGENTS.md has been read this session.
2. Confirm memory/PROJECT_MEMORY.md is current.
3. Confirm memory/EXECUTION_STATE.md reflects the intended task.
4. Verify no BLOCKED items in memory/BLOCKERS.md affect this task.
5. Confirm Docker is running (docker info).
6. Confirm Ollama container is healthy (docker-compose ps ollama).
7. Confirm Temporal server is reachable (tctl cluster health or equivalent).
8. Read agent/SAFETY_POLICY.md.
```

Abort if any check fails. Record the failure in BLOCKERS.md.

---

## 3. Workflow Stages

### Stage 1: Repository Intake

```
Activity: InspectRepository
Input: { repoPath: string, jobId: string }
Steps:
  1. Validate repoPath against path allowlist.
  2. Resolve symlinks; reject if resolved path escapes workspace.
  3. Run: git status, git log --oneline -10
  4. Record: repository identity, HEAD commit, branch, remote.
  5. Check for .env files or secrets — record their presence.
  6. Write checkpoint: JOB_STAGE=INSPECTED.
Output: { repoId, headCommit, branch, remote, hasSecrets: bool }
```

### Stage 2: Failure Identification

```
Activity: IdentifyFailure
Input: { repoPath, jobId, testCommand }
Steps:
  1. Determine test command (from package.json scripts or config).
  2. Run baseline tests with resource limits.
  3. Capture stdout, stderr, exit code.
  4. Parse test output for failure patterns.
  5. Record failing test names and error messages.
  6. Save evidence to: jobs/{jobId}/evidence/baseline.json
  7. Write checkpoint: JOB_STAGE=FAILURE_IDENTIFIED.
Output: { failingTests: string[], errorSummary: string, exitCode: number }
```

### Stage 3: Diagnostic Evidence Collection

```
Activity: CollectEvidence
Input: { repoPath, jobId, failingTests }
Steps:
  1. For each failing test, identify relevant source files.
  2. Read relevant files (max 20 files, 100KB each).
  3. Collect: stack traces, error messages, relevant imports.
  4. Apply secret redaction to all collected content.
  5. Save evidence to: jobs/{jobId}/evidence/diagnostic.json
  6. Write checkpoint: JOB_STAGE=EVIDENCE_COLLECTED.
Output: { evidenceFiles: string[], contextSize: number }
```

### Stage 4: AI Analysis

```
Activity: AnalyzeWithAI
Input: { jobId, diagnosticContext }
Steps:
  1. Build structured prompt from evidence (within token limit).
  2. Send to Ollama (gemma3:4b) with timeout.
  3. Parse and validate model output against schema.
  4. If validation fails: retry (max 3 times), then BLOCKED.
  5. Extract: hypothesis, affectedFiles, patchPlan, confidence.
  6. Save analysis to: jobs/{jobId}/evidence/analysis.json
  7. Write checkpoint: JOB_STAGE=ANALYZED.
Output: { hypothesis, patchPlan, confidence, modelLatencyMs }
```

### Stage 5: Workspace Creation

```
Activity: CreateWorkspace
Input: { repoPath, jobId }
Steps:
  1. Create isolated Git worktree at: workspaces/{jobId}/
  2. Validate worktree path is within workspace root.
  3. Record worktree path in job state.
  4. Write checkpoint: JOB_STAGE=WORKSPACE_READY.
Output: { worktreePath }
```

### Stage 6: Patch Application

```
Activity: ApplyPatch [REQUIRES HUMAN APPROVAL]
Input: { worktreePath, jobId, patchPlan }
Steps:
  1. WAIT: approval signal from human via API.
  2. Validate each change in patchPlan against allowlist.
  3. Apply changes to worktreePath ONLY.
  4. Record diff: jobs/{jobId}/evidence/patch.diff
  5. Write checkpoint: JOB_STAGE=PATCH_APPLIED.
Output: { diffHash, filesChanged: string[] }
```

### Stage 7: Verification

```
Activity: VerifyPatch
Input: { worktreePath, jobId, testCommand }
Steps:
  1. Run tests in worktreePath with resource limits.
  2. Capture stdout, stderr, exit code.
  3. Compare: candidate results vs. baseline results.
  4. Determine: PASS / PARTIAL / FAIL / ERROR.
  5. Save results: jobs/{jobId}/evidence/verification.json
  6. Write checkpoint: JOB_STAGE=VERIFIED.
Output: { testStatus, passedTests, failedTests, regressions }
```

### Stage 8: Human Review

```
Signal: PresentForReview
Input: { jobId }
Steps:
  1. Package: diff, baseline results, candidate results, hypothesis.
  2. Expose via API: GET /jobs/{jobId}/review
  3. WAIT: human approval or rejection signal.
  4. Record decision in SQLite and logs/decisions.jsonl.
  5. Write checkpoint: JOB_STAGE=REVIEWED.
Output: { decision: APPROVED | REJECTED, reviewer: string }
```

### Stage 9: Completion

```
Activity: Complete
Input: { jobId, decision }
Steps:
  1. If APPROVED: record approval; inform user how to apply manually.
  2. If REJECTED: record rejection and reason.
  3. Archive job state in SQLite.
  4. Clean up worktree.
  5. Write final JSONL event to logs/execution.jsonl.
  6. Write checkpoint: JOB_STAGE=COMPLETE.
Output: { finalStatus, evidenceDirectory }
```

---

## 4. Retry Policy

| Activity | Max Attempts | Initial Backoff | Max Backoff |
|----------|-------------|----------------|------------|
| InspectRepository | 2 | 1s | 10s |
| IdentifyFailure | 2 | 5s | 30s |
| CollectEvidence | 2 | 1s | 10s |
| AnalyzeWithAI | 3 | 10s | 60s |
| CreateWorkspace | 2 | 1s | 10s |
| ApplyPatch | 1 | — | — |
| VerifyPatch | 2 | 5s | 30s |

---

## 5. Abort Conditions

Abort the workflow immediately if:
- A path traversal attempt is detected.
- The model output contains raw shell commands.
- The worktree path escapes the workspace root.
- A security policy violation is detected.
- The job state in SQLite is inconsistent with the workflow history.

Record the abort reason and do not retry.
