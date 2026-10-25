# Architecture Decisions — PatchGarden

> **Last Updated:** 2026-10-25

This log records all significant architectural decisions, the alternatives considered, and the reasons for acceptance or rejection.

---

## AD-001: Ollama via Docker for Local AI Inference

**Status:** ACCEPTED  
**Date:** 2026-10-25  
**Context:** Gemma 3 requires a local inference runtime. Ollama is the most user-friendly option but is not natively installed on the development machine.  
**Decision:** Use the `ollama/ollama` Docker image via Docker Compose.  
**Alternatives Rejected:**
- Native Ollama install: Would require user to run a separate installer; Docker keeps everything in `docker-compose.yml`.
- llama.cpp: More complex setup; Ollama wraps llama.cpp with a simpler API.
- Cloud-hosted Gemini API: Violates the local AI requirement and sends user code to external servers.

---

## AD-002: SQLite for Job Persistence

**Status:** ACCEPTED  
**Date:** 2026-10-25  
**Context:** Job state must survive process restarts. A persistent store is required.  
**Decision:** SQLite via `better-sqlite3` (synchronous, zero-dependency).  
**Alternatives Rejected:**
- PostgreSQL: Heavy operational dependency; overkill for a single-user developer tool.
- Redis: Volatile by default; requires additional persistence configuration.
- In-memory state: Explicitly prohibited by the product requirements.
- LevelDB: Requires native compilation; adds build complexity.

---

## AD-003: Temporal for Durable Workflow Execution

**Status:** ACCEPTED  
**Date:** 2026-10-25  
**Context:** The multi-step maintenance workflow must survive process interruption.  
**Decision:** Use Temporal with `temporalio/auto-setup` Docker image for local development.  
**Alternatives Rejected:**
- Custom state machine in SQLite: Does not provide genuine activity-level retry semantics or workflow replay. Would disqualify us from the Temporal partner category.
- Bull/BullMQ: Redis-backed job queue; does not provide workflow replay or durable activity history.
- AWS Step Functions: Cloud-only; violates local-first requirement.

---

## AD-004: Fastify for API Server

**Status:** ACCEPTED  
**Date:** 2026-10-25  
**Context:** Need an HTTP server with schema validation and WebSocket support.  
**Decision:** Fastify with `@fastify/websocket`.  
**Alternatives Rejected:**
- Express: No built-in schema validation; slower JSON serialization.
- tRPC: Interesting but adds client-server coupling that complicates the architecture.
- Hono: Good but less mature ecosystem for WebSocket support.

---

## AD-005: Next.js 14 (App Router) for Frontend

**Status:** ACCEPTED  
**Date:** 2026-10-25  
**Context:** Need a developer-facing dashboard with real-time updates.  
**Decision:** Next.js 14 with App Router. WebSocket client connects to Fastify server.  
**Alternatives Rejected:**
- Vite + React SPA: Would require separate static hosting; SSR useful for initial job state.
- Remix: Equally capable but team familiarity favors Next.js.
- Plain HTML/JS: Inadequate for the complexity of the evidence and diff views.

---

## AD-006: Git Worktrees for Test Isolation

**Status:** ACCEPTED  
**Date:** 2026-10-25  
**Context:** Tests must run in an isolated environment; the original repository must not be modified.  
**Decision:** Use `git worktree add` to create disposable workspaces.  
**Alternatives Rejected:**
- Docker containers per job: More robust isolation but adds significant latency and complexity for an MVP.
- `cp -r` copies: Not Git-aware; cannot easily produce diffs or track changes.
- Separate clones: Slow for large repositories; worktrees share the object store.

**Limitation acknowledged:** Git worktrees are not true sandboxes. Network access is not restricted for tests running in worktrees on the host. Document this limitation clearly in THREAT_MODEL.md.

---

## AD-007: npm Workspaces for Monorepo

**Status:** ACCEPTED  
**Date:** 2026-10-25  
**Context:** Need to organize web, api, core, and worker packages without heavy tooling.  
**Decision:** npm workspaces at the root with a `package.json` defining workspaces.  
**Alternatives Rejected:**
- Nx: Powerful but significant setup overhead for a hackathon timeline.
- Turborepo: Good but adds a dependency; npm workspaces suffice for this scale.
- Separate repositories: Complicates dependency sharing between packages.
