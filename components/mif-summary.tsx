"use client"

import { useFormContext } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { BarChart2, ChevronDown, ChevronUp } from "lucide-react"

// Adicionar o import do MIFAnalyticsDashboard
import MIFAnalyticsDashboard from "./mif-analytics-dashboard"

// Modificar o componente MIFSummary para incluir o dashboard
export default function MIFSummary() {
  const { watch } = useFormContext()
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const mifFields = [
    { id: "mif_mobilidadeLocomocao", label: "Mobilidade/Locomoção" },
    { id: "mif_autocuidado", label: "Autocuidado" },
    { id: "mif_comunicacaoInteracao", label: "Comunicação e interação social" },
    { id: "mif_vidaDomestica", label: "Vida doméstica e rotinas diárias" },
    { id: "mif_educacaoTrabalhoLazer", label: "Educação/Trabalho/Lazer" },
    { id: "mif_forcaTonosCoord", label: "Força, tônus, coordenação, equilíbrio" },
    { id: "mif_controlePostural", label: "Controle postural" },
    { id: "mif_funcoesSensoriais", label: "Funções sensoriais" },
    { id: "mif_funcoesCognitivas", label: "Funções cognitivas/comportamentais" },
  ]

  const getMIFDescription = (score: number) => {
    switch (score) {
      case 1:
        return "Dependência Total (Assistência Total)"
      case 2:
        return "Dependência Máxima (Assistência Máxima)"
      case 3:
        return "Dependência Moderada (Assistência Moderada)"
      case 4:
        return "Dependência Mínima (Assistência Mínima)"
      case 5:
        return "Supervisão/Preparo"
      case 6:
        return "Independência Modificada"
      case 7:
        return "Independência Completa"
      default:
        return "Não avaliado"
    }
  }

  const getMIFColor = (score: number) => {
    if (!score) return "text-muted-foreground"
    if (score <= 2) return "text-red-500"
    if (score <= 4) return "text-amber-500"
    if (score <= 6) return "text-blue-500"
    return "text-green-500"
  }

  const watchedMIFValues = mifFields.map((field) => ({
    ...field,
    value: watch(field.id) || null,
  }))

  const filledMIFValues = watchedMIFValues.filter((field) => field.value !== null)

  if (filledMIFValues.length === 0) {
    return null
  }

  const totalMIF = filledMIFValues.reduce((sum, field) => sum + Number.parseInt(field.value), 0)
  const averageMIF = Math.round((totalMIF / filledMIFValues.length) * 10) / 10

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-muted/40">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Resumo da Avaliação MIF
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8 p-0">
              {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowAnalytics(!showAnalytics)}>
              {showAnalytics ? "Ocultar Analytics" : "Mostrar Analytics"}
            </Button>
          </div>
        </CardHeader>
        {!collapsed && (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Área Avaliada</TableHead>
                  <TableHead className="w-24 text-center">Pontuação</TableHead>
                  <TableHead>Interpretação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filledMIFValues.map((field) => (
                  <TableRow key={field.id}>
                    <TableCell>{field.label}</TableCell>
                    <TableCell className={`text-center font-medium ${getMIFColor(Number.parseInt(field.value))}`}>
                      {field.value}
                    </TableCell>
                    <TableCell>{getMIFDescription(Number.parseInt(field.value))}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/20">
                  <TableCell className="font-medium">Média MIF</TableCell>
                  <TableCell className={`text-center font-medium ${getMIFColor(averageMIF)}`}>{averageMIF}</TableCell>
                  <TableCell>
                    {averageMIF < 3
                      ? "Dependência Severa"
                      : averageMIF < 5
                        ? "Dependência Moderada"
                        : averageMIF < 7
                          ? "Dependência Leve"
                          : "Independência"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>

      {showAnalytics && <MIFAnalyticsDashboard />}
    </div>
  )
}
