#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function bumpVersion(type = 'patch') {
  // Read current version from package.json
  const packagePath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const currentVersion = packageJson.version;
  
  // Parse version
  const parts = currentVersion.split('.').map(Number);
  
  // Bump version based on type
  switch (type) {
    case 'major':
      parts[0]++;
      parts[1] = 0;
      parts[2] = 0;
      break;
    case 'minor':
      parts[1]++;
      parts[2] = 0;
      break;
    case 'patch':
    default:
      parts[2]++;
      break;
  }
  
  const newVersion = parts.join('.');
  
  // Update package.json
  packageJson.version = newVersion;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
  
  // Update version.ts
  const versionPath = path.join(__dirname, '..', 'src', 'version.ts');
  fs.writeFileSync(versionPath, `export const VERSION = "${newVersion}";\n`);
  
  console.log(`Version bumped from ${currentVersion} to ${newVersion}`);
  console.log('Files updated:');
  console.log(`  - package.json: ${newVersion}`);
  console.log(`  - src/version.ts: ${newVersion}`);
  console.log('\nNext steps:');
  console.log('  1. Commit these changes');
  console.log('  2. Push to main branch');
  console.log('  3. GitHub Actions will automatically publish to npm');
}

// Get version type from command line arguments
const type = process.argv[2] || 'patch';

if (!['major', 'minor', 'patch'].includes(type)) {
  console.error('Invalid version type. Use: major, minor, or patch');
  process.exit(1);
}

bumpVersion(type); 