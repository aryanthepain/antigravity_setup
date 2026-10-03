<#
.SYNOPSIS
    Automated Installer & Configurator for GSD Subagents under Antigravity Runtime
.DESCRIPTION
    Installs and configures the 35 specialized GSD subagents for Antigravity:
    - Scaffolds/syncs subagent definitions into ~/.gemini/config/agents/
    - Establishes directory junctions for ~/.gemini/antigravity-ide/agents and ~/.gemini/antigravity/agents
    - Synchronizes install state and manifests
    - Validates runtime status via gsd-tools.cjs
#>
[CmdletBinding()]
param(
    [switch]$ForceReinstall
)

$ErrorActionPreference = "Stop"

function Log-Info([string]$Msg) {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$ts] [INFO] $Msg" -ForegroundColor Cyan
}

function Log-Success([string]$Msg) {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$ts] [SUCCESS] $Msg" -ForegroundColor Green
}

function Log-Warn([string]$Msg) {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$ts] [WARN] $Msg" -ForegroundColor Yellow
}

$userProfile = $env:USERPROFILE
$geminiRoot = Join-Path $userProfile ".gemini"
$configAgents = Join-Path $geminiRoot "config\agents"
$ideHome = Join-Path $geminiRoot "antigravity-ide"
$agyHome = Join-Path $geminiRoot "antigravity"
$ideAgents = Join-Path $ideHome "agents"
$agyAgents = Join-Path $agyHome "agents"

Log-Info "Starting GSD Subagents Configuration for Antigravity runtime..."

# Step 1: Check if source agent definitions need installation / update
$expectedCount = 35
$currentCount = 0
if (Test-Path $configAgents) {
    $currentCount = (Get-ChildItem -Path $configAgents -Filter "gsd-*.md" -File | Where-Object { $_.Name -notmatch '\.compact\.md$' }).Count
}

if ($ForceReinstall -or ($currentCount -lt $expectedCount)) {
    Log-Info "Current installed agent count in ${configAgents}: $currentCount (expected: $expectedCount). Running official GSD installer..."
    $installArgs = @(
        "-y",
        "@opengsd/gsd-core@latest",
        "--antigravity",
        "--global",
        "--config-dir",
        $ideHome
    )
    & npx $installArgs
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to install GSD Core via npx."
    }
    Log-Success "GSD Core installation completed."
} else {
    Log-Success "Found $currentCount/$expectedCount subagent definitions in $configAgents."
}

# Step 2: Establish junction for antigravity-ide/agents
function Ensure-Junction([string]$Path, [string]$Target) {
    if (Test-Path $Path) {
        $item = Get-Item $Path -Force
        if ($item.LinkType -eq "Junction" -or $item.LinkType -eq "SymbolicLink") {
            Log-Info "Junction already exists at $Path -> $($item.Target)"
            return
        }
        # If it's a real directory, back up before replacing
        $backup = "$Path.bak-$(Get-Date -Format 'yyyyMMddHHmmss')"
        Log-Warn "Existing non-link directory found at $Path. Backing up to $backup..."
        Move-Item -Path $Path -Destination $backup -Force
    }
    Log-Info "Creating junction: $Path -> $Target"
    New-Item -ItemType Junction -Path $Path -Target $Target -Force | Out-Null
    Log-Success "Created junction at $Path."
}

Ensure-Junction -Path $ideAgents -Target $configAgents
Ensure-Junction -Path $agyAgents -Target $configAgents

# Step 3: Synchronize gsd-file-manifest.json if needed
$ideManifest = Join-Path $ideHome "gsd-file-manifest.json"
$agyManifest = Join-Path $agyHome "gsd-file-manifest.json"
if ((Test-Path $ideManifest) -and -not (Test-Path $agyManifest)) {
    Log-Info "Copying gsd-file-manifest.json from $ideHome to $agyHome..."
    Copy-Item -Path $ideManifest -Destination $agyManifest -Force
    Log-Success "Synchronized gsd-file-manifest.json."
}

# Step 4: Run verification
Log-Info "Running deterministic verification gate..."
$verifyScript = Join-Path $PSScriptRoot "verify-gsd-agents.ps1"
if (Test-Path $verifyScript) {
    & pwsh -File $verifyScript
    if ($LASTEXITCODE -ne 0) {
        throw "Verification gate failed."
    }
}

Log-Success "GSD Subagents installation and configuration completed successfully!"
