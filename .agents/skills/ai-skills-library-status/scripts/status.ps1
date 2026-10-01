[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$LibraryRoot,

    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$ProjectRoot,

    [string]$GlobalSkillsPath = (Join-Path $HOME '.agents\skills')
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Resolve-ExistingDirectory {
    param([string]$Path, [string]$Label)

    if (-not (Test-Path -LiteralPath $Path -PathType Container)) {
        throw "$Label directory does not exist: $Path"
    }

    return (Resolve-Path -LiteralPath $Path).Path
}

function Get-SkillSignature {
    param([string]$SkillPath)

    $entries = Get-ChildItem -LiteralPath $SkillPath -Recurse -File -Force |
        Sort-Object FullName |
        ForEach-Object {
            $relativePath = $_.FullName.Substring($SkillPath.Length).TrimStart([IO.Path]::DirectorySeparatorChar, [IO.Path]::AltDirectorySeparatorChar)
            "$relativePath|$((Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash)"
        }

    return ($entries -join "`n")
}

function Get-SkillSignatures {
    param([string]$SkillsRoot)

    $skills = @{}
    if (-not (Test-Path -LiteralPath $SkillsRoot -PathType Container)) {
        return $skills
    }

    Get-ChildItem -LiteralPath $SkillsRoot -Directory -Force | ForEach-Object {
        if (Test-Path -LiteralPath (Join-Path $_.FullName 'SKILL.md') -PathType Leaf) {
            $skills[$_.Name] = Get-SkillSignature -SkillPath $_.FullName
        }
    }

    return $skills
}

function Get-DifferenceLines {
    param([hashtable]$Reference, [hashtable]$Candidate)

    $lines = [System.Collections.Generic.List[string]]::new()

    foreach ($name in @($Candidate.Keys | Sort-Object)) {
        if (-not $Reference.ContainsKey($name)) {
            $lines.Add("+ $name")
        }
        elseif ($Candidate[$name] -ne $Reference[$name]) {
            $lines.Add("~ $name")
        }
    }

    foreach ($name in @($Reference.Keys | Sort-Object)) {
        if (-not $Candidate.ContainsKey($name)) {
            $lines.Add("- $name")
        }
    }

    return $lines
}

$libraryRootPath = Resolve-ExistingDirectory -Path $LibraryRoot -Label 'Library root'
$projectRootPath = Resolve-ExistingDirectory -Path $ProjectRoot -Label 'Project root'
$globalSkillsPath = Resolve-ExistingDirectory -Path $GlobalSkillsPath -Label 'Global skills'

$repoSkills = Get-SkillSignatures -SkillsRoot (Join-Path $libraryRootPath '.agents\skills')
$globalSkills = Get-SkillSignatures -SkillsRoot $globalSkillsPath
$projectSkills = Get-SkillSignatures -SkillsRoot (Join-Path $projectRootPath '.agents\skills')
$globalDifferences = @(Get-DifferenceLines -Reference $repoSkills -Candidate $globalSkills)
$projectDifferences = @(Get-DifferenceLines -Reference $repoSkills -Candidate $projectSkills)

Write-Output 'AI Skills Library Status'
Write-Output ''
Write-Output 'Legend: + only here; - missing here but present in REPO; ~ differs from REPO'
Write-Output ''
Write-Output "REPO ($($repoSkills.Count))"
foreach ($name in @($repoSkills.Keys | Sort-Object)) {
    Write-Output "  $name"
}

Write-Output ''
Write-Output "GLOBAL  $globalSkillsPath"
if ($globalDifferences.Count -eq 0) {
    Write-Output '  = matches REPO'
}
else {
    foreach ($line in $globalDifferences) {
        Write-Output "  $line"
    }
}

Write-Output ''
Write-Output "PROJECT  $(Join-Path $projectRootPath '.agents\skills')"
if ($projectDifferences.Count -eq 0) {
    Write-Output '  = matches REPO'
}
else {
    foreach ($line in $projectDifferences) {
        Write-Output "  $line"
    }
}
