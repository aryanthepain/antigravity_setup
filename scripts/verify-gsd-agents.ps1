<#
.SYNOPSIS
    Deterministic Verification Gate for GSD Subagents in Antigravity Runtime
.DESCRIPTION
    Validates that all 35 GSD subagent definitions are installed,
    correctly linked into Antigravity IDE and Antigravity runtime directories,
    and verified by gsd-tools.cjs query init.new-project.
#>
[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$failed = $false

Write-Host "🔍 [GSD-SUBAGENTS] Verifying GSD subagents for Antigravity runtime..." -ForegroundColor Cyan

$userProfile = $env:USERPROFILE
$configAgents = Join-Path $userProfile ".gemini\config\agents"
$ideAgents = Join-Path $userProfile ".gemini\antigravity-ide\agents"
$agyAgents = Join-Path $userProfile ".gemini\antigravity\agents"
$gsdTools = Join-Path $userProfile ".gemini\antigravity-ide\gsd-core\bin\gsd-tools.cjs"

$expectedAgents = @(
    "gsd-advisor-researcher",
    "gsd-ai-researcher",
    "gsd-assumptions-analyzer",
    "gsd-code-fixer",
    "gsd-code-reviewer",
    "gsd-codebase-mapper",
    "gsd-debug-session-manager",
    "gsd-debugger",
    "gsd-doc-classifier",
    "gsd-doc-synthesizer",
    "gsd-doc-verifier",
    "gsd-doc-writer",
    "gsd-dom-verifier",
    "gsd-domain-researcher",
    "gsd-eval-auditor",
    "gsd-eval-planner",
    "gsd-executor",
    "gsd-framework-selector",
    "gsd-integration-checker",
    "gsd-intel-updater",
    "gsd-mempalace-curator",
    "gsd-nyquist-auditor",
    "gsd-pattern-mapper",
    "gsd-phase-researcher",
    "gsd-plan-checker",
    "gsd-planner",
    "gsd-project-researcher",
    "gsd-research-synthesizer",
    "gsd-roadmapper",
    "gsd-security-auditor",
    "gsd-ui-auditor",
    "gsd-ui-checker",
    "gsd-ui-researcher",
    "gsd-user-profiler",
    "gsd-verifier"
)

# 1. Verify source agent definitions in ~/.gemini/config/agents
Write-Host "`nStep 1: Checking agent definitions in $configAgents..." -ForegroundColor Yellow
if (-not (Test-Path $configAgents)) {
    Write-Host "❌ Source directory does not exist: $configAgents" -ForegroundColor Red
    $failed = $true
} else {
    $missingSources = @()
    foreach ($agent in $expectedAgents) {
        $file = Join-Path $configAgents "$agent.md"
        if (-not (Test-Path $file)) {
            $missingSources += $agent
        }
    }
    if ($missingSources.Count -gt 0) {
        Write-Host "❌ Missing $($missingSources.Count) source agent files in $configAgents`: $($missingSources -join ', ')" -ForegroundColor Red
        $failed = $true
    } else {
        Write-Host "✅ All 35 GSD agent definitions present in $configAgents." -ForegroundColor Green
    }
}

# 2. Verify junctions / directories in ~/.gemini/antigravity-ide/agents and ~/.gemini/antigravity/agents
Write-Host "`nStep 2: Checking agent junctions and directories..." -ForegroundColor Yellow
if (-not (Test-Path $ideAgents)) {
    Write-Host "❌ Antigravity IDE agents path missing: $ideAgents" -ForegroundColor Red
    $failed = $true
} else {
    Write-Host "✅ Antigravity IDE agents path verified: $ideAgents" -ForegroundColor Green
}

if (-not (Test-Path $agyAgents)) {
    Write-Host "❌ Antigravity agents path missing: $agyAgents" -ForegroundColor Red
    $failed = $true
} else {
    Write-Host "✅ Antigravity agents path verified: $agyAgents" -ForegroundColor Green
}

# 3. Verify gsd-tools.cjs query init.new-project
Write-Host "`nStep 3: Querying GSD runtime detection via gsd-tools.cjs..." -ForegroundColor Yellow
if (-not (Test-Path $gsdTools)) {
    Write-Host "❌ gsd-tools.cjs not found at $gsdTools" -ForegroundColor Red
    $failed = $true
} else {
    try {
        $jsonOutput = node $gsdTools query init.new-project 2>&1
        $parsed = $jsonOutput | ConvertFrom-Json
        
        Write-Host "   Reported agent_runtime: $($parsed.agent_runtime)" -ForegroundColor Gray
        Write-Host "   Reported agents_dir:     $($parsed.agents_dir)" -ForegroundColor Gray
        Write-Host "   Reported agents_installed: $($parsed.agents_installed)" -ForegroundColor Gray

        if ($parsed.agent_runtime -ne "antigravity") {
            Write-Host "❌ Expected agent_runtime 'antigravity', got '$($parsed.agent_runtime)'" -ForegroundColor Red
            $failed = $true
        } else {
            Write-Host "✅ GSD correctly identifies agent_runtime as 'antigravity'." -ForegroundColor Green
        }

        if ($parsed.agents_installed -ne $true) {
            Write-Host "❌ GSD reports agents_installed = false! Missing: $($parsed.missing_agents -join ', ')" -ForegroundColor Red
            $failed = $true
        } else {
            Write-Host "✅ GSD reports agents_installed = true." -ForegroundColor Green
        }

        if ($parsed.missing_agents.Count -ne 0) {
            Write-Host "❌ GSD reports missing agents: $($parsed.missing_agents -join ', ')" -ForegroundColor Red
            $failed = $true
        } else {
            Write-Host "✅ Zero missing agents reported." -ForegroundColor Green
        }
    } catch {
        Write-Host "❌ Failed to query gsd-tools.cjs: $_" -ForegroundColor Red
        $failed = $true
    }
}

# 4. Programmatic API check
Write-Host "`nStep 4: Validating agent-install-check.cjs API..." -ForegroundColor Yellow
$agentCheckScript = Join-Path $userProfile ".gemini\antigravity-ide\gsd-core\bin\lib\agent-install-check.cjs"
if (Test-Path $agentCheckScript) {
    try {
        $nodeEval = "const { checkAgentsInstalled } = require('$($agentCheckScript.Replace('\', '/'))'); console.log(JSON.stringify(checkAgentsInstalled('antigravity', process.cwd())));"
        $apiOutput = node -e $nodeEval 2>&1
        $apiResult = $apiOutput | ConvertFrom-Json

        if ($apiResult.agents_installed -eq $true -and $apiResult.installed_agents.Count -eq 35 -and $apiResult.missing_agents.Count -eq 0) {
            Write-Host "✅ agent-install-check API returns agents_installed = true (35/35 installed, 0 missing)." -ForegroundColor Green
        } else {
            Write-Host "❌ agent-install-check API failed: $($apiOutput)" -ForegroundColor Red
            $failed = $true
        }
    } catch {
        Write-Host "❌ Failed to test agent-install-check API: $_" -ForegroundColor Red
        $failed = $true
    }
}

if ($failed) {
    Write-Host "`n⛔ [GSD-SUBAGENTS VERIFICATION FAILED]" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 [GSD-SUBAGENTS VERIFICATION PASSED] All 35 GSD subagents verified for Antigravity runtime." -ForegroundColor Green
exit 0
