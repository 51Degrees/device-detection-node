param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName
)

Write-Output "Packages installation"

$Packages = "fiftyone.devicedetection", "fiftyone.devicedetection.cloud", "fiftyone.devicedetection.onpremise", "fiftyone.devicedetection.shared";

Push-Location $RepoName

# Path to packed packages
$packageFolderPath = "../package";

try {
    # We are going through all packages to replace their package json
    # We are adding packed package as dependency for it
    foreach ($package in $Packages) {

        # Get all .tgz files in the package folder that match the dependency name
        $tgzFiles = Get-ChildItem -Path $packageFolderPath -Filter "$package-*.tgz"

        if ($tgzFiles.Count -gt 0) {
            # Extract version from the first matching .tgz file
            $tgzFileName = $tgzFiles[0].Name
            $version = [System.IO.Path]::GetFileNameWithoutExtension($tgzFileName) -replace "$package-", ""

            $path = Join-Path . $package
            Push-Location $path
            Write-Output "Switching dependencies for $package"

            $filePath = "package.json"

            # Read the content of the package.json file
            $jsonContent = Get-Content $filePath | ConvertFrom-Json

            # Check if the dependency exists in the package.json
            if (! $jsonContent.dependencies -or $jsonContent.dependencies.count -lt 1) {
                Write-Output "$package doesn't have any dependencies"
            } elseif ($jsonContent.dependencies."$package") {
                # Update the dependency value
                $jsonContent.dependencies."$package" = "file:../../package/$package-$version.tgz"
            } else {
                # If the dependency doesn't exist, add it with the new value
                $jsonContent.dependencies | Add-Member -MemberType NoteProperty -Name $package -Value "file:../../package/$package-$version.tgz"
            }

            # Convert the updated object back to JSON and write it to the file
            $jsonContent | ConvertTo-Json | Set-Content $filePath

            if ($package -eq "fiftyone.devicedetection.onpremise") {
                $examplePathTo51JSON = Join-Path . "examples/onpremise/gettingstarted-web/51d.json"
                $jsonContent51JSON = Get-Content $examplePathTo51JSON | ConvertFrom-Json
                $jsonContent51JSON.PipelineOptions.Elements[0].elementName = "../../../node_modules/fiftyone.devicedetection.onpremise/deviceDetectionOnPremise";
                # Convert the updated object back to JSON and write it to the file
                $jsonContent51JSON | ConvertTo-Json -Depth 10 | Set-Content $examplePathTo51JSON
            }

            if ($package -eq "fiftyone.devicedetection.cloud") {
                $examplePathTo51JSON = Join-Path . "examples/cloud/gettingstarted-web/51d.json"
                $jsonContent51JSON = Get-Content $examplePathTo51JSON | ConvertFrom-Json
                $jsonContent51JSON.PipelineOptions.Elements[1].elementName = "../../../node_modules/fiftyone.devicedetection.cloud/deviceDetectionCloud";
                # Convert the updated object back to JSON and write it to the file
                $jsonContent51JSON | ConvertTo-Json -Depth 10 | Set-Content $examplePathTo51JSON
            }
            # Reinstall packages to be sure that we use our packet packages
            npm install

            Pop-Location
        }

    }
} finally {
    Pop-Location
}
exit $LASTEXITCODE
