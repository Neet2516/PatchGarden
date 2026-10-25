# PatchGarden Verification Script
# Runs the full verification pipeline: lint, typecheck, tests, and security scan

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "     PatchGarden System Verification    " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$GlobalStatus = 0

function Run-Step {
    param(
        [string]$Title,
        [string]$Command
    )

    Write-Host ">>> Running: $Title..." -ForegroundColor Yellow
    Invoke-Expression $Command
    if ($LASTEXITCODE -ne 0) {
        Write-Host "FAIL: $Title encountered errors (Exit Code $LASTEXITCODE)" -ForegroundColor Red
        $script:GlobalStatus = 1
    } else {
        Write-Host "PASS: $Title completed successfully" -ForegroundColor Green
    }
    Write-Host ""
}

# 1. Typecheck
Run-Step "TypeScript Check" "npm run typecheck --if-present"

# 2. Secret Scan
Run-Step "Secret Scanner" "node scripts/scan-secrets.mjs"

# 3. Unit & Security Tests
Run-Step "Vitest Suite" "npm test"

Write-Host "========================================" -ForegroundColor Cyan
if ($GlobalStatus -eq 0) {
    Write-Host "All verification checks passed cleanly!" -ForegroundColor Green
} else {
    Write-Host "Verification failed. Inspect above errors." -ForegroundColor Red
}
Write-Host "========================================" -ForegroundColor Cyan

exit $GlobalStatus
