import { Link } from 'react-router'
import { botaoVariantes } from '../componentes/ui/botao-variantes'
import { ROTAS } from '../configuracao/empresa'
import { useDocumento } from '../hooks/usar-documento'

export default function NaoEncontrada() {
  useDocumento({ titulo: 'Página não encontrada', descricao: 'A página que procura não existe.', noindex: true })

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="text-6xl font-extrabold text-primaria">404</p>
      <h1 className="mt-2 text-2xl font-extrabold">Página não encontrada</h1>
      <p className="mt-2 text-suave-texto">Esta página não existe ou mudou de sítio.</p>
      <Link to={ROTAS.inicio} viewTransition className={botaoVariantes({ tamanho: 'lg', className: 'mt-6' })}>
        Ir para o catálogo
      </Link>
    </div>
  )
}
