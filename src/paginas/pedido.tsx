import {
  RiArrowLeftLine,
  RiFileCopyLine,
  RiHomeHeartLine,
  RiShoppingBag3Line,
  RiStore2Line,
  RiWhatsappFill,
} from '@remixicon/react'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { acoesCarrinho, useResumoPedido } from '../armazens/carrinho'
import { guardarCliente, lerCliente } from '../armazens/cliente'
import { ListaPedido, TotalPedido } from '../componentes/painel-pedido'
import { SeletorPrazo } from '../componentes/seletor-prazo'
import { Botao } from '../componentes/ui/botao'
import { botaoVariantes } from '../componentes/ui/botao-variantes'
import { AreaTexto, Campo, Entrada, OpcaoRadio } from '../componentes/ui/campos'
import { EMPRESA, ROTAS } from '../configuracao/empresa'
import { rotuloDias } from '../dados/catalogo'
import { useDocumento } from '../hooks/usar-documento'
import { ehTelefoneAngolano, gerarReferencia, hojeISO } from '../lib/formatar'
import { montarMensagemPedido, type DadosPedido } from '../lib/mensagens'
import { abrirWhatsapp, copiarTexto, ligacaoWhatsapp } from '../lib/whatsapp'

type Formulario = DadosPedido

export default function Pedido() {
  useDocumento({
    titulo: 'O seu pedido',
    descricao: 'Reveja as peças escolhidas e envie o pedido à Lavandaria Stella pelo WhatsApp.',
    noindex: true,
  })

  const resumo = useResumoPedido()
  const [copiado, setCopiado] = useState<'sim' | 'erro' | null>(null)
  const [enviado, setEnviado] = useState<{ referencia: string; mensagem: string } | null>(null)
  const guardado = useMemo(lerCliente, [])
  const hoje = useMemo(() => hojeISO(), [])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Formulario>({
    mode: 'onTouched',
    defaultValues: {
      nome: guardado.nome,
      telefone: guardado.telefone,
      modalidade: 'loja',
      morada: guardado.morada,
      dataPretendida: '',
      notas: '',
    },
  })

  const modalidade = watch('modalidade')

  if (resumo.totalPecas === 0 && !enviado) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-primaria-suave text-primaria-suave-texto">
          <RiShoppingBag3Line aria-hidden="true" className="size-8" />
        </span>
        <h1 className="mt-4 text-2xl font-extrabold">O seu pedido está vazio</h1>
        <p className="mt-2 text-suave-texto">Escolha as peças no catálogo para calcularmos o valor.</p>
        <Link to={ROTAS.inicio} viewTransition className={botaoVariantes({ tamanho: 'lg', className: 'mt-6' })}>
          Ver catálogo
        </Link>
      </div>
    )
  }

  function enviar(dados: Formulario) {
    guardarCliente({ nome: dados.nome.trim(), telefone: dados.telefone.trim(), morada: dados.morada.trim() })
    const referencia = gerarReferencia()
    const mensagem = montarMensagemPedido(dados, resumo, resumo.prazo, referencia)
    abrirWhatsapp(mensagem)
    setEnviado({ referencia, mensagem })
  }

  async function copiar(texto: string) {
    setCopiado((await copiarTexto(texto)) ? 'sim' : 'erro')
    window.setTimeout(() => setCopiado(null), 3000)
  }

  if (enviado) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-whatsapp text-whatsapp-texto">
          <RiWhatsappFill aria-hidden="true" className="size-8" />
        </span>
        <h1 className="mt-4 text-2xl font-extrabold">Falta só enviar no WhatsApp</h1>
        <p className="mt-2 text-suave-texto">
          Abrimos a conversa com o seu pedido já escrito. Toque em <strong className="text-texto">Enviar</strong> no
          WhatsApp para o concluir. Referência: <strong className="text-texto">{enviado.referencia}</strong>.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <a
            href={ligacaoWhatsapp(enviado.mensagem)}
            target="_blank"
            rel="noopener noreferrer"
            className={botaoVariantes({ variante: 'whatsapp', tamanho: 'lg', larguraTotal: true })}
          >
            <RiWhatsappFill aria-hidden="true" />
            Abrir o WhatsApp outra vez
          </a>
          <Botao variante="contorno" tamanho="lg" larguraTotal onClick={() => void copiar(enviado.mensagem)}>
            <RiFileCopyLine aria-hidden="true" />
            Copiar mensagem
          </Botao>
          <p role="status" className="min-h-5 text-sm text-suave-texto">
            {copiado === 'sim' && 'Mensagem copiada.'}
            {copiado === 'erro' && 'Não foi possível copiar. Selecione o texto manualmente.'}
          </p>
          <Link
            to={ROTAS.inicio}
            viewTransition
            onClick={acoesCarrinho.limpar}
            className={botaoVariantes({ variante: 'fantasma', larguraTotal: true })}
          >
            Concluir e começar um novo pedido
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:py-10">
      <Link to={ROTAS.inicio} viewTransition className="mb-4 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-primaria">
        <RiArrowLeftLine aria-hidden="true" className="size-5" />
        Voltar ao catálogo
      </Link>
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight">O seu pedido</h1>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
        <section aria-labelledby="titulo-pecas" className="rounded-2xl border border-borda bg-cartao p-4 shadow-cartao">
          <h2 id="titulo-pecas" className="mb-3 text-lg font-bold">Peças escolhidas</h2>
          <SeletorPrazo className="mb-4" />
          <ListaPedido resumo={resumo} />
          <TotalPedido resumo={resumo} />
          <p className="mt-3 text-xs text-suave-texto">
            Prazo mais longo do pedido: {rotuloDias(resumo.diasMaximos).toLowerCase()}. Valor sujeito a confirmação
            após a verificação das peças.
          </p>
        </section>

        <form
          onSubmit={handleSubmit(enviar)}
          noValidate
          aria-labelledby="titulo-dados"
          className="flex flex-col gap-4 rounded-2xl border border-borda bg-cartao p-4 shadow-cartao"
        >
          <h2 id="titulo-dados" className="text-lg font-bold">Os seus dados</h2>

          <Campo rotulo="Nome" erro={errors.nome?.message}>
            {(a) => (
              <Entrada
                {...a}
                autoComplete="name"
                maxLength={60}
                placeholder="O seu nome"
                {...register('nome', {
                  required: 'Indique o seu nome.',
                  validate: (v) => v.trim().length >= 2 || 'O nome é demasiado curto.',
                })}
              />
            )}
          </Campo>

          <Campo rotulo="Telefone" ajuda="Número com 9 dígitos, ex.: 923 456 789." erro={errors.telefone?.message}>
            {(a) => (
              <Entrada
                {...a}
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                maxLength={20}
                placeholder="9XX XXX XXX"
                {...register('telefone', {
                  required: 'Indique o seu telefone.',
                  validate: (v) => ehTelefoneAngolano(v) || 'Número inválido. Use 9 dígitos começados por 9.',
                })}
              />
            )}
          </Campo>

          <fieldset className="min-w-0">
            <legend className="mb-1.5 text-sm font-semibold">Como quer tratar do pedido?</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              <OpcaoRadio
                titulo="Levo à lavandaria"
                descricao="Entrego e levanto as peças em Viana."
                icone={<RiStore2Line aria-hidden="true" />}
                value="loja"
                {...register('modalidade')}
              />
              <OpcaoRadio
                titulo="Recolha ao domicílio"
                descricao="Combinamos a recolha e a entrega."
                icone={<RiHomeHeartLine aria-hidden="true" />}
                value="recolha"
                {...register('modalidade')}
              />
            </div>
          </fieldset>

          {modalidade === 'recolha' && (
            <Campo rotulo="Morada para recolha" ajuda="Bairro, rua e ponto de referência." erro={errors.morada?.message}>
              {(a) => (
                <AreaTexto
                  {...a}
                  autoComplete="street-address"
                  maxLength={160}
                  rows={2}
                  placeholder="Ex.: Bairro Zango, rua 5, junto à escola"
                  {...register('morada', {
                    validate: (v) => modalidade !== 'recolha' || v.trim().length >= 6 || 'Indique a morada para a recolha.',
                  })}
                />
              )}
            </Campo>
          )}

          <Campo rotulo="Data pretendida" opcional erro={errors.dataPretendida?.message}>
            {(a) => (
              <Entrada
                {...a}
                type="date"
                min={hoje}
                {...register('dataPretendida', {
                  validate: (v) => !v || v >= hoje || 'Escolha uma data a partir de hoje.',
                })}
              />
            )}
          </Campo>

          <Campo rotulo="Observações" opcional ajuda="Manchas, peças delicadas, cuidados especiais…">
            {(a) => <AreaTexto {...a} maxLength={300} rows={3} {...register('notas')} />}
          </Campo>

          <Botao type="submit" variante="whatsapp" tamanho="lg" larguraTotal>
            <RiWhatsappFill aria-hidden="true" />
            Enviar pedido por WhatsApp
          </Botao>
          <p className="text-center text-xs text-suave-texto">
            Abre o WhatsApp com a mensagem pronta para {EMPRESA.nome}. Os dados ficam só no seu telemóvel.
          </p>
        </form>
      </div>
    </div>
  )
}
