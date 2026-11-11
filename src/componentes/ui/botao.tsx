import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '../../lib/cn'
import { botaoVariantes } from './botao-variantes'

export type PropsBotao = ComponentProps<'button'> & VariantProps<typeof botaoVariantes>

export function Botao({
  variante,
  tamanho,
  larguraTotal,
  className,
  type = 'button',
  ...resto
}: PropsBotao) {
  return (
    <button
      type={type}
      className={cn(botaoVariantes({ variante, tamanho, larguraTotal }), className)}
      {...resto}
    />
  )
}
