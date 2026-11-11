import { RiArrowRightLine, RiShoppingBag3Line } from '@remixicon/react'
import { Link } from 'react-router'
import { acoesCarrinho, useResumoPedido } from '../armazens/carrinho'
import { ROTAS } from '../configuracao/empresa'
import { prazoPorId, rotuloDias } from '../dados/catalogo'
import { formatarKz } from '../lib/formatar'
import type { ResumoPedido } from '../lib/pedido'
import { PassoQuantidade } from './passo-quantidade'
import { botaoVariantes } from './ui/botao-variantes'

/** Linhas do pedido com controlo de quantidade. Usada no painel lateral e na página do pedido. */
export function ListaPedido({ resumo }: { resumo: ResumoPedido }) {
  return (
    <ul className="divide-y divide-borda">
      {resumo.linhas.map(({ servico, quantidade, precoUnitario, subtotal, dias }) => (
        <li key={servico.id} className="flex flex-col gap-2 py-3 first:pt-0">
          <div className="flex items-start justify-between gap-3">
            <p className="min-w-0 text-sm leading-snug font-semibold break-words">{servico.nome}</p>
            <p className="shrink-0 text-sm font-bold tabular-nums">{formatarKz(subtotal)}</p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="min-w-0 text-xs leading-snug text-suave-texto">
              {formatarKz(precoUnitario)} cada · {rotuloDias(dias).toLowerCase()}
            </p>
            <PassoQuantidade
              quantidade={quantidade}
              nome={servico.nome}
              aoDiminuir={() => acoesCarrinho.remover(servico.id)}
              aoAumentar={() => acoesCarrinho.adicionar(servico.id)}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function TotalPedido({ resumo }: { resumo: ResumoPedido }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-t border-borda pt-3">
      <span className="text-sm font-semibold">
        Total estimado
        <span className="ml-1.5 text-xs font-normal text-suave-texto">
          ({resumo.totalPecas} {resumo.totalPecas === 1 ? 'peça' : 'peças'})
        </span>
      </span>
      <strong className="text-xl font-extrabold text-primaria tabular-nums">{formatarKz(resumo.total)}</strong>
    </div>
  )
}

/** Cartão fixo do pedido, visível em ecrãs largos ao lado do catálogo. */
export function PainelPedido() {
  const resumo = useResumoPedido()
  const vazio = resumo.totalPecas === 0

  return (
    <section
      aria-labelledby="titulo-painel-pedido"
      className="sticky top-[calc(var(--altura-cabecalho)+1rem)] max-h-[calc(100dvh-var(--altura-cabecalho)-2rem)] overflow-y-auto rounded-2xl border border-borda bg-cartao p-4 shadow-cartao"
    >
      <div className="mb-3 flex items-center gap-2">
        <RiShoppingBag3Line aria-hidden="true" className="size-5 text-primaria" />
        <h2 id="titulo-painel-pedido" className="text-lg font-bold">
          O seu pedido
        </h2>
        {!vazio && (
          <button
            type="button"
            onClick={acoesCarrinho.limpar}
            className="ml-auto rounded-md px-1 text-xs font-medium text-suave-texto underline-offset-2 hover:underline"
          >
            Limpar
          </button>
        )}
      </div>

      {vazio ? (
        <p className="rounded-xl bg-suave p-4 text-sm text-suave-texto">
          Ainda não escolheu nenhuma peça. Toque em <strong className="text-texto">+</strong> nos
          serviços para começar.
        </p>
      ) : (
        <>
          <p className="mb-3 text-xs text-suave-texto">
            Prazo: <strong className="text-texto">{prazoPorId(resumo.prazo).nome}</strong>
          </p>
          <ListaPedido resumo={resumo} />
          <TotalPedido resumo={resumo} />
          <Link
            to={ROTAS.pedido}
            viewTransition
            className={botaoVariantes({ variante: 'primario', tamanho: 'lg', larguraTotal: true, className: 'mt-4' })}
          >
            Continuar
            <RiArrowRightLine aria-hidden="true" />
          </Link>
        </>
      )}
    </section>
  )
}
