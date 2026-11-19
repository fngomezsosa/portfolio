/**
 * Header sticky (island, client:load).
 * - Scroll spy: marca la sección visible en la navegación.
 * - Menú hamburguesa en mobile/tablet: Esc cierra y devuelve el foco al botón;
 *   elegir una sección cierra el menú.
 * Sin JS (antes de hidratar), los enlaces de escritorio funcionan igual: son anclas.
 */
import { useEffect, useRef, useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { navigation, sectionAliases, type SectionId } from '../../config/navigation';
import { Logo } from '../ui/Logo';
import styles from './Header.module.css';

export default function Header() {
  const [active, setActive] = useState<SectionId>('inicio');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Scroll spy: la sección que cruza la franja central de la pantalla es la activa.
  useEffect(() => {
    const ids = [...navigation.map((item) => item.id), ...Object.keys(sectionAliases)];
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          setActive(sectionAliases[id] ?? (id as SectionId));
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Menú abierto: Esc cierra, pasar a escritorio cierra, foco al primer enlace.
  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector('a')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onChange = () => desktop.matches && setOpen(false);
    document.addEventListener('keydown', onKey);
    desktop.addEventListener('change', onChange);
    return () => {
      document.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', onChange);
    };
  }, [open]);

  const navLinks = (variant: 'desktop' | 'mobile') =>
    navigation.map((item) => (
      <li key={item.id}>
        <a
          href={`#${item.id}`}
          className={`${styles.link} ${active === item.id ? styles.active : ''}`}
          aria-current={active === item.id ? 'location' : undefined}
          onClick={variant === 'mobile' ? () => setOpen(false) : undefined}
        >
          {item.label}
        </a>
      </li>
    ));

  return (
    <header className={`${styles.header} ${scrolled || open ? styles.solid : ''}`}>
      <div className={`container ${styles.inner}`}>
        <Logo />

        <nav aria-label="Secciones" className={styles.desktopNav}>
          <ul>{navLinks('desktop')}</ul>
        </nav>

        <a href="#contacto" className={styles.cta}>
          Hablemos <ArrowRight size={16} aria-hidden="true" />
        </a>

        <button
          ref={buttonRef}
          type="button"
          className={styles.burger}
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          <span className="visually-hidden">{open ? 'Cerrar menú' : 'Abrir menú'}</span>
        </button>
      </div>

      <div id="menu-mobile" ref={panelRef} className={styles.panel} hidden={!open}>
        <nav aria-label="Secciones (menú)" className="container">
          <ul>{navLinks('mobile')}</ul>
          <a href="#contacto" className={styles.panelCta} onClick={() => setOpen(false)}>
            Hablemos <ArrowRight size={16} aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  );
}
