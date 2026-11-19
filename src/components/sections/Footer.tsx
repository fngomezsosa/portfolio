import { Mail } from 'lucide-react';
import { links, mailto, site } from '../../config/site';
import { navigation } from '../../config/navigation';
import type { ResponsiveImage } from '../../lib/images';
import { GithubIcon, LinkedInIcon } from '../ui/Icons';
import { Logo } from '../ui/Logo';
import styles from './Footer.module.css';

export function Footer({ gptechIcon, year }: { gptechIcon: ResponsiveImage; year: number }) {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <div className={styles.identity}>
          <Logo />
          <p className={styles.role}>{site.role}</p>
        </div>

        <nav aria-label="Secciones (pie de página)">
          <ul className={styles.nav}>
            {navigation
              .filter((n) => n.id !== 'inicio')
              .map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`}>{n.label}</a>
                </li>
              ))}
          </ul>
        </nav>

        <ul className={styles.social}>
          <li>
            <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
              <LinkedInIcon size={22} />
              <span className="visually-hidden">LinkedIn (se abre en una pestaña nueva)</span>
            </a>
          </li>
          <li>
            <a href={links.github} target="_blank" rel="noopener noreferrer">
              <GithubIcon size={22} />
              <span className="visually-hidden">GitHub (se abre en una pestaña nueva)</span>
            </a>
          </li>
          <li>
            <a href={mailto}>
              <Mail size={22} aria-hidden="true" />
              <span className="visually-hidden">Email</span>
            </a>
          </li>
        </ul>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>
          © {year} {site.fullName}. Todos los derechos reservados.
        </p>
        <a href={links.gptech} target="_blank" rel="noopener noreferrer" className={styles.gptech}>
          <img src={gptechIcon.src} width={gptechIcon.width} height={gptechIcon.height} alt="" loading="lazy" decoding="async" />
          Co-founder de GP-Tech
          <span className="visually-hidden"> (se abre en una pestaña nueva)</span>
        </a>
      </div>
    </footer>
  );
}
