# Phase 01 — Core Engine

> **Status:** BACKLOG  
> **Dependencies:** Phase 00 complete

---

## Objective

Implement the domain model, SQLite persistence, job state machine, and structured logging. These are the foundation all other packages depend on.

---

## Tasks

### P01-01: Domain Entities and TypeScript Types

**Status:** BACKLOG  
**Files:** `packages/core/src/types/`

**Implementation Steps:**
1. Define `Job` interface with all fields from the database schema
2. Define `WorkflowStage` enum
3. Define `JobStatus` enum
4. Define `TestResult` interface
5. Define `Evidence` types (baseline, diagnostic, analysis, patch, verification)
6. Define `Checkpoint` interface
7. Define `AuditEvent` interface

**Acceptance Criteria:**
- [ ] All types are exported from `packages/core/src/types/index.ts`
- [ ] TypeScript strict mode passes with zero errors
- [ ] All enums are exhaustive (no `string` fallbacks)

---

### P01-02: SQLite Persistence Layer

**Status:** BACKLOG  
**Files:** `packages/core/src/db/`

**Implementation Steps:**
1. Install `better-sqlite3` and `@types/better-sqlite3`
2. Create `Database` class wrapping better-sqlite3
3. Create `migrate()` function that applies schema from `TECHNICAL_ARCHITECTURE.md`
4. Create `JobRepository` with: `create`, `findById`, `findByStatus`, `update`, `archive`
5. Create `CheckpointRepository` with: `create`, `findLatest`
6. Create `AuditEventRepository` with: `append`, `findByJobId`
7. Ensure all writes are transactional
8. Test concurrent read safety

**Acceptance Criteria:**
- [ ] `migrate()` is idempotent (can run multiple times without error)
- [ ] Job CRUD operations work correctly
- [ ] Database survives process kill and reopens correctly
- [ ] Unit tests in `tests/unit/db.test.ts` pass

**Verification:** `npm test -- --grep "db"`

---

### P01-03: Job State Machine

**Status:** BACKLOG  
**Files:** `packages/core/src/state-machine/`

**Implementation Steps:**
1. Define the transition table (see `TECHNICAL_ARCHITECTURE.md` state diagram)
2. Create `transition(job, newStage)` function that validates the transition
3. Create `StateTransitionError` class
4. Ensure invalid transitions throw and are logged
5. Unit test all valid and invalid transitions

**Acceptance Criteria:**
- [ ] All valid transitions from the diagram succeed
- [ ] All invalid transitions throw `StateTransitionError`
- [ ] Transition events are logged to `logs/execution.jsonl`
- [ ] Unit tests cover all transition pairs

**Verification:** `npm test -- --grep "state-machine"`

---

### P01-04: Structured Logging

**Status:** BACKLOG  
**Files:** `packages/core/src/logging/`

**Implementation Steps:**
1. Create a Winston logger with JSONL file transport
2. Separate log files: `logs/execution.jsonl`, `logs/decisions.jsonl`, `logs/failures.jsonl`, `logs/verification.jsonl`
3. Create typed log helpers: `logExecution`, `logDecision`, `logFailure`, `logVerification`
4. Each event includes: ts, severity, eventType, jobId, correlationId, stage, attempt, durationMs, result
5. Add `secret-redactor.ts` that strips known secret patterns before logging

**Acceptance Criteria:**
- [ ] Log entries are valid JSONL (each line parses as JSON)
- [ ] Secret redactor catches: GitHub tokens, AWS keys, bearer tokens
- [ ] Log files rotate at 10MB
- [ ] Unit tests verify JSONL format and redaction

**Verification:** `npm test -- --grep "logging"`

---

### P01-05: Core Test Suite

**Status:** BACKLOG  

**Implementation Steps:**
1. Configure Vitest for the monorepo
2. Write unit tests for: db, state machine, logging, types
3. Target: > 80% coverage for `packages/core`

**Acceptance Criteria:**
- [ ] `npm test` passes from repo root
- [ ] Coverage report shows > 80% for `packages/core`
- [ ] No test fabricates results (all tests use real SQLite in-memory databases)

**Verification:** `npm test -- --coverage`
