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
      'Diseño y desarrollo de TuPropIA, plataforma SaaS multitenant con roles, planes y billing. Proyecto propio, de requisitos a producción.',
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
    role: 'Senior Backend Developer & Líder Técnico',
    start: '2023-11',
    end: '2026-11',
    summary:
      'Desarrollo backend de plataformas del sector turismo con Python y Django: integraciones de alto volumen y APIs REST con múltiples proveedores internacionales.',
    highlights: [
      'Servicios e integraciones con Django y FastAPI en proyectos como SafeTravel; microservicios serverless en AWS (Lambda, API Gateway, SQS, DynamoDB).',
      'Optimización de procesos críticos y consultas de base de datos con alto volumen de información, reduciendo tiempos de respuesta.',
      'Referente técnico del equipo: arquitecturas, revisiones de código y coordinación de desarrolladores.',
      'Flujo de trabajo asistido por IA: análisis propio del incidente, contraste del plan con IA, implementación con Claude Code, revisión del código y pruebas antes de pasar a QA.',
    ],
    tech: ['Python', 'Django', 'FastAPI', 'AWS Lambda', 'API Gateway', 'SQS', 'DynamoDB', 'Claude Code'],
  },
  {
    company: 'Improntus',
    role: 'Magento Developer / Líder Técnico',
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
    company: 'Lyracons',
    role: 'Core Developer',
    start: '2020-08',
    end: '2022-08',
    summary: 'Arquitectura backend de un proyecto estratégico como único desarrollador Core asignado.',
    highlights: [
      'Ciclo completo, desde requerimientos hasta producción.',
      'Comunicación diaria con el cliente.',
    ],
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
      'Microservicios en AWS Lambda con Python, API Gateway y DynamoDB.',
      'Trabajo con MongoDB y bases relacionales; integraciones REST y SOAP con proveedores externos.',
    ],
    tech: ['PHP', 'Symfony', 'Doctrine', 'Python', 'AWS Lambda', 'DynamoDB', 'MongoDB', 'SOAP'],
  },
];

export const experienceSummary = {
  value: '+9 años',
  label: 'de experiencia',
  text: 'Backend, integraciones y liderazgo técnico; hoy, productos propios con IA.',
};

const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** "2023-11" → "Nov 2023" */
export function formatMonth(ym: string): string {
  const [year, month] = ym.split('-').map(Number);
  const m = months[month - 1];
  return `${m[0].toUpperCase()}${m.slice(1)} ${year}`;
}
