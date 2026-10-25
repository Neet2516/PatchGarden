# Quality Gates — PatchGarden

> **Version:** 1.0.0  
> **Last Updated:** 2026-10-25

---

## 1. Purpose

Quality gates are automated checks that must pass before a task is marked DONE or before a commit is pushed. They exist to prevent known categories of failure from reaching the main branch.

---

## 2. Pre-Commit Gates

Run these before every commit:

```powershell
# 1. TypeScript type checking (zero errors required)
npm run typecheck

# 2. Linting (zero warnings in CI mode)
npm run lint

# 3. Secret scanning (no secrets in staged files)
npm run scan:secrets

# 4. Unit tests
npm run test:unit

# 5. Verify no .env files are staged
git diff --cached --name-only | Select-String '\.env' | ForEach-Object { throw "Do not commit .env files: $_" }
```

---

## 3. Pre-Push Gates

Run these before every push:

```powershell
# All pre-commit gates, plus:

# 6. Integration tests (requires Docker + Temporal running)
npm run test:integration

# 7. Security scan
npm run test:security

# 8. Build verification
npm run build

# 9. Check for committed model weights or large binary files
git diff HEAD~1 --name-only | Select-String '\.(gguf|bin|safetensors|onnx)$' | ForEach-Object { throw "Do not commit model weights: $_" }
```

---

## 4. Task Completion Gates

Before marking a task DONE, all of the following must be true:

| Gate | Verification Method |
|------|-------------------|
| Acceptance criteria checked | Each criterion explicitly verified and noted |
| Tests listed in task file pass | Exit code 0, output recorded |
| No regressions in test suite | Full suite run documented |
| Files modified are listed accurately | Compared with `git diff --name-only` |
| Evidence recorded in logs | JSONL entry present in appropriate log file |
| Execution state updated | `memory/EXECUTION_STATE.md` reflects new state |
| Commit created | Commit hash recorded in execution state |

---

## 5. Acceptance Criteria Format

Each task must list acceptance criteria in this format:

```markdown
## Acceptance Criteria

- [ ] AC-01: {specific, measurable criterion}
  - Verification: `npm run test:unit -- --grep "criterion"`
  - Evidence: {where to find the evidence}

- [ ] AC-02: {specific, measurable criterion}
  - Verification: {exact command}
  - Evidence: {location}
```

Do not mark a criterion complete without running the verification command and recording the output.

---

## 6. Security Gate

The security gate checks for:

- Path traversal vulnerabilities in tool implementations.
- Unsafe use of `child_process.exec` with user-controlled input.
- Unvalidated model output being passed to any execution function.
- Secrets in logs or evidence artifacts.
- Missing input validation on API endpoints.

Run: `npm run test:security`

This executes the tests in `tests/security/` which specifically probe these attack vectors.

---

## 7. Benchmark Gate (Phase 02)

Before the AI integration is considered complete, the benchmark must pass:

```
Benchmark requirements (minimum thresholds):
- Diagnosis accuracy: correctly identify the seeded bug in ≥ 2 of 3 fixtures
- Patch applicability: generated diff applies cleanly in ≥ 2 of 3 fixtures
- Test pass rate: candidate tests pass in ≥ 2 of 3 fixtures after patch
- Recovery behavior: job resumes correctly after worker kill in 100% of tests
- Latency: full workflow completes in < 5 minutes on development hardware
- Failure cases: malformed model output handled without crash in 100% of tests
```

Results are stored in `tests/fixtures/benchmark-results.json`. Never overwrite real results with fabricated numbers.

---

## 8. Submission Gate (Phase 09)

Before submission:

- [ ] README accurately describes the implemented product.
- [ ] All claimed partner integrations have implementation evidence.
- [ ] No hardcoded secrets in any committed file.
- [ ] Demo scenario works end-to-end from documented setup steps.
- [ ] GitHub Actions CI passes on `main`.
- [ ] DEV article draft is staged and reviewed.
- [ ] Required submission tags are present.
- [ ] Repository is public.
- [ ] License file is present and correct.
