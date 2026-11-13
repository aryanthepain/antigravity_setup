<#
.SYNOPSIS
    Antigravity Workspace Skill & Capability Manager (Manage-WorkspaceSkills.ps1)
    Dynamically binds domain skill packs and MCP servers from ~/.gemini/config/skills-vault/
    to the active project via declarative .agents/skills.json and .agents/mcp_config.json.

.DESCRIPTION
    Keeps Antigravity orchestrator ultra-lean by avoiding global token bloat.
    Allows projects to declare exactly what domain skills (web-frontend, cloud-data, runtimes)
    they need, with automated fingerprinting and on-demand timeline provisioning.

.PARAMETER Action
    List           - Show all available packs in the vault and their contained skills
    Status         - Show currently linked packs and MCP servers for the target workspace
    Detect         - Fingerprint the repository and report matching skill packs without modifying files
    DetectAndAdd   - Fingerprint the repository and automatically bind matching packs
    Add            - Manually bind a specific skill pack to the workspace
    Remove         - Manually unbind a specific skill pack from the workspace

.PARAMETER Pack
    Name of the skill pack to Add or Remove (web-frontend, cloud-data, runtimes, all)

.PARAMETER TargetDir
    Target workspace root (defaults to current working directory)
#>

[CmdletBinding()]
param(
    [ValidateSet("List", "Status", "Detect", "DetectAndAdd", "Add", "Remove")]
    [string]$Action = "Status",

    [ValidateSet("web-frontend", "cloud-data", "runtimes", "notion", "lovable", "strix-security", "all", "")]
    [string]$Pack = "",

    [string]$TargetDir = (Get-Location).Path,

    [switch]$WithPlaywright,
    [switch]$WithCloudMCP,
    [switch]$WithNotionMCP,
    [switch]$WithLovableMCP,
    [switch]$WithStrixMCP,
    [switch]$Quiet
)

$ErrorActionPreference = "Stop"

$VaultDir = Join-Path $env:USERPROFILE ".gemini\config\skills-vault"
$AgentsDir = Join-Path $TargetDir ".agents"
$SkillsJsonPath = Join-Path $AgentsDir "skills.json"
$McpJsonPath = Join-Path $AgentsDir "mcp_config.json"

function Get-VaultPacks {
    if (-not (Test-Path $VaultDir)) {
        return @{}
    }
    $packs = @{}
    Get-ChildItem -Path $VaultDir -Directory | ForEach-Object {
        $pName = $_.Name
        $skills = Get-ChildItem -Path $_.FullName -Directory | Where-Object { Test-Path (Join-Path $_.FullName "SKILL.md") } | Select-Object -ExpandProperty Name
        $packs[$pName] = @{
            Path   = ($_.FullName -replace '\\', '/')
            Skills = $skills
        }
    }
    return $packs
}

function Detect-Packs {
    param([string]$Dir)
    $detected = [System.Collections.Generic.List[string]]::new()

    # 1. Web Frontend detection
    $hasPkgJson = Test-Path (Join-Path $Dir "package.json")
    $hasHtml = Test-Path (Join-Path $Dir "index.html")
    $hasVite = (Get-ChildItem -Path $Dir -Filter "vite.config.*" -ErrorAction SilentlyContinue).Count -gt 0
    $hasTsx = (Get-ChildItem -Path $Dir -Filter "*.tsx" -Recurse -Depth 3 -ErrorAction SilentlyContinue).Count -gt 0
    $hasJsx = (Get-ChildItem -Path $Dir -Filter "*.jsx" -Recurse -Depth 3 -ErrorAction SilentlyContinue).Count -gt 0
    $hasWebFramework = $false

    if ($hasPkgJson) {
        try {
            $pkg = Get-Content -Raw -Path (Join-Path $Dir "package.json") | ConvertFrom-Json
            $deps = ""
            if ($pkg.dependencies) { $deps += ($pkg.dependencies | Out-String) }
            if ($pkg.devDependencies) { $deps += ($pkg.devDependencies | Out-String) }
            if ($deps -match "react|vue|svelte|next|vite|astro|tailwind|playwright|puppeteer|express") {
                $hasWebFramework = $true
            }
        } catch {}
    }

    if ($hasPkgJson -or $hasHtml -or $hasVite -or $hasTsx -or $hasJsx -or $hasWebFramework) {
        $detected.Add("web-frontend")
    }

    # 2. Cloud & Data detection
    $hasPy = (Get-ChildItem -Path $Dir -Filter "*.py" -Recurse -Depth 2 -ErrorAction SilentlyContinue).Count -gt 0
    $hasNotebook = (Get-ChildItem -Path $Dir -Filter "*.ipynb" -Recurse -Depth 2 -ErrorAction SilentlyContinue).Count -gt 0
    $hasDataMarkers = $false

    $reqFile = Join-Path $Dir "requirements.txt"
    $pyproject = Join-Path $Dir "pyproject.toml"
    $filesToCheck = @($reqFile, $pyproject) | Where-Object { Test-Path $_ }
    foreach ($f in $filesToCheck) {
        $content = Get-Content -Raw -Path $f -ErrorAction SilentlyContinue
        if ($content -match "pyspark|google-cloud|bigquery|dataproc|kaggle|duckdb|spark") {
            $hasDataMarkers = $true
            break
        }
    }
    if ($hasNotebook -or $hasDataMarkers -or (Test-Path (Join-Path $Dir "kaggle.json"))) {
        $detected.Add("cloud-data")
    }

    # 3. External AI Runtimes detection
    $hasRuntimes = $false
    $markerFiles = Get-ChildItem -Path $Dir -Filter "*.md" -Depth 2 -ErrorAction SilentlyContinue
    foreach ($mf in $markerFiles) {
        $mc = Get-Content -Raw -Path $mf.FullName -ErrorAction SilentlyContinue
        if ($mc -match "openhands|omniroute|aider-pair|opencode-runner") {
            $hasRuntimes = $true
            break
        }
    }
    if ($hasRuntimes) {
        $detected.Add("runtimes")
    }

    return $detected
}

function Add-PackToProject {
    param([string]$PackName, [hashtable]$VaultPacks)

    if (-not $VaultPacks.ContainsKey($PackName)) {
        Write-Error "Skill pack '$PackName' does not exist in vault: $VaultDir"
        return
    }

    if (-not (Test-Path $AgentsDir)) {
        New-Item -ItemType Directory -Path $AgentsDir -Force | Out-Null
    }

    $packPath = $VaultPacks[$PackName].Path

    # Update skills.json
    $skillsConfig = @{ entries = @() }
    if (Test-Path $SkillsJsonPath) {
        try {
            $raw = Get-Content -Raw -Path $SkillsJsonPath | ConvertFrom-Json
            if ($raw.entries) {
                $skillsConfig.entries = [System.Collections.ArrayList]@($raw.entries)
            }
        } catch {
            $skillsConfig.entries = [System.Collections.ArrayList]@()
        }
    } else {
        $skillsConfig.entries = [System.Collections.ArrayList]@()
    }

    # Check if already present
    $exists = $false
    foreach ($entry in $skillsConfig.entries) {
        $normEntry = ($entry.path -replace '\\', '/').TrimEnd('/')
        $normTarget = $packPath.TrimEnd('/')
        if ($normEntry -eq $normTarget) {
            $exists = $true
            break
        }
    }

    if ($VaultPacks[$PackName].Skills.Count -gt 0) {
        if (-not $exists) {
            $newEntry = [PSCustomObject]@{ path = $packPath }
            $skillsConfig.entries.Add($newEntry) | Out-Null
            $jsonOut = $skillsConfig | ConvertTo-Json -Depth 5
            Set-Content -Path $SkillsJsonPath -Value $jsonOut -Encoding UTF8
            if (-not $Quiet) {
                Write-Host "  [+] Added skill pack '$PackName' to $SkillsJsonPath" -ForegroundColor Green
                Write-Host "      Skills: $($VaultPacks[$PackName].Skills -join ', ')" -ForegroundColor Gray
            }
        } else {
            if (-not $Quiet) {
                Write-Host "  [.] Skill pack '$PackName' is already registered in $SkillsJsonPath" -ForegroundColor Yellow
            }
        }
    }

    # Playwright MCP is opt-in to avoid bloating prompt tokens
    if ($WithPlaywright -and $PackName -eq "web-frontend") {
        $mcpConfig = @{ mcpServers = @{} }
        if (Test-Path $McpJsonPath) {
            try {
                $rawMcp = Get-Content -Raw -Path $McpJsonPath | ConvertFrom-Json
                if ($rawMcp.mcpServers) {
                    foreach ($prop in $rawMcp.mcpServers.PSObject.Properties) {
                        $mcpConfig.mcpServers[$prop.Name] = $prop.Value
                    }
                }
            } catch {}
        }

        if (-not $mcpConfig.mcpServers.ContainsKey("playwright")) {
            $mcpConfig.mcpServers["playwright"] = [PSCustomObject]@{
                command = "npx"
                args    = @("-y", "@executeautomation/playwright-mcp-server")
            }
            $mcpJsonOut = $mcpConfig | ConvertTo-Json -Depth 5
            Set-Content -Path $McpJsonPath -Value $mcpJsonOut -Encoding UTF8
            if (-not $Quiet) {
                Write-Host "  [+] Configured Playwright MCP server in $McpJsonPath (opt-in)" -ForegroundColor Green
            }
        }
    }

    # Cloud MCP (data-agent-kit, notebooks) is opt-in
    if ($WithCloudMCP -and $PackName -eq "cloud-data") {
        $mcpConfig = @{ mcpServers = @{} }
        if (Test-Path $McpJsonPath) {
            try {
                $rawMcp = Get-Content -Raw -Path $McpJsonPath | ConvertFrom-Json
                if ($rawMcp.mcpServers) {
                    foreach ($prop in $rawMcp.mcpServers.PSObject.Properties) {
                        $mcpConfig.mcpServers[$prop.Name] = $prop.Value
                    }
                }
            } catch {}
        }

        $bundlePath = "c:\Users\Aryan Gupta\.antigravity-ide\extensions\googlecloudtools.datacloud-1.1.2-universal\mcp_servers\cli\mcp_proxy_bundle.js"
        $mcpConfig.mcpServers["data-agent-kit"] = [PSCustomObject]@{
            command = "node"
            args    = @($bundlePath, "dataAgentKit-antigravityide")
        }
        $mcpConfig.mcpServers["notebooks"] = [PSCustomObject]@{
            command = "node"
            args    = @($bundlePath, "notebooks-antigravityide")
        }
        $mcpJsonOut = $mcpConfig | ConvertTo-Json -Depth 5
        Set-Content -Path $McpJsonPath -Value $mcpJsonOut -Encoding UTF8
        if (-not $Quiet) {
            Write-Host "  [+] Configured Cloud MCP servers (data-agent-kit, notebooks) in $McpJsonPath (opt-in)" -ForegroundColor Green
        }
    }

    # Generic Vault Pack MCP Loader (for notion, lovable, strix-security, etc.)
    $packMcpFile = Join-Path $VaultDir "$PackName\mcp_config.json"
    if (Test-Path $packMcpFile) {
        $mcpConfig = @{ mcpServers = @{} }
        if (Test-Path $McpJsonPath) {
            try {
                $rawMcp = Get-Content -Raw -Path $McpJsonPath | ConvertFrom-Json
                if ($rawMcp.mcpServers) {
                    foreach ($prop in $rawMcp.mcpServers.PSObject.Properties) {
                        $mcpConfig.mcpServers[$prop.Name] = $prop.Value
                    }
                }
            } catch {}
        }
        try {
            $vaultMcp = Get-Content -Raw -Path $packMcpFile | ConvertFrom-Json
            if ($vaultMcp.mcpServers) {
                foreach ($prop in $vaultMcp.mcpServers.PSObject.Properties) {
                    $mcpConfig.mcpServers[$prop.Name] = $prop.Value
                    if (-not $Quiet) {
                        Write-Host "  [+] Configured '$($prop.Name)' MCP server from vault pack '$PackName' in $McpJsonPath" -ForegroundColor Green
                    }
                }
                $mcpJsonOut = $mcpConfig | ConvertTo-Json -Depth 5
                Set-Content -Path $McpJsonPath -Value $mcpJsonOut -Encoding UTF8
            }
        } catch {}
    }

    # Vault Pack Subagents Loader (for notion, or any pack providing agents/)
    $packAgentsDir = Join-Path $VaultDir "$PackName\agents"
    if (Test-Path $packAgentsDir) {
        $workspaceAgentsDir = Join-Path $AgentsDir "agents"
        if (-not (Test-Path $workspaceAgentsDir)) {
            New-Item -ItemType Directory -Path $workspaceAgentsDir -Force | Out-Null
        }
        Get-ChildItem -Path $packAgentsDir -Filter "*.md" | ForEach-Object {
            $dest = Join-Path $workspaceAgentsDir $_.Name
            Copy-Item -Path $_.FullName -Destination $dest -Force
            if (-not $Quiet) {
                Write-Host "  [+] Configured subagent '$($_.Name)' from vault pack '$PackName' in $workspaceAgentsDir" -ForegroundColor Green
            }
        }
    }
}

function Remove-PackFromProject {
    param([string]$PackName, [hashtable]$VaultPacks)

    if (-not (Test-Path $SkillsJsonPath)) {
        Write-Host "No .agents/skills.json found in $TargetDir" -ForegroundColor Yellow
        return
    }

    $packPath = $VaultPacks[$PackName].Path
    $raw = Get-Content -Raw -Path $SkillsJsonPath | ConvertFrom-Json
    $newEntries = @()

    foreach ($entry in $raw.entries) {
        $normEntry = ($entry.path -replace '\\', '/').TrimEnd('/')
        $normTarget = $packPath.TrimEnd('/')
        if ($normEntry -ne $normTarget) {
            $newEntries += $entry
        }
    }

    $raw.entries = $newEntries
    $jsonOut = $raw | ConvertTo-Json -Depth 5
    Set-Content -Path $SkillsJsonPath -Value $jsonOut -Encoding UTF8
    Write-Host "  [-] Removed skill pack '$PackName' from $SkillsJsonPath" -ForegroundColor Cyan

    # If web-frontend, remove Playwright MCP
    if ($PackName -eq "web-frontend" -and (Test-Path $McpJsonPath)) {
        try {
            $rawMcp = Get-Content -Raw -Path $McpJsonPath | ConvertFrom-Json
            if ($rawMcp.mcpServers -and $rawMcp.mcpServers.PSObject.Properties.Match("playwright").Count -gt 0) {
                $newServers = @{}
                foreach ($prop in $rawMcp.mcpServers.PSObject.Properties) {
                    if ($prop.Name -ne "playwright") {
                        $newServers[$prop.Name] = $prop.Value
                    }
                }
                $rawMcp.mcpServers = $newServers
                $mcpJsonOut = $rawMcp | ConvertTo-Json -Depth 5
                Set-Content -Path $McpJsonPath -Value $mcpJsonOut -Encoding UTF8
                Write-Host "  [-] Removed Playwright MCP server from $McpJsonPath" -ForegroundColor Cyan
            }
        } catch {}
    }

    # Generic Vault Pack MCP Unloader
    $packMcpFile = Join-Path $VaultDir "$PackName\mcp_config.json"
    if ((Test-Path $packMcpFile) -and (Test-Path $McpJsonPath)) {
        try {
            $vaultMcp = Get-Content -Raw -Path $packMcpFile | ConvertFrom-Json
            $rawMcp = Get-Content -Raw -Path $McpJsonPath | ConvertFrom-Json
            if ($vaultMcp.mcpServers -and $rawMcp.mcpServers) {
                $vaultNames = $vaultMcp.mcpServers.PSObject.Properties | Select-Object -ExpandProperty Name
                $newServers = @{}
                foreach ($prop in $rawMcp.mcpServers.PSObject.Properties) {
                    if ($prop.Name -notin $vaultNames) {
                        $newServers[$prop.Name] = $prop.Value
                    } else {
                        Write-Host "  [-] Removed '$($prop.Name)' MCP server from $McpJsonPath" -ForegroundColor Cyan
                    }
                }
                $rawMcp.mcpServers = $newServers
                $mcpJsonOut = $rawMcp | ConvertTo-Json -Depth 5
                Set-Content -Path $McpJsonPath -Value $mcpJsonOut -Encoding UTF8
            }
        } catch {}
    }

    # Vault Pack Subagents Unloader
    $packAgentsDir = Join-Path $VaultDir "$PackName\agents"
    $workspaceAgentsDir = Join-Path $AgentsDir "agents"
    if ((Test-Path $packAgentsDir) -and (Test-Path $workspaceAgentsDir)) {
        Get-ChildItem -Path $packAgentsDir -Filter "*.md" | ForEach-Object {
            $dest = Join-Path $workspaceAgentsDir $_.Name
            if (Test-Path $dest) {
                Remove-Item -Path $dest -Force
                Write-Host "  [-] Removed subagent '$($_.Name)' from $workspaceAgentsDir" -ForegroundColor Cyan
            }
        }
        if ((Get-ChildItem -Path $workspaceAgentsDir -ErrorAction SilentlyContinue).Count -eq 0) {
            Remove-Item -Path $workspaceAgentsDir -Force -Recurse -ErrorAction SilentlyContinue
        }
    }
}

# --- Main Dispatcher ---
$vaultPacks = Get-VaultPacks

switch ($Action) {
    "List" {
        Write-Host "`n📦 Available Antigravity Skill Packs in Vault ($VaultDir):" -ForegroundColor Cyan
        foreach ($k in $vaultPacks.Keys) {
            Write-Host "  - Pack: $k" -ForegroundColor Yellow
            Write-Host "    Path: $($vaultPacks[$k].Path)" -ForegroundColor Gray
            Write-Host "    Skills ($($vaultPacks[$k].Skills.Count)): $($vaultPacks[$k].Skills -join ', ')" -ForegroundColor White
        }
    }

    "Status" {
        Write-Host "`n🔍 Antigravity Skill Surface Status for: $TargetDir" -ForegroundColor Cyan
        if (Test-Path $SkillsJsonPath) {
            Write-Host "Config file: $SkillsJsonPath" -ForegroundColor Green
            $raw = Get-Content -Raw -Path $SkillsJsonPath | ConvertFrom-Json
            if ($raw.entries -and $raw.entries.Count -gt 0) {
                Write-Host "Active Pack Entries:" -ForegroundColor Yellow
                foreach ($entry in $raw.entries) {
                    Write-Host "  - $($entry.path)" -ForegroundColor White
                }
            } else {
                Write-Host "No pack entries active in skills.json" -ForegroundColor Gray
            }
        } else {
            Write-Host "No .agents/skills.json configured (inheriting only universal global skills)." -ForegroundColor Gray
        }

        if (Test-Path $McpJsonPath) {
            $rawMcp = Get-Content -Raw -Path $McpJsonPath | ConvertFrom-Json
            $servers = ($rawMcp.mcpServers.PSObject.Properties | Select-Object -ExpandProperty Name) -join ', '
            Write-Host "Workspace MCP Servers: $servers" -ForegroundColor Cyan
        }
    }

    "Detect" {
        $detected = Detect-Packs -Dir $TargetDir
        Write-Host "`n🔎 Fingerprinted Repository: $TargetDir" -ForegroundColor Cyan
        if ($detected.Count -gt 0) {
            Write-Host "Detected Matching Skill Packs: $($detected -join ', ')" -ForegroundColor Green
        } else {
            Write-Host "No specialized domain packs detected. Repository uses universal core skills." -ForegroundColor Gray
        }
    }

    "DetectAndAdd" {
        $detected = Detect-Packs -Dir $TargetDir
        Write-Host "`n🚀 Fingerprinting and Provisioning Skills for: $TargetDir" -ForegroundColor Cyan
        if ($detected.Count -gt 0) {
            Write-Host "Detected packs: $($detected -join ', ')" -ForegroundColor Green
            foreach ($d in $detected) {
                Add-PackToProject -PackName $d -VaultPacks $vaultPacks
            }
        } else {
            Write-Host "No domain packs detected. Zero additional tokens allocated." -ForegroundColor Gray
        }
    }

    "Add" {
        if (-not $Pack) {
            Write-Error "Please specify -Pack <name> to add (e.g. -Pack web-frontend)"
            return
        }
        if ($Pack -eq "all") {
            foreach ($k in $vaultPacks.Keys) {
                Add-PackToProject -PackName $k -VaultPacks $vaultPacks
            }
        } else {
            Add-PackToProject -PackName $Pack -VaultPacks $vaultPacks
        }
    }

    "Remove" {
        if (-not $Pack) {
            Write-Error "Please specify -Pack <name> to remove (e.g. -Pack web-frontend)"
            return
        }
        if ($Pack -eq "all") {
            foreach ($k in $vaultPacks.Keys) {
                Remove-PackFromProject -PackName $k -VaultPacks $vaultPacks
            }
        } else {
            Remove-PackFromProject -PackName $Pack -VaultPacks $vaultPacks
        }
    }
}
