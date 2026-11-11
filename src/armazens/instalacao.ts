import { useSyncExternalStore } from 'react'

/**
 * Captura o evento de instalação da PWA assim que o módulo é carregado
 * (o evento pode disparar antes de o React montar).
 */
let pedidoAdiado: BeforeInstallPromptEvent | null = null
const ouvintes = new Set<() => void>()
const avisar = () => ouvintes.forEach((ouvinte) => ouvinte())

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (evento) => {
    evento.preventDefault()
    pedidoAdiado = evento
    avisar()
  })
  window.addEventListener('appinstalled', () => {
    pedidoAdiado = null
    avisar()
  })
}

export function useInstalacaoDisponivel(): boolean {
  return useSyncExternalStore(
    (ouvinte) => {
      ouvintes.add(ouvinte)
      return () => ouvintes.delete(ouvinte)
    },
    () => pedidoAdiado !== null,
    () => false,
  )
}

export async function instalarApp(): Promise<void> {
  const pedido = pedidoAdiado
  if (!pedido) return
  await pedido.prompt()
  await pedido.userChoice
  pedidoAdiado = null
  avisar()
}
