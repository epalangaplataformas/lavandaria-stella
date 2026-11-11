import { useId } from 'react'
import { acoesCarrinho, useCarrinho } from '../armazens/carrinho'
import { PRAZOS, rotuloDias } from '../dados/catalogo'
import { cn } from '../lib/cn'

/** Escolha do prazo (Normal, Semi-urgente, Urgência máxima). Afecta o preço de todo o catálogo. */
export function SeletorPrazo({ className }: { className?: string }) {
  const prazo = useCarrinho((e) => e.prazo)
  const nome = useId()

  return (
    <fieldset className={cn('min-w-0', className)}>
      <legend className="mb-2 text-sm font-semibold">Prazo de entrega</legend>
      <div className="grid grid-cols-3 gap-2">
        {PRAZOS.map((p) => (
          <label
            key={p.id}
            className="relative flex min-h-16 min-w-0 cursor-pointer flex-col justify-center rounded-xl border border-borda bg-cartao px-2.5 py-2 text-center transition-colors has-checked:border-primaria has-checked:bg-primaria has-checked:text-primaria-texto has-checked:shadow-cartao has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-anel"
          >
            <input
              type="radio"
              name={nome}
              value={p.id}
              checked={prazo === p.id}
              onChange={() => acoesCarrinho.definirPrazo(p.id)}
              className="sr-only"
            />
            <span className="text-[0.8125rem] leading-tight font-bold break-words">{p.nome}</span>
            <span className="mt-0.5 text-xs leading-tight opacity-80">{rotuloDias(p.diasPadrao)}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
