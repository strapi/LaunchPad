# 🎯 IMMEDIATE NEXT STEPS - PETER SUNG DEPLOYMENT

**Status:** Everything is ready. Execute these steps in order.

---

## ⏱️ TIMELINE

**Total time to production: 45-60 minutes**

- Step 1: Configure DNS - 15 minutes
- Step 2: Deploy Services - 20 minutes
- Step 3: Add API Keys - 10 minutes
- Step 4: Test Everything - 10 minutes

---

## 🚀 STEP 1: CONFIGURE DNS (15 minutes)

### What to do:
1. Log into Hostinger Control Panel
2. Go to **Domains** → Your domain → **DNS Records**
3. Add these three A records:

```
Record 1:
  Type: A
  Name: @ (root)
  Value: 31.220.58.212
  TTL: 3600

Record 2:
  Type: A
  Name: www
  Value: 31.220.58.212
  TTL: 3600

Record 3:
  Type: A
  Name: api
  Value: 31.220.58.212
  TTL: 3600
```

4. **Save all records**
5. **Wait 5-15 minutes** for DNS propagation

### Verify DNS is working:
```bash
# Run this in terminal to check
nslookup drpetersung.com
# Should show: 31.220.58.212

dig drpetersung.com
# Should show: 31.220.58.212
```

✅ **When you see the IP, move to Step 2**

---

## 🚀 STEP 2: DEPLOY ALL SERVICES (20 minutes)

### Access Coolify Dashboard:

**Option A: SSH Tunnel (Secure)**
```bash
ssh -L 3000:localhost:3000 root@31.220.58.212
# Then open: http://localhost:3000
```

**Option B: Direct** (if on same network)
```
http://31.220.58.212:3000
```

**Token:** `2|4V5eHVRpa80wwHUIXK3Zm2tAsbV7300feWeY4CAj0be873d6`

---

### Service 1: PostgreSQL Database (5 min)

In Coolify Dashboard:

1. Click **"+ Add"** → **"Services"** → **"PostgreSQL"**
2. Set these values:
   - **Name:** `postgres-db`
   - **Database:** `strapi_prod`
   - **Username:** `strapi_user`
   - **Password:** `MnTt2vrBG1nmU9BdrMMDuWfV5koAdvi8`
3. Click **"Save"** → **"Start"**
4. Wait until green checkmark (running)

---

### Service 2: Strapi Backend (5 min)

In Coolify Dashboard:

1. Click **"+ Add"** → **"Application"**
2. **Source:**
   - Name: `peter-sung-strapi`
   - Repo: `https://github.com/executiveusa/peter-sung`
   - Branch: `main`
   - Base Dir: `strapi`

3. **Build:**
   - Install: `npm install --legacy-peer-deps`
   - Build: `npm run build`
   - Start: `npm run start`
   - Port: `1337`

4. **Environment Variables** - Copy ALL of these:
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

5. **Volumes:**
   - Add: `/app/public/uploads`
   - Add: `/app/.cache`

6. **Domain:** `api.drpetersung.com` with SSL

7. Click **"Deploy"** and wait 3-5 min ⏳

---

### Service 3: Next.js Frontend (5 min)

In Coolify Dashboard:

1. Click **"+ Add"** → **"Application"**
2. **Source:**
   - Name: `peter-sung-frontend`
   - Repo: `https://github.com/executiveusa/peter-sung`
   - Branch: `main`
   - Base Dir: `next`

3. **Build:**
   - Install: `npm install --legacy-peer-deps`
   - Build: `npm run build`
   - Start: `npm run start`
   - Port: `3000`

4. **Environment Variables** - Copy ALL:
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

5. **Domains:**
   - Add: `drpetersung.com`
   - Add: `www.drpetersung.com`
   - Enable SSL on both

6. Click **"Deploy"** and wait 3-5 min ⏳

---

## 🔑 STEP 3: ADD PRODUCTION API KEYS (10 minutes)

**⚠️ This is critical for payments and AI features to work**

### Get Stripe Keys:
1. Go to: https://dashboard.stripe.com/apikeys
2. Copy your **LIVE** keys (not test keys!)
3. In Coolify, edit `peter-sung-frontend` environment:
   - `STRIPE_SECRET_KEY=sk_live_xxxxx...`
   - `STRIPE_WEBHOOK_SECRET=whsec_xxxxx...`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx...`
4. **Redeploy**

### Get Resend Email Key:
1. Go to: https://resend.com/dashboard
2. Copy your API key
3. In Coolify, update `peter-sung-frontend`:
   - `RESEND_API_KEY=re_xxxxx...`
4. **Redeploy**

### Get Google AI Key:
1. Go to: https://console.cloud.google.com
2. Create project → Enable Generative Language API
3. Create API key
4. In Coolify, update `peter-sung-frontend`:
   - `GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyxxxxx...`
5. **Redeploy**

---

## ✅ STEP 4: VERIFY EVERYTHING WORKS (10 minutes)

### Test URLs:
```bash
# Frontend
curl -I https://drpetersung.com
# Should return: 200 OK

# API
curl -I https://api.drpetersung.com/admin/login
# Should return: 200 OK

# Strapi Admin
# Open: https://api.drpetersung.com/admin
# Create first admin user
```

### Manual Testing:
- [ ] Homepage loads at https://drpetersung.com
- [ ] Navigate to different pages
- [ ] Try logging in at https://drpetersung.com/login
- [ ] Access dashboard
- [ ] Check Strapi admin at https://api.drpetersung.com/admin
- [ ] Verify images load
- [ ] Try book pre-order page

### If Something Fails:
```bash
# SSH to VPS
ssh root@31.220.58.212

# Check all containers running
docker ps

# View logs
docker logs -f peter-sung-frontend --tail 100
docker logs -f peter-sung-strapi --tail 100
docker logs -f postgres-db --tail 100

# Test database connection
docker exec postgres-db pg_isready -U strapi_user
```

---

## 🎉 YOU'RE DONE!

Your full-stack application is now live in production:

- **Frontend:** https://drpetersung.com
- **API:** https://api.drpetersung.com
- **Admin Panel:** https://api.drpetersung.com/admin

---

## 📋 EXECUTION CHECKLIST

Copy and paste this into a terminal to track your progress:

```
□ Step 1: DNS configured (verify with nslookup)
□ Step 2a: PostgreSQL deployed
□ Step 2b: Strapi deployed and running
□ Step 2c: Create Strapi admin user
□ Step 2d: Next.js frontend deployed
□ Step 3a: Stripe keys added
□ Step 3b: Resend key added
□ Step 3c: Google AI key added
□ Step 4a: Frontend loads
□ Step 4b: API responds
□ Step 4c: Admin panel accessible
□ PRODUCTION LIVE ✅
```

---

## 🆘 COMMON ISSUES & FIXES

### DNS Not Resolving
```bash
# Wait and try again
nslookup drpetersung.com

# If still failing after 15 min:
# Check Hostinger DNS panel
# Verify IP is 31.220.58.212
# Wait up to 24 hours for global propagation
```

### Strapi Won't Deploy
```bash
# SSH and check logs
ssh root@31.220.58.212
docker logs peter-sung-strapi --tail 50

# Usually: wrong database credentials or port mismatch
# Verify DATABASE_HOST=postgres-db (not an IP)
```

### Next.js Won't Deploy
```bash
# Check logs
docker logs peter-sung-frontend --tail 50

# Usually: API_URL pointing to wrong place
# Verify: NEXT_PUBLIC_API_URL=https://api.drpetersung.com
```

### Can't Access Strapi Admin
```bash
# Wait for PostgreSQL to fully start
# Check if database is running
docker logs postgres-db --tail 20

# Try accessing admin in 2 minutes
```

---

## 📞 NEED HELP?

1. Check logs: `ssh root@31.220.58.212`
2. Check Coolify dashboard for red warnings
3. Verify all environment variables are set correctly
4. Clear browser cache and hard refresh (Ctrl+Shift+R)

---

**Status: ✅ READY TO DEPLOY**

**Start with Step 1 now!**
