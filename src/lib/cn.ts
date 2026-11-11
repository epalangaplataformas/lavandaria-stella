type Classe = string | false | null | undefined

/** Junta classes ignorando valores vazios: `cn('a', cond && 'b')`. */
export function cn(...classes: Classe[]): string {
  return classes.filter(Boolean).join(' ')
}
