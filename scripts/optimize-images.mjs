import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const output = "public/optimized";
const images = [
  { source: "public/renhet-logo-white.png", name: "renhet-logo-white", widths: [88, 176, 360, 720] },
  { source: "public/renhet-symbol-white.png", name: "renhet-symbol-white", widths: [36, 72, 240, 480] },
  { source: "public/renhet-logo-dark.png", name: "renhet-logo-dark", widths: [208, 416] },
  { source: "public/beelze-pub/logo.png", name: "beelze-pub-logo", widths: [420, 556] },
  { source: "public/beelze-pub/beelze-pub-keyart.png", name: "beelze-pub-keyart", widths: [480, 800, 1200] },
  { source: "public/beelze-pub/screen-cocktails.jpg", name: "screen-cocktails", widths: [480, 800] },
  { source: "public/beelze-pub/screen-dialogue.jpg", name: "screen-dialogue", widths: [480, 800] },
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

// Social crawlers need a directly fetchable image, without picture/srcset negotiation.
await mkdir("public/social", { recursive: true });
const logo = await sharp("public/renhet-logo-dark.png")
  .resize({ width: 820 })
  .toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#f6f1e8" } })
  .composite([{ input: logo, gravity: "centre" }])
  .jpeg({ quality: 88 })
  .toFile("public/social/renhet-studio.jpg");
await sharp("public/beelze-pub/beelze-pub-keyart.png")
  .resize(1200, 630, { fit: "contain", background: "#344253" })
  .flatten({ background: "#344253" })
  .jpeg({ quality: 88 })
  .toFile("public/social/beelze-pub.jpg");
