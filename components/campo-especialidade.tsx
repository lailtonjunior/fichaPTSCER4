"use client"

import { useRef, useEffect, type ReactNode } from "react"
import { useEspecialidade, camposEspecialidades } from "./especialidade-context"
import { cn } from "@/lib/utils"

interface CampoEspecialidadeProps {
  children: ReactNode
  campo: string
  className?: string
}

export default function CampoEspecialidade({ children, campo, className }: CampoEspecialidadeProps) {
  const { especialidadeSelecionada, isCampoRelevante, registrarCampoRef } = useEspecialidade()
  const campoRef = useRef<HTMLDivElement>(null)

  // Obter as especialidades associadas a este campo
  const especialidades = camposEspecialidades[campo] || ["todas"]

  // Verificar se o campo é relevante para a especialidade selecionada
  const relevante = isCampoRelevante(campo, especialidades)

  // Registrar a referência do campo quando o componente é montado
  useEffect(() => {
    if (campoRef.current && relevante) {
      registrarCampoRef(campo, campoRef)
    }

    // Limpar a referência quando o componente é desmontado
    return () => {
      if (relevante) {
        registrarCampoRef(campo, null)
      }
    }
  }, [campo, relevante, registrarCampoRef])

  // Atualizar o registro quando a relevância muda
  useEffect(() => {
    if (relevante) {
      registrarCampoRef(campo, campoRef)
    } else {
      registrarCampoRef(campo, null)
    }
  }, [campo, relevante, registrarCampoRef])

  return (
    <div
      ref={campoRef}
      id={`campo-${campo}`}
      className={cn(
        "transition-all duration-200 scroll-mt-24 p-4 rounded-md",
        relevante ? "opacity-100" : "opacity-50 bg-muted/10",
        especialidadeSelecionada !== "todas" && relevante && "border-l-4 border-primary pl-5 bg-primary/5",
        className,
      )}
    >
      {children}
    </div>
  )
}
