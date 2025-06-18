"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { LayoutProvider } from "@/components/layout-context"
import { AccessibilityProvider } from "@/components/accessibility-provider"

interface ProvidersProps {
  children: ReactNode
  defaultTheme?: "light" | "dark" | "system"
}

export function Providers({ children, defaultTheme = "light" }: ProvidersProps) {
  return (
    <ThemeProvider defaultTheme={defaultTheme}>
      <AccessibilityProvider>
        <LayoutProvider>{children}</LayoutProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  )
}
