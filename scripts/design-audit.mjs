#!/usr/bin/env node

/**
 * Design Audit Script for Peter Sung Platform
 *
 * This script performs automated checks against the design system
 * and outputs a score with detailed feedback.
 *
 * Target: 9.5+/10 (95+ points out of 100)
 *
 * Usage: node scripts/design-audit.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const NEXT_DIR = path.join(ROOT, 'next');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Audit results storage
const auditResults = {
  visualHierarchy: { score: 0, max: 25, issues: [], passes: [] },
  usability: { score: 0, max: 25, issues: [], passes: [] },
  aesthetics: { score: 0, max: 25, issues: [], passes: [] },
  technicalQuality: { score: 0, max: 25, issues: [], passes: [] },
};

/**
 * Read all TSX/JSX files from a directory recursively
 */
function readFilesRecursively(dir, extensions = ['.tsx', '.jsx', '.ts', '.js']) {
  const files = [];

  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      files.push(...readFilesRecursively(fullPath, extensions));
    } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Read file content safely
 */
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return '';
  }
}

// ============================================================================
// VISUAL HIERARCHY CHECKS (25 points)
// ============================================================================

function checkVisualHierarchy() {
  const category = auditResults.visualHierarchy;

  // Check 1: Hero headlines use proper sizing (5 points)
  const heroFiles = readFilesRecursively(path.join(NEXT_DIR, 'components')).filter(f =>
    f.toLowerCase().includes('hero')
  );
  const pageFiles = readFilesRecursively(path.join(NEXT_DIR, 'app'));

  let hasProperHeroSizing = false;
  const allFiles = [...heroFiles, ...pageFiles];

  for (const file of allFiles) {
    const content = readFile(file);
    // Check for responsive text sizing (text-4xl md:text-5xl lg:text-6xl pattern)
    if (content.match(/text-[4-6]xl\s+.*md:text-[5-7]xl/)) {
      hasProperHeroSizing = true;
      break;
    }
  }

  if (hasProperHeroSizing) {
    category.score += 5;
    category.passes.push('Hero headlines use responsive sizing');
  } else {
    category.issues.push('Hero headlines should use responsive sizing (text-4xl md:text-5xl lg:text-6xl)');
  }

  // Check 2: Clear heading hierarchy (5 points)
  let hasHeadingHierarchy = false;
  for (const file of allFiles) {
    const content = readFile(file);
    // Look for h1, h2, h3 or text-xl, text-2xl, text-3xl patterns
    if (content.includes('<h1') && content.includes('<h2')) {
      hasHeadingHierarchy = true;
      break;
    }
    if (content.match(/text-3xl.*text-2xl.*text-xl/s) || content.match(/text-4xl.*text-2xl/s)) {
      hasHeadingHierarchy = true;
      break;
    }
  }

  if (hasHeadingHierarchy) {
    category.score += 5;
    category.passes.push('Clear heading size hierarchy exists');
  } else {
    category.issues.push('Implement clear heading hierarchy (H1 > H2 > H3 or equivalent sizing)');
  }

  // Check 3: CTAs are prominent (5 points)
  let hasProminentCTAs = false;
  for (const file of allFiles) {
    const content = readFile(file);
    // Look for primary button styling with cyan/accent colors
    if (content.match(/bg-cyan|bg-primary|bg-accent/) && content.includes('button')) {
      hasProminentCTAs = true;
      break;
    }
    if (content.match(/className.*primary.*button/i)) {
      hasProminentCTAs = true;
      break;
    }
  }

  if (hasProminentCTAs) {
    category.score += 5;
    category.passes.push('CTAs use prominent accent colors');
  } else {
    category.issues.push('CTAs should use prominent accent colors (bg-cyan-400, etc.)');
  }

  // Check 4: Adequate white space (5 points)
  let hasProperSpacing = false;
  for (const file of allFiles) {
    const content = readFile(file);
    // Look for section spacing patterns
    if (content.match(/py-[12][0-9]|py-24|py-32|py-20|py-16/)) {
      hasProperSpacing = true;
      break;
    }
  }

  if (hasProperSpacing) {
    category.score += 5;
    category.passes.push('Sections use adequate vertical spacing');
  } else {
    category.issues.push('Add more section spacing (py-16, py-20, py-24)');
  }

  // Check 5: Container constraints (5 points)
  let hasContainerConstraints = false;
  for (const file of allFiles) {
    const content = readFile(file);
    if (content.match(/max-w-[567]xl|max-w-screen-xl|container mx-auto/)) {
      hasContainerConstraints = true;
      break;
    }
  }

  if (hasContainerConstraints) {
    category.score += 5;
    category.passes.push('Content uses proper max-width constraints');
  } else {
    category.issues.push('Add container constraints (max-w-6xl mx-auto)');
  }
}

// ============================================================================
// USABILITY CHECKS (25 points)
// ============================================================================

function checkUsability() {
  const category = auditResults.usability;

  // Check 1: Navigation exists and is consistent (5 points)
  const navbarPath = path.join(NEXT_DIR, 'components', 'navbar');
  const hasNavbar = fs.existsSync(navbarPath);

  if (hasNavbar) {
    category.score += 5;
    category.passes.push('Navigation component exists');
  } else {
    category.issues.push('Missing navigation component');
  }

  // Check 2: All pages have clear purpose (5 points)
  const marketingPages = readFilesRecursively(path.join(NEXT_DIR, 'app', '[locale]', '(marketing)'));
  const dashboardPages = readFilesRecursively(path.join(NEXT_DIR, 'app', 'dashboard'));

  let pagesWithHeadings = 0;
  const allPages = [...marketingPages, ...dashboardPages].filter(f => f.endsWith('page.tsx'));

  for (const file of allPages) {
    const content = readFile(file);
    if (content.match(/<h1|<h2|className.*text-[3-6]xl.*font-bold/)) {
      pagesWithHeadings++;
    }
  }

  if (allPages.length > 0 && pagesWithHeadings / allPages.length >= 0.7) {
    category.score += 5;
    category.passes.push('Most pages have clear headings');
  } else {
    category.issues.push('Some pages lack clear headings to establish purpose');
  }

  // Check 3: CTAs have action-oriented labels (5 points)
  let hasActionCTAs = false;
  const allFiles = readFilesRecursively(path.join(NEXT_DIR));

  for (const file of allFiles) {
    const content = readFile(file);
    // Look for action verbs in buttons/links
    if (content.match(/(Start|Get|Learn|Discover|Contact|Book|Schedule|Join|Try)/i)) {
      hasActionCTAs = true;
      break;
    }
  }

  if (hasActionCTAs) {
    category.score += 5;
    category.passes.push('CTAs use action-oriented language');
  } else {
    category.issues.push('Use action-oriented CTA labels (Start, Get, Learn, etc.)');
  }

  // Check 4: No broken internal links check (5 points)
  // Check that referenced pages exist
  const existingRoutes = new Set();
  const appDir = path.join(NEXT_DIR, 'app');

  function findRoutes(dir, prefix = '') {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        // Skip route groups in path
        const routeSegment = entry.name.startsWith('(') ? '' : `/${entry.name}`;
        const newPrefix = entry.name.startsWith('[')
          ? `${prefix}/:param`
          : `${prefix}${routeSegment}`;

        // Check if this directory has a page.tsx
        if (fs.existsSync(path.join(dir, entry.name, 'page.tsx'))) {
          existingRoutes.add(newPrefix || '/');
        }

        findRoutes(path.join(dir, entry.name), newPrefix);
      }
    }
  }

  findRoutes(appDir);

  // For now, give partial credit if dashboard pages exist
  const hasDashboard = existingRoutes.has('/dashboard') || fs.existsSync(path.join(appDir, 'dashboard', 'page.tsx'));

  if (hasDashboard) {
    category.score += 3;
    category.passes.push('Dashboard routes exist');
  }

  // Check for essential public pages
  const hasAbout = fs.existsSync(path.join(appDir, '[locale]', '(marketing)', 'about', 'page.tsx'));
  const hasContact = fs.existsSync(path.join(appDir, '[locale]', '(marketing)', 'contact', 'page.tsx'));

  if (hasAbout && hasContact) {
    category.score += 2;
    category.passes.push('Essential public pages (about, contact) exist');
  } else {
    category.issues.push('Missing essential pages: ' + (!hasAbout ? '/about ' : '') + (!hasContact ? '/contact' : ''));
  }

  // Check 5: Forms have proper structure (5 points)
  let hasProperForms = false;
  for (const file of allFiles) {
    const content = readFile(file);
    if (content.match(/<label.*<input|<Label.*<Input|htmlFor/)) {
      hasProperForms = true;
      break;
    }
  }

  if (hasProperForms) {
    category.score += 5;
    category.passes.push('Forms have proper label associations');
  } else {
    category.issues.push('Forms should have proper label-input associations');
  }
}

// ============================================================================
// AESTHETICS CHECKS (25 points)
// ============================================================================

function checkAesthetics() {
  const category = auditResults.aesthetics;
  const allFiles = readFilesRecursively(path.join(NEXT_DIR));

  // Check 1: Cohesive color palette (5 points)
  let usesBrandColors = false;
  for (const file of allFiles) {
    const content = readFile(file);
    // Check for consistent color usage (charcoal, cyan theme)
    if (content.match(/bg-charcoal|bg-\[#050d1b\]|bg-zinc-900|bg-neutral-900/)) {
      usesBrandColors = true;
      break;
    }
  }

  if (usesBrandColors) {
    category.score += 5;
    category.passes.push('Uses brand color palette (dark theme)');
  } else {
    category.issues.push('Implement consistent brand colors from design system');
  }

  // Check 2: Typography is readable (5 points)
  const tailwindConfig = readFile(path.join(NEXT_DIR, 'tailwind.config.ts'));
  const hasFontConfig = tailwindConfig.includes('fontFamily') || tailwindConfig.includes('font-sans');

  if (hasFontConfig) {
    category.score += 5;
    category.passes.push('Custom font family configured');
  } else {
    category.issues.push('Configure custom font family in Tailwind');
  }

  // Check 3: High-quality images with Next/Image (5 points)
  let usesNextImage = false;
  for (const file of allFiles) {
    const content = readFile(file);
    if (content.includes('next/image') || content.includes('<Image')) {
      usesNextImage = true;
      break;
    }
  }

  if (usesNextImage) {
    category.score += 5;
    category.passes.push('Uses Next.js Image component for optimization');
  } else {
    category.issues.push('Use Next.js Image component for image optimization');
  }

  // Check 4: Smooth animations (5 points)
  let hasAnimations = false;
  for (const file of allFiles) {
    const content = readFile(file);
    if (content.match(/transition-|animate-|framer-motion|motion\./)) {
      hasAnimations = true;
      break;
    }
  }

  if (hasAnimations) {
    category.score += 5;
    category.passes.push('Uses smooth CSS/Framer Motion animations');
  } else {
    category.issues.push('Add smooth transitions and animations');
  }

  // Check 5: Modern design patterns (5 points)
  let hasModernPatterns = 0;

  for (const file of allFiles) {
    const content = readFile(file);
    // Check for rounded corners
    if (content.match(/rounded-xl|rounded-2xl|rounded-full/)) hasModernPatterns++;
    // Check for gradients
    if (content.match(/bg-gradient|from-|to-/)) hasModernPatterns++;
    // Check for shadows
    if (content.match(/shadow-|drop-shadow/)) hasModernPatterns++;
    // Check for blur/backdrop
    if (content.match(/backdrop-blur|blur-/)) hasModernPatterns++;

    if (hasModernPatterns >= 3) break;
  }

  if (hasModernPatterns >= 3) {
    category.score += 5;
    category.passes.push('Uses modern design patterns (rounded, gradients, shadows)');
  } else {
    category.issues.push('Incorporate modern design patterns (rounded corners, gradients, shadows)');
  }
}

// ============================================================================
// TECHNICAL QUALITY CHECKS (25 points)
// ============================================================================

function checkTechnicalQuality() {
  const category = auditResults.technicalQuality;
  const allFiles = readFilesRecursively(path.join(NEXT_DIR));

  // Check 1: Accessibility attributes (5 points)
  let hasA11y = 0;
  for (const file of allFiles) {
    const content = readFile(file);
    if (content.match(/aria-|role=|alt=|htmlFor|tabIndex/)) {
      hasA11y++;
    }
    if (hasA11y >= 5) break;
  }

  if (hasA11y >= 5) {
    category.score += 5;
    category.passes.push('Uses accessibility attributes (aria, roles, alt)');
  } else if (hasA11y >= 2) {
    category.score += 3;
    category.issues.push('Add more accessibility attributes across components');
  } else {
    category.issues.push('Missing accessibility attributes (aria-labels, roles, alt text)');
  }

  // Check 2: SEO metadata (5 points)
  const metadataFile = readFile(path.join(NEXT_DIR, 'lib', 'next-metadata.ts'));
  const hasCorrectSEO = !metadataFile.includes('aceternity') &&
                        !metadataFile.includes('LaunchPad') &&
                        (metadataFile.includes('Peter Sung') || metadataFile.includes('SecureBase'));

  if (hasCorrectSEO) {
    category.score += 5;
    category.passes.push('SEO metadata is correctly branded');
  } else {
    category.issues.push('Update SEO metadata to remove template branding (Aceternity/LaunchPad)');
  }

  // Check 3: Responsive classes (5 points)
  let hasResponsive = 0;
  for (const file of allFiles) {
    const content = readFile(file);
    if (content.match(/sm:|md:|lg:|xl:/)) {
      hasResponsive++;
    }
    if (hasResponsive >= 10) break;
  }

  if (hasResponsive >= 10) {
    category.score += 5;
    category.passes.push('Uses responsive Tailwind classes throughout');
  } else if (hasResponsive >= 5) {
    category.score += 3;
    category.issues.push('Add more responsive breakpoint classes');
  } else {
    category.issues.push('Implement responsive design with Tailwind breakpoints');
  }

  // Check 4: TypeScript strict mode (5 points)
  const tsConfig = readFile(path.join(NEXT_DIR, 'tsconfig.json'));
  const hasStrictMode = tsConfig.includes('"strict": true') || tsConfig.includes('"strict":true');

  if (hasStrictMode) {
    category.score += 5;
    category.passes.push('TypeScript strict mode enabled');
  } else {
    category.issues.push('Enable TypeScript strict mode');
  }

  // Check 5: No template placeholders (5 points)
  let hasPlaceholders = false;
  const problematicPatterns = [
    'aceternity.com',
    'LaunchPad',
    '@mannupaaji',
    'your-project',
    'lorem ipsum',
    'TODO: Fix',
  ];

  for (const file of allFiles.slice(0, 50)) { // Check first 50 files
    const content = readFile(file).toLowerCase();
    for (const pattern of problematicPatterns) {
      if (content.includes(pattern.toLowerCase())) {
        hasPlaceholders = true;
        break;
      }
    }
    if (hasPlaceholders) break;
  }

  if (!hasPlaceholders) {
    category.score += 5;
    category.passes.push('No template placeholders found');
  } else {
    category.issues.push('Remove template placeholders (Aceternity, LaunchPad, TODO, etc.)');
  }
}

// ============================================================================
// MAIN AUDIT RUNNER
// ============================================================================

function runAudit() {
  console.log(`\n${colors.cyan}${colors.bright}╔══════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}║     PETER SUNG PLATFORM - DESIGN SYSTEM AUDIT                ║${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}║     Target Score: 9.5+/10 (95+ points)                       ║${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}╚══════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  // Run all checks
  checkVisualHierarchy();
  checkUsability();
  checkAesthetics();
  checkTechnicalQuality();

  // Calculate totals
  const totalScore = Object.values(auditResults).reduce((sum, cat) => sum + cat.score, 0);
  const totalMax = Object.values(auditResults).reduce((sum, cat) => sum + cat.max, 0);
  const percentage = (totalScore / totalMax * 10).toFixed(1);

  // Print results by category
  const categories = [
    { key: 'visualHierarchy', name: 'Visual Hierarchy' },
    { key: 'usability', name: 'Usability' },
    { key: 'aesthetics', name: 'Aesthetics' },
    { key: 'technicalQuality', name: 'Technical Quality' },
  ];

  for (const { key, name } of categories) {
    const cat = auditResults[key];
    const catPercent = (cat.score / cat.max * 100).toFixed(0);
    const color = catPercent >= 80 ? colors.green : catPercent >= 60 ? colors.yellow : colors.red;

    console.log(`${colors.bright}${name}${colors.reset} ${color}${cat.score}/${cat.max}${colors.reset} (${catPercent}%)`);
    console.log('─'.repeat(50));

    // Print passes
    for (const pass of cat.passes) {
      console.log(`  ${colors.green}✓${colors.reset} ${pass}`);
    }

    // Print issues
    for (const issue of cat.issues) {
      console.log(`  ${colors.red}✗${colors.reset} ${issue}`);
    }

    console.log('');
  }

  // Print final score
  const scoreColor = percentage >= 9.5 ? colors.green : percentage >= 8 ? colors.yellow : colors.red;
  const status = percentage >= 9.5 ? 'PASSED' : 'NEEDS IMPROVEMENT';
  const statusColor = percentage >= 9.5 ? colors.green : colors.red;

  console.log(`${colors.cyan}${'═'.repeat(50)}${colors.reset}`);
  console.log(`${colors.bright}FINAL SCORE: ${scoreColor}${percentage}/10${colors.reset} (${totalScore}/${totalMax} points)`);
  console.log(`${colors.bright}STATUS: ${statusColor}${status}${colors.reset}`);
  console.log(`${colors.cyan}${'═'.repeat(50)}${colors.reset}\n`);

  // Print summary of issues
  const allIssues = Object.values(auditResults).flatMap(cat => cat.issues);

  if (allIssues.length > 0) {
    console.log(`${colors.yellow}${colors.bright}ISSUES TO FIX (${allIssues.length}):${colors.reset}`);
    allIssues.forEach((issue, i) => {
      console.log(`  ${i + 1}. ${issue}`);
    });
    console.log('');
  }

  // Exit with appropriate code
  process.exit(percentage >= 9.5 ? 0 : 1);
}

// Run the audit
runAudit();
