/**
 * Dados institucionais da Lavandaria Stella.
 * Fonte única de verdade: usada na interface, no SEO estático (build) e nas mensagens do WhatsApp.
 * Importante: este ficheiro é também lido pelo `vite.config.ts`, por isso não pode importar nada de `react`/DOM.
 */

export const EMPRESA = {
  nome: 'Lavandaria Stella',
  nomeCurto: 'Stella',
  slogan: 'Roupa limpa, sem complicações.',
  descricao:
    'Lavagem, passagem, secagem e tratamento de roupas. Atendimento profissional, entrega pontual e qualidade garantida.',
  responsavel: 'Stellamaria Mbaki',
  moeda: { codigo: 'AOA', simbolo: 'Kz' },
  contactos: {
    /** Número internacional, sem `+` nem espaços (formato exigido pelo wa.me). */
    whatsapp: '244924041577',
    whatsappExibicao: '+244 924 041 577',
    telefone: '+244936331344',
    telefoneExibicao: '+244 936 331 344',
    email: 'lavandariastella@gmail.com',
    facebook: 'https://www.facebook.com/lavanderiastellaa/',
    mapa: 'https://maps.google.com/?cid=14433589917263282468',
  },
  endereco: {
    referencia: 'Garcia Neto, escola e centro de acolhimento (horizontal azul)',
    localidade: 'Vila de Viana',
    provincia: 'Luanda',
    pais: 'Angola',
    codigoPais: 'AO',
  },
} as const

/** Empresa proprietária da marca. */
export const PROPRIETARIA = {
  nome: 'Massolekele Comércio e Prestação de Serviços',
  nif: '5001690825',
  sede: 'Rua 11 de Novembro, Viana, Luanda, República de Angola',
} as const

/** Empresa que desenvolveu e mantém a aplicação. */
export const DESENVOLVEDORA = {
  nome: 'Epalanga Plataformas - Tecnologia, (SU), Lda',
  nif: '5002570327',
  fundador: 'Jorge Cambundo Epalanga',
  paisAtendido: 'Angola',
} as const

/** Rotas da aplicação (única fonte para links, sitemap e navegação). */
export const ROTAS = {
  inicio: '/',
  pedido: '/pedido',
  reservar: '/reservar',
  contactos: '/contactos',
} as const

export type Rota = (typeof ROTAS)[keyof typeof ROTAS]
