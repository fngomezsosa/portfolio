/**
 * Caso de arquitectura: cómo funciona TuPropIA.
 * Textos definidos por Federico; no agregar pasos ni decisiones que no estén acá.
 */
export type ArchitectureIcon = 'whatsapp' | 'webhook' | 'queue' | 'agent' | 'shield' | 'crm';
export type DecisionIcon = 'shield' | 'search' | 'tenants';

export const architecture = {
  title: 'Cómo funciona TuPropIA',
  subtitle: 'Arquitectura de un agente de IA conversacional en producción',
  steps: [
    { icon: 'whatsapp', title: 'WhatsApp Cloud API', detail: 'Mensaje del contacto' },
    { icon: 'webhook', title: 'Webhook', detail: 'Validación HMAC-SHA256 y rate limiting con Redis' },
    { icon: 'queue', title: 'Cola de procesamiento', detail: 'Redis + workers RQ (asíncrono)' },
    { icon: 'agent', title: 'Agente de IA', detail: 'OpenAI API, RAG con pgvector y tool calling' },
    { icon: 'shield', title: 'Validación en el servidor', detail: 'Acciones ESCALAR, CALIFICAR y VISITA' },
    { icon: 'crm', title: 'CRM', detail: 'Contacto calificado, historial y resumen de la conversación' },
  ] satisfies { icon: ArchitectureIcon; title: string; detail: string }[],
  decisionsTitle: 'Decisiones de diseño',
  decisions: [
    {
      icon: 'shield',
      title: 'Acciones validadas en el servidor',
      text: 'El agente propone acciones, pero nunca las ejecuta por su cuenta: el servidor las valida antes de escribir en el CRM.',
    },
    {
      icon: 'search',
      title: 'RAG propio, sin frameworks',
      text: 'Embeddings, búsqueda semántica y generación implementados directamente con el SDK de OpenAI y pgvector, para controlar calidad y costos.',
    },
    {
      icon: 'tenants',
      title: 'SaaS multitenant',
      text: 'Cada inmobiliaria trabaja sobre sus propios datos, con roles y planes.',
    },
  ] satisfies { icon: DecisionIcon; title: string; text: string }[],
};
