param (
    [Parameter(Mandatory)][string]$RepoName,
    [Parameter(Mandatory)][hashtable]$Keys,
    [Parameter(Mandatory)][boolean]$DryRun
)
./node/publish-package-npm.ps1 -RepoName:$RepoName -Keys:$Keys -DryRun:$DryRun
