param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName
)

./node/run-unit-tests.ps1 -RepoName $RepoName