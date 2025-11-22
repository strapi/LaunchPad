import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root (2 levels up from tools/vercel-agent)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_PROJECT_NAME = process.env.VERCEL_PROJECT_NAME;
const VERCEL_API = 'https://api.vercel.com';

interface DeploymentResponse {
  id: string;
  url: string;
  state?: 'BUILDING' | 'READY' | 'ERROR' | 'CANCELED';
  readyState?: 'BUILDING' | 'READY' | 'ERROR' | 'CANCELED';
}

async function vercelFetch(endpoint: string, options: RequestInit = {}) {
  if (!VERCEL_TOKEN) {
    throw new Error('VERCEL_TOKEN not found in .env');
  }

  const response = await fetch(`${VERCEL_API}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Vercel API error (${response.status}): ${error}`);
  }

  return response.json();
}

export async function triggerDeploy(): Promise<DeploymentResponse> {
  console.log(`   Triggering deployment for project: ${VERCEL_PROJECT_NAME}`);
  
  try {
    return await vercelFetch('/v13/deployments', {
      method: 'POST',
      body: JSON.stringify({
        name: VERCEL_PROJECT_NAME,
        project: VERCEL_PROJECT_ID,
        target: 'production',
      }),
    });
  } catch (error: any) {
    throw new Error(`Failed to trigger deployment: ${error.message}`);
  }
}

export async function getDeploymentStatus(deploymentId: string): Promise<DeploymentResponse> {
  return vercelFetch(`/v13/deployments/${deploymentId}`);
}

export async function listDeployments(limit: number = 5): Promise<DeploymentResponse[]> {
  try {
    const data = await vercelFetch(`/v9/projects/${VERCEL_PROJECT_ID}/deployments?limit=${limit}`);
    return data.deployments || [];
  } catch (error: any) {
    throw new Error(`Failed to list deployments: ${error.message}`);
  }
}

export async function getDeploymentLogs(deploymentId: string): Promise<string[]> {
  try {
    const data = await vercelFetch(`/v2/deployments/${deploymentId}/events`);
    return (data || []).map((event: any) => event.text || '').filter(Boolean);
  } catch {
    return [];
  }
}
