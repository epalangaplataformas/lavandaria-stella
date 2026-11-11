import {
  RiFacebookCircleLine,
  RiMailLine,
  RiMapPinLine,
  RiPhoneLine,
  RiWhatsappFill,
  type RemixiconComponentType,
} from '@remixicon/react'
import { botaoVariantes } from '../componentes/ui/botao-variantes'
import { DESENVOLVEDORA, EMPRESA, PROPRIETARIA } from '../configuracao/empresa'
import { useDocumento } from '../hooks/usar-documento'
import { montarMensagemContacto } from '../lib/mensagens'
import { ligacaoWhatsapp } from '../lib/whatsapp'

interface Cartao {
  Icone: RemixiconComponentType
  titulo: string
  valor: string
  href: string
  externo?: boolean
}

export default function Contactos() {
  useDocumento({
    titulo: 'Contactos e localização',
    descricao:
      'Fale com a Lavandaria Stella por WhatsApp, telefone ou e-mail. Estamos na Vila de Viana, Luanda, perto da escola Garcia Neto.',
  })

  const { contactos, endereco } = EMPRESA
  const cartoes: readonly Cartao[] = [
    { Icone: RiWhatsappFill, titulo: 'WhatsApp', valor: contactos.whatsappExibicao, href: ligacaoWhatsapp(montarMensagemContacto()), externo: true },
    { Icone: RiPhoneLine, titulo: 'Telefone', valor: contactos.telefoneExibicao, href: `tel:${contactos.telefone}` },
    { Icone: RiMailLine, titulo: 'E-mail', valor: contactos.email, href: `mailto:${contactos.email}` },
    { Icone: RiFacebookCircleLine, titulo: 'Facebook', valor: 'Lavandaria Stella', href: contactos.facebook, externo: true },
  ]

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Contactos</h1>
      <p className="mt-1 text-suave-texto">Estamos à sua espera em {endereco.localidade}.</p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {cartoes.map(({ Icone, titulo, valor, href, externo }) => (
          <li key={titulo} className="min-w-0">
            <a
              href={href}
              {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="flex min-h-18 items-center gap-3 rounded-2xl border border-borda bg-cartao p-4 shadow-cartao transition-colors hover:bg-suave"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primaria-suave text-primaria-suave-texto">
                <Icone aria-hidden="true" className="size-6" />
              </span>
              <span className="min-w-0 leading-snug">
                <span className="block text-xs text-suave-texto">{titulo}</span>
                <span className="block text-base font-bold break-all">{valor}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <section aria-labelledby="titulo-local" className="mt-6 rounded-2xl border border-borda bg-cartao p-4 shadow-cartao sm:p-6">
        <h2 id="titulo-local" className="flex items-center gap-2 text-lg font-bold">
          <RiMapPinLine aria-hidden="true" className="size-5 text-primaria" />
          Onde estamos
        </h2>
        <address className="mt-2 text-base not-italic">
          {endereco.referencia}
          <br />
          {endereco.localidade}, {endereco.provincia}, {endereco.pais}
        </address>
        <a
          href={contactos.mapa}
          target="_blank"
          rel="noopener noreferrer"
          className={botaoVariantes({ variante: 'primario', tamanho: 'lg', larguraTotal: true, className: 'mt-4 sm:w-auto' })}
        >
          <RiMapPinLine aria-hidden="true" />
          Abrir no mapa
        </a>
      </section>

      <section aria-labelledby="titulo-legal" className="mt-6 rounded-2xl bg-suave p-4 text-sm leading-relaxed text-suave-texto sm:p-6">
        <h2 id="titulo-legal" className="mb-2 text-base font-bold text-texto">Informação legal</h2>
        <p>
          <strong className="text-texto">{EMPRESA.nome}</strong> é propriedade de {PROPRIETARIA.nome}, NIF {PROPRIETARIA.nif}, com sede
          na {PROPRIETARIA.sede}.
        </p>
        <p className="mt-2">
          Aplicação desenvolvida por <strong className="text-texto">{DESENVOLVEDORA.nome}</strong>, NIF {DESENVOLVEDORA.nif}. Fundador:{' '}
          {DESENVOLVEDORA.fundador}.
        </p>
        <p className="mt-2">
          Privacidade: não usamos contas nem servidores. Os dados que escreve nos formulários ficam apenas no seu dispositivo e só
          são enviados quando toca em enviar pelo WhatsApp.
        </p>
      </section>
    </div>
  )
}
