"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Settings,
  ChevronUp,
  Palette,
  LayoutTemplate,
  LayoutList,
  LayoutDashboard,
  Save,
  Contrast,
  Sun,
  Moon,
  X,
} from "lucide-react"
import { useTheme } from "./theme-provider"
import { useLayoutContext } from "./layout-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import TemplateManager from "./template-manager"
import { toast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
// Adicionar o import do AccessibilityDialog
import AccessibilityDialog from "./accessibility-dialog"

export default function FloatingMenu() {
  const { theme, setTheme } = useTheme()
  const { layout, setLayout } = useLayoutContext()
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [accessibilityDialogOpen, setAccessibilityDialogOpen] = useState(false)

  // Controlar a visibilidade com base no scroll
  useEffect(() => {
    const controlMenu = () => {
      if (typeof window !== "undefined") {
        // Mostrar botão de voltar ao topo quando rolar mais de 300px
        if (window.scrollY > 300) {
          setShowScrollTop(true)
        } else {
          setShowScrollTop(false)
        }

        // Esconder quando rolar para baixo, mostrar quando rolar para cima
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setVisible(false)
        } else {
          setVisible(true)
        }

        // Atualizar a posição de scroll
        setLastScrollY(window.scrollY)
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlMenu)

      // Limpar o event listener
      return () => {
        window.removeEventListener("scroll", controlMenu)
      }
    }
  }, [lastScrollY])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleLayoutChange = (newLayout: "detalhado" | "compacto" | "simplificado") => {
    setLayout(newLayout)
    toast({
      title: "Layout atualizado",
      description: `O layout do formulário foi alterado para "${
        newLayout === "detalhado" ? "Detalhado" : newLayout === "compacto" ? "Compacto" : "Simplificado"
      }".`,
    })
  }

  const getLayoutIcon = () => {
    switch (layout) {
      case "detalhado":
        return <LayoutTemplate className="h-4 w-4" />
      case "compacto":
        return <LayoutList className="h-4 w-4" />
      case "simplificado":
        return <LayoutDashboard className="h-4 w-4" />
    }
  }

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />
      case "dark":
        return <Moon className="h-4 w-4" />
      case "contrast":
        return <Contrast className="h-4 w-4" />
      default:
        return <Sun className="h-4 w-4" />
    }
  }

  return (
    <>
      <div className={`fixed right-6 transition-all duration-300 z-50 ${visible ? "bottom-6" : "bottom-[-100px]"}`}>
        <div className="flex flex-col items-end space-y-2">
          {/* Botão de voltar ao topo */}
          {showScrollTop && (
            <Button
              variant="outline"
              size="icon"
              className="rounded-full shadow-md bg-background h-10 w-10"
              onClick={scrollToTop}
              aria-label="Voltar ao topo"
            >
              <ChevronUp className="h-5 w-5" />
            </Button>
          )}

          {/* Menu principal */}
          <div className="bg-background rounded-full shadow-md p-2 flex flex-col items-end space-y-2">
            {expanded ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full self-end"
                  onClick={() => setExpanded(false)}
                  aria-label="Fechar menu"
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="flex flex-col space-y-2 items-end">
                  {/* Dropdown de Tema */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 rounded-full flex items-center gap-2 px-3">
                        {getThemeIcon()}
                        <span>Tema</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Escolha o tema</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setTheme("light")}>
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Claro</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("dark")}>
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Escuro</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("contrast")}>
                        <Contrast className="mr-2 h-4 w-4" />
                        <span>Alto Contraste</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setAccessibilityDialogOpen(true)}>
                        <Contrast className="mr-2 h-4 w-4" />
                        <span>Acessibilidade</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          import("./theme-switcher").then((module) => {
                            const ThemeSwitcher = module.default
                            const customColorOpen = true
                            // Aqui você precisaria de uma forma de abrir o diálogo de cores
                            // Como isso é complexo para fazer diretamente, vamos usar uma abordagem simplificada
                            toast({
                              title: "Personalizar cores",
                              description:
                                "Clique no ícone de configurações no menu principal para personalizar as cores.",
                            })
                          })
                        }
                      >
                        <Palette className="mr-2 h-4 w-4" />
                        <span>Personalizar Cores</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Dropdown de Layout */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 rounded-full flex items-center gap-2 px-3">
                        {getLayoutIcon()}
                        <span>Layout</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Escolha o layout</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleLayoutChange("detalhado")}>
                        <LayoutTemplate className="mr-2 h-4 w-4" />
                        <span>Detalhado</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleLayoutChange("compacto")}>
                        <LayoutList className="mr-2 h-4 w-4" />
                        <span>Compacto</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleLayoutChange("simplificado")}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Simplificado</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Botão de Templates */}
                  <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 rounded-full flex items-center gap-2 px-3">
                        <Save className="h-4 w-4" />
                        <span>Templates</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Gerenciar Templates</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <TemplateManager onClose={() => setTemplateDialogOpen(false)} />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </>
            ) : (
              <Button
                variant="default"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => setExpanded(true)}
                aria-label="Abrir menu"
              >
                <Settings className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Importar diálogos de acessibilidade e cores aqui */}
      <AccessibilityDialog open={accessibilityDialogOpen} onOpenChange={setAccessibilityDialogOpen} />
    </>
  )
}
