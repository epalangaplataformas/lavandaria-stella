/**
 * Acesso seguro ao localStorage: nunca lança excepções (modo privado, armazenamento cheio ou bloqueado).
 */

export function lerTexto(chave: string): string | null {
  try {
    return localStorage.getItem(chave)
  } catch {
    return null
  }
}

export function guardarTexto(chave: string, valor: string): void {
  try {
    localStorage.setItem(chave, valor)
  } catch {
    /* ignorado: a aplicação funciona sem persistência */
  }
}

export function removerChave(chave: string): void {
  try {
    localStorage.removeItem(chave)
  } catch {
    /* ignorado */
  }
}

/** Lê JSON como `unknown` — quem chama é obrigado a validar o formato antes de usar. */
export function lerJson(chave: string): unknown {
  const texto = lerTexto(chave)
  if (texto === null) return null
  try {
    return JSON.parse(texto) as unknown
  } catch {
    return null
  }
}

export function guardarJson(chave: string, valor: unknown): void {
  guardarTexto(chave, JSON.stringify(valor))
}

export function ehObjecto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor)
}
