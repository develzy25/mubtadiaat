const sharp = require('sharp');
const fs = require('fs');

async function processLogo() {
  const input = 'mobile/assets/logo.png';
  
  // 1. Get metadata
  const metadata = await sharp(input).metadata();
  const size = Math.min(metadata.width, metadata.height);
  
  // 2. Crop to square and apply a rounded mask
  const radius = size * 0.25; // 25% rounding
  
  const svgMask = `
    <svg width="${size}" height="${size}">
      <rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="white" />
    </svg>
  `;

  // Resize input to square, then apply mask
  const rounded = await sharp(input)
    .resize(size, size, { fit: 'cover' })
    .composite([{
      input: Buffer.from(svgMask),
      blend: 'dest-in'
    }])
    .png()
    .toBuffer();

  // Save the master rounded version back to logo.png
  await sharp(rounded).toFile('mobile/assets/logo.png');
  await sharp(rounded).toFile('admin/public/logo.png');
  await sharp(rounded).toFile('admin/src/assets/logo.png');

  // Mobile icons
  await sharp(rounded).resize(1024, 1024).toFile('mobile/assets/icon.png');
  await sharp(rounded).resize(1024, 1024).toFile('mobile/assets/adaptive-icon.png');
  await sharp(rounded).resize(1024, 1024).toFile('mobile/assets/splash-icon.png');
  await sharp(rounded).resize(192, 192).toFile('mobile/assets/favicon.png');
  
  // Android specific from previous listing
  await sharp(rounded).resize(1024, 1024).toFile('mobile/assets/android-icon-foreground.png');
  // Usually background is a solid color for adaptive icons, but let's make it white or use the rounded
  await sharp({
    create: {
      width: 1024,
      height: 1024,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  }).png().toFile('mobile/assets/android-icon-background.png');
  
  await sharp(rounded).resize(1024, 1024).toFile('mobile/assets/android-icon-monochrome.png');

  console.log("All logos generated successfully!");
}

processLogo().catch(console.error);
