/**
 * Mensagens formatadas para o WhatsApp (negrito com *asteriscos*, itálico com _sublinhados_).
 * Funções puras: recebem dados e devolvem texto, por isso são fáceis de testar.
 */
import { PRAZOS, prazoPorId, rotuloDias, type PrazoId } from '../dados/catalogo'
import { EMPRESA } from '../configuracao/empresa'
import { formatarDataLonga, formatarKzTexto, formatarTelefoneAngolano, limitarTexto } from './formatar'
import type { ResumoPedido } from './pedido'

export type Modalidade = 'loja' | 'recolha'
export type PeriodoDia = 'manha' | 'tarde'
export type TipoReserva = 'recolha' | 'levar'

export interface DadosPedido {
  nome: string
  telefone: string
  modalidade: Modalidade
  morada: string
  dataPretendida: string
  notas: string
}

export interface DadosReserva {
  nome: string
  telefone: string
  tipo: TipoReserva
  data: string
  periodo: PeriodoDia
  morada: string
  descricao: string
  notas: string
}

export const ROTULO_MODALIDADE: Readonly<Record<Modalidade, string>> = {
  loja: 'Levo as peças à lavandaria',
  recolha: 'Recolha e entrega ao domicílio',
}

export const ROTULO_TIPO_RESERVA: Readonly<Record<TipoReserva, string>> = {
  recolha: 'Recolha ao domicílio',
  levar: 'Vou entregar as peças na lavandaria',
}

export const ROTULO_PERIODO: Readonly<Record<PeriodoDia, string>> = {
  manha: 'Manhã',
  tarde: 'Tarde',
}

/**
 * Limite prudente do texto já codificado na URL: acima disto alguns navegadores móveis
 * e a app do WhatsApp podem recusar abrir a conversa.
 */
const LIMITE_URL = 6000
const SEPARADOR = '──────────────'

function tamanhoCodificado(texto: string): number {
  return encodeURIComponent(texto).length
}

export function montarMensagemPedido(
  dados: DadosPedido,
  resumo: ResumoPedido,
  prazo: PrazoId,
  referencia: string,
): string {
  const { nome: nomePrazo } = prazoPorId(prazo)

  const cabecalho = [
    `*🧺 Novo pedido — ${EMPRESA.nome}*`,
    `_Ref.: ${referencia}_`,
    '',
    `*Cliente:* ${limitarTexto(dados.nome, 60)}`,
    `*Telefone:* ${formatarTelefoneAngolano(dados.telefone)}`,
    `*Modalidade:* ${ROTULO_MODALIDADE[dados.modalidade]}`,
    ...(dados.modalidade === 'recolha' ? [`*Morada:* ${limitarTexto(dados.morada, 160)}`] : []),
    `*Prazo:* ${nomePrazo}`,
    ...(dados.dataPretendida ? [`*Data pretendida:* ${formatarDataLonga(dados.dataPretendida)}`] : []),
  ]

  const rodape = [
    `*Total estimado: ${formatarKzTexto(resumo.total)}*`,
    '_Valor sujeito a confirmação após a verificação das peças._',
    ...(dados.notas.trim() ? ['', `*Observações:* ${limitarTexto(dados.notas, 300)}`] : []),
  ]

  const formatarLinha = (indice: number, completa: boolean): string => {
    const { servico, quantidade, precoUnitario, subtotal, dias } = resumo.linhas[indice]!
    const prazoPeca = servico.dias ? ` (${rotuloDias(dias).toLowerCase()})` : ''
    if (!completa) return `${indice + 1}. ${quantidade}× ${servico.nome}${prazoPeca}`
    const unitario = quantidade > 1 ? ` (${formatarKzTexto(precoUnitario)} cada)` : ''
    return `${indice + 1}. ${quantidade}× ${servico.nome}${prazoPeca}${unitario} — ${formatarKzTexto(subtotal)}`
  }

  const montar = (completa: boolean, ate: number): string => {
    const itens = Array.from({ length: ate }, (_, i) => formatarLinha(i, completa))
    const omitidas = resumo.linhas.length - ate
    return [
      ...cabecalho,
      '',
      `*Peças (${resumo.totalPecas})*`,
      ...itens,
      ...(omitidas > 0 ? [`_… e mais ${omitidas} tipo(s) de peça — detalhamos na conversa._`] : []),
      completa ? SEPARADOR : '',
      ...rodape,
    ].join('\n')
  }

  // 1.º tentativa: mensagem completa. Depois, versões mais curtas se a URL ficar longa demais.
  let mensagem = montar(true, resumo.linhas.length)
  if (tamanhoCodificado(mensagem) <= LIMITE_URL) return mensagem

  mensagem = montar(false, resumo.linhas.length)
  let ate = resumo.linhas.length
  while (tamanhoCodificado(mensagem) > LIMITE_URL && ate > 1) {
    ate -= 5
    ate = Math.max(ate, 1)
    mensagem = montar(false, ate)
  }
  return mensagem
}

export function montarMensagemReserva(dados: DadosReserva, referencia: string): string {
  return [
    `*📅 Nova reserva — ${EMPRESA.nome}*`,
    `_Ref.: ${referencia}_`,
    '',
    `*Cliente:* ${limitarTexto(dados.nome, 60)}`,
    `*Telefone:* ${formatarTelefoneAngolano(dados.telefone)}`,
    `*Tipo:* ${ROTULO_TIPO_RESERVA[dados.tipo]}`,
    `*Data:* ${formatarDataLonga(dados.data)}`,
    `*Período:* ${ROTULO_PERIODO[dados.periodo]}`,
    ...(dados.tipo === 'recolha' ? [`*Morada:* ${limitarTexto(dados.morada, 160)}`] : []),
    '',
    `*O que vamos tratar:* ${limitarTexto(dados.descricao, 400)}`,
    ...(dados.notas.trim() ? [`*Observações:* ${limitarTexto(dados.notas, 300)}`] : []),
    '',
    '_Aguardo a vossa confirmação. Obrigado!_',
  ].join('\n')
}

/** Mensagem curta para quem só quer perguntar algo (botões de contacto). */
export function montarMensagemContacto(assunto?: string): string {
  return assunto
    ? `Olá, ${EMPRESA.nome}! ${assunto}`
    : `Olá, ${EMPRESA.nome}! Gostaria de saber mais sobre os vossos serviços.`
}

/** Texto curto com o resumo dos prazos, útil em ajudas contextuais. */
export function descreverPrazos(): string {
  return PRAZOS.map((p) => `${p.nome}: ${rotuloDias(p.diasPadrao).toLowerCase()}`).join(' · ')
}
