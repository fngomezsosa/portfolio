import type { ReactNode } from 'react';
import { stack } from '../../data/stack';
import { SectionHeading } from '../ui/SectionHeading';
import { TechIcon } from '../ui/TechIcon';
import styles from './Stack.module.css';

/**
 * Sección Stack. El carrusel (island) entra como `children` desde la página:
 * así esta sección es HTML estático y solo el carrusel carga JavaScript.
 */
export function Stack({ children }: { children?: ReactNode }) {
  return (
    <section id="stack" className="section" aria-labelledby="stack-title">
      <div className="container">
        <div className={`card ${styles.panel}`} data-reveal>
          <div className={styles.intro}>
            <SectionHeading id="stack-title" title="Stack tecnológico" subtitle="Herramientas y tecnologías con las que trabajo" />
          </div>
          <div className={styles.carousel}>{children}</div>
        </div>

        <div className={styles.groups}>
          {stack.map((group, i) => (
            <section
              key={group.id}
              className={styles.group}
              aria-labelledby={`stack-${group.id}`}
              data-reveal
              style={{ '--reveal-delay': `${(i % 3) * 0.08}s` } as React.CSSProperties}
            >
              <h3 id={`stack-${group.id}`}>{group.label}</h3>
              <ul>
                {group.items.map((t) => (
                  <li key={t.name}>
                    <TechIcon icon={t.icon} size={16} />
                    {t.name}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
