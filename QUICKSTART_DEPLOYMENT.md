# 🚀 QUICK START - PRODUCTION DEPLOYMENT

**Status:** Code is 100% ready. Here's your exact roadmap in 45 minutes.

---

## ✅ WHAT'S ALREADY DONE

- ✅ Code built and tested
- ✅ Database configured
- ✅ All secrets generated
- ✅ Environment files created
- ✅ Docker ready
- ✅ Documentation complete
- ✅ VPS provisioned (31.220.58.212)
- ✅ Coolify installed

---

## 🚀 YOUR EXACT STEPS NOW

### STEP 1: Configure DNS (15 minutes)

**Where:** Hostinger Control Panel → Domains → DNS Records

**Add these 3 records:**

```
Record 1:
  Type: A
  Name: @ (or leave blank)
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

**Save all records** and wait 15 minutes for propagation.

**Verify DNS:**
```bash
# Run in terminal
nslookup drpetersung.com
dig drpetersung.com

# Should show: 31.220.58.212
```

✅ **When you see the IP address, continue to STEP 2**

---

### STEP 2: Deploy on Coolify (25 minutes)

#### Access Coolify Dashboard

```bash
# Option A: Secure SSH tunnel (recommended)
ssh -L 3000:localhost:3000 root@31.220.58.212

# Then open in browser:
http://localhost:3000
```

**Login Token:** `2|4V5eHVRpa80wwHUIXK3Zm2tAsbV7300feWeY4CAj0be873d6`

---

#### 2.1: Deploy PostgreSQL (5 min)

In Coolify Dashboard:

1. Click **"+ Add"** → **"Services"** → **"PostgreSQL"**
2. Fill in:
   ```
   Name: postgres-db
   Database: strapi_prod
   Username: strapi_user
   Password: MnTt2vrBG1nmU9BdrMMDuWfV5koAdvi8
   Port: 5432
   Volume: 20GB
   ```
3. Click **"Save"** then **"Start"**
4. Wait for green checkmark (≈30 seconds)

---

#### 2.2: Deploy Strapi Backend (5 min)

In Coolify Dashboard:

1. Click **"+ Add"** → **"Application"**

2. **Source** tab:
   ```
   Name: peter-sung-strapi
   Repository: https://github.com/executiveusa/peter-sung
   Branch: main
   Base Directory: strapi
   ```

3. **Build & Deployment** tab:
   ```
   Install: npm install --legacy-peer-deps
   Build: npm run build
   Start: npm run start
   Port: 1337
   ```

4. **Health Check** tab:
   ```
   Enable: ON
   Path: /admin/login
   Port: 1337
   ```

5. **Environment Variables** tab - Add all of these:

   Copy-paste block:
   ```env
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

6. **Volumes** tab:
   - Add: `/app/public/uploads`
   - Add: `/app/.cache`

7. **Domains** tab:
   - Domain: `api.drpetersung.com`
   - SSL: Enable (Let's Encrypt)

8. Click **"Deploy"** ⏳ (Wait 3-5 minutes)

---

#### 2.3: Create Strapi Admin User

1. Once deployed, open: `https://api.drpetersung.com/admin`
2. Click **"Create your first admin user"**
3. Enter:
   - Email: (your email)
   - Password: (strong password)
4. Click **"Let's start"**

✅ **Strapi is now live**

---

#### 2.4: Deploy Next.js Frontend (5 min)

In Coolify Dashboard:

1. Click **"+ Add"** → **"Application"**

2. **Source** tab:
   ```
   Name: peter-sung-frontend
   Repository: https://github.com/executiveusa/peter-sung
   Branch: main
   Base Directory: next
   ```

3. **Build & Deployment** tab:
   ```
   Install: npm install --legacy-peer-deps
   Build: npm run build
   Start: npm run start
   Port: 3000
   ```

4. **Health Check** tab:
   ```
   Enable: ON
   Path: /
   Port: 3000
   ```

5. **Environment Variables** tab - Add all of these:

   Copy-paste block:
   ```env
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

6. **Domains** tab:
   - Domain 1: `drpetersung.com` (SSL: Enable)
   - Domain 2: `www.drpetersung.com` (SSL: Enable)
   - Enable www redirect

7. Click **"Deploy"** ⏳ (Wait 3-5 minutes)

---

### STEP 3: Add Real API Keys (10 minutes)

**⚠️ This is essential for payments and email to work**

#### 3.1: Stripe Keys

1. Go to: https://dashboard.stripe.com/apikeys
2. Copy your **LIVE** keys (blue indicators, not "test")
3. In Coolify, edit `peter-sung-frontend` environment:
   - `STRIPE_SECRET_KEY=sk_live_xxxxx...`
   - `STRIPE_WEBHOOK_SECRET=whsec_xxxxx...`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx...`
4. Redeploy by clicking **"Redeploy"**

#### 3.2: Resend Email API Key

1. Go to: https://resend.com/dashboard
2. Copy your **API Key**
3. In Coolify, edit `peter-sung-frontend` environment:
   - `RESEND_API_KEY=re_xxxxx...`
4. Redeploy

#### 3.3: Google Generative AI Key

1. Go to: https://console.cloud.google.com
2. Create or select a project
3. Enable **Generative Language API**
4. Create **API Key**
5. In Coolify, edit `peter-sung-frontend` environment:
   - `GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyxxxxx...`
6. Redeploy

---

## ✅ VERIFY EVERYTHING WORKS (5 minutes)

### Test URLs

Open in browser:

```
Frontend:  https://drpetersung.com
API:       https://api.drpetersung.com/admin/login
Admin:     https://api.drpetersung.com/admin
```

### Manual Tests

- [ ] Homepage loads and looks good
- [ ] Can navigate to different pages
- [ ] Try login page
- [ ] Dashboard is accessible
- [ ] Strapi admin panel accessible
- [ ] Images load properly
- [ ] Book pre-order page displays

### If Something Fails

```bash
# SSH to VPS
ssh root@31.220.58.212

# See all containers
docker ps

# Check logs
docker logs -f peter-sung-frontend --tail 100
docker logs -f peter-sung-strapi --tail 100
docker logs -f postgres-db --tail 100

# Test database
docker exec postgres-db pg_isready -U strapi_user
```

---

## 🎉 YOU'RE DONE!

Your live URLs:

- **Frontend:** https://drpetersung.com
- **Admin Panel:** https://api.drpetersung.com/admin
- **API:** https://api.drpetersung.com

---

## 📊 TIMELINE BREAKDOWN

```
Step 1 (DNS):     15 min ⏳ (mostly waiting for propagation)
Step 2.1 (DB):     5 min ✓
Step 2.2 (API):    5 min ✓
Step 2.3 (Admin):  2 min ✓
Step 2.4 (FE):     5 min ✓
Step 3 (Keys):    10 min ✓
Step 4 (Test):     5 min ✓
─────────────────────────
TOTAL:           45-60 min
```

---

## 🆘 QUICK FIXES

**DNS not propagating?**
```bash
# Check manually
nslookup drpetersung.com
# Should show: 31.220.58.212
# Wait up to 24 hours if needed
```

**Strapi won't deploy?**
- Check database is running first
- Verify DATABASE_HOST=postgres-db (not IP)
- Check environment variables copied correctly

**Next.js won't deploy?**
- Verify NEXT_PUBLIC_API_URL=https://api.drpetersung.com
- Check NEXTAUTH_SECRET is set
- Clear browser cache

**Can't access admin panel?**
- Wait for PostgreSQL to fully start
- Try in 2 minutes
- Check Coolify logs for errors

---

## 📞 SUPPORT

- **Full Guide:** PRODUCTION_DEPLOYMENT_GUIDE.md
- **Checklist:** PRODUCTION_READY_CHECKLIST.md
- **Detailed Steps:** IMMEDIATE_NEXT_STEPS.md
- **Scripts:** scripts/ directory

---

**Status: ✅ READY TO DEPLOY**

**Start with STEP 1 now!**
