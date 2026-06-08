param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName,
    [Parameter(Mandatory=$true)]
    [Hashtable]$Keys
)

./node/run-integration-tests.ps1 -RepoName $RepoName
$status = $LASTEXITCODE

$exampleLang = "node"
$port = 8098

# Start this repo's cloud example, pointed at the live cloud.
Push-Location "$RepoName/fiftyone.devicedetection.cloud/examples/cloud/gettingstarted-web"
npm install --prefix ../../..
$env:PORT = "$port"
$env:RESOURCE_KEY = $Keys.TestResourceKey
$env:FOD_CLOUD_API_URL = "https://cloud.51degrees.com/api/v4/"
$exampleProc = Start-Process node -ArgumentList "gettingStarted.js" -PassThru
Pop-Location

# Run the shared Selenium contract against the live cloud.
function Test-ChromeAvailable {
    foreach ($c in 'google-chrome','chromium','chromium-browser','chrome','msedge') {
        if (Get-Command $c -ErrorAction SilentlyContinue) { return $true }
    }
    if ($IsWindows) {
        foreach ($p in "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
                       "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe") {
            if (Test-Path $p) { return $true }
        }
    }
    if ($IsMacOS -and (Test-Path '/Applications/Google Chrome.app')) { return $true }
    return $false
}

if (-not $Keys.TestResourceKey) {
    Write-Output "::warning title=No Resource Key::No resource key; skipping the Selenium contract."
    exit $status
}
if (-not (Test-ChromeAvailable)) {
    Write-Output "::warning title=No Chrome::Chrome not found on this runner; skipping the Selenium contract."
    exit $status
}

# Make sure .NET 10 is available.
if (-not (dotnet --list-sdks 2>$null | Select-String -Quiet '^10\.')) {
    $dotnetDir = Join-Path $HOME ".dotnet10"
    if ($IsWindows) {
        Invoke-WebRequest https://dot.net/v1/dotnet-install.ps1 -OutFile dotnet-install.ps1
        ./dotnet-install.ps1 -Channel 10.0 -InstallDir $dotnetDir
    } else {
        Invoke-WebRequest https://dot.net/v1/dotnet-install.sh -OutFile dotnet-install.sh
        bash dotnet-install.sh --channel 10.0 --install-dir $dotnetDir
    }
    $env:PATH = $dotnetDir + [IO.Path]::PathSeparator + $env:PATH
}

# Get the shared contract tests.
if (-not (Test-Path selenium-api-tests)) {
    git clone --depth 1 https://github.com/51Degrees/selenium-api-tests.git selenium-api-tests
    if ($LASTEXITCODE -ne 0) { throw "Failed to clone selenium-api-tests" }
}
dotnet build selenium-api-tests/SeleniumApiTests.csproj -c Release
if ($LASTEXITCODE -ne 0) { throw "Failed to build the contract tests" }

# Wait for the example to come up.
for ($i = 0; $i -lt 30; $i++) {
    try { Invoke-WebRequest -UseBasicParsing "http://localhost:$port/" -TimeoutSec 5 | Out-Null; break }
    catch { Start-Sleep 2 }
}

$env:CLOUD_ROOT_URL    = "https://cloud.51degrees.com/"
$env:PAID_RESOURCE_KEY = $Keys.TestResourceKey
$env:EXAMPLE_URL       = "http://localhost:$port"
$env:EXAMPLE_LANG      = $exampleLang
dotnet test selenium-api-tests/SeleniumApiTests.csproj -c Release --no-build --filter TestCategory=Contract
$contract = $LASTEXITCODE

if ($exampleProc) { Stop-Process -Id $exampleProc.Id -Force -ErrorAction SilentlyContinue }
if ($status -ne 0 -or $contract -ne 0) { exit 1 } else { exit 0 }
