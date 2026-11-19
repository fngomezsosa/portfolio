/**
 * Caso de arquitectura: diagrama de flujo hecho con HTML/CSS (sin imágenes).
 * Es una lista ordenada: los lectores de pantalla leen los pasos en orden; las
 * flechas son decorativas. Horizontal en desktop, vertical en mobile y tablet.
 */
import { ArrowRight, Bot, Building2, Database, ListOrdered, Search, ShieldCheck, Webhook } from 'lucide-react';
import { architecture, type ArchitectureIcon, type DecisionIcon } from '../../data/architecture';
import { SectionHeading } from '../ui/SectionHeading';
import { WhatsAppIcon } from '../ui/Icons';
import styles from './Architecture.module.css';

const stepIcons: Record<ArchitectureIcon, React.ReactNode> = {
  whatsapp: <WhatsAppIcon size={24} />,
  webhook: <Webhook size={24} strokeWidth={1.7} aria-hidden="true" />,
  queue: <ListOrdered size={24} strokeWidth={1.7} aria-hidden="true" />,
  agent: <Bot size={24} strokeWidth={1.7} aria-hidden="true" />,
  shield: <ShieldCheck size={24} strokeWidth={1.7} aria-hidden="true" />,
  crm: <Database size={24} strokeWidth={1.7} aria-hidden="true" />,
};

const decisionIcons: Record<DecisionIcon, React.ReactNode> = {
  shield: <ShieldCheck size={26} strokeWidth={1.6} aria-hidden="true" />,
  search: <Search size={26} strokeWidth={1.6} aria-hidden="true" />,
  tenants: <Building2 size={26} strokeWidth={1.6} aria-hidden="true" />,
};

export function Architecture() {
  const { steps, decisions } = architecture;
  return (
    <section id="arquitectura" className="section" aria-labelledby="arquitectura-title">
      <div className="container">
        <SectionHeading id="arquitectura-title" title={architecture.title} subtitle={architecture.subtitle} />

        <div className={`card ${styles.diagram}`} data-reveal>
          <ol className={styles.flow} aria-label="Flujo de un mensaje, paso a paso">
            {steps.map((step, i) => (
              <li key={step.title} className={styles.step}>
                <div className={styles.node}>
                  <span className={styles.number} aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className={styles.icon}>{stepIcons[step.icon]}</span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDetail}>{step.detail}</p>
                </div>
                {i < steps.length - 1 && (
                  <span className={styles.arrow} aria-hidden="true">
                    <ArrowRight size={20} strokeWidth={2} />
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>

        <h3 className={styles.decisionsTitle} data-reveal>
          {architecture.decisionsTitle}
        </h3>
        <ul className={styles.decisions}>
          {decisions.map((d, i) => (
            <li
              key={d.title}
              className={`card ${styles.decision}`}
              data-reveal
              style={{ '--reveal-delay': `${i * 0.1}s` } as React.CSSProperties}
            >
              <span className={styles.decisionIcon}>{decisionIcons[d.icon]}</span>
              <h4>{d.title}</h4>
              <p>{d.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
