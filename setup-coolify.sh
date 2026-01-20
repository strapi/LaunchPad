#!/bin/bash

# Peter Sung Platform - Coolify Setup Script
# This script automates the initial setup process

set -e

echo "🚀 Peter Sung Platform - Coolify Installation"
echo "=============================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
   echo -e "${RED}This script must be run as root${NC}"
   exit 1
fi

# 1. Update system
echo -e "\n${YELLOW}1. Updating system packages...${NC}"
apt-get update && apt-get upgrade -y

# 2. Install Docker
echo -e "\n${YELLOW}2. Installing Docker...${NC}"
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker root

# 3. Install Docker Compose
echo -e "\n${YELLOW}3. Installing Docker Compose...${NC}"
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 4. Install Coolify
echo -e "\n${YELLOW}4. Installing Coolify...${NC}"
curl -fsSL https://get.coolify.io/install.sh | bash

# 5. Create necessary directories
echo -e "\n${YELLOW}5. Creating data directories...${NC}"
mkdir -p /opt/coolify/{data,compose,ssh,certs}
chmod 700 /opt/coolify

# 6. Generate SSH keys for Coolify
echo -e "\n${YELLOW}6. Generating SSH keys...${NC}"
ssh-keygen -t ed25519 -f /opt/coolify/ssh/id_ed25519 -N "" -C "coolify@peter-sung"
chmod 600 /opt/coolify/ssh/id_ed25519
chmod 644 /opt/coolify/ssh/id_ed25519.pub

# 7. Create .env file for Coolify
echo -e "\n${YELLOW}7. Creating Coolify configuration...${NC}"
cat > /opt/coolify/.env << 'EOF'
# Coolify Configuration
COOLIFY_SECRET_KEY=$(openssl rand -base64 32)
COOLIFY_DATABASE_URL=postgresql://coolify:coolifypass@coolify-postgres:5432/coolify
COOLIFY_DATABASE_USERNAME=coolify
COOLIFY_DATABASE_PASSWORD=coolifypass

# Email settings (optional)
COOLIFY_EMAIL_FROM=notifications@peter-sung.com
COOLIFY_EMAIL_HOST=smtp.resend.com
COOLIFY_EMAIL_PORT=465
COOLIFY_EMAIL_USERNAME=resend
COOLIFY_EMAIL_PASSWORD=your-resend-api-key

# Docker Socket
DOCKER_HOST=unix:///var/run/docker.sock
EOF

echo -e "\n${GREEN}✓ Coolify installation script completed!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Access Coolify dashboard: https://$(hostname -I | awk '{print $1}'):3000"
echo "2. Create admin account"
echo "3. Connect GitHub repository"
echo "4. Configure Strapi deployment in strapi/ directory"
echo "5. Configure Next.js deployment in next/ directory"
echo ""
echo "For detailed setup, see COOLIFY_HOSTING_BILLING.md"
