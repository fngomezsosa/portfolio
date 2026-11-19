# Portfolio · Federico Gómez

Portfolio personal one page: **Desarrollador Backend Python | IA y agentes**.
Sitio estático hecho con **Astro + React + TypeScript**, publicado en **https://federicogomez.dev** (Render Static Site).

| Lighthouse (mobile) | Performance | Accessibility | Best Practices | SEO |
| ------------------- | ----------- | ------------- | -------------- | --- |
| Home                | 98          | 100           | 100            | 100 |

## Cómo ejecutarlo

Requiere Node 22.23.4 o superior (fijado en `.nvmrc`).

```bash
nvm use
npm install
npm run dev        # desarrollo en http://localhost:4321
npm run build      # chequeo de tipos (astro check) + build estático en dist/
npm run preview    # sirve dist/ tal como se publica
npm test           # Playwright: build + tests en 375, 768 y 1440 px
npm run images     # regenera og.png y los íconos (solo si cambia nombre, rol o estética)
```

## Arquitectura

**Astro + React.** Todas las secciones son componentes React (`.tsx`). Astro los renderiza a HTML en el build,
así el contenido llega sin esperar JavaScript (rápido y bueno para SEO). Solo dos componentes se hidratan en el
navegador (*islands*):

| Island         | Directiva        | Por qué                                                            |
| -------------- | ---------------- | ------------------------------------------------------------------ |
| `Header`       | `client:load`    | Menú hamburguesa y sección activa: tiene que responder enseguida.  |
| `TechCarousel` | `client:visible` | Se hidrata recién cuando el stack entra en pantalla.               |

```
src/
├── config/
│   ├── site.ts           # nombre, rol, email, LinkedIn, WhatsApp, CV, URL de GP-Tech
│   └── navigation.ts     # secciones del menú (en el orden de la página)
├── data/
│   ├── about.ts          # texto e indicadores de "Sobre mí" y del hero
│   ├── projects.ts       # TuPropIA, TuAgencIA, GP-Tech (funcionalidades implementadas)
│   ├── experience.ts     # trayectoria (fuente: CV)
│   └── stack.ts          # tecnologías por categoría + íconos
├── assets/               # foto, imagen del escritorio y logos originales (Astro los optimiza)
├── components/
│   ├── ui/               # Button, SectionHeading, Logo, TechIcon, íconos de marca
│   ├── sections/         # Hero, About, Projects, Stack, Experience, Contact, Footer
│   └── islands/          # Header, TechCarousel  ← únicos con JavaScript en el navegador
├── layouts/BaseLayout.astro   # <head>: SEO, Open Graph, fuente; animación de aparición
├── lib/images.ts         # optimización de imágenes para componentes React
├── pages/
│   ├── index.astro       # arma la página y optimiza las imágenes
│   ├── 404.astro
│   └── robots.txt.ts     # endpoint estático
└── styles/global.css     # tokens de diseño (colores, espacios, radios)
```

Los estilos de cada componente están en su `*.module.css` (CSS Modules: clases con scope por componente).

## Cómo editar el contenido

No hace falta tocar componentes:

- **Datos de contacto y enlaces:** `src/config/site.ts`.
- **Proyectos:** `src/data/projects.ts`. Solo funcionalidades implementadas en `features`; lo planificado va en
  `planned`, que se muestra separado con el rótulo "Planificado".
- **Experiencia:** `src/data/experience.ts`. La duración de cada puesto se calcula sola; el puesto actual se
  calcula hasta la fecha del build.
- **Stack:** `src/data/stack.ts`. Los íconos de marca son de [Simple Icons](https://simpleicons.org) (CC0);
  AWS, OpenAI y los conceptos sin marca (LLMs, RAG…) usan íconos genéricos de [Lucide](https://lucide.dev).
- **Imágenes:** reemplazar el archivo en `src/assets/` con el mismo nombre. Astro genera WebP en varios tamaños.

## Funcionalidades

- **Header sticky** con la sección activa resaltada; menú hamburguesa en mobile y tablet (Esc cierra y devuelve el
  foco al botón).
- **Desplazamiento suave** entre secciones (desactivado con `prefers-reduced-motion`).
- **Carrusel del stack:** avance continuo en loop infinito, pausa con el cursor o el foco, flechas, arrastre
  táctil (scroll nativo) y botón de pausa (WCAG 2.2.2). Con *reduced motion* no avanza solo.
- **Animaciones de aparición** al scrollear: solo opacidad y desplazamiento. Sin JS o con reduced motion, todo se
  ve de entrada.
- **SEO:** meta tags, Open Graph con imagen propia (`public/og.png`), datos estructurados `Person`, sitemap,
  `robots.txt`, 404 propia.
- **Imágenes optimizadas:** WebP con `srcset`, dimensiones fijas (sin saltos de layout), carga diferida fuera de la
  primera pantalla; la imagen del hero se precarga.
- **Fuente** Plus Jakarta Sans servida desde el propio sitio (Fonts API de Astro), con fallback de métricas
  ajustadas.

## Tests

Playwright corre contra el **build de producción**, en tres anchos (375, 768 y 1440 px), en un puerto propio
(4322) para no interferir con un `astro dev` abierto. Cubren: contenido del hero, navegación y sección activa,
menú hamburguesa (abrir, navegar, Esc y foco), enlaces internos y externos (`target`/`rel`), proyectos sin
enlaces redundantes, carrusel (avance, loop, pausa por hover y por botón, flechas, swipe táctil, reduced motion),
experiencia, contacto sin formulario, footer, desbordes, `alt` en imágenes, accesibilidad con axe (WCAG 2.1 AA) y
SEO. Las capturas quedan en `screenshots/` (ignorado por git).

## Deploy (Render Static Site)

El sitio está publicado en Render como **Static Site**. La configuración vive en el panel de Render (no hay
`render.yaml` en el repo):

| Campo                 | Valor                         |
| --------------------- | ----------------------------- |
| **Build Command**     | `npm ci && npm run build`     |
| **Publish Directory** | `dist`                        |
| **Branch**            | `main`                        |

`npm run build` corre `astro check` (chequeo de tipos) y después `astro build`; si hay un error de tipos, el deploy
falla y queda publicada la versión anterior.

### Variables de entorno

| Variable       | Producción                  | Para qué sirve                                                                 |
| -------------- | --------------------------- | ------------------------------------------------------------------------------ |
| `NODE_VERSION` | `22.23.4`                   | Astro 7 requiere Node 22.23.4 o superior (la misma versión que `.nvmrc`).      |
| `SITE_URL`     | `https://federicogomez.dev` | URL pública: canonical, Open Graph (`og:url`, `og:image`), sitemap y robots.  |
| `STAGING`      | no definida                 | Solo para entornos de prueba (ver abajo).                                      |

`SITE_URL` se lee en `site.config.mjs`. Si no está definida, se usa `https://federicogomez.dev`.

**`STAGING`** solo se activa con el valor exacto `true` (cualquier otro valor, o no definirla, equivale a
producción). Con `STAGING=true`:

- todas las páginas llevan `<meta name="robots" content="noindex">` en lugar de `<link rel="canonical">`
  (`src/layouts/BaseLayout.astro`);
- `robots.txt` pasa a `Disallow: /` y no menciona el sitemap (`src/pages/robots.txt.ts`).

El contenido, el diseño, el Open Graph y el sitemap no cambian. En producción, `STAGING` no debe existir (o debe
tener un valor distinto de `true`).

### Dominio propio

- Dominio `federicogomez.dev`, registrado en Cloudflare Registrar; el DNS está en Cloudflare.
- En Render, el dominio está agregado como **Custom Domain** del Static Site.
- En el DNS de Cloudflare hay registros **CNAME** para `@` y para `www` que apuntan al servicio de Render, en modo
  **DNS only** (sin el proxy de Cloudflare).
- El certificado HTTPS lo emite y renueva Render.

Si el dominio cambia: actualizar `SITE_URL` en Render y el valor por defecto en `site.config.mjs`, correr
`npm test` y hacer push.

### Headers HTTP

`public/_headers` define headers de seguridad y cache inmutable para `/_astro/*`, pero **Render no lo aplica**: se
copia a `dist/` y se publica como un archivo más. Los headers en Render se configuran desde el panel del Static Site.

### Cómo se actualiza el sitio

Render construye y publica la rama `main` configurada en el Static Site. Con **Auto-Deploy** activado
(Settings → Build & Deploy), cada push a `main` dispara un deploy; si está desactivado, el deploy se lanza a
mano con **Manual Deploy**. El estado de cada deploy y sus logs se ven en el panel de Render.

Antes de hacer push, conviene verificar en local:

```bash
nvm use
npm ci
npm run build      # chequeo de tipos + build en dist/
npm test           # Playwright contra el build de producción (375, 768 y 1440 px)
npm run preview    # para revisar dist/ en el navegador
```

### Cómo actualizar el CV

Reemplazar `public/Federico_Gomez_CV.pdf` por la versión nueva **conservando exactamente ese nombre**: lo usa `cv`
en `src/config/site.ts` y de ahí el botón "Descargar CV" del hero. Si el archivo tiene otro nombre, el botón
lleva a un 404. Después, push a `main`.

## Formulario de contacto (pendiente)

No está implementado. Para sumarlo sin backend propio, la opción recomendada es
[Web3Forms](https://web3forms.com) (gratis hasta 250 envíos/mes, con protección anti-spam): crear la clave con el
email de destino, agregar un island React con validación (`client:visible`) que haga `POST` a su API, y mostrar
éxito solo con la respuesta real del servicio.
