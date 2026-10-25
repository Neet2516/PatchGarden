# PatchGarden Diagnostic Doctor
# Verifies environment readiness for Hacktoberfest 2026 Slow and Steady maintenance

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   PatchGarden System Health Doctor    " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$Passed = 0
$Failed = 0

function Test-Requirement {
    param(
        [string]$Name,
        [scriptblock]$Check,
        [string]$FixHint
    )

    Write-Host -NoNewline "Checking $Name... "
    try {
        $result = & $Check
        if ($result) {
            Write-Host "PASSED" -ForegroundColor Green
            $script:Passed++
        } else {
            Write-Host "FAILED" -ForegroundColor Red
            if ($FixHint) { Write-Host "   Hint: $FixHint" -ForegroundColor Yellow }
            $script:Failed++
        }
    } catch {
        Write-Host "FAILED ($($_.Exception.Message))" -ForegroundColor Red
        if ($FixHint) { Write-Host "   Hint: $FixHint" -ForegroundColor Yellow }
        $script:Failed++
    }
}

# 1. Node.js >= 20
Test-Requirement "Node.js (>= 20)" {
    $nodeVer = (node -v 2>$null)
    if ($nodeVer -match 'v(\d+)\.') {
        [int]$matches[1] -ge 20
    } else { $false }
} "Install Node.js 20 or later from https://nodejs.org"

# 2. Git installed
Test-Requirement "Git CLI" {
    $gitVer = (git --version 2>$null)
    $null -ne $gitVer
} "Install Git for Windows from https://git-scm.com"

# 3. Docker running
Test-Requirement "Docker Daemon" {
    $dockerInfo = (docker info 2>$null)
    $null -ne $dockerInfo
} "Start Docker Desktop or your Docker daemon"

# 4. Ollama Service (Port 11434)
Test-Requirement "Ollama (Gemma Inference)" {
    try {
        $resp = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -TimeoutSec 2 -ErrorAction Stop
        $null -ne $resp
    } catch {
        $false
    }
} "Run 'docker compose up -d ollama' or start local Ollama"

# 5. Temporal Service (Port 7233)
Test-Requirement "Temporal Server" {
    $tcp = Test-NetConnection -ComputerName localhost -Port 7233 -WarningAction SilentlyContinue
    $tcp.TcpTestSucceeded
} "Run 'docker compose up -d temporal' to start local Temporal workflow engine"

Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor Cyan
Write-Host "Summary: $Passed Passed, $Failed Failed" -ForegroundColor $(if ($Failed -eq 0) { "Green" } else { "Yellow" })
Write-Host "----------------------------------------" -ForegroundColor Cyan

if ($Failed -eq 0) {
    Write-Host "All systems ready for PatchGarden execution!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "Some components require setup before full execution." -ForegroundColor Yellow
    exit 1
}
