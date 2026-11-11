import { RiCalendarCheckLine, RiHomeHeartLine, RiStore2Line, RiWhatsappFill } from '@remixicon/react'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { guardarCliente, lerCliente } from '../armazens/cliente'
import { Botao } from '../componentes/ui/botao'
import { AreaTexto, Campo, Entrada, OpcaoRadio } from '../componentes/ui/campos'
import { EMPRESA } from '../configuracao/empresa'
import { useDocumento } from '../hooks/usar-documento'
import { ehTelefoneAngolano, gerarReferencia, hojeISO } from '../lib/formatar'
import { montarMensagemReserva, type DadosReserva } from '../lib/mensagens'
import { abrirWhatsapp } from '../lib/whatsapp'

export default function Reservar() {
  useDocumento({
    titulo: 'Reservar recolha ou entrega',
    descricao:
      'Marque a recolha ao domicílio ou a entrega das suas roupas na Lavandaria Stella, em Viana, Luanda, e confirme tudo pelo WhatsApp.',
  })

  const guardado = useMemo(lerCliente, [])
  const hoje = useMemo(() => hojeISO(), [])
  const [referencia, setReferencia] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DadosReserva>({
    mode: 'onTouched',
    defaultValues: {
      nome: guardado.nome,
      telefone: guardado.telefone,
      tipo: 'recolha',
      data: '',
      periodo: 'manha',
      morada: guardado.morada,
      descricao: '',
      notas: '',
    },
  })

  const tipo = watch('tipo')

  function enviar(dados: DadosReserva) {
    guardarCliente({ nome: dados.nome.trim(), telefone: dados.telefone.trim(), morada: dados.morada.trim() })
    const ref = gerarReferencia()
    abrirWhatsapp(montarMensagemReserva(dados, ref))
    setReferencia(ref)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 lg:py-10">
      <div className="mb-6 flex items-start gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primaria text-primaria-texto">
          <RiCalendarCheckLine aria-hidden="true" className="size-6" />
        </span>
        <div className="min-w-0">
          <h1 className="text-3xl font-extrabold tracking-tight">Reservar</h1>
          <p className="mt-1 text-suave-texto">Marque o dia e o período. Confirmamos consigo pelo WhatsApp.</p>
        </div>
      </div>

      {referencia && (
        <p role="status" className="mb-4 rounded-xl bg-primaria-suave p-3.5 text-sm text-primaria-suave-texto">
          Abrimos o WhatsApp com a sua reserva (ref. <strong>{referencia}</strong>). Toque em <strong>Enviar</strong> para a concluir.
        </p>
      )}

      <form
        onSubmit={handleSubmit(enviar)}
        noValidate
        aria-label="Formulário de reserva"
        className="flex flex-col gap-4 rounded-2xl border border-borda bg-cartao p-4 shadow-cartao sm:p-6"
      >
        <fieldset className="min-w-0">
          <legend className="mb-1.5 text-sm font-semibold">O que pretende?</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            <OpcaoRadio
              titulo="Recolha ao domicílio"
              descricao="Vamos buscar as peças a sua casa."
              icone={<RiHomeHeartLine aria-hidden="true" />}
              value="recolha"
              {...register('tipo')}
            />
            <OpcaoRadio
              titulo="Vou entregar na lavandaria"
              descricao="Marcamos a hora para o atender."
              icone={<RiStore2Line aria-hidden="true" />}
              value="levar"
              {...register('tipo')}
            />
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <Campo rotulo="Data" erro={errors.data?.message}>
            {(a) => (
              <Entrada
                {...a}
                type="date"
                min={hoje}
                {...register('data', {
                  required: 'Escolha a data.',
                  validate: (v) => v >= hoje || 'Escolha uma data a partir de hoje.',
                })}
              />
            )}
          </Campo>

          <fieldset className="min-w-0">
            <legend className="mb-1.5 text-sm font-semibold">Período</legend>
            <div className="grid grid-cols-2 gap-2">
              <OpcaoRadio titulo="Manhã" value="manha" {...register('periodo')} />
              <OpcaoRadio titulo="Tarde" value="tarde" {...register('periodo')} />
            </div>
          </fieldset>
        </div>

        {tipo === 'recolha' && (
          <Campo rotulo="Morada para recolha" ajuda="Bairro, rua e ponto de referência." erro={errors.morada?.message}>
            {(a) => (
              <AreaTexto
                {...a}
                autoComplete="street-address"
                maxLength={160}
                rows={2}
                {...register('morada', {
                  validate: (v) => tipo !== 'recolha' || v.trim().length >= 6 || 'Indique a morada para a recolha.',
                })}
              />
            )}
          </Campo>
        )}

        <Campo rotulo="O que vamos tratar?" ajuda="Ex.: 2 fatos, 1 vestido de noiva e 4 camisas." erro={errors.descricao?.message}>
          {(a) => (
            <AreaTexto
              {...a}
              maxLength={400}
              rows={3}
              {...register('descricao', {
                required: 'Descreva brevemente as peças.',
                validate: (v) => v.trim().length >= 3 || 'Descreva brevemente as peças.',
              })}
            />
          )}
        </Campo>

        <div className="grid gap-4 sm:grid-cols-2">
          <Campo rotulo="Nome" erro={errors.nome?.message}>
            {(a) => (
              <Entrada
                {...a}
                autoComplete="name"
                maxLength={60}
                {...register('nome', {
                  required: 'Indique o seu nome.',
                  validate: (v) => v.trim().length >= 2 || 'O nome é demasiado curto.',
                })}
              />
            )}
          </Campo>
          <Campo rotulo="Telefone" erro={errors.telefone?.message}>
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
        </div>

        <Campo rotulo="Observações" opcional>
          {(a) => <AreaTexto {...a} maxLength={300} rows={2} {...register('notas')} />}
        </Campo>

        <Botao type="submit" variante="whatsapp" tamanho="lg" larguraTotal>
          <RiWhatsappFill aria-hidden="true" />
          Reservar por WhatsApp
        </Botao>
        <p className="text-center text-xs text-suave-texto">
          A reserva só fica confirmada quando a {EMPRESA.nome} responder no WhatsApp.
        </p>
      </form>
    </div>
  )
}
