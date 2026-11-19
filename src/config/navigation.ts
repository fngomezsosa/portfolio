/** Secciones de la one page, en el orden en que aparecen. El `id` es el ancla de cada sección. */
export const navigation = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'arquitectura', label: 'Arquitectura' },
  { id: 'stack', label: 'Stack' },
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'contacto', label: 'Contacto' },
] as const;

export type SectionId = (typeof navigation)[number]['id'];

/**
 * Secciones sin entrada propia en el menú: mientras están en pantalla, se marca
 * la entrada indicada (p. ej. { 'mi-seccion': 'proyectos' }). Hoy todas tienen entrada.
 */
export const sectionAliases: Record<string, SectionId> = {};
