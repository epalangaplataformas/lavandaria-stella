import { EMPRESA } from '../configuracao/empresa'

/** Ligação wa.me com o texto já formatado (a conversa abre com a mensagem pronta a enviar). */
export function ligacaoWhatsapp(mensagem?: string): string {
  const base = `https://wa.me/${EMPRESA.contactos.whatsapp}`
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base
}

/**
 * Abre o WhatsApp. Deve ser chamado directamente a partir de um gesto do utilizador (clique/submit),
 * caso contrário os navegadores bloqueiam a nova janela.
 */
export function abrirWhatsapp(mensagem?: string): string {
  const url = ligacaoWhatsapp(mensagem)
  const janela = window.open(url, '_blank', 'noopener,noreferrer')
  if (!janela) window.location.assign(url) // bloqueado: abre no mesmo separador
  return url
}

/** Copia para a área de transferência (com alternativa para navegadores antigos). */
export async function copiarTexto(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto)
    return true
  } catch {
    try {
      const area = document.createElement('textarea')
      area.value = texto
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      const ok = document.execCommand('copy')
      area.remove()
      return ok
    } catch {
      return false
    }
  }
}
