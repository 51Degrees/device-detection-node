param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName
)

$packages = "fiftyone.devicedetection", "fiftyone.devicedetection.cloud", "fiftyone.devicedetection.onpremise", "fiftyone.devicedetection.shared";

$needExtensions = "fiftyone.devicedetection.onpremise"

./node/build-project.ps1 -RepoName $RepoName -Packages $packages -NeedExtensions $needExtensions

exit $LASTEXITCODE