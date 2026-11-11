import '@fontsource-variable/inter/wght.css'
import './estilos/global.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import { registerSW } from 'virtual:pwa-register'
import { roteador } from './rotas'

const raiz = document.getElementById('root')
if (!raiz) throw new Error('Elemento #root não encontrado.')

createRoot(raiz).render(
  <StrictMode>
    <RouterProvider router={roteador} />
  </StrictMode>,
)

// Regista o service worker (modo offline) e actualiza sozinho quando há nova versão.
registerSW({ immediate: true })
