# System Architecture — PatchGarden

> **Version:** 1.0.0  
> **Last Updated:** 2026-10-25

---

## 1. Architecture Principles

1. **Evidence-first**: Every claim about a failure or fix is backed by logged, reproducible evidence.
2. **Isolation**: Tests run in disposable Git worktrees; the original repository is never modified.
3. **Durable execution**: Temporal workflows survive process crashes; jobs resume from checkpoints.
4. **Local AI**: Gemma 3 runs via Ollama in Docker — no data leaves the machine without consent.
5. **Human authority**: No patch is applied to `main` without explicit human approval.
6. **Structured validation**: Model output is treated as untrusted; validated against strict JSON schemas.

---

## 2. Component Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            PatchGarden System                               │
│                                                                             │
│  ┌──────────────┐    WebSocket/HTTP    ┌─────────────────────────────────┐  │
│  │   Next.js    │◄────────────────────►│        Fastify API Server       │  │
│  │   Frontend   │                     │         (port 3001)             │  │
│  │  (port 3000) │                     └─────────────┬───────────────────┘  │
│  └──────────────┘                                   │                      │
│                                                     │ Temporal SDK          │
│                                         ┌───────────▼───────────────────┐  │
│                                         │      Temporal Server          │  │
│                                         │       (port 7233)             │  │
│                                         └───────────┬───────────────────┘  │
│                                                     │                      │
│                                         ┌───────────▼───────────────────┐  │
│                                         │      PatchGarden Worker       │  │
│                                         │  (Temporal Worker process)    │  │
│                                         │                               │  │
│                                         │  ┌─────────┐ ┌────────────┐  │  │
│                                         │  │Inspector│ │  Analyst   │  │  │
│                                         │  └────┬────┘ └─────┬──────┘  │  │
│                                         │  ┌────▼────┐ ┌─────▼──────┐  │  │
│                                         │  │ Patcher │ │  Verifier  │  │  │
│                                         │  └────┬────┘ └─────┬──────┘  │  │
│                                         │       └──────┬──────┘         │  │
│                                         │         ┌────▼────┐           │  │
│                                         │         │Recorder │           │  │
│                                         │         └─────────┘           │  │
│                                         └───────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────────┐   │
│  │  SQLite (core)   │   │  Ollama Docker   │   │  Git Worktrees       │   │
│  │  patchgarden.db  │   │  gemma3:4b       │   │  (isolated tests)   │   │
│  └──────────────────┘   └──────────────────┘   └──────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    Sentry (Agent Tracing)                            │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Package Structure

### `packages/core`
Domain models, SQLite persistence, state machine, security utilities, structured logging.

### `packages/api`
Fastify HTTP server. Exposes REST endpoints and WebSocket connections for the frontend. Triggers Temporal workflow starts. Reads job state from SQLite.

### `packages/worker`
Temporal Worker process. Contains all Workflow and Activity implementations. Hosts the AI integration layer (Ollama client, prompt templates, schema validation).

### `packages/web`
Next.js 14 App Router frontend. Connects to the API via REST and WebSocket. Displays real-time job progress, evidence, diffs, and approval interfaces.

---

## 4. Data Flow

1. User provides a repository path via the web UI.
2. API server validates the path and creates a Job record in SQLite.
3. API server starts a Temporal Workflow via the Temporal client.
4. Temporal routes work to the Worker process.
5. Worker activities execute the investigation workflow:
   a. Inspector validates the repo and runs baseline tests.
   b. Analyst sends diagnostic context to Gemma via Ollama.
   c. Patcher creates a Git worktree and applies the proposed diff.
   d. Verifier runs tests in the worktree and compares results.
   e. Recorder saves all evidence to SQLite.
6. API server polls SQLite and pushes status updates via WebSocket.
7. Frontend displays real-time progress.
8. Verifier presents the diff and results for human approval.
9. Human approves or rejects.
10. Recorder writes the final outcome.
11. Worktree is cleaned up.

---

## 5. Technology Rationale

| Decision | Choice | Rationale |
|----------|--------|-----------|
| AI Model | Gemma 3 4B via Ollama | Open-weight, runs locally, no data egress, Hacktoberfest partner |
| Workflow Engine | Temporal | True durable execution with activity-level retry semantics |
| Database | SQLite | Zero-dependency, file-based, works in all environments |
| API | Fastify | Schema-validated routes, fast JSON serialization |
| Frontend | Next.js 14 | SSR + App Router for real-time developer tool UX |
| Observability | Sentry Agent Tracing | Native support for AI agent traces and activity spans |
| Deployment | Render | Simple PaaS, supports Docker services |
| Container | Docker Compose | Reproducible local dev environment |

---

## 6. Durable Execution Model

PatchGarden uses Temporal for durable workflow execution. This means:

- **Crash recovery**: If the worker process crashes mid-job, Temporal replays the workflow history and resumes from the last completed Activity.
- **Idempotent activities**: Activities are designed to be idempotent — re-running them produces the same outcome.
- **Bounded retries**: Each activity has a configured `maximumAttempts` and backoff policy.
- **Explicit checkpoints**: After each major phase, the workflow writes a checkpoint to SQLite before proceeding.

The Temporal workflow is the source of truth for execution state; SQLite holds the observable state for the UI.
