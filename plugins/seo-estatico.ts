/**
 * Plugin de build: gera, a partir dos dados do catálogo, tudo o que torna o site legível para
 * motores de busca e IAs sem executar JavaScript:
 *  - JSON-LD (schema.org) e <noscript> com a tabela de preços no index.html
 *  - sitemap.xml, robots.txt, llms.txt e llms-full.txt
 *  - _headers (cache e segurança para o Cloudflare Pages), com hash CSP do script de tema
 */
import { createHash } from 'node:crypto'
import type { Plugin } from 'vite'
import { CHAVE_TEMA, COR_FUNDO_CLARO, COR_FUNDO_ESCURO, COR_MARCA } from '../src/configuracao/cores.ts'
import { DESENVOLVEDORA, EMPRESA, PROPRIETARIA, ROTAS } from '../src/configuracao/empresa.ts'
import {
  PRAZOS,
  SERVICOS,
  agruparPorCategoria,
  diasDe,
  intervaloDePrecos,
  rotuloDias,
} from '../src/dados/catalogo.ts'
import { formatarKzTexto } from '../src/lib/formatar.ts'

interface Opcoes {
  readonly urlDoSite: string
}

/** Aplica o tema antes da primeira pintura (evita o "flash" de tema errado). */
const SCRIPT_TEMA = `(function(){try{var r=document.documentElement,t=localStorage.getItem('${CHAVE_TEMA}'),e=t?t==='escuro':matchMedia('(prefers-color-scheme: dark)').matches;r.classList.toggle('dark',e);r.style.colorScheme=e?'dark':'light';var m=document.querySelector('meta[name=theme-color]');if(m)m.setAttribute('content',e?'${COR_FUNDO_ESCURO}':'${COR_FUNDO_CLARO}')}catch(x){}})()`

const escaparHtml = (texto: string) =>
  texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const escaparXml = escaparHtml

function precosEmTexto(servico: (typeof SERVICOS)[number]): string {
  return PRAZOS.map(
    (p) =>
      `${p.nome} (${rotuloDias(diasDe(servico, p.id)).toLowerCase()}): ${formatarKzTexto(servico.precos[p.id])}`,
  ).join(' · ')
}

function criarJsonLd(url: string) {
  const { minimo, maximo } = intervaloDePrecos()
  const idNegocio = `${url}/#negocio`
  const idDesenvolvedora = `${url}/#desenvolvedora`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${url}/#site`,
        url: `${url}/`,
        name: EMPRESA.nome,
        description: EMPRESA.descricao,
        inLanguage: 'pt-AO',
        publisher: { '@id': idNegocio },
        creator: { '@id': idDesenvolvedora },
      },
      {
        '@type': ['LocalBusiness', 'DryCleaningOrLaundry'],
        '@id': idNegocio,
        name: EMPRESA.nome,
        alternateName: EMPRESA.nomeCurto,
        description: EMPRESA.descricao,
        url: `${url}/`,
        image: `${url}/og-imagem.jpg`,
        logo: `${url}/icones/icone-512.png`,
        telephone: EMPRESA.contactos.telefone,
        email: EMPRESA.contactos.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: EMPRESA.endereco.referencia,
          addressLocality: EMPRESA.endereco.localidade,
          addressRegion: EMPRESA.endereco.provincia,
          addressCountry: EMPRESA.endereco.codigoPais,
        },
        hasMap: EMPRESA.contactos.mapa,
        areaServed: { '@type': 'Place', name: `${EMPRESA.endereco.localidade}, ${EMPRESA.endereco.provincia}` },
        currenciesAccepted: EMPRESA.moeda.codigo,
        priceRange: `${formatarKzTexto(minimo)} – ${formatarKzTexto(maximo)}`,
        sameAs: [EMPRESA.contactos.facebook],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            telephone: `+${EMPRESA.contactos.whatsapp}`,
            availableLanguage: ['pt'],
            areaServed: 'AO',
            description: 'WhatsApp',
          },
        ],
        parentOrganization: {
          '@type': 'Organization',
          name: PROPRIETARIA.nome,
          taxID: PROPRIETARIA.nif,
          address: PROPRIETARIA.sede,
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Tabela de preços 2026',
          itemListElement: agruparPorCategoria(SERVICOS).map(({ categoria, servicos }) => ({
            '@type': 'OfferCatalog',
            name: categoria.nome,
            itemListElement: servicos.map((s) => ({
              '@type': 'Offer',
              price: s.precos.normal,
              priceCurrency: EMPRESA.moeda.codigo,
              itemOffered: { '@type': 'Service', name: s.nome, serviceType: categoria.nome },
            })),
          })),
        },
      },
      {
        '@type': 'Organization',
        '@id': idDesenvolvedora,
        name: DESENVOLVEDORA.nome,
        taxID: DESENVOLVEDORA.nif,
        founder: [{ '@type': 'Person', name: DESENVOLVEDORA.fundador }],
        areaServed: { '@type': 'Country', name: DESENVOLVEDORA.paisAtendido },
      },
    ],
  }
}

function criarNoscript(): string {
  const linhas = agruparPorCategoria(SERVICOS)
    .map(
      ({ categoria, servicos }) =>
        `<h3>${escaparHtml(categoria.nome)}</h3><ul>${servicos
          .map((s) => `<li>${escaparHtml(s.nome)} — ${escaparHtml(precosEmTexto(s))}</li>`)
          .join('')}</ul>`,
    )
    .join('')

  return `<noscript><main style="font-family:system-ui,sans-serif;max-width:46rem;margin:0 auto;padding:1.5rem;line-height:1.55"><h1>${escaparHtml(EMPRESA.nome)}</h1><p>${escaparHtml(EMPRESA.descricao)}</p><p><strong>WhatsApp:</strong> <a href="https://wa.me/${EMPRESA.contactos.whatsapp}">${EMPRESA.contactos.whatsappExibicao}</a> · <strong>Telefone:</strong> <a href="tel:${EMPRESA.contactos.telefone}">${EMPRESA.contactos.telefoneExibicao}</a> · <strong>E-mail:</strong> <a href="mailto:${EMPRESA.contactos.email}">${EMPRESA.contactos.email}</a></p><p><strong>Endereço:</strong> ${escaparHtml(EMPRESA.endereco.referencia)}, ${EMPRESA.endereco.localidade}, ${EMPRESA.endereco.provincia}, ${EMPRESA.endereco.pais}.</p><p>Active o JavaScript para fazer pedidos e reservas pela aplicação. Pode também contactar-nos directamente pelo WhatsApp.</p><h2>Tabela de preços 2026 (Kwanzas)</h2>${linhas}</main></noscript>`
}

function criarLlmsTxt(url: string): string {
  const c = EMPRESA.contactos
  return `# ${EMPRESA.nome}

> ${EMPRESA.descricao} Lavandaria em ${EMPRESA.endereco.localidade}, ${EMPRESA.endereco.provincia}, ${EMPRESA.endereco.pais}. Preços em Kwanzas (Kz). Pedidos e reservas são feitos por WhatsApp.

## Contactos
- WhatsApp: ${c.whatsappExibicao} (https://wa.me/${c.whatsapp})
- Telefone: ${c.telefoneExibicao}
- E-mail: ${c.email}
- Facebook: ${c.facebook}
- Endereço: ${EMPRESA.endereco.referencia}, ${EMPRESA.endereco.localidade}, ${EMPRESA.endereco.provincia}, ${EMPRESA.endereco.pais}
- Mapa: ${c.mapa}
- Responsável: ${EMPRESA.responsavel}

## Páginas
- [Catálogo e preços](${url}${ROTAS.inicio}): lista de ${SERVICOS.length} serviços com preços por prazo de entrega.
- [Reservar recolha ou entrega](${url}${ROTAS.reservar}): marcar data e período por WhatsApp.
- [Contactos e localização](${url}${ROTAS.contactos}): telefone, e-mail, morada e dados legais.

## Prazos de entrega
${PRAZOS.map((p) => `- ${p.nome}: ${rotuloDias(p.diasPadrao).toLowerCase()}`).join('\n')}
- Peças de tratamento demorado (ténis, cobertores, colchas, bonecas e vestidos de gala volumosos e de noiva): 5 dias (normal), 3 dias (semi-urgente) e 2 dias (urgência máxima).

## Mais detalhe
- [Tabela de preços completa](${url}/llms-full.txt): todos os serviços e preços em texto simples.

## Dados legais
- Proprietária: ${PROPRIETARIA.nome}, NIF ${PROPRIETARIA.nif}, ${PROPRIETARIA.sede}.
- Desenvolvimento: ${DESENVOLVEDORA.nome}, NIF ${DESENVOLVEDORA.nif}.
`
}

function criarLlmsFull(url: string): string {
  const tabela = agruparPorCategoria(SERVICOS)
    .map(({ categoria, servicos }) => {
      const cabecalho = `## ${categoria.nome}\n${categoria.descricao}\n\n| Nº | Serviço | ${PRAZOS.map((p) => p.nome).join(' | ')} |\n|---|---|${PRAZOS.map(() => '---').join('|')}|`
      const corpo = servicos
        .map(
          (s) =>
            `| ${s.id} | ${s.nome} | ${PRAZOS.map((p) => `${formatarKzTexto(s.precos[p.id])} (${rotuloDias(diasDe(s, p.id)).toLowerCase()})`).join(' | ')} |`,
        )
        .join('\n')
      return `${cabecalho}\n${corpo}`
    })
    .join('\n\n')

  return `# ${EMPRESA.nome} — Tabela de preços 2026

Moeda: Kwanza angolano (Kz). Os valores são estimativas e confirmados após a verificação das peças.
Pedidos e reservas: WhatsApp ${EMPRESA.contactos.whatsappExibicao} (https://wa.me/${EMPRESA.contactos.whatsapp}).
Site: ${url}/

${tabela}
`
}

function criarSitemap(url: string, dataIso: string): string {
  const paginas: ReadonlyArray<{ rota: string; prioridade: string; frequencia: string }> = [
    { rota: ROTAS.inicio, prioridade: '1.0', frequencia: 'weekly' },
    { rota: ROTAS.reservar, prioridade: '0.7', frequencia: 'monthly' },
    { rota: ROTAS.contactos, prioridade: '0.6', frequencia: 'monthly' },
  ]
  const entradas = paginas
    .map(
      (p) =>
        `  <url><loc>${escaparXml(url + (p.rota === '/' ? '/' : p.rota))}</loc><lastmod>${dataIso}</lastmod><changefreq>${p.frequencia}</changefreq><priority>${p.prioridade}</priority></url>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entradas}\n</urlset>\n`
}

function criarRobots(url: string): string {
  const robotsIa = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-SearchBot',
    'Claude-User',
    'PerplexityBot',
    'Google-Extended',
    'Applebot-Extended',
    'CCBot',
  ]
  return `# ${EMPRESA.nome} — pode ser rastreado por motores de busca e assistentes de IA.
User-agent: *
Allow: /
Disallow: ${ROTAS.pedido}

${robotsIa.map((agente) => `User-agent: ${agente}\nAllow: /\nDisallow: ${ROTAS.pedido}`).join('\n\n')}

Sitemap: ${url}/sitemap.xml
# Resumo para IAs: ${url}/llms.txt
`
}

function criarCabecalhos(hashScript: string): string {
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'sha256-${hashScript}'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "manifest-src 'self'",
    "worker-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
  ].join('; ')

  return `/*
  Content-Security-Policy: ${csp}
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/sw.js
  Cache-Control: no-cache

/workbox-*.js
  Cache-Control: public, max-age=31536000, immutable

/manifest.webmanifest
  Cache-Control: no-cache
  Content-Type: application/manifest+json

/icones/*
  Cache-Control: public, max-age=2592000

/logotipo.webp
  Cache-Control: public, max-age=2592000

/og-imagem.jpg
  Cache-Control: public, max-age=86400

/llms.txt
  Content-Type: text/plain; charset=utf-8

/llms-full.txt
  Content-Type: text/plain; charset=utf-8
`
}

export function seoEstatico({ urlDoSite }: Opcoes): Plugin {
  const url = urlDoSite.replace(/\/+$/, '')
  const hashScript = createHash('sha256').update(SCRIPT_TEMA).digest('base64')

  return {
    name: 'lavandaria-stella:seo-estatico',

    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const jsonLd = JSON.stringify(criarJsonLd(url)).replace(/</g, '\\u003c')
        return html
          .replaceAll('{{URL_SITE}}', url)
          .replaceAll('{{NOME}}', escaparHtml(EMPRESA.nome))
          .replaceAll('{{DESCRICAO}}', escaparHtml(EMPRESA.descricao))
          .replaceAll('{{COR_MARCA}}', COR_MARCA)
          .replaceAll('{{COR_FUNDO_CLARO}}', COR_FUNDO_CLARO)
          .replaceAll('{{COR_FUNDO_ESCURO}}', COR_FUNDO_ESCURO)
          .replace('<!--@script-tema-->', `<script>${SCRIPT_TEMA}</script>`)
          .replace('<!--@json-ld-->', `<script type="application/ld+json">${jsonLd}</script>`)
          .replace('<!--@noscript-->', criarNoscript())
      },
    },

    generateBundle() {
      const dataIso = new Date().toISOString().slice(0, 10)
      const emitir = (fileName: string, source: string) =>
        this.emitFile({ type: 'asset', fileName, source })

      emitir('sitemap.xml', criarSitemap(url, dataIso))
      emitir('robots.txt', criarRobots(url))
      emitir('llms.txt', criarLlmsTxt(url))
      emitir('llms-full.txt', criarLlmsFull(url))
      emitir('_headers', criarCabecalhos(hashScript))
    },
  }
}
