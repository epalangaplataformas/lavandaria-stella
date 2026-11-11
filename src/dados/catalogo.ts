/**
 * Catálogo de serviços e tabela de preços (Tabela de Preços Actual 2026).
 * Valores em Kwanzas (Kz). Este módulo é puro (sem React/DOM) porque também é lido no build
 * para gerar JSON-LD, llms.txt e o conteúdo estático para motores de busca.
 */

/* ----------------------------------------------------------------------------
 * Prazos de entrega
 * ------------------------------------------------------------------------- */

export const PRAZOS = [
  { id: 'normal', nome: 'Normal', diasPadrao: 2 },
  { id: 'semi', nome: 'Semi-urgente', diasPadrao: 1 },
  { id: 'maxima', nome: 'Urgência máxima', diasPadrao: 0 },
] as const

export type PrazoId = (typeof PRAZOS)[number]['id']

export const PRAZO_INICIAL: PrazoId = 'normal'

export function prazoPorId(id: PrazoId) {
  const prazo = PRAZOS.find((p) => p.id === id)
  // Impossível em runtime porque `PrazoId` é derivado de `PRAZOS`; protege contra dados corrompidos.
  return prazo ?? PRAZOS[0]
}

export function ehPrazoId(valor: unknown): valor is PrazoId {
  return PRAZOS.some((p) => p.id === valor)
}

/** "No mesmo dia", "Em 1 dia", "Em 5 dias". */
export function rotuloDias(dias: number): string {
  if (dias <= 0) return 'No mesmo dia'
  return dias === 1 ? 'Em 1 dia' : `Em ${dias} dias`
}

/* ----------------------------------------------------------------------------
 * Categorias e ícones
 * ------------------------------------------------------------------------- */

/** Identificadores de ícone; o mapeamento para o componente Remix fica em `componentes/icones-servico.tsx`. */
export type IconeId =
  | 'camiseta'
  | 'casaco'
  | 'calca'
  | 'vestido'
  | 'gala'
  | 'noiva'
  | 'cama'
  | 'almofada'
  | 'cortina'
  | 'banho'
  | 'urso'
  | 'calcado'
  | 'acessorio'
  | 'farda'
  | 'beca'
  | 'oficio'
  | 'passar'

export interface Categoria {
  readonly id: string
  readonly nome: string
  readonly icone: IconeId
  readonly descricao: string
}

export const CATEGORIAS = [
  {
    id: 'roupa',
    nome: 'Roupa do dia a dia',
    icone: 'camiseta',
    descricao: 'Camisas, blusas, calças, saias, T-shirts e peças de uso diário.',
  },
  {
    id: 'fatos',
    nome: 'Fatos e casacos',
    icone: 'casaco',
    descricao: 'Fatos, casacos, blêizeres, bazin e peças de alfaiataria.',
  },
  {
    id: 'gala',
    nome: 'Gala e noiva',
    icone: 'gala',
    descricao: 'Vestidos de gala, vestidos de noiva e fato de noivo, com tratamento especial.',
  },
  {
    id: 'vestidos',
    nome: 'Vestidos',
    icone: 'vestido',
    descricao: 'Vestidos simples, curtos, africanos e de criança.',
  },
  {
    id: 'fardas',
    nome: 'Fardas e profissões',
    icone: 'farda',
    descricao: 'Batas, aventais, becas, batinas, fardas e fatos de mecânico.',
  },
  {
    id: 'casa',
    nome: 'Casa e peluches',
    icone: 'cama',
    descricao: 'Lençóis, cobertores, colchas, cortinas, toalhas, almofadas e peluches.',
  },
  {
    id: 'calcado',
    nome: 'Calçado e acessórios',
    icone: 'calcado',
    descricao: 'Ténis, chapéus, gravatas, meias e acessórios.',
  },
  {
    id: 'engomar',
    nome: 'Engomar',
    icone: 'passar',
    descricao: 'Serviço de passagem a ferro para fatos, camisas, vestidos e muito mais.',
  },
] as const satisfies readonly Categoria[]

export type CategoriaId = (typeof CATEGORIAS)[number]['id']

/* ----------------------------------------------------------------------------
 * Serviços
 * ------------------------------------------------------------------------- */

export interface Servico {
  /** Nº da tabela de preços oficial (1–92). */
  readonly id: number
  readonly nome: string
  readonly categoria: CategoriaId
  readonly icone: IconeId
  readonly precos: Readonly<Record<PrazoId, number>>
  /** Prazos em dias, apenas quando diferem do padrão (ex.: ténis, colchas e vestidos de noiva). */
  readonly dias?: Readonly<Record<PrazoId, number>>
}

/** Peças de tratamento demorado: 5 dias (normal), 3 dias (semi-urgente) e 2 dias (urgência máxima). */
const PRAZO_LONGO = { normal: 5, semi: 3, maxima: 2 } as const

function servico(
  id: number,
  nome: string,
  categoria: CategoriaId,
  icone: IconeId,
  normal: number,
  semi: number,
  maxima: number,
  dias?: Readonly<Record<PrazoId, number>>,
): Servico {
  return { id, nome, categoria, icone, precos: { normal, semi, maxima }, ...(dias ? { dias } : {}) }
}

export const SERVICOS: readonly Servico[] = [
  servico(1, 'Almofada Cheia', 'casa', 'almofada', 2000, 3000, 4000),
  servico(2, 'Almofada Pequena', 'casa', 'almofada', 1000, 1500, 2000),
  servico(3, 'Avental', 'fardas', 'farda', 600, 900, 1200),
  servico(4, 'Bata', 'fardas', 'farda', 1200, 1800, 2400),
  // ATENÇÃO: no PDF original, a urgência máxima da Bata Escolar (3.000) foge à regra ×2 (esperado 2.000). Confirmar com a lavandaria.
  servico(5, 'Bata Escolar', 'fardas', 'farda', 1000, 1500, 3000),
  servico(6, 'Batina de Padre', 'fardas', 'farda', 3000, 4500, 6000),
  servico(7, 'Bazin de 3 Peças', 'fatos', 'casaco', 3000, 4500, 6000),
  servico(8, 'Bazin Simples', 'fatos', 'casaco', 2000, 3000, 4000),
  servico(9, 'Beca', 'fardas', 'beca', 2000, 3000, 4000),
  servico(10, 'Bermuda de Linho', 'roupa', 'calca', 2000, 3000, 4000),
  servico(11, 'Blusa Simples', 'roupa', 'camiseta', 1000, 1500, 2000),
  servico(12, 'Blusa de Linho', 'roupa', 'camiseta', 1000, 1500, 2000),
  servico(13, 'Blusa Africana', 'roupa', 'camiseta', 1000, 1500, 2000),
  servico(14, 'Blusa Plissada', 'roupa', 'camiseta', 1000, 1500, 2000),
  servico(15, 'Blusão', 'fatos', 'casaco', 1500, 2250, 3000),
  servico(16, 'Boneca Grande (ourso)', 'casa', 'urso', 5000, 7500, 10000, PRAZO_LONGO),
  servico(17, 'Boneca Pequena', 'casa', 'urso', 3000, 4500, 6000, PRAZO_LONGO),
  servico(18, 'Calça Normal', 'roupa', 'calca', 1000, 1500, 2000),
  servico(19, 'Calça de Linho', 'roupa', 'calca', 1500, 2250, 3000),
  // ATENÇÃO: no PDF original, a urgência máxima da Calça de Ganga (1.000) é inferior à semi-urgente (esperado 2.000). Confirmar com a lavandaria.
  servico(20, 'Calça de Ganga', 'roupa', 'calca', 1000, 1500, 1000),
  servico(21, 'Calça Jeans', 'roupa', 'calca', 1500, 2250, 3000),
  servico(22, 'Calça Olímpio (Majuco)', 'roupa', 'calca', 1500, 2250, 3000),
  servico(23, 'Calção Normal', 'roupa', 'calca', 1000, 1500, 2000),
  servico(24, 'Camisa Normal', 'roupa', 'camiseta', 1000, 1500, 2000),
  servico(25, 'Camisa Africana', 'roupa', 'camiseta', 1500, 2250, 3000),
  servico(26, 'Camisola', 'roupa', 'camiseta', 1000, 1500, 2000),
  servico(27, 'Casaco Normal (blêizer)', 'fatos', 'casaco', 1500, 2250, 3000),
  servico(28, 'Casaco de Napa', 'fatos', 'casaco', 2000, 3000, 4000),
  servico(29, 'Casaco Jeans', 'fatos', 'casaco', 1500, 2250, 3000),
  servico(30, 'Casaco Comprido', 'fatos', 'casaco', 2000, 3000, 4000),
  servico(31, 'Casaco Comprido de Pele', 'fatos', 'casaco', 8000, 12000, 16000),
  servico(32, 'Casaco Médio', 'fatos', 'casaco', 1000, 1500, 2000),
  servico(33, 'Casaco de Farda', 'fardas', 'farda', 2000, 3000, 4000),
  servico(34, 'Casaco com Brilho', 'fatos', 'casaco', 2000, 3000, 4000),
  servico(35, 'Chapéu', 'calcado', 'acessorio', 1000, 1500, 2000),
  servico(36, 'Cobertor', 'casa', 'cama', 5000, 7500, 10000, PRAZO_LONGO),
  servico(37, 'Colcha', 'casa', 'cama', 8000, 12000, 16000, PRAZO_LONGO),
  servico(38, 'Colcha Branca', 'casa', 'cama', 10000, 15000, 20000, PRAZO_LONGO),
  servico(39, 'Colete', 'fatos', 'casaco', 500, 750, 1000),
  servico(40, 'Cortina de Pano Grosso', 'casa', 'cortina', 4000, 6000, 8000),
  servico(41, 'Cortina Simples', 'casa', 'cortina', 2000, 3000, 4000),
  servico(42, 'Fato de Linho', 'fatos', 'casaco', 3000, 4500, 6000),
  servico(43, 'Fato de Criança', 'fatos', 'casaco', 1500, 2250, 3000),
  servico(44, 'Fato de Criança 3 Peças', 'fatos', 'casaco', 2000, 3000, 4000),
  servico(45, 'Fato de Napa', 'fatos', 'casaco', 4000, 6000, 8000),
  servico(46, 'Fato de Noivo', 'gala', 'gala', 5000, 7500, 10000),
  servico(47, 'Fato Branco', 'fatos', 'casaco', 3000, 4500, 6000),
  servico(48, 'Fato Normal', 'fatos', 'casaco', 2500, 3750, 5000),
  servico(49, 'Fato Comprido de Pele', 'fatos', 'casaco', 10000, 15000, 20000),
  servico(50, 'Fato Africano', 'fatos', 'casaco', 2500, 3750, 5000),
  servico(51, 'Fato com Pedrinhas', 'fatos', 'casaco', 3000, 4500, 6000),
  servico(52, 'Fato de 3 Peças', 'fatos', 'casaco', 2500, 3750, 5000),
  servico(53, 'Fato de Treino', 'fatos', 'casaco', 4000, 6000, 8000),
  servico(54, 'Gravata', 'calcado', 'acessorio', 300, 450, 600),
  servico(55, 'Lençol Jogo', 'casa', 'cama', 3000, 4500, 6000),
  servico(56, 'Lençol Unidade', 'casa', 'cama', 1500, 2250, 3000),
  servico(57, 'Macacão', 'roupa', 'calca', 2500, 3750, 5000),
  servico(58, 'Macacão Mecânica', 'fardas', 'oficio', 4000, 6000, 8000),
  servico(59, 'Meias', 'calcado', 'acessorio', 300, 450, 600),
  servico(60, 'Parte-Escorno', 'calcado', 'acessorio', 500, 750, 1000),
  servico(61, 'Roupão', 'casa', 'banho', 3000, 4500, 6000),
  servico(62, 'Saia Curta Simples', 'roupa', 'vestido', 1000, 1500, 2000),
  servico(63, 'Saia Plissada/Comprida', 'roupa', 'vestido', 2000, 3000, 4000),
  servico(64, 'T-shirt Normal', 'roupa', 'camiseta', 1000, 1500, 2000),
  servico(65, 'Ténis Normal', 'calcado', 'calcado', 3000, 4500, 6000, PRAZO_LONGO),
  servico(66, 'Ténis Branco', 'calcado', 'calcado', 4000, 6000, 8000, PRAZO_LONGO),
  servico(67, 'Ténis Camurça', 'calcado', 'calcado', 3000, 4500, 6000, PRAZO_LONGO),
  servico(68, 'Toalha de Mesa', 'casa', 'banho', 2000, 3000, 4000),
  servico(69, 'Toalha de Banho', 'casa', 'banho', 2500, 3750, 5000),
  servico(70, 'Túnica', 'roupa', 'vestido', 2500, 3750, 5000),
  servico(71, 'Vestido de Gala com Brilho', 'gala', 'gala', 4500, 6750, 9000),
  servico(72, 'Vestido de Gala Branco', 'gala', 'gala', 5000, 7500, 10000),
  servico(73, 'Vestido de Gala com Pano Africano', 'gala', 'gala', 5000, 7500, 10000),
  servico(74, 'Vestido de Gala Volumoso (especial Noiva)', 'gala', 'noiva', 15000, 22500, 30000, PRAZO_LONGO),
  servico(75, 'Vestido de Gala Volumoso', 'gala', 'gala', 8000, 12000, 16000, PRAZO_LONGO),
  servico(76, 'Vestido de Gala Normal', 'gala', 'gala', 4000, 6000, 8000),
  servico(77, 'Vestido de Criança', 'vestidos', 'vestido', 2500, 3750, 5000),
  servico(78, 'Vestido Curto', 'vestidos', 'vestido', 2500, 3750, 5000),
  servico(79, 'Vestido Simples', 'vestidos', 'vestido', 2000, 3000, 4000),
  servico(80, 'Vestido Africano (simples)', 'vestidos', 'vestido', 3500, 5250, 7000),
  servico(81, 'Vestido de Noiva Grande Volumoso', 'gala', 'noiva', 35000, 52500, 70000, PRAZO_LONGO),
  servico(82, 'Vestido de Noiva Grande', 'gala', 'noiva', 25000, 37500, 50000, PRAZO_LONGO),
  servico(83, 'Vestido de Noiva Média', 'gala', 'noiva', 20000, 30000, 40000, PRAZO_LONGO),
  servico(84, 'Vestido de Noiva Pequeno', 'gala', 'noiva', 15000, 22500, 30000, PRAZO_LONGO),
  servico(85, 'Engomar Fato', 'engomar', 'passar', 1200, 1800, 2400),
  servico(86, 'Engomar Casaco', 'engomar', 'passar', 700, 1050, 1400),
  servico(87, 'Engomar Camisa', 'engomar', 'passar', 500, 750, 1000),
  servico(88, 'Engomar Vestido', 'engomar', 'passar', 2000, 3000, 4000),
  servico(89, 'Engomar Calça', 'engomar', 'passar', 500, 750, 1000),
  servico(90, 'Engomar Vestido Volumoso', 'engomar', 'passar', 4000, 6000, 8000),
  servico(91, 'Engomar Vestido de Noiva', 'engomar', 'passar', 15000, 22500, 30000),
  servico(92, 'Engomar T-shirt', 'engomar', 'passar', 700, 1050, 1400),
]

export const SERVICO_POR_ID: ReadonlyMap<number, Servico> = new Map(SERVICOS.map((s) => [s.id, s]))

export function precoDe(servico: Servico, prazo: PrazoId): number {
  return servico.precos[prazo]
}

export function diasDe(servico: Servico, prazo: PrazoId): number {
  return servico.dias?.[prazo] ?? prazoPorId(prazo).diasPadrao
}

export interface GrupoCategoria {
  readonly categoria: (typeof CATEGORIAS)[number]
  readonly servicos: readonly Servico[]
}

/** Agrupa serviços pela ordem das categorias (categorias sem serviços são omitidas). */
export function agruparPorCategoria(servicos: readonly Servico[]): readonly GrupoCategoria[] {
  return CATEGORIAS.map((categoria) => ({
    categoria,
    servicos: servicos.filter((s) => s.categoria === categoria.id),
  })).filter((grupo) => grupo.servicos.length > 0)
}

/** Preço mínimo e máximo de toda a tabela (para JSON-LD `priceRange`). */
export function intervaloDePrecos(): { readonly minimo: number; readonly maximo: number } {
  const todos = SERVICOS.flatMap((s) => Object.values(s.precos))
  return { minimo: Math.min(...todos), maximo: Math.max(...todos) }
}
