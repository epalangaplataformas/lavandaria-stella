import { RiCalendarCheckLine, RiFlashlightLine, RiShieldCheckLine, RiTruckLine, RiWhatsappFill } from '@remixicon/react'
import { Link } from 'react-router'
import { BarraCarrinho } from '../componentes/barra-carrinho'
import { Catalogo } from '../componentes/catalogo'
import { Emblema } from '../componentes/marca'
import { PainelPedido } from '../componentes/painel-pedido'
import { botaoVariantes } from '../componentes/ui/botao-variantes'
import { EMPRESA, ROTAS } from '../configuracao/empresa'
import { useDocumento } from '../hooks/usar-documento'
import { montarMensagemContacto } from '../lib/mensagens'
import { ligacaoWhatsapp } from '../lib/whatsapp'

const VANTAGENS = [
  { Icone: RiShieldCheckLine, titulo: 'Qualidade garantida', texto: 'Tratamento cuidado de cada peça.' },
  { Icone: RiTruckLine, titulo: 'Entrega pontual', texto: 'Cumprimos o prazo que escolher.' },
  { Icone: RiFlashlightLine, titulo: 'Urgência no mesmo dia', texto: 'Para quando precisa já.' },
] as const

export default function Inicio() {
  useDocumento({
    titulo: 'Lavandaria Stella — Catálogo, preços e pedidos por WhatsApp em Viana, Luanda',
    descricao:
      'Veja a tabela de preços da Lavandaria Stella (Viana, Luanda) e faça o seu pedido ou reserva de recolha pelo WhatsApp. Lavagem, passagem, secagem e tratamento de roupas com entrega pontual.',
  })

  return (
    <>
      <section aria-labelledby="titulo-principal" className="fundo-marca relative overflow-hidden text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -top-10 -right-10 size-56 rounded-full bg-white/10" />
        <div aria-hidden="true" className="pointer-events-none absolute right-24 bottom-6 size-16 rounded-full bg-white/10" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-24 -left-6 size-24 rounded-full bg-white/5" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-6 px-4 py-8 sm:py-12 lg:grid-cols-[1.3fr_1fr] lg:py-16">
          <div className="min-w-0">
            <p className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
              <span className="size-2 shrink-0 rounded-full bg-[oklch(0.85_0.2_150)]" aria-hidden="true" />
              <span className="truncate">Vila de Viana · Luanda</span>
            </p>
            <h1 id="titulo-principal" className="text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Roupa limpa,
              <br />
              <span className="text-[oklch(0.86_0.09_225)]">sem complicações.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/85 sm:text-lg">{EMPRESA.descricao}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#catalogo" className={botaoVariantes({ variante: 'claro', tamanho: 'lg' })}>
                Ver preços
              </a>
              <Link to={ROTAS.reservar} viewTransition className={botaoVariantes({ variante: 'translucido', tamanho: 'lg' })}>
                <RiCalendarCheckLine aria-hidden="true" />
                Reservar recolha
              </Link>
              <a
                href={ligacaoWhatsapp(montarMensagemContacto())}
                target="_blank"
                rel="noopener noreferrer"
                className={botaoVariantes({ variante: 'whatsapp', tamanho: 'lg', className: 'sm:hidden' })}
              >
                <RiWhatsappFill aria-hidden="true" />
                WhatsApp
              </a>
            </div>
          </div>

          <div aria-hidden="true" className="hidden justify-self-center lg:block">
            <Emblema className="size-56 text-white drop-shadow-2xl" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <ul className="-mt-5 grid gap-2 sm:grid-cols-3">
          {VANTAGENS.map(({ Icone, titulo, texto }) => (
            <li key={titulo} className="flex min-w-0 items-center gap-3 rounded-2xl border border-borda bg-cartao p-3.5 shadow-cartao">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primaria-suave text-primaria-suave-texto">
                <Icone aria-hidden="true" className="size-5" />
              </span>
              <span className="min-w-0 leading-snug">
                <strong className="block text-sm break-words">{titulo}</strong>
                <span className="block text-xs text-suave-texto">{texto}</span>
              </span>
            </li>
          ))}
        </ul>

        <div id="catalogo" className="grid scroll-mt-20 gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:py-10">
          <Catalogo />
          <div className="hidden lg:block">
            <PainelPedido />
          </div>
        </div>
      </div>

      <BarraCarrinho />
    </>
  )
}
