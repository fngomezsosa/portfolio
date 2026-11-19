/**
 * Genera la imagen de Open Graph (1200×630) y los íconos a partir de HTML,
 * con el Chromium de Playwright. Correr a mano si cambian nombre, rol o estética:
 *   npm run images
 * Los PNG resultantes se commitean en public/.
 */
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';

const OUT = new URL('../public/', import.meta.url);
const desk = readFileSync(new URL('../src/assets/escritorio-mate.jpg', import.meta.url)).toString('base64');
const font = "'Plus Jakarta Sans', system-ui, 'DejaVu Sans', sans-serif";

const og = `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; position: relative; overflow: hidden; background: #040807; color: #eef5f1; font-family: ${font}; }
  .bg { position: absolute; inset: 0; background: url(data:image/jpeg;base64,${desk}) 75% 55% / cover; }
  .shade { position: absolute; inset: 0; background: linear-gradient(90deg, #040807 0%, rgb(4 8 7 / .94) 38%, rgb(4 8 7 / .45) 65%, rgb(4 8 7 / .1) 100%); }
  .content { position: absolute; left: 80px; top: 0; bottom: 0; display: flex; flex-direction: column; justify-content: center; }
  .badge { align-self: flex-start; padding: 8px 18px; border: 1.5px solid rgb(46 229 157 / .4); border-radius: 999px; color: #2ee59d; font-size: 24px; font-weight: 600; }
  h1 { margin-top: 26px; font-size: 104px; line-height: .96; font-weight: 800; letter-spacing: -4px; }
  h1 span { display: block; background: linear-gradient(100deg, #5ff5b8, #2ee59d 45%, #12c784); -webkit-background-clip: text; color: transparent; }
  p { margin-top: 28px; max-width: 700px; font-size: 28px; line-height: 1.4; color: #c9d8d0; }
</style></head><body>
  <div class="bg"></div><div class="shade"></div>
  <div class="content">
    <div class="badge">Desarrollador Backend Python | IA y agentes</div>
    <h1>Federico<span>Gómez</span></h1>
    <p>Python, Inteligencia Artificial y productos SaaS.</p>
  </div>
</body></html>`;

const icon = (size: number, radius: number) => `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin: 0; }
  html, body { width: ${size}px; height: ${size}px; background: transparent; }
  div { box-sizing: border-box; width: 100%; height: 100%; border-radius: ${radius}px; background: #06100c;
        border: ${Math.max(1, Math.round(size / 16))}px solid #2ee59d; display: grid; place-items: center;
        color: #2ee59d; font: 800 ${Math.round(size * 0.42)}px/1 ${font}; letter-spacing: -0.02em; }
</style></head><body><div>FG</div></body></html>`;

/** ICO con un PNG embebido (formato válido; lo aceptan todos los navegadores). */
function pngToIco(png: Buffer, size: number): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size, 0);
  entry.writeUInt8(size, 1);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(22, 12);
  return Buffer.concat([header, entry, png]);
}

const browser = await chromium.launch();
async function render(html: string, width: number, height: number, transparent = false): Promise<Buffer> {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(html);
  const buffer = await page.screenshot({ omitBackground: transparent });
  await page.close();
  return buffer;
}

writeFileSync(new URL('og.png', OUT), await render(og, 1200, 630));
writeFileSync(new URL('apple-touch-icon.png', OUT), await render(icon(180, 0), 180, 180));
writeFileSync(new URL('icon-512.png', OUT), await render(icon(512, 0), 512, 512));
writeFileSync(new URL('favicon.ico', OUT), pngToIco(await render(icon(32, 8), 32, 32, true), 32));
await browser.close();
console.log('og.png, apple-touch-icon.png, icon-512.png y favicon.ico generados en public/');
