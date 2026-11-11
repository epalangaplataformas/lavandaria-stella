/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

/** Endereço público do site, injectado em build pelo `vite.config.ts` (SITE_URL). */
declare const __URL_DO_SITE__: string

/** Evento (ainda não padronizado) usado para instalar a PWA. */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: readonly string[]
  prompt(): Promise<void>
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

interface WindowEventMap {
  beforeinstallprompt: BeforeInstallPromptEvent
}
