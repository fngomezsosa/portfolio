import styles from './SectionHeading.module.css';

interface SectionHeadingProps {
  id: string;
  title: string;
  subtitle?: string;
}

/** Título de sección con la barra de acento a la izquierda (como en el mockup). */
export function SectionHeading({ id, title, subtitle }: SectionHeadingProps) {
  return (
    <header className={styles.heading} data-reveal>
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
}
