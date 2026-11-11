# Lavandaria Stella — Catálogo digital (PWA)

Catálogo e menu virtual com pedidos e reservas por WhatsApp. React 19 + Vite 8 + Tailwind 4 + TypeScript.

## Desenvolvimento
```bash
npm install
npm run dev
```

## Produção (Cloudflare Pages)
- Comando de build: `npm run build`
- Pasta de saída: `dist`
- Variável de ambiente `SITE_URL` (ex.: `https://lavandariastella.ao`) para canonical, sitemap e JSON-LD corretos.
- Também pode enviar a pasta `dist/` já compilada (Direct Upload).

## Onde editar
- Preços e serviços: `src/dados/catalogo.ts`
- Contactos e dados das empresas: `src/configuracao/empresa.ts`
- Cores (OKLCH): `src/estilos/global.css` e `src/configuracao/cores.ts`
