// Modelo de dados para análise MIF
export interface MIFAnalysisResult {
  score: number
  confidence: number
  explanation: string
  keywords: string[]
  alternativeScores: Array<{
    score: number
    probability: number
  }>
}

// Modelo de dados para histórico de análises
export interface MIFAnalysisHistory {
  fieldText: string
  suggestedScore: number
  selectedScore: number
  fieldName: string
  timestamp: number
}

// Definição dos níveis MIF e suas características
export const MIF_LEVELS = [
  {
    value: 1,
    label: "Dependência Total (Assistência Total)",
    keywords: [
      "não consegue",
      "incapaz",
      "totalmente dependente",
      "assistência total",
      "sem participação",
      "0%",
      "nenhuma capacidade",
      "completamente dependente",
      "necessita assistência total",
      "não realiza",
      "não executa",
    ],
    negativeKeywords: ["independente", "sozinho", "sem ajuda", "autonomia"],
    description:
      "Paciente realiza menos de 25% do esforço necessário. Requer assistência total ou a tarefa não é realizada.",
  },
  {
    value: 2,
    label: "Dependência Máxima (Assistência Máxima)",
    keywords: [
      "muita ajuda",
      "assistência máxima",
      "mínima participação",
      "pouco contribui",
      "25%",
      "grande dificuldade",
      "muito limitado",
      "necessita muita ajuda",
      "realiza pequena parte",
      "contribuição mínima",
      "esforço mínimo",
    ],
    negativeKeywords: ["independente", "sozinho", "sem ajuda", "supervisão apenas"],
    description: "Paciente realiza entre 25% e 49% do esforço necessário. Requer assistência máxima.",
  },
  {
    value: 3,
    label: "Dependência Moderada (Assistência Moderada)",
    keywords: [
      "ajuda moderada",
      "assistência moderada",
      "participação parcial",
      "contribui moderadamente",
      "50%",
      "metade da tarefa",
      "necessita ajuda moderada",
      "realiza metade",
      "contribuição moderada",
      "esforço moderado",
      "auxílio constante",
    ],
    negativeKeywords: ["independente", "sozinho", "sem ajuda", "apenas supervisão"],
    description: "Paciente realiza entre 50% e 74% do esforço necessário. Requer assistência moderada.",
  },
  {
    value: 4,
    label: "Dependência Mínima (Assistência Mínima)",
    keywords: [
      "pouca ajuda",
      "assistência mínima",
      "contato leve",
      "suporte mínimo",
      "75%",
      "maior parte da tarefa",
      "necessita pouca ajuda",
      "realiza maior parte",
      "contribuição significativa",
      "esforço significativo",
      "auxílio ocasional",
    ],
    negativeKeywords: ["totalmente dependente", "não consegue", "incapaz"],
    description: "Paciente realiza 75% ou mais do esforço necessário. Requer apenas assistência mínima.",
  },
  {
    value: 5,
    label: "Supervisão/Preparo",
    keywords: [
      "supervisão",
      "preparo",
      "orientação",
      "comando verbal",
      "instrução",
      "monitoramento",
      "sem contato físico",
      "precisa ser lembrado",
      "necessita supervisão",
      "observação",
      "estímulo",
      "incentivo",
      "sem ajuda física",
    ],
    negativeKeywords: ["assistência física", "ajuda física", "contato físico", "incapaz"],
    description: "Paciente requer apenas supervisão, orientação, encorajamento ou preparo, sem contato físico.",
  },
  {
    value: 6,
    label: "Independência Modificada",
    keywords: [
      "independência modificada",
      "dispositivo",
      "adaptação",
      "órtese",
      "prótese",
      "tecnologia assistiva",
      "auxílio técnico",
      "tempo adicional",
      "mais tempo",
      "adaptado",
      "modificado",
      "com dispositivo",
      "com adaptação",
      "independente com",
    ],
    negativeKeywords: ["assistência", "ajuda", "supervisão", "dependente"],
    description:
      "Paciente realiza a tarefa de forma independente, mas usa dispositivos, requer mais tempo ou há preocupações de segurança.",
  },
  {
    value: 7,
    label: "Independência Completa",
    keywords: [
      "independente",
      "sozinho",
      "sem ajuda",
      "autonomia",
      "completa independência",
      "sem dificuldade",
      "sem adaptação",
      "sem dispositivo",
      "tempo razoável",
      "segurança",
      "sem risco",
      "completamente independente",
      "total independência",
    ],
    negativeKeywords: ["assistência", "ajuda", "supervisão", "dependente", "adaptação", "dispositivo"],
    description:
      "Paciente realiza a tarefa de forma totalmente independente, sem adaptações, em tempo razoável e com segurança.",
  },
]

// Histórico de análises para aprendizado
let analysisHistory: MIFAnalysisHistory[] = []

// Carregar histórico do localStorage
export const loadAnalysisHistory = (): void => {
  if (typeof window !== "undefined") {
    const savedHistory = localStorage.getItem("mif_analysis_history")
    if (savedHistory) {
      try {
        analysisHistory = JSON.parse(savedHistory)
      } catch (error) {
        console.error("Erro ao carregar histórico de análises MIF:", error)
        analysisHistory = []
      }
    }
  }
}

// Salvar histórico no localStorage
export const saveAnalysisHistory = (): void => {
  if (typeof window !== "undefined") {
    // Limitar o tamanho do histórico para os últimos 100 registros
    if (analysisHistory.length > 100) {
      analysisHistory = analysisHistory.slice(-100)
    }
    localStorage.setItem("mif_analysis_history", JSON.stringify(analysisHistory))
  }
}

// Adicionar uma nova entrada ao histórico
export const addToAnalysisHistory = (entry: MIFAnalysisHistory): void => {
  analysisHistory.push(entry)
  saveAnalysisHistory()
}

// Calcular a pontuação com base em palavras-chave e contexto
const calculateScoreByKeywords = (text: string): Map<number, number> => {
  const lowerText = text.toLowerCase()
  const scoreWeights = new Map<number, number>()

  // Inicializar pesos para cada pontuação
  MIF_LEVELS.forEach((level) => {
    scoreWeights.set(level.value, 0)
  })

  // Analisar presença de palavras-chave positivas
  MIF_LEVELS.forEach((level) => {
    level.keywords.forEach((keyword) => {
      if (lowerText.includes(keyword.toLowerCase())) {
        const currentWeight = scoreWeights.get(level.value) || 0
        scoreWeights.set(level.value, currentWeight + 1)
      }
    })

    // Reduzir peso com base em palavras-chave negativas
    level.negativeKeywords.forEach((keyword) => {
      if (lowerText.includes(keyword.toLowerCase())) {
        const currentWeight = scoreWeights.get(level.value) || 0
        scoreWeights.set(level.value, Math.max(0, currentWeight - 0.5))
      }
    })
  })

  return scoreWeights
}

// Analisar histórico para ajustar previsões
const analyzeHistoryPatterns = (fieldName: string, scoreWeights: Map<number, number>): Map<number, number> => {
  // Filtrar histórico relevante para este campo ou campos similares
  const relevantHistory = analysisHistory.filter(
    (entry) =>
      entry.fieldName === fieldName ||
      entry.fieldName.includes(fieldName.substring(0, 5)) ||
      fieldName.includes(entry.fieldName.substring(0, 5)),
  )

  if (relevantHistory.length === 0) return scoreWeights

  // Ajustar pesos com base no histórico
  const adjustedWeights = new Map(scoreWeights)

  relevantHistory.forEach((entry) => {
    // Dar mais peso para escolhas recentes (últimos 10 registros)
    const recencyFactor = analysisHistory.indexOf(entry) > analysisHistory.length - 10 ? 1.5 : 1

    // Aumentar peso da pontuação que foi selecionada anteriormente
    const currentWeight = adjustedWeights.get(entry.selectedScore) || 0
    adjustedWeights.set(entry.selectedScore, currentWeight + 0.5 * recencyFactor)

    // Se a sugestão foi diferente da seleção, reduzir o peso da sugestão
    if (entry.suggestedScore !== entry.selectedScore) {
      const suggestedWeight = adjustedWeights.get(entry.suggestedScore) || 0
      adjustedWeights.set(entry.suggestedScore, Math.max(0, suggestedWeight - 0.3))
    }
  })

  return adjustedWeights
}

// Analisar texto para determinar pontuação MIF
export const analyzeMIFScore = (fieldText: string, fieldName: string, fieldLabel: string): MIFAnalysisResult => {
  if (!fieldText || fieldText.trim() === "") {
    return {
      score: 5, // Valor padrão
      confidence: 0,
      explanation: "Texto vazio. Não foi possível realizar análise.",
      keywords: [],
      alternativeScores: [],
    }
  }

  // Carregar histórico se ainda não foi carregado
  if (analysisHistory.length === 0) {
    loadAnalysisHistory()
  }

  // Calcular pesos iniciais baseados em palavras-chave
  let scoreWeights = calculateScoreByKeywords(fieldText)

  // Ajustar pesos com base no histórico de análises
  scoreWeights = analyzeHistoryPatterns(fieldName, scoreWeights)

  // Determinar a pontuação com maior peso
  let maxScore = 5 // Valor padrão
  let maxWeight = 0

  scoreWeights.forEach((weight, score) => {
    if (weight > maxWeight) {
      maxWeight = weight
      maxScore = score
    }
  })

  // Se não houver palavras-chave suficientes, usar heurísticas adicionais
  if (maxWeight === 0) {
    // Analisar comprimento do texto - textos mais longos tendem a descrever situações mais complexas
    const wordCount = fieldText.split(/\s+/).length

    if (wordCount < 5) {
      maxScore = 7 // Textos muito curtos geralmente indicam independência
    } else if (wordCount > 30) {
      maxScore = 3 // Textos muito longos geralmente descrevem situações de dependência moderada
    } else {
      maxScore = 5 // Valor intermediário para textos de tamanho médio
    }
  }

  // Calcular pontuações alternativas
  const alternativeScores: Array<{ score: number; probability: number }> = []
  const totalWeight = Array.from(scoreWeights.values()).reduce((sum, weight) => sum + weight, 0)

  scoreWeights.forEach((weight, score) => {
    if (score !== maxScore && weight > 0) {
      alternativeScores.push({
        score,
        probability: totalWeight > 0 ? weight / totalWeight : 0,
      })
    }
  })

  // Ordenar alternativas por probabilidade
  alternativeScores.sort((a, b) => b.probability - a.probability)

  // Limitar a 3 alternativas
  const topAlternatives = alternativeScores.slice(0, 3)

  // Extrair palavras-chave encontradas
  const foundKeywords: string[] = []
  MIF_LEVELS.forEach((level) => {
    level.keywords.forEach((keyword) => {
      if (fieldText.toLowerCase().includes(keyword.toLowerCase()) && !foundKeywords.includes(keyword)) {
        foundKeywords.push(keyword)
      }
    })
  })

  // Gerar explicação
  const selectedLevel = MIF_LEVELS.find((level) => level.value === maxScore)
  let explanation = `Para o item "${fieldLabel}", estimo que seja MIF=${maxScore} (${selectedLevel?.label}). `

  if (foundKeywords.length > 0) {
    explanation += `Esta análise é baseada em termos como "${foundKeywords.slice(0, 3).join('", "')}" encontrados no texto. `
  }

  explanation += selectedLevel?.description || ""

  if (topAlternatives.length > 0) {
    explanation += ` Considere também MIF=${topAlternatives[0].score} como uma possibilidade alternativa.`
  }

  // Calcular nível de confiança
  const confidence = Math.min(0.95, maxWeight > 0 ? 0.5 + maxWeight / 10 : 0.5)

  return {
    score: maxScore,
    confidence,
    explanation,
    keywords: foundKeywords,
    alternativeScores: topAlternatives,
  }
}

// Função para análise assíncrona (simula chamada de API)
export const analyzeMIFScoreAsync = async (
  fieldText: string,
  fieldName: string,
  fieldLabel: string,
): Promise<MIFAnalysisResult> => {
  // Simular tempo de processamento
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Usar a função síncrona para análise
  return analyzeMIFScore(fieldText, fieldName, fieldLabel)
}
