import {
  RiCalendarCheckLine,
  RiMapPinLine,
  RiShoppingBag3Line,
  RiStore2Line,
} from '@remixicon/react'
import { NavLink } from 'react-router'
import { useCarrinho } from '../../armazens/carrinho'
import { ROTAS } from '../../configuracao/empresa'
import { cn } from '../../lib/cn'

/** Barra de navegação inferior (só em telemóveis): fácil de alcançar com o polegar. */
export function NavegacaoInferior() {
  const pecas = useCarrinho((e) => Object.values(e.itens).reduce((soma, q) => soma + q, 0))

  const itens = [
    { para: ROTAS.inicio, rotulo: 'Catálogo', Icone: RiStore2Line, fim: true },
    { para: ROTAS.reservar, rotulo: 'Reservar', Icone: RiCalendarCheckLine, fim: false },
    { para: ROTAS.pedido, rotulo: 'Pedido', Icone: RiShoppingBag3Line, fim: false },
    { para: ROTAS.contactos, rotulo: 'Contactos', Icone: RiMapPinLine, fim: false },
  ] as const

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-borda bg-cartao/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto grid h-(--altura-navegacao) max-w-xl grid-cols-4">
        {itens.map(({ para, rotulo, Icone, fim }) => (
          <li key={para} className="min-w-0">
            <NavLink
              to={para}
              end={fim}
              viewTransition
              className={({ isActive }) =>
                cn(
                  'relative flex h-full flex-col items-center justify-center gap-0.5 text-[0.6875rem] font-semibold transition-colors',
                  isActive ? 'text-primaria' : 'text-suave-texto',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'relative grid h-8 w-14 place-items-center rounded-full transition-colors [&_svg]:size-6',
                      isActive && 'bg-primaria-suave',
                    )}
                  >
                    <Icone />
                    {para === ROTAS.pedido && pecas > 0 && (
                      <span className="absolute top-0 right-1.5 grid min-w-4.5 place-items-center rounded-full bg-primaria px-1 text-[0.625rem] leading-4.5 font-bold text-primaria-texto tabular-nums">
                        {pecas}
                      </span>
                    )}
                  </span>
                  <span className="max-w-full truncate px-1">{rotulo}</span>
                  {para === ROTAS.pedido && pecas > 0 && <span className="sr-only">, {pecas} peças</span>}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
