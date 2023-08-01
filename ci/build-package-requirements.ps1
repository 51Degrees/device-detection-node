param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName
)

$packagesWithExtensions = "fiftyone.devicedetection.onpremise";

./node/build-package-requirements.ps1 -RepoName $RepoName -Packages $packagesWithExtensions