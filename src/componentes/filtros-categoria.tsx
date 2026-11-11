import { useEffect, useRef } from 'react'
import { CATEGORIAS, type CategoriaId } from '../dados/catalogo'
import { cn } from '../lib/cn'
import { IconeServico } from './icones-servico'

export type FiltroCategoria = CategoriaId | 'todas'

interface PropsFiltros {
  valor: FiltroCategoria
  aoMudar: (valor: FiltroCategoria) => void
  contagens: Readonly<Record<FiltroCategoria, number>>
}

/** Chips de categoria com deslocamento horizontal e centragem automática do chip activo. */
export function FiltrosCategoria({ valor, aoMudar, contagens }: PropsFiltros) {
  const faixa = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Desloca apenas a faixa na horizontal; `scrollIntoView` arrastaria a página inteira na vertical.
    const faixaAtual = faixa.current
    const chip = faixaAtual?.querySelector<HTMLElement>('[aria-pressed="true"]')
    if (!faixaAtual || !chip) return
    const esquerda = chip.offsetLeft - (faixaAtual.clientWidth - chip.offsetWidth) / 2
    faixaAtual.scrollTo({ left: Math.max(0, esquerda), behavior: 'smooth' })
  }, [valor])

  const itens: ReadonlyArray<{ id: FiltroCategoria; nome: string; icone: 'todas' | (typeof CATEGORIAS)[number]['icone'] }> = [
    { id: 'todas', nome: 'Todos', icone: 'todas' },
    ...CATEGORIAS.map((c) => ({ id: c.id, nome: c.nome, icone: c.icone })),
  ]

  return (
    <div
      ref={faixa}
      role="toolbar"
      aria-label="Filtrar por categoria"
      className="sem-barra relative -mx-4 flex snap-x gap-2 overflow-x-auto px-4 py-1 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0"
    >
      {itens.map((item) => {
        const activo = item.id === valor
        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={activo}
            onClick={() => aoMudar(item.id)}
            className={cn(
              'inline-flex min-h-10 shrink-0 snap-center items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold whitespace-nowrap transition-colors [&_svg]:size-4',
              activo
                ? 'border-primaria bg-primaria text-primaria-texto shadow-cartao'
                : 'border-borda bg-cartao text-cartao-texto hover:bg-suave',
            )}
          >
            <IconeServico icone={item.icone} />
            {item.nome}
            <span className={cn('text-xs font-medium tabular-nums', activo ? 'opacity-80' : 'text-suave-texto')}>
              {contagens[item.id]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
