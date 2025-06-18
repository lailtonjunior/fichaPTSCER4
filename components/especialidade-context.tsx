"use client"

import { createContext, useContext, useState, useRef, useCallback, type ReactNode, type RefObject } from "react"

// Definição dos tipos de especialidades disponíveis
export type Especialidade =
  | "todas"
  | "fisioterapia"
  | "terapia_ocupacional"
  | "fonoaudiologia"
  | "psicologia"
  | "assistencia_social"
  | "enfermagem"
  | "medicina"
  | "nutricao"
  | "pedagogia"
  | "educador_fisico"
  | "musicoterapia"

// Interface do contexto
interface EspecialidadeContextType {
  especialidadeSelecionada: Especialidade
  setEspecialidadeSelecionada: (especialidade: Especialidade) => void
  isCampoRelevante: (campo: string, especialidades: Especialidade[]) => boolean
  registrarCampoRef: (campo: string, ref: RefObject<HTMLDivElement> | null) => void
  navegarParaCampoRelevante: (direcao: "proximo" | "anterior") => void
  totalCamposRelevantes: number
  campoRelevanteSelecionado: number
}

// Criação do contexto
const EspecialidadeContext = createContext<EspecialidadeContextType | undefined>(undefined)

// Mapeamento de campos para especialidades
export const camposEspecialidades: Record<string, Especialidade[]> = {
  // Identificação do Paciente
  nome: ["todas"],
  dataNascimento: ["todas"],
  sexo: ["todas"],
  endereco: ["todas"],
  contato: ["todas"],
  diagnostico: ["todas"],
  motivoEncaminhamento: ["todas"],

  // Histórico Médico
  dataInicioSintomas: ["medicina", "fisioterapia", "enfermagem"],
  historicoCondicaoAtual: ["todas"],
  temDoencaPrevia: ["medicina", "enfermagem"],
  hipertensao: ["medicina", "enfermagem"],
  diabetes: ["medicina", "enfermagem", "nutricao"],
  cardiopatia: ["medicina", "fisioterapia", "enfermagem"],
  doencaRespiratoria: ["medicina", "fisioterapia", "enfermagem"],
  doencaReumatica: ["medicina", "fisioterapia"],
  doencaNeurologica: ["medicina", "fisioterapia", "terapia_ocupacional", "fonoaudiologia"],
  outrasDoencas: ["medicina", "enfermagem"],
  medicamentosAtuais: ["medicina", "enfermagem"],
  cirurgiasRealizadas: ["medicina", "fisioterapia"],
  historicoFamiliar: ["medicina", "psicologia"],
  nivelDor: ["fisioterapia", "medicina", "enfermagem"],
  localizacaoDor: ["fisioterapia", "medicina"],
  tratamentosAnteriores: ["todas"],

  // Percepção do Paciente
  dificuldadesRelatadas: ["todas"],
  expectativasTratamento: ["todas"],
  metasImportantes: ["todas"],

  // Atividade e Participação
  mobilidadeLocomocao: ["fisioterapia", "terapia_ocupacional", "educador_fisico", "medicina"],
  autocuidado: ["terapia_ocupacional", "enfermagem", "fisioterapia"],
  comunicacaoInteracao: ["fonoaudiologia", "psicologia", "terapia_ocupacional", "musicoterapia"],
  vidaDomestica: ["terapia_ocupacional", "assistencia_social", "psicologia"],
  educacaoTrabalhoLazer: ["terapia_ocupacional", "psicologia", "pedagogia", "assistencia_social", "educador_fisico"],
  principaisBarreiras: ["todas"],
  principaisPotencialidades: ["todas"],

  // Fatores Ambientais
  residenciaAdaptada: ["terapia_ocupacional", "fisioterapia", "assistencia_social"],
  dificuldadeTransporte: ["assistencia_social", "terapia_ocupacional", "fisioterapia"],
  barreirasComTec: ["fonoaudiologia", "terapia_ocupacional", "pedagogia"],
  faltaApoioFamiliar: ["assistencia_social", "psicologia", "enfermagem"],
  barreirasAtitudinais: ["psicologia", "assistencia_social", "pedagogia"],
  presencaCuidador: ["assistencia_social", "enfermagem", "psicologia"],
  usoTecnologia: ["terapia_ocupacional", "fisioterapia", "fonoaudiologia"],
  acessoBeneficios: ["assistencia_social"],
  boaCompreensao: ["fonoaudiologia", "psicologia", "pedagogia", "enfermagem"],

  // Funções e Estruturas
  sistemasComprometidos: ["medicina", "fisioterapia", "enfermagem"],
  forcaTonosCoord: ["fisioterapia", "terapia_ocupacional", "educador_fisico"],
  presencaDor: ["fisioterapia", "medicina", "enfermagem"],
  deformidades: ["fisioterapia", "medicina", "terapia_ocupacional"],
  controlePostural: ["fisioterapia", "terapia_ocupacional", "educador_fisico"],
  funcoesSensoriais: ["terapia_ocupacional", "fonoaudiologia", "fisioterapia"],
  funcoesCognitivas: ["psicologia", "terapia_ocupacional", "fonoaudiologia", "pedagogia", "musicoterapia"],

  // Marcha e Equilíbrio
  padraoDeMarchaGeral: ["fisioterapia", "medicina"],
  usaDispositivo: ["fisioterapia", "terapia_ocupacional"],
  bengala: ["fisioterapia", "terapia_ocupacional"],
  muleta: ["fisioterapia", "terapia_ocupacional"],
  andador: ["fisioterapia", "terapia_ocupacional"],
  cadeiraRodas: ["fisioterapia", "terapia_ocupacional"],
  outrosDispositivos: ["fisioterapia", "terapia_ocupacional"],
  avaliacaoEquilibrio: ["fisioterapia", "educador_fisico"],
  equilibrioEstatico: ["fisioterapia", "educador_fisico"],
  equilibrioDinamico: ["fisioterapia", "educador_fisico"],
  riscoDeCaidas: ["fisioterapia", "enfermagem", "terapia_ocupacional"],
  historicoQuedas: ["fisioterapia", "enfermagem", "terapia_ocupacional"],
  testesEquilibrio: ["fisioterapia", "educador_fisico"],

  // Avaliação de AVDs
  alimentacao: ["terapia_ocupacional", "enfermagem", "fonoaudiologia"],
  higienePessoal: ["terapia_ocupacional", "enfermagem"],
  banho: ["terapia_ocupacional", "enfermagem", "fisioterapia"],
  vestirParteSuperior: ["terapia_ocupacional", "fisioterapia"],
  vestirParteInferior: ["terapia_ocupacional", "fisioterapia"],
  usoSanitario: ["terapia_ocupacional", "enfermagem", "fisioterapia"],
  controleBexiga: ["enfermagem", "medicina"],
  controleIntestino: ["enfermagem", "medicina"],
  adaptacoesAVDs: ["terapia_ocupacional", "fisioterapia"],

  // Fatores Pessoais
  idadeGeneroEscolaridade: ["todas"],
  ocupacaoPapelSocial: ["psicologia", "terapia_ocupacional", "assistencia_social"],
  condicaoSocioeconomica: ["assistencia_social"],
  habitosEstiloVida: ["nutricao", "educador_fisico", "enfermagem", "medicina"],
  crencasEspiritualidade: ["psicologia", "assistencia_social"],
  motivacaoEngajamento: ["psicologia", "fisioterapia", "terapia_ocupacional", "musicoterapia"],
  expectativasPrioridades: ["todas"],

  // Avaliação Interdisciplinar
  fisioterapiaImpressoes: ["fisioterapia"],
  fisioterapiaMetas: ["fisioterapia"],
  terapiaOcupacionalImpressoes: ["terapia_ocupacional"],
  terapiaOcupacionalMetas: ["terapia_ocupacional"],
  fonoaudiologiaImpressoes: ["fonoaudiologia"],
  fonoaudiologiaMetas: ["fonoaudiologia"],
  psicologiaImpressoes: ["psicologia"],
  psicologiaMetas: ["psicologia"],
  servicoSocialImpressoes: ["assistencia_social"],
  servicoSocialMetas: ["assistencia_social"],
  enfermagemMedicinaImpressoes: ["enfermagem", "medicina"],
  enfermagemMedicinaMetas: ["enfermagem", "medicina"],

  // Objetivos PTS
  curtoPrazo: ["todas"],
  medioPrazo: ["todas"],
  longoPrazo: ["todas"],

  // Planejamento Terapêutico
  frequenciaAtendimentos: ["todas"],
  metodosEstrategias: ["todas"],
  escalasTestesAplicados: ["todas"],
  dataReavaliacao: ["todas"],
  registroEvolucao: ["todas"],

  // Encaminhamentos
  reabilitacaoAuditiva: ["fonoaudiologia", "medicina"],
  reabilitacaoIntelectual: ["psicologia", "pedagogia", "medicina"],
  reabilitacaoVisual: ["terapia_ocupacional", "medicina"],
  dispensacaoOPM: ["fisioterapia", "terapia_ocupacional", "medicina"],
  encaminhamentoSaude: ["medicina", "enfermagem"],
  encaminhamentoAssistencia: ["assistencia_social"],
  encaminhamentoEducacao: ["pedagogia", "psicologia"],
  encaminhamentoOutros: ["todas"],
  outrosEncaminhamentos: ["todas"],

  // Critérios de Alta
  criteriosAlta: ["todas"],
  registroAlta: ["todas"],
}

// Provider do contexto
export function EspecialidadeProvider({ children }: { children: ReactNode }) {
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState<Especialidade>("todas")
  const [campoRelevanteSelecionado, setCampoRelevanteSelecionado] = useState(0)
  const camposRefsMap = useRef<Map<string, RefObject<HTMLDivElement>>>(new Map())
  const camposRelevantesOrdenados = useRef<string[]>([])

  // Função para verificar se um campo é relevante para a especialidade selecionada
  const isCampoRelevante = useCallback(
    (campo: string, especialidades: Especialidade[]) => {
      if (especialidadeSelecionada === "todas") return true
      return especialidades.includes(especialidadeSelecionada) || especialidades.includes("todas")
    },
    [especialidadeSelecionada],
  )

  // Função para registrar a referência de um campo
  const registrarCampoRef = useCallback((campo: string, ref: RefObject<HTMLDivElement> | null) => {
    if (ref) {
      camposRefsMap.current.set(campo, ref)
    } else {
      camposRefsMap.current.delete(campo)
    }

    // Atualizar a lista ordenada de campos relevantes
    const camposRelevantes: string[] = []

    // Ordenar os campos conforme a ordem em que aparecem no DOM
    const todosElementos = Array.from(document.querySelectorAll('[id^="campo-"]'))

    todosElementos.forEach((elemento) => {
      const id = elemento.id.replace("campo-", "")
      if (camposRefsMap.current.has(id)) {
        camposRelevantes.push(id)
      }
    })

    camposRelevantesOrdenados.current = camposRelevantes
  }, [])

  // Função para navegar para o próximo/anterior campo relevante
  const navegarParaCampoRelevante = useCallback(
    (direcao: "proximo" | "anterior") => {
      const totalCampos = camposRelevantesOrdenados.current.length
      if (totalCampos === 0) return

      let novoIndice: number

      if (direcao === "proximo") {
        novoIndice = (campoRelevanteSelecionado + 1) % totalCampos
      } else {
        novoIndice = (campoRelevanteSelecionado - 1 + totalCampos) % totalCampos
      }

      const campoDest = camposRelevantesOrdenados.current[novoIndice]
      const refCampo = camposRefsMap.current.get(campoDest)

      if (refCampo && refCampo.current) {
        refCampo.current.scrollIntoView({ behavior: "smooth", block: "center" })
        setCampoRelevanteSelecionado(novoIndice)
      }
    },
    [campoRelevanteSelecionado],
  )

  // Calcular o total de campos relevantes
  const totalCamposRelevantes = camposRelevantesOrdenados.current.length

  return (
    <EspecialidadeContext.Provider
      value={{
        especialidadeSelecionada,
        setEspecialidadeSelecionada,
        isCampoRelevante,
        registrarCampoRef,
        navegarParaCampoRelevante,
        totalCamposRelevantes,
        campoRelevanteSelecionado,
      }}
    >
      {children}
    </EspecialidadeContext.Provider>
  )
}

// Hook para usar o contexto
export function useEspecialidade() {
  const context = useContext(EspecialidadeContext)
  if (context === undefined) {
    throw new Error("useEspecialidade deve ser usado dentro de um EspecialidadeProvider")
  }
  return context
}
