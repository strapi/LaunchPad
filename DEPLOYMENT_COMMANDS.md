# 🎯 EXACT DEPLOYMENT COMMANDS

**Copy and paste these exactly. No modifications needed.**

---

## PHASE 1: DNS CONFIGURATION

**Where:** Hostinger Control Panel → Your Domain → DNS Records

**Add these 3 A records:**

```
RECORD 1:
Type: A
Name: @ (or leave empty for root)
Value: 31.220.58.212
TTL: 3600

RECORD 2:
Type: A
Name: www
Value: 31.220.58.212
TTL: 3600

RECORD 3:
Type: A
Name: api
Value: 31.220.58.212
TTL: 3600
```

**Save** then **wait 5-15 minutes** for propagation.

**Verify DNS in terminal:**
```bash
nslookup drpetersung.com
# Should show: 31.220.58.212

dig drpetersung.com
# Should show: 31.220.58.212
```

---

## PHASE 2: ACCESS COOLIFY DASHBOARD

**Option A: Secure SSH Tunnel (Recommended)**
```bash
ssh -L 3000:localhost:3000 root@31.220.58.212
```
Then open: `http://localhost:3000`

**Option B: Direct**
```
http://31.220.58.212:3000
```

**Login:**
- Token: `2|4V5eHVRpa80wwHUIXK3Zm2tAsbV7300feWeY4CAj0be873d6`

---

## PHASE 3: DEPLOY POSTGRESQL

**In Coolify Dashboard:**

1. Click **"+ Add"** → **"Services"** → **"PostgreSQL"**
2. Fill exactly:
```
Name: postgres-db
Image: postgres:16-alpine
Database Name: strapi_prod
Username: strapi_user
Password: MnTt2vrBG1nmU9BdrMMDuWfV5koAdvi8
Port: 5432
Volume Size: 20 GB
```
3. **Save** then **Start**
4. Wait for green checkmark (≈30 seconds)

---

## PHASE 4: DEPLOY STRAPI BACKEND

**In Coolify Dashboard:**

1. Click **"+ Add"** → **"Application"**

### Source Configuration
```
Name: peter-sung-strapi
Repository: https://github.com/executiveusa/peter-sung
Branch: main
Base Directory: strapi
Build Pack: Dockerfile (or Node.js)
```

### Build Configuration
```
Install Command: npm install --legacy-peer-deps
Build Command: npm run build
Start Command: npm run start
Port: 1337
```

### Health Check
```
Enable: YES
Path: /admin/login
Port: 1337
Interval: 30s
Timeout: 5s
```

### Environment Variables
**Copy and paste all of these:**

```
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=1024
HOST=0.0.0.0
PORT=1337
DATABASE_CLIENT=postgres
DATABASE_HOST=postgres-db
DATABASE_PORT=5432
DATABASE_NAME=strapi_prod
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=MnTt2vrBG1nmU9BdrMMDuWfV5koAdvi8
APP_KEYS=SiFCixgUD_2ItnAY6v-OOLCZL4c--r_f,nOFR6rxOS73wpULoev7KMxtQM0f_IJ5y,Zn60S2rQI5p1ZSBqyk5ppu-RyZkFqU74,hbFv4Q18uPoGDl3T-JcbqJh5GpwfhLcS
API_TOKEN_SALT=hYJw_pit-dpPVW3K6A2XenDptUIx9XDT
ADMIN_JWT_SECRET=rfc4zKJ-gzPy69rdYkZeySfhJ6BbVEIM
JWT_SECRET=zaBHuymJ6kNkzjY08_rKYehHYdlilAQf
TRANSFER_TOKEN_SALT=47T2ef1DAkxouiwtLUdFHIf7eWU-6pND
STRAPI_URL=https://api.drpetersung.com
STRAPI_ADMIN_BACKEND_URL=https://api.drpetersung.com
STRAPI_CORS_ORIGIN=https://drpetersung.com,https://www.drpetersung.com
```

### Volumes
```
/app/public/uploads
/app/.cache
```

### Domain
```
Domain: api.drpetersung.com
SSL: Enable (Let's Encrypt)
```

4. **Save** and **Deploy**
5. ⏳ Wait 3-5 minutes

---

## PHASE 5: CREATE STRAPI ADMIN USER

**In browser:**

1. Go to: `https://api.drpetersung.com/admin`
2. Click **"Create your first admin user"**
3. Enter your details:
   - Email: (your email)
   - Password: (strong password)
4. Click **"Let's start"**

---

## PHASE 6: DEPLOY NEXT.JS FRONTEND

**In Coolify Dashboard:**

1. Click **"+ Add"** → **"Application"**

### Source Configuration
```
Name: peter-sung-frontend
Repository: https://github.com/executiveusa/peter-sung
Branch: main
Base Directory: next
Build Pack: Dockerfile (or Node.js)
```

### Build Configuration
```
Install Command: npm install --legacy-peer-deps
Build Command: npm run build
Start Command: npm run start
Port: 3000
```

### Health Check
```
Enable: YES
Path: /
Port: 3000
Interval: 30s
Timeout: 5s
```

### Environment Variables
**Copy and paste all of these:**

```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.drpetersung.com
NEXTAUTH_URL=https://drpetersung.com
NEXTAUTH_SECRET=O8q6AWhN1GHjps8MKx48UAQIj10Gxmvi
STRIPE_SECRET_KEY=sk_test_PLACEHOLDER
STRIPE_WEBHOOK_SECRET=whsec_test_PLACEHOLDER
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_PLACEHOLDER
RESEND_API_KEY=re_test_PLACEHOLDER
GOOGLE_GENERATIVE_AI_API_KEY=test_PLACEHOLDER
```

### Domains
```
Domain 1: drpetersung.com
SSL: Enable (Let's Encrypt)

Domain 2: www.drpetersung.com
SSL: Enable (Let's Encrypt)

Enable www redirect: YES
```

2. **Save** and **Deploy**
3. ⏳ Wait 3-5 minutes

---

## PHASE 7: ADD REAL API KEYS

### 7.1 Get Stripe Live Keys

**Go to:** https://dashboard.stripe.com/apikeys

**Copy:**
- Secret Key: `sk_live_...`
- Publishable Key: `pk_live_...`
- Webhook Secret: `whsec_...`

**In Coolify:**
1. Go to `peter-sung-frontend` → Environment
2. Update:
   ```
   STRIPE_SECRET_KEY=sk_live_[your_actual_key]
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_[your_actual_key]
   STRIPE_WEBHOOK_SECRET=whsec_[your_actual_key]
   ```
3. Click **"Save"** then **"Redeploy"**

---

### 7.2 Get Resend Email Key

**Go to:** https://resend.com/dashboard

**Copy:** API Key: `re_...`

**In Coolify:**
1. Go to `peter-sung-frontend` → Environment
2. Update:
   ```
   RESEND_API_KEY=re_[your_actual_key]
   ```
3. Click **"Save"** then **"Redeploy"**

---

### 7.3 Get Google Generative AI Key

**Go to:** https://console.cloud.google.com

**Steps:**
1. Create or select a project
2. Search for "Generative Language API"
3. Enable it
4. Go to "Credentials"
5. Create "API Key"
6. Copy the key: `AIzaSy...`

**In Coolify:**
1. Go to `peter-sung-frontend` → Environment
2. Update:
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy[your_actual_key]
   ```
3. Click **"Save"** then **"Redeploy"**

---

## PHASE 8: VERIFY EVERYTHING

### Test in Browser

```
https://drpetersung.com          (Frontend)
https://www.drpetersung.com       (Frontend redirect)
https://api.drpetersung.com/admin (Strapi Admin)
```

### Test in Terminal

```bash
# Frontend
curl -I https://drpetersung.com
# Expected: HTTP 200

# API
curl -I https://api.drpetersung.com/admin/login
# Expected: HTTP 200
```

### SSH Commands for Debugging

```bash
# Connect to VPS
ssh root@31.220.58.212

# See all containers
docker ps

# View frontend logs (last 50 lines)
docker logs -f peter-sung-frontend --tail 50

# View Strapi logs
docker logs -f peter-sung-strapi --tail 50

# View database logs
docker logs -f postgres-db --tail 50

# Test database connection
docker exec postgres-db pg_isready -U strapi_user
```

---

## ✅ SUCCESS CHECKLIST

- [ ] DNS shows 31.220.58.212
- [ ] PostgreSQL running (green in Coolify)
- [ ] Strapi deployed (green in Coolify)
- [ ] Strapi admin user created
- [ ] Next.js deployed (green in Coolify)
- [ ] https://drpetersung.com loads
- [ ] https://api.drpetersung.com/admin accessible
- [ ] Stripe keys added
- [ ] Resend key added
- [ ] Google AI key added
- [ ] All redeployed
- [ ] **LIVE! 🎉**

---

## 🆘 QUICK TROUBLESHOOTING

### DNS Not Propagating

```bash
# Check multiple times
nslookup drpetersung.com
dig drpetersung.com +short

# If still showing old IP:
# Wait 15-30 minutes, DNS takes time
```

### Strapi Won't Deploy

```bash
# SSH to VPS
ssh root@31.220.58.212

# Check logs
docker logs peter-sung-strapi --tail 100

# Common issue: Database not ready
# Wait 2 minutes for postgres-db to fully start
```

### Next.js Won't Deploy

```bash
# Check logs
docker logs peter-sung-frontend --tail 100

# Common issues:
# 1. NEXT_PUBLIC_API_URL not set correctly
# 2. NEXTAUTH_SECRET missing
# 3. Build failed

# Fix: Update environment variables and redeploy
```

### Can't Access Admin

```bash
# Wait for PostgreSQL to fully initialize (≈2 minutes)
# Then try: https://api.drpetersung.com/admin

# If still not working:
docker logs peter-sung-strapi --tail 100
docker exec postgres-db pg_isready -U strapi_user
```

---

## 📊 EXPECTED TIMELINE

```
DNS Config:      15 min (mostly waiting)
PostgreSQL:       5 min
Strapi Deploy:    5 min
Create Admin:     2 min
Next.js Deploy:   5 min
Add API Keys:    10 min
Testing:          5 min
─────────────────────
TOTAL:          45-60 min
```

---

## 🎯 FINAL VERIFICATION

When done, you should have:

✅ https://drpetersung.com → Homepage
✅ https://www.drpetersung.com → Redirects to main domain
✅ https://api.drpetersung.com/admin → Strapi admin panel
✅ Dashboard login working
✅ Stripe button showing
✅ Email form working

---

**Status: READY FOR DEPLOYMENT**

**Start with DNS configuration now!**
