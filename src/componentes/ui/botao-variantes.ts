import { cva } from 'class-variance-authority'

/** Estilos de botão reutilizáveis também em `<Link>` e `<a>`: `className={botaoVariantes({ variante: 'whatsapp' })}`. */
export const botaoVariantes = cva(
  'inline-flex shrink-0 select-none items-center justify-center gap-2 rounded-full text-center font-semibold leading-tight transition-[background-color,color,box-shadow,transform,filter] duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-5 [&_svg]:shrink-0',
  {
    variants: {
      variante: {
        primario: 'bg-primaria text-primaria-texto shadow-cartao hover:brightness-110',
        secundario: 'bg-primaria-suave text-primaria-suave-texto hover:brightness-95',
        contorno: 'border border-borda bg-cartao text-cartao-texto hover:bg-suave',
        fantasma: 'text-texto hover:bg-suave',
        whatsapp: 'bg-whatsapp text-whatsapp-texto shadow-cartao hover:brightness-110',
        perigo: 'text-perigo hover:bg-suave',
        claro: 'bg-white text-[oklch(0.36_0.07_232)] shadow-cartao hover:bg-white/90',
        translucido: 'border border-white/30 bg-white/10 text-white hover:bg-white/20',
      },
      tamanho: {
        sm: 'min-h-10 px-4 text-sm',
        md: 'min-h-11 px-5 text-sm',
        lg: 'min-h-13 px-7 text-base',
        icone: 'size-11 p-0',
      },
      larguraTotal: { true: 'w-full', false: '' },
    },
    defaultVariants: { variante: 'primario', tamanho: 'md', larguraTotal: false },
  },
)
