param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName,
    [Parameter(Mandatory=$true)]
    [string]$DeviceDetection,
    [string]$DeviceDetectionUrl
)

if ($env:GITHUB_JOB -eq "PreBuild") {
    Write-Output "Skipping assets fetching"
    exit 0
}

$ErrorActionPreference = 'Stop'

$assets = New-Item -ItemType Directory -Path assets -Force
$deviceDetectionData = "$RepoName/fiftyone.devicedetection.onpremise/device-detection-cxx/device-detection-data"

$downloads = @{
    "TAC-HashV41.hash" = {
        ./steps/fetch-hash-assets.ps1 -RepoName $RepoName -LicenseKey $DeviceDetection -Url $DeviceDetectionUrl
        Move-Item -Path $RepoName/$file -Destination $assets
    }
    "51Degrees-LiteV4.1.hash" = {Invoke-WebRequest -Uri "https://github.com/51Degrees/device-detection-data/raw/main/51Degrees-LiteV4.1.hash" -OutFile $assets/$file}
    "20000 Evidence Records.yml" = {Invoke-WebRequest -Uri "https://media.githubusercontent.com/media/51Degrees/device-detection-data/main/20000%20Evidence%20Records.yml" -OutFile $assets/$file}
    "20000 User Agents.csv" = {Invoke-WebRequest -Uri "https://media.githubusercontent.com/media/51Degrees/device-detection-data/main/20000%20User%20Agents.csv" -OutFile $assets/$file}
    "51Degrees.csv" = {
        Invoke-WebRequest -Uri "https://storage.googleapis.com/51degrees-assets/$DeviceDetection/51Degrees-Tac.zip" -OutFile 51Degrees-Tac.zip
        Expand-Archive -Path 51Degrees-Tac.zip
        Get-Content -TotalCount 1 51Degrees-Tac/51Degrees-Tac-All.csv | Out-File $assets/$file # We only need a header
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


# Tests mutate this file, so we copy it
Write-Output "Copying 'TAC-HashV41.hash' to '$RepoName/fiftyone.devicedetection.onpremise/tests/51Degrees-LiteV4.1.hash'"
Copy-Item -Path $assets/51Degrees-LiteV4.1.hash -Destination $RepoName/fiftyone.devicedetection.onpremise/tests/51Degrees.hash

# We can just symlink these
New-Item -ItemType SymbolicLink -Force -Target "$assets/51Degrees-LiteV4.1.hash" -Path "$deviceDetectionData/51Degrees-LiteV4.1.hash"
New-Item -ItemType SymbolicLink -Force -Target "$assets/20000 Evidence Records.yml" -Path "$deviceDetectionData/20000 Evidence Records.yml"
New-Item -ItemType SymbolicLink -Force -Target "$assets/20000 User Agents.csv" -Path "$deviceDetectionData/20000 User Agents.csv"
New-Item -ItemType SymbolicLink -Force -Target "$assets/51Degrees.csv" -Path "$RepoName/fiftyone.devicedetection.cloud/tests/51Degrees.csv"