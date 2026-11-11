import { useSyncExternalStore } from 'react'
import { CHAVE_TEMA, COR_FUNDO_CLARO, COR_FUNDO_ESCURO } from '../configuracao/cores'
import { guardarTexto, lerTexto } from '../lib/armazenamento'

export type Tema = 'claro' | 'escuro'

/** O tema inicial já foi aplicado pelo script inline do index.html; aqui apenas o lemos. */
function lerTemaAplicado(): Tema {
  return document.documentElement.classList.contains('dark') ? 'escuro' : 'claro'
}

let tema: Tema = lerTemaAplicado()
const ouvintes = new Set<() => void>()

function aplicar(proximo: Tema): void {
  const raiz = document.documentElement
  raiz.classList.toggle('dark', proximo === 'escuro')
  raiz.style.colorScheme = proximo === 'escuro' ? 'dark' : 'light'
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', proximo === 'escuro' ? COR_FUNDO_ESCURO : COR_FUNDO_CLARO)
  tema = proximo
  ouvintes.forEach((ouvinte) => ouvinte())
}

// Enquanto o utilizador não escolher manualmente, acompanha o tema do sistema.
if (typeof window !== 'undefined') {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (evento) => {
      if (lerTexto(CHAVE_TEMA) === null) aplicar(evento.matches ? 'escuro' : 'claro')
    })
}

export function alternarTema(): void {
  const proximo: Tema = tema === 'escuro' ? 'claro' : 'escuro'
  guardarTexto(CHAVE_TEMA, proximo)
  aplicar(proximo)
}

export function useTema(): Tema {
  return useSyncExternalStore(
    (ouvinte) => {
      ouvintes.add(ouvinte)
      return () => ouvintes.delete(ouvinte)
    },
    () => tema,
    () => 'claro',
  )
}
