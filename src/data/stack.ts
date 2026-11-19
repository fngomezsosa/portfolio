/**
 * Stack tecnológico agrupado por área.
 * Íconos: oficiales de Simple Icons (CC0) cuando existen. AWS, OpenAI y los conceptos
 * sin marca (LLMs, RAG, Tool Calling…) usan íconos genéricos de Lucide.
 * Los imports son con nombre: el carrusel solo empaqueta los íconos que se usan.
 */
import {
  siPython,
  siDjango,
  siFastapi,
  siPhp,
  siSymfony,
  siReact,
  siJavascript,
  siTypescript,
  siClaude,
  siPostgresql,
  siMysql,
  siMongodb,
  siRedis,
  siDocker,
  siServerless,
  siGraphql,
  siGit,
  type SimpleIcon,
} from 'simple-icons';
import {
  Braces,
  Brain,
  Cloud,
  Database,
  FileCode,
  Layers,
  ListOrdered,
  Network,
  Search,
  Sparkles,
  Webhook,
  Wrench,
  Zap,
  Bot,
  type LucideIcon,
} from 'lucide-react';

export type TechIconRef = { kind: 'brand'; icon: SimpleIcon } | { kind: 'generic'; icon: LucideIcon };

export interface Tech {
  name: string;
  icon: TechIconRef;
}

export interface TechCategory {
  id: string;
  label: string;
  items: Tech[];
}

const brand = (icon: SimpleIcon): TechIconRef => ({ kind: 'brand', icon });
const generic = (icon: LucideIcon): TechIconRef => ({ kind: 'generic', icon });

export const stack: TechCategory[] = [
  {
    id: 'backend',
    label: 'Backend',
    items: [
      { name: 'Python', icon: brand(siPython) },
      { name: 'Django', icon: brand(siDjango) },
      { name: 'Django REST Framework', icon: brand(siDjango) },
      { name: 'FastAPI', icon: brand(siFastapi) },
      { name: 'PHP', icon: brand(siPhp) },
      { name: 'Symfony', icon: brand(siSymfony) },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    items: [
      { name: 'React', icon: brand(siReact) },
      { name: 'JavaScript', icon: brand(siJavascript) },
      { name: 'TypeScript', icon: brand(siTypescript) },
    ],
  },
  {
    id: 'ia',
    label: 'Inteligencia Artificial',
    items: [
      { name: 'OpenAI API', icon: generic(Sparkles) },
      { name: 'LLMs', icon: generic(Brain) },
      { name: 'AI Agents', icon: generic(Bot) },
      { name: 'Tool Calling', icon: generic(Wrench) },
      { name: 'RAG', icon: generic(Search) },
      { name: 'Embeddings', icon: generic(Layers) },
      { name: 'pgvector', icon: brand(siPostgresql) },
      { name: 'Claude Code', icon: brand(siClaude) },
    ],
  },
  {
    id: 'datos',
    label: 'Bases de datos',
    items: [
      { name: 'PostgreSQL', icon: brand(siPostgresql) },
      { name: 'MySQL', icon: brand(siMysql) },
      { name: 'MongoDB', icon: brand(siMongodb) },
      { name: 'DynamoDB', icon: generic(Database) },
      { name: 'Redis', icon: brand(siRedis) },
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud e infraestructura',
    items: [
      { name: 'AWS', icon: generic(Cloud) },
      { name: 'Lambda', icon: generic(Zap) },
      { name: 'API Gateway', icon: generic(Network) },
      { name: 'SQS', icon: generic(ListOrdered) },
      { name: 'Docker', icon: brand(siDocker) },
      { name: 'Serverless', icon: brand(siServerless) },
    ],
  },
  {
    id: 'otras',
    label: 'Otras tecnologías',
    items: [
      { name: 'REST APIs', icon: generic(Braces) },
      { name: 'GraphQL', icon: brand(siGraphql) },
      { name: 'SOAP', icon: generic(FileCode) },
      { name: 'Webhooks', icon: generic(Webhook) },
      { name: 'Git', icon: brand(siGit) },
    ],
  },
];

/** Todas las tecnologías en una sola fila (carrusel), sin repetir nombres. */
export const allTech: (Tech & { category: string })[] = stack.flatMap((c) =>
  c.items.map((t) => ({ ...t, category: c.label })),
);
