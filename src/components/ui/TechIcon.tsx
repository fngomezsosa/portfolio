import type { TechIconRef } from '../../data/stack';
import { BrandIcon } from './Icons';

/** Luminancia relativa de un color hex (WCAG). */
function luminance(hex: string): number {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Ícono de una tecnología. Las marcas usan su color oficial; si es demasiado oscuro
 * para el fondo (Django, Symfony…), se usa el color de texto para que se vea.
 */
export function TechIcon({ icon, size = 30 }: { icon: TechIconRef; size?: number }) {
  if (icon.kind === 'brand') {
    const color = luminance(icon.icon.hex) < 0.06 ? 'var(--text)' : `#${icon.icon.hex}`;
    return <BrandIcon icon={icon.icon} size={size} color={color} />;
  }
  const Generic = icon.icon;
  return <Generic size={size} strokeWidth={1.6} color="var(--accent)" aria-hidden="true" />;
}
