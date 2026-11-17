<#
.SYNOPSIS
    Deterministic Verification Gate for Canva MCP Vault Pack & Remote Connectivity (test-canva-mcp.ps1)
.DESCRIPTION
    Validates:
      1. Canva Vault Pack structure and mcp_config.json integrity.
      2. Declarative workspace integration in .agents/mcp_config.json.
      3. Live endpoint connectivity to https://mcp.canva.com/mcp and RFC OAuth resource metadata.
      4. Zero-secret exposure compliance.
#>

$ErrorActionPreference = "Stop"

Write-Host "--- [Canva MCP Gate] ---" -ForegroundColor Cyan

$vaultDir = Join-Path $env:USERPROFILE ".gemini\config\skills-vault\canva"
$vaultMcp = Join-Path $vaultDir "mcp_config.json"
$vaultReadme = Join-Path $vaultDir "README.md"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$workspaceMcp = Join-Path $repoRoot ".agents\mcp_config.json"

$testsPassed = 0
$totalTests = 5

# 1. Validate Canva Vault Pack Structure
if ((Test-Path $vaultMcp) -and (Test-Path $vaultReadme)) {
    try {
        $mcpJson = Get-Content -Raw -Path $vaultMcp | ConvertFrom-Json
        if ($mcpJson.mcpServers.canva.url -eq "https://mcp.canva.com/mcp" -and 
            $mcpJson.mcpServers.canva.headers.Authorization -eq 'Bearer ${CANVA_TOKEN}') {
            Write-Host "  ✅ [PASS] Canva vault pack configured with correct endpoint and `${CANVA_TOKEN}` placeholder." -ForegroundColor Green
            $testsPassed++
        } else {
            Write-Error "  ❌ [FAIL] Canva vault mcp_config.json has invalid URL or auth header."
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
        if ($wsJson.mcpServers.canva.url -eq "https://mcp.canva.com/mcp" -and
            $wsJson.mcpServers.canva.headers.Authorization -eq 'Bearer ${CANVA_TOKEN}') {
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

# 3. Live Protocol Connectivity & OAuth Challenge Check
$mcpEndpoint = "https://mcp.canva.com/mcp"
try {
    $resp = Invoke-WebRequest -Uri $mcpEndpoint -Method Post -ContentType "application/json" -Body '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"antigravity","version":"1.0.0"}}}' -SkipHttpErrorCheck -TimeoutSec 10
    if ($resp.StatusCode -eq 401 -and $resp.Content -match 'invalid_token') {
        Write-Host "  ✅ [PASS] Canva MCP endpoint reachable ($mcpEndpoint) - verified OAuth Bearer challenge." -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Error "  ❌ [FAIL] Unexpected status code from Canva MCP endpoint: $($resp.StatusCode)"
    }
} catch {
    Write-Error "  ❌ [FAIL] Network connectivity failure reaching Canva MCP: $_"
}

# 4. OAuth Resource Metadata Verification
$metadataEndpoint = "https://mcp.canva.com/.well-known/oauth-protected-resource/mcp"
try {
    $metaResp = Invoke-RestMethod -Uri $metadataEndpoint -Method Get -TimeoutSec 10
    if ($metaResp.resource -eq "https://mcp.canva.com/mcp" -and $metaResp.scopes_supported -contains "design:content:read") {
        Write-Host "  ✅ [PASS] Verified Canva OAuth resource metadata ($($metaResp.scopes_supported.Count) scopes supported)." -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Error "  ❌ [FAIL] Canva OAuth metadata did not report expected resource or scopes."
    }
} catch {
    Write-Error "  ❌ [FAIL] Failed to query Canva OAuth metadata: $_"
}

# 5. Secret Exposure Verification
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
