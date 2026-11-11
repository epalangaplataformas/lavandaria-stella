import { useId } from 'react'
import { cn } from '../lib/cn'

/** Emblema da máquina de lavar, desenhado em SVG com as cores do logótipo (acompanha o tema). */
export function Emblema({ className }: { className?: string }) {
  const idVidro = useId()
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={cn('text-primaria', className)}>
      <defs>
        <clipPath id={idVidro}>
          <circle cx="24" cy="28" r="10" />
        </clipPath>
      </defs>
      <rect x="4" y="2" width="40" height="44" rx="9" fill="currentColor" />
      <rect x="29" y="8" width="7" height="3" rx="1.5" fill="#fff" opacity="0.92" />
      <circle cx="13" cy="9.5" r="1.6" fill="#fff" opacity="0.92" />
      <circle cx="19" cy="9.5" r="1.6" fill="#fff" opacity="0.92" />
      <circle cx="24" cy="28" r="12.5" fill="#fff" />
      <g clipPath={`url(#${idVidro})`}>
        <circle cx="24" cy="28" r="10" fill="oklch(0.93 0.035 225)" />
        <path d="M12 27c3-2.6 6-2.6 9 0s6 2.6 9 0 4-1.6 6-.6V40H12Z" fill="oklch(0.69 0.139 235)" />
        <circle cx="29" cy="23" r="1.1" fill="#fff" opacity="0.85" />
        <circle cx="31.5" cy="26" r="0.8" fill="#fff" opacity="0.85" />
      </g>
    </svg>
  )
}

interface PropsMarca {
  className?: string
  /** Mostra o nome ao lado do emblema. */
  comTexto?: boolean
}

export function Marca({ className, comTexto = true }: PropsMarca) {
  return (
    <span className={cn('inline-flex min-w-0 items-center gap-2.5', className)}>
      <Emblema className="size-9 shrink-0" />
      {comTexto && (
        <span className="flex min-w-0 flex-col leading-none">
          <span className="truncate text-[0.7rem] font-extrabold tracking-[0.18em] text-primaria uppercase">
            Lavandaria
          </span>
          <span className="truncate text-xl font-extrabold tracking-tight text-destaque italic">
            Stella
          </span>
        </span>
      )}
    </span>
  )
}
