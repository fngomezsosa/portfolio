/** Secciones de la one page, en el orden en que aparecen. El `id` es el ancla de cada sección. */
export const navigation = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'stack', label: 'Stack' },
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'contacto', label: 'Contacto' },
] as const;

export type SectionId = (typeof navigation)[number]['id'];
