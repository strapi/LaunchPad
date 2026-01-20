##############################################################################
# Peter Sung - Coolify Deployment Script (PowerShell)
# This script helps automate the deployment to Coolify via Hostinger VPS
##############################################################################

# Colors
$InfoColor = "Cyan"
$SuccessColor = "Green"
$WarningColor = "Yellow"
$ErrorColor = "Red"

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $InfoColor
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $SuccessColor
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $WarningColor
}

function Write-ErrorMsg {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $ErrorColor
}

# Banner
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     Peter Sung - Coolify Deployment Assistant            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if Coolify CLI is installed
Write-Info "Checking for Coolify CLI..."
$coolifyCommand = Get-Command coolify -ErrorAction SilentlyContinue
if ($null -eq $coolifyCommand) {
    Write-ErrorMsg "Coolify CLI not found. Installing..."
    npm install -g coolify
    Write-Success "Coolify CLI installed successfully"
} else {
    $coolifyVersion = coolify --version 2>&1
    Write-Success "Coolify CLI found: $coolifyVersion"
}

# Check for required environment files
Write-Info "Checking environment configuration..."
if (-not (Test-Path ".env")) {
    Write-Warning ".env file not found. Creating from .env.example..."
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Info "Please edit .env file with your credentials"
    } else {
        Write-ErrorMsg ".env.example not found"
    }
}

# List existing Coolify instances
Write-Info "Checking Coolify instances..."
$instances = coolify instances list 2>&1 | Out-String
if ($instances -match "don't have any") {
    Write-Warning "No Coolify instances found"
    Write-Host ""
    Write-Info "To add a Coolify instance, run:"
    Write-Host "  coolify instances add" -ForegroundColor White
    Write-Host ""
    Write-Info "You will need:"
    Write-Host "  - Coolify instance URL (e.g., https://your-vps-ip:3000)" -ForegroundColor White
    Write-Host "  - Coolify API token (from dashboard Settings > API)" -ForegroundColor White
    Write-Host ""
    $response = Read-Host "Would you like to add an instance now? (y/n)"
    if ($response -eq "y" -or $response -eq "Y") {
        coolify instances add
    } else {
        Write-Info "Skipping instance setup. You can add it later with: coolify instances add"
        exit 0
    }
} else {
    Write-Success "Coolify instances configured"
    Write-Host $instances
}

# Check Git repository status
Write-Info "Checking Git repository..."
if (Test-Path ".git") {
    $branch = git branch --show-current
    Write-Success "Current branch: $branch"

    # Check for uncommitted changes
    $status = git status --porcelain
    if ($status) {
        Write-Warning "You have uncommitted changes"
        git status --short
        Write-Host ""
        $response = Read-Host "Continue anyway? (y/n)"
        if ($response -ne "y" -and $response -ne "Y") {
            Write-Info "Deployment cancelled"
            exit 0
        }
    } else {
        Write-Success "Working directory is clean"
    }
} else {
    Write-ErrorMsg "Not a Git repository"
    exit 1
}

# Deployment menu
Write-Host ""
Write-Info "What would you like to deploy?"
Write-Host "  1) Next.js Frontend only"
Write-Host "  2) Strapi Backend only"
Write-Host "  3) Both Frontend and Backend"
Write-Host "  4) Check deployment status"
Write-Host "  5) View application logs"
Write-Host "  6) Restart applications"
Write-Host "  7) Exit"
Write-Host ""
$choice = Read-Host "Enter your choice [1-7]"

switch ($choice) {
    "1" {
        Write-Info "Deploying Next.js Frontend..."
        coolify deploy peter-sung-frontend
        Write-Success "Frontend deployment initiated"
    }
    "2" {
        Write-Info "Deploying Strapi Backend..."
        coolify deploy peter-sung-strapi
        Write-Success "Backend deployment initiated"
    }
    "3" {
        Write-Info "Deploying both Frontend and Backend..."
        Start-Job -ScriptBlock { coolify deploy peter-sung-frontend }
        Start-Job -ScriptBlock { coolify deploy peter-sung-strapi }
        Get-Job | Wait-Job | Receive-Job
        Write-Success "Both deployments initiated"
    }
    "4" {
        Write-Info "Checking deployment status..."
        coolify status peter-sung-frontend
        coolify status peter-sung-strapi
    }
    "5" {
        Write-Info "Fetching logs..."
        Write-Host ""
        Write-Host "Select application:"
        Write-Host "  1) Frontend"
        Write-Host "  2) Backend"
        $logChoice = Read-Host "Choice"
        if ($logChoice -eq "1") {
            coolify execute peter-sung-frontend -- docker logs -f --tail 100
        } elseif ($logChoice -eq "2") {
            coolify execute peter-sung-strapi -- docker logs -f --tail 100
        }
    }
    "6" {
        Write-Info "Restarting applications..."
        Write-Host ""
        Write-Host "Select application:"
        Write-Host "  1) Frontend"
        Write-Host "  2) Backend"
        Write-Host "  3) Both"
        $restartChoice = Read-Host "Choice"
        if ($restartChoice -eq "1") {
            coolify restart peter-sung-frontend
        } elseif ($restartChoice -eq "2") {
            coolify restart peter-sung-strapi
        } elseif ($restartChoice -eq "3") {
            coolify restart peter-sung-frontend
            coolify restart peter-sung-strapi
        }
        Write-Success "Restart initiated"
    }
    "7" {
        Write-Info "Exiting..."
        exit 0
    }
    default {
        Write-ErrorMsg "Invalid choice"
        exit 1
    }
}

Write-Host ""
Write-Success "Operation completed!"
Write-Host ""
Write-Info "Useful commands:"
Write-Host "  - Check status: coolify status <app-name>" -ForegroundColor White
Write-Host "  - View logs: coolify execute <app-name> -- docker logs -f --tail 100" -ForegroundColor White
Write-Host "  - Restart: coolify restart <app-name>" -ForegroundColor White
Write-Host "  - Deploy: coolify deploy <app-name>" -ForegroundColor White
Write-Host ""
Write-Info "For more help, visit: https://coolify.io/docs"
