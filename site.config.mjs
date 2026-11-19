/**
 * URL pública del sitio: la usan astro.config.mjs (sitemap, canonical, Open Graph) y los tests.
 * Se puede sobrescribir por entorno, p. ej. en staging:
 *   SITE_URL=https://portfolio-xxxx.onrender.com
 * Cuando conectes un dominio propio, cambiá el valor por defecto acá.
 */
export const SITE = process.env.SITE_URL || 'https://federicogomez.pages.dev';

/**
 * Staging (STAGING=true): el sitio se publica con <meta name="robots" content="noindex">
 * y robots.txt bloquea todo, para que los buscadores no indexen una copia de prueba.
 */
export const IS_STAGING = process.env.STAGING === 'true';
