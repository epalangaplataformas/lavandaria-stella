import { RiCloseLine, RiSearchLine, RiWhatsappFill } from '@remixicon/react'
import { useDeferredValue, useId, useMemo, useState } from 'react'
import {
  CATEGORIAS,
  SERVICOS,
  agruparPorCategoria,
  type CategoriaId,
} from '../dados/catalogo'
import { montarMensagemContacto } from '../lib/mensagens'
import { normalizarTexto } from '../lib/formatar'
import { ligacaoWhatsapp } from '../lib/whatsapp'
import { Botao } from './ui/botao'
import { botaoVariantes } from './ui/botao-variantes'
import { FiltrosCategoria, type FiltroCategoria } from './filtros-categoria'
import { IconeServico } from './icones-servico'
import { LinhaServico } from './linha-servico'
import { SeletorPrazo } from './seletor-prazo'

/** Texto pesquisável pré-calculado uma única vez (sem acentos e em minúsculas). */
const INDICE_BUSCA: ReadonlyMap<number, string> = new Map(
  SERVICOS.map((s) => {
    const categoria = CATEGORIAS.find((c) => c.id === s.categoria)?.nome ?? ''
    return [s.id, normalizarTexto(`${s.nome} ${categoria}`)]
  }),
)

const CONTAGENS: Readonly<Record<FiltroCategoria, number>> = {
  todas: SERVICOS.length,
  ...(Object.fromEntries(
    CATEGORIAS.map((c) => [c.id, SERVICOS.filter((s) => s.categoria === c.id).length]),
  ) as Record<CategoriaId, number>),
}

function plural(n: number, singular: string, pluralTexto: string): string {
  return n === 1 ? singular : pluralTexto
}

export function Catalogo() {
  const idBusca = useId()
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState<FiltroCategoria>('todas')
  const buscaAdiada = useDeferredValue(busca)

  const filtrados = useMemo(() => {
    const palavras = normalizarTexto(buscaAdiada).split(/\s+/).filter(Boolean)
    return SERVICOS.filter((s) => {
      if (categoria !== 'todas' && s.categoria !== categoria) return false
      const alvo = INDICE_BUSCA.get(s.id) ?? ''
      return palavras.every((palavra) => alvo.includes(palavra))
    })
  }, [categoria, buscaAdiada])

  const grupos = useMemo(() => agruparPorCategoria(filtrados), [filtrados])
  const aPesquisar = buscaAdiada.trim().length > 0

  function mudarCategoria(valor: FiltroCategoria) {
    setCategoria(valor)
    // Leva o início da lista para debaixo da barra fixa para o cliente ver logo os resultados.
    requestAnimationFrame(() =>
      document.getElementById('servicos')?.scrollIntoView({ block: 'start', behavior: 'smooth' }),
    )
  }

  return (
    <section aria-labelledby="titulo-catalogo" className="min-w-0">
      <div className="mb-4 flex flex-col gap-1">
        <h2 id="titulo-catalogo" className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Catálogo e preços
        </h2>
        <p className="text-sm text-suave-texto">
          Escolha o prazo, toque em <strong className="font-semibold text-texto">+</strong> nas peças
          que quer tratar e envie o pedido por WhatsApp.
        </p>
      </div>

      <SeletorPrazo className="mb-4" />

      <div className="relative mb-3">
        <label htmlFor={idBusca} className="sr-only">
          Pesquisar serviços
        </label>
        <RiSearchLine
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-suave-texto"
        />
        <input
          id={idBusca}
          type="search"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          spellCheck={false}
          maxLength={60}
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Pesquisar: camisa, vestido de noiva, ténis…"
          className="block min-h-12 w-full min-w-0 rounded-full border border-borda bg-cartao py-3 pr-12 pl-11 text-base shadow-cartao placeholder:text-suave-texto/70 [&::-webkit-search-cancel-button]:hidden"
        />
        {busca && (
          <button
            type="button"
            onClick={() => setBusca('')}
            aria-label="Limpar pesquisa"
            className="absolute top-1/2 right-1.5 grid size-9 -translate-y-1/2 place-items-center rounded-full text-suave-texto hover:bg-suave"
          >
            <RiCloseLine aria-hidden="true" className="size-5" />
          </button>
        )}
      </div>

      {/* Barra de categorias fixa por baixo do cabeçalho */}
      <div className="sticky top-(--altura-cabecalho) z-20 -mx-4 mb-4 border-b border-borda/70 bg-fundo/90 px-4 py-2 backdrop-blur-md lg:mx-0 lg:px-0">
        <FiltrosCategoria valor={categoria} aoMudar={mudarCategoria} contagens={CONTAGENS} />
      </div>

      <div id="servicos" className="scroll-mt-32" />
      <p role="status" aria-live="polite" className="mb-3 text-sm text-suave-texto">
        {filtrados.length} {plural(filtrados.length, 'serviço', 'serviços')}
        {aPesquisar && ' encontrados'}
      </p>

      {grupos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-borda bg-cartao p-6 text-center">
          <p className="mx-auto max-w-prose text-base font-semibold break-words">
            Não encontrámos “{buscaAdiada.trim().slice(0, 40)}”.
          </p>
          <p className="mt-1 text-sm text-suave-texto">
            Tente outra palavra ou pergunte-nos directamente: tratamos de muito mais do que está na lista.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Botao variante="contorno" onClick={() => { setBusca(''); setCategoria('todas') }}>
              Limpar filtros
            </Botao>
            <a
              href={ligacaoWhatsapp(montarMensagemContacto(`Gostaria de saber se tratam de: ${buscaAdiada.trim().slice(0, 60)}`))}
              target="_blank"
              rel="noopener noreferrer"
              className={botaoVariantes({ variante: 'whatsapp' })}
            >
              <RiWhatsappFill aria-hidden="true" />
              Perguntar no WhatsApp
            </a>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {grupos.map(({ categoria: cat, servicos }) => (
            <section
              key={cat.id}
              aria-labelledby={`cat-${cat.id}`}
              className="secao-diferida"
            >
              <div className="mb-2 flex items-center gap-2 px-1">
                <span className="grid size-8 place-items-center rounded-lg bg-primaria text-primaria-texto [&_svg]:size-4.5">
                  <IconeServico icone={cat.icone} />
                </span>
                <h3 id={`cat-${cat.id}`} className="min-w-0 text-lg font-bold break-words">
                  {cat.nome}
                </h3>
                <span className="ml-auto text-xs text-suave-texto tabular-nums">{servicos.length}</span>
              </div>
              <ul className="divide-y divide-borda overflow-hidden rounded-2xl border border-borda bg-cartao shadow-cartao">
                {servicos.map((s) => (
                  <LinhaServico key={s.id} servico={s} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <p className="mt-6 rounded-xl bg-suave p-4 text-xs leading-relaxed text-suave-texto">
        Preços em Kwanzas (Kz) — tabela 2026. O valor final é confirmado após a verificação das peças.
        Ténis, cobertores, colchas, bonecas e vestidos de gala volumosos e de noiva têm prazos
        próprios, indicados em cada linha.
      </p>
    </section>
  )
}
