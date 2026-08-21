<#
.SYNOPSIS
    Antigravity Universal Project Scaffolder (init-project.ps1)
    Bootstraps any repository with Antigravity behavioral rules, templates, and verification gates.
.EXAMPLE
    .\scripts\init-project.ps1 -TargetDir "d:\projects\new_app" -ProjectName "NewApp" -ProjectType "python"
#>

param(
    [string]$TargetDir = (Get-Location).Path,
    [string]$ProjectName = (Split-Path -Leaf (Get-Location).Path),
    [ValidateSet("python", "typescript", "fullstack", "generic")]
    [string]$ProjectType = "generic"
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$SetupRoot = Split-Path -Parent $ScriptDir

Write-Host "`n🚀 Bootstrapping Antigravity Autonomous Engineering Stack in: $TargetDir" -ForegroundColor Cyan
Write-Host "Project: $ProjectName | Type: $ProjectType" -ForegroundColor Gray

# 1. Create directory structure
$dirs = @(
    "$TargetDir\.agents\rules",
    "$TargetDir\.agents\skills",
    "$TargetDir\scripts",
    "$TargetDir\templates",
    "$TargetDir\learning",
    "$TargetDir\.githooks"
)

foreach ($d in $dirs) {
    if (-not (Test-Path $d)) {
        New-Item -ItemType Directory -Path $d -Force | Out-Null
        Write-Host "  [+] Created directory: $d" -ForegroundColor Green
    }
}

# 2. Copy Templates if available
$templates = @{
    "$SetupRoot\templates\AGENTS.md"       = "$TargetDir\AGENTS.md"
    "$SetupRoot\templates\CONSTITUTION.md" = "$TargetDir\CONSTITUTION.md"
    "$SetupRoot\templates\WORKING.md"      = "$TargetDir\WORKING.md"
    "$SetupRoot\scripts\verify.ps1"        = "$TargetDir\scripts\verify.ps1"
}

foreach ($src in $templates.Keys) {
    $dst = $templates[$src]
    if (Test-Path $src) {
        if (-not (Test-Path $dst)) {
            Copy-Item -Path $src -Destination $dst -Force
            Write-Host "  [+] Installed template: $dst" -ForegroundColor Green
        } else {
            Write-Host "  [.] Preserved existing: $dst" -ForegroundColor Yellow
        }
    }
}

# 3. Copy Local Rules into .agents/rules
$rulesSrc = "C:\Users\Aryan Gupta\.gemini\config\rules\global_rules.md"
if (Test-Path $rulesSrc) {
    Copy-Item -Path $rulesSrc -Destination "$TargetDir\.agents\rules\global_rules.md" -Force
    Write-Host "  [+] Linked local rules in .agents/rules/" -ForegroundColor Green
}

# 4. Configure Git Hooks
if (Test-Path "$TargetDir\.git") {
    try {
        git -C $TargetDir config core.hooksPath .githooks
        
        # Write pre-commit hook
        $preCommitScript = @"
#!/bin/sh
# Antigravity Pre-Commit Gate
pwsh -File ./scripts/verify.ps1 -Quick
"@
        Set-Content -Path "$TargetDir\.githooks\pre-commit" -Value $preCommitScript -NoNewline
        Write-Host "  [+] Configured Git pre-commit verification hook." -ForegroundColor Green
    } catch {
        Write-Host "  [!] Could not configure git hooks automatically." -ForegroundColor Yellow
    }
}

# 5. Summary
Write-Host "`n✅ Project '$ProjectName' initialized successfully!" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Review CONSTITUTION.md and tailor tech stack invariants."
Write-Host "  2. Run './scripts/verify.ps1' to test baseline deterministic gates."
Write-Host "  3. Use 'WORKING.md' for active sprint tracking."
