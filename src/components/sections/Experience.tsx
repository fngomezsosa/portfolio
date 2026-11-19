import { TrendingUp } from 'lucide-react';
import { experience, experienceSummary, formatMonth, type Job } from '../../data/experience';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './Experience.module.css';

/** Duración legible de un puesto ("3 años y 1 mes"). Fin null = hasta la fecha del build. */
function duration(job: Job, now: Date): string {
  const [sy, sm] = job.start.split('-').map(Number);
  const [ey, em] = job.end ? job.end.split('-').map(Number) : [now.getFullYear(), now.getMonth() + 1];
  const total = (ey - sy) * 12 + (em - sm);
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts = [];
  if (years) parts.push(`${years} ${years === 1 ? 'año' : 'años'}`);
  if (months) parts.push(`${months} ${months === 1 ? 'mes' : 'meses'}`);
  return parts.join(' y ') || 'menos de un mes';
}

export function Experience({ buildDate }: { buildDate: string }) {
  const now = new Date(buildDate);
  return (
    <section id="experiencia" className="section" aria-labelledby="experiencia-title">
      <div className={`container ${styles.layout}`}>
        <aside className={styles.aside}>
          <SectionHeading id="experiencia-title" title="Mi trayectoria" subtitle="Experiencia construyendo soluciones a escala" />
          <div className={`card ${styles.summary}`} data-reveal>
            <TrendingUp size={40} strokeWidth={1.8} aria-hidden="true" />
            <p className={styles.summaryValue}>
              {experienceSummary.value} <span>{experienceSummary.label}</span>
            </p>
            <p className={styles.summaryText}>{experienceSummary.text}</p>
          </div>
        </aside>

        <ol className={styles.timeline}>
          {experience.map((job) => (
            <li key={job.company} className={styles.job} data-reveal>
              <span className={`${styles.dot} ${job.end === null ? styles.current : ''}`} aria-hidden="true" />
              <div className={`card ${styles.jobCard}`}>
                <header className={styles.jobHeader}>
                  <h3>
                    {job.role} <span className={styles.company}>· {job.company}</span>
                  </h3>
                  <p className={styles.dates}>
                    <time dateTime={job.start}>{formatMonth(job.start)}</time> –{' '}
                    {job.end ? <time dateTime={job.end}>{formatMonth(job.end)}</time> : 'Actualidad'}
                    <span className={styles.duration}> · {duration(job, now)}</span>
                  </p>
                </header>
                <p className={styles.jobSummary}>{job.summary}</p>
                <ul className={styles.highlights}>
                  {job.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                <ul className={styles.tech} aria-label="Tecnologías">
                  {job.tech.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
