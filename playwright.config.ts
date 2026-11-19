import { defineConfig, devices } from '@playwright/test';

/**
 * Tests contra el build de producción (`astro preview` sirve dist/), no contra el dev server.
 * Puerto propio y sin reutilizar servidores: un `astro dev` abierto en el 4321 no interfiere.
 */
const PORT = 4322;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: { baseURL: `http://localhost:${PORT}` },
  projects: [
    {
      name: 'mobile-375',
      use: { ...devices['Desktop Chrome'], viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true },
    },
    {
      name: 'tablet-768',
      use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true },
    },
    {
      name: 'desktop-1440',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    // --ignore-lock: Astro 7 manda `preview` a segundo plano si detecta un agente/CI;
    // Playwright necesita el proceso en primer plano.
    command: `npm run build && npx astro preview --ignore-lock --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
