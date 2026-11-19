import type { Page } from '@playwright/test';

/**
 * Recorre la página como un usuario: dispara las animaciones de aparición y la carga
 * de imágenes lazy. Espera a que todo esté visible y cargado.
 */
export async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  // Con reduced motion (o sin JS) no hay animación de aparición: no hay nada que esperar.
  await page.waitForFunction(
    () =>
      !document.documentElement.classList.contains('reveal-ready') ||
      [...document.querySelectorAll('[data-reveal]')].every((el) => el.classList.contains('is-visible')),
  );
  await page.waitForFunction(() => [...document.images].every((img) => img.complete && img.naturalWidth > 0));
  await page.waitForTimeout(800); // fin de las transiciones
}

/** Layout de escritorio de las secciones (≥ 1024px). */
export const isDesktop = (page: Page) => page.viewportSize()!.width >= 1024;

/** Menú de escritorio en el header (≥ 1200px); por debajo, menú hamburguesa. */
export const hasDesktopNav = (page: Page) => page.viewportSize()!.width >= 1200;
