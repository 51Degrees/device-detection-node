param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName,
    [Parameter(Mandatory=$true)]
    [string]$Version
)

$packages = "fiftyone.devicedetection", "fiftyone.devicedetection.cloud", "fiftyone.devicedetection.onpremise", "fiftyone.devicedetection.shared"

$noRemote = ""

./node/build-package-npm.ps1 -RepoName $RepoName -Packages $packages -NoRemote $noRemote -Version $Version


exit $LASTEXITCODE