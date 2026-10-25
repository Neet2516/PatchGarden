# 🌱 PatchGarden Workflow Guide & Quickstart

This guide explains how to start, operate, and verify maintenance jobs with **PatchGarden**, featuring a complete step-by-step walkthrough example using the built-in benchmark fixture.

---

## 📋 System Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v20.x` or higher (`node -v`)
- **Docker & Docker Compose**: Docker Desktop or Linux Docker Engine running
- **Git**: `2.30+` (`git --version`)

---

## ⚡ Step 1: Environment Setup

Clone the repository and initialize the configuration:

```bash
# Clone repository
git clone https://github.com/Neet2516/PatchGarden.git
cd PatchGarden

# Copy sample environment configuration
cp .env.example .env
```

Review `.env` if you wish to configure optional settings like Sentry tracing or custom ports.

---

## 🐳 Step 2: Start Background Services

PatchGarden relies on **Ollama** for local Gemma 3 reasoning and **Temporal** for durable workflow orchestration.

Run the core background infrastructure:

```bash
# Start Ollama and Temporal services in detached mode
docker compose up -d ollama temporal
```

Download the local Google Gemma model:
```bash
docker exec -it patchgarden-ollama ollama pull gemma:latest
```

Verify service availability:
```bash
# Run the built-in healthcheck
powershell -File scripts/doctor.ps1
```

---

## 🖥️ Step 3: Launch PatchGarden Applications

You can start the entire stack with a **single command**:

```bash
npm run dev
```
> This starts the **Fastify API Server (Port 3001)**, **Temporal AI Worker**, and **Next.js Web Dashboard (Port 3000)** concurrently in one terminal using `concurrently`.

---

#### Alternative: Running Services in Separate Terminals (for debugging)

If you prefer separate logs for each service:

```bash
# Terminal 1: Fastify API Server (Port 3001)
npm run dev:api

# Terminal 2: Temporal AI Worker
npm run dev:worker

# Terminal 3: Maintainer Dashboard (Port 3000)
npm run dev:web
```

Once running, open [http://localhost:3000](http://localhost:3000) in your browser to access the Maintainer Dashboard.

---

## 🧪 Walkthrough Example: Repairing `fixtures/broken-calc`

Let's walk through an end-to-end example where PatchGarden repairs an open-source bug using the **Slow and Steady** philosophy.

### The Scenario
In `fixtures/broken-calc`, the `divide(a, b)` function has an untreated division-by-zero bug:
```javascript
// fixtures/broken-calc/src/calculator.js
export function divide(a, b) {
  return a / b; // Bug: returns Infinity instead of throwing RangeError
}
```
Existing test suite expects `RangeError`:
```bash
$ npm test
✖ divide: throws RangeError on division by zero
  AssertionError: Missing expected exception RangeError
```

---

### Step-by-Step Lifecycle

#### 1. Submit the Job
Trigger a new maintenance job via the API or Dashboard:
```bash
curl -X POST http://localhost:3001/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "repoPath": "fixtures/broken-calc",
    "testCommand": "npm test",
    "failingSymptom": "divide by zero returns Infinity instead of throwing RangeError"
  }'
```
Response:
```json
{
  "jobId": "job_01JAZ8K9...",
  "status": "QUEUED",
  "stage": "PENDING"
}
```

#### 2. Baseline Reproduction
- The worker executes `identifyFailure`.
- It runs `npm test` against the untouched codebase and captures the exact failure trace.
- Stage moves to `BASELINE_FAILED`.

#### 3. Redacted Evidence Collection
- The worker collects `src/calculator.js` and `test/calculator.test.js`.
- The `redactSecrets` module scans the files to ensure no API keys or environment secrets leak to the AI prompt.
- Stage moves to `COLLECTING_EVIDENCE`.

#### 4. Gemma 3 Reasoning
- The prompt is dispatched to local Ollama (`gemma:latest`).
- Gemma reasons through the error and proposes a minimal 4-line patch guard:
```diff
--- a/fixtures/broken-calc/src/calculator.js
+++ b/fixtures/broken-calc/src/calculator.js
@@ -14,4 +14,7 @@
 export function divide(a, b) {
+  if (b === 0) {
+    throw new RangeError('Division by zero is undefined');
+  }
   return a / b;
 }
```
- Stage advances to `AWAITING_PROPOSAL`.

#### 5. Gate 1: Human Maintainer Proposal Review
- PatchGarden **pauses execution** in Temporal and waits for your signal.
- In the Dashboard ([http://localhost:3000](http://localhost:3000)):
  1. Inspect the proposal under the **Candidate Patch** tab.
  2. Click **Approve Proposal & Run Verify**.

#### 6. Isolated Worktree Execution
- `createWorkspace` spins up an isolated Git worktree (`/workspaces/pg_worktree_<jobId>`). The main repository remains completely untouched.
- `applyPatch` runs `git apply` with path traversal security checks.
- `verifyPatch` executes the full test suite in isolation.
- Zero regressions detected! All 5 tests pass.

#### 7. Gate 2: Final Maintainer Sign-Off
- Stage advances to `AWAITING_FINAL`.
- In the Dashboard:
  1. Review the green verification logs under **Test Runner Output**.
  2. Click **Sign Off & Merge Candidate**.

#### 8. Final Cryptographic Seal
- The worker executes `completeJob`.
- The patch candidate and test results are sealed in `evidence/<jobId>/summary.json`.
- Stage reaches `COMPLETE`.

---

## 🔍 Verifying the Evidence Bundle

All actions taken by PatchGarden produce tamper-evident JSON records. You can inspect the audit log directly:

```bash
# Query the job state from SQLite
node -e "
  const db = require('better-sqlite3')('patchgarden.db');
  console.log(db.prepare('SELECT id, stage, status, approvalState FROM jobs').all());
"
```

Or view the evidence folder:
```bash
ls evidence/<jobId>/
# Output:
# - baseline.json      (initial test failure evidence)
# - proposal.json      (Gemma 3 reasoning and diff)
# - verification.json  (isolated test pass confirmation)
# - summary.json       (signed job audit record)
```
