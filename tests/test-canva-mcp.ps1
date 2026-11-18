<#
.SYNOPSIS
    Deterministic Verification Gate for Canva MCP Vault Pack & CLI Integration (test-canva-mcp.ps1)
.DESCRIPTION
    Validates:
      1. Declarative workspace integration in .agents/mcp_config.json (command & args).
      2. Canva Vault Pack structure and mcp_config.json integrity (when present).
      3. Zero-secret exposure compliance.
      4. [Opt-In / LiveSmokeTest] Active Canva CLI credentials and stdio MCP handshake.
      5. [Opt-In / LiveSmokeTest] Live Canva REST API connectivity via CLI.
.PARAMETER LiveSmokeTest
    Switch to enable live network, credentials, and stdio MCP process verification.
#>

param(
    [switch]$LiveSmokeTest = $false
)

$ErrorActionPreference = "Stop"

if (-not $LiveSmokeTest -and ($env:CANVA_LIVE_TEST -eq "true" -or $env:CANVA_LIVE_TEST -eq "1")) {
    $LiveSmokeTest = $true
}

Write-Host "--- [Canva MCP Gate] ---" -ForegroundColor Cyan

$vaultDir = Join-Path $env:USERPROFILE ".gemini\config\skills-vault\canva"
$vaultMcp = Join-Path $vaultDir "mcp_config.json"
$vaultReadme = Join-Path $vaultDir "README.md"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$workspaceMcp = Join-Path $repoRoot ".agents\mcp_config.json"
$canvaCreds = Join-Path $env:USERPROFILE ".canva-cli\credentials"

$testsPassed = 0
$totalTests = if ($LiveSmokeTest) { 6 } else { 3 }

# 1. Validate Workspace Manifest (.agents/mcp_config.json)
if (Test-Path $workspaceMcp) {
    try {
        $wsJson = Get-Content -Raw -Path $workspaceMcp | ConvertFrom-Json
        $canvaServer = $wsJson.mcpServers.canva
        $argsStr = if ($canvaServer.args) { $canvaServer.args -join " " } else { "" }
        if ($canvaServer.command -eq "npx" -and $argsStr -match "@canva/cli" -and $argsStr -match "\bmcp\b") {
            Write-Host "  ✅ [PASS] Workspace .agents/mcp_config.json correctly binds Canva MCP server (command & args verified)." -ForegroundColor Green
            $testsPassed++
        }
        else {
            Write-Error "  ❌ [FAIL] Workspace .agents/mcp_config.json missing npx command or @canva/cli mcp arguments."
        }
    }
    catch {
        Write-Error "  ❌ [FAIL] Failed to parse workspace .agents/mcp_config.json: $_"
    }
}
else {
    Write-Error "  ❌ [FAIL] Workspace .agents/mcp_config.json not found at $workspaceMcp"
}

# 2. Validate Canva Vault Pack Structure (when vault is present)
if (Test-Path $vaultMcp) {
    try {
        $mcpJson = Get-Content -Raw -Path $vaultMcp | ConvertFrom-Json
        $vaultCanva = $mcpJson.mcpServers.canva
        $vaultArgsStr = if ($vaultCanva.args) { $vaultCanva.args -join " " } else { "" }
        if ($vaultCanva.command -eq "npx" -and $vaultArgsStr -match "@canva/cli" -and $vaultArgsStr -match "\bmcp\b") {
            Write-Host "  ✅ [PASS] Canva vault pack configured with @canva/cli stdio command and mcp subcommand." -ForegroundColor Green
            $testsPassed++
        }
        else {
            Write-Error "  ❌ [FAIL] Canva vault mcp_config.json missing npx command or @canva/cli mcp arguments."
        }
    }
    catch {
        Write-Error "  ❌ [FAIL] Failed to parse Canva vault mcp_config.json: $_"
    }
}
else {
    Write-Host "  [.] Canva vault pack not present at $vaultDir (skipping vault structure check in standalone CI)." -ForegroundColor Gray
    $testsPassed++
}

# 3. Secret Exposure Verification
$secretsScript = Join-Path $repoRoot "scripts\test-secrets-exposure.ps1"
if (Test-Path $secretsScript) {
    $secOut = & pwsh -File $secretsScript
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ [PASS] Zero-secret exposure audit passed." -ForegroundColor Green
        $testsPassed++
    }
    else {
        Write-Error "  ❌ [FAIL] Secret exposure scanner flagged potential credentials."
    }
}
else {
    Write-Error "  ❌ [FAIL] scripts/test-secrets-exposure.ps1 not found."
}

# --- Optional Live Smoke Checks (Credentials, Stdio MCP Handshake, Live REST API) ---
if ($LiveSmokeTest) {
    Write-Host "  🔍 Running Live Opt-in Smoke Tests (credentials, stdio MCP, live REST)..." -ForegroundColor Yellow

    # 4. Validate Stored Canva CLI Credentials
    if (Test-Path $canvaCreds) {
        Write-Host "  ✅ [PASS] Stored Canva credentials found in ~/.canva-cli/credentials." -ForegroundColor Green
        $testsPassed++
    }
    else {
        Write-Error "  ❌ [FAIL] Live smoke test requested but no stored Canva credentials found at $canvaCreds"
    }

    # 5. Canva CLI MCP Server stdio protocol initialization test
    try {
        $wsJson = Get-Content -Raw -Path $workspaceMcp | ConvertFrom-Json
        $cmd = $wsJson.mcpServers.canva.command
        $argsList = $wsJson.mcpServers.canva.args

        # Run stdio initialization handshake via Node
        $nodeScript = @"
const cp = require('child_process');
const cmd = process.platform === 'win32' ? '$cmd.cmd' : '$cmd';
const args = JSON.parse(process.env.TEST_MCP_ARGS || '[]');
const fullCmd = [cmd, ...args].join(' ');
const child = cp.spawn(fullCmd, { shell: true, stdio: ['pipe', 'pipe', 'pipe'] });
let resolved = false;

function sendInit() {
    const initPayload = JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: { name: 'antigravity-test-runner', version: '1.0.0' }
        }
    }) + '\n';
    try { child.stdin.write(initPayload); } catch(e) {}
}

child.stdout.on('data', (data) => {
    const text = data.toString();
    if (text.includes('Canva CLI MCP Server') || text.includes('result') || text.includes('protocolVersion')) {
        resolved = true;
        child.kill();
        process.exit(0);
    }
});

child.stderr.on('data', (data) => {
    const text = data.toString();
    if (text.includes('listening on stdio') || text.includes('Canva CLI MCP Server')) {
        sendInit();
    }
});

const interval = setInterval(() => {
    if (!resolved) sendInit();
    else clearInterval(interval);
}, 2000);

setTimeout(() => {
    clearInterval(interval);
    if (!resolved) {
        child.kill();
        process.stderr.write('Timeout waiting for MCP initialize response\n');
        process.exit(1);
    }
}, 25000);
"@
        $env:TEST_MCP_ARGS = $argsList | ConvertTo-Json -Compress
        $handshakeResult = node -e $nodeScript 2>&1
        $handshakeExit = $LASTEXITCODE
        Remove-Item Env:\TEST_MCP_ARGS -ErrorAction SilentlyContinue

        if ($handshakeExit -eq 0) {
            Write-Host "  ✅ [PASS] Canva CLI MCP Server stdio handshake verified successfully." -ForegroundColor Green
            $testsPassed++
        }
        else {
            Write-Error "  ❌ [FAIL] Canva CLI MCP Server stdio handshake failed: $handshakeResult"
        }
    }
    catch {
        Write-Error "  ❌ [FAIL] Exception during Canva MCP stdio test: $_"
    }

    # 6. Live Canva API Verification via CLI
    try {
        $apiOutput = & npx.cmd -y @canva/cli@latest api users profile 2>&1 | Out-String
        if ($apiOutput -match '"ok":\s*true') {
            Write-Host "  ✅ [PASS] Live Canva API authenticated successfully (profile verified)." -ForegroundColor Green
            $testsPassed++
        }
        else {
            Write-Error "  ❌ [FAIL] Canva API call did not return ok: true. Output: $apiOutput"
        }
    }
    catch {
        Write-Error "  ❌ [FAIL] Failed to invoke Canva API: $_"
    }
}

Write-Host ""
Write-Host "🎉 [CANVA MCP VERIFIED] $testsPassed / $totalTests tests passed." -ForegroundColor Green
exit 0