<#
.SYNOPSIS
    PR Checks & CodeRabbit Review Watcher (watch-pr-checks.ps1)
    Monitors GitHub PR CI/CD status checks and external automated reviews (CodeRabbit) until completion.
    Designed to run as a non-blocking background terminal task alongside concurrent local subagent reviews.
.EXAMPLE
    pwsh -File .\scripts\watch-pr-checks.ps1 -PRNumber 42
    pwsh -File .\scripts\watch-pr-checks.ps1 -RequireCodeRabbit
#>

param(
    [Parameter(Mandatory = $false, Position = 0)]
    [int]$PRNumber = 0,

    [int]$TimeoutSeconds = 1800,
    [int]$PollIntervalSeconds = 15,
    [switch]$RequireCodeRabbit,
    [switch]$Quiet
)

$ErrorActionPreference = "Stop"

function Write-Log {
    param([string]$Message, [string]$Color = "Cyan")
    if (-not $Quiet) {
        $timestamp = Get-Date -Format "HH:mm:ss"
        Write-Host "[$timestamp] [watch-pr-checks] $Message" -ForegroundColor $Color
    }
}

# 1. Resolve PR Number
if ($PRNumber -le 0) {
    try {
        $prJson = gh pr view --json number 2>$null
        if ($LASTEXITCODE -eq 0 -and $prJson) {
            $parsed = $prJson | ConvertFrom-Json
            $PRNumber = [int]$parsed.number
        }
    }
    catch {
        # Fall through to error below
    }

    if ($PRNumber -le 0) {
        Write-Host "[watch-pr-checks] ERROR: Could not determine active PR number from current branch. Pass -PRNumber <n> explicitly." -ForegroundColor Red
        exit 1
    }
}

Write-Log "Starting background watcher for PR #$PRNumber (Timeout: ${TimeoutSeconds}s, Interval: ${PollIntervalSeconds}s)" "Cyan"

$startTime = [System.Diagnostics.Stopwatch]::StartNew()

# 2. Wait for checks to be registered by GitHub Actions / external providers (initial grace period)
Write-Log "Awaiting initial CI check registration on GitHub..." "Gray"
$checksRegistered = $false
$registerAttempts = 0
$maxRegisterAttempts = 12 # Up to 60s

while ($registerAttempts -lt $maxRegisterAttempts) {
    $rollupJson = gh pr view $PRNumber --json statusCheckRollup 2>$null
    if ($LASTEXITCODE -eq 0 -and $rollupJson) {
        $rollup = ($rollupJson | ConvertFrom-Json).statusCheckRollup
        if ($rollup -and $rollup.Count -gt 0) {
            $checksRegistered = $true
            Write-Log "Detected $($rollup.Count) registered status check(s)." "Green"
            break
        }
    }
    Start-Sleep -Seconds 5
    $registerAttempts++
}

if (-not $checksRegistered) {
    Write-Log "No status checks registered after 60s. Proceeding to watch mode..." "Yellow"
}

# 3. Stream / Watch CI Status Checks
Write-Log "Monitoring CI status checks via 'gh pr checks $PRNumber --watch'..." "Cyan"
$checksSucceeded = $true

try {
    # gh pr checks --watch streams until all checks finish
    gh pr checks $PRNumber --watch
    if ($LASTEXITCODE -ne 0) {
        $checksSucceeded = $false
        Write-Log "One or more status checks reported failure or error." "Yellow"
    }
    else {
        Write-Log "All CI status checks completed successfully." "Green"
    }
}
catch {
    $checksSucceeded = $false
    Write-Log "Exception encountered while watching checks: $_" "Yellow"
}

# 4. Await CodeRabbit & External Review Completion
Write-Log "Checking external automated review requests (CodeRabbit)..." "Cyan"

$codeRabbitFinished = $false
while ($startTime.Elapsed.TotalSeconds -lt $TimeoutSeconds) {
    $prDataJson = gh pr view $PRNumber --json reviewRequests,reviews,reviewDecision 2>$null
    if ($LASTEXITCODE -eq 0 -and $prDataJson) {
        $prData = $prDataJson | ConvertFrom-Json
        $pendingLogins = @()
        if ($prData.reviewRequests) {
            $pendingLogins = $prData.reviewRequests | ForEach-Object { $_.login }
        }

        $reviews = @()
        if ($prData.reviews) {
            $reviews = $prData.reviews
        }

        $hasCrPending = ($pendingLogins -contains "coderabbitai" -or $pendingLogins -contains "coderabbitai[bot]")
        $crReviews = $reviews | Where-Object { $_.author.login -like "*coderabbit*" }

        if ($RequireCodeRabbit) {
            # Must have at least one completed CodeRabbit review
            if ($crReviews -and $crReviews.Count -gt 0 -and -not $hasCrPending) {
                Write-Log "CodeRabbit review submitted ($($crReviews.Count) review(s) found)." "Green"
                $codeRabbitFinished = $true
                break
            }
            Write-Log "Waiting for CodeRabbit review submission (pending: $hasCrPending)..." "Gray"
        }
        else {
            # Normal mode: if CodeRabbit was requested, wait for it; if not requested or already reviewed, proceed
            if (-not $hasCrPending -or ($crReviews -and $crReviews.Count -gt 0)) {
                Write-Log "CodeRabbit / external review requirements satisfied." "Green"
                $codeRabbitFinished = $true
                break
            }
            Write-Log "CodeRabbit review currently pending. Waiting ${PollIntervalSeconds}s..." "Gray"
        }
    }

    Start-Sleep -Seconds $PollIntervalSeconds
}

$startTime.Stop()
$elapsedSec = [math]::Round($startTime.Elapsed.TotalSeconds, 1)

# 5. Output Final Status Summary
Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "📋 PR #$PRNumber Remote Status Watch Completed in ${elapsedSec}s" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# Fetch latest status check summary
$finalRollupJson = gh pr view $PRNumber --json statusCheckRollup,reviews 2>$null
if ($finalRollupJson) {
    $finalData = $finalRollupJson | ConvertFrom-Json
    $checks = $finalData.statusCheckRollup
    if ($checks) {
        $failedChecks = $checks | Where-Object { $_.conclusion -in "FAILURE", "TIMED_OUT", "ACTION_REQUIRED" }
        $passedChecks = $checks | Where-Object { $_.conclusion -in "SUCCESS", "NEUTRAL", "SKIPPED" }
        Write-Host "CI Checks: $($passedChecks.Count) Passed | $($failedChecks.Count) Failed / Errored" -ForegroundColor $(if ($failedChecks.Count -eq 0) { "Green" } else { "Red" })
        if ($failedChecks.Count -gt 0) {
            foreach ($fc in $failedChecks) {
                Write-Host "  ❌ $($fc.name) - $($fc.conclusion)" -ForegroundColor Red
            }
            $checksSucceeded = $false
        }
    }

    $crReviewsFinal = $finalData.reviews | Where-Object { $_.author.login -like "*coderabbit*" }
    Write-Host "CodeRabbit Reviews: $($crReviewsFinal.Count) submitted" -ForegroundColor Green
}

if ($checksSucceeded) {
    Write-Host "`n🎉 [SUCCESS] PR #$PRNumber checks and reviews are ready for convergence triage." -ForegroundColor Green
    exit 0
}
else {
    Write-Host "`n⚠️ [WARNING] PR #$PRNumber checks completed with one or more failures." -ForegroundColor Yellow
    exit 1
}
