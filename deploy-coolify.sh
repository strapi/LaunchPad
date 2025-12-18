#!/bin/bash

##############################################################################
# Peter Sung - Coolify Deployment Script
# This script helps automate the deployment to Coolify via Hostinger VPS
##############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Banner
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Peter Sung - Coolify Deployment Assistant            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if Coolify CLI is installed
log_info "Checking for Coolify CLI..."
if ! command -v coolify &> /dev/null; then
    log_error "Coolify CLI not found. Installing..."
    npm install -g coolify
    log_success "Coolify CLI installed successfully"
else
    COOLIFY_VERSION=$(coolify --version)
    log_success "Coolify CLI found: $COOLIFY_VERSION"
fi

# Check for required environment files
log_info "Checking environment configuration..."
if [ ! -f ".env" ]; then
    log_warning ".env file not found. Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        log_info "Please edit .env file with your credentials"
    else
        log_error ".env.example not found"
    fi
fi

# List existing Coolify instances
log_info "Checking Coolify instances..."
INSTANCES=$(coolify instances list 2>&1)
if [[ "$INSTANCES" == *"don't have any"* ]]; then
    log_warning "No Coolify instances found"
    echo ""
    log_info "To add a Coolify instance, run:"
    echo "  coolify instances add"
    echo ""
    log_info "You will need:"
    echo "  - Coolify instance URL (e.g., https://your-vps-ip:3000)"
    echo "  - Coolify API token (from dashboard Settings > API)"
    echo ""
    read -p "Would you like to add an instance now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        coolify instances add
    else
        log_info "Skipping instance setup. You can add it later with: coolify instances add"
        exit 0
    fi
else
    log_success "Coolify instances configured"
    echo "$INSTANCES"
fi

# Check Git repository status
log_info "Checking Git repository..."
if [ -d ".git" ]; then
    BRANCH=$(git branch --show-current)
    log_success "Current branch: $BRANCH"

    # Check for uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        log_warning "You have uncommitted changes"
        git status --short
        echo ""
        read -p "Continue anyway? (y/n) " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Deployment cancelled"
            exit 0
        fi
    else
        log_success "Working directory is clean"
    fi
else
    log_error "Not a Git repository"
    exit 1
fi

# Deployment menu
echo ""
log_info "What would you like to deploy?"
echo "  1) Next.js Frontend only"
echo "  2) Strapi Backend only"
echo "  3) Both Frontend and Backend"
echo "  4) Check deployment status"
echo "  5) View application logs"
echo "  6) Restart applications"
echo "  7) Exit"
echo ""
read -p "Enter your choice [1-7]: " choice

case $choice in
    1)
        log_info "Deploying Next.js Frontend..."
        coolify deploy peter-sung-frontend
        log_success "Frontend deployment initiated"
        ;;
    2)
        log_info "Deploying Strapi Backend..."
        coolify deploy peter-sung-strapi
        log_success "Backend deployment initiated"
        ;;
    3)
        log_info "Deploying both Frontend and Backend..."
        coolify deploy peter-sung-frontend &
        PID1=$!
        coolify deploy peter-sung-strapi &
        PID2=$!
        wait $PID1
        wait $PID2
        log_success "Both deployments initiated"
        ;;
    4)
        log_info "Checking deployment status..."
        coolify status peter-sung-frontend
        coolify status peter-sung-strapi
        ;;
    5)
        log_info "Fetching logs..."
        echo ""
        echo "Select application:"
        echo "  1) Frontend"
        echo "  2) Backend"
        read -p "Choice: " log_choice
        if [ "$log_choice" = "1" ]; then
            coolify execute peter-sung-frontend -- docker logs -f --tail 100
        elif [ "$log_choice" = "2" ]; then
            coolify execute peter-sung-strapi -- docker logs -f --tail 100
        fi
        ;;
    6)
        log_info "Restarting applications..."
        echo ""
        echo "Select application:"
        echo "  1) Frontend"
        echo "  2) Backend"
        echo "  3) Both"
        read -p "Choice: " restart_choice
        if [ "$restart_choice" = "1" ]; then
            coolify restart peter-sung-frontend
        elif [ "$restart_choice" = "2" ]; then
            coolify restart peter-sung-strapi
        elif [ "$restart_choice" = "3" ]; then
            coolify restart peter-sung-frontend
            coolify restart peter-sung-strapi
        fi
        log_success "Restart initiated"
        ;;
    7)
        log_info "Exiting..."
        exit 0
        ;;
    *)
        log_error "Invalid choice"
        exit 1
        ;;
esac

echo ""
log_success "Operation completed!"
echo ""
log_info "Useful commands:"
echo "  - Check status: coolify status <app-name>"
echo "  - View logs: coolify execute <app-name> -- docker logs -f --tail 100"
echo "  - Restart: coolify restart <app-name>"
echo "  - Deploy: coolify deploy <app-name>"
echo ""
log_info "For more help, visit: https://coolify.io/docs"
