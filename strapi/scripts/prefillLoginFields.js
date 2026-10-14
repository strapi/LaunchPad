import fs from 'node:fs';
import path from 'node:path';

// Base directory and target files
const directoryPath =
  './node_modules/@strapi/admin/dist/admin/admin/src/pages/Auth/components';
const targetFiles = ['Login.js', 'Login.mjs']; // You can add more files here

// Content to replace
const originalContent = `initialValues: {
                                email: '',
                                password: '',
                                rememberMe: false
                            },`;

const newContent = `initialValues: {
                                email: "admin@strapidemo.com",
                                password: "welcomeToStrapi123",
                                rememberMe: false
                            },`;

let found = 0;

targetFiles.forEach((file) => {
  const filePath = path.join(directoryPath, file);

  if (fs.existsSync(filePath) === false) {
    console.log(`⚠️ No matching file found for: ${file}`);
    return;
  }

  found++;
  const data = fs.readFileSync(filePath, 'utf8');

  if (data.includes(newContent)) {
    console.log(`✅ File already modified with demo credentials: ${filePath}`);
  } else if (data.includes(originalContent)) {
    fs.writeFileSync(
      filePath,
      data.replace(originalContent, newContent),
      'utf8'
    );
    console.log(`✅ Successfully updated: ${filePath}`);
  } else {
    console.log(`⚠️ Original content not found in: ${filePath}`);
    process.exit(1);
  }
});

if (found === 0) {
  console.error(
    '❌ No Login.js / Login.mjs found — admin dist layout may have changed.'
  );
  process.exit(1);
}
