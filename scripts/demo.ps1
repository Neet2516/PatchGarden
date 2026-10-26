# PatchGarden End-to-End Demo
# Demonstrates "Slow and Steady" verified patch lifecycle

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "   PatchGarden - AI Maintenance Engineer Demo Run        " -ForegroundColor Cyan
Write-Host "   Theme: Slow and Steady - Hacktoberfest 2026 Week 3     " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Green
Write-Host ""

# Step 1: Healthcheck
Write-Host "1. Running Environment Pre-flight..." -ForegroundColor Cyan
powershell -ExecutionPolicy Bypass -File scripts/doctor.ps1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Doctor checks failed. Please resolve above items." -ForegroundColor Yellow
}

# Step 2: Fixture check
Write-Host ""
Write-Host "2. Target Broken Fixture: fixtures/broken-calc" -ForegroundColor Cyan
Write-Host "   Failure Symptom: divide by zero returns Infinity instead of throwing RangeError"

# Step 3: Fastify API status
Write-Host ""
Write-Host "3. Contacting PatchGarden API Server..." -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri "http://127.0.0.1:3001/health" -TimeoutSec 3 -ErrorAction Stop
    Write-Host "   API is live! Status: $($health.status), Version: $($health.version)" -ForegroundColor Green
} catch {
    Write-Host "   Local API server is not running on port 3001." -ForegroundColor Yellow
    Write-Host "   Run 'npm run dev -w packages/api' to launch it." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "Demo Walkthrough Instructions:" -ForegroundColor Cyan
Write-Host "1. Open dashboard: http://localhost:3000" -ForegroundColor White
Write-Host "2. Observe active job 'job_slow_steady_01' waiting at Maintainer Gate" -ForegroundColor White
Write-Host "3. Inspect Gemma 3:4b diff proposal in Candidate Patch tab" -ForegroundColor White
Write-Host "4. Click 'Approve Proposal & Provision Worktree' to execute isolated worktree tests" -ForegroundColor White
Write-Host "5. Click 'Sign Off & Seal Candidate' to preserve cryptographic evidence" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Green
