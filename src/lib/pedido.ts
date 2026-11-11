import { SERVICO_POR_ID, SERVICOS, diasDe, precoDe, type PrazoId, type Servico } from '../dados/catalogo'

export const QUANTIDADE_MAXIMA = 99

export interface LinhaPedido {
  readonly servico: Servico
  readonly quantidade: number
  readonly precoUnitario: number
  readonly subtotal: number
  /** Prazo em dias para esta peça (varia em ténis, colchas, vestidos de noiva…). */
  readonly dias: number
}

export interface ResumoPedido {
  readonly linhas: readonly LinhaPedido[]
  readonly totalPecas: number
  readonly total: number
  /** Maior prazo entre as peças: é quando o pedido fica completo. */
  readonly diasMaximos: number
}

export type ItensCarrinho = Readonly<Record<number, number>>

/** Calcula linhas e totais a partir das quantidades e do prazo escolhido (ordenado pelo nº da tabela). */
export function calcularResumo(itens: ItensCarrinho, prazo: PrazoId): ResumoPedido {
  const linhas: LinhaPedido[] = []
  for (const servico of SERVICOS) {
    const quantidade = itens[servico.id] ?? 0
    if (quantidade <= 0) continue
    const precoUnitario = precoDe(servico, prazo)
    linhas.push({
      servico,
      quantidade,
      precoUnitario,
      subtotal: precoUnitario * quantidade,
      dias: diasDe(servico, prazo),
    })
  }
  return {
    linhas,
    totalPecas: linhas.reduce((soma, l) => soma + l.quantidade, 0),
    total: linhas.reduce((soma, l) => soma + l.subtotal, 0),
    diasMaximos: linhas.reduce((maior, l) => Math.max(maior, l.dias), 0),
  }
}

/** Valida e limpa quantidades vindas do armazenamento (só ids que existem, inteiros de 1 a 99). */
export function sanearItens(bruto: unknown): ItensCarrinho {
  if (typeof bruto !== 'object' || bruto === null || Array.isArray(bruto)) return {}
  const limpo: Record<number, number> = {}
  for (const [chave, valor] of Object.entries(bruto)) {
    const id = Number(chave)
    if (!SERVICO_POR_ID.has(id)) continue
    if (typeof valor !== 'number' || !Number.isInteger(valor) || valor < 1) continue
    limpo[id] = Math.min(valor, QUANTIDADE_MAXIMA)
  }
  return limpo
}
