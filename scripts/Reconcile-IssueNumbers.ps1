<#
.SYNOPSIS
    Reconcile issue-file numbers (issues/NNN-slug.md) against a parent branch so
    that parallel git worktrees never land two DIFFERENT issues on the same number.

.DESCRIPTION
    The numbers already on the parent branch are authoritative. A branch being
    integrated later YIELDS: only THIS branch's NEW issues are renumbered, never
    issues already present on the parent. Minimal churn -- an issue is renumbered
    only when its number is already owned by a different issue (slug) on the
    parent; numbers still free on the parent are left untouched.

    Mirrors scripts/reconcile-issue-numbers.sh for native Windows/PowerShell use
    (e.g. from the ralph loop).

.PARAMETER Parent
    Parent/target ref to reconcile against. Default: the repo's detected default
    branch (origin/HEAD), else origin/main.

.PARAMETER Check
    Report collisions and exit 1 if any; make no changes.

.PARAMETER NoCommit
    Apply renames/reference rewrites but do not git commit.

.EXAMPLE
    Reconcile-IssueNumbers.ps1 -Check -Parent master
    Reconcile-IssueNumbers.ps1 -Parent origin/master
#>
[CmdletBinding()]
param(
    [string]$Parent,
    [switch]$Check,
    [switch]$NoCommit
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Fail($msg, $code) { [Console]::Error.WriteLine($msg); exit $code }

$repoRoot = (git rev-parse --show-toplevel 2>$null)
if (-not $repoRoot) { Fail "reconcile: not inside a git repository." 2 }
Set-Location $repoRoot

# --- Resolve the parent/target ref ------------------------------------------
if (-not $Parent) {
    $d = (git symbolic-ref --quiet refs/remotes/origin/HEAD 2>$null)
    if ($d) { $Parent = 'origin/' + ($d -replace '^refs/remotes/origin/', '') }
    else { $Parent = 'origin/main' }
}

git rev-parse --verify --quiet $Parent *> $null
if ($LASTEXITCODE -ne 0) {
    $alt = $Parent -replace '^origin/', ''
    git rev-parse --verify --quiet $alt *> $null
    if ($LASTEXITCODE -eq 0) {
        $Parent = $alt
    }
    else {
        [Console]::Error.WriteLine("reconcile: parent ref '$Parent' not found (fetch first?); nothing to reconcile.")
        exit 0
    }
}

# --- Numbers already used on the parent branch ------------------------------
$parentOwner = @{}   # intnum -> slug that owns that number on the parent
$parentSlug = @{}    # slug   -> $true
$maxUsed = 0

foreach ($line in @(git ls-tree -r --name-only $Parent -- issues 2>$null)) {
    if ($line -match '^issues/(done/)?0*([0-9]+)-(.+)\.md$') {
        $intnum = [int]$Matches[2]
        $slug = $Matches[3]
        if (-not $parentOwner.ContainsKey($intnum)) { $parentOwner[$intnum] = $slug }
        $parentSlug[$slug] = $true
        if ($intnum -gt $maxUsed) { $maxUsed = $intnum }
    }
}

# --- This branch's issue files (working tree) -------------------------------
$branchFiles = @()
if (Test-Path 'issues') {
    $branchFiles += Get-ChildItem 'issues' -Filter '*.md' -File | ForEach-Object { "issues/$($_.Name)" }
}
if (Test-Path 'issues/done') {
    $branchFiles += Get-ChildItem 'issues/done' -Filter '*.md' -File | ForEach-Object { "issues/done/$($_.Name)" }
}

# Fold this branch's own numbers into the running maximum.
foreach ($f in $branchFiles) {
    $base = Split-Path $f -Leaf
    if ($base -match '^0*([0-9]+)-') {
        $bi = [int]$Matches[1]
        if ($bi -gt $maxUsed) { $maxUsed = $bi }
    }
}

# --- Detect collisions and build the rename plan ----------------------------
$plan = New-Object System.Collections.ArrayList
$collisions = 0

foreach ($f in $branchFiles) {
    $dir = (Split-Path $f -Parent) -replace '\\', '/'
    $base = Split-Path $f -Leaf
    if ($base -notmatch '^(0*[0-9]+)-(.+)\.md$') { continue }
    $numRaw = $Matches[1]
    $slug = $Matches[2]
    $intnum = [int]$numRaw

    # Same issue already on the parent (matched by slug) -> never renumber.
    if ($parentSlug.ContainsKey($slug)) { continue }

    # New issue. Collision only if its number is owned by a DIFFERENT slug.
    if ($parentOwner.ContainsKey($intnum) -and $parentOwner[$intnum] -ne $slug) {
        $collisions++
        if ($Check) {
            [Console]::Error.WriteLine("collision: $f  (number $intnum already used on $Parent by '$($parentOwner[$intnum])')")
            continue
        }
        $maxUsed++
        $new3 = '{0:D3}' -f $maxUsed
        [void]$plan.Add([pscustomobject]@{
                Old    = $f
                New    = "$dir/$new3-$slug.md"
                OldTok = "$numRaw-$slug.md"
                NewTok = "$new3-$slug.md"
            })
    }
}

# --- Check mode -------------------------------------------------------------
if ($Check) {
    if ($collisions -gt 0) {
        [Console]::Error.WriteLine("reconcile: $collisions issue-number collision(s) with $Parent.")
        exit 1
    }
    Write-Host "reconcile: no issue-number collisions with $Parent."
    exit 0
}

if ($plan.Count -eq 0) {
    Write-Host "reconcile: no collisions with $Parent; nothing to renumber."
    exit 0
}

# --- Apply the renames ------------------------------------------------------
foreach ($p in $plan) {
    git ls-files --error-unmatch $p.Old *> $null
    if ($LASTEXITCODE -eq 0) {
        git mv -- $p.Old $p.New
    }
    else {
        Move-Item -LiteralPath $p.Old -Destination $p.New
        git add -- $p.New *> $null
    }
    Write-Host "renumbered: $($p.Old) -> $($p.New)"
}

# --- Rewrite cross-references (Blocked by issues/NNN-slug.md, etc.) ----------
$allIssues = @()
if (Test-Path 'issues') {
    $allIssues += Get-ChildItem 'issues' -Filter '*.md' -File | ForEach-Object { $_.FullName }
}
if (Test-Path 'issues/done') {
    $allIssues += Get-ChildItem 'issues/done' -Filter '*.md' -File | ForEach-Object { $_.FullName }
}

foreach ($p in $plan) {
    foreach ($af in $allIssues) {
        $content = Get-Content -LiteralPath $af -Raw
        if ($content.Contains($p.OldTok)) {
            $content = $content.Replace($p.OldTok, $p.NewTok)
            Set-Content -LiteralPath $af -Value $content -NoNewline
            git add -- $af *> $null
        }
    }
}

# --- Commit -----------------------------------------------------------------
if (-not $NoCommit) {
    git add -A -- issues *> $null
    git commit -q -m "issues: reconcile numbers against $Parent (renumber $($plan.Count) to avoid collisions)" *> $null
    Write-Host "reconcile: committed renumber of $($plan.Count) issue(s)."
}
else {
    Write-Host "reconcile: applied renumber of $($plan.Count) issue(s) (not committed)."
}
exit 0
