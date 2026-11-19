import type { ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'md' | 'sm';
  /** Abre en una pestaña nueva (enlaces externos). */
  external?: boolean;
  icon?: ReactNode;
  iconEnd?: ReactNode;
  className?: string;
  ariaLabel?: string;
}

/** Enlace con aspecto de botón (píldora). */
export function Button({ href, children, variant = 'primary', size = 'md', external, icon, iconEnd, className, ariaLabel }: ButtonProps) {
  return (
    <a
      href={href}
      className={[styles.button, styles[variant], styles[size], className].filter(Boolean).join(' ')}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      aria-label={ariaLabel}
    >
      {icon}
      <span>{children}</span>
      {iconEnd}
      {external && <span className="visually-hidden"> (se abre en una pestaña nueva)</span>}
    </a>
  );
}
