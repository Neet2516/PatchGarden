# Technical Architecture — PatchGarden

> **Version:** 1.0.0  
> **Last Updated:** 2026-10-25

---

## 1. System Architecture Diagram

```mermaid
graph TB
    subgraph "Browser"
        UI[Next.js Frontend<br/>port 3000]
    end

    subgraph "Docker Compose Stack"
        API[Fastify API<br/>port 3001]
        TEMPORAL[Temporal Server<br/>port 7233]
        OLLAMA[Ollama Container<br/>port 11434<br/>gemma3:4b]
        WORKER[Temporal Worker<br/>Node.js process]
    end

    subgraph "Persistent Storage"
        SQLITE[(SQLite<br/>patchgarden.db)]
        LOGS[JSONL Logs<br/>logs/*.jsonl]
        EVIDENCE[Evidence Artifacts<br/>jobs/{id}/evidence/]
        WORKTREES[Git Worktrees<br/>workspaces/{jobId}/]
    end

    subgraph "External Services"
        SENTRY[Sentry<br/>Agent Tracing]
        RENDER[Render<br/>Deployment]
    end

    UI -->|REST + WebSocket| API
    API -->|Temporal SDK| TEMPORAL
    API -->|Read| SQLITE
    TEMPORAL -->|Dispatch| WORKER
    WORKER -->|Ollama HTTP API| OLLAMA
    WORKER -->|Write| SQLITE
    WORKER -->|Append| LOGS
    WORKER -->|Write| EVIDENCE
    WORKER -->|git worktree| WORKTREES
    WORKER -->|Sentry SDK| SENTRY
    API -->|Sentry SDK| SENTRY
    RENDER -.->|hosts| UI
    RENDER -.->|hosts| API
```

---

## 2. End-to-End Repair Workflow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant UI as Next.js UI
    participant API as Fastify API
    participant TMP as Temporal
    participant WRK as Worker
    participant GEM as Gemma (Ollama)
    participant GIT as Git Worktree

    Dev->>UI: Enter repository path
    UI->>API: POST /jobs { repoPath }
    API->>API: Validate path + create Job record
    API->>TMP: Start PatchGardenWorkflow
    API-->>UI: { jobId } + WebSocket subscription

    TMP->>WRK: InspectRepository activity
    WRK->>GIT: git status, git log
    WRK-->>TMP: { repoId, headCommit }

    TMP->>WRK: IdentifyFailure activity
    WRK->>GIT: npm test (baseline)
    WRK-->>TMP: { failingTests, errorSummary }

    TMP->>WRK: CollectEvidence activity
    WRK->>GIT: Read relevant files (redacted)
    WRK-->>TMP: { evidenceFiles }

    TMP->>WRK: AnalyzeWithAI activity
    WRK->>GEM: POST /api/generate (structured prompt)
    GEM-->>WRK: { hypothesis, patchPlan, confidence }
    WRK->>WRK: Validate schema
    WRK-->>TMP: { analysis }

    TMP->>WRK: CreateWorkspace activity
    WRK->>GIT: git worktree add workspaces/{jobId}
    WRK-->>TMP: { worktreePath }

    Note over TMP,WRK: WAIT FOR HUMAN APPROVAL
    TMP->>WRK: WaitForApproval signal
    Dev->>UI: View evidence + diff
    UI->>API: POST /jobs/{id}/approve
    API->>TMP: Signal ApprovalSignal

    TMP->>WRK: ApplyPatch activity
    WRK->>GIT: git apply patch.diff (worktree only)
    WRK-->>TMP: { diffHash }

    TMP->>WRK: VerifyPatch activity
    WRK->>GIT: npm test (candidate)
    WRK-->>TMP: { testStatus, regressions }

    TMP->>WRK: PresentResults activity
    WRK->>API: Update job with results
    API->>UI: WebSocket push
    UI->>Dev: Show diff + test results
    Dev->>UI: Approve / Reject final patch
    UI->>API: POST /jobs/{id}/finalize
    API->>TMP: Signal FinalDecision

    TMP->>WRK: Complete activity
    WRK->>GIT: git worktree remove
    WRK->>WRK: Write final audit log
```

---

## 3. Job State Machine

```mermaid
stateDiagram-v2
    [*] --> CREATED: POST /jobs

    CREATED --> INSPECTING: Temporal workflow starts
    INSPECTING --> IDENTIFYING: InspectRepository ✓
    IDENTIFYING --> COLLECTING: IdentifyFailure ✓
    COLLECTING --> ANALYZING: CollectEvidence ✓
    ANALYZING --> AWAITING_APPROVAL: AnalyzeWithAI ✓

    AWAITING_APPROVAL --> APPLYING: Human approves patch
    AWAITING_APPROVAL --> REJECTED_PROPOSAL: Human rejects proposal

    APPLYING --> VERIFYING: ApplyPatch ✓
    VERIFYING --> AWAITING_FINAL: VerifyPatch ✓

    AWAITING_FINAL --> APPROVED: Human approves final result
    AWAITING_FINAL --> REJECTED_RESULT: Human rejects final result

    APPROVED --> COMPLETE: Complete activity ✓
    REJECTED_PROPOSAL --> COMPLETE: Complete activity ✓
    REJECTED_RESULT --> COMPLETE: Complete activity ✓

    INSPECTING --> BLOCKED: Activity fails permanently
    IDENTIFYING --> BLOCKED: No test failure found or activity fails
    COLLECTING --> BLOCKED: Activity fails permanently
    ANALYZING --> BLOCKED: Model output invalid after retries
    APPLYING --> BLOCKED: Patch cannot be applied
    VERIFYING --> BLOCKED: Test execution fails permanently

    BLOCKED --> [*]: Manual intervention required
    COMPLETE --> [*]
```

---

## 4. Failure Recovery Diagram

```mermaid
flowchart TD
    START([Worker Process Starts]) --> CONNECT[Connect to Temporal Server]
    CONNECT --> QUERY[Query SQLite for IN_PROGRESS jobs]
    QUERY --> HAS_JOBS{Jobs found?}

    HAS_JOBS -->|No| READY[Ready for new jobs]
    HAS_JOBS -->|Yes| FOR_EACH[For each IN_PROGRESS job...]

    FOR_EACH --> CHECK_TMP[Fetch Temporal workflow status]
    CHECK_TMP --> TMP_STATUS{Temporal status?}

    TMP_STATUS -->|RUNNING| AUTO_RESUME[Temporal replays workflow automatically]
    TMP_STATUS -->|COMPLETED| RECONCILE[Reconcile SQLite state]
    TMP_STATUS -->|FAILED/TIMEOUT| MARK_BLOCKED[Mark job BLOCKED in SQLite]
    TMP_STATUS -->|NOT FOUND| MANUAL_REVIEW[Mark BLOCKED — history lost]

    AUTO_RESUME --> CHECK_WORKTREE[Check worktree state]
    CHECK_WORKTREE --> WORKTREE_OK{Worktree valid?}
    WORKTREE_OK -->|Yes| RESUME[Resume from last checkpoint]
    WORKTREE_OK -->|No| RECREATE[Recreate worktree from checkpoint]
    RECREATE --> RESUME

    RECONCILE --> READY
    MARK_BLOCKED --> ALERT[Alert UI — manual intervention]
    MANUAL_REVIEW --> ALERT
    RESUME --> READY
    ALERT --> READY

    READY --> LISTEN[Listen for new Temporal tasks]
```

---

## 5. Package Dependencies

```
root/
├── packages/core          ← No external runtime deps except better-sqlite3
│   └── depends on: better-sqlite3, zod, winston
│
├── packages/api           ← HTTP server
│   └── depends on: core, fastify, @fastify/websocket, @temporalio/client
│
├── packages/worker        ← Temporal worker + AI
│   └── depends on: core, @temporalio/worker, @temporalio/activity
│       axios (Ollama client), zod, @sentry/node
│
└── packages/web           ← Next.js frontend
    └── depends on: react, next, swr, diff2html, prism-react-renderer
```

---

## 6. API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/jobs` | Create a new maintenance job |
| GET | `/jobs` | List all jobs |
| GET | `/jobs/:id` | Get job details |
| GET | `/jobs/:id/evidence` | Get evidence artifacts |
| GET | `/jobs/:id/diff` | Get patch diff |
| POST | `/jobs/:id/approve-proposal` | Approve the AI proposal |
| POST | `/jobs/:id/reject-proposal` | Reject the AI proposal |
| POST | `/jobs/:id/approve-result` | Approve the verified result |
| POST | `/jobs/:id/reject-result` | Reject the verified result |
| GET | `/jobs/:id/logs` | Stream job logs |
| GET | `/health` | Health check |
| GET | `/model/status` | Ollama model availability |
| GET | `/temporal/status` | Temporal server connectivity |
| WS | `/jobs/:id/live` | WebSocket for real-time job updates |

---

## 7. Database Schema

```sql
-- Core job record
CREATE TABLE jobs (
    id TEXT PRIMARY KEY,
    repo_path TEXT NOT NULL,
    repo_head_commit TEXT,
    repo_branch TEXT,
    repo_remote TEXT,
    status TEXT NOT NULL DEFAULT 'CREATED',
    stage TEXT NOT NULL DEFAULT 'CREATED',
    workflow_id TEXT,
    run_id TEXT,
    worktree_path TEXT,
    test_command TEXT,
    baseline_result TEXT,  -- JSON
    analysis TEXT,         -- JSON
    patch_diff TEXT,
    diff_hash TEXT,
    candidate_result TEXT, -- JSON
    approval_state TEXT DEFAULT 'PENDING',
    approved_by TEXT,
    rejection_reason TEXT,
    retry_count INTEGER DEFAULT 0,
    model_id TEXT,
    error_code TEXT,
    error_message TEXT,
    evidence_dir TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    completed_at TEXT
);

-- Checkpoint records for recovery
CREATE TABLE checkpoints (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL REFERENCES jobs(id),
    stage TEXT NOT NULL,
    evidence_hash TEXT,
    worker_version TEXT,
    temporal_run_id TEXT,
    attempt INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
);

-- Audit event log (append-only projection of JSONL)
CREATE TABLE audit_events (
    id TEXT PRIMARY KEY,
    job_id TEXT,
    event_type TEXT NOT NULL,
    actor TEXT,
    payload TEXT,  -- JSON
    created_at TEXT NOT NULL
);

CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_created ON jobs(created_at);
CREATE INDEX idx_checkpoints_job ON checkpoints(job_id);
CREATE INDEX idx_audit_job ON audit_events(job_id);
```
