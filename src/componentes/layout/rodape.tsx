import { RiFacebookCircleLine, RiMailLine, RiMapPinLine, RiPhoneLine, RiWhatsappLine } from '@remixicon/react'
import { Link } from 'react-router'
import { DESENVOLVEDORA, EMPRESA, PROPRIETARIA, ROTAS } from '../../configuracao/empresa'
import { montarMensagemContacto } from '../../lib/mensagens'
import { ligacaoWhatsapp } from '../../lib/whatsapp'
import { Marca } from '../marca'

const LIGACAO_CONTACTO =
  'inline-flex min-h-10 items-center gap-2 rounded-lg py-1.5 text-sm text-suave-texto transition-colors hover:text-texto [&_svg]:size-5 [&_svg]:shrink-0 [&_svg]:text-primaria'

export function Rodape() {
  const { contactos, endereco } = EMPRESA

  return (
    <footer className="border-t border-borda bg-suave/60 pb-[calc(var(--altura-navegacao)+env(safe-area-inset-bottom)+5.5rem)] md:pb-8 lg:pb-8">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="min-w-0">
          <Marca />
          <p className="mt-3 max-w-sm text-sm text-suave-texto">{EMPRESA.descricao}</p>
        </div>

        <nav aria-label="Páginas" className="min-w-0">
          <h2 className="mb-2 text-sm font-bold">Navegar</h2>
          <ul className="flex flex-col">
            <li>
              <Link to={ROTAS.inicio} className={LIGACAO_CONTACTO}>Catálogo e preços</Link>
            </li>
            <li>
              <Link to={ROTAS.reservar} className={LIGACAO_CONTACTO}>Reservar recolha ou entrega</Link>
            </li>
            <li>
              <Link to={ROTAS.pedido} className={LIGACAO_CONTACTO}>O seu pedido</Link>
            </li>
            <li>
              <Link to={ROTAS.contactos} className={LIGACAO_CONTACTO}>Contactos e localização</Link>
            </li>
          </ul>
        </nav>

        <div className="min-w-0">
          <h2 className="mb-2 text-sm font-bold">Fale connosco</h2>
          <ul className="flex flex-col">
            <li>
              <a href={ligacaoWhatsapp(montarMensagemContacto())} target="_blank" rel="noopener noreferrer" className={LIGACAO_CONTACTO}>
                <RiWhatsappLine aria-hidden="true" /> {contactos.whatsappExibicao}
              </a>
            </li>
            <li>
              <a href={`tel:${contactos.telefone}`} className={LIGACAO_CONTACTO}>
                <RiPhoneLine aria-hidden="true" /> {contactos.telefoneExibicao}
              </a>
            </li>
            <li>
              <a href={`mailto:${contactos.email}`} className={`${LIGACAO_CONTACTO} min-w-0 break-all`}>
                <RiMailLine aria-hidden="true" /> {contactos.email}
              </a>
            </li>
            <li>
              <a href={contactos.facebook} target="_blank" rel="noopener noreferrer" className={LIGACAO_CONTACTO}>
                <RiFacebookCircleLine aria-hidden="true" /> Facebook
              </a>
            </li>
            <li>
              <a href={contactos.mapa} target="_blank" rel="noopener noreferrer" className={LIGACAO_CONTACTO}>
                <RiMapPinLine aria-hidden="true" />
                <span className="min-w-0">{endereco.localidade}, {endereco.provincia}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-6xl border-t border-borda px-4 pt-5 text-xs leading-relaxed text-suave-texto">
        <p>
          © {new Date().getFullYear()} {EMPRESA.nome} é uma marca de {PROPRIETARIA.nome}, NIF{' '}
          {PROPRIETARIA.nif}, com sede em {PROPRIETARIA.sede}.
        </p>
        <p className="mt-1.5">
          Aplicação desenvolvida por {DESENVOLVEDORA.nome}, NIF {DESENVOLVEDORA.nif}. Fundador:{' '}
          {DESENVOLVEDORA.fundador}.
        </p>
      </div>
    </footer>
  )
}
