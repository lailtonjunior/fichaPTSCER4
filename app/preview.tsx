"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PTSForm from "@/components/pts-form"
import { ThemeProvider } from "@/components/theme-provider"
import { LayoutProvider } from "@/components/layout-context"

export default function PreviewPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [layout, setLayout] = useState<"detalhado" | "compacto" | "simplificado">("detalhado")

  return (
    <ThemeProvider defaultTheme={theme} storageKey="pts-theme">
      <LayoutProvider defaultLayout={layout}>
        <div className="min-h-screen bg-background">
          <header className="border-b bg-card">
            <div className="container flex items-center justify-between py-4">
              <h1 className="text-xl font-bold">Visualização do Formulário PTS</h1>
              <div className="flex items-center gap-4">
                <Tabs value={theme} onValueChange={(v) => setTheme(v as "light" | "dark")}>
                  <TabsList>
                    <TabsTrigger value="light">Claro</TabsTrigger>
                    <TabsTrigger value="dark">Escuro</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Tabs value={layout} onValueChange={(v) => setLayout(v as "detalhado" | "compacto" | "simplificado")}>
                  <TabsList>
                    <TabsTrigger value="detalhado">Detalhado</TabsTrigger>
                    <TabsTrigger value="compacto">Compacto</TabsTrigger>
                    <TabsTrigger value="simplificado">Simplificado</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </header>
          <main>
            <PTSForm />
          </main>
        </div>
      </LayoutProvider>
    </ThemeProvider>
  )
}
