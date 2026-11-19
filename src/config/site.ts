/**
 * Datos personales, enlaces y contacto. Fuente única: si cambia un link, se cambia acá.
 */
export const site = {
  name: 'Federico Gómez',
  fullName: 'Federico Nicolás Gómez',
  initials: 'FG',
  role: 'Desarrollador Backend Python | IA y agentes',
  description:
    'Desarrollo soluciones digitales escalables con Python, Inteligencia Artificial y visión de negocio.',
  location: 'Buenos Aires, Argentina',
  seoTitle: 'Federico Gómez · Desarrollador Backend Python | IA y agentes',
  seoDescription:
    'Desarrollador backend con más de 9 años de experiencia, los últimos 6 con Python y Django. IA aplicada, agentes, RAG y arquitecturas SaaS. Co-founder de GP-Tech.',
} as const;

export const links = {
  email: 'fngomezsosa@gmail.com',
  linkedin: 'https://www.linkedin.com/in/federico-nicolas-gomez-421b14192',
  github: 'https://github.com/fngomezsosa',
  // Número del CV en formato internacional (Argentina, celular: 54 9 11 …).
  whatsapp: 'https://wa.me/5491134363005?text=' + encodeURIComponent('Hola Federico, vi tu portfolio y quería contactarte.'),
  gptech: 'https://www.gp-tech.com.ar/',
} as const;

export const mailto = `mailto:${links.email}`;
