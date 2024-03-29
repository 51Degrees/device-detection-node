param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName,
    [string]$DeviceDetection,
    [string]$DeviceDetectionUrl,
    [string]$CsvUrl
)

# Just a optimization step, not referencing to any logic, except of fetch-assets.ps1
if ($env:GITHUB_JOB -eq "PreBuild") {
    Write-Output "Skipping assets fetching"
    exit 0
}

$ErrorActionPreference = 'Stop'

$assets = New-Item -ItemType Directory -Path assets -Force
$deviceDetectionData = "$RepoName/fiftyone.devicedetection.onpremise/device-detection-cxx/device-detection-data"

$downloads = @{
    "TAC-HashV41.hash" = {
        if (!$DeviceDetection) {
            Write-Output "::warning file=$($MyInvocation.ScriptName),line=$($MyInvocation.ScriptLineNumber),title=No License Key::A device detection license was not provided, so On-Premise Data file will not be downloaded."
            return
        }
        ./steps/fetch-hash-assets.ps1 -RepoName $RepoName -LicenseKey $DeviceDetection -Url $DeviceDetectionUrl
        Move-Item -Path $RepoName/$file -Destination $assets
        # Tests mutate this file, so we copy it
        Write-Output "Copying '$file' to '$deviceDetectionData/Enterprise-HashV41.hash'"
        Copy-Item -Path $assets/$file -Destination $deviceDetectionData/Enterprise-HashV41.hash
        Copy-Item -Path $assets/$file -Destination "$RepoName/fiftyone.devicedetection.onpremise/tests/51Degrees-LiteV4.1.hash"
    }
    "51Degrees-LiteV4.1.hash" = {Invoke-WebRequest -Uri "https://github.com/51Degrees/device-detection-data/raw/main/51Degrees-LiteV4.1.hash" -OutFile $assets/$file}
    "20000 Evidence Records.yml" = {Invoke-WebRequest -Uri "https://media.githubusercontent.com/media/51Degrees/device-detection-data/main/20000%20Evidence%20Records.yml" -OutFile $assets/$file}
    "20000 User Agents.csv" = {Invoke-WebRequest -Uri "https://media.githubusercontent.com/media/51Degrees/device-detection-data/main/20000%20User%20Agents.csv" -OutFile $assets/$file}
    "51Degrees.csv" = {
        if (!$DeviceDetection) {
            Write-Output "::warning file=$($MyInvocation.ScriptName),line=$($MyInvocation.ScriptLineNumber),title=No License Key::A device detection license was not provided, so '$file' will not be downloaded."
            return
        }
        ./steps/fetch-csv-assets.ps1 -RepoName $RepoName -LicenseKey $DeviceDetection -Url $CsvUrl
        Get-Content -TotalCount 1 $RepoName/51Degrees-Tac/51Degrees-Tac-All.csv | Out-File $assets/$file # We only need a header
        Remove-Item -Path $RepoName/51Degrees-Tac.zip, $RepoName/51Degrees-Tac/51Degrees-Tac-All.csv
    }
}

foreach ($file in $downloads.Keys) {
    if (!(Test-Path $assets/$file)) {
        Write-Output "Downloading $file"
        Invoke-Command -ScriptBlock $downloads[$file]
    } else {
        Write-Output "'$file' exists, skipping download"
    }
}

# We can just symlink these
Copy-Item -Path $assets/51Degrees-LiteV4.1.hash -Destination "$deviceDetectionData/51Degrees-LiteV4.1.hash"
Copy-Item -Path $assets/51Degrees-LiteV4.1.hash -Destination "$deviceDetectionData/51Degrees.hash"
New-Item -ItemType SymbolicLink -Force -Target "$assets/20000 Evidence Records.yml" -Path "$deviceDetectionData/20000 Evidence Records.yml"
New-Item -ItemType SymbolicLink -Force -Target "$assets/20000 User Agents.csv" -Path "$deviceDetectionData/20000 User Agents.csv"
New-Item -ItemType SymbolicLink -Force -Target "$assets/51Degrees.csv" -Path "$RepoName/fiftyone.devicedetection.cloud/tests/51Degrees.csv"

ls -l $RepoName/fiftyone.devicedetection.onpremise/tests
