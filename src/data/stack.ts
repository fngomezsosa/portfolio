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
  Boxes,
  MessagesSquare,
  ReceiptText,
  ShoppingCart,
  type LucideIcon,
} from 'lucide-react';

export type TechIconRef = { kind: 'brand'; icon: SimpleIcon } | { kind: 'generic'; icon: LucideIcon };

export interface Tech {
  name: string;
  icon: TechIconRef;
  /** false: se muestra en su bloque, pero no en el carrusel de arriba. */
  carousel?: boolean;
}

export interface TechCategory {
  id: string;
  label: string;
  items: Tech[];
}

const brand = (icon: SimpleIcon): TechIconRef => ({ kind: 'brand', icon });
const generic = (icon: LucideIcon): TechIconRef => ({ kind: 'generic', icon });

/**
 * Orden de prioridad, para el carrusel y dentro de cada categoría.
 * Lo que no figura en ninguna lista mantiene su orden de definición, entre PRIORITY y LAST.
 */
const PRIORITY = [
  'Python',
  'Django',
  'Django REST Framework',
  'FastAPI',
  'PostgreSQL',
  'pgvector',
  'OpenAI API',
  'RAG',
  'AWS',
  'Docker',
  'Redis',
];
/** Siempre al final (sin borrarlas). Magento va después de Symfony en Backend; no está en el carrusel. */
const LAST = ['PHP', 'Symfony', 'Magento', 'SOAP', 'GraphQL'];

function rank(name: string, definitionIndex: number): number {
  const p = PRIORITY.indexOf(name);
  if (p !== -1) return p;
  const l = LAST.indexOf(name);
  if (l !== -1) return 10_000 + l;
  return 1_000 + definitionIndex;
}

function byPriority<T extends { name: string }>(items: T[]): T[] {
  return items
    .map((item, i) => ({ item, r: rank(item.name, i) }))
    .sort((a, b) => a.r - b.r)
    .map(({ item }) => item);
}

const categories: TechCategory[] = [
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
      // Sin ícono en Simple Icons: genérico de Lucide (e-commerce).
      { name: 'Magento', icon: generic(ShoppingCart), carousel: false },
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
      // Sin ícono en Simple Icons: genérico de Lucide (chat).
      { name: 'ChatGPT', icon: generic(MessagesSquare), carousel: false },
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
      // Sin ícono de marca: genéricos de Lucide.
      { name: 'ERP (Odoo, Sperta)', icon: generic(Boxes), carousel: false },
      { name: 'Facturación electrónica AFIP/ARCA', icon: generic(ReceiptText), carousel: false },
    ],
  },
];

/** Categorías con sus tecnologías ordenadas por prioridad (grilla de la sección Stack). */
export const stack: TechCategory[] = categories.map((c) => ({ ...c, items: byPriority(c.items) }));

/** Tecnologías del carrusel, ordenadas por prioridad. Excluye las marcadas con carousel: false. */
export const allTech: (Tech & { category: string })[] = byPriority(
  categories.flatMap((c) => c.items.filter((t) => t.carousel !== false).map((t) => ({ ...t, category: c.label }))),
);
