#!/usr/bin/env node

/**
 * Component Verification Script
 * Verifies all frontend components use:
 * 1. Motion Primitives (framer-motion)
 * 2. CN utility for className management
 * 3. Proper TypeScript types
 * 4. Accessibility attributes
 */

import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

interface ComponentReport {
  file: string;
  component: string;
  hasMotion: boolean;
  hasCn: boolean;
  hasTypeScript: boolean;
  hasAccess: boolean;
  motionUsage: string[];
  cnUsage: number;
  issues: string[];
}

const reports: ComponentReport[] = [];
const motionPattern = /from\s+['"]framer-motion['"]|import.*motion|useMotion|animate|AnimatePresence|motion\./;
const cnPattern = /import.*cn|from.*utils|cn\(/;
const typeScriptPattern = /:\s*(React\.FC|FC|React\.ReactNode|ReactNode|ElementType|ReactElement)/;
const accessibilityPattern = /aria-|role=|label|alt=|title=/;

function scanComponentsDirectory(dir: string, pattern: string): string[] {
  try {
    return globSync(pattern, { cwd: dir });
  } catch (error) {
    return [];
  }
}

function analyzeComponent(filePath: string): ComponentReport {
  const fullPath = path.join('/home/user/peter-sung/next', filePath);
  const componentName = path.basename(filePath, '.tsx');

  const report: ComponentReport = {
    file: filePath,
    component: componentName,
    hasMotion: false,
    hasCn: false,
    hasTypeScript: false,
    hasAccess: false,
    motionUsage: [],
    cnUsage: 0,
    issues: [],
  };

  try {
    const content = fs.readFileSync(fullPath, 'utf-8');

    // Check for Motion Primitives
    if (motionPattern.test(content)) {
      report.hasMotion = true;

      // Extract specific motion usage
      const motionMatches = content.match(/from\s+['"]framer-motion['"]|useMotion\w+|motion\.\w+|AnimatePresence|whileInView|animate:|transition:/g);
      if (motionMatches) {
        report.motionUsage = [...new Set(motionMatches)];
      }
    }

    // Check for CN utility
    const cnMatches = content.match(/cn\(/g);
    if (cnMatches) {
      report.hasCn = true;
      report.cnUsage = cnMatches.length;
    }

    // Check for TypeScript types
    if (typeScriptPattern.test(content)) {
      report.hasTypeScript = true;
    }

    // Check for accessibility
    if (accessibilityPattern.test(content)) {
      report.hasAccess = true;
    }

    // Identify issues
    if (!report.hasTypeScript && !componentName.includes('Page')) {
      report.issues.push('Missing TypeScript types');
    }

    if (!report.hasAccess && content.includes('button') && !content.includes('disabled')) {
      report.issues.push('Button without accessibility attributes');
    }

    // Interactive components should use Motion
    if (
      (componentName.toLowerCase().includes('button') ||
        componentName.toLowerCase().includes('card') ||
        componentName.toLowerCase().includes('modal')) &&
      !report.hasMotion &&
      content.includes('onClick')
    ) {
      report.issues.push('Interactive component missing Motion Primitives');
    }

    // Components with styles should use CN
    if (content.includes('className') && !report.hasCn && filePath.includes('/components/')) {
      const classNameMatches = content.match(/className={/g);
      if (classNameMatches && classNameMatches.length > 1) {
        report.issues.push('Multiple classNames without CN utility');
      }
    }
  } catch (error) {
    report.issues.push(`Error reading file: ${error}`);
  }

  return report;
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║         Component Verification Report                     ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Find all TSX components
  const componentPaths = scanComponentsDirectory(
    '/home/user/peter-sung/next',
    'components/**/*.tsx'
  );

  console.log(`Found ${componentPaths.length} components to analyze...\n`);

  // Analyze each component
  for (const filePath of componentPaths) {
    const report = analyzeComponent(filePath);
    reports.push(report);
  }

  // Generate statistics
  const stats = {
    total: reports.length,
    withMotion: reports.filter(r => r.hasMotion).length,
    withCn: reports.filter(r => r.hasCn).length,
    withTypeScript: reports.filter(r => r.hasTypeScript).length,
    withAccess: reports.filter(r => r.hasAccess).length,
    withIssues: reports.filter(r => r.issues.length > 0).length,
  };

  // Print summary
  console.log('📊 SUMMARY\n');
  console.log(`Total Components:              ${stats.total}`);
  console.log(`Using Motion Primitives:       ${stats.withMotion} (${Math.round((stats.withMotion / stats.total) * 100)}%)`);
  console.log(`Using CN Utility:              ${stats.withCn} (${Math.round((stats.withCn / stats.total) * 100)}%)`);
  console.log(`With TypeScript Types:         ${stats.withTypeScript} (${Math.round((stats.withTypeScript / stats.total) * 100)}%)`);
  console.log(`With Accessibility:            ${stats.withAccess} (${Math.round((stats.withAccess / stats.total) * 100)}%)`);
  console.log(`Components with Issues:        ${stats.withIssues}\n`);

  // Top motion users
  const topMotionUsers = reports
    .filter(r => r.motionUsage.length > 0)
    .sort((a, b) => b.motionUsage.length - a.motionUsage.length)
    .slice(0, 10);

  console.log('🎬 TOP MOTION PRIMITIVES USERS\n');
  for (const report of topMotionUsers) {
    console.log(`${report.component} - ${report.motionUsage.join(', ')}`);
  }

  // Top CN users
  const topCnUsers = reports
    .filter(r => r.cnUsage > 0)
    .sort((a, b) => b.cnUsage - a.cnUsage)
    .slice(0, 10);

  console.log('\n🎨 TOP CN UTILITY USERS\n');
  for (const report of topCnUsers) {
    console.log(`${report.component} - ${report.cnUsage} usages`);
  }

  // Components with issues
  const issueComponents = reports.filter(r => r.issues.length > 0);
  if (issueComponents.length > 0) {
    console.log(`\n⚠️  COMPONENTS WITH ISSUES (${issueComponents.length})\n`);
    for (const report of issueComponents.slice(0, 20)) {
      console.log(`${report.component}:`);
      for (const issue of report.issues) {
        console.log(`  - ${issue}`);
      }
    }
  }

  // Components without Motion (but should have it)
  const interactiveWithoutMotion = reports.filter(
    r => !r.hasMotion && (r.component.toLowerCase().includes('button') || r.component.toLowerCase().includes('modal'))
  );

  if (interactiveWithoutMotion.length > 0) {
    console.log(`\n🎯 INTERACTIVE COMPONENTS WITHOUT MOTION (${interactiveWithoutMotion.length})\n`);
    for (const report of interactiveWithoutMotion.slice(0, 10)) {
      console.log(`- ${report.component}`);
    }
  }

  // Generate detailed report file
  const reportFile = '/home/user/peter-sung/COMPONENT_VERIFICATION_REPORT.json';
  fs.writeFileSync(reportFile, JSON.stringify({ stats, reports }, null, 2));

  console.log(`\n✅ Detailed report saved to: ${reportFile}`);
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                   VERIFICATION COMPLETE                    ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Exit with appropriate code
  process.exit(issueComponents.length > 5 ? 1 : 0);
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
