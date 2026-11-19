import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { scrollThrough, isDesktop, hasDesktopNav } from './helpers';

const LINKEDIN = 'https://www.linkedin.com/in/federico-nicolas-gomez-421b14192';
const WHATSAPP = /^https:\/\/wa\.me\/5491134363005\?text=/;
const GPTECH = 'https://www.gp-tech.com.ar/';

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (e) => {
    throw e;
  });
});

test.describe('Hero', () => {
  test('nombre, rol, descripción, indicadores y CTA visibles al cargar', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Federico Gómez');
    await expect(page.getByText('Desarrollador Backend Python | IA y agentes').first()).toBeVisible();
    await expect(
      page.getByText('Desarrollo soluciones digitales escalables con Python, Inteligencia Artificial y visión de negocio.'),
    ).toBeVisible();
    const highlights = page.getByRole('list', { name: 'Especialidades' }).getByRole('listitem');
    await expect(highlights).toHaveText(['Python', 'IA & Agentes', 'Productos SaaS']);
    await expect(page.getByRole('link', { name: /Conocé más sobre mí/ })).toBeInViewport();
  });

  test('botón "Descargar CV" junto al CTA, con download, y el PDF se sirve', async ({ page, request }) => {
    await page.goto('/');
    const cv = page.locator('#inicio').getByRole('link', { name: 'Descargar CV' });
    await expect(cv).toBeInViewport();
    await expect(cv).toHaveAttribute('href', '/Federico_Gomez_CV.pdf');
    await expect(cv).toHaveAttribute('download', '');
    const cta = await page.getByRole('link', { name: /Conocé más sobre mí/ }).boundingBox();
    const box = (await cv.boundingBox())!;
    // Al lado del CTA (misma fila) o justo debajo si no entra (mobile).
    expect(Math.abs(box.y - cta!.y) < 4 || box.y > cta!.y).toBe(true);
    const download = page.waitForEvent('download');
    await cv.click();
    expect((await download).suggestedFilename()).toBe('Federico_Gomez_CV.pdf');
    const response = await request.get('/Federico_Gomez_CV.pdf');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');
  });

  test('nombre: completo en el HTML y accesible, aunque se esté escribiendo', async ({ page }) => {
    await page.goto('/');
    const h1 = page.getByRole('heading', { level: 1, name: 'Federico Gómez' });
    await expect(h1).toHaveAttribute('aria-label', 'Federico Gómez');
    // El texto completo ya está en el DOM desde el primer momento (no lo agrega JS).
    await expect(h1).toHaveText('Federico Gómez');
    // Las letras sueltas no se leen de a una.
    expect(await h1.locator('> span').evaluateAll((spans) => spans.every((s) => s.getAttribute('aria-hidden') === 'true'))).toBe(true);
  });

  test('nombre: se escribe en menos de 1,8 s y queda el cursor parpadeando al final', async ({ page }) => {
    await page.goto('/');
    const chars = page.locator('#hero-title [style*="--delay"]').filter({ hasNot: page.getByTestId('hero-cursor') });
    const cursor = page.getByTestId('hero-cursor');
    // Lo demás del hero no espera a la animación.
    await expect(page.getByText(/Desarrollo soluciones digitales escalables/)).toBeVisible();
    await expect(page.locator('#inicio').getByRole('link', { name: 'Descargar CV' })).toBeVisible();
    // Último --delay (cursor) < 1,8 s.
    const lastDelay = await cursor.evaluate((el) => parseFloat(getComputedStyle(el).getPropertyValue('--delay')));
    expect(lastDelay).toBeLessThan(1800);
    await page.waitForTimeout(lastDelay + 200);
    expect(await chars.evaluateAll((els) => els.every((el) => getComputedStyle(el).visibility === 'visible'))).toBe(true);
    // Cursor después de la "z", con animación infinita de parpadeo.
    const [z, c] = await Promise.all([
      page.locator('#hero-title .text-gradient > span').filter({ hasText: 'z' }).boundingBox(),
      cursor.boundingBox(),
    ]);
    expect(c!.x).toBeGreaterThanOrEqual(z!.x + z!.width - 1);
    expect(await cursor.evaluate((el) => getComputedStyle(el).animationIterationCount)).toBe('infinite');
  });

  test('nombre: sin saltos de diseño mientras se escribe', async ({ page }) => {
    await page.goto('/');
    const box = () => page.locator('#hero-title').boundingBox();
    const before = await box();
    await page.waitForTimeout(1600);
    expect(await box()).toEqual(before);
  });

  test('nombre: con reduced motion se ve completo de entrada y el cursor está fijo', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const chars = page.locator('#hero-title [style*="--delay"]');
    expect(await chars.evaluateAll((els) => els.every((el) => getComputedStyle(el).visibility === 'visible'))).toBe(true);
    const cursor = page.getByTestId('hero-cursor');
    await expect(cursor).toBeVisible();
    expect(await cursor.evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
  });

  test('la imagen del escritorio se carga como fondo del hero, con prioridad alta', async ({ page }) => {
    await page.goto('/');
    const img = page.locator('#inicio img');
    await expect(img).toHaveAttribute('fetchpriority', 'high');
    expect(await img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    expect(await img.evaluate((el) => getComputedStyle(el).objectFit)).toBe('cover');
  });

  test('"Conocé más sobre mí" lleva a la sección Sobre mí', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Conocé más sobre mí/ }).click();
    await expect(page).toHaveURL(/#sobre-mi$/);
    await expect(page.getByRole('heading', { name: 'Sobre mí' })).toBeInViewport();
  });
});

test.describe('Header y navegación', () => {
  test('header sticky: sigue visible al desplazarse', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo({ top: 3000, behavior: 'instant' }));
    await expect(page.locator('header').first()).toBeInViewport();
    expect(await page.locator('header').first().evaluate((el) => getComputedStyle(el).position)).toBe('fixed');
  });

  test('escritorio: cada enlace lleva a su sección y queda marcado como activo', async ({ page }) => {
    test.skip(!hasDesktopNav(page), 'Navegación de escritorio');
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Secciones', exact: true });
    for (const [label, id] of [
      ['Sobre mí', 'sobre-mi'],
      ['Proyectos', 'proyectos'],
      ['Arquitectura', 'arquitectura'],
      ['Stack', 'stack'],
      ['Experiencia', 'experiencia'],
      ['Contacto', 'contacto'],
    ]) {
      await nav.getByRole('link', { name: label }).click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(page.locator(`#${id}`)).toBeInViewport();
      await expect(nav.getByRole('link', { name: label })).toHaveAttribute('aria-current', 'location');
    }
  });

  test('el header entra en una línea, sin cortes ni solapamientos, de 1024 a 1440px', async ({ page }) => {
    test.skip(!hasDesktopNav(page), 'Recorre anchos de escritorio');
    for (const width of [1024, 1100, 1200, 1280, 1440]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      const problems = await page.evaluate(() => {
        const visible = (el: Element) => getComputedStyle(el).display !== 'none' && el.getBoundingClientRect().width > 0;
        const inner = document.querySelector('header')!.firstElementChild!;
        const out: string[] = [];
        // Cada elemento visible (logo, cada enlace del menú, Hablemos, hamburguesa), en orden:
        // sin solaparse con el anterior y dentro de la pantalla. Se miden los elementos reales,
        // no sus contenedores: un <nav> encogido por flex puede tener enlaces desbordados.
        const items = [...inner.querySelectorAll('a, button')].filter(visible);
        items.forEach((el, i) => {
          const r = el.getBoundingClientRect();
          const label = el.textContent!.trim() || el.getAttribute('aria-label') || 'botón';
          if (i && r.left < items[i - 1].getBoundingClientRect().right - 0.5) out.push(`"${label}" solapado con el anterior`);
          if (r.right > window.innerWidth + 0.5) out.push(`"${label}" fuera de pantalla`);
        });
        // Ningún texto de enlace o botón en dos líneas.
        for (const el of inner.querySelectorAll('a, button')) {
          if (!visible(el)) continue;
          for (const node of el.childNodes) {
            if (node.nodeType !== Node.TEXT_NODE || !node.textContent!.trim()) continue;
            const range = document.createRange();
            range.selectNodeContents(node);
            if (new Set([...range.getClientRects()].map((r) => Math.round(r.top))).size > 1) out.push(`"${node.textContent!.trim()}" en dos líneas`);
          }
        }
        return out;
      });
      expect(problems, `${width}px`).toEqual([]);
      // Menú de escritorio desde 1200px; hamburguesa por debajo.
      const desktopNav = page.getByRole('navigation', { name: 'Secciones', exact: true });
      if (width >= 1200) await expect(desktopNav).toBeVisible();
      else await expect(page.getByRole('button', { name: 'Abrir menú' })).toBeVisible();
    }
  });

  test('botón "Hablemos" lleva a contacto', async ({ page }) => {
    test.skip(page.viewportSize()!.width < 640, 'En mobile el CTA está dentro del menú');
    await page.goto('/');
    await page.locator('header').getByRole('link', { name: 'Hablemos' }).first().click();
    await expect(page.locator('#contacto')).toBeInViewport();
  });

  test('mobile/tablet: menú hamburguesa abre, navega, cierra y vuelve el foco con Esc', async ({ page }) => {
    test.skip(hasDesktopNav(page), 'Menú hamburguesa por debajo de 1200px');
    await page.goto('/');
    const button = page.getByRole('button', { name: 'Abrir menú' });
    await expect(button).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Secciones', exact: true })).toBeHidden();
    await button.click();
    const menu = page.getByRole('navigation', { name: 'Secciones (menú)' });
    await expect(menu).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cerrar menú' })).toHaveAttribute('aria-expanded', 'true');
    await expect(menu.getByRole('link')).toHaveText(['Inicio', 'Sobre mí', 'Proyectos', 'Arquitectura', 'Stack', 'Experiencia', 'Contacto', /Hablemos/]);
    await expect(menu.getByRole('link').first()).toBeFocused();

    await menu.getByRole('link', { name: 'Experiencia' }).click();
    await expect(menu).toBeHidden();
    await expect(page).toHaveURL(/#experiencia$/);
    await expect(page.locator('#experiencia')).toBeInViewport();

    await page.getByRole('button', { name: 'Abrir menú' }).click();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(page.getByRole('button', { name: 'Abrir menú' })).toBeFocused();
  });

  test('todos los anclas internos apuntan a secciones existentes', async ({ page }) => {
    await page.goto('/');
    const missing = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')]
        .map((a) => a.getAttribute('href')!.slice(1))
        .filter((id) => id && !document.getElementById(id)),
    );
    expect(missing).toEqual([]);
  });
});

test.describe('Sobre mí', () => {
  test('foto, texto, indicadores y enlace a la experiencia', async ({ page }) => {
    await page.goto('/#sobre-mi');
    const section = page.locator('#sobre-mi');
    await expect(section.getByRole('img', { name: 'Federico Gómez, retrato profesional' })).toBeVisible();
    await expect(section).toContainText('más de 9 años de experiencia, los últimos 6 con Python y Django');
    await expect(section.getByRole('listitem')).toHaveText(['+9 añosde experiencia', '+6 añoscon Python', '2 productosen producción']);
    await section.getByRole('link', { name: /Ver mi experiencia/ }).click();
    await expect(page.locator('#experiencia')).toBeInViewport();
  });
});

test.describe('Proyectos', () => {
  test('tres tarjetas con logo oficial, descripción y funcionalidades', async ({ page }) => {
    await page.goto('/#proyectos');
    await scrollThrough(page);
    const cards = page.locator('#proyectos article');
    await expect(cards).toHaveCount(3);
    for (const name of ['TuPropIA', 'TuAgencIA', 'GP-Tech']) {
      const heading = page.locator('#proyectos').getByRole('heading', { level: 3, name });
      await expect(heading).toBeVisible();
      const logo = heading.getByRole('img', { name });
      expect(await logo.evaluate((img: HTMLImageElement) => img.naturalWidth > 0)).toBe(true);
    }
    await expect(cards.nth(0)).toContainText('CRM inmobiliario con IA');
    await expect(cards.nth(0)).toContainText('Integración con Tokko');
    await expect(cards.nth(1)).toContainText('CRM para concesionarias con IA');
    await expect(cards.nth(1)).toContainText('Integración con Mercado Libre');
    await expect(cards.nth(2)).toContainText('Innovación. Tecnología. Soluciones.');
  });

  test('TuPropIA y TuAgencIA no tienen enlaces; GP-Tech abre su web en otra pestaña', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('#proyectos article');
    await expect(cards.nth(0).getByRole('link')).toHaveCount(0);
    await expect(cards.nth(1).getByRole('link')).toHaveCount(0);
    const gp = cards.nth(2).getByRole('link', { name: /Visitar GP-Tech/ });
    await expect(gp).toHaveAttribute('href', GPTECH);
    await expect(gp).toHaveAttribute('target', '_blank');
    await expect(gp).toHaveAttribute('rel', /noopener/);
  });

  test('los teléfonos con chat son decorativos (ocultos a lectores de pantalla)', async ({ page }) => {
    await page.goto('/');
    const phones = page.locator('#proyectos [aria-hidden="true"]').filter({ hasText: '¿En qué podemos ayudarte?' });
    await expect(phones).toHaveCount(2);
  });
});

test.describe('Arquitectura', () => {
  test('la sección existe, entre Proyectos y Stack, y muestra los 6 pasos y 3 decisiones', async ({ page }) => {
    await page.goto('/#arquitectura');
    const section = page.locator('#arquitectura');
    await expect(section.getByRole('heading', { level: 2, name: 'Cómo funciona TuPropIA' })).toBeVisible();
    await expect(section).toContainText('Arquitectura de un agente de IA conversacional en producción');
    const order = await page.evaluate(() => [...document.querySelectorAll('main > section')].map((s) => s.id));
    expect(order.indexOf('arquitectura')).toBe(order.indexOf('proyectos') + 1);
    expect(order.indexOf('stack')).toBe(order.indexOf('arquitectura') + 1);

    const steps = section.getByRole('list', { name: 'Flujo de un mensaje, paso a paso' }).getByRole('listitem');
    await expect(steps).toHaveCount(6);
    await expect(steps.getByRole('heading', { level: 3 })).toHaveText([
      'WhatsApp Cloud API',
      'Webhook',
      'Cola de procesamiento',
      'Agente de IA',
      'Validación en el servidor',
      'CRM',
    ]);
    await expect(steps.nth(1)).toContainText('Validación HMAC-SHA256 y rate limiting con Redis');
    await expect(steps.nth(4)).toContainText('Acciones ESCALAR, CALIFICAR y VISITA');
    await expect(section.getByRole('heading', { level: 4 })).toHaveText([
      'Acciones validadas en el servidor',
      'RAG propio, sin frameworks',
      'SaaS multitenant',
    ]);
  });

  test('entrada "Arquitectura" en el menú, después de "Proyectos", marcada mientras se ve', async ({ page }) => {
    test.skip(!hasDesktopNav(page), 'Navegación de escritorio');
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Secciones', exact: true });
    await expect(nav.getByRole('link')).toHaveText(['Inicio', 'Sobre mí', 'Proyectos', 'Arquitectura', 'Stack', 'Experiencia', 'Contacto']);
    await page.evaluate(() => document.getElementById('arquitectura')!.scrollIntoView({ behavior: 'instant' }));
    await expect(nav.getByRole('link', { name: 'Arquitectura' })).toHaveAttribute('aria-current', 'location');
  });

  test('flujo horizontal en desktop y vertical en mobile/tablet', async ({ page }) => {
    await page.goto('/#arquitectura');
    const tops = await page
      .locator('#arquitectura ol > li')
      .evaluateAll((items) => items.map((li) => Math.round(li.getBoundingClientRect().top)));
    if (isDesktop(page)) expect(new Set(tops).size).toBe(1);
    else expect(tops).toEqual([...tops].sort((a, b) => a - b).filter((v, i, a) => a.indexOf(v) === i));
  });
});

test.describe('Stack', () => {
  const track = (page: import('@playwright/test').Page) => page.getByTestId('tech-track');

  test('muestra todas las categorías y tecnologías pedidas', async ({ page }) => {
    await page.goto('/#stack');
    const groups = page.locator('#stack section');
    await expect(groups.getByRole('heading', { level: 3 })).toHaveText([
      'Backend',
      'Frontend',
      'Inteligencia Artificial',
      'Bases de datos',
      'Cloud e infraestructura',
      'Otras tecnologías',
    ]);
    for (const tech of ['Python', 'Django REST Framework', 'FastAPI', 'Symfony', 'TypeScript', 'Tool Calling', 'pgvector', 'Claude Code', 'DynamoDB', 'Redis', 'API Gateway', 'SQS', 'Serverless', 'SOAP', 'Webhooks', 'Git']) {
      await expect(groups.getByText(tech, { exact: true }).first()).toBeAttached();
    }
  });

  test('orden de prioridad: carrusel y categorías', async ({ page }) => {
    await page.goto('/#stack');
    const carousel = await track(page).locator('li:not([aria-hidden]) span:last-child').allTextContents();
    expect(carousel.slice(0, 11)).toEqual([
      'Python',
      'Django',
      'Django REST Framework',
      'FastAPI',
      'PostgreSQL',
      'pgvector',
      'OpenAI API',
      'RAG',
      'AWS',
      'Docker',
      'Redis',
    ]);
    expect(carousel.slice(-4)).toEqual(['PHP', 'Symfony', 'SOAP', 'GraphQL']);
    // Magento y ChatGPT están en sus bloques, pero no en el carrusel.
    expect(carousel).toHaveLength(33);
    expect(carousel).not.toContain('Magento');
    expect(carousel).not.toContain('ChatGPT');

    const group = (label: string) =>
      page.locator('#stack section').filter({ has: page.getByRole('heading', { level: 3, name: label }) }).locator('li');
    await expect(group('Backend')).toHaveText(['Python', 'Django', 'Django REST Framework', 'FastAPI', 'PHP', 'Symfony', 'Magento']);
    await expect(group('Inteligencia Artificial').last()).toHaveText('ChatGPT');
    await expect(group('Inteligencia Artificial').nth(-2)).toHaveText('Claude Code');
    await expect(group('Bases de datos').first()).toHaveText('PostgreSQL');
    await expect(group('Cloud e infraestructura').first()).toHaveText('AWS');
    await expect(group('Otras tecnologías')).toHaveText(['REST APIs', 'Webhooks', 'Git', 'SOAP', 'GraphQL']);
  });

  test('carrusel: avanza solo, en loop, y la copia duplicada está oculta a lectores', async ({ page }) => {
    await page.goto('/#stack');
    await expect(track(page)).toBeVisible();
    await page.mouse.move(0, 0);
    const start = await track(page).evaluate((el) => el.scrollLeft);
    await page.waitForTimeout(1500);
    expect(await track(page).evaluate((el) => el.scrollLeft)).toBeGreaterThan(start + 20);
    const hidden = await track(page).locator('li[aria-hidden="true"]').count();
    const visible = await track(page).locator('li:not([aria-hidden])').count();
    expect(hidden).toBe(visible);
  });

  test('carrusel: loop infinito (al pasar la mitad vuelve sin cortes)', async ({ page }) => {
    await page.goto('/#stack');
    await page.mouse.move(0, 0);
    await expect(track(page)).toBeVisible();
    await page.waitForTimeout(500);
    const half = await track(page).evaluate((el) => el.scrollWidth / 2);
    // Se ubica cerca del final de la primera mitad y se deja correr.
    await track(page).evaluate((el, h) => (el.scrollLeft = h - 10), half);
    await page.waitForTimeout(3200); // reanuda tras la "interacción" y sigue
    const pos = await track(page).evaluate((el) => el.scrollLeft);
    expect(pos).toBeLessThan(half);
  });

  test('carrusel: se pausa con el cursor encima', async ({ page }) => {
    test.skip(!isDesktop(page), 'Hover solo con mouse');
    await page.goto('/#stack');
    await track(page).hover();
    await page.waitForTimeout(300);
    const a = await track(page).evaluate((el) => el.scrollLeft);
    await page.waitForTimeout(1200);
    expect(await track(page).evaluate((el) => el.scrollLeft)).toBeCloseTo(a, 0);
  });

  test('carrusel: botón de pausa y flechas de navegación manual', async ({ page }) => {
    await page.goto('/#stack');
    const carousel = page.getByRole('region', { name: 'Tecnologías con las que trabajo' });
    const pause = carousel.getByRole('button', { name: 'Pausar el movimiento automático' });
    await pause.click();
    await expect(pause).toHaveAttribute('aria-pressed', 'true');
    await page.mouse.move(0, 0);
    await page.waitForTimeout(300);
    const a = await track(page).evaluate((el) => el.scrollLeft);
    await page.waitForTimeout(1000);
    expect(await track(page).evaluate((el) => el.scrollLeft)).toBeCloseTo(a, 0);

    await carousel.getByRole('button', { name: 'Tecnologías siguientes' }).click();
    await page.waitForTimeout(800);
    const b = await track(page).evaluate((el) => el.scrollLeft);
    expect(b).toBeGreaterThan(a + 100);

    await carousel.getByRole('button', { name: 'Tecnologías anteriores' }).click();
    await page.waitForTimeout(800);
    const c = await track(page).evaluate((el) => el.scrollLeft);
    expect(Math.abs(c - a)).toBeLessThan(5);
  });

  test('carrusel: soporte táctil (desplazamiento nativo que respeta al usuario)', async ({ page }) => {
    test.skip(isDesktop(page), 'Táctil');
    await page.goto('/#stack');
    await page.getByRole('region', { name: 'Tecnologías con las que trabajo' }).getByRole('button', { name: 'Pausar el movimiento automático' }).click();
    const t = track(page);
    expect(await t.evaluate((el) => getComputedStyle(el).overflowX)).toBe('auto');
    expect(await t.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
    // Swipe con eventos táctiles reales de Chromium (CDP).
    // El gesto tiene que caer sobre el carrusel visible.
    await t.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    const box = (await t.boundingBox())!;
    const client = await page.context().newCDPSession(page);
    const y = box.y + box.height / 2;
    const before = await t.evaluate((el) => el.scrollLeft);
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x + box.width - 30, y }] });
    for (let i = 1; i <= 10; i++) {
      await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: box.x + box.width - 30 - i * 20, y }] });
    }
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForTimeout(500);
    expect(await t.evaluate((el) => el.scrollLeft)).toBeGreaterThan(before + 50);
  });

  test('carrusel: con reduced motion no se mueve solo', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#stack');
    await page.mouse.move(0, 0);
    await page.waitForTimeout(500);
    const a = await track(page).evaluate((el) => el.scrollLeft);
    await page.waitForTimeout(1000);
    expect(await track(page).evaluate((el) => el.scrollLeft)).toBe(a);
  });
});

test.describe('Experiencia', () => {
  test('línea de tiempo con los 5 puestos, en orden, con fechas', async ({ page }) => {
    await page.goto('/#experiencia');
    const jobs = page.locator('#experiencia ol > li');
    await expect(jobs).toHaveCount(5);
    await expect(jobs.locator('h3')).toHaveText([
      'Co-Founder · GP-Tech',
      'Senior Backend Developer & Líder Técnico · E2E Travel Solutions',
      'Magento Developer / Líder Técnico · Improntus',
      'Core Developer · Lyracons',
      'Full Stack Developer (Senior) · TIJE Travel',
    ]);
    await expect(jobs.nth(0)).toContainText('May 2026 – Actualidad');
    await expect(jobs.nth(1)).toContainText('Nov 2023 – Nov 2026');
    await expect(jobs.nth(4)).toContainText('Feb 2015 – Ago 2020 · 5 años y 6 meses');
    for (const job of await jobs.all()) {
      expect(await job.locator('ul').first().locator('li').count()).toBeGreaterThan(0);
    }
  });
});

test.describe('Contacto y footer', () => {
  test('LinkedIn, email y WhatsApp, sin formulario ni CV', async ({ page }) => {
    await page.goto('/#contacto');
    const contact = page.locator('#contacto');
    await expect(contact.getByRole('heading', { name: '¿Hablamos?' })).toBeVisible();
    await expect(contact.getByRole('link', { name: /^LinkedIn/ })).toHaveAttribute('href', LINKEDIN);
    // El botón de email muestra la dirección; no se repite en otro lado de la sección.
    const email = contact.getByRole('link', { name: 'fngomezsosa@gmail.com' });
    await expect(email).toHaveAttribute('href', 'mailto:fngomezsosa@gmail.com');
    await expect(contact.getByText('fngomezsosa@gmail.com')).toHaveCount(1);
    await expect(contact.getByRole('link', { name: /^WhatsApp/ })).toHaveAttribute('href', WHATSAPP);
    await expect(contact.getByRole('link', { name: 'Descargar CV' })).toHaveCount(0);
    const buttons = contact.locator('ul').first().getByRole('link');
    await expect(buttons).toHaveCount(3);
    if (hasDesktopNav(page)) {
      // De 1200 a 1440px, los tres en una sola fila.
      for (const width of [1200, 1280, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        const tops = await buttons.evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().top)));
        expect(new Set(tops).size, `${width}px`).toBe(1);
      }
    }
    await expect(contact.getByRole('link', { name: /Conocé más/ })).toHaveAttribute('href', GPTECH);
    await expect(contact).toContainText('De desarrollador a creador de productos tecnológicos. Co-fundador de GP-Tech.');
    await expect(contact).not.toContainText('una empresa enfocada en desarrollar productos tecnológicos con IA');
    await expect(page.locator('form, input, textarea')).toHaveCount(0);
  });

  test('footer: identidad, navegación, redes, copyright y GP-Tech', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toContainText('Desarrollador Backend Python | IA y agentes');
    await expect(footer.getByRole('link', { name: /^LinkedIn/ })).toHaveAttribute('href', LINKEDIN);
    // GitHub está oculto hasta que haya repos públicos.
    await expect(page.locator('a[href*="github.com"]')).toHaveCount(0);
    await expect(footer.getByRole('link', { name: 'Email' })).toHaveAttribute('href', 'mailto:fngomezsosa@gmail.com');
    await expect(footer.getByRole('link', { name: /Co-founder de GP-Tech/ })).toHaveAttribute('href', GPTECH);
    await expect(footer).toContainText(`© ${new Date().getFullYear()}`);
  });

  test('todos los enlaces externos abren en pestaña nueva con rel noopener', async ({ page }) => {
    await page.goto('/');
    const bad = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLAnchorElement>('a[href^="http"]')]
        .filter((a) => a.target !== '_blank' || !a.rel.includes('noopener'))
        .map((a) => a.href),
    );
    expect(bad).toEqual([]);
  });
});

test.describe('Calidad', () => {
  test('sin desbordes horizontales', async ({ page }) => {
    await page.goto('/');
    await scrollThrough(page);
    const width = page.viewportSize()!.width;
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });

  test('todas las imágenes tienen alt (vacío si son decorativas)', async ({ page }) => {
    await page.goto('/');
    expect(await page.locator('img:not([alt])').count()).toBe(0);
  });

  test('accesibilidad: sin violaciones WCAG 2.1 AA (axe)', async ({ page }) => {
    await page.goto('/');
    await scrollThrough(page);
    // Cast: @axe-core/playwright trae su propio parche de playwright-core (1.65.1 vs 1.65.0); la API es la misma.
    const results = await new AxeBuilder({ page } as unknown as ConstructorParameters<typeof AxeBuilder>[0]).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
  });

  test('capturas', async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await scrollThrough(page);
    const dir = `screenshots/${testInfo.project.name}`;
    await page.screenshot({ path: `${dir}-inicio.png` });
    await page.screenshot({ path: `${dir}-completa.png`, fullPage: true });
    if (!isDesktop(page)) {
      await page.getByRole('button', { name: 'Abrir menú' }).click();
      await page.screenshot({ path: `${dir}-menu.png` });
    }
  });
});
