[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [ValidateNotNullOrEmpty()]
    [string]$Sandbox
)

$ErrorActionPreference = 'Stop'

if (-not (Get-Command sbx -ErrorAction SilentlyContinue)) {
    throw 'sbx was not found. Run this from host PowerShell after installing Docker Sandboxes.'
}

function Show-Section {
    param([string]$Title)
    Write-Host "`n=== $Title ==="
}

Show-Section 'Sandbox identity, workspace, and published ports'
& sbx ls

Show-Section "Filesystem policy applying to $Sandbox"
& sbx policy ls $Sandbox --type filesystem --wide

Show-Section "Network policy applying to $Sandbox"
& sbx policy ls $Sandbox --type network --wide

Show-Section "Published ports for $Sandbox"
& sbx ports $Sandbox

Show-Section "Recent network activity for $Sandbox"
& sbx policy log $Sandbox --limit 30

Write-Host @"

Interpretation:
- The workspace shown by 'sbx ls' is the host path actually shared with this sandbox.
- Filesystem policy describes host paths eligible to be mounted; it does not add mounts.
- Network logs are historical. Check a specific host with:
  sbx policy check network --sandbox $Sandbox <host>
"@
