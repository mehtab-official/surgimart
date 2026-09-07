const sharp = require('sharp');

async function buildCleanBanner() {
  const width = 1879;
  const height = 700;
  const rightWidth = 1129;

  // Extract the right side containing the surgeon hands, gloves and precision instruments
  const rawRight = await sharp('public/images/image4.png')
    .extract({ left: 750, top: 0, width: rightWidth, height: height })
    .toBuffer();

  const maskSvg = Buffer.from(
    '<svg width="' + rightWidth + '" height="' + height + '">' +
    '<defs>' +
    '<linearGradient id="fade" x1="0%" y1="0%" x2="100%" y2="0%">' +
    '<stop offset="0%" stop-color="white" stop-opacity="0" />' +
    '<stop offset="20%" stop-color="white" stop-opacity="0.5" />' +
    '<stop offset="40%" stop-color="white" stop-opacity="1" />' +
    '<stop offset="100%" stop-color="white" stop-opacity="1" />' +
    '</linearGradient>' +
    '</defs>' +
    '<rect width="' + rightWidth + '" height="' + height + '" fill="url(#fade)" />' +
    '</svg>'
  );

  const featheredRight = await sharp(rawRight)
    .composite([{ input: maskSvg, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const baseCanvas = await sharp({
    create: {
      width: width,
      height: height,
      channels: 4,
      background: { r: 3, g: 7, b: 18, alpha: 1 } // #030712
    }
  }).png().toBuffer();

  await sharp(baseCanvas)
    .composite([
      { input: featheredRight, left: width - rightWidth, top: 0 }
    ])
    .toFile('public/images/image4-clean-banner.png');

  console.log('SUCCESS: image4-clean-banner.png created with zero ghost text!');
}

buildCleanBanner().catch(console.error);
