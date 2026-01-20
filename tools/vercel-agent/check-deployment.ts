import { listDeployments } from './vercelClient.js';

async function checkDeploymentStatus() {
  console.log('📊 Vercel Deployment Status Check');
  console.log('='.repeat(50));
  console.log('');
  
  try {
    const deployments = await listDeployments(5);
    
    if (deployments.length === 0) {
      console.log('⚠️ No deployments found for this project.');
      console.log('');
      console.log('💡 To create your first deployment:');
      console.log('   npm run deploy:agent');
      return;
    }
    
    console.log(`📦 Recent Deployments:\n`);
    
    deployments.forEach((d, i) => {
      const status = d.state || d.readyState;
      const emoji = status === 'READY' ? '✅' : status === 'BUILDING' ? '⏳' : '❌';
      console.log(`${emoji} ${i + 1}. ${d.url}`);
      console.log(`   Status: ${status}`);
      console.log(`   ID: ${d.id}`);
      console.log('');
    });
    
    const latest = deployments[0];
    const latestStatus = latest.state || latest.readyState;
    const isReady = latestStatus === 'READY';
    
    console.log('─'.repeat(50));
    console.log(`📊 Self-Grade: ${isReady ? '✅ SUCCESS' : '🟡 PROGRESS'}`);
    console.log('─'.repeat(50));
    console.log('');
    
    if (isReady) {
      console.log('🌐 Live URL: https://' + latest.url);
      console.log('✅ Latest deployment is live and ready!');
      console.log('');
      console.log('💡 Next steps:');
      console.log('   - Visit the URL to verify your app');
      console.log('   - Run tests: npm run test:e2e');
      console.log('   - Check Lighthouse scores: npm run test:lighthouse');
    } else {
      console.log('⚠️ Latest deployment is not ready yet.');
      console.log(`   Current status: ${latestStatus}`);
      console.log('');
      console.log('💡 Next steps:');
      console.log('   - Wait for build to complete');
      console.log('   - Check Vercel dashboard for logs');
      console.log('   - Or trigger new deployment: npm run deploy:agent');
    }
    
    console.log('');
  } catch (error: any) {
    console.error('❌ Error checking deployments:', error.message);
    console.log('');
    console.log('💡 Troubleshooting:');
    console.log('   - Check your .env file has VERCEL_TOKEN and VERCEL_PROJECT_ID');
    console.log('   - Verify token is valid: https://vercel.com/account/tokens');
    console.log('   - Confirm project ID: https://vercel.com/dashboard');
    console.log('');
  }
}

checkDeploymentStatus();
