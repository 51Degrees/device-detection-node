param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName,
    [Parameter(Mandatory=$true)]
    [string]$Name
)

Push-Location $RepoName
try
{
    Write-Output "Running performance tests"
    $env:JEST_JUNIT_OUTPUT_DIR = 'test-results/performance'

    $perfSummary = New-Item -ItemType directory -Path $RepoName/test-results/performance-summary -Force
    $perfJSONOutputName = "results_$Name.json";

    Start-Process -FilePath "node" -ArgumentList "$RepoName/examples/onpremse/performance-console/performance.js", "--jsonoutput", $perfJSONOutputName -Wait

    npm run performance-test || $($testsFailed = $true)

    Get-Content -Path $perfJSONOutputName

    Write-Output "Path to performance results - $perfSummary/results_$Name.json"

    Move-Item -Path $perfJSONOutputName -Destination $perfSummary || $(throw "failed to move summary")
    Write-Output "OK"

} finally {
    Pop-Location
}
exit $testsFailed ? 1 : 0

