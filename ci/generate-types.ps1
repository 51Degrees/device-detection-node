param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName
)

./node/generate-types.ps1 -RepoName $RepoName

exit $LASTEXITCODE