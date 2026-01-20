# 🚀 PRODUCTION DEPLOYMENT GUIDE - PETER SUNG

**Status:** Ready for Production Deployment
**Date:** 2025-01-19
**Domain:** drpetersung.com
**Infrastructure:** Hostinger VPS + Coolify

---

## ⚡ QUICK START (TL;DR)

**Everything is built and ready.** Follow these 5 main steps:

1. **Configure DNS** (Hostinger Control Panel) - 15 min
2. **Deploy PostgreSQL** (Coolify) - 5 min
3. **Deploy Strapi** (Coolify) - 5 min
4. **Deploy Next.js** (Coolify) - 5 min
5. **Add API Keys** (Stripe, Resend, Google AI) - 10 min

**Total time to live: 45-60 minutes**

---

## 📋 PRE-DEPLOYMENT CHECKLIST

- [ ] **VPS provisioned:** 31.220.58.212
- [ ] **Docker installed** on VPS
- [ ] **Coolify dashboard access:** http://31.220.58.212:3000
- [ ] **Coolify Token saved:** `2|4V5eHVRpa80wwHUIXK3Zm2tAsbV7300feWeY4CAj0be873d6`
- [ ] **GitHub repo access:** https://github.com/executiveusa/peter-sung
- [ ] **Hostinger DNS control panel access**
- [ ] **All secrets generated** ✅ (Done - see below)
- [ ] **API keys obtained** (Stripe, Resend, Google AI)

---

## 🔐 GENERATED SECRETS

**⚠️ IMPORTANT:** These are unique and should be used for production. Store securely!

### Strapi Backend Secrets
```
APP_KEYS=SiFCixgUD_2ItnAY6v-OOLCZL4c--r_f,nOFR6rxOS73wpULoev7KMxtQM0f_IJ5y,Zn60S2rQI5p1ZSBqyk5ppu-RyZkFqU74,hbFv4Q18uPoGDl3T-JcbqJh5GpwfhLcS
API_TOKEN_SALT=hYJw_pit-dpPVW3K6A2XenDptUIx9XDT
ADMIN_JWT_SECRET=rfc4zKJ-gzPy69rdYkZeySfhJ6BbVEIM
JWT_SECRET=zaBHuymJ6kNkzjY08_rKYehHYdlilAQf
TRANSFER_TOKEN_SALT=47T2ef1DAkxouiwtLUdFHIf7eWU-6pND
```

### NextAuth Secret
```
NEXTAUTH_SECRET=O8q6AWhN1GHjps8MKx48UAQIj10Gxmvi
```

### Database Password
```
DATABASE_PASSWORD=MnTt2vrBG1nmU9BdrMMDuWfV5koAdvi8
```

---

## STEP 1: CONFIGURE DNS RECORDS (Hostinger)

**Time: 15 minutes**

1. Log into **Hostinger Control Panel**
2. Go to **Domains** → **DNS Records**
3. Add these **A Records** (keep existing records):

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

4. **Save all records**
5. **Wait 5-15 minutes** for DNS propagation (check with: `nslookup drpetersung.com`)

✅ **DNS propagation check:**
```bash
# Should return 31.220.58.212
nslookup drpetersung.com
dig drpetersung.com
```

---

## STEP 2: ACCESS COOLIFY DASHBOARD

**Time: 5 minutes**

### Option A: SSH Tunnel (Secure - Recommended)
```bash
# On your local machine
ssh -L 3000:localhost:3000 root@31.220.58.212

# Then open in browser
http://localhost:3000
```

### Option B: Direct Access (if on Hostinger network)
```
http://31.220.58.212:3000
```

**Login:**
- Token: `2|4V5eHVRpa80wwHUIXK3Zm2tAsbV7300feWeY4CAj0be873d6`

---

## STEP 3: DEPLOY POSTGRESQL DATABASE

**Time: 5 minutes**

### In Coolify Dashboard:

1. Click **"+ Add"** → **"Services"** → **"PostgreSQL"**

2. **Configure:**
   - **Name:** `postgres-db`
   - **Image:** `postgres:16-alpine`
   - **Database Name:** `strapi_prod`
   - **Username:** `strapi_user`
   - **Password:** `MnTt2vrBG1nmU9BdrMMDuWfV5koAdvi8`
   - **Port:** `5432`
   - **Volume:** `20GB` (for data)

3. Click **"Save"** then **"Start"**

4. **Wait** until status shows "Running" (green checkmark)

✅ **Verify database:**
```bash
# SSH into VPS
ssh root@31.220.58.212

# Test connection
docker exec postgres-db pg_isready -U strapi_user
# Expected: accepting connections
```

---

## STEP 4: DEPLOY STRAPI BACKEND

**Time: 5 minutes**

### In Coolify Dashboard:

1. Click **"+ Add"** → **"Application"**

2. **Repository Source:**
   - Name: `peter-sung-strapi`
   - Repository: `https://github.com/executiveusa/peter-sung`
   - Branch: `main`
   - Base Directory: `strapi`
   - Build Pack: `Dockerfile` or `Node.js`

3. **Build Configuration:**
   - Build Command: `npm install --legacy-peer-deps && npm run build`
   - Start Command: `npm run start`
   - Port: `1337`

4. **Health Check:**
   - Enabled: `true`
   - Path: `/admin/login`
   - Port: `1337`

5. **Environment Variables** - Add all of these:

```env
# Node
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=1024

# Secrets
APP_KEYS=SiFCixgUD_2ItnAY6v-OOLCZL4c--r_f,nOFR6rxOS73wpULoev7KMxtQM0f_IJ5y,Zn60S2rQI5p1ZSBqyk5ppu-RyZkFqU74,hbFv4Q18uPoGDl3T-JcbqJh5GpwfhLcS
API_TOKEN_SALT=hYJw_pit-dpPVW3K6A2XenDptUIx9XDT
ADMIN_JWT_SECRET=rfc4zKJ-gzPy69rdYkZeySfhJ6BbVEIM
JWT_SECRET=zaBHuymJ6kNkzjY08_rKYehHYdlilAQf
TRANSFER_TOKEN_SALT=47T2ef1DAkxouiwtLUdFHIf7eWU-6pND

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=postgres-db
DATABASE_PORT=5432
DATABASE_NAME=strapi_prod
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=MnTt2vrBG1nmU9BdrMMDuWfV5koAdvi8
DATABASE_SSL=false

# Server
HOST=0.0.0.0
PORT=1337

# URLs & CORS
STRAPI_URL=https://api.drpetersung.com
STRAPI_ADMIN_BACKEND_URL=https://api.drpetersung.com
STRAPI_CORS_ORIGIN=https://drpetersung.com,https://www.drpetersung.com
```

6. **Volumes:**
   - Add: `/app/public/uploads` (for media storage)
   - Add: `/app/.cache` (for build cache)

7. **Domains:**
   - Add: `api.drpetersung.com`
   - Enable SSL: `true`

8. Click **"Deploy"**

⏳ **Wait 3-5 minutes** for deployment

✅ **Verify Strapi:**
```bash
# Should return 200 OK
curl -I https://api.drpetersung.com/admin/login
```

### Create Strapi Admin User

1. Open: `https://api.drpetersung.com/admin`
2. Click **"Create your first admin user"**
3. Enter:
   - Email: (your email)
   - Password: (strong password)
   - Confirm password
4. Click **"Let's start"**
5. Complete the welcome wizard

---

## STEP 5: DEPLOY NEXT.JS FRONTEND

**Time: 5 minutes**

### In Coolify Dashboard:

1. Click **"+ Add"** → **"Application"**

2. **Repository Source:**
   - Name: `peter-sung-frontend`
   - Repository: `https://github.com/executiveusa/peter-sung`
   - Branch: `main`
   - Base Directory: `next`
   - Build Pack: `Node.js` or `Dockerfile`

3. **Build Configuration:**
   - Install: `npm install --legacy-peer-deps`
   - Build Command: `npm run build`
   - Start Command: `npm run start`
   - Port: `3000`

4. **Health Check:**
   - Enabled: `true`
   - Path: `/`
   - Port: `3000`

5. **Environment Variables** - Add all of these:

```env
# Node
NODE_ENV=production

# API
NEXT_PUBLIC_API_URL=https://api.drpetersung.com

# NextAuth
NEXTAUTH_URL=https://drpetersung.com
NEXTAUTH_SECRET=O8q6AWhN1GHjps8MKx48UAQIj10Gxmvi

# Stripe (⚠️ Add your actual keys)
STRIPE_SECRET_KEY=sk_live_xxxxx_REPLACE_WITH_ACTUAL_KEY
STRIPE_WEBHOOK_SECRET=whsec_xxxxx_REPLACE_WITH_ACTUAL_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx_REPLACE_WITH_ACTUAL_KEY

# Email (⚠️ Add your actual key)
RESEND_API_KEY=re_xxxxx_REPLACE_WITH_ACTUAL_KEY

# AI (⚠️ Add your actual key)
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyxxxxx_REPLACE_WITH_ACTUAL_KEY
```

6. **Domains:**
   - Add: `drpetersung.com`
   - Add: `www.drpetersung.com`
   - Enable SSL: `true`

7. **Auto-Redirect www:**
   - Enable www redirect to main domain

8. Click **"Deploy"**

⏳ **Wait 3-5 minutes** for deployment

✅ **Verify Next.js:**
```bash
# Should return 200 OK
curl -I https://drpetersung.com
curl -I https://www.drpetersung.com
```

---

## 🔑 STEP 6: ADD PRODUCTION API KEYS

**Time: 10 minutes**

### Stripe Payment Processing

1. Go to: https://dashboard.stripe.com/apikeys
2. Copy your **Live** keys (not test keys)
3. In Coolify, update `peter-sung-frontend` environment:
   ```
   STRIPE_SECRET_KEY=sk_live_xxxxx...
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx...
   ```
4. Redeploy

### Resend Email Service

1. Go to: https://resend.com/dashboard
2. Copy your **API Key**
3. In Coolify, update `peter-sung-frontend` environment:
   ```
   RESEND_API_KEY=re_xxxxx...
   ```
4. Redeploy

### Google Generative AI

1. Go to: https://console.cloud.google.com
2. Create a new project (if needed)
3. Enable **Generative Language API**
4. Create an API key
5. In Coolify, update `peter-sung-frontend` environment:
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyxxxxx...
   ```
6. Redeploy

---

## ✅ VERIFICATION & TESTING

### Test All URLs

```bash
# Frontend
curl -I https://drpetersung.com
curl -I https://www.drpetersung.com

# API
curl -I https://api.drpetersung.com/admin/login

# API health check
curl https://api.drpetersung.com/admin/login -s | head -20
```

### Test Features

- [ ] Homepage loads
- [ ] Navigation works
- [ ] Login page accessible
- [ ] Strapi admin panel: https://api.drpetersung.com/admin
- [ ] Can create Strapi user
- [ ] Dashboard auth works
- [ ] Book pre-order page displays
- [ ] Images load properly

### Test Integrations

- [ ] Stripe button appears on checkout
- [ ] Email sending works (test with contact form)
- [ ] API responds with content

---

## 🔄 AUTOMATED BACKUPS & MONITORING

### Enable Automatic Backups

In Coolify Dashboard:

1. PostgreSQL Service → **Backups**
   - Enable: `true`
   - Frequency: `Daily at 2:00 AM UTC`
   - Retention: `30 days`

2. Strapi Application → **Persistent Volumes**
   - Ensure `/app/public/uploads` is backed up
   - Coolify automatically backs up volumes

### Monitor Resources

1. Click each application
2. Monitor:
   - CPU usage (should be < 50%)
   - Memory (should be < 60%)
   - Disk space (should be > 20% free)
   - Response time (should be < 500ms)

---

## 🚨 TROUBLESHOOTING

### DNS Not Resolving
```bash
# Wait 15-30 minutes and try:
nslookup drpetersung.com

# If still not working, check Hostinger DNS records
# Verify IP: 31.220.58.212
```

### Application Won't Start
```bash
# SSH to VPS
ssh root@31.220.58.212

# Check logs
docker logs peter-sung-strapi --tail 100
docker logs peter-sung-frontend --tail 100

# Check database connection
docker exec postgres-db pg_isready -U strapi_user
```

### SSL Certificate Not Issued
- DNS must be propagated and pointing to VPS
- Coolify auto-generates with Let's Encrypt
- Wait 5-10 minutes after DNS setup
- Check Coolify logs if still failing

### Database Connection Error
- Verify `DATABASE_HOST=postgres-db` (not an IP)
- Verify database credentials match
- Check PostgreSQL service is running

---

## 📊 DEPLOYMENT CHECKLIST

- [ ] **DNS Configured** (Step 1)
- [ ] **PostgreSQL Running** (Step 3)
- [ ] **Strapi Deployed** (Step 4)
- [ ] **Strapi Admin User Created** (Step 4.7)
- [ ] **Next.js Deployed** (Step 5)
- [ ] **API Keys Added** (Step 6)
  - [ ] Stripe
  - [ ] Resend
  - [ ] Google AI
- [ ] **All URLs Verified** (Verification)
- [ ] **Features Tested** (Verification)
- [ ] **Backups Enabled** (Backups)

---

## 🎯 POST-DEPLOYMENT

### Day 1
- Monitor Coolify dashboard for errors
- Test all user flows
- Check error logs

### Week 1
- Monitor performance metrics
- Verify backups are running
- Test customer transactions
- Set up monitoring alerts

### Month 1
- Review analytics
- Optimize database queries if needed
- Document any issues
- Plan scaling if needed

---

## 📞 SUPPORT

**If issues arise:**

1. Check Coolify dashboard → Logs tab
2. SSH into VPS: `ssh root@31.220.58.212`
3. Run: `docker ps` (see all containers)
4. Check specific logs: `docker logs [container-name]`

**Useful Commands:**

```bash
# SSH to VPS
ssh root@31.220.58.212

# View all containers
docker ps -a

# View container logs
docker logs -f peter-sung-frontend --tail 100

# Check disk space
df -h

# Check memory usage
free -m

# Test database
docker exec postgres-db psql -U strapi_user -d strapi_prod -c "SELECT 1"
```

---

**Status: ✅ READY FOR PRODUCTION DEPLOYMENT**

**Next Action: Follow Steps 1-6 above**
