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

    # Pass the TAC data file explicitly, so the graph is measured with the full
    # data file rather than whichever file the example's folder search finds
    # first. Without a licence key the TAC file isn't downloaded, and the
    # example falls back to its default Lite data file.
    $dataFile = 'fiftyone.devicedetection.onpremise/device-detection-cxx/device-detection-data/Enterprise-HashV41.hash'
    $dataFileArgs = @()
    if (Test-Path $dataFile) {
        $dataFileArgs = '--datafile', $dataFile
    }
    else {
        Write-Warning "No TAC data file at '$dataFile', so the example uses its default data file"
    }

    node fiftyone.devicedetection.onpremise/examples/onpremise/performance-console/performance.js @dataFileArgs --jsonoutput $perfJSONOutputName || $($testsFailed = $true)

    Write-Output "Path to performance results - /"

    Move-Item -Path $perfJSONOutputName -Destination "$perfSummary/$perfJSONOutputName" || $(throw "failed to move summary")
    Write-Output "OK"

} finally {
    Pop-Location
}
exit $testsFailed ? 1 : 0

