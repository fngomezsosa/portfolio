/** Contenido de "Sobre mí" (fuente: CV). */
export const about = {
  paragraphs: [
    'Desarrollador backend con más de 11 años de experiencia en plataformas de turismo y e-commerce. Hoy construyo productos con agentes de IA: soy co-fundador de GP Tech, donde diseñé y llevé a producción TuPropIA y TuAgencIA, plataformas SaaS multitenant con agentes que atienden consultas por WhatsApp, califican leads y agendan visitas.',
    'Antes fui referente técnico en turismo y e-commerce: APIs REST, integraciones con proveedores internacionales, ERP y facturación electrónica (Odoo, AFIP/ARCA) y microservicios serverless en AWS. Python en producción desde 2020 y Django/FastAPI desde 2023. Trabajo a diario con desarrollo asistido por IA (Claude Code), con plan propio y revisión de todo el código.',
  ],
  stats: [
    { icon: 'code', value: '11+ años', label: 'de experiencia' },
    { icon: 'python', value: 'Desde 2020', label: 'Python en producción' },
    { icon: 'rocket', value: '2 productos', label: 'en producción' },
  ],
} as const;

export const heroHighlights = [
  { icon: 'python', label: 'Python' },
  { icon: 'brain', label: 'IA & Agentes' },
  { icon: 'rocket', label: 'Productos SaaS' },
] as const;
