"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, PieChart, RefreshCw, Trash2, Download } from "lucide-react"
import { loadAnalysisHistory, MIF_LEVELS } from "@/lib/mif-ai-service"

interface MIFAnalysisHistory {
  fieldText: string
  suggestedScore: number
  selectedScore: number
  fieldName: string
  timestamp: number
}

export default function MIFAnalyticsDashboard() {
  const [history, setHistory] = useState<MIFAnalysisHistory[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [accuracyRate, setAccuracyRate] = useState(0)
  const [scoreDistribution, setScoreDistribution] = useState<Record<number, number>>({})
  const [fieldDistribution, setFieldDistribution] = useState<Record<string, number>>({})
  const [recentHistory, setRecentHistory] = useState<MIFAnalysisHistory[]>([])

  // Carregar histórico
  useEffect(() => {
    loadAnalysisHistory()
    loadDashboardData()
  }, [])

  const loadDashboardData = () => {
    // Obter histórico do localStorage
    const savedHistory = localStorage.getItem("mif_analysis_history")
    if (!savedHistory) {
      setHistory([])
      return
    }

    try {
      const parsedHistory: MIFAnalysisHistory[] = JSON.parse(savedHistory)
      setHistory(parsedHistory)

      // Calcular taxa de precisão
      if (parsedHistory.length > 0) {
        const correctPredictions = parsedHistory.filter((item) => item.suggestedScore === item.selectedScore).length
        setAccuracyRate(Math.round((correctPredictions / parsedHistory.length) * 100))
      }

      // Calcular distribuição de pontuações
      const distribution: Record<number, number> = {}
      MIF_LEVELS.forEach((level) => {
        distribution[level.value] = 0
      })

      parsedHistory.forEach((item) => {
        distribution[item.selectedScore] = (distribution[item.selectedScore] || 0) + 1
      })
      setScoreDistribution(distribution)

      // Calcular distribuição por campo
      const fieldDist: Record<string, number> = {}
      parsedHistory.forEach((item) => {
        // Usar apenas o nome base do campo (sem prefixos/sufixos)
        const baseFieldName = item.fieldName.replace(/^mif_/, "").split("_")[0]
        fieldDist[baseFieldName] = (fieldDist[baseFieldName] || 0) + 1
      })
      setFieldDistribution(fieldDist)

      // Obter histórico recente (últimos 10)
      setRecentHistory(parsedHistory.slice(-10).reverse())
    } catch (error) {
      console.error("Erro ao carregar histórico para dashboard:", error)
    }
  }

  const clearHistory = () => {
    if (confirm("Tem certeza que deseja limpar todo o histórico de análises MIF? Esta ação não pode ser desfeita.")) {
      localStorage.removeItem("mif_analysis_history")
      setHistory([])
      setAccuracyRate(0)
      setScoreDistribution({})
      setFieldDistribution({})
      setRecentHistory([])
    }
  }

  const exportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `mif_analysis_history_${new Date().toISOString().slice(0, 10)}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  // Formatar nome do campo para exibição
  const formatFieldName = (fieldName: string): string => {
    return fieldName
      .replace(/^mif_/, "")
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase())
  }

  // Obter cor baseada na pontuação MIF
  const getMIFScoreColor = (score: number): string => {
    if (score <= 2) return "text-red-500 dark:text-red-400"
    if (score <= 4) return "text-amber-500 dark:text-amber-400"
    if (score <= 6) return "text-blue-500 dark:text-blue-400"
    return "text-green-500 dark:text-green-400"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Dashboard de Análises MIF</CardTitle>
            <CardDescription>Visualize o desempenho e histórico das análises de pontuação MIF</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadDashboardData}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Atualizar
            </Button>
            <Button variant="outline" size="sm" onClick={exportHistory} disabled={history.length === 0}>
              <Download className="h-4 w-4 mr-1" />
              Exportar
            </Button>
            <Button variant="outline" size="sm" onClick={clearHistory} disabled={history.length === 0}>
              <Trash2 className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhum histórico de análise MIF encontrado.</p>
            <p className="text-sm mt-2">
              As análises serão registradas automaticamente quando você utilizar a sugestão de pontuação MIF.
            </p>
          </div>
        ) : (
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="history">Histórico Recente</TabsTrigger>
              <TabsTrigger value="distribution">Distribuição</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Total de Análises</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{history.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Taxa de Precisão</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{accuracyRate}%</div>
                    <Progress value={accuracyRate} className="h-2 mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Pontuação Mais Comum</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {Object.entries(scoreDistribution).length > 0 && (
                      <div className="text-3xl font-bold">
                        MIF {Object.entries(scoreDistribution).sort((a, b) => b[1] - a[1])[0][0]}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <BarChart className="h-4 w-4 mr-2" />
                      Distribuição de Pontuações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(scoreDistribution)
                        .sort((a, b) => Number(a[0]) - Number(b[0]))
                        .map(([score, count]) => (
                          <div key={score} className="flex items-center gap-2">
                            <div className="w-8 text-right font-medium">
                              <span className={getMIFScoreColor(Number(score))}>{score}</span>
                            </div>
                            <Progress value={(count / history.length) * 100} className="h-4 flex-1" />
                            <div className="w-10 text-right text-sm">{count}</div>
                            <div className="w-12 text-right text-sm text-muted-foreground">
                              {Math.round((count / history.length) * 100)}%
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <PieChart className="h-4 w-4 mr-2" />
                      Campos Mais Avaliados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(fieldDistribution)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 7)
                        .map(([field, count]) => (
                          <div key={field} className="flex items-center gap-2">
                            <div className="w-32 text-sm truncate" title={formatFieldName(field)}>
                              {formatFieldName(field)}
                            </div>
                            <Progress value={(count / history.length) * 100} className="h-4 flex-1" />
                            <div className="w-10 text-right text-sm">{count}</div>
                            <div className="w-12 text-right text-sm text-muted-foreground">
                              {Math.round((count / history.length) * 100)}%
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="space-y-4">
                {recentHistory.length > 0 ? (
                  recentHistory.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">{formatFieldName(item.fieldName)}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(item.timestamp).toLocaleString()}
                          </div>
                        </div>

                        <div className="text-sm mb-3 line-clamp-2" title={item.fieldText}>
                          {item.fieldText}
                        </div>

                        <div className="flex items-center gap-4">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Sugerido</div>
                            <Badge variant="outline" className={getMIFScoreColor(item.suggestedScore)}>
                              MIF {item.suggestedScore}
                            </Badge>
                          </div>

                          <div className="text-muted-foreground">→</div>

                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Selecionado</div>
                            <Badge variant="outline" className={getMIFScoreColor(item.selectedScore)}>
                              MIF {item.selectedScore}
                            </Badge>
                          </div>

                          <div className="ml-auto">
                            {item.suggestedScore === item.selectedScore ? (
                              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-200">
                                Correto
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-200">
                                Ajustado
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhum histórico recente disponível.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="distribution">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Precisão por Pontuação</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {MIF_LEVELS.map((level) => {
                        const scoreHistory = history.filter((item) => item.selectedScore === level.value)
                        const correctCount = scoreHistory.filter(
                          (item) => item.suggestedScore === item.selectedScore,
                        ).length
                        const accuracy = scoreHistory.length > 0 ? (correctCount / scoreHistory.length) * 100 : 0

                        return (
                          <div key={level.value} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <span className={`font-medium mr-2 ${getMIFScoreColor(level.value)}`}>
                                  {level.value}
                                </span>
                                <span className="text-sm">{level.label}</span>
                              </div>
                              <div className="text-sm">
                                {correctCount}/{scoreHistory.length} ({Math.round(accuracy)}%)
                              </div>
                            </div>
                            <Progress value={accuracy} className="h-2" />
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Matriz de Confusão</CardTitle>
                    <CardDescription>Relação entre pontuações sugeridas e selecionadas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr>
                            <th className="text-left font-medium p-2">Sugerido ↓ / Selecionado →</th>
                            {MIF_LEVELS.map((level) => (
                              <th key={level.value} className="p-2 text-center">
                                <span className={getMIFScoreColor(level.value)}>{level.value}</span>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {MIF_LEVELS.map((suggestedLevel) => {
                            const suggestedHistory = history.filter(
                              (item) => item.suggestedScore === suggestedLevel.value,
                            )

                            return (
                              <tr key={suggestedLevel.value} className="border-t">
                                <td className="p-2 font-medium">
                                  <span className={getMIFScoreColor(suggestedLevel.value)}>{suggestedLevel.value}</span>
                                </td>
                                {MIF_LEVELS.map((selectedLevel) => {
                                  const count = suggestedHistory.filter(
                                    (item) => item.selectedScore === selectedLevel.value,
                                  ).length

                                  const isCorrect = suggestedLevel.value === selectedLevel.value

                                  return (
                                    <td
                                      key={selectedLevel.value}
                                      className={`p-2 text-center ${
                                        isCorrect && count > 0 ? "bg-green-500/10" : count > 0 ? "bg-amber-500/10" : ""
                                      }`}
                                    >
                                      {count > 0 ? count : "-"}
                                    </td>
                                  )
                                })}
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
