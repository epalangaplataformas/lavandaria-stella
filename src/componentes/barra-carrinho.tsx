import { RiArrowRightLine, RiShoppingBag3Line } from '@remixicon/react'
import { Link } from 'react-router'
import { useResumoPedido } from '../armazens/carrinho'
import { ROTAS } from '../configuracao/empresa'
import { prazoPorId } from '../dados/catalogo'
import { formatarKz } from '../lib/formatar'

/** Barra flutuante "Ver pedido" (telemóveis e tablets). Em ecrãs largos o painel lateral toma o seu lugar. */
export function BarraCarrinho() {
  const { totalPecas, total, prazo } = useResumoPedido()
  if (totalPecas === 0) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--altura-navegacao)+env(safe-area-inset-bottom)+0.75rem)] z-30 animate-entrar px-3 md:bottom-[calc(env(safe-area-inset-bottom)+1rem)] lg:hidden">
      <Link
        to={ROTAS.pedido}
        viewTransition
        className="pointer-events-auto mx-auto flex max-w-xl items-center gap-3 rounded-full bg-primaria py-2.5 pr-4 pl-3 text-primaria-texto shadow-flutuante transition-transform active:scale-[0.98]"
      >
        <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-white/15">
          <RiShoppingBag3Line aria-hidden="true" className="size-5" />
          <span className="absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full bg-destaque px-1 text-[0.6875rem] leading-5 font-extrabold text-destaque-texto tabular-nums">
            {totalPecas}
          </span>
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-xs opacity-85">
            {totalPecas} {totalPecas === 1 ? 'peça' : 'peças'} · {prazoPorId(prazo).nome}
          </span>
          <span className="block text-base font-extrabold tabular-nums">{formatarKz(total)}</span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold">
          Ver pedido
          <RiArrowRightLine aria-hidden="true" className="size-5" />
        </span>
      </Link>
    </div>
  )
}
