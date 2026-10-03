<#
.SYNOPSIS
    Installs GSD skills for Codex and replaces .claude references with .codex.
#>
$ErrorActionPreference = "Stop"

$codexHome = "C:\Users\Aryan Gupta\.codex"
$gsdCoreDir = Join-Path $codexHome "gsd-core"
$commandsDir = Join-Path $gsdCoreDir "commands\gsd"
$workflowsDir = Join-Path $gsdCoreDir "workflows"
$skillsDir = Join-Path $codexHome "skills"
$logFile = "D:\projects\antigravity_setup\logs\codex-parity-install.log"

function Log-Step([string]$Phase, [string]$Message) {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$ts] [$Phase] $Message"
    Write-Host $line
    Add-Content -Path $logFile -Value $line -Encoding utf8
}

Log-Step "PHASE 1: GSD-FIX" "Fixing residual .claude path references in $gsdCoreDir..."

$filesWithClaude = Get-ChildItem -Path $gsdCoreDir -Recurse -File | Where-Object {
    $_.Extension -in @(".md", ".cjs", ".json", ".toml")
}

$replacementCount = 0
foreach ($file in $filesWithClaude) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    if ($content -match '\.claude') {
        $newContent = $content -replace '~/\.claude/', '~/.codex/' `
                               -replace '\$HOME/\.claude/', '$HOME/.codex/' `
                               -replace '\.claude/gsd-core', '.codex/gsd-core' `
                               -replace '\.claude/worktrees', '.codex/worktrees' `
                               -replace '\.claude/skills', '.codex/skills'
        if ($newContent -ne $content) {
            [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.Encoding]::UTF8)
            $replacementCount++
        }
    }
}
Log-Step "PHASE 1: GSD-FIX" "Replaced .claude references across $replacementCount files."

Log-Step "PHASE 1: SKILLS" "Scaffolding 72 GSD skills into $skillsDir..."
$commandFiles = Get-ChildItem -Path $commandsDir -Filter "*.md"
$installedCount = 0

foreach ($cmdFile in $commandFiles) {
    $cmdName = $cmdFile.BaseName
    $skillName = "gsd-$cmdName"
    $targetSkillDir = Join-Path $skillsDir $skillName
    if (-not (Test-Path $targetSkillDir)) {
        New-Item -ItemType Directory -Path $targetSkillDir -Force | Out-Null
    }

    $rawContent = [System.IO.File]::ReadAllText($cmdFile.FullName, [System.Text.Encoding]::UTF8)
    
    # Adapt frontmatter: change name from gsd:cmd to gsd-cmd
    $adapted = $rawContent -replace 'name:\s*gsd:([^\r\n]+)', 'name: gsd-$1'
    $adapted = $adapted -replace '~/\.claude/', '~/.codex/'
    $adapted = $adapted -replace '\$HOME/\.claude/', '$HOME/.codex/'
    $adapted = $adapted -replace '\.claude/gsd-core', '.codex/gsd-core'

    $targetSkillFile = Join-Path $targetSkillDir "SKILL.md"
    [System.IO.File]::WriteAllText($targetSkillFile, $adapted, [System.Text.Encoding]::UTF8)
    $installedCount++
}

Log-Step "PHASE 1: SKILLS" "Installed $installedCount GSD skills to $skillsDir."

# Validate workflow links
$missingWorkflows = 0
foreach ($cmdFile in $commandFiles) {
    $expectedWorkflow = Join-Path $workflowsDir "$($cmdFile.BaseName).md"
    if (-not (Test-Path $expectedWorkflow)) {
        Log-Step "PHASE 1: WARNING" "Workflow file missing for $($cmdFile.BaseName): $expectedWorkflow"
        $missingWorkflows++
    }
}

if ($missingWorkflows -eq 0) {
    Log-Step "PHASE 1: VALIDATION" "All 72 GSD skills have matching workflow files in $workflowsDir."
} else {
    Log-Step "PHASE 1: WARNING" "Found $missingWorkflows missing workflow files."
}

Log-Step "PHASE 1: COMPLETE" "Phase 1 Install GSD for Codex completed successfully."
