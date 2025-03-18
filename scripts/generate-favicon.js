const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Check if we have the required packages
const checkDependencies = () => {
  return new Promise((resolve, reject) => {
    exec('npm list -g sharp png-to-ico', (err, stdout) => {
      const hasDependencies = !stdout.includes('empty');
      resolve(hasDependencies);
    });
  });
};

// Install dependencies if needed
const installDependencies = () => {
  console.log('Installing required dependencies...');
  return new Promise((resolve, reject) => {
    exec('npm install -g sharp png-to-ico', (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

// Generate favicon using Sharp and png-to-ico
const generateFavicon = async () => {
  try {
    // Import dynamically after ensuring deps are installed
    const sharp = require('sharp');
    const pngToIco = require('png-to-ico');
    
    const svgPath = path.join(__dirname, '../frontend/public/favicon.svg');
    const pngPath = path.join(__dirname, '../frontend/public/favicon.png');
    const icoPath = path.join(__dirname, '../frontend/public/favicon.ico');
    
    // Sizes for favicon
    const sizes = [16, 32, 48, 64, 128, 256];
    
    // Convert SVG to PNG with the largest size first
    await sharp(svgPath)
      .resize(sizes[sizes.length - 1], sizes[sizes.length - 1])
      .png()
      .toFile(pngPath);
    
    console.log('Generated PNG from SVG');
    
    // Convert PNG to ICO with various sizes
    const icoBuffer = await pngToIco([pngPath]);
    
    // Write the ICO file
    fs.writeFileSync(icoPath, icoBuffer);
    
    console.log('Successfully generated favicon.ico');
  } catch (error) {
    console.error('Error generating favicon:', error);
  }
};

// Main function
const main = async () => {
  const hasDeps = await checkDependencies();
  
  if (!hasDeps) {
    await installDependencies();
  }
  
  await generateFavicon();
};

main().catch(console.error); 