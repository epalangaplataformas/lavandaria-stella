import { useId, type ComponentProps, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

const ESTILO_CAMPO =
  'block w-full min-w-0 rounded-xl border border-borda bg-campo px-3.5 py-3 text-base text-texto shadow-xs placeholder:text-suave-texto/70 transition-colors aria-[invalid=true]:border-perigo disabled:opacity-60'

interface PropsRotulo {
  rotulo: string
  ajuda?: string
  erro?: string | undefined
  /** Texto "opcional" junto ao rótulo. */
  opcional?: boolean
  children: (atributos: { id: string; 'aria-describedby': string | undefined; 'aria-invalid': true | undefined }) => ReactNode
  className?: string
}

/** Cola rótulo, ajuda e erro ao campo com os atributos de acessibilidade correctos. */
export function Campo({ rotulo, ajuda, erro, opcional, children, className }: PropsRotulo) {
  const id = useId()
  const idAjuda = `${id}-ajuda`
  const idErro = `${id}-erro`
  const descritoPor = [ajuda ? idAjuda : null, erro ? idErro : null].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('min-w-0', className)}>
      <label htmlFor={id} className="mb-1.5 flex flex-wrap items-baseline gap-x-2 text-sm font-semibold">
        <span>{rotulo}</span>
        {opcional && <span className="text-xs font-normal text-suave-texto">(opcional)</span>}
      </label>
      {children({ id, 'aria-describedby': descritoPor, 'aria-invalid': erro ? true : undefined })}
      {ajuda && (
        <p id={idAjuda} className="mt-1.5 text-xs text-suave-texto">
          {ajuda}
        </p>
      )}
      {erro && (
        <p id={idErro} role="alert" className="mt-1.5 text-sm font-medium break-words text-perigo">
          {erro}
        </p>
      )}
    </div>
  )
}

export function Entrada({ className, ...resto }: ComponentProps<'input'>) {
  return <input className={cn(ESTILO_CAMPO, 'min-h-12', className)} {...resto} />
}

export function AreaTexto({ className, ...resto }: ComponentProps<'textarea'>) {
  return <textarea className={cn(ESTILO_CAMPO, 'min-h-24 resize-y [field-sizing:content]', className)} {...resto} />
}

interface PropsOpcaoRadio extends Omit<ComponentProps<'input'>, 'type' | 'children'> {
  titulo: string
  descricao?: string
  /** Ícone ou elemento decorativo à esquerda. */
  icone?: ReactNode
}

/** Cartão selecionável que usa um `<input type="radio">` real (teclado, leitores de ecrã e comandos de TV). */
export function OpcaoRadio({ titulo, descricao, icone, className, ...resto }: PropsOpcaoRadio) {
  return (
    <label
      className={cn(
        'group relative flex min-w-0 cursor-pointer items-start gap-3 rounded-xl border border-borda bg-campo p-3.5 transition-colors has-checked:border-primaria has-checked:bg-primaria-suave has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-anel',
        className,
      )}
    >
      <input type="radio" className="peer sr-only" {...resto} />
      {icone && (
        <span className="mt-0.5 text-suave-texto group-has-checked:text-primaria-suave-texto [&_svg]:size-5">
          {icone}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-sm leading-snug font-semibold break-words">{titulo}</span>
        {descricao && <span className="mt-0.5 block text-xs leading-snug text-suave-texto">{descricao}</span>}
      </span>
      <span
        aria-hidden="true"
        className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 border-borda transition-colors group-has-checked:border-primaria group-has-checked:bg-primaria"
      >
        <span className="size-1.5 rounded-full bg-primaria-texto opacity-0 group-has-checked:opacity-100" />
      </span>
    </label>
  )
}
