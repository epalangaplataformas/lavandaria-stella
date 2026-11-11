import { RiAddLine, RiDeleteBinLine, RiSubtractLine } from '@remixicon/react'
import { cn } from '../lib/cn'
import { QUANTIDADE_MAXIMA } from '../lib/pedido'

interface PropsPasso {
  quantidade: number
  /** Nome do serviço, usado nas etiquetas de acessibilidade. */
  nome: string
  aoDiminuir: () => void
  aoAumentar: () => void
  className?: string
}

const BOTAO =
  'grid size-10 place-items-center rounded-full text-primaria-suave-texto transition-[background-color,transform] active:scale-90 hover:bg-primaria/15 disabled:opacity-40 [&_svg]:size-5'

/** Controlo − 2 + (alvos de toque de 40 px). Com 1 unidade, o "−" passa a ser o caixote do lixo. */
export function PassoQuantidade({ quantidade, nome, aoDiminuir, aoAumentar, className }: PropsPasso) {
  return (
    <div
      role="group"
      aria-label={`Quantidade de ${nome}`}
      className={cn('inline-flex items-center rounded-full bg-primaria-suave p-0.5', className)}
    >
      <button
        type="button"
        className={BOTAO}
        onClick={aoDiminuir}
        aria-label={quantidade === 1 ? `Remover ${nome} do pedido` : `Diminuir quantidade de ${nome}`}
      >
        {quantidade === 1 ? <RiDeleteBinLine /> : <RiSubtractLine />}
      </button>
      <output
        aria-live="polite"
        className="min-w-8 text-center text-base font-bold text-primaria-suave-texto tabular-nums"
      >
        {quantidade}
      </output>
      <button
        type="button"
        className={BOTAO}
        onClick={aoAumentar}
        disabled={quantidade >= QUANTIDADE_MAXIMA}
        aria-label={`Aumentar quantidade de ${nome}`}
      >
        <RiAddLine />
      </button>
    </div>
  )
}
