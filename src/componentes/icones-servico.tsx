import {
  RiAppsLine,
  RiBearSmileLine,
  RiBriefcaseLine,
  RiDropLine,
  RiFireLine,
  RiGraduationCapLine,
  RiHandbagLine,
  RiHome4Line,
  RiHotelBedLine,
  RiShirtLine,
  RiSofaLine,
  RiTShirt2Line,
  RiTShirtLine,
  RiToolsLine,
  RiVipCrownLine,
  RiWalkLine,
  RiWomenLine,
} from '@remixicon/react'
import type { IconeId } from '../dados/catalogo'

type ComponenteIcone = typeof RiAppsLine

/** Ícones Remix no lugar de fotografias dos serviços. */
const ICONES: Readonly<Record<IconeId, ComponenteIcone>> = {
  camiseta: RiTShirtLine,
  casaco: RiShirtLine,
  calca: RiTShirt2Line,
  vestido: RiWomenLine,
  gala: RiVipCrownLine,
  noiva: RiVipCrownLine,
  cama: RiHotelBedLine,
  almofada: RiSofaLine,
  cortina: RiHome4Line,
  banho: RiDropLine,
  urso: RiBearSmileLine,
  calcado: RiWalkLine,
  acessorio: RiHandbagLine,
  farda: RiBriefcaseLine,
  beca: RiGraduationCapLine,
  oficio: RiToolsLine,
  passar: RiFireLine,
}

interface PropsIconeServico {
  icone: IconeId | 'todas'
  className?: string
}

export function IconeServico({ icone, className }: PropsIconeServico) {
  const Icone = icone === 'todas' ? RiAppsLine : ICONES[icone]
  return <Icone aria-hidden="true" className={className} />
}
