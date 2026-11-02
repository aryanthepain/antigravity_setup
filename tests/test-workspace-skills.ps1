<#
.SYNOPSIS
    Deterministic Verification Gate for Antigravity Skill Vault, Rule Scoping & MCP Context Decoupling
#>

$ErrorActionPreference = "Stop"

Write-Host "--- [Skill Vault, Rule Scoping & MCP Context Gate] ---" -ForegroundColor Cyan

$vaultDir = Join-Path $env:USERPROFILE ".gemini\config\skills-vault"
$globalMcp = Join-Path $env:USERPROFILE ".gemini\config\mcp_config.json"
$globalConfig = Join-Path $env:USERPROFILE ".gemini\config\config.json"
$globalRules = Join-Path $env:USERPROFILE ".gemini\config\rules"
$ideMcp = Join-Path $env:USERPROFILE ".gemini\antigravity-ide\mcp"
$cliMcp = Join-Path $env:USERPROFILE ".gemini\antigravity-cli\mcp"
$mgrScript = Join-Path $PSScriptRoot "..\scripts\Manage-WorkspaceSkills.ps1"

$testsPassed = 0
$totalTests = 6

# 1. Verify Vault Directory Exists with 3 domain packs
if (Test-Path $vaultDir) {
    $packs = Get-ChildItem -Path $vaultDir -Directory | Select-Object -ExpandProperty Name
    if ($packs -contains "web-frontend" -and $packs -contains "cloud-data" -and $packs -contains "runtimes") {
        Write-Host "  [PASS] Skill Vault contains 'web-frontend', 'cloud-data', and 'runtimes' packs." -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Error "  [FAIL] Missing required packs in ${vaultDir}: $($packs -join ', ')"
    }
} else {
    Write-Error "  [FAIL] Vault directory does not exist: $vaultDir"
}

# 2. Verify heavy MCPs decoupled from global mcp_config.json
if (Test-Path $globalMcp) {
    $mcpContent = Get-Content -Raw -Path $globalMcp | ConvertFrom-Json
    $hasPlaywright = $mcpContent.mcpServers.PSObject.Properties.Match("playwright").Count -gt 0

    if (-not $hasPlaywright) {
        Write-Host "  [PASS] Playwright decoupled from global mcp_config.json." -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Error "  [FAIL] Global mcp_config.json still contains heavy MCP server: Playwright=$hasPlaywright"
    }
} else {
    Write-Error "  [FAIL] Global mcp_config.json missing"
}

# 3. Verify MCP schema cache clean in antigravity-ide and antigravity-cli
$idePollution = @()
$cliPollution = @()
foreach ($m in @('playwright', 'data-agent-kit', 'notebooks')) {
    if (Test-Path (Join-Path $ideMcp $m)) { $idePollution += $m }
    if (Test-Path (Join-Path $cliMcp $m)) { $cliPollution += $m }
}

if ($idePollution.Count -eq 0 -and $cliPollution.Count -eq 0) {
    Write-Host "  [PASS] Global MCP schema cache clean in both IDE and CLI (zero lazy tool pollution)." -ForegroundColor Green
    $testsPassed++
} else {
    Write-Error "  [FAIL] MCP schema cache not clean: IDE=$($idePollution -join ', '), CLI=$($cliPollution -join ', ')"
}

# 4. Verify kaggle_workflows rule is removed from global rules and archived in cloud-data vault
$globalKaggle = Join-Path $globalRules "kaggle_workflows.md"
$vaultKaggle = Join-Path $vaultDir "cloud-data\rules\kaggle_workflows.md"
if (-not (Test-Path $globalKaggle) -and (Test-Path $vaultKaggle)) {
    Write-Host "  [PASS] kaggle_workflows.md removed from global rules and safely scoped in cloud-data vault." -ForegroundColor Green
    $testsPassed++
} else {
    Write-Error "  [FAIL] Rule scoping check failed: Global exists=$(Test-Path $globalKaggle), Vault exists=$(Test-Path $vaultKaggle)"
}

# 5. Verify Manage-WorkspaceSkills.ps1 script executes and lists vault packs
if (Test-Path $mgrScript) {
    $output = & pwsh -File $mgrScript -Action List
    if ($output -match "web-frontend" -and $output -match "cloud-data") {
        Write-Host "  [PASS] Manage-WorkspaceSkills.ps1 script executes and lists vault packs." -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Error "  [FAIL] Manage-WorkspaceSkills.ps1 failed to output vault packs."
    }
} else {
    Write-Error "  [FAIL] Manage-WorkspaceSkills.ps1 not found at $mgrScript"
}

# 6. Verify current project has .agents/skills.json
$localSkills = Join-Path $PSScriptRoot "..\.agents\skills.json"
if (Test-Path $localSkills) {
    $skillsJson = Get-Content -Raw -Path $localSkills | ConvertFrom-Json
    if ($skillsJson.entries.Count -gt 0) {
        Write-Host "  [PASS] Current repository (.agents/skills.json) has active entries: $($skillsJson.entries.Count)" -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Error "  [FAIL] .agents/skills.json has zero entries."
    }
} else {
    Write-Error "  [FAIL] .agents/skills.json missing in repository root."
}

Write-Host "  Total Tests: $totalTests | Passed: $testsPassed" -ForegroundColor Cyan
if ($testsPassed -eq $totalTests) {
    Write-Host "[SUCCESS] All Skill Vault, Rule Scoping & MCP Context checks passed!" -ForegroundColor Green
} else {
    exit 1
}
