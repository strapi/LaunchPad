# Deployment Guide

## Manual Deployment
If the automated agent fails, you can deploy manually using the Vercel CLI.

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   cd next
   vercel --prod
   ```

## Troubleshooting
- **Build Errors**: Ensure you run `npm install --legacy-peer-deps` to resolve React 19 vs Three.js conflicts.
- **Missing Binary**: If `next` is not found, try `npx next build`.
- **Vercel Agent 404**: Check `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` in `.env`. Ensure your token has access to the team.

## Environment Variables
Ensure the following are set in Vercel Project Settings:
- `NEXT_PUBLIC_API_URL`
- `OPENAI_API_KEY` (if using AI features)
