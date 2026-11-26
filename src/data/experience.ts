/**
 * Trayectoria profesional, de la más reciente a la más antigua.
 * Fuente: CV (versión Backend Python | IA y agentes). No agregar logros ni métricas
 * que no estén en el CV.
 */
export interface Job {
  company: string;
  role: string;
  /** YYYY-MM */
  start: string;
  /** YYYY-MM o null si es el puesto actual. */
  end: string | null;
  summary: string;
  highlights: string[];
  tech: string[];
}

export const experience: Job[] = [
  {
    company: 'GP-Tech',
    role: 'Co-Founder',
    start: '2026-05',
    end: null,
    summary:
      'Diseño y desarrollo de TuPropIA y TuAgencIA, plataformas SaaS multitenant con roles, planes y billing. Producto propio, de requisitos a producción, en paralelo a E2E hasta 11/2026.',
    highlights: [
      'Agente de IA conversacional por WhatsApp: califica leads, responde consultas y agenda visitas. Las acciones del agente se procesan y validan en el servidor antes de ejecutarse.',
      'RAG implementado desde cero con pgvector y OpenAI SDK (embeddings, búsqueda semántica y generación de respuestas), sin frameworks de abstracción.',
      'Resúmenes automáticos de cada conversación, con historial y nivel de interés del contacto, guardados en el CRM.',
      'Integración con WhatsApp Cloud API: webhooks con validación HMAC-SHA256, rate limiting con Redis y procesamiento asíncrono con workers RQ.',
    ],
    tech: ['Django 5', 'DRF', 'PostgreSQL 16', 'pgvector', 'Redis', 'RQ', 'Docker', 'React', 'TypeScript', 'OpenAI API'],
  },
  {
    company: 'E2E Travel Solutions',
    role: 'Senior Backend Developer & Technical Lead',
    start: '2023-11',
    end: '2026-11',
    summary:
      'Desarrollo backend de plataformas del sector turismo con Python y Django: integraciones y APIs REST con múltiples proveedores internacionales.',
    highlights: [
      'Servicios e integraciones con Django y FastAPI en proyectos como SafeTravel; microservicios serverless en AWS (Lambda, API Gateway, SQS, DynamoDB).',
      'Integración de ERP de facturación (Odoo y Sperta) vía API: generación de facturas y recibos y obtención de los PDF para el cliente.',
      'Facturación electrónica con AFIP/ARCA mediante una API externa, en reemplazo de la integración con Sperta.',
      'Optimización de un proceso crítico: de ~1 minuto a ~20 segundos de ejecución.',
      'Referente técnico del equipo: arquitecturas, revisiones de código y coordinación de desarrolladores.',
      'Flujo de trabajo asistido por IA: análisis propio del incidente, contraste del plan con IA, implementación con Claude Code, revisión del código y pruebas antes de pasar a QA.',
    ],
    tech: ['Python', 'Django', 'FastAPI', 'AWS Lambda', 'API Gateway', 'SQS', 'DynamoDB', 'Claude Code'],
  },
  {
    company: 'Improntus',
    role: 'Magento Developer / Technical Lead',
    start: '2022-08',
    end: '2023-11',
    summary: 'Módulos custom en Magento 2 e integración frontend-backend mediante GraphQL.',
    highlights: [
      'Evolución y mantenimiento de un ecosistema de 5 tiendas productivas.',
      'Coordinación de un equipo de +6 desarrolladores.',
    ],
    tech: ['PHP', 'Magento 2', 'GraphQL'],
  },
  {
    company: 'Lyracons (adquirida por Valtech en 2022)',
    role: 'Core Developer',
    start: '2020-08',
    end: '2022-08',
    summary:
      'Desarrollé el backend de la plataforma e-commerce de La Nación (Libook) sobre Magento 2.4, con arquitectura Headless PWA y servicios GraphQL; fue el primer proyecto con GraphQL de la empresa, con contacto directo con el cliente. Fui el único desarrollador Core asignado al backend en la etapa inicial y luego coordiné a un desarrollador incorporado hasta la salida a producción.',
    highlights: [],
    tech: ['Arquitectura backend', 'APIs'],
  },
  {
    company: 'TIJE Travel',
    role: 'Full Stack Developer (Senior)',
    start: '2015-02',
    end: '2020-08',
    summary:
      'Evolución de Junior a Senior en 5 años sobre plataformas web de turismo; Symfony / Doctrine, módulo de gestión y control de reservas.',
    highlights: [
      'Participé en la migración tecnológica con microservicios en AWS Lambda (Python), API Gateway y DynamoDB (últimos 6 meses).',
      'Trabajo con MongoDB y bases relacionales; integraciones REST y SOAP con proveedores externos.',
    ],
    tech: ['PHP', 'Symfony', 'Doctrine', 'Python', 'AWS Lambda', 'DynamoDB', 'MongoDB', 'SOAP'],
  },
];

export const experienceSummary = {
  value: '11+ años',
  label: 'de experiencia',
  text: 'Backend, integraciones y liderazgo técnico; hoy, productos propios con IA.',
};

/** "2023-11" → "11/2023" */
export function formatMonth(ym: string): string {
  const [year, month] = ym.split('-');
  return `${month}/${year}`;
}
