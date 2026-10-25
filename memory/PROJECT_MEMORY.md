# Project Memory — PatchGarden

> **Version:** 1.0.0  
> **Last Updated:** 2026-10-25T01:30:00Z  
> **Current Phase:** Phase 00 — Foundation  
> **Project Status:** IN_PROGRESS

---

## 1. Project Identity

| Field | Value |
|-------|-------|
| Project Name | PatchGarden |
| Tagline | An AI maintenance engineer that never rushes a patch |
| Repository | https://github.com/Neet2516/patchgarden |
| Challenge | Hacktoberfest 2026 Open-Source AI Challenge — Week 3 |
| Theme | Slow and Steady |
| Author | Navneet Sinha (Neet2516) |
| License | MIT |
| Started | 2026-10-25 |

---

## 2. Environment Facts (Verified)

| Fact | Value | Verified |
|------|-------|---------|
| OS | Windows 11 | ✓ |
| Shell | PowerShell | ✓ |
| Node.js | v24.16.0 | ✓ |
| npm | 11.13.0 | ✓ |
| Python | 3.12.11 | ✓ |
| SQLite3 | 3.50.1 | ✓ |
| Git | 2.49.0.windows.1 | ✓ |
| Docker | 29.8.2 | ✓ |
| Ollama | NOT installed natively | ✓ |
| Ollama (Docker) | Will use `ollama/ollama` Docker image | PLANNED |
| Temporal | Will use `temporalio/auto-setup` Docker image | PLANNED |

---

## 3. Architecture Decisions

| ID | Decision | Rationale |
|----|---------|-----------|
| AD-001 | Use Ollama Docker container for Gemma inference | Ollama not natively installed; Docker available |
| AD-002 | Use SQLite for job persistence | Zero external dependency; works everywhere |
| AD-003 | Use Temporal for durable workflow execution | Genuine durable execution, not simulation |
| AD-004 | Use Fastify for API server | Fast, schema-validated, TypeScript-native |
| AD-005 | Use Next.js 14 App Router for frontend | SSR + real-time via WebSocket |
| AD-006 | Use Git worktrees for isolation | Native Git, no extra tooling required |
| AD-007 | Use monorepo with npm workspaces | Simple, no Nx/Turborepo complexity |

---

## 4. Partner Integration Status

| Partner | Status | Evidence Required |
|---------|--------|------------------|
| Gemma (via Ollama/Docker) | PLANNED | Docker compose working, model inference tested |
| Temporal | PLANNED | Real workflow with activity replay demonstrated |
| Sentry Agent Tracing | PLANNED | Traces visible in Sentry dashboard |
| Render | PLANNED | Deployed URL accessible |

---

## 5. Key Constraints

- Ollama runs in Docker; the API and worker connect to `http://localhost:11434`
- Model is `gemma3:4b` — approximately 3.3GB download required
- Temporal requires a running server; use `temporalio/auto-setup` in Docker
- No secrets should be committed at any point
- The main branch must remain clean and deployable
- All patches are applied to isolated worktrees only — the original repo is read-only

---

## 6. Unresolved Questions

| ID | Question | Priority |
|----|---------|---------|
| UQ-001 | Will Render support Docker-in-Docker for the Ollama worker? | HIGH |
| UQ-002 | What is the Sentry Agent Tracing SDK version compatible with our stack? | MEDIUM |
| UQ-003 | What are the exact Hacktoberfest 2026 Week 3 submission requirements? | HIGH |

---

## 7. Hypotheses (Unvalidated)

- [H-001] Gemma 3 4B can correctly identify simple TypeScript type errors in <60 seconds on a consumer GPU.
- [H-002] The end-to-end workflow will complete within 5 minutes for a simple test fixture.
- [H-003] Temporal's workflow history provides sufficient recovery capability without additional checkpointing.
