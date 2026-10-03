<#
.SYNOPSIS
    Validates all installed Codex skills: frontmatter, uniqueness, trigger isolation, and non-collision with system plugins.
#>

$ErrorActionPreference = "Stop"

$codexHome = "C:\Users\Aryan Gupta\.codex"
$skillsDir = Join-Path $codexHome "skills"
$logFile = "D:\projects\antigravity_setup\logs\codex-parity-install.log"

function Log-Step([string]$Phase, [string]$Message) {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$ts] [$Phase] $Message"
    Write-Host $line
    Add-Content -Path $logFile -Value $line -Encoding utf8
}

Log-Step "PHASE 5: DISCOVERY" "Starting Conflict and Discovery Review for Codex skills in $skillsDir..."

$skillFiles = Get-ChildItem -Path $skillsDir -Recurse -Filter "SKILL.md"
Log-Step "PHASE 5: DISCOVERY" "Total SKILL.md files found: $($skillFiles.Count)"

$names = [System.Collections.Generic.HashSet[string]]::new()
$errors = [System.Collections.Generic.List[string]]::new()

$systemPluginNames = @("documents", "pdf", "spreadsheets", "presentations", "template-creator", "browser", "computer-use", "unified-computer-use", "visualize", "codex-app-tools")

foreach ($file in $skillFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    
    # 1. Frontmatter check
    if ($content -notmatch '(?s)^---\r?\n(.*?)\r?\n---') {
        $errors.Add("Missing or invalid frontmatter delimiter in $($file.FullName)")
        continue
    }

    $frontmatter = $matches[1]
    
    # Extract name
    if ($frontmatter -match 'name:\s*([^\r\n]+)') {
        $name = $matches[1].Trim().Trim('"').Trim("'")
    } else {
        $errors.Add("Missing 'name' in frontmatter of $($file.FullName)")
        continue
    }

    # Extract description
    if ($frontmatter -notmatch 'description:\s*([^\r\n]+)') {
        $errors.Add("Missing 'description' in frontmatter of $($file.FullName)")
    }

    # Check uniqueness
    if ($names.Contains($name)) {
        $errors.Add("Duplicate skill name detected: $name in $($file.FullName)")
    } else {
        [void]$names.Add($name)
    }

    # Check system plugin collision
    if ($systemPluginNames -contains $name) {
        $errors.Add("Collision detected: Skill name '$name' conflicts with Codex system plugin!")
    }
}

if ($errors.Count -eq 0) {
    Log-Step "PHASE 5: AUDIT" "Frontmatter & collision audit PASSED. $($names.Count) unique skills verified."
} else {
    foreach ($err in $errors) {
        Log-Step "PHASE 5: ERROR" $err
    }
    throw "Audit failed with $($errors.Count) errors."
}

# 2. Trigger phrase validation for ported skills
$requiredNonGsd = @('write-a-prd', 'write-a-brief', 'tdd', 'code-review', 'security-review', 'working-context', 'architecture-review', 'frontend-quality')
foreach ($r in $requiredNonGsd) {
    $p = Join-Path $skillsDir "$r\SKILL.md"
    if (Test-Path $p) {
        $c = [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)
        $hasTriggers = $c -match 'Trigger on mentions of:'
        $hasNonTriggers = $c -match 'Do NOT use for:'
        Log-Step "PHASE 5: TRIGGERS" "Skill '$r': TriggersPresent=$hasTriggers, NonTriggersPresent=$hasNonTriggers"
    } else {
        $errors.Add("Missing required non-GSD skill: $r")
    }
}

Log-Step "PHASE 5: COMPLETE" "Phase 5 Conflict and Discovery Review completed successfully."
