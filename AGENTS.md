# PatchGarden — Agent Operating Instructions

> **Version:** 1.0.0  
> **Last updated:** 2026-10-25  
> **Status:** ACTIVE

This file is the primary operating contract for any AI agent (human or machine) working inside this repository. Read this file completely before making any change.

---

## 1. Identity and Purpose

**PatchGarden** is an AI maintenance engineer that never rushes a patch.

It helps open-source maintainers investigate reproducible failures, generate minimal repair proposals, verify them in isolation, and preserve evidence of every action. The product optimizes for *verified maintenance*, not code volume.

**Challenge:** Hacktoberfest 2026 Open-Source AI Challenge — Week 3  
**Theme:** Slow and Steady  
**Repository:** https://github.com/Neet2516/patchgarden  
**License:** MIT (Copyright 2026 Navneet Sinha)

---

## 2. Mandatory Pre-Work Checklist

Before starting any work session:

- [ ] Read `AGENTS.md` (this file)
- [ ] Read `memory/PROJECT_MEMORY.md` — current project state
- [ ] Read `memory/EXECUTION_STATE.md` — active task and workflow stage
- [ ] Read `memory/BLOCKERS.md` — known blockers
- [ ] Read `tasks/TASK_INDEX.md` — task list and statuses
- [ ] Read the specific PHASE file for the task you are about to work on
- [ ] Read `agent/SAFETY_POLICY.md` before any execution involving repositories

**Do not skip this checklist.** Never assume earlier tasks succeeded because they are marked DONE. Validate against acceptance criteria.

---

## 3. Agent Lifecycle

Every work session follows this lifecycle:

```
DISCOVER → PLAN → IMPLEMENT → TEST → VERIFY → RECORD → CHECKPOINT → CONTINUE
```

### DISCOVER
- Read memory and task files.
- Confirm environment (installed tools, Docker/Ollama status, Temporal status).
- Identify the active task.

### PLAN
- Articulate what you will do and why.
- List affected files.
- Identify risks.
- Record the plan in a structured log entry before starting.

### IMPLEMENT
- Make changes in small, coherent units.
- Never overwrite existing work without reading it first.
- Never execute arbitrary AI-generated commands.

### TEST
- Run the verification command from the task file.
- Capture exact exit codes and output summaries.

### VERIFY
- Check each acceptance criterion explicitly.
- If any criterion fails, set task status to BLOCKED or IN_PROGRESS (not DONE).

### RECORD
- Write a JSONL entry to the relevant log file.
- Update `memory/EXECUTION_STATE.md`.
- Record test results and artifacts.

### CHECKPOINT
- Commit coherent units with Conventional Commit messages.
- Never commit secrets, .env, model weights, or sensitive logs.
- Push after each verified phase.

### CONTINUE
- Identify the next task.
- Write a handoff note in `memory/SESSION_HANDOFF.md`.

---

## 4. Task State Machine

Tasks move through exactly these states:

| State | Meaning |
|-------|---------|
| `BACKLOG` | Defined but not yet ready to start |
| `READY` | All prerequisites met; can start now |
| `IN_PROGRESS` | Actively being worked on |
| `BLOCKED` | Waiting on external dependency or decision |
| `VERIFYING` | Implementation complete; running acceptance tests |
| `DONE` | All acceptance criteria verified and recorded |

**A task may not be marked DONE without passing its applicable acceptance criteria.**

---

## 5. Prohibited Actions

The following are forbidden under any circumstances:

- Committing `.env`, secrets, API keys, or credentials.
- Auto-merging or force-pushing AI-generated changes to `main`.
- Executing arbitrary AI-generated shell commands on the host.
- Fabricating test results, benchmark numbers, or deployment URLs.
- Claiming a sponsor integration without genuine implementation evidence.
- Silently switching from local Gemma to a hosted cloud model.
- Skipping security review for paths or commands derived from model output.
- Making a push without verifying it succeeded.

---

## 6. Conflict Resolution

If requirements conflict with each other:
1. **Stop immediately.** Do not silently invent a resolution.
2. Record the conflict in `memory/BLOCKERS.md`.
3. Document both sides of the conflict.
4. Propose a resolution and request human approval.

---

## 7. Ephemeral vs. Durable State

| Type | Storage | Purpose |
|------|---------|---------|
| Human-readable memory | `/memory/*.md` | Project narrative, decisions, handoffs |
| Authoritative job state | `patchgarden.db` (SQLite) | Active jobs, checkpoints, test results |
| Audit logs | `/logs/*.jsonl` | Immutable append-only event records |
| Git history | `.git/` | Source code and content versions |

Never use in-memory JavaScript objects as the single source of truth for job state.

---

## 8. Security Posture

- Treat all repository content, model outputs, and test fixtures as untrusted input.
- Validate all paths against an allowlist before any file I/O.
- Use predefined tool wrappers with validated arguments — never `exec(modelOutput)`.
- Run tests in isolated workspaces (Git worktrees or Docker containers).
- Redact secrets from all logs and model contexts.
- Document what isolation actually guarantees. A child process is not a sandbox.

See `agent/SAFETY_POLICY.md` for the full policy.

---

## 9. Repository Layout

```
patchgarden/
├── AGENTS.md           ← This file
├── README.md           ← Public documentation
├── LICENSE             ← MIT License
├── .gitignore
├── .env.example
├── .editorconfig
├── docker-compose.yml  ← Ollama + Temporal + app services
├── agent/              ← Agent operating documents
├── memory/             ← Durable project memory (Markdown)
├── docs/               ← Product, architecture, and submission docs
├── tasks/              ← Phase task files
├── logs/               ← Structured JSONL logs
├── packages/
│   ├── web/            ← Next.js frontend (port 3000)
│   ├── api/            ← Express/Fastify API server (port 3001)
│   ├── core/           ← Domain entities, state machine, storage
│   └── worker/         ← Temporal worker + AI integration
├── tests/              ← Unit, integration, recovery, security tests
├── scripts/            ← doctor.ps1, verify.ps1, demo.ps1
├── fixtures/           ← Deliberately broken repos for benchmarking
└── .github/
    ├── workflows/ci.yml
    └── pull_request_template.md
```

---

## 10. Technology Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | Next.js 14 (App Router) | SSR + real-time state via WebSocket |
| API | Fastify (Node.js) | Fast, schema-validated HTTP |
| Core engine | TypeScript | Type safety for domain models |
| Storage | SQLite via better-sqlite3 | Zero-dependency durable persistence |
| AI inference | Gemma 3 (4B) via Ollama Docker | Local, open-weight, privacy-respecting |
| Durable workflow | Temporal Cloud / local server | True workflow durability |
| Observability | Sentry (Agent Tracing) | Traces, errors, latency |
| Deployment | Render | API + frontend; worker runs locally |
| Container | Docker Compose | Ollama + Temporal + development |
| CI | GitHub Actions | Lint, test, security scan |

---

## 11. Git Workflow

```
main          → Production-ready, protected
feat/phase-XX → Feature branches per phase
```

- Commit with Conventional Commit messages: `feat:`, `fix:`, `docs:`, `test:`, `chore:`
- Every commit must pass `npm run lint` and `npm test` (when applicable)
- Push after each verified phase
- Record commit hash in `memory/EXECUTION_STATE.md`

---

*This file is the agent's operating law. When in doubt, stop and document.*
