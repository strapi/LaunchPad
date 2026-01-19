#!/bin/bash

# ============================================================
# PRODUCTION BUILD VERIFICATION SCRIPT
# ============================================================
# Tests that both Next.js and Strapi build correctly for production

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Production Build Verification${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

FAILED=0

# ============================================================
# CHECK 1: Next.js Build
# ============================================================
echo -e "${YELLOW}[CHECK 1]${NC} Testing Next.js Production Build...\n"

if [ -d "next/.next" ]; then
    echo -e "${YELLOW}Note:${NC} Removing previous build...\n"
    rm -rf next/.next
fi

cd next

echo "Installing dependencies..."
npm install --legacy-peer-deps --silent > /dev/null 2>&1

echo "Building Next.js..."
if npm run build > /tmp/nextjs-build.log 2>&1; then
    NEXT_BUILD_SIZE=$(du -sh .next | cut -f1)
    echo -e "${GREEN}✓${NC} Next.js build successful"
    echo -e "  Build size: ${NEXT_BUILD_SIZE}\n"
else
    echo -e "${RED}✗${NC} Next.js build failed"
    echo "Error log:"
    tail -50 /tmp/nextjs-build.log
    FAILED=$((FAILED + 1))
fi

cd ..

# ============================================================
# CHECK 2: Strapi Build
# ============================================================
echo -e "${YELLOW}[CHECK 2]${NC} Testing Strapi Production Build...\n"

cd strapi

echo "Installing dependencies..."
npm install --legacy-peer-deps --silent > /dev/null 2>&1

echo "Building Strapi..."
if npm run build > /tmp/strapi-build.log 2>&1; then
    STRAPI_BUILD_SIZE=$(du -sh dist | cut -f1 2>/dev/null || echo "calculated during runtime")
    echo -e "${GREEN}✓${NC} Strapi build successful\n"
else
    echo -e "${RED}✗${NC} Strapi build failed"
    echo "Error log:"
    tail -50 /tmp/strapi-build.log
    FAILED=$((FAILED + 1))
fi

cd ..

# ============================================================
# CHECK 3: Environment Variables
# ============================================================
echo -e "${YELLOW}[CHECK 3]${NC} Checking Environment Configuration...\n"

echo "Checking root .env.production..."
if [ -f ".env.production" ]; then
    REQUIRED_VARS=("DATABASE_PASSWORD" "APP_KEYS" "NEXTAUTH_SECRET" "STRAPI_CORS_ORIGIN")
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^${var}=" .env.production; then
            echo -e "${GREEN}✓${NC} ${var} configured"
        else
            echo -e "${RED}✗${NC} ${var} missing"
            FAILED=$((FAILED + 1))
        fi
    done
else
    echo -e "${RED}✗${NC} .env.production not found"
    FAILED=$((FAILED + 1))
fi
echo ""

echo "Checking next/.env.production..."
if [ -f "next/.env.production" ]; then
    REQUIRED_VARS=("NEXTAUTH_URL" "NEXT_PUBLIC_API_URL" "NEXTAUTH_SECRET")
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^${var}=" next/.env.production; then
            echo -e "${GREEN}✓${NC} ${var} configured"
        else
            echo -e "${RED}✗${NC} ${var} missing"
            FAILED=$((FAILED + 1))
        fi
    done
else
    echo -e "${RED}✗${NC} next/.env.production not found"
    FAILED=$((FAILED + 1))
fi
echo ""

echo "Checking strapi/.env.production..."
if [ -f "strapi/.env.production" ]; then
    REQUIRED_VARS=("DATABASE_CLIENT" "DATABASE_PASSWORD" "STRAPI_URL")
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^${var}=" strapi/.env.production; then
            echo -e "${GREEN}✓${NC} ${var} configured"
        else
            echo -e "${RED}✗${NC} ${var} missing"
            FAILED=$((FAILED + 1))
        fi
    done
else
    echo -e "${RED}✗${NC} strapi/.env.production not found"
    FAILED=$((FAILED + 1))
fi
echo ""

# ============================================================
# CHECK 4: Docker Configuration
# ============================================================
echo -e "${YELLOW}[CHECK 4]${NC} Verifying Docker Configuration...\n"

if [ -f "docker-compose.yml" ]; then
    echo -e "${GREEN}✓${NC} docker-compose.yml found"
else
    echo -e "${RED}✗${NC} docker-compose.yml not found"
    FAILED=$((FAILED + 1))
fi

if [ -f "next/Dockerfile" ]; then
    echo -e "${GREEN}✓${NC} next/Dockerfile found"
else
    echo -e "${YELLOW}⚠${NC}  next/Dockerfile not found (will use docker-compose)"
fi

if [ -f "strapi/Dockerfile" ]; then
    echo -e "${GREEN}✓${NC} strapi/Dockerfile found"
else
    echo -e "${YELLOW}⚠${NC}  strapi/Dockerfile not found (will use docker-compose)"
fi
echo ""

# ============================================================
# CHECK 5: Documentation
# ============================================================
echo -e "${YELLOW}[CHECK 5]${NC} Verifying Documentation...\n"

DOCS=("IMMEDIATE_NEXT_STEPS.md" "PRODUCTION_DEPLOYMENT_GUIDE.md" "PRODUCTION_READY_CHECKLIST.md")
for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo -e "${GREEN}✓${NC} $doc"
    else
        echo -e "${RED}✗${NC} $doc missing"
        FAILED=$((FAILED + 1))
    fi
done
echo ""

# ============================================================
# SUMMARY
# ============================================================
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ ALL CHECKS PASSED${NC}"
    echo -e "\nYour application is ready for production deployment."
    echo -e "Next: Follow IMMEDIATE_NEXT_STEPS.md\n"
    exit 0
else
    echo -e "${RED}✗ $FAILED CHECK(S) FAILED${NC}"
    echo -e "\nPlease fix the issues above before deploying.\n"
    exit 1
fi
