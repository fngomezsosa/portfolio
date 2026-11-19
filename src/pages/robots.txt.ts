/** Endpoint estático: genera /robots.txt en el build, con la URL del sitemap tomada de `site`. */
import type { APIRoute } from 'astro';
import { IS_STAGING } from '../../site.config.mjs';

export const GET: APIRoute = ({ site }) => {
  // Staging: bloquear a todos los buscadores.
  const body = IS_STAGING
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
