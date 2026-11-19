/**
 * Proyectos destacados. Regla: solo funcionalidades implementadas.
 * Si se suma algo planificado, va en `planned` (se muestra separado y rotulado).
 * Estado confirmado por Federico: todo lo listado en `features` está implementado y desplegado.
 */
import type { ImageMetadata } from 'astro';
import tupropiaLogo from '../assets/logos/tupropia-logo.png';
import tuagenciaLogo from '../assets/logos/tuagencia-logo.png';
import gptechIcon from '../assets/logos/gptech-icono.png';

export type ProjectTheme = 'tupropia' | 'tuagencia' | 'gptech';

export interface ChatPreview {
  title: string;
  messages: { from: 'bot' | 'user'; text: string }[];
}

export interface Project {
  id: string;
  name: string;
  theme: ProjectTheme;
  logo: ImageMetadata;
  logoAlt: string;
  /** El logo ya incluye el nombre del producto (no repetir el texto visible). */
  logoHasName: boolean;
  tagline: string;
  description: string;
  featuresTitle: string;
  features: string[];
  planned?: string[];
  /** Vista ilustrativa de una conversación (decorativa). */
  chat?: ChatPreview;
  link?: { label: string; href: string };
}

export const projects: Project[] = [
  {
    id: 'tupropia',
    name: 'TuPropIA',
    theme: 'tupropia',
    logo: tupropiaLogo,
    logoAlt: 'TuPropIA',
    logoHasName: true,
    tagline: 'CRM inmobiliario con IA',
    description:
      'Automatización de consultas y gestión de leads inmobiliarios mediante agentes de Inteligencia Artificial.',
    featuresTitle: 'Funcionalidades',
    features: [
      'Agentes conversacionales',
      'WhatsApp e Instagram',
      'Integración con Tokko',
      'Calificación automática de contactos',
      'Gestión de conversaciones',
      'Arquitectura SaaS multitenant',
    ],
    chat: {
      title: 'Inmobiliaria',
      messages: [
        { from: 'bot', text: '¡Hola! ¿En qué podemos ayudarte?' },
        { from: 'user', text: 'Quiero ver propiedades' },
      ],
    },
  },
  {
    id: 'tuagencia',
    name: 'TuAgencIA',
    theme: 'tuagencia',
    logo: tuagenciaLogo,
    logoAlt: 'TuAgencIA',
    logoHasName: true,
    tagline: 'CRM para concesionarias con IA',
    description:
      'Una solución tecnológica para automatizar consultas, gestionar potenciales compradores y potenciar las ventas del sector automotor.',
    featuresTitle: 'Funcionalidades',
    features: [
      'Agentes de IA',
      'Gestión de leads',
      'Automatización de consultas',
      'Integración con canales de comunicación',
      'Integración con Mercado Libre',
    ],
    chat: {
      title: 'Concesionaria',
      messages: [
        { from: 'bot', text: '¿En qué podemos ayudarte?' },
        { from: 'user', text: 'Busco un auto usado' },
      ],
    },
  },
  {
    id: 'gptech',
    name: 'GP-Tech',
    theme: 'gptech',
    logo: gptechIcon,
    logoAlt: 'GP-Tech',
    logoHasName: false,
    tagline: 'Innovación. Tecnología. Soluciones.',
    description:
      'Empresa tecnológica enfocada en diseñar y desarrollar productos digitales con Inteligencia Artificial, automatización y arquitecturas escalables.',
    featuresTitle: 'Qué hacemos',
    features: [
      'Desarrollo de productos SaaS',
      'Soluciones con IA',
      'Automatización de procesos',
      'Desarrollo de software a medida',
    ],
    link: { label: 'Visitar GP-Tech', href: 'https://www.gp-tech.com.ar/' },
  },
];
