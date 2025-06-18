"use client"

import { useEspecialidade } from "./especialidade-context"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"

export default function NavegacaoCamposRelevantes() {
  const { especialidadeSelecionada, navegarParaCampoRelevante, totalCamposRelevantes, campoRelevanteSelecionado } =
    useEspecialidade()

  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Controlar a visibilidade com base no scroll
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        // Esconder quando rolar para baixo, mostrar quando rolar para cima
        if (window.scrollY > lastScrollY) {
          setVisible(false)
        } else {
          setVisible(true)
        }

        // Atualizar a posição de scroll
        setLastScrollY(window.scrollY)
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar)

      // Limpar o event listener
      return () => {
        window.removeEventListener("scroll", controlNavbar)
      }
    }
  }, [lastScrollY])

  // Não mostrar navegação se estiver visualizando todos os campos
  if (especialidadeSelecionada === "todas" || totalCamposRelevantes <= 1) {
    return null
  }

  return (
    <div
      className={`fixed bottom-6 right-6 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-24"
      }`}
    >
      <Card className="shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navegarParaCampoRelevante("anterior")}
              title="Campo anterior"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>

            <div className="text-xs text-center font-medium">
              {campoRelevanteSelecionado + 1} / {totalCamposRelevantes}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => navegarParaCampoRelevante("proximo")}
              title="Próximo campo"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
