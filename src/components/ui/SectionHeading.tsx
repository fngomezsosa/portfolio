import styles from './SectionHeading.module.css';

interface SectionHeadingProps {
  id: string;
  title: string;
  subtitle?: string;
  /** Línea secundaria adicional, con el mismo estilo que el subtítulo. */
  note?: string;
}

/** Título de sección con la barra de acento a la izquierda (como en el mockup). */
export function SectionHeading({ id, title, subtitle, note }: SectionHeadingProps) {
  return (
    <header className={styles.heading} data-reveal>
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      {note && <p className={styles.subtitle}>{note}</p>}
    </header>
  );
}
