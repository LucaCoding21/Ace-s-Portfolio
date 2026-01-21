const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Directories
const sourceDir = path.join(__dirname, '../public/images/shows');
const outputDir = path.join(__dirname, '../public/images/optimized');

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Get all jpg files recursively
function getJpgFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getJpgFiles(fullPath));
    } else if (item.toLowerCase().endsWith('.jpg') || item.toLowerCase().endsWith('.jpeg')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Check if sips is available (macOS)
function hasSips() {
  try {
    execSync('which sips', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

console.log('Optimizing images for web...\n');

const files = getJpgFiles(sourceDir);
console.log(`Found ${files.length} images to optimize\n`);

if (!hasSips()) {
  console.log('Error: sips not found. This script requires macOS.');
  process.exit(1);
}

for (const file of files) {
  const relativePath = path.relative(sourceDir, file);
  const outputPath = path.join(outputDir, relativePath);
  const outputDirPath = path.dirname(outputPath);

  // Create subdirectory if needed
  if (!fs.existsSync(outputDirPath)) {
    fs.mkdirSync(outputDirPath, { recursive: true });
  }

  console.log(`Processing: ${relativePath}`);

  try {
    // Use sips to resize (macOS built-in)
    // Resize to max 1920px width, maintaining aspect ratio
    execSync(`sips -Z 1920 "${file}" --out "${outputPath}"`, { stdio: 'ignore' });

    const originalSize = fs.statSync(file).size;
    const newSize = fs.statSync(outputPath).size;
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);

    console.log(`  ${(originalSize / 1024 / 1024).toFixed(1)}MB → ${(newSize / 1024 / 1024).toFixed(1)}MB (${savings}% smaller)\n`);
  } catch (err) {
    console.log(`  Error: ${err.message}\n`);
  }
}

console.log('Done! Optimized images saved to public/images/optimized/');
console.log('\nUpdate lib/shows.ts to use /images/optimized/ paths instead of /images/shows/');
