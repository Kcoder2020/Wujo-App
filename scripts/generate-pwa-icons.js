/**
 * PWA Icon Generator Script
 * 
 * This script generates PNG icons from the Wujo SVG logo for PWA installation.
 * 
 * Prerequisites:
 *   npm install sharp
 * 
 * Usage:
 *   node scripts/generate-pwa-icons.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_SVG = path.join(__dirname, '../src/assets/img/icon2.svg');
const OUTPUT_DIR = path.join(__dirname, '../public/img/icons');

// Icon sizes needed for PWA
const ICON_SIZES = [16, 32, 72, 96, 128, 144, 152, 180, 192, 384, 512];

// Maskable icon sizes (with padding for safe zone)
const MASKABLE_SIZES = [192, 512];

async function generateIcons() {
  console.log('🎨 Generating PWA icons from Wujo logo...\n');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Read the SVG file
  const svgBuffer = fs.readFileSync(INPUT_SVG);

  // Generate standard icons
  for (const size of ICON_SIZES) {
    const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);
    
    await sharp(svgBuffer)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 1, g: 64, b: 35, alpha: 1 } // #014023 - Wujo dark green
      })
      .png()
      .toFile(outputPath);
    
    console.log(`✅ Generated: icon-${size}x${size}.png`);
  }

  // Generate maskable icons (with safe zone padding)
  for (const size of MASKABLE_SIZES) {
    const outputPath = path.join(OUTPUT_DIR, `icon-maskable-${size}x${size}.png`);
    const innerSize = Math.floor(size * 0.8); // 80% of total size for safe zone
    const padding = Math.floor((size - innerSize) / 2);
    
    // Create the icon with padding for maskable safe zone
    await sharp(svgBuffer)
      .resize(innerSize, innerSize, {
        fit: 'contain',
        background: { r: 1, g: 64, b: 35, alpha: 1 }
      })
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 1, g: 64, b: 35, alpha: 1 }
      })
      .png()
      .toFile(outputPath);
    
    console.log(`✅ Generated: icon-maskable-${size}x${size}.png`);
  }

  console.log('\n🎉 All PWA icons generated successfully!');
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
}

generateIcons().catch(err => {
  console.error('❌ Error generating icons:', err);
  process.exit(1);
});
