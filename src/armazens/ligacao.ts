import { useSyncExternalStore } from 'react'

function subscrever(ouvinte: () => void): () => void {
  window.addEventListener('online', ouvinte)
  window.addEventListener('offline', ouvinte)
  return () => {
    window.removeEventListener('online', ouvinte)
    window.removeEventListener('offline', ouvinte)
  }
}

/** `true` quando o dispositivo tem ligação à internet. */
export function useComLigacao(): boolean {
  return useSyncExternalStore(
    subscrever,
    () => navigator.onLine,
    () => true,
  )
}
