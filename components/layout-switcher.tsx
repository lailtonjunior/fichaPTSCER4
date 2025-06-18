"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LayoutTemplate, LayoutList, LayoutDashboard, Check } from "lucide-react"
import { useLayoutContext } from "@/components/layout-context"
import { toast } from "@/components/ui/use-toast"

export default function LayoutSwitcher() {
  const { layout, setLayout } = useLayoutContext()
  const [mounted, setMounted] = useState(false)

  const handleLayoutChange = (newLayout: "detalhado" | "compacto" | "simplificado") => {
    setLayout(newLayout)
    toast({
      title: "Layout atualizado",
      description: `O layout do formulário foi alterado para "${
        newLayout === "detalhado" ? "Detalhado" : newLayout === "compacto" ? "Compacto" : "Simplificado"
      }".`,
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-full"
          aria-label="Alterar layout do formulário"
        >
          {layout === "detalhado" && <LayoutTemplate className="h-4 w-4" />}
          {layout === "compacto" && <LayoutList className="h-4 w-4" />}
          {layout === "simplificado" && <LayoutDashboard className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLayoutChange("detalhado")} className="flex items-center justify-between">
          <div className="flex items-center">
            <LayoutTemplate className="mr-2 h-4 w-4" />
            <span>Detalhado</span>
          </div>
          {layout === "detalhado" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLayoutChange("compacto")} className="flex items-center justify-between">
          <div className="flex items-center">
            <LayoutList className="mr-2 h-4 w-4" />
            <span>Compacto</span>
          </div>
          {layout === "compacto" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLayoutChange("simplificado")}
          className="flex items-center justify-between"
        >
          <div className="flex items-center">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Simplificado</span>
          </div>
          {layout === "simplificado" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
