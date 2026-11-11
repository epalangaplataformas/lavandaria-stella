/**
 * Guarda no dispositivo (nunca num servidor) o nome, telefone e morada do cliente
 * para não ter de os escrever em cada pedido.
 */
import { ehObjecto, guardarJson, lerJson } from '../lib/armazenamento'

export interface DadosGuardadosCliente {
  nome: string
  telefone: string
  morada: string
}

const CHAVE = 'stella:cliente:v1'

export function lerCliente(): DadosGuardadosCliente {
  const bruto = lerJson(CHAVE)
  const texto = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : '')
  if (!ehObjecto(bruto)) return { nome: '', telefone: '', morada: '' }
  return {
    nome: texto(bruto.nome, 60),
    telefone: texto(bruto.telefone, 20),
    morada: texto(bruto.morada, 160),
  }
}

export function guardarCliente(dados: DadosGuardadosCliente): void {
  guardarJson(CHAVE, dados)
}
