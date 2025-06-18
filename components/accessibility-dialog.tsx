"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/use-toast"
import { useAccessibility } from "./accessibility-provider"

interface AccessibilityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AccessibilityDialog({ open, onOpenChange }: AccessibilityDialogProps) {
  const { settings, updateFontSize, updateContrast, resetSettings } = useAccessibility()
  const [fontSizeScale, setFontSizeScale] = useState(settings.fontSizeScale)
  const [contrastLevel, setContrastLevel] = useState(settings.contrastLevel)

  // Atualizar estados locais quando as configurações mudarem
  useEffect(() => {
    setFontSizeScale(settings.fontSizeScale)
    setContrastLevel(settings.contrastLevel)
  }, [settings])

  const handleSave = () => {
    updateFontSize(fontSizeScale)
    updateContrast(contrastLevel)
    onOpenChange(false)
    toast({
      title: "Configurações salvas",
      description: "As configurações de acessibilidade foram atualizadas com sucesso.",
    })
  }

  const handleReset = () => {
    resetSettings()
    setFontSizeScale(100)
    setContrastLevel(100)
    toast({
      title: "Configurações resetadas",
      description: "As configurações de acessibilidade foram restauradas para os valores padrão.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                updateFontSize(value[0])
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
                updateContrast(value[0])
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
              Este é um exemplo de como o texto aparecerá com as configurações atuais. Ajuste os controles para melhorar
              a legibilidade conforme sua necessidade.
            </p>
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            Resetar
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar Configurações</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
