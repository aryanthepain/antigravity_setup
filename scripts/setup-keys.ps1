<#
.SYNOPSIS
    Antigravity API Keys & Environment Audit / Configurator (setup-keys.ps1)
.DESCRIPTION
    Checks the status of all essential API keys for model routing and MCP servers.
    Allows setting or updating keys permanently in Windows User Environment variables.
.EXAMPLE
    .\scripts\setup-keys.ps1 -CheckOnly
    .\scripts\setup-keys.ps1 -SetKey GEMINI_API_KEY -Value "AIzaSy..."
#>

param(
    [switch]$CheckOnly,
    [string]$SetKey,
    [string]$Value
)

$keys = @(
    @{ Name = "GEMINI_API_KEY"; Tier = "Tier 1 (Architect - 1.5k RPD)"; Source = "https://aistudio.google.com/"; Required = $true },
    @{ Name = "GITHUB_TOKEN"; Tier = "GitHub MCP (PRs / Issues)"; Source = "https://github.com/settings/tokens"; Required = $true },
    @{ Name = "NOTION_API_TOKEN"; Tier = "Notion MCP (Kanban Sync)"; Source = "https://www.notion.so/my-integrations"; Required = $true },
    @{ Name = "GROQ_API_KEY"; Tier = "Tier 2 (Fast TDD - 1k RPD)"; Source = "https://console.groq.com/"; Required = $false },
    @{ Name = "MISTRAL_API_KEY"; Tier = "Tier 3 (Codestral Free)"; Source = "https://console.mistral.ai/"; Required = $false },
    @{ Name = "DEEPSEEK_API_KEY"; Tier = "Tier 4 (R1 / V3 Reasoning)"; Source = "https://platform.deepseek.com/"; Required = $false },
    @{ Name = "ANTHROPIC_API_KEY"; Tier = "Anthropic (Claude 3.7 Sonnet)"; Source = "https://console.anthropic.com/"; Required = $false },
    @{ Name = "OPENAI_API_KEY"; Tier = "OpenAI (o3-mini / GPT-4o)"; Source = "https://platform.openai.com/"; Required = $false },
    @{ Name = "OPENROUTER_API_KEY"; Tier = "OpenRouter Gateway"; Source = "https://openrouter.ai/"; Required = $false },
    @{ Name = "LOVABLE_API_KEY"; Tier = "Lovable MCP (UI Scaffolding)"; Source = "https://lovable.dev/"; Required = $false },
    @{ Name = "STRIX_API_KEY"; Tier = "Strix AI (Penetration Testing)"; Source = "https://usestrix.com/"; Required = $false }
)

if ($SetKey -and $Value) {
    [System.Environment]::SetEnvironmentVariable($SetKey, $Value, "User")
    [System.Environment]::SetEnvironmentVariable($SetKey, $Value, "Process")
    
    # Mirror Notion key aliases for full compatibility
    if ($SetKey -eq "NOTION_API_TOKEN") {
        [System.Environment]::SetEnvironmentVariable("NOTION_API_KEY", $Value, "User")
        [System.Environment]::SetEnvironmentVariable("NOTION_API_KEY", $Value, "Process")
    }
    if ($SetKey -eq "NOTION_API_KEY") {
        [System.Environment]::SetEnvironmentVariable("NOTION_API_TOKEN", $Value, "User")
        [System.Environment]::SetEnvironmentVariable("NOTION_API_TOKEN", $Value, "Process")
    }
    if ($SetKey -eq "GITHUB_TOKEN") {
        [System.Environment]::SetEnvironmentVariable("GITHUB_PERSONAL_ACCESS_TOKEN", $Value, "User")
        [System.Environment]::SetEnvironmentVariable("GITHUB_PERSONAL_ACCESS_TOKEN", $Value, "Process")
    }
    
    Write-Host "`nSuccessfully set user environment variable '$SetKey'." -ForegroundColor Green
    exit 0
}

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host " Antigravity Global API Keys & MCP Environment Audit" -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan

$userVars = [System.Environment]::GetEnvironmentVariables("User")
$procVars = [System.Environment]::GetEnvironmentVariables("Process")

foreach ($k in $keys) {
    $name = $k.Name
    $val = $userVars[$name]
    if (-not $val) { $val = $procVars[$name] }

    if ($val) {
        $previewLen = [Math]::Min(6, $val.Length)
        $preview = $val.Substring(0, $previewLen) + "..."
        Write-Host "  [OK]  $($name.PadRight(22)) : Configured ($preview) - $($k.Tier)" -ForegroundColor Green
    } else {
        $reqLabel = if ($k.Required) { "[RECOMMENDED]" } else { "[OPTIONAL]" }
        Write-Host "  [--]  $($name.PadRight(22)) : Missing $reqLabel - Get at: $($k.Source)" -ForegroundColor Yellow
    }
}

Write-Host "`nHow to set a key permanently in Windows User environment:" -ForegroundColor Gray
Write-Host "   pwsh -File .\scripts\setup-keys.ps1 -SetKey GITHUB_TOKEN -Value '<your-token>'" -ForegroundColor Cyan
Write-Host "   Or: [System.Environment]::SetEnvironmentVariable('NOTION_API_TOKEN', '<key>', 'User')`n" -ForegroundColor Gray
