# Hostinger + Coolify Deployment Guide

**Setup for**: Hostinger VPS + Coolify Container Orchestration + PostgreSQL + Strapi + Next.js

---

## Part 1: Hostinger VPS Setup

### 1.1 Purchase Hostinger VPS

**Recommended Plan:**
- **Plan**: VPS 4GB or higher
- **Location**: Europe or USA (based on target customers)
- **OS**: Ubuntu 22.04 LTS
- **Cost**: €6-12/month

### 1.2 Initial VPS Connection

```bash
# SSH into your Hostinger VPS
ssh root@your-hostinger-vps-ip

# Update system packages
apt update && apt upgrade -y

# Install essential tools
apt install -y curl wget git nano htop ufw
```

### 1.3 Configure Firewall (UFW)

```bash
# Enable firewall
ufw enable

# Allow SSH (CRITICAL - do this first!)
ufw allow 22/tcp

# Allow HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Allow Coolify dashboard (temporary, restrict after setup)
ufw allow 3000/tcp

# Verify rules
ufw status
```

### 1.4 Set Hostname

```bash
# Set hostname to something meaningful
hostnamectl set-hostname coolify-prod

# Verify
hostname
```

---

## Part 2: Docker & Coolify Installation

### 2.1 Install Docker

```bash
# Download and run Docker installation script
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Add root to docker group (if needed)
usermod -aG docker root

# Verify Docker
docker --version
docker run hello-world
```

### 2.2 Install Docker Compose

```bash
# Download Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make executable
chmod +x /usr/local/bin/docker-compose

# Verify
docker-compose --version
```

### 2.3 Install Coolify

```bash
# Run Coolify installation (one command)
curl -fsSL https://get.coolify.io/install.sh | bash

# Start Coolify
docker ps  # Should see Coolify container running

# Access Coolify
# Open browser: https://your-hostinger-vps-ip:3000
```

### 2.4 First Login to Coolify Dashboard

```bash
# Get initial setup credentials (if needed)
docker logs coolify  # Check for any setup messages
```

**Browser:** `https://your-vps-ip:3000`

1. Create admin account
2. Set strong password
3. Configure SSH keys for GitHub

---

## Part 3: Hostinger Domain & DNS Configuration

### 3.1 Point Domain to Coolify VPS

**In Hostinger Control Panel:**

1. Go to **Domains** → Your Domain
2. Find **DNS Settings** or **Nameservers**
3. Create DNS Records:

```
Record Type: A
Name: @
Points to: [Your Hostinger VPS IP]
TTL: 3600

Record Type: CNAME
Name: www
Points to: @ (or your domain)
TTL: 3600

Record Type: A
Name: api
Points to: [Your Hostinger VPS IP]
TTL: 3600
```

### 3.2 Verify DNS Resolution

```bash
# From your VPS, check DNS resolves correctly
nslookup yourdomain.com
dig yourdomain.com

# Should return your VPS IP address
```

### 3.3 Wait for DNS Propagation

- DNS propagation: 15 minutes to 24 hours
- Check status: https://www.whatsmydns.net

---

## Part 4: Coolify Application Setup

### 4.1 Create GitHub Connection

**In Coolify Dashboard:**

1. **Settings** → **Repositories**
2. Click **Connect GitHub**
3. Authorize Coolify to access your repository
4. Select your fork of the project

### 4.2 Deploy Strapi Backend

**Create New Application:**

```
Name: peter-sung-strapi
Source: GitHub (your repository)
Branch: main
Root Directory: strapi
```

**Build Configuration:**

```yaml
Build Command: npm install && npm run build
Start Command: npm run start
Publish Port: 1337
Healthcheck URL: /admin/login
```

**Environment Variables (copy-paste):**

```env
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
APP_KEYS=your-32-char-random-string
API_TOKEN_SALT=your-32-char-random-string
ADMIN_JWT_SECRET=your-32-char-random-string
JWT_SECRET=your-32-char-random-string

DATABASE_CLIENT=postgres
DATABASE_HOST=postgres.coolify
DATABASE_PORT=5432
DATABASE_NAME=strapi_prod
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=your-strong-postgres-password
DATABASE_SSL=false

STRAPI_URL=https://api.yourdomain.com
STRAPI_CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

NODE_OPTIONS=--max-old-space-size=1024
```

### 4.3 Create PostgreSQL Database (via Coolify)

**In Coolify Dashboard:**

1. **Services** → **Add New**
2. Select **PostgreSQL**
3. Configure:

```
Image Tag: 16-alpine
Volume Size: 10GB
Database: strapi_prod
Username: strapi_user
Password: your-strong-postgres-password
```

**Link to Strapi Application:**

In Strapi app settings, link PostgreSQL service in "Services" section.

### 4.4 Deploy Next.js Frontend

**Create New Application:**

```
Name: peter-sung-frontend
Source: GitHub (your repository)
Branch: main
Root Directory: next
```

**Build Configuration:**

```yaml
Build Command: npm install --legacy-peer-deps && npm run build
Start Command: npm run start
Publish Port: 3000
Healthcheck URL: /
```

**Environment Variables:**

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-32-char-random-string
NODE_ENV=production

STRIPE_SECRET_KEY=sk_live_your-key
STRIPE_PUBLISHABLE_KEY=pk_live_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-secret

GOOGLE_GENERATIVE_AI_API_KEY=your-api-key
RESEND_API_KEY=your-api-key

SENTRY_DSN=your-sentry-dsn (optional)
```

---

## Part 5: SSL/TLS Certificates

### 5.1 Auto SSL with Let's Encrypt (via Coolify)

**Coolify automatically handles SSL:**

1. In Application settings, go to **Domains**
2. Add your domain: `yourdomain.com`
3. Add subdomain: `api.yourdomain.com`
4. Coolify automatically provisions Let's Encrypt certificates

**Verification:**

```bash
# Check certificate on VPS
curl -I https://yourdomain.com
# Should show: SSL certificate issued by Let's Encrypt

# Renew happens automatically (90-day cycle)
```

### 5.2 Force HTTPS Redirect

**Configure in Coolify Application:**

1. **Domains** tab
2. Enable: **Redirect to HTTPS**
3. Save

---

## Part 6: Database Setup & Backup

### 6.1 Initialize Strapi Database

```bash
# SSH into VPS
ssh root@your-hostinger-vps-ip

# Access PostgreSQL container
docker exec -it strapi-postgres psql -U strapi_user -d strapi_prod

# Run migrations (Strapi handles this on startup)
# Just verify connection works
```

### 6.2 Configure Automatic Backups

**Option A: Hostinger Backup (Recommended)**

- Hostinger VPS includes automatic daily backups
- Accessible via Control Panel → Backups
- Retains last 7-14 days

**Option B: Database Backup Script**

```bash
# Create backup script
cat > /opt/coolify/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/coolify/backups"
mkdir -p $BACKUP_DIR
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

docker exec strapi-postgres pg_dump -U strapi_user strapi_prod | \
  gzip > $BACKUP_DIR/strapi_backup_$TIMESTAMP.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "strapi_backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: $TIMESTAMP"
EOF

chmod +x /opt/coolify/backup-db.sh

# Schedule with cron (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /opt/coolify/backup-db.sh
```

### 6.3 Verify Backups

```bash
# List backups
ls -lh /opt/coolify/backups/

# Test restore (do NOT run in production without preparation)
# docker exec strapi-postgres pg_restore ...
```

---

## Part 7: Monitoring & Health Checks

### 7.1 Coolify Built-in Monitoring

**In Dashboard:**

1. **Applications** → Your App
2. View **Logs** tab (real-time)
3. View **Stats** tab (CPU, Memory, Disk)
4. View **Health** status

### 7.2 Manual Health Checks (SSH)

```bash
# Check all containers running
docker ps -a

# Check Strapi logs
docker logs -f strapi-app --tail 50

# Check Next.js logs
docker logs -f nextjs-app --tail 50

# Check PostgreSQL status
docker exec strapi-postgres pg_isready -U strapi_user

# Check system resources
df -h  # Disk usage
free -m  # Memory usage
top -b -n 1 | head -20  # CPU usage
```

### 7.3 Set Up Alerts (Optional)

**Via Hostinger Control Panel:**

1. Go to **Monitoring**
2. Set thresholds for:
   - CPU > 80%
   - RAM > 85%
   - Disk > 90%
3. Configure email notifications

---

## Part 8: Deployment Workflow

### 8.1 Deploy on Git Push

**Automatic Process:**

1. Push to `main` branch on GitHub
2. Coolify webhook triggers
3. Coolify pulls latest code
4. Runs build commands
5. Restarts containers
6. No downtime (blue-green deployment)

### 8.2 Manual Redeploy

**Via Coolify Dashboard:**

1. Go to Application
2. Click **Deploy** button
3. Wait for build to complete (~2-3 minutes)

### 8.3 Rollback

**If deployment fails:**

1. Click **Deployments** tab
2. Select previous successful version
3. Click **Redeploy**

---

## Part 9: Scaling & Optimization

### 9.1 CPU/Memory Limits

**In Coolify Application Settings:**

```
CPU Limit: 2 cores
Memory Limit: 1.5GB
```

Adjust based on actual usage from monitoring.

### 9.2 Database Optimization

```bash
# Connect to database
docker exec -it strapi-postgres psql -U strapi_user -d strapi_prod

# Create indexes on commonly queried fields
CREATE INDEX idx_user_email ON users_permission_user(email);
CREATE INDEX idx_customer_stripe ON customers(stripe_customer_id);

# Analyze query performance
EXPLAIN ANALYZE SELECT * FROM customers WHERE stripe_customer_id = '...';
```

### 9.3 Cache Configuration

**Enable Redis (if needed for scaling):**

1. In Coolify: **Services** → Add **Redis**
2. In Strapi `.env`:
   ```env
   CACHE_PROVIDER=redis
   REDIS_HOST=redis-service
   REDIS_PORT=6379
   ```

---

## Part 10: Security Hardening

### 10.1 SSH Key Configuration

```bash
# Generate SSH key on your local machine (if not already done)
ssh-keygen -t ed25519 -f ~/.ssh/hostinger_vps -C "your-email@example.com"

# Add public key to VPS
cat ~/.ssh/hostinger_vps.pub | ssh root@your-vps-ip "cat >> ~/.ssh/authorized_keys"

# Disable password authentication
ssh root@your-vps-ip
sudo nano /etc/ssh/sshd_config

# Change these lines:
# PermitRootLogin without-password
# PasswordAuthentication no
# PubkeyAuthentication yes

# Restart SSH
systemctl restart ssh
```

### 10.2 Firewall Security

```bash
# Current rules should be:
ufw status numbered

# If needed, restrict Coolify dashboard to your IP only
ufw delete allow 3000/tcp
ufw allow from YOUR_IP_HERE to any port 3000
```

### 10.3 Database Security

```bash
# Change default PostgreSQL password immediately
docker exec strapi-postgres psql -U strapi_user -d strapi_prod -c "ALTER USER strapi_user WITH PASSWORD 'new-super-strong-password';"

# Update in Coolify environment variables
```

### 10.4 API Security Headers (via Coolify Reverse Proxy)

Coolify automatically includes:
- ✅ HSTS (HTTP Strict Transport Security)
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: SAMEORIGIN
- ✅ X-XSS-Protection

---

## Part 11: Cost Analysis

### Hostinger + Coolify Monthly Costs

| Service | Cost | Notes |
|---------|------|-------|
| Hostinger VPS 4GB | €6-12 | ~$7-13/month |
| Domain (optional) | €0-12 | Usually free first year with Hostinger |
| SSL Certificate | €0 | Let's Encrypt (free) |
| **Total Monthly** | **€6-24** | **~$7-26/month** |

### Revenue with 5-10 Customers

```
Starter Plan (5 customers): 5 × €99 = €495
Professional Plan (3 customers): 3 × €199 = €597
Enterprise Plan (2 customers): 2 × €499 = €998

Total Monthly Revenue: €2,090
Less Infrastructure: €12
PROFIT: €2,078/month (99.4% margin!)
```

---

## Part 12: Troubleshooting

### Problem: Domain not resolving

```bash
# Check DNS resolution
nslookup yourdomain.com

# If not resolving:
1. Wait 24 hours for DNS propagation
2. Clear browser cache (Ctrl+Shift+Delete)
3. Verify DNS records in Hostinger panel
4. Use: https://www.whatsmydns.net to check globally
```

### Problem: SSL certificate not issued

```bash
# Check Coolify logs
docker logs coolify

# Check if domain is properly pointed to VPS
curl -I http://yourdomain.com

# Wait 5 minutes and retry in Coolify dashboard
```

### Problem: Application not starting

```bash
# Check container logs
docker logs -f strapi-app --tail 100
docker logs -f nextjs-app --tail 100

# Check if port is in use
netstat -tlnp | grep 3000
netstat -tlnp | grep 1337

# Restart application in Coolify dashboard
```

### Problem: Database connection fails

```bash
# Verify PostgreSQL is running
docker ps | grep postgres

# Check database credentials
docker exec strapi-postgres psql -U strapi_user -c "SELECT 1"

# Verify DATABASE_HOST in Strapi .env matches service name
```

### Problem: Out of disk space

```bash
# Check disk usage
df -h

# Clean Docker images/volumes
docker system prune -a
docker volume prune

# If still low, expand in Hostinger Control Panel
```

---

## Part 13: Monitoring Commands Cheat Sheet

```bash
# System Status
uname -a                    # OS info
uptime                      # Uptime
htop                        # Real-time monitoring

# Docker
docker ps                   # Running containers
docker logs -f container    # Follow logs
docker stats                # Real-time resource usage
docker inspect container    # Detailed container info

# Network
curl -I https://yourdomain.com    # Test HTTPS
curl -I https://api.yourdomain.com # Test API
nslookup yourdomain.com           # DNS resolution
netstat -tlnp               # Open ports

# Database
docker exec postgres psql -U strapi_user -d strapi_prod -c "SELECT 1"  # DB connection test
docker exec postgres pg_dump -U strapi_user strapi_prod | wc -l        # DB size

# Disk & Memory
df -h                       # Disk usage
free -m                     # Memory usage
du -sh /opt/coolify         # Coolify folder size

# Certificates
docker exec nginx certbot certificates    # List certificates (if using custom nginx)
# Or check in Coolify Dashboard → Domains
```

---

## Part 14: Quick Start Checklist

- [ ] Purchase Hostinger VPS (4GB+ recommended)
- [ ] SSH into VPS and run firewall setup
- [ ] Install Docker and Docker Compose
- [ ] Install Coolify
- [ ] Configure Hostinger DNS records
- [ ] Wait for DNS propagation (24h max)
- [ ] Connect GitHub to Coolify
- [ ] Deploy PostgreSQL database
- [ ] Deploy Strapi backend
- [ ] Deploy Next.js frontend
- [ ] Verify SSL certificates (should be auto)
- [ ] Set up automated backups
- [ ] Test end-to-end functionality
- [ ] Configure monitoring alerts
- [ ] Create runbook for team
- [ ] Celebrate! 🎉

---

## Part 15: Support & Resources

**Hostinger Support:**
- Email: support@hostinger.com
- Knowledge Base: hostinger.com/help
- Control Panel: hostinger.com/cp

**Coolify Documentation:**
- Docs: https://coolify.io/docs
- GitHub: https://github.com/coollabsio/coolify
- Discord Community: https://discord.gg/coolify

**Strapi Documentation:**
- Docs: https://docs.strapi.io
- Admin Panel: `/admin` on your API domain

**Next.js Documentation:**
- Docs: https://nextjs.org/docs

---

## Emergency Contact Information

**If your site goes down:**

1. Check Coolify Dashboard (red indicators)
2. View application logs
3. SSH into VPS and run health checks
4. Check Hostinger status page
5. Contact Hostinger support if infrastructure issue
6. Contact Coolify discord if deployment issue

**Keep backups safe** - You have daily Hostinger backups + manual backup script.

---

## Next Steps

1. ✅ Set up Hostinger VPS with Coolify
2. 🔄 Deploy Strapi + Next.js
3. 💳 Integrate Stripe for payments
4. 👥 Onboard first customer
5. 📊 Monitor usage and scale as needed

**You're now ready to launch a production SaaS platform!** 🚀
