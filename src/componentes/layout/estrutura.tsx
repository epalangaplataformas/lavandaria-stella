import { RiWifiOffLine } from '@remixicon/react'
import { useEffect } from 'react'
import { Outlet, ScrollRestoration } from 'react-router'
import { useComLigacao } from '../../armazens/ligacao'
import { Cabecalho } from './cabecalho'
import { NavegacaoInferior } from './navegacao-inferior'
import { Rodape } from './rodape'

/** Pré-carrega as outras páginas quando o navegador está livre, para a navegação ser instantânea. */
function usePreCarregamentoDeRotas() {
  useEffect(() => {
    const aquecer = () => {
      void import('../../paginas/pedido')
      void import('../../paginas/reservar')
      void import('../../paginas/contactos')
    }
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(aquecer, { timeout: 4000 })
      return () => window.cancelIdleCallback(id)
    }
    const id = globalThis.setTimeout(aquecer, 2000)
    return () => globalThis.clearTimeout(id)
  }, [])
}

export function Estrutura() {
  usePreCarregamentoDeRotas()
  const comLigacao = useComLigacao()

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only z-50 rounded-full bg-primaria px-4 py-2 text-sm font-semibold text-primaria-texto focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Saltar para o conteúdo
      </a>

      <Cabecalho />

      {!comLigacao && (
        <div
          role="status"
          className="flex items-center justify-center gap-2 bg-suave px-4 py-2 text-center text-sm text-suave-texto"
        >
          <RiWifiOffLine aria-hidden="true" className="size-4 shrink-0" />
          <span>Sem ligação à internet. Pode consultar os preços; para enviar pedidos precisa de ligação.</span>
        </div>
      )}

      <main id="conteudo" tabIndex={-1} className="min-h-[70dvh] focus:outline-none">
        <Outlet />
      </main>

      <Rodape />
      <NavegacaoInferior />
      <ScrollRestoration />
    </>
  )
}
