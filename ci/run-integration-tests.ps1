param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName
)

./node/run-integration-tests.ps1 -RepoName $RepoName

exit $LASTEXITCODE