import { useEffect } from 'react'
import { EMPRESA } from '../configuracao/empresa'

interface OpcoesDocumento {
  /** Título curto da página; o nome da marca é acrescentado automaticamente. */
  titulo: string
  descricao: string
  /** Páginas privadas (ex.: pedido) não devem aparecer nos motores de busca. */
  noindex?: boolean
}

function definirMeta(seletor: string, atributo: 'content' | 'href', valor: string): void {
  document.querySelector(seletor)?.setAttribute(atributo, valor)
}

/** SEO por rota numa SPA: título, descrição, canonical e Open Graph. */
export function useDocumento({ titulo, descricao, noindex = false }: OpcoesDocumento): void {
  useEffect(() => {
    const tituloCompleto = titulo.includes(EMPRESA.nome) ? titulo : `${titulo} · ${EMPRESA.nome}`
    const caminho = window.location.pathname === '/' ? '/' : window.location.pathname.replace(/\/+$/, '')
    const url = `${__URL_DO_SITE__}${caminho}`

    document.title = tituloCompleto
    definirMeta('meta[name="description"]', 'content', descricao)
    definirMeta('link[rel="canonical"]', 'href', url)
    definirMeta('meta[property="og:title"]', 'content', tituloCompleto)
    definirMeta('meta[property="og:description"]', 'content', descricao)
    definirMeta('meta[property="og:url"]', 'content', url)
    definirMeta('meta[name="twitter:title"]', 'content', tituloCompleto)
    definirMeta('meta[name="twitter:description"]', 'content', descricao)
    definirMeta(
      'meta[name="robots"]',
      'content',
      noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1',
    )
  }, [titulo, descricao, noindex])
}
