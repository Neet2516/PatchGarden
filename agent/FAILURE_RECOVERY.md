# Failure Recovery — PatchGarden

> **Version:** 1.0.0  
> **Last Updated:** 2026-10-25

---

## 1. Recovery Philosophy

PatchGarden is designed for *crash-safe* operation. A process termination at any point in the workflow must not:
- Lose completed work.
- Leave inconsistent job state.
- Automatically retry side effects that may have already executed.
- Corrupt the original repository.

Recovery is powered by Temporal's workflow history. The SQLite job state is a projection of that history for the UI layer.

---

## 2. On-Startup Recovery Procedure

When the worker process starts (or restarts), it performs the following:

```
1. Connect to Temporal server.
2. Query SQLite for all jobs with status IN_PROGRESS.
3. For each such job:
   a. Fetch the Temporal workflow execution status.
   b. If workflow is RUNNING: worker will resume automatically via Temporal replay.
   c. If workflow is TIMED_OUT or FAILED: mark job BLOCKED in SQLite, alert UI.
   d. If workflow is COMPLETED but SQLite shows IN_PROGRESS: reconcile SQLite.
   e. If workflow not found (Temporal history lost): mark job BLOCKED, manual review.
4. Check for stale worktrees in workspaces/ directory:
   a. If worktree has no matching active job: schedule for cleanup.
   b. Do not delete without verifying the worktree is not in active use.
5. Report recovery summary to logs/execution.jsonl.
```

---

## 3. Temporal Replay Safety

Temporal replays workflow code to restore state after a worker restart. This means:

**Do not** put side effects directly in Workflow code. All side effects go in Activities.

Activities are:
- **Idempotent where possible** (running an Activity twice produces the same result).
- **Checked for prior completion** before re-executing (via SQLite stage records).
- **Explicitly designed** for the cases where idempotency is impossible (e.g., applying a diff).

### Non-idempotent Activities

| Activity | Risk | Mitigation |
|----------|------|-----------|
| `ApplyPatch` | Applying twice creates conflicts | Check worktree diff before applying; skip if already applied |
| `CreateWorktree` | Fails if path exists | Check existence; reuse if valid, recreate if stale |
| `VerifyPatch` | Re-running tests is safe but expensive | Cache results in SQLite with input hash |

---

## 4. Checkpoint Protocol

After each major activity completes, the agent writes a checkpoint:

```json
{
  "ts": "2026-10-25T02:00:00.000Z",
  "jobId": "job_abc123",
  "stage": "EVIDENCE_COLLECTED",
  "evidenceHash": "sha256:...",
  "workerVersion": "1.0.0",
  "temporalRunId": "run_xyz",
  "attempt": 1
}
```

On recovery, the system checks the most recent checkpoint and compares it against the Temporal workflow history. If they agree, the job resumes from the next activity. If they disagree, the job is marked BLOCKED pending manual review.

---

## 5. Known Non-Recoverable States

The following states cannot be automatically recovered and require human intervention:

| Condition | How to Detect | Recovery Action |
|-----------|--------------|----------------|
| Temporal history deleted | Workflow not found | Mark BLOCKED; manual inspection |
| SQLite database corrupted | Database error on startup | Restore from backup; mark all IN_PROGRESS jobs BLOCKED |
| Worktree corrupted mid-patch | `git status` fails in worktree | Delete worktree; restart from WORKSPACE_READY |
| Model output schema changed between versions | Validation errors on persisted analysis | Re-run AI analysis activity |

---

## 6. Cleanup on Recovery

For each stale worktree without an active job:
1. Check that no process has the directory open.
2. Run `git worktree remove --force {path}`.
3. Log the cleanup in `logs/execution.jsonl`.
4. Never delete worktrees belonging to jobs with status IN_PROGRESS.

---

## 7. Version Compatibility

If the workflow code version does not match the version recorded in the job checkpoint, the system will:
1. Log the version mismatch.
2. Continue if the change is backward-compatible (documented in CHANGELOG).
3. Mark the job BLOCKED if the change is breaking.

Workflow versioning uses Temporal's built-in patching API (`workflow.patched()`).

---

## 8. Manual Recovery Commands

```powershell
# List all in-progress jobs
node packages/core/dist/cli.js jobs list --status IN_PROGRESS

# Force-reset a stuck job (does NOT delete evidence)
node packages/core/dist/cli.js jobs reset --jobId job_abc123

# Inspect worktrees
git worktree list

# Remove a specific stale worktree
git worktree remove --force workspaces/job_abc123

# View Temporal workflow history
npx ts-node -e "require('./packages/worker/src/inspect').describeJob('job_abc123')"
```
