param (
    [string]$DeviceDetection,
    [string]$DeviceDetectionUrl,
    [string]$CsvUrl
)
$ErrorActionPreference = 'Stop'

# PreBuild is a job from the nightly-publish-main workflow
if ($env:GITHUB_JOB -eq "PreBuild") {
    Write-Output "Skipping assets fetching"
    exit 0
}

$deviceDetectionData = "$PSScriptRoot/../fiftyone.devicedetection.onpremise/device-detection-cxx/device-detection-data"

$assets = '51Degrees-LiteV4.1.hash', '20000 Evidence Records.yml', '20000 User Agents.csv'
if ($DeviceDetection) {
    $assets += 'TAC-HashV41.hash', '51Degrees.csv'
} else {
    Write-Host "::warning file=$($MyInvocation.ScriptName),line=$($MyInvocation.ScriptLineNumber),title=No License Key::A device detection license was not provided, so On-Premise Data file and 51Degrees.csv will not be downloaded."
}

./steps/fetch-assets.ps1 -DeviceDetection:$DeviceDetection -DeviceDetectionUrl:$DeviceDetectionUrl -CsvUrl:$CsvUrl -Assets $assets
foreach ($asset in $assets) {
    switch -Exact -CaseSensitive ($asset) {
        'TAC-HashV41.hash' {New-Item -ItemType SymbolicLink -Force -Target "$PWD/assets/$_" -Path "$deviceDetectionData/Enterprise-HashV41.hash", "$PSScriptRoot/../fiftyone.devicedetection.onpremise/tests/51Degrees-LiteV4.1.hash"}
        '51Degrees.csv' {New-Item -ItemType SymbolicLink -Force -Target "$PWD/assets/$_" -Path "$PSScriptRoot/../fiftyone.devicedetection.cloud/tests/$_"}
        '51Degrees-LiteV4.1.hash' {New-Item -ItemType SymbolicLink -Force -Target "$PWD/assets/$_" -Path "$deviceDetectionData/$_", "$deviceDetectionData/51Degrees.hash"}
        default {New-Item -ItemType SymbolicLink -Force -Target "$PWD/assets/$_" -Path "$deviceDetectionData/$_"}
    }
}
