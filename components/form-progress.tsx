"use client"

import { useEffect, useState, useCallback } from "react"
import { useFormContext } from "react-hook-form"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, HelpCircle } from "lucide-react"
import { useLayoutContext } from "@/components/layout-context"

// Definição das seções do formulário e seus campos
const FORM_SECTIONS = [
  {
    id: "identificacao",
    label: "1. Identificação",
    fields: ["nome", "dataNascimento", "sexo", "endereco", "contato", "diagnostico", "motivoEncaminhamento"],
    requiredFields: ["nome", "diagnostico"],
  },
  {
    id: "historico",
    label: "2. Histórico Médico",
    fields: [
      "dataInicioSintomas",
      "historicoCondicaoAtual",
      "temDoencaPrevia",
      "medicamentosAtuais",
      "cirurgiasRealizadas",
      "historicoFamiliar",
      "nivelDor",
      "localizacaoDor",
      "tratamentosAnteriores",
    ],
    requiredFields: ["historicoCondicaoAtual"],
  },
  {
    id: "percepcao",
    label: "3. Percepção",
    fields: ["dificuldadesRelatadas", "expectativasTratamento", "metasImportantes"],
    requiredFields: ["dificuldadesRelatadas"],
  },
  {
    id: "atividade",
    label: "4. Atividade",
    fields: [
      "mobilidadeLocomocao",
      "autocuidado",
      "comunicacaoInteracao",
      "vidaDomestica",
      "educacaoTrabalhoLazer",
      "principaisBarreiras",
      "principaisPotencialidades",
    ],
    requiredFields: ["mobilidadeLocomocao", "autocuidado"],
  },
  {
    id: "ambientais",
    label: "5. Fatores Ambientais",
    fields: [
      "residenciaAdaptada",
      "dificuldadeTransporte",
      "barreirasComTec",
      "faltaApoioFamiliar",
      "barreirasAtitudinais",
      "presencaCuidador",
      "usoTecnologia",
      "acessoBeneficios",
      "boaCompreensao",
    ],
    requiredFields: [],
  },
  {
    id: "funcoes",
    label: "6. Funções e Estruturas",
    fields: [
      "sistemasComprometidos",
      "forcaTonosCoord",
      "presencaDor",
      "deformidades",
      "controlePostural",
      "funcoesSensoriais",
      "funcoesCognitivas",
    ],
    requiredFields: ["sistemasComprometidos"],
  },
  {
    id: "marcha",
    label: "6.1. Marcha e Equilíbrio",
    fields: [
      "padraoDeMarchaGeral",
      "usaDispositivo",
      "avaliacaoEquilibrio",
      "equilibrioEstatico",
      "equilibrioDinamico",
      "riscoDeCaidas",
      "historicoQuedas",
      "testesEquilibrio",
    ],
    requiredFields: [],
  },
  {
    id: "avds",
    label: "6.2. AVDs",
    fields: [
      "alimentacao",
      "higienePessoal",
      "banho",
      "vestirParteSuperior",
      "vestirParteInferior",
      "usoSanitario",
      "controleBexiga",
      "controleIntestino",
      "adaptacoesAVDs",
    ],
    requiredFields: [],
  },
  {
    id: "pessoais",
    label: "7. Fatores Pessoais",
    fields: [
      "idadeGeneroEscolaridade",
      "ocupacaoPapelSocial",
      "condicaoSocioeconomica",
      "habitosEstiloVida",
      "crencasEspiritualidade",
      "motivacaoEngajamento",
      "expectativasPrioridades",
    ],
    requiredFields: [],
  },
  {
    id: "avaliacao",
    label: "8. Avaliação",
    fields: [
      "fisioterapiaImpressoes",
      "fisioterapiaMetas",
      "terapiaOcupacionalImpressoes",
      "terapiaOcupacionalMetas",
      "fonoaudiologiaImpressoes",
      "fonoaudiologiaMetas",
      "psicologiaImpressoes",
      "psicologiaMetas",
      "servicoSocialImpressoes",
      "servicoSocialMetas",
      "enfermagemMedicinaImpressoes",
      "enfermagemMedicinaMetas",
    ],
    requiredFields: [],
  },
  {
    id: "objetivos",
    label: "9. Objetivos",
    fields: ["curtoPrazo", "medioPrazo", "longoPrazo"],
    requiredFields: ["curtoPrazo"],
  },
  {
    id: "planejamento",
    label: "10. Planejamento",
    fields: [
      "frequenciaAtendimentos",
      "metodosEstrategias",
      "escalasTestesAplicados",
      "dataReavaliacao",
      "registroEvolucao",
    ],
    requiredFields: ["frequenciaAtendimentos"],
  },
  {
    id: "encaminhamentos",
    label: "11. Encaminhamentos",
    fields: [
      "reabilitacaoAuditiva",
      "reabilitacaoIntelectual",
      "reabilitacaoVisual",
      "dispensacaoOPM",
      "encaminhamentoSaude",
      "encaminhamentoAssistencia",
      "encaminhamentoEducacao",
      "encaminhamentoOutros",
      "outrosEncaminhamentos",
    ],
    requiredFields: [],
  },
  {
    id: "criterios",
    label: "12. Critérios de Alta",
    fields: ["criteriosAlta", "registroAlta"],
    requiredFields: [],
  },
]

// Total de campos no formulário
const TOTAL_FIELDS = FORM_SECTIONS.reduce((acc, section) => acc + section.fields.length, 0)
const TOTAL_REQUIRED_FIELDS = FORM_SECTIONS.reduce((acc, section) => acc + section.requiredFields.length, 0)

export default function FormProgress({
  activeTab,
  onTabChange,
}: {
  activeTab: string
  onTabChange: (tab: string) => void
}) {
  const { watch } = useFormContext()
  const { layout } = useLayoutContext()
  const [progress, setProgress] = useState(0)
  const [sectionProgress, setSectionProgress] = useState<Record<string, number>>({})
  const [filledFields, setFilledFields] = useState(0)
  const [filledRequiredFields, setFilledRequiredFields] = useState(0)

  // Função para verificar se um campo está preenchido
  const isFieldFilled = useCallback((value: any): boolean => {
    if (value === undefined || value === null) return false
    if (typeof value === "string") return value.trim() !== ""
    if (typeof value === "boolean") return value
    if (typeof value === "number") return true
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === "object") return Object.keys(value).length > 0
    return false
  }, [])

  // Usar um callback para calcular o progresso
  const calculateProgress = useCallback(() => {
    // Observar todos os campos do formulário
    const formValues = watch()

    let totalFilled = 0
    let totalRequiredFilled = 0
    const newSectionProgress: Record<string, number> = {}

    FORM_SECTIONS.forEach((section) => {
      let sectionFilled = 0

      section.fields.forEach((field) => {
        // Verificar se o campo está preenchido
        if (isFieldFilled(formValues[field])) {
          totalFilled++
          sectionFilled++

          // Verificar se é um campo obrigatório
          if (section.requiredFields.includes(field)) {
            totalRequiredFilled++
          }
        }
      })

      // Calcular progresso da seção
      const sectionFieldCount = section.fields.length
      newSectionProgress[section.id] = sectionFieldCount > 0 ? Math.round((sectionFilled / sectionFieldCount) * 100) : 0
    })

    // Calcular progresso geral
    // Damos mais peso para campos obrigatórios (70%) e o restante para campos opcionais (30%)
    const requiredProgress = TOTAL_REQUIRED_FIELDS > 0 ? totalRequiredFilled / TOTAL_REQUIRED_FIELDS : 0
    const optionalProgress = TOTAL_FIELDS > 0 ? totalFilled / TOTAL_FIELDS : 0

    const weightedProgress =
      TOTAL_REQUIRED_FIELDS > 0
        ? Math.round((requiredProgress * 0.7 + optionalProgress * 0.3) * 100)
        : Math.round(optionalProgress * 100)

    return {
      progress: weightedProgress,
      sectionProgress: newSectionProgress,
      filledFields: totalFilled,
      filledRequiredFields: totalRequiredFilled,
    }
  }, [watch, isFieldFilled])

  // Atualizar o progresso quando os valores do formulário mudarem
  useEffect(() => {
    // Registrar para todos os campos do formulário
    const subscription = watch(() => {
      const result = calculateProgress()
      setProgress(result.progress)
      setSectionProgress(result.sectionProgress)
      setFilledFields(result.filledFields)
      setFilledRequiredFields(result.filledRequiredFields)
    })

    // Calcular o progresso inicial
    const result = calculateProgress()
    setProgress(result.progress)
    setSectionProgress(result.sectionProgress)
    setFilledFields(result.filledFields)
    setFilledRequiredFields(result.filledRequiredFields)

    // Limpar a assinatura quando o componente for desmontado
    return () => subscription.unsubscribe()
  }, [watch, calculateProgress])

  // Obter status da seção
  const getSectionStatus = (sectionId: string) => {
    const section = FORM_SECTIONS.find((s) => s.id === sectionId)
    if (!section) return "empty"

    const sectionProgressValue = sectionProgress[sectionId] || 0

    if (sectionProgressValue === 100) return "complete"
    if (sectionProgressValue > 0) return "partial"
    return "empty"
  }

  // Obter cor da seção baseada no status
  const getSectionColor = (sectionId: string) => {
    const status = getSectionStatus(sectionId)
    switch (status) {
      case "complete":
        return "text-green-500"
      case "partial":
        return "text-amber-500"
      default:
        return "text-muted-foreground"
    }
  }

  // Obter ícone da seção baseado no status
  const getSectionIcon = (sectionId: string) => {
    const status = getSectionStatus(sectionId)
    switch (status) {
      case "complete":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "partial":
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      default:
        return <HelpCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <Card className="mb-6 border border-muted bg-card">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-base mb-2">Progresso do Formulário</h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-full max-w-md">
                <Progress value={progress} className="h-2.5" aria-label="Progresso do formulário" />
              </div>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {filledFields} de {TOTAL_FIELDS} campos preenchidos
              {TOTAL_REQUIRED_FIELDS > 0 && (
                <>
                  {" "}
                  ({filledRequiredFields} de {TOTAL_REQUIRED_FIELDS} campos obrigatórios)
                </>
              )}
            </p>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs">Completo</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-xs">Parcial</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
                <span className="text-xs">Vazio</span>
              </div>
            </div>
          </div>

          {/* Removida a navegação duplicada que estava aparecendo no quadro vermelho */}
        </div>
      </CardContent>
    </Card>
  )
}
