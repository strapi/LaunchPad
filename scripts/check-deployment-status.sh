#!/bin/bash

# ============================================================
# DEPLOYMENT STATUS CHECKER
# ============================================================
# Real-time monitoring of production deployment

VPS_IP="31.220.58.212"
VPS_USER="root"
DOMAIN="drpetersung.com"
API_DOMAIN="api.drpetersung.com"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Production Deployment Status${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

# ============================================================
# CHECK 1: DNS Resolution
# ============================================================
echo -e "${YELLOW}DNS Status:${NC}"
DOMAIN_IP=$(dig +short ${DOMAIN} @8.8.8.8 | tail -1)
API_IP=$(dig +short ${API_DOMAIN} @8.8.8.8 | tail -1)

if [ "$DOMAIN_IP" = "$VPS_IP" ]; then
    echo -e "  ${GREEN}✓${NC} ${DOMAIN} → ${DOMAIN_IP}"
else
    echo -e "  ${RED}✗${NC} ${DOMAIN} → ${DOMAIN_IP} (expected: ${VPS_IP})"
fi

if [ "$API_IP" = "$VPS_IP" ]; then
    echo -e "  ${GREEN}✓${NC} ${API_DOMAIN} → ${API_IP}\n"
else
    echo -e "  ${RED}✗${NC} ${API_DOMAIN} → ${API_IP} (expected: ${VPS_IP})\n"
fi

# ============================================================
# CHECK 2: VPS Connectivity
# ============================================================
echo -e "${YELLOW}VPS Connectivity:${NC}"
if ssh -o ConnectTimeout=5 ${VPS_USER}@${VPS_IP} "echo 'OK'" > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓${NC} SSH connection successful\n"
else
    echo -e "  ${RED}✗${NC} Cannot connect to VPS\n"
    exit 1
fi

# ============================================================
# CHECK 3: Docker Services
# ============================================================
echo -e "${YELLOW}Docker Services (on VPS):${NC}"

CONTAINERS=$(ssh ${VPS_USER}@${VPS_IP} "docker ps --format 'table {{.Names}}\t{{.Status}}' 2>/dev/null" || echo "")

if echo "$CONTAINERS" | grep -q "postgres-db"; then
    STATUS=$(echo "$CONTAINERS" | grep "postgres-db" | awk '{print $NF}')
    if [[ "$STATUS" == "Up"* ]]; then
        echo -e "  ${GREEN}✓${NC} PostgreSQL: Running"
    else
        echo -e "  ${RED}✗${NC} PostgreSQL: $STATUS"
    fi
else
    echo -e "  ${YELLOW}○${NC} PostgreSQL: Not deployed yet"
fi

if echo "$CONTAINERS" | grep -q "peter-sung-strapi"; then
    STATUS=$(echo "$CONTAINERS" | grep "peter-sung-strapi" | awk '{print $NF}')
    if [[ "$STATUS" == "Up"* ]]; then
        echo -e "  ${GREEN}✓${NC} Strapi: Running"
    else
        echo -e "  ${RED}✗${NC} Strapi: $STATUS"
    fi
else
    echo -e "  ${YELLOW}○${NC} Strapi: Not deployed yet"
fi

if echo "$CONTAINERS" | grep -q "peter-sung-frontend"; then
    STATUS=$(echo "$CONTAINERS" | grep "peter-sung-frontend" | awk '{print $NF}')
    if [[ "$STATUS" == "Up"* ]]; then
        echo -e "  ${GREEN}✓${NC} Next.js: Running\n"
    else
        echo -e "  ${RED}✗${NC} Next.js: $STATUS\n"
    fi
else
    echo -e "  ${YELLOW}○${NC} Next.js: Not deployed yet\n"
fi

# ============================================================
# CHECK 4: HTTP/HTTPS Status
# ============================================================
echo -e "${YELLOW}HTTPS Status:${NC}"

FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -m 5 "https://${DOMAIN}/" 2>/dev/null || echo "000")
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -m 5 "https://${API_DOMAIN}/admin/login" 2>/dev/null || echo "000")

if [ "$FRONTEND_STATUS" = "200" ]; then
    echo -e "  ${GREEN}✓${NC} Frontend (${DOMAIN}): HTTP 200"
else
    echo -e "  ${RED}✗${NC} Frontend: HTTP $FRONTEND_STATUS"
fi

if [ "$API_STATUS" = "200" ]; then
    echo -e "  ${GREEN}✓${NC} API (${API_DOMAIN}/admin): HTTP 200\n"
else
    echo -e "  ${RED}✗${NC} API: HTTP $API_STATUS\n"
fi

# ============================================================
# CHECK 5: Resource Usage
# ============================================================
echo -e "${YELLOW}VPS Resources:${NC}"

DISK=$(ssh ${VPS_USER}@${VPS_IP} "df -h / | tail -1" | awk '{print $5}')
MEMORY=$(ssh ${VPS_USER}@${VPS_IP} "free | grep Mem | awk '{printf \"%.0f%%\", ($3/$2)*100}'" 2>/dev/null)
CPU=$(ssh ${VPS_USER}@${VPS_IP} "top -bn1 | grep 'Cpu(s)' | sed 's/.*, *\\([0-9.]*\\)%* id.*/\\1/' | awk '{printf \"%.0f%%\", 100 - \\$1}'" 2>/dev/null)

echo -e "  Disk Usage: $DISK"
echo -e "  Memory: $MEMORY"
echo -e "  CPU: $CPU\n"

# ============================================================
# SUMMARY
# ============================================================
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

if [ "$DOMAIN_IP" = "$VPS_IP" ] && [ "$API_IP" = "$VPS_IP" ]; then
    echo -e "${GREEN}DNS is configured correctly${NC}"
else
    echo -e "${YELLOW}⚠ DNS not yet propagated - wait and retry${NC}"
fi

if [ "$FRONTEND_STATUS" = "200" ] && [ "$API_STATUS" = "200" ]; then
    echo -e "${GREEN}✓ Applications are live!${NC}\n"
    echo "Visit:"
    echo "  Frontend: https://${DOMAIN}"
    echo "  API: https://${API_DOMAIN}/admin"
else
    echo -e "${YELLOW}⚠ Applications still deploying${NC}\n"
    echo "Check deployment logs:"
    echo "  ssh root@${VPS_IP}"
    echo "  docker logs peter-sung-frontend"
    echo "  docker logs peter-sung-strapi"
fi

echo ""
