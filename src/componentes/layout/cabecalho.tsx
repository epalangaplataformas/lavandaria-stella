import {
  RiDownloadLine,
  RiMoonLine,
  RiShoppingBag3Line,
  RiSunLine,
  RiWhatsappFill,
} from '@remixicon/react'
import { Link, NavLink } from 'react-router'
import { useCarrinho } from '../../armazens/carrinho'
import { instalarApp, useInstalacaoDisponivel } from '../../armazens/instalacao'
import { alternarTema, useTema } from '../../armazens/tema'
import { ROTAS } from '../../configuracao/empresa'
import { cn } from '../../lib/cn'
import { montarMensagemContacto } from '../../lib/mensagens'
import { ligacaoWhatsapp } from '../../lib/whatsapp'
import { Marca } from '../marca'
import { botaoVariantes } from '../ui/botao-variantes'

const LIGACOES = [
  { para: ROTAS.inicio, rotulo: 'Catálogo', fim: true },
  { para: ROTAS.reservar, rotulo: 'Reservar', fim: false },
  { para: ROTAS.contactos, rotulo: 'Contactos', fim: false },
] as const

function totalPecas(itens: Readonly<Record<number, number>>): number {
  return Object.values(itens).reduce((soma, q) => soma + q, 0)
}

export function BotaoTema({ className }: { className?: string }) {
  const tema = useTema()
  const escuro = tema === 'escuro'
  return (
    <button
      type="button"
      onClick={alternarTema}
      aria-label={escuro ? 'Mudar para o tema claro' : 'Mudar para o tema escuro'}
      title={escuro ? 'Tema claro' : 'Tema escuro'}
      className={cn(botaoVariantes({ variante: 'fantasma', tamanho: 'icone' }), className)}
    >
      {escuro ? <RiSunLine aria-hidden="true" /> : <RiMoonLine aria-hidden="true" />}
    </button>
  )
}

export function Cabecalho() {
  const pecas = useCarrinho((e) => totalPecas(e.itens))
  const podeInstalar = useInstalacaoDisponivel()

  return (
    <header className="sticky top-0 z-40 border-b border-borda/70 bg-fundo/85 backdrop-blur-md">
      <div className="mx-auto flex h-(--altura-cabecalho) max-w-6xl items-center gap-2 px-4">
        <Link to={ROTAS.inicio} viewTransition aria-label="Lavandaria Stella — página inicial" className="min-w-0 rounded-lg">
          <Marca />
        </Link>

        <nav aria-label="Principal" className="mr-auto ml-6 hidden items-center gap-1 md:flex">
          {LIGACOES.map((l) => (
            <NavLink
              key={l.para}
              to={l.para}
              end={l.fim}
              viewTransition
              className={({ isActive }) =>
                cn(
                  'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                  isActive ? 'bg-primaria-suave text-primaria-suave-texto' : 'text-suave-texto hover:bg-suave hover:text-texto',
                )
              }
            >
              {l.rotulo}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          {podeInstalar && (
            <button
              type="button"
              onClick={() => void instalarApp()}
              className={botaoVariantes({ variante: 'secundario', tamanho: 'sm', className: 'hidden sm:inline-flex' })}
            >
              <RiDownloadLine aria-hidden="true" />
              Instalar
            </button>
          )}
          <BotaoTema />
          <Link
            to={ROTAS.pedido}
            viewTransition
            aria-label={pecas > 0 ? `O seu pedido, ${pecas} peças` : 'O seu pedido'}
            className={botaoVariantes({ variante: 'fantasma', tamanho: 'icone', className: 'relative hidden md:inline-flex' })}
          >
            <RiShoppingBag3Line aria-hidden="true" />
            {pecas > 0 && (
              <span className="absolute top-0.5 right-0.5 grid min-w-5 place-items-center rounded-full bg-primaria px-1 text-[0.6875rem] leading-5 font-bold text-primaria-texto tabular-nums">
                {pecas}
              </span>
            )}
          </Link>
          <a
            href={ligacaoWhatsapp(montarMensagemContacto())}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar connosco no WhatsApp"
            className={botaoVariantes({ variante: 'whatsapp', tamanho: 'icone', className: 'md:w-auto md:px-4' })}
          >
            <RiWhatsappFill aria-hidden="true" />
            <span className="hidden md:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </header>
  )
}
