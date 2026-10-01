import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const output = "public/optimized";
const images = [
  { source: "public/renhet-logo-white.png", name: "renhet-logo-white", widths: [88, 176, 360, 720] },
  { source: "public/renhet-logo-dark.png", name: "renhet-logo-dark", widths: [208, 416] },
  { source: "public/beelze-pub/logo.png", name: "beelze-pub-logo", widths: [420, 556] },
];

await mkdir(output, { recursive: true });
for (const { source, name, widths } of images) {
  for (const width of widths) {
    const resized = sharp(source).resize({ width, withoutEnlargement: true });
    await Promise.all([
      resized.clone().avif({ quality: 70 }).toFile(join(output, `${name}-${width}.avif`)),
      resized.clone().webp({ quality: 78 }).toFile(join(output, `${name}-${width}.webp`)),
    ]);
  }
}
