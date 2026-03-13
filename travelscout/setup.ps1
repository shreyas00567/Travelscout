# TravelScout Setup Script
# This script helps set up the .env file for the backend

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   TravelScout Backend Configuration" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$envPath = ".\backend\.env"

Write-Host "Creating .env file..." -ForegroundColor Yellow

# Check if .env already exists
if (Test-Path $envPath) {
    Write-Host "⚠️  .env file already exists!" -ForegroundColor Red
    $overwrite = Read-Host "Do you want to overwrite it? (y/n)"
    if ($overwrite -ne "y") {
        Write-Host "Setup cancelled." -ForegroundColor Yellow
        exit
    }
}

# Collect database information
Write-Host ""
Write-Host "Please enter your MySQL database credentials:" -ForegroundColor Green
Write-Host ""

$dbHost = Read-Host "Database Host (default: localhost)"
if ([string]::IsNullOrWhiteSpace($dbHost)) { $dbHost = "localhost" }

$dbUser = Read-Host "Database User (default: root)"
if ([string]::IsNullOrWhiteSpace($dbUser)) { $dbUser = "root" }

$dbPassword = Read-Host "Database Password" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword)
)

$dbName = Read-Host "Database Name (default: travelscout_db)"
if ([string]::IsNullOrWhiteSpace($dbName)) { $dbName = "travelscout_db" }

$dbPort = Read-Host "Database Port (default: 3306)"
if ([string]::IsNullOrWhiteSpace($dbPort)) { $dbPort = "3306" }

$serverPort = Read-Host "Server Port (default: 5000)"
if ([string]::IsNullOrWhiteSpace($serverPort)) { $serverPort = "5000" }

# Create .env content
$envContent = @"
# Database Configuration
DB_HOST=$dbHost
DB_USER=$dbUser
DB_PASSWORD=$dbPasswordPlain
DB_NAME=$dbName
DB_PORT=$dbPort

# Server Configuration
PORT=$serverPort
NODE_ENV=development
"@

# Write to .env file
$envContent | Out-File -FilePath $envPath -Encoding UTF8

Write-Host ""
Write-Host "✅ .env file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Configuration:" -ForegroundColor Cyan
Write-Host "  Database Host: $dbHost" -ForegroundColor White
Write-Host "  Database User: $dbUser" -ForegroundColor White
Write-Host "  Database Name: $dbName" -ForegroundColor White
Write-Host "  Database Port: $dbPort" -ForegroundColor White
Write-Host "  Server Port: $serverPort" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. cd backend" -ForegroundColor White
Write-Host "  2. npm install" -ForegroundColor White
Write-Host "  3. npm start" -ForegroundColor White
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
