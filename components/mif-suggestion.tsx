"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertCircle, CheckCircle2, HelpCircle, BarChart2 } from "lucide-react"
import {
  analyzeMIFScoreAsync,
  addToAnalysisHistory,
  loadAnalysisHistory,
  type MIFAnalysisResult,
  MIF_LEVELS,
} from "@/lib/mif-ai-service"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface MIFSuggestionProps {
  fieldText: string
  fieldName: string
  fieldLabel: string
  onConfirm: (score: number) => void
}

export default function MIFSuggestion({ fieldText, fieldName, fieldLabel, onConfirm }: MIFSuggestionProps) {
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<MIFAnalysisResult | null>(null)
  const [selectedScore, setSelectedScore] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(true)
  const [historyLoaded, setHistoryLoaded] = useState(false)

  // Carregar histórico de análises
  useEffect(() => {
    if (!historyLoaded) {
      loadAnalysisHistory()
      setHistoryLoaded(true)
    }
  }, [historyLoaded])

  const analyzeMIF = async () => {
    if (!fieldText || fieldText.trim() === "") return

    setLoading(true)
    setAnalyzing(true)

    try {
      // Chamar o serviço de IA para análise
      const result = await analyzeMIFScoreAsync(fieldText, fieldName, fieldLabel)

      setAnalysis(result)
      setSelectedScore(result.score)
    } catch (error) {
      console.error("Erro ao analisar texto:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = () => {
    if (selectedScore !== null) {
      // Registrar a análise no histórico para aprendizado
      if (analysis) {
        addToAnalysisHistory({
          fieldText,
          suggestedScore: analysis.score,
          selectedScore,
          fieldName,
          timestamp: Date.now(),
        })
      }

      onConfirm(selectedScore)
      setAnalyzing(false)
      setAnalysis(null)
    }
  }

  // Função para obter a cor baseada na pontuação MIF
  const getMIFScoreColor = (score: number): string => {
    if (score <= 2) return "text-red-500 dark:text-red-400"
    if (score <= 4) return "text-amber-500 dark:text-amber-400"
    if (score <= 6) return "text-blue-500 dark:text-blue-400"
    return "text-green-500 dark:text-green-400"
  }

  // Função para obter a cor baseada no nível de confiança
  const getConfidenceColor = (confidence: number): string => {
    if (confidence < 0.5) return "text-red-500 dark:text-red-400"
    if (confidence < 0.7) return "text-amber-500 dark:text-amber-400"
    if (confidence < 0.9) return "text-blue-500 dark:text-blue-400"
    return "text-green-500 dark:text-green-400"
  }

  return (
    <div className="mt-2">
      {!analyzing ? (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={analyzeMIF}
            disabled={!fieldText || fieldText.trim() === ""}
            className="flex items-center gap-1"
          >
            <BarChart2 className="h-4 w-4 mr-1" />
            <span>Analisar e sugerir MIF</span>
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <HelpCircle className="h-4 w-4" />
                  <span className="sr-only">Ajuda sobre MIF</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>
                  A Medida de Independência Funcional (MIF) avalia o nível de independência do paciente em uma escala de
                  1 a 7:
                </p>
                <ul className="mt-2 text-xs">
                  <li>
                    <strong>1-2:</strong> Dependência Completa
                  </li>
                  <li>
                    <strong>3-4:</strong> Dependência Modificada
                  </li>
                  <li>
                    <strong>5:</strong> Supervisão
                  </li>
                  <li>
                    <strong>6-7:</strong> Independência
                  </li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ) : (
        <Card className="p-0 mt-2 bg-muted/30">
          {loading ? (
            <CardContent className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
              <span>Analisando resposta com IA...</span>
            </CardContent>
          ) : (
            <>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base flex items-center">
                    Análise MIF
                    {analysis && (
                      <Badge variant="outline" className={`ml-2 ${getMIFScoreColor(analysis.score)}`}>
                        Sugestão: {analysis.score}
                      </Badge>
                    )}
                  </CardTitle>

                  {analysis && (
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-muted-foreground">Confiança:</span>
                      <span className={getConfidenceColor(analysis.confidence)}>
                        {Math.round(analysis.confidence * 100)}%
                      </span>
                      <Progress
                        value={analysis.confidence * 100}
                        className="w-16 h-2"
                        aria-label="Nível de confiança da análise"
                      />
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                {analysis && showExplanation && (
                  <div className="text-sm bg-background/50 p-3 rounded-md">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <p>{analysis.explanation}</p>
                    </div>

                    {analysis.keywords.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {analysis.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {analysis.alternativeScores.length > 0 && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="link" size="sm" className="mt-1 h-auto p-0">
                            Ver pontuações alternativas
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">Pontuações alternativas</h4>
                            {analysis.alternativeScores.map((alt, index) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <span>
                                  MIF {alt.score} - {MIF_LEVELS.find((l) => l.value === alt.score)?.label}
                                </span>
                                <Progress
                                  value={alt.probability * 100}
                                  className="w-20 h-2"
                                  aria-label={`Probabilidade de MIF ${alt.score}`}
                                />
                                <span>{Math.round(alt.probability * 100)}%</span>
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor={`mif-${fieldName}`} className="font-medium">
                      Selecione a pontuação MIF:
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2"
                      onClick={() => setShowExplanation(!showExplanation)}
                    >
                      {showExplanation ? "Ocultar explicação" : "Mostrar explicação"}
                    </Button>
                  </div>

                  <RadioGroup
                    id={`mif-${fieldName}`}
                    value={selectedScore?.toString()}
                    onValueChange={(value) => setSelectedScore(Number.parseInt(value))}
                    className="grid grid-cols-1 gap-2"
                  >
                    {MIF_LEVELS.map((level) => (
                      <div
                        key={level.value}
                        className={`flex items-center space-x-2 p-2 rounded-md transition-colors
                          ${selectedScore === level.value ? "bg-primary/10" : "hover:bg-muted"}
                          ${analysis?.score === level.value ? "border border-primary/30" : ""}
                        `}
                      >
                        <RadioGroupItem value={level.value.toString()} id={`mif-${fieldName}-${level.value}`} />
                        <Label
                          htmlFor={`mif-${fieldName}-${level.value}`}
                          className="cursor-pointer flex-1 flex items-center"
                        >
                          <span className={`font-medium mr-2 ${getMIFScoreColor(level.value)}`}>{level.value}</span>
                          <span>{level.label}</span>

                          {analysis?.score === level.value && <CheckCircle2 className="h-4 w-4 text-primary ml-2" />}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setAnalyzing(false)}>
                  Cancelar
                </Button>
                <Button type="button" onClick={handleConfirm} size="sm" disabled={selectedScore === null}>
                  Confirmar pontuação
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      )}
    </div>
  )
}
