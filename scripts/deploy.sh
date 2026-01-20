#!/bin/bash

# ============================================================
# PRODUCTION DEPLOYMENT AUTOMATION SCRIPT
# ============================================================
# For: Peter Sung Full-Stack Application
# Target: Hostinger VPS + Coolify
# Generated: 2025-01-19

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
VPS_IP="31.220.58.212"
VPS_USER="root"
DOMAIN="drpetersung.com"
API_DOMAIN="api.drpetersung.com"
GITHUB_REPO="https://github.com/executiveusa/peter-sung.git"

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Peter Sung - Production Deployment Script${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

# ============================================================
# STEP 1: PRE-DEPLOYMENT CHECKS
# ============================================================
echo -e "${YELLOW}[STEP 1]${NC} Running pre-deployment checks...\n"

echo "Checking SSH access to VPS..."
if ssh -o ConnectTimeout=5 ${VPS_USER}@${VPS_IP} "echo 'SSH OK'" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} SSH access verified\n"
else
    echo -e "${RED}✗${NC} Cannot connect to VPS at ${VPS_IP}"
    echo "Please verify SSH access: ssh ${VPS_USER}@${VPS_IP}"
    exit 1
fi

echo "Checking Docker on VPS..."
if ssh ${VPS_USER}@${VPS_IP} "docker --version" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Docker is running\n"
else
    echo -e "${RED}✗${NC} Docker not found on VPS"
    exit 1
fi

echo "Checking Coolify on VPS..."
if ssh ${VPS_USER}@${VPS_IP} "docker ps | grep -i coolify" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Coolify is running\n"
else
    echo -e "${YELLOW}⚠${NC}  Coolify may not be running. Please start it manually.\n"
fi

# ============================================================
# STEP 2: VERIFY DNS
# ============================================================
echo -e "${YELLOW}[STEP 2]${NC} Checking DNS configuration...\n"

echo "Waiting for DNS propagation (this may take 15-30 minutes)..."
echo "Checking: ${DOMAIN} -> ${VPS_IP}"

RETRIES=0
MAX_RETRIES=6
DNS_READY=false

while [ $RETRIES -lt $MAX_RETRIES ]; do
    DNS_IP=$(dig +short ${DOMAIN} @8.8.8.8 | tail -1)

    if [ "$DNS_IP" = "$VPS_IP" ]; then
        echo -e "${GREEN}✓${NC} DNS propagated correctly"
        echo -e "  ${DOMAIN} -> ${DNS_IP}\n"
        DNS_READY=true
        break
    else
        RETRIES=$((RETRIES + 1))
        echo "  Attempt $RETRIES/$MAX_RETRIES: Current IP is $DNS_IP (waiting for $VPS_IP)"
        if [ $RETRIES -lt $MAX_RETRIES ]; then
            echo "  Waiting 30 seconds..."
            sleep 30
        fi
    fi
done

if [ "$DNS_READY" = false ]; then
    echo -e "${YELLOW}⚠${NC}  DNS not yet propagated"
    echo "Please ensure these DNS records are set in Hostinger:"
    echo "  @ -> $VPS_IP"
    echo "  www -> $VPS_IP"
    echo "  api -> $VPS_IP"
    echo ""
    read -p "Press ENTER when DNS records are configured and you've waited 15 minutes..."
fi

# ============================================================
# STEP 3: CREATE DEPLOYMENT CONFIGURATIONS
# ============================================================
echo -e "${YELLOW}[STEP 3]${NC} Creating deployment configurations...\n"

echo "Creating PostgreSQL configuration..."
cat > /tmp/postgres-deploy.json <<'EOF'
{
  "name": "postgres-db",
  "image": "postgres:16-alpine",
  "environment": {
    "POSTGRES_DB": "strapi_prod",
    "POSTGRES_USER": "strapi_user",
    "POSTGRES_PASSWORD": "MnTt2vrBG1nmU9BdrMMDuWfV5koAdvi8"
  },
  "ports": ["5432:5432"],
  "volumes": ["/data/postgres:/var/lib/postgresql/data"]
}
EOF
echo -e "${GREEN}✓${NC} PostgreSQL config ready\n"

# ============================================================
# STEP 4: DISPLAY NEXT STEPS
# ============================================================
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"
echo -e "${GREEN}PRE-DEPLOYMENT CHECKS COMPLETE${NC}\n"

echo "Next steps to deploy on Coolify Dashboard:"
echo ""
echo -e "${YELLOW}1. Access Coolify Dashboard:${NC}"
echo "   SSH: ssh -L 3000:localhost:3000 root@${VPS_IP}"
echo "   Then: http://localhost:3000"
echo ""
echo -e "${YELLOW}2. Create PostgreSQL Service:${NC}"
echo "   Name: postgres-db"
echo "   Database: strapi_prod"
echo "   Username: strapi_user"
echo "   Password: MnTt2vrBG1nmU9BdrMMDuWfV5koAdvi8"
echo ""
echo -e "${YELLOW}3. Deploy Strapi Application:${NC}"
echo "   Repository: ${GITHUB_REPO}"
echo "   Branch: main"
echo "   Base Directory: strapi"
echo "   Domain: ${API_DOMAIN}"
echo ""
echo -e "${YELLOW}4. Deploy Next.js Frontend:${NC}"
echo "   Repository: ${GITHUB_REPO}"
echo "   Branch: main"
echo "   Base Directory: next"
echo "   Domain: ${DOMAIN} & www.${DOMAIN}"
echo ""
echo "See IMMEDIATE_NEXT_STEPS.md for detailed instructions"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"
