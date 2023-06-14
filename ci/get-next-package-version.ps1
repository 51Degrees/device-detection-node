param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName,
    [Parameter(Mandatory=$true)]
    [string]$VariableName
)

./node/get-next-package-version.ps1 -RepoName $RepoName -VariableName $VariableName

exit $LASTEXITCODE