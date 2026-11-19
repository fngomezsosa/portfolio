/**
 * URL pública del sitio: la usan astro.config.mjs (sitemap, canonical, Open Graph) y los tests.
 * En cada entorno se define con la variable SITE_URL (producción: https://federicogomez.dev;
 * staging: la URL de ese entorno). Si no está definida, se usa el dominio de producción.
 */
export const SITE = process.env.SITE_URL || 'https://federicogomez.dev';

/**
 * Staging (STAGING=true): el sitio se publica con <meta name="robots" content="noindex">
 * y robots.txt bloquea todo, para que los buscadores no indexen una copia de prueba.
 */
export const IS_STAGING = process.env.STAGING === 'true';
