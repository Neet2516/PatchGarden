# Phase 00 — Foundation

> **Status:** IN_PROGRESS  
> **Owner:** Navneet Sinha  
> **Started:** 2026-10-25

---

## Objective

Establish the project's foundation: repository structure, agent operating documents, planning documents, Git hygiene, Docker environment, and CI pipeline.

---

## Tasks

### P00-01: Create Project Structure and Agent Documents

**Status:** DONE  
**Dependencies:** None  

**Implementation Steps:**
1. Inspect existing repository contents
2. Create `.gitignore`, `.env.example`, `.editorconfig`
3. Create `AGENTS.md`
4. Create all `agent/` documents
5. Create all `memory/` documents

**Acceptance Criteria:**
- [x] All listed files exist with project-specific content
- [x] No meaningless placeholder files
- [x] `AGENTS.md` defines the agent lifecycle and prohibited actions
- [x] `agent/SAFETY_POLICY.md` documents all security controls

**Evidence:** Files created and committed

---

### P00-02: Write PRD and Architecture Documents

**Status:** DONE  
**Dependencies:** P00-01  

**Implementation Steps:**
1. Write `docs/PRD.md`
2. Write `docs/TECHNICAL_ARCHITECTURE.md`
3. Write `docs/THREAT_MODEL.md`

**Acceptance Criteria:**
- [x] PRD contains all required sections (no fabricated user research)
- [x] Architecture has Mermaid diagrams matching intended implementation
- [x] Threat model covers all attack vectors

---

### P00-03: Create All Task Phase Files

**Status:** DONE  
**Dependencies:** P00-02  

**Acceptance Criteria:**
- [x] All PHASE_XX files created with objectives and task lists

---

### P00-04: Set Up npm Monorepo Workspace

**Status:** READY  
**Dependencies:** P00-01  

**Implementation Steps:**
1. Create root `package.json` with workspaces config
2. Initialize `packages/core/package.json`
3. Initialize `packages/api/package.json`
4. Initialize `packages/worker/package.json`
5. Initialize `packages/web/package.json`
6. Create base `tsconfig.json` files
7. Run `npm install` at root

**Acceptance Criteria:**
- [ ] `npm install` completes without errors from repo root
- [ ] `npm run build` is defined and runs
- [ ] `npm run lint` is defined and runs
- [ ] `npm test` runs unit tests across all packages
- [ ] TypeScript compilation succeeds for all packages

**Verification:** `npm install && npm run build && npm test`

---

### P00-05: Docker Compose and GitHub Actions CI

**Status:** READY  
**Dependencies:** P00-04  

**Implementation Steps:**
1. Create `docker-compose.yml` with: Ollama, Temporal, API, Worker
2. Create `.github/workflows/ci.yml`
3. Create `.github/pull_request_template.md`
4. Test Docker Compose stack starts correctly

**Acceptance Criteria:**
- [ ] `docker-compose up -d` starts all services without error
- [ ] `docker-compose ps` shows all services healthy
- [ ] Ollama is accessible at `http://localhost:11434`
- [ ] Temporal is accessible at `localhost:7233`
- [ ] GitHub Actions CI workflow is valid YAML
- [ ] CI runs lint and tests on push

**Verification:** `docker-compose up -d; docker-compose ps`

---

## Phase 00 Definition of Done

- [ ] All P00 tasks marked DONE with evidence
- [ ] Git repository clean (no untracked important files)
- [ ] First meaningful commit pushed to GitHub
- [ ] `memory/EXECUTION_STATE.md` updated
