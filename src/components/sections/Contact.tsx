import { ArrowUpRight, Download, Mail } from 'lucide-react';
import { links, mailto } from '../../config/site';
import type { ResponsiveImage } from '../../lib/images';
import { Button } from '../ui/Button';
import { LinkedInIcon, WhatsAppIcon } from '../ui/Icons';
import styles from './Contact.module.css';

export function Contact({ gptechIcon }: { gptechIcon: ResponsiveImage }) {
  return (
    <section id="contacto" className="section" aria-labelledby="contacto-title">
      <div className="container">
        <div className={`card ${styles.card}`} data-reveal>
          <div className={styles.main}>
            <h2 id="contacto-title" className={styles.title}>
              ¿Hablamos?
            </h2>
            <p className={styles.text}>Estoy abierto a nuevas oportunidades, proyectos tecnológicos y colaboraciones.</p>
            <ul className={styles.buttons}>
              <li>
                <Button href={links.linkedin} external variant="outline" icon={<LinkedInIcon size={20} />}>
                  LinkedIn
                </Button>
              </li>
              <li>
                <Button href={mailto} variant="outline" icon={<Mail size={20} aria-hidden="true" />}>
                  Email
                </Button>
              </li>
              <li>
                <Button href={links.whatsapp} external variant="outline" icon={<WhatsAppIcon size={20} className={styles.whatsapp} />}>
                  WhatsApp
                </Button>
              </li>
              <li>
                <Button href={links.cv} download variant="outline" icon={<Download size={20} aria-hidden="true" />}>
                  Descargar CV
                </Button>
              </li>
            </ul>
            <p className={styles.email}>
              <a href={mailto}>{links.email}</a>
            </p>
          </div>

          <aside className={styles.gptech} aria-labelledby="contacto-gptech">
            <div className={styles.gptechHead}>
              <img
                src={gptechIcon.src}
                srcSet={gptechIcon.srcSet}
                sizes="6rem"
                width={gptechIcon.width}
                height={gptechIcon.height}
                alt=""
                loading="lazy"
                decoding="async"
              />
              <div>
                <h3 id="contacto-gptech">GP-Tech</h3>
                <p>Innovación. Tecnología. Soluciones.</p>
              </div>
            </div>
            <p className={styles.gptechText}>
              Co-fundador de GP-Tech, una empresa enfocada en desarrollar productos tecnológicos con IA.
            </p>
            <Button href={links.gptech} external variant="outline" size="sm" iconEnd={<ArrowUpRight size={16} aria-hidden="true" />}>
              Conocé más
            </Button>
          </aside>
        </div>
      </div>
    </section>
  );
}
