/**
 * Íconos de marca para contacto y footer. GitHub y WhatsApp son los oficiales de
 * Simple Icons; LinkedIn no está en la librería (la marca pidió retirarlo), así que
 * se usa un glifo propio simple.
 */
import { siGithub, siWhatsapp, type SimpleIcon } from 'simple-icons';

interface IconProps {
  size?: number;
  className?: string;
}

export function BrandIcon({ icon, size = 20, className, color = 'currentColor' }: IconProps & { icon: SimpleIcon; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" focusable="false">
      <path d={icon.path} fill={color} />
    </svg>
  );
}

export function GithubIcon(props: IconProps) {
  return <BrandIcon icon={siGithub} {...props} />;
}

export function WhatsAppIcon(props: IconProps) {
  return <BrandIcon icon={siWhatsapp} {...props} />;
}

export function LinkedInIcon({ size = 20, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" focusable="false">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="currentColor" />
      <rect x="6" y="10" width="2.6" height="8" fill="var(--icon-cutout, #040807)" />
      <circle cx="7.3" cy="6.9" r="1.55" fill="var(--icon-cutout, #040807)" />
      <path
        d="M11 10h2.5v1.2c.4-.8 1.4-1.4 2.7-1.4 2.2 0 3 1.4 3 3.6V18h-2.6v-4.1c0-1.1-.3-1.9-1.3-1.9s-1.6.8-1.6 1.9V18H11z"
        fill="var(--icon-cutout, #040807)"
      />
    </svg>
  );
}
