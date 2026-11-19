import { ArrowUpRight, Check } from 'lucide-react';
import { projects, type ChatPreview, type Project } from '../../data/projects';
import type { ResponsiveImage } from '../../lib/images';
import { Button } from '../ui/Button';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './Projects.module.css';

/** Teléfono armado con HTML/CSS que muestra una conversación ilustrativa (decorativa). */
function PhonePreview({ chat, icon }: { chat: ChatPreview; icon?: ResponsiveImage }) {
  return (
    <div className={styles.phone} aria-hidden="true">
      <div className={styles.phoneScreen}>
        <div className={styles.phoneBar}>
          {icon && <img src={icon.src} width={icon.width} height={icon.height} alt="" loading="lazy" decoding="async" />}
          <span>{chat.title}</span>
        </div>
        <div className={styles.messages}>
          {chat.messages.map((m) => (
            <p key={m.text} className={m.from === 'bot' ? styles.bot : styles.user}>
              {m.text}
            </p>
          ))}
          <p className={styles.typing}>
            <span />
            <span />
            <span />
          </p>
        </div>
      </div>
    </div>
  );
}

interface ProjectImages {
  logo: ResponsiveImage;
  icon?: ResponsiveImage;
}

function ProjectCard({ project, images, index }: { project: Project; images: ProjectImages; index: number }) {
  return (
    <article
      className={`card ${styles.project} ${styles[project.theme]}`}
      data-reveal
      style={{ '--reveal-delay': `${index * 0.1}s` } as React.CSSProperties}
    >
      <div className={styles.visual}>
        <h3 className={styles.logoHeading}>
          <img
            src={images.logo.src}
            srcSet={images.logo.srcSet}
            sizes="(min-width: 1024px) 15rem, 60vw"
            width={images.logo.width}
            height={images.logo.height}
            alt={project.logoAlt}
            loading="lazy"
            decoding="async"
            className={project.logoHasName ? styles.logoFull : styles.logoIcon}
          />
          {!project.logoHasName && <span className={styles.logoName}>{project.name}</span>}
        </h3>
        {project.chat && <PhonePreview chat={project.chat} icon={images.icon} />}
        {project.theme === 'gptech' && <div className={styles.orbit} aria-hidden="true" />}
      </div>

      <div className={styles.body}>
        <p className={styles.tagline}>{project.tagline}</p>
        <p className={styles.description}>{project.description}</p>

        <h4 className={styles.featuresTitle}>{project.featuresTitle}</h4>
        <ul className={styles.features}>
          {project.features.map((f) => (
            <li key={f}>
              <Check size={16} strokeWidth={2.5} aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>

        {project.planned && project.planned.length > 0 && (
          <>
            <h4 className={styles.featuresTitle}>Planificado</h4>
            <ul className={`${styles.features} ${styles.planned}`}>
              {project.planned.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </>
        )}

        {project.link && (
          <Button
            href={project.link.href}
            external
            variant="outline"
            size="sm"
            className={styles.link}
            iconEnd={<ArrowUpRight size={16} aria-hidden="true" />}
          >
            {project.link.label}
          </Button>
        )}
      </div>
    </article>
  );
}

export function Projects({ images }: { images: Record<string, ProjectImages> }) {
  return (
    <section id="proyectos" className="section" aria-labelledby="proyectos-title">
      <div className="container">
        <SectionHeading id="proyectos-title" title="Proyectos destacados" subtitle="Productos reales, soluciones con IA" />
        <div className={styles.grid}>
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} images={images[p.id]} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
