import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { seoEstatico } from './plugins/seo-estatico.ts'
import { COR_FUNDO_CLARO, COR_MARCA } from './src/configuracao/cores.ts'
import { EMPRESA, ROTAS } from './src/configuracao/empresa.ts'

/**
 * Endereço público do site (usado em canonical, Open Graph, sitemap e JSON-LD).
 * Defina `SITE_URL` no build, ex.: SITE_URL=https://lavandariastella.ao npm run build
 * No Cloudflare Pages (com Git) usa automaticamente CF_PAGES_URL.
 */
const URL_DO_SITE = (
  process.env.SITE_URL ??
  process.env.CF_PAGES_URL ??
  'https://lavandariastella.pages.dev'
).replace(/\/+$/, '')

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    seoEstatico({ urlDoSite: URL_DO_SITE }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false, // o registo é feito em src/main.tsx
      manifest: {
        id: '/',
        name: EMPRESA.nome,
        short_name: EMPRESA.nomeCurto,
        description: EMPRESA.descricao,
        lang: 'pt-AO',
        dir: 'ltr',
        start_url: '/?origem=pwa',
        scope: '/',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        background_color: COR_FUNDO_CLARO,
        theme_color: COR_MARCA,
        categories: ['business', 'lifestyle', 'shopping'],
        icons: [
          { src: '/icones/icone-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icones/icone-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: '/icones/icone-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Fazer pedido',
            short_name: 'Pedido',
            url: ROTAS.pedido,
            icons: [{ src: '/icones/icone-192.png', sizes: '192x192', type: 'image/png' }],
          },
          {
            name: 'Reservar recolha',
            short_name: 'Reservar',
            url: ROTAS.reservar,
            icons: [{ src: '/icones/icone-192.png', sizes: '192x192', type: 'image/png' }],
          },
          {
            name: 'Contactos',
            short_name: 'Contactos',
            url: ROTAS.contactos,
            icons: [{ src: '/icones/icone-192.png', sizes: '192x192', type: 'image/png' }],
          },
        ],
      },
      workbox: {
        // Só o essencial entra em cache: JS, CSS, HTML, SVG e as fontes latinas da Inter.
        globPatterns: [
          '**/*.{js,css,html,svg,webp,ico}',
          'icones/favicon-*.png',
          'icones/icone-192.png',
          '**/inter-latin-wght-normal-*.woff2',
          '**/inter-latin-ext-wght-normal-*.woff2',
        ],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  define: {
    __URL_DO_SITE__: JSON.stringify(URL_DO_SITE),
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 250,
  },
})
