/**
 * Funções de formatação puras (sem DOM). Usadas na interface, nas mensagens do WhatsApp e no build.
 */

const ESPACO_FIXO = ' '

function agruparMilhares(valor: number): string {
  return Math.round(valor)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/** Interface: "12.500 Kz" com espaço inseparável para nunca quebrar o valor da moeda. */
export function formatarKz(valor: number): string {
  return `${agruparMilhares(valor)}${ESPACO_FIXO}Kz`
}

/** Texto simples (mensagens, JSON-LD, llms.txt): "12.500 Kz" com espaço normal. */
export function formatarKzTexto(valor: number): string {
  return `${agruparMilhares(valor)} Kz`
}

/** Remove acentos, símbolos e maiúsculas para pesquisas tolerantes ("calca" encontra "Calça"). */
export function normalizarTexto(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

/** Devolve apenas os 9 dígitos nacionais (aceita "+244 924 041 577", "00244...", "924041577"). */
export function extrairTelefoneNacional(entrada: string): string {
  let digitos = entrada.replace(/\D/g, '')
  if (digitos.startsWith('00244')) digitos = digitos.slice(5)
  else if (digitos.startsWith('244') && digitos.length > 9) digitos = digitos.slice(3)
  return digitos
}

/** Número móvel angolano: 9 dígitos começados por 9. */
export function ehTelefoneAngolano(entrada: string): boolean {
  return /^9\d{8}$/.test(extrairTelefoneNacional(entrada))
}

/** "923456789" -> "+244 923 456 789". */
export function formatarTelefoneAngolano(entrada: string): string {
  const n = extrairTelefoneNacional(entrada)
  if (n.length !== 9) return entrada.trim()
  return `+244 ${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`
}

/** Data local no formato AAAA-MM-DD (aceite por `<input type="date">`). */
export function hojeISO(referencia: Date = new Date()): string {
  const ano = referencia.getFullYear()
  const mes = String(referencia.getMonth() + 1).padStart(2, '0')
  const dia = String(referencia.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

/** "2026-11-12" -> "quinta-feira, 12 de novembro de 2026". Faz o parse manualmente para evitar desvios de fuso. */
export function formatarDataLonga(iso: string): string {
  const partes = iso.split('-').map(Number)
  const [ano, mes, dia] = partes
  if (!ano || !mes || !dia) return iso
  const data = new Date(ano, mes - 1, dia)
  if (Number.isNaN(data.getTime())) return iso
  return new Intl.DateTimeFormat(['pt-AO', 'pt-PT', 'pt'], { dateStyle: 'full' }).format(data)
}

/** Código curto para o cliente e a lavandaria se referirem ao mesmo pedido. Ex.: "LS-1011-K7M2". */
export function gerarReferencia(agora: Date = new Date()): string {
  const alfabeto = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789' // sem 0/O/1/I/L para evitar confusões
  const aleatorio = new Uint32Array(4)
  crypto.getRandomValues(aleatorio)
  const sufixo = Array.from(aleatorio, (n) => alfabeto[n % alfabeto.length]).join('')
  const dia = String(agora.getDate()).padStart(2, '0')
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  return `LS-${dia}${mes}-${sufixo}`
}

/** Limita texto livre antes de o enviar numa URL. */
export function limitarTexto(texto: string, maximo: number): string {
  const limpo = texto.replace(/\s+/g, ' ').trim()
  return limpo.length > maximo ? `${limpo.slice(0, maximo - 1).trimEnd()}…` : limpo
}
