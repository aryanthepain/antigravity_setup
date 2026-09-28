<#
.SYNOPSIS
    Installs Codex skill parity: preflight, backup, GSD suite, global policy, and ported skills.
.DESCRIPTION
    Implements Phases 0-6 of prd/antigravity-codex-skill-parity-prd.md.
#>

[CmdletBinding()]
param(
    [string]$CodexHome = "C:\Users\Aryan Gupta\.codex",
    [string]$ProjectRoot = "D:\projects\antigravity_setup"
)

$ErrorActionPreference = "Stop"

function Log-Step([string]$Phase, [string]$Message) {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$ts] [$Phase] $Message"
    Write-Host $line
    Add-Content -Path $Global:LogFile -Value $line -Encoding utf8
}

# --- Phase 0: Preflight and Backup ---
$Global:LogsDir = Join-Path $ProjectRoot "logs"
$Global:BackupsDir = Join-Path $ProjectRoot "backups"
New-Item -ItemType Directory -Path $Global:LogsDir -Force | Out-Null
New-Item -ItemType Directory -Path $Global:BackupsDir -Force | Out-Null

$Global:LogFile = Join-Path $Global:LogsDir "codex-parity-install.log"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$currentBackupDir = Join-Path $Global:BackupsDir "codex-preflight-$timestamp"
New-Item -ItemType Directory -Path $currentBackupDir -Force | Out-Null

Log-Step "PHASE 0: PREFLIGHT" "Starting Antigravity Codex Skill Parity Installation..."
Log-Step "PHASE 0: PREFLIGHT" "Codex Home: $CodexHome"
Log-Step "PHASE 0: PREFLIGHT" "Project Root: $ProjectRoot"

# 1. Version recording
$nodeVer = (node -v).Trim()
$npmVer = (npm -v).Trim()
$ghVer = ((gh --version | Select-Object -First 1) -replace '\r','').Trim()
$codexExe = "C:\Users\Aryan Gupta\AppData\Local\OpenAI\Codex\bin\bffc5354119c8421\codex.exe"
$codexVer = "Unknown"
if (Test-Path $codexExe) {
    $codexVer = ((& $codexExe --version) -replace '\r','').Trim()
}

Log-Step "PHASE 0: PREFLIGHT" "Tools detected -> Node: $nodeVer | NPM: $npmVer | GH: $ghVer | Codex CLI: $codexVer"

# 2. Backup existing Codex configuration & skills
$configFile = Join-Path $CodexHome "config.toml"
$skillsDir = Join-Path $CodexHome "skills"

if (Test-Path $configFile) {
    Copy-Item $configFile -Destination (Join-Path $currentBackupDir "config.toml") -Force
    Log-Step "PHASE 0: BACKUP" "Backed up config.toml to $currentBackupDir\config.toml"
}

if (Test-Path $skillsDir) {
    Copy-Item $skillsDir -Destination (Join-Path $currentBackupDir "skills") -Recurse -Force
    Log-Step "PHASE 0: BACKUP" "Backed up existing skills to $currentBackupDir\skills"
}

Log-Step "PHASE 0: COMPLETE" "Preflight and backup completed successfully. Backup path: $currentBackupDir"
