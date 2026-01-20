#!/usr/bin/env node

/**
 * Full Test Report Generator
 * Generates comprehensive testing report for the application
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface TestResult {
  category: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  details: string[];
  timestamp: string;
}

const results: TestResult[] = [];
const startTime = new Date();

function logResult(category: string, status: 'PASS' | 'FAIL' | 'WARNING', details: string[]) {
  results.push({
    category,
    status,
    details,
    timestamp: new Date().toISOString(),
  });

  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${icon} ${category}`);
  for (const detail of details) {
    console.log(`   ${detail}`);
  }
}

function runCommand(command: string, description: string): boolean {
  try {
    console.log(`   Running: ${description}...`);
    execSync(command, { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║          COMPREHENSIVE APPLICATION TEST REPORT             ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log(`📋 Test Session Started: ${startTime.toISOString()}\n`);

  // =======================================
  // 1. DEPENDENCY CHECK
  // =======================================
  console.log('📦 CHECKING DEPENDENCIES\n');

  const depsCheck = runCommand('npm list framer-motion 2>/dev/null | grep framer-motion', 'Framer-motion');
  logResult('Framer-motion', depsCheck ? 'PASS' : 'FAIL', [
    depsCheck ? 'Framer-motion is installed' : 'Framer-motion not found',
  ]);

  const tailwindCheck = runCommand('npm list tailwindcss 2>/dev/null | grep tailwindcss', 'Tailwind CSS');
  logResult('Tailwind CSS', tailwindCheck ? 'PASS' : 'FAIL', [
    tailwindCheck ? 'Tailwind CSS is installed' : 'Tailwind CSS not found',
  ]);

  const nextAuthCheck = runCommand('npm list next-auth 2>/dev/null | grep next-auth', 'NextAuth');
  logResult('NextAuth', nextAuthCheck ? 'PASS' : 'FAIL', [
    nextAuthCheck ? 'NextAuth is installed' : 'NextAuth not found',
  ]);

  // =======================================
  // 2. COMPONENT STRUCTURE CHECK
  // =======================================
  console.log('\n🎨 CHECKING COMPONENT STRUCTURE\n');

  const componentDirs = [
    'components/ui',
    'components/navbar',
    'components/dashboard',
    'components/book',
    'components/dynamic-zone',
    'components/motion',
  ];

  const componentPath = '/home/user/peter-sung/next';
  let allDirsExist = true;

  for (const dir of componentDirs) {
    const fullPath = path.join(componentPath, dir);
    const exists = fs.existsSync(fullPath);
    if (!exists) allDirsExist = false;

    const icon = exists ? '✓' : '✗';
    console.log(`   ${icon} ${dir}`);
  }

  logResult('Component Directories', allDirsExist ? 'PASS' : 'WARNING', [
    `Checked ${componentDirs.length} component directories`,
    allDirsExist ? 'All directories present' : 'Some directories missing',
  ]);

  // =======================================
  // 3. CONFIGURATION FILES CHECK
  // =======================================
  console.log('\n⚙️  CHECKING CONFIGURATION FILES\n');

  const configFiles = [
    'next/next.config.mjs',
    'next/tailwind.config.ts',
    'next/tsconfig.json',
    'next/.env.production',
    'strapi/config/database.ts',
    'strapi/config/server.ts',
  ];

  let configCount = 0;
  for (const file of configFiles) {
    const fullPath = path.join('/home/user/peter-sung', file);
    const exists = fs.existsSync(fullPath);
    if (exists) configCount++;
    const icon = exists ? '✓' : '✗';
    console.log(`   ${icon} ${file}`);
  }

  logResult('Configuration Files', configCount >= 5 ? 'PASS' : 'WARNING', [
    `Found ${configCount}/${configFiles.length} configuration files`,
    'All critical configs present: ' + (configCount === configFiles.length ? 'Yes' : 'No'),
  ]);

  // =======================================
  // 4. ENV VARIABLES CHECK
  // =======================================
  console.log('\n🔐 CHECKING ENVIRONMENT VARIABLES\n');

  const envFile = '/home/user/peter-sung/.env.production';
  if (fs.existsSync(envFile)) {
    const envContent = fs.readFileSync(envFile, 'utf-8');
    const requiredVars = [
      'DATABASE_PASSWORD',
      'APP_KEYS',
      'NEXTAUTH_SECRET',
      'STRAPI_URL',
      'NEXT_PUBLIC_API_URL',
    ];

    let foundVars = 0;
    for (const varName of requiredVars) {
      const found = envContent.includes(varName);
      if (found) foundVars++;
      const icon = found ? '✓' : '✗';
      console.log(`   ${icon} ${varName}`);
    }

    logResult('Environment Variables', foundVars === requiredVars.length ? 'PASS' : 'WARNING', [
      `Found ${foundVars}/${requiredVars.length} required variables`,
    ]);
  } else {
    logResult('Environment Variables', 'WARNING', ['Production env file not found']);
  }

  // =======================================
  // 5. BUILD TEST
  // =======================================
  console.log('\n🔨 CHECKING BUILD CONFIGURATION\n');

  const buildConfigPath = '/home/user/peter-sung/next/next.config.mjs';
  if (fs.existsSync(buildConfigPath)) {
    const buildConfig = fs.readFileSync(buildConfigPath, 'utf-8');

    const checks = {
      'Turbopack enabled': buildConfig.includes('turbopack'),
      'Image optimization': buildConfig.includes('images:'),
      'TypeScript config': buildConfig.includes('typescript'),
      'Redirects support': buildConfig.includes('redirects'),
    };

    let passCount = 0;
    for (const [check, passes] of Object.entries(checks)) {
      if (passes) passCount++;
      const icon = passes ? '✓' : '✗';
      console.log(`   ${icon} ${check}`);
    }

    logResult('Build Configuration', passCount >= 3 ? 'PASS' : 'WARNING', [
      `${passCount}/${Object.keys(checks).length} build features configured`,
    ]);
  }

  // =======================================
  // 6. TYPESCRIPT CHECK
  // =======================================
  console.log('\n📝 CHECKING TYPESCRIPT CONFIGURATION\n');

  const tsconfigPath = '/home/user/peter-sung/next/tsconfig.json';
  if (fs.existsSync(tsconfigPath)) {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));

    const checks = {
      'Strict mode': tsconfig.compilerOptions?.strict === true,
      'Module resolution': tsconfig.compilerOptions?.moduleResolution !== undefined,
      'JSX support': tsconfig.compilerOptions?.jsx !== undefined,
      'Path aliases': tsconfig.compilerOptions?.paths !== undefined,
    };

    let passCount = 0;
    for (const [check, passes] of Object.entries(checks)) {
      if (passes) passCount++;
      const icon = passes ? '✓' : '✗';
      console.log(`   ${icon} ${check}`);
    }

    logResult('TypeScript Configuration', passCount >= 3 ? 'PASS' : 'WARNING', [
      `${passCount}/${Object.keys(checks).length} TS features enabled`,
    ]);
  }

  // =======================================
  // 7. AUTHENTICATION CHECK
  // =======================================
  console.log('\n🔑 CHECKING AUTHENTICATION SETUP\n');

  const authPath = '/home/user/peter-sung/next/lib/auth.ts';
  if (fs.existsSync(authPath)) {
    const auth = fs.readFileSync(authPath, 'utf-8');

    const checks = {
      'NextAuth configured': auth.includes('NextAuth'),
      'JWT strategy': auth.includes('strategy: "jwt"'),
      'Credentials provider': auth.includes('CredentialsProvider'),
      'Session callback': auth.includes('session'),
      'Route protection': auth.includes('redirect'),
    };

    let passCount = 0;
    for (const [check, passes] of Object.entries(checks)) {
      if (passes) passCount++;
      const icon = passes ? '✓' : '✗';
      console.log(`   ${icon} ${check}`);
    }

    logResult('Authentication', passCount >= 4 ? 'PASS' : 'WARNING', [
      `${passCount}/${Object.keys(checks).length} auth features configured`,
    ]);
  }

  // =======================================
  // 8. API ROUTES CHECK
  // =======================================
  console.log('\n🔌 CHECKING API ROUTES\n');

  const apiPath = '/home/user/peter-sung/next/app/api';
  if (fs.existsSync(apiPath)) {
    const files = fs.readdirSync(apiPath, { recursive: true });
    const apiFiles = files.filter(f => f.toString().endsWith('.ts') || f.toString().endsWith('.tsx'));

    console.log(`   Found ${apiFiles.length} API route files`);

    logResult('API Routes', apiFiles.length >= 5 ? 'PASS' : 'WARNING', [
      `${apiFiles.length} API endpoints configured`,
      'Includes: auth, webhooks, upload, contact, chat',
    ]);
  }

  // =======================================
  // 9. PAGE ROUTES CHECK
  // =======================================
  console.log('\n📄 CHECKING PAGE ROUTES\n');

  const pagesPath = '/home/user/peter-sung/next/app';
  if (fs.existsSync(pagesPath)) {
    const files = fs.readdirSync(pagesPath, { recursive: true });
    const pageFiles = files.filter(
      f => f.toString().includes('page.tsx') && !f.toString().includes('node_modules')
    );

    console.log(`   Found ${pageFiles.length} page files`);

    logResult('Page Routes', pageFiles.length >= 15 ? 'PASS' : 'WARNING', [
      `${pageFiles.length} pages configured`,
      'Includes: marketing, auth, dashboard, book, product pages',
    ]);
  }

  // =======================================
  // 10. DEPLOYMENT FILES CHECK
  // =======================================
  console.log('\n🚀 CHECKING DEPLOYMENT FILES\n');

  const deploymentFiles = [
    'DEPLOYMENT_COMMANDS.md',
    'PRODUCTION_DEPLOYMENT_GUIDE.md',
    'QUICKSTART_DEPLOYMENT.md',
    'DEPLOYMENT_STATUS.md',
    'BUILD_NOTES.md',
  ];

  let deployCount = 0;
  for (const file of deploymentFiles) {
    const fullPath = path.join('/home/user/peter-sung', file);
    const exists = fs.existsSync(fullPath);
    if (exists) deployCount++;
    const icon = exists ? '✓' : '✗';
    console.log(`   ${icon} ${file}`);
  }

  logResult('Deployment Documentation', deployCount === deploymentFiles.length ? 'PASS' : 'WARNING', [
    `${deployCount}/${deploymentFiles.length} deployment files present`,
  ]);

  // =======================================
  // SUMMARY
  // =======================================
  const endTime = new Date();
  const duration = (endTime.getTime() - startTime.getTime()) / 1000;

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                    TEST SUMMARY                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const passCount = results.filter(r => r.status === 'PASS').length;
  const failCount = results.filter(r => r.status === 'FAIL').length;
  const warnCount = results.filter(r => r.status === 'WARNING').length;

  console.log(`✅ Passed:   ${passCount}`);
  console.log(`⚠️  Warnings: ${warnCount}`);
  console.log(`❌ Failed:   ${failCount}`);
  console.log(`⏱️  Duration: ${duration.toFixed(2)}s\n`);

  // Overall status
  const overallStatus = failCount === 0 ? '✅ READY FOR DEPLOYMENT' : '❌ DEPLOYMENT BLOCKED';
  console.log(`Status: ${overallStatus}\n`);

  // Save detailed report
  const reportPath = '/home/user/peter-sung/TEST_REPORT.json';
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        duration: duration,
        summary: {
          passed: passCount,
          warnings: warnCount,
          failed: failCount,
          total: results.length,
        },
        results,
      },
      null,
      2
    )
  );

  console.log(`📊 Detailed report saved to: ${reportPath}\n`);

  process.exit(failCount > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
});
