import { ArrowUpRight, Mail } from 'lucide-react';
import { links, mailto, site } from '../../config/site';
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
            <p className={styles.text}>{site.availability}</p>
            <ul className={styles.buttons}>
              <li>
                <Button href={links.linkedin} external variant="outline" icon={<LinkedInIcon size={20} />}>
                  LinkedIn
                </Button>
              </li>
              <li>
                <Button href={mailto} variant="outline" icon={<Mail size={20} aria-hidden="true" />}>
                  {links.email}
                </Button>
              </li>
              <li>
                <Button href={links.whatsapp} external variant="outline" icon={<WhatsAppIcon size={20} className={styles.whatsapp} />}>
                  WhatsApp
                </Button>
              </li>
            </ul>
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
            <p className={styles.gptechText}>De desarrollador a creador de productos tecnológicos. Co-fundador de GP-Tech.</p>
            <Button href={links.gptech} external variant="outline" size="sm" iconEnd={<ArrowUpRight size={16} aria-hidden="true" />}>
              Conocé más
            </Button>
          </aside>
        </div>
      </div>
    </section>
  );
}
