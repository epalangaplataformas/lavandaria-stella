/**
 * Armazém do pedido (carrinho): minúsculo, sem dependências, persistido no dispositivo.
 * Usa `useSyncExternalStore`, por isso cada componente só volta a renderizar quando o
 * valor que selecionou muda.
 */
import { useMemo, useSyncExternalStore } from 'react'
import { ehPrazoId, PRAZO_INICIAL, type PrazoId } from '../dados/catalogo'
import { ehObjecto, guardarJson, lerJson } from '../lib/armazenamento'
import {
  QUANTIDADE_MAXIMA,
  calcularResumo,
  sanearItens,
  type ItensCarrinho,
  type ResumoPedido,
} from '../lib/pedido'

export interface EstadoCarrinho {
  readonly itens: ItensCarrinho
  readonly prazo: PrazoId
}

const CHAVE = 'stella:pedido:v1'

function lerGuardado(): EstadoCarrinho {
  const bruto = lerJson(CHAVE)
  if (!ehObjecto(bruto)) return { itens: {}, prazo: PRAZO_INICIAL }
  return {
    itens: sanearItens(bruto.itens),
    prazo: ehPrazoId(bruto.prazo) ? bruto.prazo : PRAZO_INICIAL,
  }
}

let estado: EstadoCarrinho = lerGuardado()
const ouvintes = new Set<() => void>()

function definir(proximo: EstadoCarrinho): void {
  estado = proximo
  guardarJson(CHAVE, proximo)
  ouvintes.forEach((ouvinte) => ouvinte())
}

function subscrever(ouvinte: () => void): () => void {
  ouvintes.add(ouvinte)
  return () => ouvintes.delete(ouvinte)
}

// Mantém vários separadores abertos sincronizados.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (evento) => {
    if (evento.key !== CHAVE) return
    estado = lerGuardado()
    ouvintes.forEach((ouvinte) => ouvinte())
  })
}

/** Selecciona uma parte do estado. O seletor deve devolver valores estáveis (primitivos ou partes do estado). */
export function useCarrinho<T>(seletor: (estado: EstadoCarrinho) => T): T {
  return useSyncExternalStore(
    subscrever,
    () => seletor(estado),
    () => seletor(estado),
  )
}

/** Quantidade de um serviço — só re-renderiza quando ESSE serviço muda. */
export function useQuantidade(id: number): number {
  return useCarrinho((e) => e.itens[id] ?? 0)
}

/** Linhas, total e prazos calculados (memoizados). */
export function useResumoPedido(): ResumoPedido & { readonly prazo: PrazoId } {
  const itens = useCarrinho((e) => e.itens)
  const prazo = useCarrinho((e) => e.prazo)
  return useMemo(() => ({ ...calcularResumo(itens, prazo), prazo }), [itens, prazo])
}

export const acoesCarrinho = {
  definirQuantidade(id: number, quantidade: number): void {
    const q = Math.max(0, Math.min(QUANTIDADE_MAXIMA, Math.floor(quantidade)))
    const { [id]: _antiga, ...resto } = estado.itens
    definir({ ...estado, itens: q > 0 ? { ...resto, [id]: q } : resto })
  },
  adicionar(id: number): void {
    acoesCarrinho.definirQuantidade(id, (estado.itens[id] ?? 0) + 1)
  },
  remover(id: number): void {
    acoesCarrinho.definirQuantidade(id, (estado.itens[id] ?? 0) - 1)
  },
  eliminar(id: number): void {
    acoesCarrinho.definirQuantidade(id, 0)
  },
  definirPrazo(prazo: PrazoId): void {
    if (prazo !== estado.prazo) definir({ ...estado, prazo })
  },
  limpar(): void {
    definir({ ...estado, itens: {} })
  },
}
