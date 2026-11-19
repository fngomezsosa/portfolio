import { ArrowRight, Code2, Rocket } from 'lucide-react';
import { siPython } from 'simple-icons';
import { site } from '../../config/site';
import { about } from '../../data/about';
import type { ResponsiveImage } from '../../lib/images';
import { Button } from '../ui/Button';
import { BrandIcon } from '../ui/Icons';
import styles from './About.module.css';

const statIcons = {
  code: <Code2 size={30} strokeWidth={1.6} aria-hidden="true" />,
  python: <BrandIcon icon={siPython} size={28} />,
  rocket: <Rocket size={30} strokeWidth={1.6} aria-hidden="true" />,
};

export function About({ photo }: { photo: ResponsiveImage }) {
  return (
    <section id="sobre-mi" className={`section ${styles.section}`} aria-labelledby="sobre-mi-title">
      <div className="container">
        <div className={`card ${styles.card}`} data-reveal>
          <div className={styles.photo}>
            <img
              src={photo.src}
              srcSet={photo.srcSet}
              sizes="(min-width: 1024px) 18rem, (min-width: 640px) 16rem, 70vw"
              width={photo.width}
              height={photo.height}
              alt={`${site.name}, retrato profesional`}
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className={styles.text}>
            <span className={styles.bar} aria-hidden="true" />
            <h2 id="sobre-mi-title" className={styles.title}>
              Sobre mí
            </h2>
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <Button href="#experiencia" variant="ghost" iconEnd={<ArrowRight size={18} aria-hidden="true" />}>
              Ver mi experiencia
            </Button>
          </div>

          <ul className={styles.stats}>
            {about.stats.map((s) => (
              <li key={s.label}>
                <span className={styles.statIcon}>{statIcons[s.icon]}</span>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
