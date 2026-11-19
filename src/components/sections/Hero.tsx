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

export function Hero({ image }: { image: ResponsiveImage }) {
  const [first, ...rest] = site.name.split(' ');
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
        <h1 id="hero-title" className={styles.title}>
          <span>{first}</span> <span className="text-gradient">{rest.join(' ')}</span>
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
