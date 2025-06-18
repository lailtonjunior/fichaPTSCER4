"use client"

import { useState, useEffect } from "react"
import { useTheme } from "./theme-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { Sun, Moon, Contrast, Palette, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/use-toast"

// Cores corporativas predefinidas
const CORPORATE_COLORS = [
  { name: "Padrão", primary: "hsl(221.2 83.2% 53.3%)", secondary: "hsl(215 27.9% 16.9%)" },
  { name: "Saúde Verde", primary: "hsl(142.1 76.2% 36.3%)", secondary: "hsl(155 47.1% 18.8%)" },
  { name: "Hospitalar Azul", primary: "hsl(201 96% 32.2%)", secondary: "hsl(215 27.9% 16.9%)" },
  { name: "Clínica Rosa", primary: "hsl(346.8 77.2% 49.8%)", secondary: "hsl(355.7 100% 97.3%)" },
  { name: "Reabilitação Laranja", primary: "hsl(24.6 95% 53.1%)", secondary: "hsl(20 14.3% 4.1%)" },
  { name: "Psicologia Roxo", primary: "hsl(262.1 83.3% 57.8%)", secondary: "hsl(224.4 76.3% 48%)" },
]

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [customColorOpen, setCustomColorOpen] = useState(false)
  const [primaryColor, setPrimaryColor] = useState("")
  const [secondaryColor, setSecondaryColor] = useState("")
  const [corporateTheme, setCorporateTheme] = useState<string | null>(null)
  const [fontSizeScale, setFontSizeScale] = useState(100)
  const [contrastLevel, setContrastLevel] = useState(100)
  const [accessibilityOpen, setAccessibilityOpen] = useState(false)

  // Efeito para carregar as cores corporativas e configurações de acessibilidade salvas
  useEffect(() => {
    setMounted(true)

    // Verificar se estamos no navegador antes de acessar localStorage
    if (typeof window !== "undefined") {
      const savedPrimary = localStorage.getItem("pts_primary_color")
      const savedSecondary = localStorage.getItem("pts_secondary_color")
      const savedCorporateTheme = localStorage.getItem("pts_corporate_theme")
      const savedFontSize = localStorage.getItem("pts_font_size")
      const savedContrast = localStorage.getItem("pts_contrast_level")

      if (savedPrimary) setPrimaryColor(savedPrimary)
      if (savedSecondary) setSecondaryColor(savedSecondary)
      if (savedCorporateTheme) setCorporateTheme(savedCorporateTheme)
      if (savedFontSize) setFontSizeScale(Number.parseInt(savedFontSize))
      if (savedContrast) setContrastLevel(Number.parseInt(savedContrast))

      // Aplicar as configurações salvas
      if (savedPrimary || savedSecondary) {
        applyCustomColors(savedPrimary || "", savedSecondary || "")
      }

      if (savedFontSize) {
        applyFontSize(Number.parseInt(savedFontSize))
      }

      if (savedContrast) {
        applyContrast(Number.parseInt(savedContrast))
      }
    }
  }, [])

  // Função para aplicar cores personalizadas
  const applyCustomColors = (primary: string, secondary: string) => {
    const root = document.documentElement

    if (primary) {
      root.style.setProperty("--primary", primary)
      root.style.setProperty("--primary-foreground", getContrastColor(primary))
      // Atualizar também a variável ring que usa a cor primária
      root.style.setProperty("--ring", primary)
    }

    if (secondary) {
      root.style.setProperty("--secondary", secondary)
      root.style.setProperty("--secondary-foreground", getContrastColor(secondary))
    }

    // Forçar a atualização visual
    document.body.classList.add("theme-updated")
    setTimeout(() => {
      document.body.classList.remove("theme-updated")
    }, 100)
  }

  // Função para determinar a cor de contraste (texto branco ou preto)
  const getContrastColor = (hexOrHsl: string): string => {
    // Para simplificar, vamos usar branco para cores escuras
    // Em uma implementação real, você calcularia o contraste baseado na luminosidade
    return "hsl(0 0% 100%)"
  }

  // Função para salvar e aplicar cores corporativas
  const saveCustomColors = () => {
    if (!primaryColor || !secondaryColor) {
      toast({
        title: "Cores incompletas",
        description: "Por favor, defina ambas as cores primária e secundária.",
        variant: "destructive",
      })
      return
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("pts_primary_color", primaryColor)
      localStorage.setItem("pts_secondary_color", secondaryColor)
      localStorage.setItem("pts_corporate_theme", "custom")
    }

    setCorporateTheme("custom")
    applyCustomColors(primaryColor, secondaryColor)
    setCustomColorOpen(false)

    toast({
      title: "Cores personalizadas aplicadas",
      description: "As cores foram atualizadas com sucesso.",
    })
  }

  // Função para aplicar um tema corporativo predefinido
  const applyPresetTheme = (preset: (typeof CORPORATE_COLORS)[0]) => {
    setPrimaryColor(preset.primary)
    setSecondaryColor(preset.secondary)

    if (typeof window !== "undefined") {
      localStorage.setItem("pts_primary_color", preset.primary)
      localStorage.setItem("pts_secondary_color", preset.secondary)
      localStorage.setItem("pts_corporate_theme", preset.name)
    }

    setCorporateTheme(preset.name)
    applyCustomColors(preset.primary, preset.secondary)

    toast({
      title: "Tema aplicado",
      description: `O tema "${preset.name}" foi aplicado com sucesso.`,
    })
  }

  // Função para aplicar tamanho de fonte
  const applyFontSize = (size: number) => {
    document.documentElement.style.setProperty("--font-size-scale", `${size / 100}`)

    if (typeof window !== "undefined") {
      localStorage.setItem("pts_font_size", size.toString())
    }
  }

  // Função para aplicar nível de contraste
  const applyContrast = (level: number) => {
    document.documentElement.style.setProperty("--contrast-level", `${level / 100}`)

    if (typeof window !== "undefined") {
      localStorage.setItem("pts_contrast_level", level.toString())
    }
  }

  // Função para salvar configurações de acessibilidade
  const saveAccessibilitySettings = () => {
    applyFontSize(fontSizeScale)
    applyContrast(contrastLevel)
    setAccessibilityOpen(false)

    toast({
      title: "Configurações de acessibilidade salvas",
      description: "As configurações de acessibilidade foram atualizadas.",
    })
  }

  // Evitar renderização no servidor
  if (!mounted) return null

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" aria-label="Configurações de tema">
            <Palette className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Tema</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center justify-between">
            <div className="flex items-center">
              <Sun className="mr-2 h-4 w-4" />
              <span>Claro</span>
            </div>
            {theme === "light" && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center justify-between">
            <div className="flex items-center">
              <Moon className="mr-2 h-4 w-4" />
              <span>Escuro</span>
            </div>
            {theme === "dark" && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("contrast")} className="flex items-center justify-between">
            <div className="flex items-center">
              <Contrast className="mr-2 h-4 w-4" />
              <span>Alto Contraste</span>
            </div>
            {theme === "contrast" && <Check className="h-4 w-4" />}
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Acessibilidade</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setAccessibilityOpen(true)}>
            <Contrast className="mr-2 h-4 w-4" />
            <span>Tamanho e Contraste</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Cores</DropdownMenuLabel>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Palette className="mr-2 h-4 w-4" />
              <span>Temas Predefinidos</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {CORPORATE_COLORS.map((preset) => (
                  <DropdownMenuItem
                    key={preset.name}
                    onClick={() => applyPresetTheme(preset)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className="mr-2 h-4 w-4 rounded-full"
                        style={{ backgroundColor: preset.primary }}
                        aria-hidden="true"
                      ></div>
                      <span>{preset.name}</span>
                    </div>
                    {corporateTheme === preset.name && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem onClick={() => setCustomColorOpen(true)}>
            <Palette className="mr-2 h-4 w-4" />
            <span>Personalizar Cores</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Diálogo para personalização de cores */}
      <Dialog open={customColorOpen} onOpenChange={setCustomColorOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Personalizar Cores Corporativas</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="primary-color" className="text-right">
                Cor Primária
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-10 w-10 p-1"
                  aria-label="Selecionar cor primária"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="hsl(221.2 83.2% 53.3%)"
                  className="flex-1"
                  aria-label="Código da cor primária"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="secondary-color" className="text-right">
                Cor Secundária
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="secondary-color"
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="h-10 w-10 p-1"
                  aria-label="Selecionar cor secundária"
                />
                <Input
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  placeholder="hsl(215 27.9% 16.9%)"
                  className="flex-1"
                  aria-label="Código da cor secundária"
                />
              </div>
            </div>

            <div className="mt-4">
              <Label>Pré-visualização</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div
                  className="p-4 rounded-md text-center font-medium"
                  style={{
                    backgroundColor: primaryColor || "var(--primary)",
                    color: "var(--primary-foreground)",
                  }}
                  aria-label="Pré-visualização da cor primária"
                >
                  Cor Primária
                </div>
                <div
                  className="p-4 rounded-md text-center font-medium"
                  style={{
                    backgroundColor: secondaryColor || "var(--secondary)",
                    color: "var(--secondary-foreground)",
                  }}
                  aria-label="Pré-visualização da cor secundária"
                >
                  Cor Secundária
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomColorOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveCustomColors}>Aplicar Cores</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para configurações de acessibilidade */}
      <Dialog open={accessibilityOpen} onOpenChange={setAccessibilityOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Configurações de Acessibilidade</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <Label htmlFor="font-size-slider">Tamanho da Fonte: {fontSizeScale}%</Label>
              <Slider
                id="font-size-slider"
                min={80}
                max={150}
                step={5}
                value={[fontSizeScale]}
                onValueChange={(value) => {
                  setFontSizeScale(value[0])
                  // Aplicar imediatamente para feedback visual
                  applyFontSize(value[0])
                }}
                aria-label="Ajustar tamanho da fonte"
              />
              <div className="grid grid-cols-3 text-xs text-muted-foreground">
                <div>Menor</div>
                <div className="text-center">Normal</div>
                <div className="text-right">Maior</div>
              </div>
            </div>

            <div className="space-y-4">
              <Label htmlFor="contrast-slider">Nível de Contraste: {contrastLevel}%</Label>
              <Slider
                id="contrast-slider"
                min={80}
                max={150}
                step={5}
                value={[contrastLevel]}
                onValueChange={(value) => {
                  setContrastLevel(value[0])
                  // Aplicar imediatamente para feedback visual
                  applyContrast(value[0])
                }}
                aria-label="Ajustar nível de contraste"
              />
              <div className="grid grid-cols-3 text-xs text-muted-foreground">
                <div>Menor</div>
                <div className="text-center">Normal</div>
                <div className="text-right">Maior</div>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-md">
              <h4 className="font-medium mb-2">Texto de exemplo</h4>
              <p className="text-sm">
                Este é um exemplo de como o texto aparecerá com as configurações atuais. Ajuste os controles para
                melhorar a legibilidade conforme sua necessidade.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAccessibilityOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveAccessibilitySettings}>Salvar Configurações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
