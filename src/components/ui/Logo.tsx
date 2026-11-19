import styles from './Logo.module.css';
import { site } from '../../config/site';

/** Identidad personal: monograma + nombre. Marca propia, no la de GP-Tech. */
export function Logo({ compact = false, href = '#inicio' }: { compact?: boolean; href?: string }) {
  const [first, ...rest] = site.name.split(' ');
  return (
    <a href={href} className={styles.logo}>
      <span className={styles.mark} aria-hidden="true">
        {site.initials}
      </span>
      {compact ? (
        <span className="visually-hidden">{site.name}</span>
      ) : (
        <span className={styles.name}>
          {first} <span className="text-gradient">{rest.join(' ')}</span>
        </span>
      )}
      <span className="visually-hidden">, ir al inicio</span>
    </a>
  );
}
