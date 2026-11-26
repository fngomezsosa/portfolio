import { test, expect } from '@playwright/test';
import { SITE } from '../site.config.mjs';

test.describe('SEO y publicación', () => {
  test.skip(({ isMobile }) => isMobile, 'Independiente del viewport: corre solo en desktop.');

  test('meta tags y Open Graph', async ({ page }) => {
    await page.goto('/');
    const meta = (sel: string) => page.locator(sel).first().getAttribute('content');
    await expect(page).toHaveTitle('Federico Gómez · Desarrollador Backend Python | IA y agentes');
    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe(`${SITE}/`);
    expect(await meta('meta[name="description"]')).toContain('más de 11 años');
    expect(await meta('meta[property="og:title"]')).toBe(await page.title());
    expect(await meta('meta[property="og:image"]')).toBe(`${SITE}/og.png`);
    expect(await meta('meta[name="twitter:card"]')).toBe('summary_large_image');
  });

  test('imagen OG de 1200×630 e íconos servidos', async ({ page, request }) => {
    await page.goto('/og.png');
    expect(await page.evaluate(() => [document.images[0].naturalWidth, document.images[0].naturalHeight])).toEqual([1200, 630]);
    for (const href of ['/favicon.ico', '/favicon.svg', '/apple-touch-icon.png']) {
      expect((await request.get(href)).status(), href).toBe(200);
    }
  });

  test('datos estructurados Person', async ({ page }) => {
    await page.goto('/');
    const data = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
    expect(data['@type']).toBe('Person');
    expect(data.name).toBe('Federico Nicolás Gómez');
    expect(data.sameAs).not.toContain('https://github.com/fngomezsosa');
  });

  test('robots.txt y sitemap', async ({ request }) => {
    expect(await (await request.get('/robots.txt')).text()).toContain(`Sitemap: ${SITE}/sitemap-index.xml`);
    const sitemap = await (await request.get('/sitemap-0.xml')).text();
    expect(sitemap).toContain(`<loc>${SITE}/</loc>`);
    expect(sitemap).not.toContain('404');
  });

  test('404 propia, sin indexar', async ({ page }) => {
    await page.goto('/404.html');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Esta página no existe');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  });
});
