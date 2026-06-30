param (
    [Parameter(Mandatory)][string]$RepoName,
    [Parameter(Mandatory)][string]$TestResourceKey
)
$ErrorActionPreference = "Stop"
$PSNativeCommandUseErrorActionPreference = $true

./node/run-integration-tests.ps1 -RepoName $RepoName

if ($IsLinux -and [System.Runtime.InteropServices.RuntimeInformation]::ProcessArchitecture -eq [System.Runtime.InteropServices.Architecture]::Arm64) {
    Write-Host "::warning title=Selenium skipped::Selenium contract skipped on linux-arm64 (no selenium-manager aarch64 build); covered on x64 and macOS-arm."
    exit
}

if (-not $TestResourceKey) {
    Write-Host "::warning title=No Resource Key::No resource key; skipping the Selenium contract."
    exit
}

Write-Host 'Running Selenium tests...'
try {
    # Start this repo's cloud example, pointed at the live cloud.
    Push-Location "$PSScriptRoot/../fiftyone.devicedetection.cloud/examples/cloud/gettingstarted-web"
    try {
        $env:PORT = 8096
        $env:RESOURCE_KEY = $TestResourceKey
        $env:FOD_CLOUD_API_URL = "https://cloud.51degrees.com/api/v4/"
        $example = node gettingStarted.js 2>&1 &
    } finally { Pop-Location }

    # Get the shared contract tests.
    if (-not (Test-Path selenium-api-tests)) {
        git clone --depth 1 https://github.com/51Degrees/selenium-api-tests.git
    }
    # Wait for the example to come up.
    curl -sS -o /dev/null --retry 5 --retry-connrefused "http://localhost:$env:PORT"

    $env:CLOUD_ROOT_URL = "https://cloud.51degrees.com/"
    $env:PAID_RESOURCE_KEY = $TestResourceKey
    $env:EXAMPLE_URL = "http://localhost:$env:PORT"
    $env:EXAMPLE_LANG = 'node'
    dotnet test selenium-api-tests -c Release --filter TestCategory=Contract
} catch {
    if ($example) { Write-Host '>>> example app output >>>'; Receive-Job $example | Out-Host; Write-Host '<<< app output <<<' }
    throw
} finally {
    if ($example) {Remove-Job -Force $example}
}
