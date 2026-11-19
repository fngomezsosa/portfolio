# Portfolio · Federico Gómez

Portfolio personal one page: **Desarrollador Backend Python | IA y agentes**.
Sitio estático hecho con **Astro + React + TypeScript**, desplegable en Cloudflare Pages.

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
│   ├── site.ts           # nombre, rol, email, LinkedIn, GitHub, WhatsApp, URL de GP-Tech
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

## Deploy en Cloudflare Pages

1. Subir el repo a GitHub.
2. En Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** y elegir el repo.
3. Configuración del build:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Variable de entorno:** `NODE_VERSION` = `22.23.4`
4. Nombre del proyecto `federicogomez` → `https://federicogomez.pages.dev`. Si el nombre no está disponible,
   cambiar `SITE` en `site.config.mjs` por la URL asignada.
5. Cada push a `main` despliega; cada rama o PR genera un preview.

`public/_headers` define headers de seguridad y cache inmutable para `/_astro/*`.

### Dominio propio

1. Comprar el dominio (por ejemplo, en Cloudflare Registrar o NIC Argentina para `.com.ar`, delegando los
   nameservers a Cloudflare).
2. En el proyecto de Pages: **Custom domains → Set up a custom domain**. El certificado HTTPS es automático.
3. Cambiar `SITE` en `site.config.mjs`, correr `npm test` y hacer push: canonical, Open Graph y sitemap se
   regeneran con la URL nueva.

## Formulario de contacto (pendiente)

No está implementado. Para sumarlo sin backend propio, la opción recomendada es
[Web3Forms](https://web3forms.com) (gratis hasta 250 envíos/mes, con protección anti-spam): crear la clave con el
email de destino, agregar un island React con validación (`client:visible`) que haga `POST` a su API, y mostrar
éxito solo con la respuesta real del servicio.
