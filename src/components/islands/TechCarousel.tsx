/**
 * Carrusel horizontal del stack (island, client:visible).
 * - Avance continuo en loop infinito: la lista se renderiza dos veces y, al llegar a
 *   la mitad, la posición vuelve atrás exactamente una mitad (el salto no se ve).
 * - Se pausa al pasar el cursor, al enfocarlo con teclado o al tocarlo.
 * - Navegación manual con flechas; en táctil se arrastra (es scroll nativo).
 * - Botón de pausa/reanudar (WCAG 2.2.2). Con prefers-reduced-motion no avanza solo.
 * Sin JS es una fila con scroll horizontal.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { allTech } from '../../data/stack';
import { TechIcon } from '../ui/TechIcon';
import styles from './TechCarousel.module.css';

/** Velocidad del avance automático, en px por segundo. */
const SPEED = 38;
/** Tiempo sin interacción antes de reanudar tras un toque o una flecha. */
const RESUME_AFTER_MS = 2500;

export default function TechCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const position = useRef(0);
  const hovering = useRef(false);
  const focused = useRef(false);
  const holdUntil = useRef(0);
  const [userPaused, setUserPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    setReady(true);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const half = () => (trackRef.current ? trackRef.current.scrollWidth / 2 : 0);

  /** Mantiene la posición dentro de la primera mitad (loop infinito). */
  const wrap = useCallback((x: number) => {
    const h = half();
    if (h <= 0) return x;
    if (x >= h) return x - h;
    if (x < 0) return x + h;
    return x;
  }, []);

  // Animación continua.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || userPaused || reducedMotion) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      const paused = hovering.current || focused.current || now < holdUntil.current;
      if (!paused) {
        position.current = wrap(position.current + SPEED * dt);
        track.scrollLeft = position.current;
      }
      frame = requestAnimationFrame(tick);
    };
    position.current = track.scrollLeft;
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [userPaused, reducedMotion, wrap]);

  // Si el usuario mueve el carrusel (dedo, rueda, teclado), se respeta su posición.
  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    if (Math.abs(track.scrollLeft - position.current) > 2) {
      position.current = track.scrollLeft;
      holdUntil.current = performance.now() + RESUME_AFTER_MS;
      const wrapped = wrap(track.scrollLeft);
      if (wrapped !== track.scrollLeft) {
        track.scrollLeft = wrapped;
        position.current = wrapped;
      }
    }
  };

  const step = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const item = track.querySelector('li');
    const distance = (item?.getBoundingClientRect().width ?? 120) * 3;
    holdUntil.current = performance.now() + RESUME_AFTER_MS;
    // Antes de ir hacia atrás desde el inicio, saltar a la copia (sin que se note).
    if (direction === -1 && track.scrollLeft < distance) {
      track.scrollLeft += half();
    }
    const target = track.scrollLeft + distance * direction;
    position.current = target;
    track.scrollTo({ left: target, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const items = (copy: number) =>
    allTech.map((tech) => (
      <li key={`${copy}-${tech.name}`} className={styles.item} aria-hidden={copy === 1 ? true : undefined}>
        <span className={styles.icon}>
          <TechIcon icon={tech.icon} />
        </span>
        <span className={styles.name}>{tech.name}</span>
      </li>
    ));

  const autoplayOn = ready && !userPaused && !reducedMotion;

  return (
    <div
      className={styles.carousel}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Tecnologías con las que trabajo"
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
      onFocus={() => (focused.current = true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) focused.current = false;
      }}
    >
      <div
        ref={trackRef}
        className={styles.track}
        tabIndex={0}
        aria-label="Lista de tecnologías (desplazable)"
        onScroll={onScroll}
        onPointerDown={() => (holdUntil.current = performance.now() + RESUME_AFTER_MS)}
        data-testid="tech-track"
      >
        <ul className={styles.list}>
          {items(0)}
          {items(1)}
        </ul>
      </div>

      <div className={styles.controls}>
        <button type="button" className={styles.control} onClick={() => step(-1)}>
          <ChevronLeft size={20} aria-hidden="true" />
          <span className="visually-hidden">Tecnologías anteriores</span>
        </button>
        {ready && !reducedMotion && (
          <button
            type="button"
            className={styles.control}
            onClick={() => setUserPaused((v) => !v)}
            aria-pressed={userPaused}
          >
            {autoplayOn ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
            <span className="visually-hidden">Pausar el movimiento automático</span>
          </button>
        )}
        <button type="button" className={styles.control} onClick={() => step(1)}>
          <ChevronRight size={20} aria-hidden="true" />
          <span className="visually-hidden">Tecnologías siguientes</span>
        </button>
      </div>
    </div>
  );
}
