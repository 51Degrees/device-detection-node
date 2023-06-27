param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName
)

$packages = "fiftyone.devicedetection", "fiftyone.devicedetection.cloud", "fiftyone.devicedetection.onpremise", "fiftyone.devicedetection.shared"

./node/update-packages.ps1 -RepoName $RepoName -Packages $packages

exit $LASTEXITCODE