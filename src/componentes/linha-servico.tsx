import { RiAddLine, RiTimerLine } from '@remixicon/react'
import { memo } from 'react'
import { acoesCarrinho, useCarrinho, useQuantidade } from '../armazens/carrinho'
import { diasDe, precoDe, rotuloDias, type Servico } from '../dados/catalogo'
import { cn } from '../lib/cn'
import { formatarKz } from '../lib/formatar'
import { IconeServico } from './icones-servico'
import { PassoQuantidade } from './passo-quantidade'

/**
 * Uma linha do catálogo. Layout em grelha à prova de nomes longos: o nome ocupa toda a largura
 * (junto ao ícone) e quebra em várias linhas; preço e acção ficam sempre na linha de baixo.
 */
export const LinhaServico = memo(function LinhaServico({ servico }: { servico: Servico }) {
  const quantidade = useQuantidade(servico.id)
  const prazo = useCarrinho((e) => e.prazo)
  const preco = precoDe(servico, prazo)
  const dias = diasDe(servico, prazo)

  return (
    <li
      className={cn(
        'grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-3 gap-y-2 px-4 py-3.5 transition-colors',
        quantidade > 0 && 'bg-primaria-suave/50',
      )}
    >
      <span
        aria-hidden="true"
        className="row-span-2 grid size-11 place-items-center rounded-xl bg-primaria-suave text-primaria-suave-texto [&_svg]:size-6"
      >
        <IconeServico icone={servico.icone} />
      </span>

      <p className="col-span-2 min-w-0 text-[0.95rem] leading-snug font-semibold break-words">
        {servico.nome}
      </p>

      <div className="min-w-0 self-center">
        <p className="text-lg leading-none font-extrabold text-primaria tabular-nums">
          <data value={preco}>{formatarKz(preco)}</data>
        </p>
        <p className="mt-1 flex items-center gap-1 text-xs text-suave-texto">
          <RiTimerLine aria-hidden="true" className="size-3.5 shrink-0" />
          <span>{rotuloDias(dias)}</span>
        </p>
      </div>

      <div className="self-center">
        {quantidade > 0 ? (
          <PassoQuantidade
            quantidade={quantidade}
            nome={servico.nome}
            aoDiminuir={() => acoesCarrinho.remover(servico.id)}
            aoAumentar={() => acoesCarrinho.adicionar(servico.id)}
          />
        ) : (
          <button
            type="button"
            onClick={() => acoesCarrinho.adicionar(servico.id)}
            aria-label={`Adicionar ${servico.nome} ao pedido`}
            className="grid size-11 place-items-center rounded-full bg-primaria text-primaria-texto shadow-cartao transition-[transform,filter] hover:brightness-110 active:scale-90"
          >
            <RiAddLine aria-hidden="true" className="size-6" />
          </button>
        )}
      </div>
    </li>
  )
})
