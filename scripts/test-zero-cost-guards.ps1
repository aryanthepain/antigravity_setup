<#
.SYNOPSIS
    Test-Zero-Cost-Guards - Anti-Paid & Zero-Cost Model Security Audit Gate
.DESCRIPTION
    Runs exhaustive verification to guarantee that no non-free, paid, or spoofed models
    can ever be called by subagent.js or Invoke-Subagent.ps1.
#>

[CmdletBinding()]
param()

$testFile = Join-Path $PSScriptRoot "..\tests\test_zero_cost_subagent.js"

if (-not (Test-Path $testFile)) {
    Write-Error "Test file not found: $testFile"
    exit 1
}

Write-Host "🛡️ Running Zero-Cost Security Gate..." -ForegroundColor Cyan
node $testFile

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Zero-Cost Security Gate Failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Zero-Cost Security Gate Passed (0 paid models reachable)." -ForegroundColor Green
exit 0
