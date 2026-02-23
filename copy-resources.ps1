# PowerShell script to copy and rename PDF resources

$sourceFolder = "C:\Users\Admin\Downloads"
$destFolder = "C:\Users\Admin\Downloads\Other\web\My_Website_React\public\downloads\resources"

# Create destination folder if it doesn't exist
if (-not (Test-Path $destFolder)) {
    New-Item -ItemType Directory -Path $destFolder -Force
    Write-Host "Created resources folder" -ForegroundColor Green
}

# File mappings: Source -> Destination
$fileMap = @{
    "Linux Essentials .pdf" = "linux-essentials.pdf"
    "Linux For DevOps-A complete Notes.pdf" = "linux-for-devops-complete-notes.pdf"
    "Networking_For_DevOps.pdf" = "networking-for-devops.pdf"
    "Practice Guide to Azure Devops .pdf" = "practice-guide-to-azure-devops.pdf"
    "Ansible complete guide .pdf" = "ansible-complete-guide.pdf"
    "Docker Hand Written Notes-1.pdf" = "docker-hand-written-notes.pdf"
    "1770570631772.pdf" = "devops-study-material-1.pdf"
    "1769324669022.pdf" = "devops-study-material-2.pdf"
    "1771327130203.pdf" = "devops-study-material-3.pdf"
    "1771765808425.pdf" = "devops-study-material-4.pdf"
    "_.pdf" = "additional-resource-material.pdf"
}

Write-Host "`nCopying and renaming PDF files..." -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

$successCount = 0
$failCount = 0

foreach ($source in $fileMap.Keys) {
    $sourcePath = Join-Path $sourceFolder $source
    $destPath = Join-Path $destFolder $fileMap[$source]
    
    if (Test-Path $sourcePath) {
        try {
            Copy-Item -Path $sourcePath -Destination $destPath -Force
            Write-Host "[✓] Copied: $source -> $($fileMap[$source])" -ForegroundColor Green
            $successCount++
        }
        catch {
            Write-Host "[✗] Failed to copy: $source" -ForegroundColor Red
            Write-Host "    Error: $($_.Exception.Message)" -ForegroundColor Red
            $failCount++
        }
    }
    else {
        Write-Host "[!] Not found: $source" -ForegroundColor Yellow
        $failCount++
    }
}

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "Summary: $successCount successful, $failCount failed/not found" -ForegroundColor Cyan
Write-Host "`nFiles have been copied to:" -ForegroundColor Green
Write-Host "$destFolder" -ForegroundColor White

if ($successCount -gt 0) {
    Write-Host "`nYou can now access these resources on your website!" -ForegroundColor Green
}
