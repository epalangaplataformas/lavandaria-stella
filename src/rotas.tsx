import { createBrowserRouter } from 'react-router'
import { Estrutura } from './componentes/layout/estrutura'
import { ROTAS } from './configuracao/empresa'
import Inicio from './paginas/inicio'

/** A página inicial vai no pacote principal (primeira pintura rápida); as restantes são carregadas a pedido. */
export const roteador = createBrowserRouter([
  {
    path: '/',
    Component: Estrutura,
    children: [
      { index: true, Component: Inicio },
      { path: ROTAS.pedido.slice(1), lazy: () => import('./paginas/pedido').then((m) => ({ Component: m.default })) },
      { path: ROTAS.reservar.slice(1), lazy: () => import('./paginas/reservar').then((m) => ({ Component: m.default })) },
      { path: ROTAS.contactos.slice(1), lazy: () => import('./paginas/contactos').then((m) => ({ Component: m.default })) },
      { path: '*', lazy: () => import('./paginas/nao-encontrada').then((m) => ({ Component: m.default })) },
    ],
  },
])
