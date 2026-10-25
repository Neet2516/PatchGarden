# Task Index — PatchGarden

> **Last Updated:** 2026-10-25  
> **Current Phase:** Phase 00 — Foundation

---

## Phase Overview

| Phase | Name | Status | Tasks |
|-------|------|--------|-------|
| 00 | Foundation | IN_PROGRESS | P00-01 through P00-05 |
| 01 | Core Engine | BACKLOG | P01-01 through P01-05 |
| 02 | AI Investigation | BACKLOG | P02-01 through P02-04 |
| 03 | Patch Verification | BACKLOG | P03-01 through P03-05 |
| 04 | Durability | BACKLOG | P04-01 through P04-04 |
| 05 | Observability | BACKLOG | P05-01 through P05-03 |
| 06 | Frontend | BACKLOG | P06-01 through P06-05 |
| 07 | Integration & Security | BACKLOG | P07-01 through P07-05 |
| 08 | Deployment | BACKLOG | P08-01 through P08-03 |
| 09 | Submission | BACKLOG | P09-01 through P09-04 |

---

## Phase 00 — Foundation

| ID | Task | Status | Priority |
|----|------|--------|---------|
| P00-01 | Create project structure and agent documents | DONE | CRITICAL |
| P00-02 | Write PRD, architecture, threat model | DONE | CRITICAL |
| P00-03 | Create all task phase files | IN_PROGRESS | CRITICAL |
| P00-04 | Set up npm monorepo workspace | READY | CRITICAL |
| P00-05 | Docker Compose + GitHub Actions CI | READY | HIGH |

## Phase 01 — Core Engine

| ID | Task | Status | Priority |
|----|------|--------|---------|
| P01-01 | Domain entities and TypeScript types | BACKLOG | CRITICAL |
| P01-02 | SQLite persistence layer (better-sqlite3) | BACKLOG | CRITICAL |
| P01-03 | Job state machine with validated transitions | BACKLOG | CRITICAL |
| P01-04 | Structured logging (JSONL + Winston) | BACKLOG | HIGH |
| P01-05 | Core test suite (unit tests) | BACKLOG | HIGH |

## Phase 02 — AI Investigation

| ID | Task | Status | Priority |
|----|------|--------|---------|
| P02-01 | Ollama Docker integration + health check | BACKLOG | CRITICAL |
| P02-02 | Prompt templates and output schemas (Zod) | BACKLOG | CRITICAL |
| P02-03 | Diagnostic context builder (file reader + redactor) | BACKLOG | CRITICAL |
| P02-04 | Benchmark fixture (3 deliberately broken JS/TS repos) | BACKLOG | HIGH |

## Phase 03 — Patch Verification

| ID | Task | Status | Priority |
|----|------|--------|---------|
| P03-01 | Repository inspection tools (git commands) | BACKLOG | CRITICAL |
| P03-02 | Git worktree lifecycle management | BACKLOG | CRITICAL |
| P03-03 | Diff generation and applyDiff tool | BACKLOG | CRITICAL |
| P03-04 | Test runner (allowlisted commands + resource limits) | BACKLOG | CRITICAL |
| P03-05 | Result comparison (baseline vs candidate) | BACKLOG | HIGH |

## Phase 04 — Durability

| ID | Task | Status | Priority |
|----|------|--------|---------|
| P04-01 | Temporal Workflow definition (PatchGardenWorkflow) | BACKLOG | CRITICAL |
| P04-02 | All Temporal Activities implemented | BACKLOG | CRITICAL |
| P04-03 | Worker startup + recovery procedure | BACKLOG | CRITICAL |
| P04-04 | Recovery test (kill worker mid-job, verify resume) | BACKLOG | CRITICAL |

## Phase 05 — Observability

| ID | Task | Status | Priority |
|----|------|--------|---------|
| P05-01 | Sentry SDK initialization (Node.js) | BACKLOG | HIGH |
| P05-02 | Agent Tracing spans for all activities | BACKLOG | HIGH |
| P05-03 | Log rotation and retention policy | BACKLOG | MEDIUM |

## Phase 06 — Frontend

| ID | Task | Status | Priority |
|----|------|--------|---------|
| P06-01 | Next.js 14 app shell + design system | BACKLOG | HIGH |
| P06-02 | Job creation + repository overview screen | BACKLOG | HIGH |
| P06-03 | Evidence + investigation details screen | BACKLOG | HIGH |
| P06-04 | Diff viewer + approval interface | BACKLOG | CRITICAL |
| P06-05 | Job timeline + recovery history | BACKLOG | MEDIUM |

## Phase 07 — Integration & Security

| ID | Task | Status | Priority |
|----|------|--------|---------|
| P07-01 | End-to-end integration test (full workflow) | BACKLOG | CRITICAL |
| P07-02 | Malformed model output test | BACKLOG | CRITICAL |
| P07-03 | Path traversal security test | BACKLOG | CRITICAL |
| P07-04 | Interrupted job recovery test | BACKLOG | CRITICAL |
| P07-05 | Duplicate operation idempotency test | BACKLOG | HIGH |

## Phase 08 — Deployment

| ID | Task | Status | Priority |
|----|------|--------|---------|
| P08-01 | Render service configuration | BACKLOG | HIGH |
| P08-02 | Health checks and monitoring | BACKLOG | HIGH |
| P08-03 | Setup documentation and troubleshooting guide | BACKLOG | CRITICAL |

## Phase 09 — Submission

| ID | Task | Status | Priority |
|----|------|--------|---------|
| P09-01 | Capture genuine screenshots and demo recording | BACKLOG | CRITICAL |
| P09-02 | Complete README with all required sections | BACKLOG | CRITICAL |
| P09-03 | Draft DEV article (Hacktoberfest template) | BACKLOG | CRITICAL |
| P09-04 | Pre-submission checklist and verification | BACKLOG | CRITICAL |

---

## Status Legend

| Status | Meaning |
|--------|---------|
| BACKLOG | Not yet started |
| READY | Prerequisites met; can start now |
| IN_PROGRESS | Currently being worked on |
| BLOCKED | Waiting on dependency or decision |
| VERIFYING | Implementation done; running acceptance tests |
| DONE | All acceptance criteria verified |
