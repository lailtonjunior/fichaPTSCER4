"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type LayoutType = "detalhado" | "compacto" | "simplificado"

interface LayoutContextType {
  layout: LayoutType
  setLayout: (layout: LayoutType) => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [layout, setLayoutState] = useState<LayoutType>("detalhado")

  useEffect(() => {
    // Carregar preferência de layout do localStorage
    if (typeof window !== "undefined") {
      const savedLayout = localStorage.getItem("pts_layout") as LayoutType | null
      if (savedLayout && ["detalhado", "compacto", "simplificado"].includes(savedLayout)) {
        setLayoutState(savedLayout)
      }
    }
  }, [])

  const setLayout = (newLayout: LayoutType) => {
    setLayoutState(newLayout)
    if (typeof window !== "undefined") {
      localStorage.setItem("pts_layout", newLayout)
    }
  }

  return <LayoutContext.Provider value={{ layout, setLayout }}>{children}</LayoutContext.Provider>
}

export function useLayoutContext() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error("useLayoutContext deve ser usado dentro de um LayoutProvider")
  }
  return context
}
