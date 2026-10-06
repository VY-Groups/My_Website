/**
 * Generate PWA manifest icons at their REAL declared sizes.
 * Source: public/pic-800.webp (the 800x800 profile photo, same image as
 * favicon.png / apple-touch-icon.png but at higher resolution).
 *
 * Outputs:
 *   public/favicon-192.png           192x192 (purpose: any)
 *   public/favicon-512.png           512x512 (purpose: any)
 *   public/favicon-512-maskable.png  512x512, content at 80% safe zone
 *                                    on the theme background (purpose: maskable)
 *
 * The manifest (scripts/apply-identity.js) declares exactly these sizes,
 * which resolves Chrome's "Resource size is not correct" warning that fired
 * when every entry pointed at the 48x48 favicon.png.
 */
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import config from '../site.config.js';

const { colors } = config;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const SOURCE = path.join(root, 'public', 'pic-800.webp');
const OUT = (name) => path.join(root, 'public', name);

// Maskable safe zone: content must stay inside the inner 80% circle.
const MASKABLE_SIZE = 512;
const MASKABLE_CONTENT = Math.round(MASKABLE_SIZE * 0.8); // 410px
const BG = colors.background.replace('#', '');

async function main() {
  await sharp(SOURCE).resize(192, 192).png({ compressionLevel: 9 }).toFile(OUT('favicon-192.png'));
  await sharp(SOURCE).resize(512, 512).png({ compressionLevel: 9 }).toFile(OUT('favicon-512.png'));

  const content = await sharp(SOURCE)
    .resize(MASKABLE_CONTENT, MASKABLE_CONTENT)
    .png()
    .toBuffer();
  await sharp({
    create: {
      width: MASKABLE_SIZE,
      height: MASKABLE_SIZE,
      channels: 4,
      background: `#${BG}`,
    },
  })
    .composite([{ input: content, gravity: 'centre' }])
    .png({ compressionLevel: 9 })
    .toFile(OUT('favicon-512-maskable.png'));

  console.log('✓ generated favicon-192.png, favicon-512.png, favicon-512-maskable.png');
}

main().catch((err) => {
  console.error('icon generation failed:', err);
  process.exit(1);
});
