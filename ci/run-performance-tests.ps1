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

    # Used for generating performance output
    $env:PERFORMANCE_JSON_OUTPUT = 'true'
    npm run performance-test || $($testsFailed = $true)

    Get-Content -Path performance_test_summary.json

    Write-Output "Path to performance results - $perfSummary/results_$Name.json"

    Move-Item -Path performance_test_summary.json -Destination $perfSummary/results_$Name.json || $(throw "failed to move summary")
    Write-Output "OK"

} finally {
    Pop-Location
}

