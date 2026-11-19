// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { SITE } from './site.config.mjs';

export default defineConfig({
  site: SITE,
  output: 'static',
  // React: las secciones se escriben en React y Astro las renderiza a HTML en el build.
  // Solo los componentes con directiva client:* cargan JavaScript en el navegador.
  integrations: [react(), sitemap()],
  // Fonts API: la fuente se descarga en el build y se sirve desde el propio sitio,
  // con fallback de métricas ajustadas (sin saltos de layout al cargar).
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Plus Jakarta Sans',
      cssVariable: '--font-jakarta',
      weights: [400, 500, 600, 700, 800],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
});
