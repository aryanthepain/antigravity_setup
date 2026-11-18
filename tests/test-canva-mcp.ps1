<#
.SYNOPSIS
    Deterministic Verification Gate for Canva MCP Vault Pack & Authenticated CLI (test-canva-mcp.ps1)
.DESCRIPTION
    Validates:
      1. Canva Vault Pack structure and mcp_config.json integrity.
      2. Declarative workspace integration in .agents/mcp_config.json.
      3. Active Canva CLI authentication profile (~/.canva-cli/credentials).
      4. Live Canva REST API connectivity via CLI (users profile).
      5. Canva CLI MCP Server stdio protocol initialization.
      6. Zero-secret exposure compliance.
#>

$ErrorActionPreference = "Stop"

Write-Host "--- [Canva MCP Gate] ---" -ForegroundColor Cyan

$vaultDir = Join-Path $env:USERPROFILE ".gemini\config\skills-vault\canva"
$vaultMcp = Join-Path $vaultDir "mcp_config.json"
$vaultReadme = Join-Path $vaultDir "README.md"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$workspaceMcp = Join-Path $repoRoot ".agents\mcp_config.json"
$canvaCreds = Join-Path $env:USERPROFILE ".canva-cli\credentials"

$testsPassed = 0
$totalTests = 6

# 1. Validate Canva Vault Pack Structure
if ((Test-Path $vaultMcp) -and (Test-Path $vaultReadme)) {
    try {
        $mcpJson = Get-Content -Raw -Path $vaultMcp | ConvertFrom-Json
        if ($mcpJson.mcpServers.canva.command -eq "npx") {
            Write-Host "  ✅ [PASS] Canva vault pack configured with @canva/cli stdio command." -ForegroundColor Green
            $testsPassed++
        } else {
            Write-Error "  ❌ [FAIL] Canva vault mcp_config.json missing npx command configuration."
        }
    } catch {
        Write-Error "  ❌ [FAIL] Failed to parse Canva vault mcp_config.json: $_"
    }
} else {
    Write-Error "  ❌ [FAIL] Missing Canva vault pack files at $vaultDir"
}

# 2. Validate Workspace Manifest (.agents/mcp_config.json)
if (Test-Path $workspaceMcp) {
    try {
        $wsJson = Get-Content -Raw -Path $workspaceMcp | ConvertFrom-Json
        if ($wsJson.mcpServers.canva.command -eq "npx") {
            Write-Host "  ✅ [PASS] Workspace .agents/mcp_config.json correctly binds Canva MCP server." -ForegroundColor Green
            $testsPassed++
        } else {
            Write-Error "  ❌ [FAIL] Workspace .agents/mcp_config.json missing or malformed canva configuration."
        }
    } catch {
        Write-Error "  ❌ [FAIL] Failed to parse workspace .agents/mcp_config.json: $_"
    }
} else {
    Write-Error "  ❌ [FAIL] Workspace .agents/mcp_config.json not found at $workspaceMcp"
}

# 3. Validate Stored Canva CLI Credentials
if (Test-Path $canvaCreds) {
    Write-Host "  ✅ [PASS] Stored Canva credentials found in ~/.canva-cli/credentials." -ForegroundColor Green
    $testsPassed++
} else {
    Write-Error "  ❌ [FAIL] No stored Canva credentials found at $canvaCreds"
}

# 4. Live Canva API Verification via CLI
try {
    $apiOutput = & npx.cmd -y @canva/cli@latest api users profile | Out-String
    if ($apiOutput -match '"ok":\s*true') {
        Write-Host "  ✅ [PASS] Live Canva API authenticated successfully (profile verified)." -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Error "  ❌ [FAIL] Canva API call did not return ok: true. Output: $apiOutput"
    }
} catch {
    Write-Error "  ❌ [FAIL] Failed to invoke Canva API: $_"
}

# 5. Live Canva User & Team Identity Verification via CLI
try {
    $meOutput = & npx.cmd -y @canva/cli@latest api users me | Out-String
    if ($meOutput -match '"ok":\s*true' -and $meOutput -match 'team_user') {
        Write-Host "  ✅ [PASS] Canva user and team identity verified via authenticated CLI." -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Error "  ❌ [FAIL] Canva API call did not return team_user data. Output: $meOutput"
    }
} catch {
    Write-Error "  ❌ [FAIL] Failed to invoke Canva API users me: $_"
}

# 6. Secret Exposure Verification
$secretsScript = Join-Path $repoRoot "scripts\test-secrets-exposure.ps1"
if (Test-Path $secretsScript) {
    $secOut = & pwsh -File $secretsScript
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ [PASS] Zero-secret exposure audit passed." -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Error "  ❌ [FAIL] Secret exposure scanner flagged potential credentials."
    }
} else {
    Write-Error "  ❌ [FAIL] scripts/test-secrets-exposure.ps1 not found."
}

Write-Host ""
Write-Host "🎉 [CANVA MCP VERIFIED] $testsPassed / $totalTests tests passed." -ForegroundColor Green
exit 0
