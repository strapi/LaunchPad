$localeDir = 'c:\Users\Trevor\OneDrive\One Drive Total Dump\Srpski\PETER SUNG BUILD\peter-sung\next\app\[locale]'
$signUpPath = Join-Path $localeDir 'sign-up'
Write-Host "Attempting to delete: $signUpPath"
if (Test-Path -LiteralPath $signUpPath) {
    Remove-Item -LiteralPath $signUpPath -Recurse -Force
    Write-Host "Directory deleted successfully"
} else {
    Write-Host "Directory not found"
}
