#!/usr/bin/env node

/**
 * Generate secure random secrets for deployment
 * Usage: node generate-secrets.js
 */

import crypto from 'crypto';

// Generate a random string of specified length
function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('base64url').slice(0, length);
}

// Generate multiple secrets for Strapi
function generateStrapiSecrets() {
  return {
    APP_KEYS: Array(4).fill(null).map(() => generateSecret(32)).join(','),
    API_TOKEN_SALT: generateSecret(32),
    ADMIN_JWT_SECRET: generateSecret(32),
    JWT_SECRET: generateSecret(32),
    TRANSFER_TOKEN_SALT: generateSecret(32),
  };
}

// Generate NextAuth secret
function generateNextAuthSecret() {
  return generateSecret(32);
}

// Generate database password
function generateDatabasePassword() {
  return generateSecret(32);
}

// Display banner
console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║     Peter Sung - Secret Generator                         ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('🔐 Generated Secrets for Deployment\n');
console.log('─'.repeat(60));

// Generate Strapi secrets
console.log('\n📦 STRAPI BACKEND SECRETS:');
console.log('─'.repeat(60));
const strapiSecrets = generateStrapiSecrets();
Object.entries(strapiSecrets).forEach(([key, value]) => {
  console.log(`${key}=${value}`);
});

// Generate NextAuth secret
console.log('\n🔑 NEXTAUTH SECRET:');
console.log('─'.repeat(60));
console.log(`NEXTAUTH_SECRET=${generateNextAuthSecret()}`);

// Generate Database password
console.log('\n🗄️  DATABASE PASSWORD:');
console.log('─'.repeat(60));
console.log(`DATABASE_PASSWORD=${generateDatabasePassword()}`);

// Instructions
console.log('\n📋 INSTRUCTIONS:');
console.log('─'.repeat(60));
console.log('1. Copy the secrets above');
console.log('2. Add them to your Coolify environment variables');
console.log('3. NEVER commit these secrets to Git');
console.log('4. Store them securely (e.g., password manager)');
console.log('5. Rotate them regularly (every 90 days recommended)');

// Additional info
console.log('\n💡 TIPS:');
console.log('─'.repeat(60));
console.log('• Keep a backup of these secrets in a secure location');
console.log('• Each environment (dev/staging/prod) should have unique secrets');
console.log('• Document which secrets are used in which environment');
console.log('• Set up a reminder to rotate secrets quarterly');

console.log('\n✅ Generation complete!\n');

// Export as JSON if needed
const allSecrets = {
  strapi: strapiSecrets,
  nextauth: { NEXTAUTH_SECRET: generateNextAuthSecret() },
  database: { DATABASE_PASSWORD: generateDatabasePassword() },
  generated_at: new Date().toISOString(),
};

// Optionally write to file (commented out for security)
// const fs = require('fs');
// fs.writeFileSync('secrets.json', JSON.stringify(allSecrets, null, 2));
// console.log('💾 Secrets also saved to secrets.json (DO NOT COMMIT THIS FILE!)');
