param (
    [Parameter(Mandatory)][string]$RepoName,
    [string]$TestResourceKey
)
$ErrorActionPreference = "Stop"
$PSNativeCommandUseErrorActionPreference = $true

./node/run-integration-tests.ps1 -RepoName $RepoName

if ($IsLinux -and [System.Runtime.InteropServices.RuntimeInformation]::ProcessArchitecture -eq [System.Runtime.InteropServices.Architecture]::Arm64) {
    Write-Host "::warning title=Selenium skipped::Selenium contract skipped on linux-arm64 (no selenium-manager aarch64 build); covered on x64 and macOS-arm."
    exit
}

# Starts one of this repository's web examples, runs the shared Selenium
# contract tests against it, and stops it again. Throws if the tests fail,
# after printing the example's output so the failure can be diagnosed from the
# job log.
function Invoke-ContractTests {
    param (
        [Parameter(Mandatory)][string]$Name,
        [Parameter(Mandatory)][string]$ExampleDir,
        [Parameter(Mandatory)][int]$Port,
        [Parameter(Mandatory)][hashtable]$Environment
    )
    Write-Host "Running Selenium contract tests against the $Name example on port $Port..."
    $example = $null
    try {
        # The background job is a new process, which inherits this process's
        # environment and current location when it starts.
        $env:PORT = $Port
        foreach ($name in $Environment.Keys) {
            [Environment]::SetEnvironmentVariable($name, $Environment[$name])
        }
        Push-Location $ExampleDir
        try {
            $example = node gettingStarted.js 2>&1 &
        } finally { Pop-Location }

        # Wait for the example to come up. Loading an on-premise data file can
        # take longer than connecting to the cloud, so allow up to two minutes.
        curl -sS -o $(if ($IsWindows) { 'NUL' } else { '/dev/null' }) --retry 20 --retry-delay 3 --retry-max-time 120 --retry-connrefused "http://localhost:$Port"
        if ($LASTEXITCODE -ne 0) { throw "The $Name example did not start on port $Port." }

        $env:EXAMPLE_URL = "http://localhost:$Port"
        $env:EXAMPLE_LANG = 'node'
        dotnet test selenium-api-tests -c Release --filter TestCategory=Contract
        if ($LASTEXITCODE -ne 0) { throw "dotnet test exited with $LASTEXITCODE." }
        Write-Host "Selenium contract tests passed against the $Name example."
    } catch {
        Write-Host "::error title=Selenium contract failed::The Selenium contract tests failed against the $Name example. $_"
        if ($example) { Write-Host ">>> $Name example output >>>"; Receive-Job $example | Out-Host; Write-Host "<<< $Name example output <<<" }
        throw
    } finally {
        if ($example) { Remove-Job -Force $example }
        foreach ($name in $Environment.Keys) {
            [Environment]::SetEnvironmentVariable($name, $null)
        }
    }
}

# Get the shared contract tests.
if (-not (Test-Path selenium-api-tests)) {
    git clone --depth 1 https://github.com/51Degrees/selenium-api-tests.git
}

# The suite reads the cloud address when it starts, even when the example it
# drives does not use the cloud.
$env:CLOUD_ROOT_URL = "https://cloud.51degrees.com/"

$failed = @()

# Cloud example, pointed at the live cloud.
if ($TestResourceKey) {
    $env:PAID_RESOURCE_KEY = $TestResourceKey
    try {
        Invoke-ContractTests `
        -Name 'cloud' `
        -ExampleDir "$PSScriptRoot/../fiftyone.devicedetection.cloud/examples/cloud/gettingstarted-web" `
        -Port 8096 `
        -Environment @{
            '_51DEGREES_RESOURCE_KEY' = $TestResourceKey
            'FOD_CLOUD_API_URL' = 'https://cloud.51degrees.com/api/v4/'
        }
    } catch { $failed += 'cloud' }
} else {
    Write-Host "::warning title=No Resource Key::No resource key; skipping the Selenium contract against the cloud example."
}

# On-premise example, using the TAC data file. The Lite data file has neither
# the DeviceType property nor the JavaScript properties the contract tests
# need, so the tests are skipped when the TAC file was not fetched (that is,
# when no device detection licence was given to fetch-assets.ps1, which puts
# its files in ./assets).
$tacDataFile = Join-Path $PWD 'assets' 'TAC-HashV41.hash'
if (Test-Path $tacDataFile) {
    # The suite requires a resource key to be set, but the on-premise example
    # never calls the cloud, so the value is not used. Keep the real one if the
    # cloud run above set it.
    if (-not $env:PAID_RESOURCE_KEY) {
        $env:PAID_RESOURCE_KEY = 'not-used-by-the-on-premise-example'
    }
    try {
        Invoke-ContractTests `
        -Name 'on-premise' `
        -ExampleDir "$PSScriptRoot/../fiftyone.devicedetection.onpremise/examples/onpremise/gettingstarted-web" `
        -Port 8097 `
        -Environment @{
            '51DEGREES_DD_PATH' = (Resolve-Path $tacDataFile).Path
        }
    } catch { $failed += 'on-premise' }
} else {
    Write-Host "::warning title=No TAC data file::'$tacDataFile' was not found; skipping the Selenium contract against the on-premise example."
}

if ($failed) {
    throw "Selenium contract tests failed against the $($failed -join ' and ') example(s)."
}
