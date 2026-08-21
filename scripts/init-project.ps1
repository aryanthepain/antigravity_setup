<#
.SYNOPSIS
    Antigravity Universal Project Scaffolder (init-project.ps1)
    Bootstraps any repository with clean Antigravity engineering files and deterministic verification gates.
    Inherits global rules and skills from ~/.gemini/config/ without creating redundant local boilerplate.
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
$RepoRoot = Split-Path -Parent $ScriptDir
$TemplateDir = Join-Path $RepoRoot "templates"

Write-Host "`n🚀 Bootstrapping Antigravity Autonomous Engineering Stack in: $TargetDir" -ForegroundColor Cyan
Write-Host "Project: $ProjectName | Type: $ProjectType" -ForegroundColor Gray

# 1. Create clean essential directory structure
# Global skills and behavioral rules in ~/.gemini/config/ are automatically inherited.
# Local .agents/ is reserved strictly for repo-specific custom overrides when necessary.
$dirs = @(
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

# 2. Install Clean Templates
if (Test-Path $TemplateDir) {
    $templateMap = @{
        "$TemplateDir\AGENTS.md"       = "$TargetDir\AGENTS.md"
        "$TemplateDir\CONSTITUTION.md" = "$TargetDir\CONSTITUTION.md"
        "$TemplateDir\WORKING.md"      = "$TargetDir\WORKING.md"
        "$ScriptDir\verify.ps1"        = "$TargetDir\scripts\verify.ps1"
    }

    foreach ($src in $templateMap.Keys) {
        $dst = $templateMap[$src]
        if (Test-Path $src) {
            if (-not (Test-Path $dst)) {
                Copy-Item -Path $src -Destination $dst -Force
                Write-Host "  [+] Installed template: $dst" -ForegroundColor Green
            } else {
                Write-Host "  [.] Preserved existing: $dst" -ForegroundColor Yellow
            }
        }
    }
}

# 3. Configure Git Hooks
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

# 4. Summary
Write-Host "`n✅ Project '$ProjectName' initialized successfully!" -ForegroundColor Cyan
Write-Host "Invariants & Skills: Inherited globally from ~/.gemini/config/" -ForegroundColor Gray
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Review AGENTS.md and configure project-specific build/test commands."
Write-Host "  2. Review CONSTITUTION.md and tailor tech stack invariants."
Write-Host "  3. Run './scripts/verify.ps1' to test baseline deterministic gates."
Write-Host "  4. Use 'WORKING.md' for active sprint tracking."
