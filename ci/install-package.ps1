param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName
)

./node/install-package.ps1 -RepoName $RepoName

exit $LASTEXITCODE