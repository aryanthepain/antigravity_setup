<#
.SYNOPSIS
    Generates a high-resolution 1920x1080 Gantt Chart PNG using .NET System.Drawing.
#>

param(
    [string]$OutputPath = (Join-Path $PSScriptRoot "..\gantt_chart.png")
)

Add-Type -AssemblyName System.Drawing

$width = 1920
$height = 1080
$bmp = [System.Drawing.Bitmap]::new($width, $height)
$gfx = [System.Drawing.Graphics]::FromImage($bmp)
$gfx.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$gfx.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# Colors
$bgColor = [System.Drawing.ColorTranslator]::FromHtml("#0F172A")      # Dark slate
$cardColor = [System.Drawing.ColorTranslator]::FromHtml("#1E293B")    # Slate 800
$gridColor = [System.Drawing.ColorTranslator]::FromHtml("#334155")    # Slate 700
$textColor = [System.Drawing.ColorTranslator]::FromHtml("#F8FAFC")    # Slate 50
$subTextColor = [System.Drawing.ColorTranslator]::FromHtml("#94A3B8") # Slate 400
$greenBar = [System.Drawing.ColorTranslator]::FromHtml("#10B981")     # Emerald
$blueBar = [System.Drawing.ColorTranslator]::FromHtml("#3B82F6")      # Blue
$orangeBar = [System.Drawing.ColorTranslator]::FromHtml("#F59E0B")    # Amber
$purpleBar = [System.Drawing.ColorTranslator]::FromHtml("#8B5CF6")    # Purple

# Clear background
$gfx.Clear($bgColor)

# Top Banner Card
$bannerBrush = [System.Drawing.SolidBrush]::new($cardColor)
$gfx.FillRectangle($bannerBrush, 60, 50, 1800, 100)

# Fonts
$fontTitle = [System.Drawing.Font]::new("Segoe UI", 24, [System.Drawing.FontStyle]::Bold)
$fontSub = [System.Drawing.Font]::new("Segoe UI", 12, [System.Drawing.FontStyle]::Regular)
$fontHeader = [System.Drawing.Font]::new("Segoe UI", 13, [System.Drawing.FontStyle]::Bold)
$fontLabel = [System.Drawing.Font]::new("Segoe UI", 14, [System.Drawing.FontStyle]::Bold)
$fontLabelSmall = [System.Drawing.Font]::new("Segoe UI", 11, [System.Drawing.FontStyle]::Regular)

$textBrush = [System.Drawing.SolidBrush]::new($textColor)
$subTextBrush = [System.Drawing.SolidBrush]::new($subTextColor)

$gfx.DrawString("PROJECT DELTA: Q1 2026 IMPLEMENTATION ROADMAP", $fontTitle, $textBrush, 90, 68)
$gfx.DrawString("Live Execution Gantt Chart • Updated Nov 2026 • Target Delivery: Q1 2026", $fontSub, $subTextBrush, 92, 114)

# Gantt Container
$chartX = 60
$chartY = 180
$chartW = 1800
$chartH = 820
$gfx.FillRectangle($bannerBrush, $chartX, $chartY, $chartW, $chartH)

# Table Column Definitions
$taskColW = 460
$timelineX = $chartX + $taskColW
$timelineW = $chartW - $taskColW
$numWeeks = 8
$weekColW = $timelineW / $numWeeks

# Header Row
$headerY = $chartY + 20
$gfx.DrawString("TASK / WORKSTREAM", $fontHeader, $subTextBrush, $chartX + 30, $headerY)

$weeks = @("W1: Jan 05", "W2: Jan 12", "W3: Jan 19", "W4: Jan 26", "W5: Feb 02", "W6: Feb 09", "W7: Feb 16", "W8: Feb 23")
for ($i = 0; $i -lt $numWeeks; $i++) {
    $colX = $timelineX + ($i * $weekColW)
    $gfx.DrawString($weeks[$i], $fontHeader, $subTextBrush, $colX + 15, $headerY)
    
    # Grid lines down chart
    $pen = [System.Drawing.Pen]::new($gridColor, 1)
    $pen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
    $gfx.DrawLine($pen, [int]$colX, $headerY + 35, [int]$colX, $chartY + $chartH - 40)
}

# Dividing line under header
$solidPen = [System.Drawing.Pen]::new($gridColor, 2)
$gfx.DrawLine($solidPen, $chartX, $headerY + 35, $chartX + $chartW, $headerY + 35)

# Tasks Data
$tasks = @(
    @{ Name = "1. Requirements & System Architecture"; Sub = "Specs, Threat Model, ADRs"; Start = 0.0; Duration = 1.6; Color = $greenBar; Progress = "100% COMPLETE" },
    @{ Name = "2. UI/UX Wireframes & Interactive Mockups"; Sub = "Component specs & tokens"; Start = 1.0; Duration = 1.4; Color = $greenBar; Progress = "100% COMPLETE" },
    @{ Name = "3. Core Backend Services & API Gateway"; Sub = "FastAPI / Node, DB Schema"; Start = 2.0; Duration = 2.4; Color = $blueBar; Progress = "75% PROGRESS" },
    @{ Name = "4. Frontend Web Primitives & Motion"; Sub = "shadcn/ui, Radix, Motion.dev"; Start = 3.0; Duration = 2.2; Color = $blueBar; Progress = "60% PROGRESS" },
    @{ Name = "5. Integration Tests & Security Pen-Test"; Sub = "Playwright E2E, Strix Audit"; Start = 5.0; Duration = 1.8; Color = $orangeBar; Progress = "25% PLANNED" },
    @{ Name = "6. Staging Deployment & Cloud Launch"; Sub = "CI/CD, Monitoring, GA Ship"; Start = 6.4; Duration = 1.6; Color = $purpleBar; Progress = "MILESTONE" }
)

$rowStartY = $headerY + 55
$rowHeight = 110

for ($t = 0; $t -lt $tasks.Count; $t++) {
    $item = $tasks[$t]
    $currY = $rowStartY + ($t * $rowHeight)

    # Alternate row subtle tint
    if ($t % 2 -eq 1) {
        $rowBgBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(40, 255, 255, 255))
        $gfx.FillRectangle($rowBgBrush, $chartX, $currY - 10, $chartW, $rowHeight)
    }

    # Task Title & Description
    $gfx.DrawString($item.Name, $fontLabel, $textBrush, $chartX + 30, $currY + 5)
    $gfx.DrawString($item.Sub, $fontLabelSmall, $subTextBrush, $chartX + 30, $currY + 34)

    # Gantt Bar
    $barX = $timelineX + ($item.Start * $weekColW) + 6
    $barW = ($item.Duration * $weekColW) - 12
    $barY = $currY + 12
    $barH = 46

    # Draw rounded rectangle
    $barBrush = [System.Drawing.SolidBrush]::new($item.Color)
    $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $r = 10
    $path.AddArc($barX, $barY, $r, $r, 180, 90)
    $path.AddArc($barX + $barW - $r, $barY, $r, $r, 270, 90)
    $path.AddArc($barX + $barW - $r, $barY + $barH - $r, $r, $r, 0, 90)
    $path.AddArc($barX, $barY + $barH - $r, $r, $r, 90, 90)
    $path.CloseFigure()
    $gfx.FillPath($barBrush, $path)

    # Progress text inside/adjacent bar
    $progFont = [System.Drawing.Font]::new("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
    $whiteBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
    $gfx.DrawString($item.Progress, $progFont, $whiteBrush, $barX + 16, $barY + 14)
}

# Footer Legend
$footerY = $chartY + $chartH - 45
$gfx.DrawString("STATUS LEGEND:  ", $fontHeader, $subTextBrush, $chartX + 30, $footerY)
$gfx.FillRectangle([System.Drawing.SolidBrush]::new($greenBar), $chartX + 180, $footerY + 4, 16, 16)
$gfx.DrawString("Completed", $fontLabelSmall, $textBrush, $chartX + 205, $footerY + 2)

$gfx.FillRectangle([System.Drawing.SolidBrush]::new($blueBar), $chartX + 310, $footerY + 4, 16, 16)
$gfx.DrawString("Active / In Progress", $fontLabelSmall, $textBrush, $chartX + 335, $footerY + 2)

$gfx.FillRectangle([System.Drawing.SolidBrush]::new($orangeBar), $chartX + 490, $footerY + 4, 16, 16)
$gfx.DrawString("Upcoming QA", $fontLabelSmall, $textBrush, $chartX + 515, $footerY + 2)

$gfx.FillRectangle([System.Drawing.SolidBrush]::new($purpleBar), $chartX + 640, $footerY + 4, 16, 16)
$gfx.DrawString("Release Gate", $fontLabelSmall, $textBrush, $chartX + 665, $footerY + 2)

# Save image
$resolvedOut = (Resolve-Path -Path (Split-Path $OutputPath) -ErrorAction SilentlyContinue).Path
if (-not $resolvedOut) {
    $resolvedOut = (Get-Location).Path
}
$finalPath = Join-Path $resolvedOut (Split-Path -Leaf $OutputPath)
$bmp.Save($finalPath, [System.Drawing.Imaging.ImageFormat]::Png)

$gfx.Dispose()
$bmp.Dispose()

Write-Host "✅ [GENERATED] Gantt chart rendered at: $finalPath" -ForegroundColor Green
return $finalPath
