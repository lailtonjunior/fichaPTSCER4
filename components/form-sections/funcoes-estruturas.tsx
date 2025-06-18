"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useFormContext } from "react-hook-form"
import { useState } from "react"
import MIFSuggestion from "../mif-suggestion"
import { Badge } from "@/components/ui/badge"
import CampoEspecialidade from "../campo-especialidade"

export default function FuncoesEstruturas() {
  const { register, setValue, watch } = useFormContext()
  const [mifScores, setMifScores] = useState<Record<string, number>>({})

  const watchedFields = {
    forcaTonosCoord: watch("forcaTonosCoord") || "",
    controlePostural: watch("controlePostural") || "",
    funcoesSensoriais: watch("funcoesSensoriais") || "",
    funcoesCognitivas: watch("funcoesCognitivas") || "",
  }

  const handleMIFConfirm = (fieldName: string, score: number) => {
    setMifScores((prev) => ({ ...prev, [fieldName]: score }))
    setValue(`mif_${fieldName}`, score)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">5. FUNÇÕES E ESTRUTURAS CORPORAIS</h2>
      <p className="text-muted-foreground">
        Aspectos clínicos específicos relacionados a estruturas anatômicas e funções fisiológicas.
      </p>

      <div className="grid gap-6">
        <CampoEspecialidade campo="sistemasComprometidos">
          <div className="grid gap-2">
            <Label htmlFor="sistemasComprometidos">
              Sistemas Comprometidos: Neurológico, musculoesquelético, respiratório, cardiovascular, sensorial etc.
            </Label>
            <Textarea id="sistemasComprometidos" {...register("sistemasComprometidos")} rows={3} />
          </div>
        </CampoEspecialidade>

        <CampoEspecialidade campo="forcaTonosCoord">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="forcaTonosCoord">Força, tônus, coordenação, equilíbrio: Alterações?</Label>
              {mifScores.forcaTonosCoord && (
                <Badge variant="outline" className="ml-2">
                  MIF: {mifScores.forcaTonosCoord}
                </Badge>
              )}
            </div>
            <Textarea id="forcaTonosCoord" {...register("forcaTonosCoord")} rows={3} />
            <input type="hidden" {...register("mif_forcaTonosCoord")} />
            <MIFSuggestion
              fieldText={watchedFields.forcaTonosCoord}
              fieldName="forcaTonosCoord"
              fieldLabel="Força, tônus, coordenação, equilíbrio"
              onConfirm={(score) => handleMIFConfirm("forcaTonosCoord", score)}
            />
          </div>
        </CampoEspecialidade>

        <CampoEspecialidade campo="presencaDor">
          <div className="grid gap-2">
            <Label htmlFor="presencaDor">
              Presença de dor: Intensidade (EVA 0–10), frequência, fatores agravantes.
            </Label>
            <Textarea id="presencaDor" {...register("presencaDor")} rows={3} />
          </div>
        </CampoEspecialidade>

        <CampoEspecialidade campo="deformidades">
          <div className="grid gap-2">
            <Label htmlFor="deformidades">Deformidades, contraturas ou amputações: Localização e grau.</Label>
            <Textarea id="deformidades" {...register("deformidades")} rows={3} />
          </div>
        </CampoEspecialidade>

        <CampoEspecialidade campo="controlePostural">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="controlePostural">
                Controle postural (em pé, sentado, deitado): Necessidade de órteses?
              </Label>
              {mifScores.controlePostural && (
                <Badge variant="outline" className="ml-2">
                  MIF: {mifScores.controlePostural}
                </Badge>
              )}
            </div>
            <Textarea id="controlePostural" {...register("controlePostural")} rows={3} />
            <input type="hidden" {...register("mif_controlePostural")} />
            <MIFSuggestion
              fieldText={watchedFields.controlePostural}
              fieldName="controlePostural"
              fieldLabel="Controle postural"
              onConfirm={(score) => handleMIFConfirm("controlePostural", score)}
            />
          </div>
        </CampoEspecialidade>

        <CampoEspecialidade campo="funcoesSensoriais">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="funcoesSensoriais">
                Funções sensoriais (visão, audição, tato): Há alguma perda ou redução?
              </Label>
              {mifScores.funcoesSensoriais && (
                <Badge variant="outline" className="ml-2">
                  MIF: {mifScores.funcoesSensoriais}
                </Badge>
              )}
            </div>
            <Textarea id="funcoesSensoriais" {...register("funcoesSensoriais")} rows={3} />
            <input type="hidden" {...register("mif_funcoesSensoriais")} />
            <MIFSuggestion
              fieldText={watchedFields.funcoesSensoriais}
              fieldName="funcoesSensoriais"
              fieldLabel="Funções sensoriais"
              onConfirm={(score) => handleMIFConfirm("funcoesSensoriais", score)}
            />
          </div>
        </CampoEspecialidade>

        <CampoEspecialidade campo="funcoesCognitivas">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="funcoesCognitivas">
                Funções cognitivas/comportamentais: Se aplicável, registrar possíveis alterações.
              </Label>
              {mifScores.funcoesCognitivas && (
                <Badge variant="outline" className="ml-2">
                  MIF: {mifScores.funcoesCognitivas}
                </Badge>
              )}
            </div>
            <Textarea id="funcoesCognitivas" {...register("funcoesCognitivas")} rows={3} />
            <input type="hidden" {...register("mif_funcoesCognitivas")} />
            <MIFSuggestion
              fieldText={watchedFields.funcoesCognitivas}
              fieldName="funcoesCognitivas"
              fieldLabel="Funções cognitivas/comportamentais"
              onConfirm={(score) => handleMIFConfirm("funcoesCognitivas", score)}
            />
          </div>
        </CampoEspecialidade>
      </div>
    </div>
  )
}
