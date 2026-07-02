/**
 * One-off asset generator: rasterises public/icon.svg and public/og-image.svg
 * into the favicon / PWA / social images referenced by index.html.
 *
 * Run with: node scripts/gen-icons.mjs
 * Requires devDeps: sharp, png-to-ico (installed on demand, not shipped).
 */
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const iconSvg = readFileSync(join(pub, 'icon.svg'));
const ogSvg = readFileSync(join(pub, 'og-image.svg'));

const png = (size) => sharp(iconSvg, { density: 384 }).resize(size, size).png();

// PWA + Apple icons
await png(192).toFile(join(pub, 'icon-192.png'));
await png(512).toFile(join(pub, 'icon-512.png'));
await png(180).toFile(join(pub, 'apple-touch-icon.png'));

// favicon.ico (multi-size, PNG-encoded entries)
const icoSizes = await Promise.all([16, 32, 48].map((s) => png(s).toBuffer()));
writeFileSync(join(pub, 'favicon.ico'), await pngToIco(icoSizes));

// Social share image (JPEG keeps it light for scrapers)
await sharp(ogSvg, { density: 144 })
  .resize(1200, 630)
  .jpeg({ quality: 86 })
  .toFile(join(pub, 'og-image.jpg'));

console.log('Icons + og-image generated in /public');
