---
description: Deploy to Hostinger hosting using the Hostinger API
---

# Deploy to Hostinger

This workflow deploys the Peter Sung website to Hostinger hosting.

## Prerequisites

1. **Hostinger API Token**: Get your token from https://hpanel.hostinger.com/profile/api
2. **Domain configured**: Ensure your domain is set up in Hostinger
3. **hostinger-api-mcp installed**: Run `npm install -g hostinger-api-mcp`

## Deployment Steps

// turbo-all

### 1. Build the Next.js application

```bash
cd next && npm run build
```

### 2. Create deployment archive

The Hostinger JS deployment tool will handle building on their server.
Create an archive of the source files (excluding node_modules and .next):

```bash
cd next && tar -cvzf ../deploy.tar.gz --exclude='node_modules' --exclude='.next' --exclude='.env.local' .
```

### 3. Deploy using Hostinger MCP

Use the `hosting_deployJsApplication` tool with:

- `domain`: Your Hostinger domain (e.g., petersung.com)
- `archivePath`: Path to the deploy.tar.gz file
- `removeArchive`: true (cleanup after deploy)

### 4. Check deployment status

Use `hosting_listJsDeployments` to monitor the build progress.

### 5. Verify live site

Visit your domain to confirm the deployment is successful.

## Environment Variables

Ensure these are set in Hostinger's environment settings:

- `STRAPI_URL`: Your Strapi backend URL
- `NEXT_PUBLIC_STRAPI_URL`: Same as above
- Any other env vars from your `.env` file

## Rollback

If deployment fails:

1. Check logs with `hosting_showJsDeploymentLogs`
2. Fix issues and redeploy
3. Or restore previous deployment from Hostinger panel

## Notes

- First deployment may take longer as Hostinger sets up the environment
- Subsequent deployments use cached dependencies
- The MCP server requires your API token to be set as `API_TOKEN` environment variable
