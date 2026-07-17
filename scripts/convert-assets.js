const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const assets = [
  { name: 'Phanek.svg', width: 600 },
  { name: 'doll.svg', width: 600 },
  { name: 'chorki.svg', width: 400 },
  { name: 'loom.svg', width: 400 },
  { name: 'thing.svg', width: 300 },
  { name: 'An_Icon.dfqwtppe_9OhHI.svg', width: 250 },
  { name: 'arroba.D1T-WjYY_ZxELlA.svg', width: 250 }
];

const dir = path.join(__dirname, '../public/popup');

async function run() {
  for (const asset of assets) {
    const inputPath = path.join(dir, asset.name);
    const outputPath = path.join(dir, asset.name.replace(/\.svg$/, '.webp'));
    
    console.log(`Converting ${asset.name} to WebP at width ${asset.width}...`);
    try {
      if (!fs.existsSync(inputPath)) {
        console.error(`File does not exist: ${inputPath}`);
        continue;
      }
      
      await sharp(inputPath)
        .resize(asset.width)
        .webp({ quality: 90 })
        .toFile(outputPath);
      
      const stats = fs.statSync(outputPath);
      const kb = (stats.size / 1024).toFixed(1);
      console.log(`Success -> ${path.basename(outputPath)} (${kb} KB)`);
    } catch (err) {
      console.error(`Error converting ${asset.name}:`, err);
    }
  }
}

run();
