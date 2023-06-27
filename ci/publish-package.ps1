param (
    [Parameter(Mandatory=$true)]
    [string]$RepoName,
    [Parameter(Mandatory=$true)]
    [boolean]$DryRun
)

./node/publish-package-npm.ps1 -RepoName $RepoName -DryRun $DryRun

exit $LASTEXITCODE