param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName,
    [Parameter(Mandatory=$true)]
    [string]$Version
)

# List of packages for build
$packages = "fiftyone.devicedetection", "fiftyone.devicedetection.cloud", "fiftyone.devicedetection.onpremise", "fiftyone.devicedetection.shared"

# List of packages which does not use remote package.json
$noRemote = ""

# Creating build folder inside of specific package
New-Item -ItemType Directory -Path "$RepoName/fiftyone.devicedetection.onpremise/build" | Out-Null

# Copying all binaries to package build folder
Copy-Item -Path "./package-files/*/*.node" -Destination "$RepoName/fiftyone.devicedetection.onpremise/build" -Recurse

./node/build-package-npm.ps1 -RepoName $RepoName -Packages $packages -NoRemote $noRemote -Version $Version


exit $LASTEXITCODE