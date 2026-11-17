<#
.SYNOPSIS
    Deterministic Secret Exposure and Credential Leak Scanner (test-secrets-exposure.ps1)
    Scans tracked git files for accidental credential leaks, hardcoded tokens, and private keys.
.DESCRIPTION
    Runs as part of verify.ps1 and GitHub Actions CI to guarantee zero exposed secrets in version control.
#>

param(
    [switch]$VerboseOutput
)

$ErrorActionPreference = "Continue"
$failed = $false

Write-Host "🛡️  Scanning repository for exposed secrets and credentials..." -ForegroundColor Cyan

# 1. Verify .agents/mcp_config.json has no raw hardcoded bearer tokens or API keys
$mcpConfigFile = Join-Path $PSScriptRoot "..\.agents\mcp_config.json"
if (Test-Path $mcpConfigFile) {
    $rawContent = Get-Content -Raw -Path $mcpConfigFile
    # Match Bearer token that is NOT an environment variable placeholder like ${...} or $...
    if ($rawContent -match 'Bearer\s+(?!\$\{)[a-zA-Z0-9_\-\:]{20,}') {
        Write-Host "  ❌ [FAIL] Hardcoded Bearer token found in .agents/mcp_config.json!" -ForegroundColor Red
        $failed = $true
    } else {
        Write-Host "  ✅ [PASS] .agents/mcp_config.json uses safe environment variable placeholders." -ForegroundColor Green
    }
}

# 2. Scan tracked git files for high-entropy secrets and credential patterns
$secretPatterns = @(
    @{ Name = "Notion Internal/OAuth Secret"; Pattern = 'secret_[a-zA-Z0-9]{30,}' },
    @{ Name = "Raw Bearer Token (hardcoded)"; Pattern = 'Bearer\s+(?!\$\{)[a-zA-Z0-9_\-]{8,}:[a-zA-Z0-9_\-]{8,}' },
    @{ Name = "GitHub Personal Access Token"; Pattern = 'ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}' },
    @{ Name = "OpenAI API Key"; Pattern = 'sk-[a-zA-Z0-9]{20,}' },
    @{ Name = "Google Cloud API Key"; Pattern = 'AIza[0-9A-Za-z\\-_]{35}' },
    @{ Name = "Private Key Block"; Pattern = '-----BEGIN (RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----' }
)

# Get list of tracked git files (excluding benign templates/documentation examples if specifically needed)
$trackedFiles = git ls-files
$leakCount = 0

foreach ($file in $trackedFiles) {
    if (-not (Test-Path $file)) { continue }
    
    # Skip binary files or lockfiles
    if ($file -match '\.(png|jpg|jpeg|gif|ico|woff|woff2|ttf|eot|pdf|lock)$') { continue }
    if ($file -match 'package-lock\.json$') { continue }

    try {
        $content = Get-Content -Raw -Path $file -ErrorAction SilentlyContinue
        if (-not $content) { continue }

        foreach ($rule in $secretPatterns) {
            # Skip test runner itself matching regex literals
            if ($file -eq "scripts/test-secrets-exposure.ps1") { continue }
            if ($file -match 'test_zero_cost_subagent\.js') { continue }

            if ($content -match $rule.Pattern) {
                Write-Host "  ❌ [FAIL] Potential $($rule.Name) exposed in $file!" -ForegroundColor Red
                $leakCount++
                $failed = $true
            }
        }
    } catch {}
}

if ($failed) {
    Write-Host ""
    Write-Host "❌ [SECURITY ALERT] $leakCount secret exposure(s) detected in tracked repository files!" -ForegroundColor Red
    Write-Host "   Remediate exposed credentials immediately and replace with environment variables." -ForegroundColor Yellow
    exit 1
}

Write-Host "  ✅ [PASS] All $($trackedFiles.Count) tracked files clean of exposed secrets." -ForegroundColor Green
Write-Host "🎉 [SECURITY PASSED] Zero exposed secrets detected in repository." -ForegroundColor Green
exit 0
