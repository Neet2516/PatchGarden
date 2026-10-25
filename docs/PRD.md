# Product Requirements Document — PatchGarden

> **Version:** 1.0.0  
> **Status:** APPROVED FOR MVP  
> **Last Updated:** 2026-10-25  
> **Author:** Navneet Sinha

---

## 1. Executive Summary

PatchGarden is an AI-powered maintenance engineer for neglected software repositories. It investigates reproducible test failures, proposes minimal repairs, verifies them in isolated environments, and preserves complete evidence before requesting human approval. The product optimizes for *verified, auditable* maintenance rather than AI code generation volume.

PatchGarden targets the Hacktoberfest 2026 Open-Source AI Challenge, Week 3 theme: **Slow and Steady**.

---

## 2. Problem Statement

### 2.1 The Maintenance Backlog Problem

Open-source repositories accumulate technical debt — broken tests, stale dependencies, outdated configurations, and minor bugs — that maintainers repeatedly defer. The work is:

- **Repetitive**: Diagnose → identify cause → fix → verify → repeat.
- **Time-consuming**: Reproducing a flaky test or tracing a dependency conflict can take hours.
- **Hard to prioritize**: Individual items seem small but collectively block progress.
- **Risky**: A fix in one area can cause regressions elsewhere.

*Hypothesis [H-001]:* A significant fraction of deferred maintenance items involve failures that are reproducible and fixable with small, targeted changes. (Not validated with user research; stated as the product hypothesis to be tested.)

### 2.2 Why Existing Tools Fall Short

| Existing Approach | Problem |
|------------------|---------|
| AI code generators (Copilot, Cursor, etc.) | Generate plausible code; do not independently verify it solves the failure |
| CI/CD systems | Report failures; do not investigate or repair them |
| Dependabot / Renovate | Handles dependency updates only; does not diagnose test failures |
| Human maintainer | Effective but time-constrained; context-switching cost is high |
| Generic AI assistants | No access to repository state; no isolated test execution |

---

## 3. Target Users

### Primary User: The Stretched Solo Maintainer

**Persona: Navneet, Open-Source Solo Dev**
- Maintains 2–5 open-source repositories alongside a full-time job.
- Tests break occasionally; he often lacks time to investigate.
- Has a backlog of "fix the CI" items that pile up.
- Comfortable with command line tools; prefers transparency over magic.
- Privacy-conscious; hesitant to send code to external AI APIs.
- *[Unvalidated — representative hypothesis, not survey data]*

### Secondary User: The Team Lead at a Small Startup

**Persona: The CTO at a 5-person startup**
- Technical debt has accumulated over 18 months of fast shipping.
- Wants automated help with maintenance without the liability of auto-merging AI code.
- Needs an audit trail for any automated changes.
- *[Unvalidated — representative hypothesis]*

---

## 4. Existing Workflow and Friction

Current state (without PatchGarden):

```
1. CI fails → notification arrives
2. Developer opens CI log → spends 10–30 min reading output
3. Identifies failing test → opens relevant files
4. Hypothesizes root cause (or gives up and closes the tab)
5. Makes a change → pushes → waits for CI
6. Repeat until fixed or abandoned
```

Friction points:
- No structured diagnostic collection.
- No systematic hypothesis generation.
- No isolated test execution before pushing.
- No evidence preserved for future reference.
- High context-switching cost to re-investigate next week.

---

## 5. Product Vision

PatchGarden is an AI maintenance engineer with the discipline to collect evidence before proposing a fix, test a fix before presenting it, and document everything for human review.

**Value proposition:** PatchGarden does not replace the developer's judgment. It eliminates the tedious diagnostic work so the developer can make an informed approval decision in minutes instead of hours.

---

## 6. Primary Use Cases

### UC-01: Reproduce and Diagnose a Test Failure
A developer points PatchGarden at a repository. PatchGarden identifies a failing test, collects diagnostic evidence, and asks Gemma to produce a structured hypothesis.

### UC-02: Verify a Repair in Isolation
PatchGarden creates an isolated workspace, applies a proposed patch, runs tests, and reports whether the failure is resolved without regressions.

### UC-03: Human Approval Workflow
The developer reviews the diff, evidence, and test results in the PatchGarden UI. They approve or reject the patch. PatchGarden records the outcome.

### UC-04: Recover from Interruption
The developer's machine shuts down mid-investigation. When PatchGarden restarts, it resumes the job from the last checkpoint without repeating completed work.

### UC-05: Audit Previous Jobs
The developer reviews the history of investigated failures, proposed patches, and approval outcomes.

---

## 7. User Stories

| ID | Story | Priority |
|----|-------|---------|
| US-01 | As a maintainer, I want to point PatchGarden at a repo and have it identify a failing test automatically. | MVP |
| US-02 | As a maintainer, I want to see the diagnostic evidence that led to a repair proposal, not just the patch. | MVP |
| US-03 | As a maintainer, I want to see a minimal diff and the test results before approving anything. | MVP |
| US-04 | As a maintainer, I want the agent to never modify my main branch without my approval. | MVP |
| US-05 | As a maintainer, I want the job to survive a system restart and resume correctly. | MVP |
| US-06 | As a maintainer, I want to know when the AI cannot establish a plausible fix. | MVP |
| US-07 | As a maintainer, I want a history of all past investigations and their outcomes. | MVP |
| US-08 | As a maintainer, I want AI inference to happen locally so my code doesn't leave my machine. | MVP |
| US-09 | As a maintainer, I want structured logs I can query from the command line. | Post-MVP |
| US-10 | As a maintainer, I want to see how long each stage of the workflow took. | Post-MVP |

---

## 8. Functional Requirements

### FR-01: Repository Intake
- Accept a local repository path.
- Validate the path is a valid Git repository.
- Record repository identity (remote URL, HEAD commit, branch).
- Detect and flag the presence of `.env` files or secrets without reading their contents.

### FR-02: Test Failure Identification
- Detect the test runner automatically (Jest, Vitest, Mocha, `npm test`).
- Run the test suite with resource limits (CPU, memory, time).
- Identify failing tests and capture their error output.
- Support JavaScript/TypeScript repositories in MVP.

### FR-03: Evidence Collection
- Read relevant source files (max 20 files, max 100KB each).
- Apply secret redaction before any content leaves the collection step.
- Store evidence in a structured, versioned artifact.

### FR-04: AI Analysis
- Send structured diagnostic context to local Gemma 3 via Ollama.
- Validate model output against a strict JSON schema.
- Extract: hypothesis, affected files, patch plan, confidence level.
- Handle malformed model output gracefully (retry → BLOCKED).
- Report "INSUFFICIENT" confidence honestly; do not fabricate a fix.

### FR-05: Isolated Workspace
- Create a Git worktree for each job.
- Validate workspace path is within the designated workspace root.
- Clean up worktrees after job completion.

### FR-06: Patch Application
- Apply the proposed diff to the isolated worktree only.
- Require human approval before applying.
- Validate all changed files are within the worktree.
- Record the diff hash for audit.

### FR-07: Verification
- Run tests in the worktree with resource limits.
- Compare candidate results against baseline results.
- Detect regressions (tests that passed before and fail after).
- Report: PASS / PARTIAL / FAIL / ERROR.

### FR-08: Human Approval Interface
- Display the diff, baseline results, candidate results, and hypothesis.
- Provide Approve and Reject actions.
- Record the decision with a timestamp.
- Inform the user how to manually apply an approved patch.

### FR-09: Durable Execution
- Use Temporal for all workflow execution.
- Resume jobs after worker restart from the last completed activity.
- Implement idempotent activities.
- Expose job recovery status in the UI.

### FR-10: Audit Logging
- Append structured JSONL events for all state transitions.
- Separate logs: decisions, execution, failures, verification.
- Include: timestamp, jobId, taskId, event type, result.
- Never log secrets.

---

## 9. Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | AI inference is local | Gemma 3 via Ollama Docker; no data sent to cloud APIs |
| NFR-02 | Workflow durability | Survives process kill; resumes within 30 seconds of restart |
| NFR-03 | Test execution isolation | Tests run in Git worktrees; original repo unchanged |
| NFR-04 | Latency | Full workflow (simple fixture) completes in < 5 minutes |
| NFR-05 | Resource limits | Test processes bounded at 120s CPU, 512MB memory |
| NFR-06 | Path safety | No file access outside workspace allowlist |
| NFR-07 | Secret protection | No secrets in logs, model context, or evidence artifacts |
| NFR-08 | Observability | All state transitions traceable via Sentry Agent Tracing |
| NFR-09 | Transparency | UI shows what the agent is doing and why at all times |
| NFR-10 | Reproducibility | Project installable from documented steps on a clean machine |

---

## 10. Privacy and Security Requirements

- All AI inference occurs locally (Ollama Docker container).
- No repository content is sent to external APIs without explicit user consent.
- Secrets detected in repository content are flagged but not stored.
- Model context is sanitized before inference.
- All patches require human approval before any write operation.
- Audit logs are append-only and retain security-relevant events.

---

## 11. Constraints and Assumptions

| Type | Statement |
|------|-----------|
| Constraint | Ollama must be available as a Docker service |
| Constraint | Docker must be installed on the development machine |
| Constraint | The target repository must be a local Git repository |
| Constraint | MVP supports JavaScript/TypeScript repositories only |
| Constraint | AI model is Gemma 3 4B (approximately 3.3GB model weights) |
| Assumption | The developer's machine has at least 8GB RAM available for Docker |
| Assumption | Gemma 3 4B can produce useful diagnostic output for common JS/TS failures |
| Assumption | Test suites run in < 2 minutes in the baseline measurement |

---

## 12. MVP Scope

**In scope:**
- One end-to-end workflow: intake → diagnose → analyze → patch → verify → approve/reject
- JavaScript/TypeScript repositories
- Local Git repository intake only
- Single failing test per job (MVP)
- Human approval UI in Next.js
- Temporal durable execution
- Sentry observability
- SQLite persistence
- Structured JSONL logs
- Deliberately broken fixture for benchmarking

**Out of scope for MVP:**
- Multi-language support (Python, Go, etc.)
- Remote repository import (GitHub PR integration)
- Automatic PR creation
- Multi-failure jobs
- Parallel job execution
- Mobile interface
- Team collaboration features
- SLA monitoring

---

## 13. Success Metrics

| Metric | Target | How Measured |
|--------|--------|-------------|
| Fixture diagnosis accuracy | ≥ 2/3 fixtures correctly diagnosed | Benchmark in `tests/fixtures/` |
| Fixture patch pass rate | ≥ 2/3 fixtures pass after patch | Benchmark test results |
| Recovery success rate | 100% of interrupted jobs resume correctly | Recovery test in `tests/recovery/` |
| Malformed output handling | 100% — no crashes on invalid model output | Security test in `tests/security/` |
| End-to-end latency | < 5 minutes for simple fixture | Measured in benchmark |
| Zero secrets committed | 0 secrets in Git history | Automated scan |

---

## 14. Risks and Mitigations

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Gemma 3 4B insufficient for diagnosis | Medium | High | Provide fallback "INSUFFICIENT" state; document limitation |
| Temporal Docker setup too complex | Low | Medium | `temporalio/auto-setup` image simplifies setup |
| Git worktree isolation insufficient | Low | High | Document limitation in THREAT_MODEL.md; add network isolation via Docker |
| Ollama model download time | High | Medium | Document in setup guide; model download is one-time |
| Render + local Ollama incompatibility | High | Medium | Deploy API + frontend on Render; local demo for worker |

---

## 15. Future Roadmap

1. **Multi-language support**: Python, Go, Rust repositories.
2. **Remote repository integration**: GitHub PR auto-creation with evidence attachments.
3. **Dependency maintenance**: Automated dependency update proposals with compatibility testing.
4. **Parallel investigation**: Multiple failing tests per job.
5. **Team workspace**: Shared job history and approval workflows for teams.
6. **Larger models**: Support for Gemma 7B+ when hardware permits.
7. **CI integration**: Run as a GitHub Action on failed CI runs.
