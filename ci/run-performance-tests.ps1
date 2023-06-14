param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName,
    [Parameter(Mandatory=$true)]
    [string]$Name
)

$perfSummary = New-Item -ItemType directory -Path $RepoName/test-results/performance-summary -Force

Push-Location $RepoName
try
{
    Write-Output "Running performance tests"
    $env:JEST_JUNIT_OUTPUT_DIR = 'test-results/performance'
    npm run performance-test || $($testsFailed = $true)

    Get-Content -Path performance_test_summary.json

    Write-Output "Path to performance results - $perfSummary/results_$Name.json"

    Move-Item -Path performance_test_summary.json -Destination $perfSummary/results_$Name.json || $(throw "failed to move summary")
    Write-Output "OK"

    $items = Get-ChildItem -Path $perfSummary -Force

    foreach ($item in $items) {
        if ($item.Attributes -band [System.IO.FileAttributes]::Directory) {
            Write-Host "Directory: $($item.Name)"
        } else {
            Write-Host "File: $($item.Name)"
        }
    }

} finally {
    Pop-Location
}

