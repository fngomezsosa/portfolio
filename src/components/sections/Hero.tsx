/**
 * Hero. La imagen del escritorio (notebook y mate) va de fondo con object-fit: cover y
 * un degradado oscuro a la izquierda para que el texto se lea. En mobile la imagen pasa
 * arriba como franja que se funde con el fondo.
 */
import { ArrowDown, Brain, Download, Rocket } from 'lucide-react';
import { siPython } from 'simple-icons';
import { links, site } from '../../config/site';
import { heroHighlights } from '../../data/about';
import type { ResponsiveImage } from '../../lib/images';
import { Button } from '../ui/Button';
import { BrandIcon } from '../ui/Icons';
import styles from './Hero.module.css';

const highlightIcons = {
  python: <BrandIcon icon={siPython} size={20} color="#4b8bbe" />,
  brain: <Brain size={20} strokeWidth={1.8} aria-hidden="true" />,
  rocket: <Rocket size={20} strokeWidth={1.8} aria-hidden="true" />,
};

export const HERO_IMAGE_SIZES = '(min-width: 1024px) 70vw, 100vw';

/** Efecto de escritura del nombre (solo CSS): inicio y ritmo, en ms. */
const TYPE_START_MS = 300;
const TYPE_STEP_MS = 55;

/**
 * Un <span> por carácter, cada uno con su animation-delay. Los caracteres arrancan
 * con visibility: hidden (ocupan su lugar: sin saltos de diseño) y aparecen en orden.
 * `offset` es la posición del primer carácter dentro del nombre completo.
 */
function TypedText({ text, offset }: { text: string; offset: number }) {
  return (
    <>
      {[...text].map((char, i) => (
        <span
          key={i}
          className={styles.char}
          style={{ '--delay': `${TYPE_START_MS + (offset + i) * TYPE_STEP_MS}ms` } as React.CSSProperties}
        >
          {char}
        </span>
      ))}
    </>
  );
}

export function Hero({ image }: { image: ResponsiveImage }) {
  const [first, ...rest] = site.name.split(' ');
  const last = rest.join(' ');
  const cursorDelay = TYPE_START_MS + (first.length + last.length) * TYPE_STEP_MS;
  return (
    <section id="inicio" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.media} aria-hidden="true">
        <img
          src={image.src}
          srcSet={image.srcSet}
          sizes={HERO_IMAGE_SIZES}
          width={image.width}
          height={image.height}
          alt=""
          fetchPriority="high"
          decoding="async"
        />
      </div>

      <div className={`container ${styles.content}`}>
        <p className={styles.badge}>{site.role}</p>
        {/*
          El nombre completo está en el HTML (buscadores, sin JS). aria-label da el nombre
          accesible; los caracteres sueltos van aria-hidden para que no se lean de a uno.
        */}
        <h1 id="hero-title" className={styles.title} aria-label={site.name}>
          <span aria-hidden="true">
            <TypedText text={first} offset={0} />
          </span>{' '}
          <span className="text-gradient" aria-hidden="true">
            <TypedText text={last} offset={first.length} />
            <span
              className={styles.cursor}
              data-testid="hero-cursor"
              style={{ '--delay': `${cursorDelay}ms` } as React.CSSProperties}
            />
          </span>
        </h1>
        <p className={styles.description}>{site.description}</p>

        <ul className={styles.highlights} aria-label="Especialidades">
          {heroHighlights.map((h) => (
            <li key={h.label}>
              <span className={styles.highlightIcon}>{highlightIcons[h.icon]}</span>
              {h.label}
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <Button href="#sobre-mi" iconEnd={<ArrowDown size={18} aria-hidden="true" />}>
            Conocé más sobre mí
          </Button>
          <Button href={links.cv} download variant="outline" icon={<Download size={18} aria-hidden="true" />}>
            Descargar CV
          </Button>
        </div>
      </div>
    </section>
  );
}
