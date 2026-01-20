import 'dotenv/config';

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_API = 'https://api.vercel.com';

async function debugToken() {
  console.log('🔍 Debugging Vercel Token...');
  
  if (!VERCEL_TOKEN) {
    console.error('❌ VERCEL_TOKEN is missing');
    return;
  }

  try {
    // 1. Check User/Token
    console.log('\n👤 Checking User...');
    const userRes = await fetch(`${VERCEL_API}/v2/user`, {
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` }
    });
    
    if (!userRes.ok) {
      console.error(`❌ User check failed: ${userRes.status} ${await userRes.text()}`);
    } else {
      const userData = await userRes.json();
      console.log(`✅ Authenticated as: ${userData.user.username} (${userData.user.email})`);
    }

    // 2. List Teams
    console.log('\nMw Checking Teams...');
    const teamsRes = await fetch(`${VERCEL_API}/v2/teams`, {
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` }
    });
    
    if (!teamsRes.ok) {
      console.error(`❌ Teams check failed: ${teamsRes.status} ${await teamsRes.text()}`);
    } else {
      const teamsData = await teamsRes.json();
      console.log(`✅ Found ${teamsData.teams.length} teams:`);
      teamsData.teams.forEach((t: any) => console.log(`   - ${t.name} (ID: ${t.id})`));
    }

    // 3. List Projects (for user and each team)
    console.log('\n📂 Checking Projects...');
    
    // User projects
    await listProjects();

    // 4. Check Deployments for peter-sung
    console.log('\n🚀 Checking Deployments for peter-sung...');
    const projectId = 'prj_tYH7cby0DYRNFnaczvAMZfTZvHoP';
    const deployRes = await fetch(`${VERCEL_API}/v9/projects/${projectId}/deployments?limit=5`, {
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` }
    });
    
    if (!deployRes.ok) {
      console.error(`❌ Deployments check failed: ${deployRes.status} ${await deployRes.text()}`);
    } else {
      const deployData = await deployRes.json();
      console.log(`✅ Found ${deployData.deployments.length} deployments`);
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

async function listProjects(teamId?: string) {
  const url = teamId 
    ? `${VERCEL_API}/v9/projects?teamId=${teamId}`
    : `${VERCEL_API}/v9/projects`;
    
  const label = teamId ? `Team ${teamId}` : 'Personal Account';
  
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` }
    });
    
    if (!res.ok) {
      console.log(`❌ Failed to list projects for ${label}: ${res.status}`);
      return;
    }
    
    const data = await res.json();
    console.log(`✅ Projects for ${label}:`);
    data.projects.forEach((p: any) => console.log(`   - ${p.name} (ID: ${p.id})`));
    
  } catch (e: any) {
    console.log(`❌ Error listing projects for ${label}: ${e.message}`);
  }
}

debugToken();
