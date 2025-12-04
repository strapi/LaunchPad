---
description: Finish the LaunchPad project today (Setup, Fix, Polish, Deploy)
---

1. Install dependencies
   // turbo

   ```bash
   yarn install
   ```

2. Setup Environment Variables
   // turbo

   ```bash
   yarn setup
   ```

3. Seed Strapi Database (Ensure backend has content)

   ```bash
   yarn seed
   ```

4. Start Development Servers (Concurrent Next.js + Strapi)
   // turbo

   ```bash
   yarn dev
   ```

5. Build Next.js (Check for Type Errors)

   ```bash
   cd next && yarn build
   ```

6. Deploy Agent (Vercel)
   ```bash
   npm run deploy:agent
   ```
