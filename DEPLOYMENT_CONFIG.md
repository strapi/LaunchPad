# Peter Sung - Deployment Configuration

## Project Overview
- **GitHub Repository**: https://github.com/executiveusa/peter-sung.git
- **Target Domain**: Dr. Peter Sung domain (via Hostinger)
- **Infrastructure**: Hostinger VPS + Coolify
- **Stack**: Next.js (Frontend) + Strapi (Backend) + PostgreSQL (Database)

## Hostinger API Configuration
- **API Token**: xxnQJtTY6EZGursOe9OtQz1lHbR412DefnEMFEBr35c02ae5
- **MCP Server**: Configured in `mcp-config.json`

## Coolify Configuration

### Instance Details
To be configured via Coolify CLI or API:
- **URL**: [To be provided by Hostinger VPS]
- **API Token**: [To be generated in Coolify dashboard]
- **SSH Access**: [To be configured]

### Application 1: Strapi Backend

**Repository Configuration:**
```yaml
Name: peter-sung-strapi
Source: https://github.com/executiveusa/peter-sung.git
Branch: main
Root Directory: /strapi
Build Command: npm install --legacy-peer-deps && npm run build
Start Command: npm run start
Port: 1337
Healthcheck: /admin/login
```

**Environment Variables:**
```env
# Node Environment
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=1024

# Database (PostgreSQL)
DATABASE_CLIENT=postgres
DATABASE_HOST=postgres.coolify
DATABASE_PORT=5432
DATABASE_NAME=strapi_prod
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=[TO_BE_GENERATED]
DATABASE_SSL=false

# Strapi Secrets (32-char random strings)
HOST=0.0.0.0
PORT=1337
APP_KEYS=[TO_BE_GENERATED]
API_TOKEN_SALT=[TO_BE_GENERATED]
ADMIN_JWT_SECRET=[TO_BE_GENERATED]
JWT_SECRET=[TO_BE_GENERATED]

# URLs
STRAPI_URL=https://api.drpetersung.com
STRAPI_ADMIN_BACKEND_URL=https://api.drpetersung.com

# CORS
STRAPI_CORS_ORIGIN=https://drpetersung.com,https://www.drpetersung.com
```

**Persistent Volumes:**
- `/app/public/uploads` - Media files storage
- `/app/.cache` - Build cache

### Application 2: Next.js Frontend

**Repository Configuration:**
```yaml
Name: peter-sung-frontend
Source: https://github.com/executiveusa/peter-sung.git
Branch: main
Root Directory: /next
Build Command: npm install --legacy-peer-deps && npm run build
Start Command: npm run start
Port: 3000
Healthcheck: /
```

**Environment Variables:**
```env
# Node Environment
NODE_ENV=production

# API Connection
NEXT_PUBLIC_API_URL=https://api.drpetersung.com

# NextAuth
NEXTAUTH_URL=https://drpetersung.com
NEXTAUTH_SECRET=[TO_BE_GENERATED]

# Stripe (Production)
STRIPE_SECRET_KEY=[TO_BE_PROVIDED]
STRIPE_PUBLISHABLE_KEY=[TO_BE_PROVIDED]
STRIPE_WEBHOOK_SECRET=[TO_BE_PROVIDED]

# AI & Services
GOOGLE_GENERATIVE_AI_API_KEY=[TO_BE_PROVIDED]
RESEND_API_KEY=[TO_BE_PROVIDED]

# Optional: Monitoring
SENTRY_DSN=[OPTIONAL]
```

### Database: PostgreSQL

**Service Configuration:**
```yaml
Name: postgres-db
Image: postgres:16-alpine
Volume: 20GB
Database: strapi_prod
Username: strapi_user
Password: [TO_BE_GENERATED]
Port: 5432 (internal)
```

**Backup Strategy:**
- Automatic daily backups via Coolify
- Retention: 30 days
- Manual backup script: See HOSTINGER_COOLIFY_SETUP.md

## Domain Configuration

### Primary Domain: drpetersung.com

**DNS Records (Hostinger DNS Panel):**
```
Type: A
Name: @
Value: [HOSTINGER_VPS_IP]
TTL: 3600

Type: A
Name: www
Value: [HOSTINGER_VPS_IP]
TTL: 3600

Type: A
Name: api
Value: [HOSTINGER_VPS_IP]
TTL: 3600

Type: CNAME
Name: www
Value: drpetersung.com
TTL: 3600
```

**SSL/TLS:**
- Provider: Let's Encrypt (via Coolify)
- Auto-renewal: Enabled
- Force HTTPS: Enabled

**Coolify Domain Mapping:**
```
drpetersung.com -> Next.js Frontend (Port 3000)
www.drpetersung.com -> Next.js Frontend (Port 3000)
api.drpetersung.com -> Strapi Backend (Port 1337)
```

## Deployment Workflow

### Automated Deployment (GitHub Webhooks)
1. Push code to `main` branch
2. Coolify webhook triggers
3. Pull latest code
4. Run build commands
5. Zero-downtime deployment
6. Health check verification

### Manual Deployment
```bash
# Via Coolify CLI
coolify deploy peter-sung-frontend
coolify deploy peter-sung-strapi

# Via Coolify Dashboard
# Navigate to Applications → Select App → Click "Deploy"
```

### Rollback Procedure
```bash
# Via Coolify Dashboard
1. Go to Deployments tab
2. Select previous successful deployment
3. Click "Redeploy"
```

## Monitoring & Health Checks

### Application Health
```bash
# Frontend
curl -I https://drpetersung.com
# Expected: 200 OK

# Backend API
curl -I https://api.drpetersung.com/admin/login
# Expected: 200 OK

# Database
docker exec postgres-db pg_isready -U strapi_user
# Expected: accepting connections
```

### Logs Access
```bash
# SSH to VPS
ssh root@[HOSTINGER_VPS_IP]

# View Frontend logs
docker logs -f peter-sung-frontend --tail 100

# View Backend logs
docker logs -f peter-sung-strapi --tail 100

# View PostgreSQL logs
docker logs -f postgres-db --tail 100
```

### Resource Monitoring
```bash
# System resources
htop

# Docker stats
docker stats

# Disk usage
df -h

# Memory usage
free -m
```

## Security Configuration

### Firewall Rules (UFW)
```bash
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 3000/tcp  # Coolify Dashboard (restrict to your IP)
ufw enable
```

### SSH Hardening
```bash
# Disable password authentication
# Enable key-based authentication only
# See HOSTINGER_COOLIFY_SETUP.md for detailed steps
```

### Environment Variables Security
- All secrets stored in Coolify encrypted environment variables
- Never commit secrets to Git
- Regular rotation of API keys and tokens

## Backup & Recovery

### Automated Backups
- **Database**: Daily at 2:00 AM UTC
- **Media Files**: Daily at 3:00 AM UTC
- **Retention**: 30 days
- **Location**: `/opt/coolify/backups/`

### Manual Backup
```bash
# Database backup
docker exec postgres-db pg_dump -U strapi_user strapi_prod | gzip > backup_$(date +%Y%m%d).sql.gz

# Media files backup
tar -czf uploads_$(date +%Y%m%d).tar.gz /opt/coolify/volumes/peter-sung-strapi/uploads
```

### Restore Procedure
```bash
# Database restore
gunzip < backup_20250118.sql.gz | docker exec -i postgres-db psql -U strapi_user strapi_prod

# Media files restore
tar -xzf uploads_20250118.tar.gz -C /opt/coolify/volumes/peter-sung-strapi/
```

## Scaling Strategy

### Current Resources (Initial Setup)
- VPS: 4GB RAM, 2 vCPU, 50GB SSD
- Cost: ~$12-15/month

### Scaling Triggers
- **CPU > 80%** for 5+ minutes
- **Memory > 85%** sustained
- **Disk > 90%**
- **Response time > 2 seconds**

### Scaling Options
1. **Vertical Scaling**: Upgrade VPS to 8GB RAM
2. **Horizontal Scaling**: Add load balancer + multiple instances
3. **Database Scaling**: Move to managed PostgreSQL

## Troubleshooting

### Common Issues

**Issue: Domain not resolving**
```bash
# Check DNS propagation
nslookup drpetersung.com
dig drpetersung.com

# Wait up to 24 hours for full propagation
# Clear browser cache
```

**Issue: SSL certificate not issued**
```bash
# Check Coolify logs
docker logs coolify

# Verify domain points to VPS
curl -I http://drpetersung.com

# Retry in Coolify dashboard after 5 minutes
```

**Issue: Application won't start**
```bash
# Check application logs
docker logs peter-sung-frontend --tail 200
docker logs peter-sung-strapi --tail 200

# Verify environment variables are set
# Check port conflicts: netstat -tlnp | grep 3000
```

**Issue: Database connection failed**
```bash
# Verify PostgreSQL is running
docker ps | grep postgres

# Test connection
docker exec postgres-db psql -U strapi_user -d strapi_prod -c "SELECT 1"

# Check DATABASE_HOST matches service name in Strapi config
```

## Cost Estimate

### Monthly Infrastructure Costs
```
Hostinger VPS (4GB):      $12/month
Domain (if not owned):    $12/month (first year usually free)
Email Service (Resend):   $20/month (estimated for 10k emails)
Backups Storage:          $5/month
SSL Certificate:          $0 (Let's Encrypt - free)
───────────────────────────────────
Total:                    ~$49/month
```

### Revenue Potential
```
With just 3 clients at $199/month each:
Revenue: $597/month
Profit: $548/month
Annual: $6,576/year

With 10 clients average $150/month:
Revenue: $1,500/month
Profit: $1,451/month
Annual: $17,412/year
```

## Next Steps

### Phase 1: VPS & Coolify Setup ✓
- [ ] Provision Hostinger VPS
- [ ] Install Docker & Docker Compose
- [ ] Install Coolify
- [ ] Configure firewall
- [ ] Set up SSH keys

### Phase 2: Coolify Configuration
- [ ] Add Coolify instance to CLI
- [ ] Connect GitHub repository
- [ ] Create PostgreSQL service
- [ ] Deploy Strapi backend
- [ ] Deploy Next.js frontend

### Phase 3: Domain & DNS
- [ ] Configure DNS records in Hostinger
- [ ] Wait for propagation (24h max)
- [ ] Add domains to Coolify
- [ ] Enable SSL certificates
- [ ] Verify HTTPS access

### Phase 4: Testing & Verification
- [ ] Test frontend: https://drpetersung.com
- [ ] Test API: https://api.drpetersung.com/admin
- [ ] Test database connections
- [ ] Verify webhooks for auto-deployment
- [ ] Run end-to-end tests

### Phase 5: Production Launch
- [ ] Add production environment variables
- [ ] Configure monitoring alerts
- [ ] Set up automated backups
- [ ] Create runbook documentation
- [ ] Onboard first client

## Support Resources

- **Hostinger Support**: support@hostinger.com
- **Hostinger Control Panel**: https://hostinger.com/cpanel
- **Coolify Docs**: https://coolify.io/docs
- **Coolify Discord**: https://discord.gg/coolify
- **GitHub Repo**: https://github.com/executiveusa/peter-sung

## Emergency Contacts

**If site goes down:**
1. Check Coolify dashboard for red indicators
2. SSH into VPS and check logs
3. Verify Hostinger VPS status
4. Contact Hostinger support if infrastructure issue
5. Check Discord/Docs for Coolify issues

---

**Last Updated**: 2025-01-18
**Configuration Version**: 1.0.0
**Status**: Ready for Deployment
