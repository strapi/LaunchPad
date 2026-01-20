# Manual Deployment Steps - Peter Sung to Coolify

## Current Status
- ✅ VPS IP: `31.220.58.212`
- ✅ Coolify API Token: `2|4V5eHVRpa80wwHUIXK3Zm2tAsbV7300feWeY4CAj0be873d6`
- ⚠️ Coolify Dashboard: Port 3000 not publicly accessible (this is normal/secure)
- ✅ GitHub Repo: https://github.com/executiveusa/peter-sung

## Option 1: Use Coolify Web Dashboard (Recommended)

Since Coolify port 3000 is not publicly accessible, you'll need to either:
- Access it from your local network if the VPS is local
- Set up SSH tunnel: `ssh -L 3000:localhost:3000 root@31.220.58.212`
- Temporarily open the port (not recommended for production)

### Step-by-Step via Dashboard

#### 1. Access Coolify Dashboard
```bash
# Option A: SSH Tunnel (Secure)
ssh -L 3000:localhost:3000 root@31.220.58.212
# Then open: http://localhost:3000

# Option B: Direct access if on same network
# Open: http://31.220.58.212:3000
```

#### 2. Generate Secrets
On your local machine:
```bash
cd peter-sung
node generate-secrets.js
```

**Save the output!** You'll need these values.

#### 3. Create PostgreSQL Database

1. In Coolify Dashboard, click **"+ Add Resource"** or **"Services"**
2. Select **"PostgreSQL"**
3. Configure:
   ```
   Name: postgres-db
   Image: postgres:16-alpine
   Database Name: strapi_prod
   Username: strapi_user
   Password: [Use DATABASE_PASSWORD from generate-secrets.js]
   Port: 5432 (internal)
   Volume Size: 20GB
   ```
4. Click **"Save"** and **"Start"**
5. Wait for database to be ready (~30 seconds)

#### 4. Deploy Strapi Backend

1. Click **"+ Add Resource"** → **"Application"**
2. **Source Configuration**:
   ```
   Name: peter-sung-strapi
   Source: GitHub
   Repository: https://github.com/executiveusa/peter-sung
   Branch: main
   Base Directory: strapi
   ```

3. **Build Pack**: Select **"Node.js"** or **"Dockerfile"** (if Dockerfile exists)

4. **Build Configuration**:
   ```
   Install Command: npm install --legacy-peer-deps
   Build Command: npm run build
   Start Command: npm run start
   Port: 1337
   ```

5. **Health Check**:
   ```
   Path: /admin/login
   Port: 1337
   ```

6. **Environment Variables** (Add each one):

```env
# Node Environment
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=1024
HOST=0.0.0.0
PORT=1337

# Database Configuration
DATABASE_CLIENT=postgres
DATABASE_HOST=postgres-db
DATABASE_PORT=5432
DATABASE_NAME=strapi_prod
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=[YOUR_DB_PASSWORD_FROM_SECRETS]
DATABASE_SSL=false

# Strapi Security Keys (from generate-secrets.js)
APP_KEYS=[YOUR_APP_KEYS]
API_TOKEN_SALT=[YOUR_API_TOKEN_SALT]
ADMIN_JWT_SECRET=[YOUR_ADMIN_JWT_SECRET]
JWT_SECRET=[YOUR_JWT_SECRET]
TRANSFER_TOKEN_SALT=[YOUR_TRANSFER_TOKEN_SALT]

# URLs
STRAPI_URL=https://api.drpetersung.com
STRAPI_ADMIN_BACKEND_URL=https://api.drpetersung.com

# CORS
STRAPI_CORS_ORIGIN=https://drpetersung.com,https://www.drpetersung.com
```

7. **Domains** (in the Domains tab):
   - Add: `api.drpetersung.com`
   - Enable **"Force HTTPS"**
   - Enable **"Generate SSL Certificate"**

8. **Volumes** (in Storage tab):
   - Add volume: `/app/public/uploads` (for media files)
   - Add volume: `/app/.cache` (for cache)

9. Click **"Deploy"**

10. Monitor the build logs. First deployment takes 3-5 minutes.

#### 5. Deploy Next.js Frontend

1. Click **"+ Add Resource"** → **"Application"**
2. **Source Configuration**:
   ```
   Name: peter-sung-frontend
   Source: GitHub
   Repository: https://github.com/executiveusa/peter-sung
   Branch: main
   Base Directory: next
   ```

3. **Build Pack**: **"Node.js"**

4. **Build Configuration**:
   ```
   Install Command: npm install --legacy-peer-deps
   Build Command: npm run build
   Start Command: npm run start
   Port: 3000
   ```

5. **Health Check**:
   ```
   Path: /
   Port: 3000
   ```

6. **Environment Variables**:

```env
# Node Environment
NODE_ENV=production

# API Connection
NEXT_PUBLIC_API_URL=https://api.drpetersung.com

# NextAuth
NEXTAUTH_URL=https://drpetersung.com
NEXTAUTH_SECRET=[YOUR_NEXTAUTH_SECRET_FROM_SECRETS]

# Stripe (Add your real keys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI & Services (Add your real keys)
GOOGLE_GENERATIVE_AI_API_KEY=...
RESEND_API_KEY=...

# Optional: Monitoring
SENTRY_DSN=...
```

7. **Domains** (in the Domains tab):
   - Add: `drpetersung.com`
   - Add: `www.drpetersung.com`
   - Enable **"Force HTTPS"**
   - Enable **"Generate SSL Certificate"**

8. Click **"Deploy"**

9. Monitor the build logs. Takes 3-5 minutes.

#### 6. Configure DNS

In your **Hostinger DNS Control Panel** for `drpetersung.com`:

```
Type: A
Name: @
Value: 31.220.58.212
TTL: 3600

Type: A
Name: www
Value: 31.220.58.212
TTL: 3600

Type: A
Name: api
Value: 31.220.58.212
TTL: 3600
```

**DNS Propagation**: Takes 15 minutes to 24 hours. Check status at: https://www.whatsmydns.net

#### 7. Verify Deployment

After DNS propagates:

```bash
# Test frontend
curl -I https://drpetersung.com
# Expected: 200 OK

# Test API
curl -I https://api.drpetersung.com/admin/login
# Expected: 200 OK

# Test www redirect
curl -I https://www.drpetersung.com
# Expected: 200 OK or 301/302 redirect
```

#### 8. Access Strapi Admin

1. Open: https://api.drpetersung.com/admin
2. Create your first admin user
3. Set a strong password
4. Complete Strapi setup wizard

#### 9. Test Frontend

1. Open: https://drpetersung.com
2. Verify homepage loads
3. Test login functionality
4. Check if API connection works

---

## Option 2: API-Based Deployment (Advanced)

If you want to deploy via API/CLI from your local machine, you'll need to:

### 1. Set up SSH Tunnel

```bash
# Create SSH tunnel to access Coolify API
ssh -L 3000:localhost:3000 root@31.220.58.212
```

Keep this terminal open.

### 2. Configure Coolify CLI

With the tunnel active, in a new terminal:

```bash
# Add Coolify instance (interactive)
coolify instances add

# Enter:
# URL: http://localhost:3000
# Token: 2|4V5eHVRpa80wwHUIXK3Zm2tAsbV7300feWeY4CAj0be873d6
```

### 3. Deploy via CLI

```bash
# List applications
coolify applications list

# Deploy frontend
coolify deploy peter-sung-frontend

# Deploy backend
coolify deploy peter-sung-strapi
```

---

## Option 3: Direct API Calls (Most Advanced)

If Coolify API is accessible, you can use direct API calls:

### Create Application via API

```bash
curl -X POST "http://localhost:3000/api/v1/applications" \
  -H "Authorization: Bearer 2|4V5eHVRpa80wwHUIXK3Zm2tAsbV7300feWeY4CAj0be873d6" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "peter-sung-frontend",
    "repository": "https://github.com/executiveusa/peter-sung",
    "branch": "main",
    "buildpack": "nodejs",
    "port": 3000
  }'
```

---

## Troubleshooting

### Issue: Can't access Coolify Dashboard

**Solutions:**
1. Check if Coolify is running:
   ```bash
   ssh root@31.220.58.212
   docker ps | grep coolify
   ```

2. Check firewall:
   ```bash
   ssh root@31.220.58.212
   ufw status
   ```

3. Use SSH tunnel:
   ```bash
   ssh -L 3000:localhost:3000 root@31.220.58.212
   # Then access: http://localhost:3000
   ```

### Issue: Build fails

**Common causes:**
- Missing environment variables
- Wrong base directory
- Build command errors
- Out of memory

**Solution:**
- Check build logs in Coolify dashboard
- Verify environment variables are set
- Increase memory limit in application settings

### Issue: Database connection fails

**Solution:**
- Verify PostgreSQL service is running
- Check DATABASE_HOST matches service name: `postgres-db`
- Verify credentials match
- Test connection from Strapi container

### Issue: SSL Certificate not issued

**Solution:**
- Wait 5-10 minutes for Let's Encrypt validation
- Ensure DNS is properly configured
- Verify domain points to correct IP
- Check Coolify logs for errors

---

## Quick Reference

**VPS IP**: `31.220.58.212`
**Coolify Dashboard**: `http://31.220.58.212:3000` (or via SSH tunnel)
**Coolify API Token**: `2|4V5eHVRpa80wwHUIXK3Zm2tAsbV7300feWeY4CAj0be873d6`
**GitHub Repo**: https://github.com/executiveusa/peter-sung

**Domains to configure:**
- `drpetersung.com` → Next.js Frontend
- `www.drpetersung.com` → Next.js Frontend
- `api.drpetersung.com` → Strapi Backend

**Generated Secrets Script:**
```bash
cd peter-sung
node generate-secrets.js
```

---

## Next Steps

1. ✅ Generate secrets: `node generate-secrets.js`
2. ⏳ Access Coolify dashboard (via SSH tunnel if needed)
3. ⏳ Create PostgreSQL database
4. ⏳ Deploy Strapi backend
5. ⏳ Deploy Next.js frontend
6. ⏳ Configure DNS records
7. ⏳ Wait for DNS propagation
8. ⏳ Verify deployment
9. ⏳ Create Strapi admin user
10. ⏳ Test everything!

---

**Need Help?**
- Coolify Docs: https://coolify.io/docs
- Coolify Discord: https://discord.gg/coolify
- GitHub Issues: https://github.com/coollabsio/coolify/issues

Good luck with your deployment! 🚀
