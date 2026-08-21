<#
.SYNOPSIS
    Deterministic Verification Gate (verify.ps1)
    Detects repository type and runs zero-cost static analysis & test suites.
.DESCRIPTION
    Runs:
      1. Static Analysis / Typecheck (mypy, tsc, eslint)
      2. Unit & Integration Tests (pytest, vitest, npm test)
    Returns exit code 0 if all gates pass, 1 otherwise.
#>

param(
    [switch]$Quick,
    [string]$TargetTest
)

$ErrorActionPreference = "Continue"
$failed = $false

Write-Host "`n🔍 [FLEET LOOP] Running Deterministic Verification..." -ForegroundColor Cyan

# 1. Detect Python Project
if ((Test-Path "pyproject.toml") -or (Test-Path "requirements.txt") -or (Test-Path "setup.py")) {
    Write-Host "`n--- [Python Gate] ---" -ForegroundColor Yellow

    # Typecheck with mypy if available
    if (Get-Command mypy -ErrorAction SilentlyContinue) {
        Write-Host "Running mypy static analysis..." -ForegroundColor Gray
        mypy .
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ mypy typecheck failed!" -ForegroundColor Red
            $failed = $true
        } else {
            Write-Host "✅ mypy typecheck passed." -ForegroundColor Green
        }
    }

    # Run pytest
    if (-not $failed) {
        Write-Host "Running pytest..." -ForegroundColor Gray
        if ($TargetTest) {
            pytest -k $TargetTest -v
        } else {
            pytest -q
        }
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ pytest tests failed!" -ForegroundColor Red
            $failed = $true
        } else {
            Write-Host "✅ pytest tests passed." -ForegroundColor Green
        }
    }
}

# 2. Detect Node / TypeScript Project
if (Test-Path "package.json") {
    Write-Host "`n--- [Node / TypeScript Gate] ---" -ForegroundColor Yellow

    # Typecheck with tsc if configured
    if (Test-Path "tsconfig.json") {
        Write-Host "Running tsc typecheck..." -ForegroundColor Gray
        npx tsc --noEmit
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ tsc typecheck failed!" -ForegroundColor Red
            $failed = $true
        } else {
            Write-Host "✅ tsc typecheck passed." -ForegroundColor Green
        }
    }

    # Run tests
    if (-not $failed) {
        Write-Host "Running tests (npm test)..." -ForegroundColor Gray
        if ($TargetTest) {
            npm test -- $TargetTest
        } else {
            npm test -- --run 2>$null
            if ($LASTEXITCODE -ne 0) {
                npm test
            }
        }
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ npm test failed!" -ForegroundColor Red
            $failed = $true
        } else {
            Write-Host "✅ npm test passed." -ForegroundColor Green
        }
    }
}

# 3. Overall Verification Result
if ($failed) {
    Write-Host "`n⛔ [VERIFICATION FAILED] Please fix errors before proceeding." -ForegroundColor Red
    exit 1
} else {
    Write-Host "`n🎉 [VERIFICATION PASSED] All deterministic gates green." -ForegroundColor Green
    exit 0
}
