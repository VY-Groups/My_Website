import sharp from 'sharp';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pub = path.join(root, 'public');

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

async function run() {
  const before = {
    pic: fs.statSync(path.join(pub, 'pic.jpeg')).size,
    favicon: fs.statSync(path.join(pub, 'favicon.png')).size,
  };

  // 1. Apple touch icon FIRST (needs the original 1748px source)
  await sharp(path.join(pub, 'favicon.png'))
    .resize(180, 180, { fit: 'cover' })
    .png({ compressionLevel: 9 })
    .toFile(path.join(pub, 'apple-touch-icon.tmp.png'));
  fs.renameSync(path.join(pub, 'apple-touch-icon.tmp.png'), path.join(pub, 'apple-touch-icon.png'));

  // 2. Favicon: proper 48x48 PNG (was a 1748px JPEG mislabeled as .png)
  await sharp(path.join(pub, 'favicon.png'))
    .resize(48, 48, { fit: 'cover' })
    .png({ compressionLevel: 9 })
    .toFile(path.join(pub, 'favicon.tmp.png'));
  fs.renameSync(path.join(pub, 'favicon.tmp.png'), path.join(pub, 'favicon.png'));

  // 3. Hero image: max 880px (displayed at 400px = 2x retina), mozjpeg q72
  await sharp(path.join(pub, 'pic.jpeg'))
    .resize({ width: 880, height: 880, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 72, mozjpeg: true })
    .toFile(path.join(pub, 'pic.tmp.jpg'));
  fs.renameSync(path.join(pub, 'pic.tmp.jpg'), path.join(pub, 'pic.jpeg'));

  const after = {
    pic: fs.statSync(path.join(pub, 'pic.jpeg')).size,
    favicon: fs.statSync(path.join(pub, 'favicon.png')).size,
    apple: fs.statSync(path.join(pub, 'apple-touch-icon.png')).size,
  };

  console.log(`pic.jpeg:        ${kb(before.pic)} -> ${kb(after.pic)}`);
  console.log(`favicon.png:     ${kb(before.favicon)} -> ${kb(after.favicon)} (48x48 PNG)`);
  console.log(`apple-touch:     ${kb(after.apple)} (180x180 PNG, new file)`);
  console.log(`total saved:     ${kb(before.pic + before.favicon - after.pic - after.favicon - after.apple)}`);
}

run();
