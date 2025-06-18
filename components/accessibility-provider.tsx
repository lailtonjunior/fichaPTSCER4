"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AccessibilitySettings {
  fontSizeScale: number
  contrastLevel: number
}

interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateFontSize: (size: number) => void
  updateContrast: (level: number) => void
  resetSettings: () => void
}

const defaultSettings: AccessibilitySettings = {
  fontSizeScale: 100,
  contrastLevel: 100,
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)

  // Carregar configurações do localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFontSize = localStorage.getItem("pts_font_size")
      const savedContrast = localStorage.getItem("pts_contrast_level")

      const loadedSettings = { ...defaultSettings }
      if (savedFontSize) loadedSettings.fontSizeScale = Number.parseInt(savedFontSize)
      if (savedContrast) loadedSettings.contrastLevel = Number.parseInt(savedContrast)

      setSettings(loadedSettings)
      applySettings(loadedSettings)
    }
  }, [])

  // Aplicar configurações ao DOM
  const applySettings = (newSettings: AccessibilitySettings) => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--font-size-scale", `${newSettings.fontSizeScale / 100}`)
      document.documentElement.style.setProperty("--contrast-level", `${newSettings.contrastLevel / 100}`)
    }
  }

  // Atualizar tamanho da fonte
  const updateFontSize = (size: number) => {
    const newSettings = { ...settings, fontSizeScale: size }
    setSettings(newSettings)
    applySettings(newSettings)

    if (typeof localStorage !== "undefined") {
      localStorage.setItem("pts_font_size", size.toString())
    }
  }

  // Atualizar nível de contraste
  const updateContrast = (level: number) => {
    const newSettings = { ...settings, contrastLevel: level }
    setSettings(newSettings)
    applySettings(newSettings)

    if (typeof localStorage !== "undefined") {
      localStorage.setItem("pts_contrast_level", level.toString())
    }
  }

  // Resetar para configurações padrão
  const resetSettings = () => {
    setSettings(defaultSettings)
    applySettings(defaultSettings)

    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("pts_font_size")
      localStorage.removeItem("pts_contrast_level")
    }
  }

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateFontSize,
        updateContrast,
        resetSettings,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility deve ser usado dentro de um AccessibilityProvider")
  }
  return context
}
