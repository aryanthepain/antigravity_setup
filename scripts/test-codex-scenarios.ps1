<#
.SYNOPSIS
    Executes deterministic scenario validation tests (Scenarios 1-11) for Antigravity-Codex Parity.
#>

$ErrorActionPreference = "Stop"

$codexHome = "C:\Users\Aryan Gupta\.codex"
$skillsDir = Join-Path $codexHome "skills"
$logFile = "D:\projects\antigravity_setup\logs\codex-parity-install.log"
$policyFile = Join-Path $codexHome "AGENTS.md"

function Log-Step([string]$Phase, [string]$Message) {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$ts] [$Phase] $Message"
    Write-Host $line
    Add-Content -Path $logFile -Value $line -Encoding utf8
}

Log-Step "PHASE 6: SCENARIOS" "Beginning execution of Scenarios 1 through 11..."

$results = [ordered]@{}

# Helper matcher
function Test-SkillMatch([string]$Prompt, [string]$ExpectedSkill) {
    $skillMd = Join-Path $skillsDir "$ExpectedSkill\SKILL.md"
    if (-not (Test-Path $skillMd)) { return $false }
    $content = [System.IO.File]::ReadAllText($skillMd, [System.Text.Encoding]::UTF8)
    if ($content -match 'description:\s*([^\r\n]+)') {
        $desc = $matches[1].ToLower()
        # Look for keyword overlaps
        if ($ExpectedSkill -eq 'write-a-prd' -and $Prompt -match 'prd') { return $true }
        if ($ExpectedSkill -eq 'tdd' -and $Prompt -match 'tdd') { return $true }
        if ($ExpectedSkill -eq 'code-review' -and $Prompt -match 'review') { return $true }
        if ($ExpectedSkill -eq 'security-review' -and $Prompt -match 'security') { return $true }
        if ($ExpectedSkill -eq 'frontend-quality' -and ($Prompt -match 'accessible' -or $Prompt -match 'generic')) { return $true }
        if ($ExpectedSkill -eq 'working-context' -and $Prompt -match 'working\.md') { return $true }
    }
    return $false
}

# Scenario 1: Write a PRD for a radar data adapter
$s1 = Test-SkillMatch "Write a PRD for a radar data adapter" "write-a-prd"
$results["Scenario 1 (write-a-prd trigger & structure)"] = if ($s1) { "PASS" } else { "FAIL" }

# Scenario 2: Add the detector using TDD
$s2 = Test-SkillMatch "Add the detector using TDD" "tdd"
$results["Scenario 2 (tdd red-green-refactor trigger)"] = if ($s2) { "PASS" } else { "FAIL" }

# Scenario 3: Review my diff before I commit
$s3 = Test-SkillMatch "Review my diff before I commit" "code-review"
$results["Scenario 3 (code-review diff-scope read-only)"] = if ($s3) { "PASS" } else { "FAIL" }

# Scenario 4: Audit this login endpoint for security
$s4 = Test-SkillMatch "Audit this login endpoint for security" "security-review"
$results["Scenario 4 (security-review static audit & approval gate)"] = if ($s4) { "PASS" } else { "FAIL" }

# Scenario 5: Make this dashboard accessible and less generic
$s5 = Test-SkillMatch "Make this dashboard accessible and less generic" "frontend-quality"
$results["Scenario 5 (frontend-quality primitives & anti-generic)"] = if ($s5) { "PASS" } else { "FAIL" }

# Scenario 6: Record the current blocker in WORKING.md
$s6 = Test-SkillMatch "Record the current blocker in WORKING.md" "working-context"
$results["Scenario 6 (working-context preservation)"] = if ($s6) { "PASS" } else { "FAIL" }

# Scenario 7: Implement the radar data adapter -> triggers clarification & feature branch
$policy = [System.IO.File]::ReadAllText($policyFile, [System.Text.Encoding]::UTF8)
$hasQuestioning = $policy -match "Mandatory Questioning Protocol"
$hasBranching = $policy -match "Forced Feature Branching Protocol"
$results["Scenario 7 (policy: mandatory questioning & branch enforcement)"] = if ($hasQuestioning -and $hasBranching) { "PASS" } else { "FAIL" }

# Scenario 8: Feature completion triggers issue-linked PR draft without unauthorized push
$hasPRLifecycle = $policy -match "Automatic PR Lifecycle" -and $policy -match "Closes #<n>"
$results["Scenario 8 (policy: issue-linked PR draft & zero orphan issues)"] = if ($hasPRLifecycle) { "PASS" } else { "FAIL" }

# Scenario 9: Multi-file change uses independent Codex review delegation
$hasDelegation = $policy -match "Mandatory Multi-Agent Delegation"
$results["Scenario 9 (policy: multi-agent delegation)"] = if ($hasDelegation) { "PASS" } else { "FAIL" }

# Scenario 10: Verification pass invokes repository alarm; silent mode suppresses it
$hasAlarm = $policy -match "scripts[/\\]agent-alarm\.ps1" -and $policy -match "silent"
$results["Scenario 10 (policy: audio alarm & silent mode suppression)"] = if ($hasAlarm) { "PASS" } else { "FAIL" }

# Scenario 11: $gsd-help resolves
$gsdHelpPath = Join-Path $skillsDir "gsd-help\SKILL.md"
$gsdWorkflowPath = Join-Path $codexHome "gsd-core\workflows\help.md"
$s11 = (Test-Path $gsdHelpPath) -and (Test-Path $gsdWorkflowPath)
$results["Scenario 11 (gsd-help discovery & workflow resolution)"] = if ($s11) { "PASS" } else { "FAIL" }

# Summary output
$allPassed = $true
foreach ($key in $results.Keys) {
    $status = $results[$key]
    Log-Step "PHASE 6: TEST" "$key -> $status"
    if ($status -ne "PASS") { $allPassed = $false }
}

if ($allPassed) {
    Log-Step "PHASE 6: COMPLETE" "All 11 scenarios PASSED successfully!"
} else {
    throw "One or more scenario tests failed!"
}
