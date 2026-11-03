import fs from 'node:fs';
import sharp from 'sharp';

async function defringeSkelly() {
  const src = 'public/beelze-pub/skelly-anim.gif';
  const backup = 'public/beelze-pub/skelly-anim.original.gif';
  
  if (!fs.existsSync(backup)) {
    fs.copyFileSync(src, backup);
    console.log('Backed up original gif to', backup);
  }

  const origMeta = await sharp(backup, { animated: true }).metadata();
  console.log('Original GIF metadata:', {
    width: origMeta.width,
    height: origMeta.height,
    pageHeight: origMeta.pageHeight,
    pages: origMeta.pages,
    delayCount: origMeta.delay?.length
  });

  const { data, info } = await sharp(backup, { animated: true })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const pageHeight = origMeta.pageHeight;
  const pages = origMeta.pages;

  const copy = Buffer.from(data);

  function defringePass(buf, threshold) {
    let count = 0;
    const toClear = [];
    for (let page = 0; page < pages; page++) {
      const yOffset = page * pageHeight;
      for (let y = 1; y < pageHeight - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const curY = yOffset + y;
          const idx = (curY * width + x) * channels;
          if (buf[idx + 3] > 0) {
            const hasZeroNeighbor =
              buf[((curY - 1) * width + x) * channels + 3] === 0 ||
              buf[((curY + 1) * width + x) * channels + 3] === 0 ||
              buf[(curY * width + (x - 1)) * channels + 3] === 0 ||
              buf[(curY * width + (x + 1)) * channels + 3] === 0;
            if (hasZeroNeighbor) {
              const r = buf[idx], g = buf[idx + 1], b = buf[idx + 2];
              const lum = 0.299 * r + 0.587 * g + 0.114 * b;
              if (lum > threshold) {
                toClear.push(idx + 3);
              }
            }
          }
        }
      }
    }
    for (const aIdx of toClear) {
      buf[aIdx] = 0;
      count++;
    }
    return count;
  }

  const p1 = defringePass(copy, 130);
  const p2 = defringePass(copy, 150);
  console.log(`Defringed all ${pages} frames: Pass 1 cleared ${p1} pixels, Pass 2 cleared ${p2} pixels`);

  const outBuf = await sharp(copy, {
    raw: {
      width,
      height,
      channels,
      pageHeight
    }
  })
  .gif({
    loop: 0,
    delay: origMeta.delay
  })
  .toBuffer();

  fs.writeFileSync(src, outBuf);
  console.log(`Saved defringed GIF to ${src} (${outBuf.length} bytes)`);

  const verifyMeta = await sharp(src, { animated: true }).metadata();
  console.log('Verified output GIF:', {
    width: verifyMeta.width,
    height: verifyMeta.height,
    pageHeight: verifyMeta.pageHeight,
    pages: verifyMeta.pages,
    delayCount: verifyMeta.delay?.length
  });
}

defringeSkelly().catch(console.error);
