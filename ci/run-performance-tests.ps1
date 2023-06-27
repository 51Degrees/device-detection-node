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

    $perfSummary = New-Item -ItemType directory -Path test-results/performance-summary -Force
    $perfJSONOutputName = "results_$Name.json";

    node fiftyone.devicedetection.onpremise/examples/onpremise/performance-console/performance.js --jsonoutput $perfJSONOutputName || $($testsFailed = $true)

    Write-Output "Path to performance results - /"

    Move-Item -Path $perfJSONOutputName -Destination "$perfSummary/$perfJSONOutputName" || $(throw "failed to move summary")
    Write-Output "OK"

} finally {
    Pop-Location
}
exit $testsFailed ? 1 : 0

