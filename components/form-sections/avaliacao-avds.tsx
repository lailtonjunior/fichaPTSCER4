"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useFormContext } from "react-hook-form"
import CampoEspecialidade from "../campo-especialidade"
import FormSectionWrapper from "../form-section-wrapper"
import { useLayoutContext } from "@/components/layout-context"
import { cn } from "@/lib/utils"
import { useState } from "react"
import MIFSuggestion from "../mif-suggestion"
import { Badge } from "@/components/ui/badge"

export default function AvaliacaoAVDs() {
  const { register, setValue, watch } = useFormContext()
  const { layout } = useLayoutContext()
  const [mifScores, setMifScores] = useState<Record<string, number>>({})

  const watchedFields = {
    alimentacao: watch("alimentacao") || "",
    higienePessoal: watch("higienePessoal") || "",
    banho: watch("banho") || "",
    vestirParteSuperior: watch("vestirParteSuperior") || "",
    vestirParteInferior: watch("vestirParteInferior") || "",
    usoSanitario: watch("usoSanitario") || "",
    controleBexiga: watch("controleBexiga") || "",
    controleIntestino: watch("controleIntestino") || "",
  }

  const handleMIFConfirm = (fieldName: string, score: number) => {
    setMifScores((prev) => ({ ...prev, [fieldName]: score }))
    setValue(`mif_${fieldName}`, score)
  }

  return (
    <FormSectionWrapper
      title="6.1. AVALIAÇÃO DE ATIVIDADES DE VIDA DIÁRIA (AVDs)"
      description={
        layout !== "simplificado"
          ? "Avaliação detalhada da independência nas atividades básicas de vida diária."
          : undefined
      }
    >
      <CampoEspecialidade campo="alimentacao">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="alimentacao" className={cn(layout === "simplificado" && "text-sm")}>
              Alimentação:
            </Label>
            {mifScores.alimentacao && (
              <Badge variant="outline" className="ml-2">
                MIF: {mifScores.alimentacao}
              </Badge>
            )}
          </div>
          <Textarea
            id="alimentacao"
            {...register("alimentacao")}
            rows={layout === "detalhado" ? 3 : 2}
            placeholder="Descreva o nível de independência para se alimentar, uso de talheres, necessidade de adaptações."
          />
          <input type="hidden" {...register("mif_alimentacao")} />
          {layout !== "simplificado" && (
            <MIFSuggestion
              fieldText={watchedFields.alimentacao}
              fieldName="alimentacao"
              fieldLabel="Alimentação"
              onConfirm={(score) => handleMIFConfirm("alimentacao", score)}
            />
          )}
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="higienePessoal">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="higienePessoal" className={cn(layout === "simplificado" && "text-sm")}>
              Higiene Pessoal:
            </Label>
            {mifScores.higienePessoal && (
              <Badge variant="outline" className="ml-2">
                MIF: {mifScores.higienePessoal}
              </Badge>
            )}
          </div>
          <Textarea
            id="higienePessoal"
            {...register("higienePessoal")}
            rows={layout === "detalhado" ? 3 : 2}
            placeholder="Descreva o nível de independência para higiene bucal, pentear cabelo, lavar as mãos e rosto."
          />
          <input type="hidden" {...register("mif_higienePessoal")} />
          {layout !== "simplificado" && (
            <MIFSuggestion
              fieldText={watchedFields.higienePessoal}
              fieldName="higienePessoal"
              fieldLabel="Higiene Pessoal"
              onConfirm={(score) => handleMIFConfirm("higienePessoal", score)}
            />
          )}
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="banho">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="banho" className={cn(layout === "simplificado" && "text-sm")}>
              Banho:
            </Label>
            {mifScores.banho && (
              <Badge variant="outline" className="ml-2">
                MIF: {mifScores.banho}
              </Badge>
            )}
          </div>
          <Textarea
            id="banho"
            {...register("banho")}
            rows={layout === "detalhado" ? 3 : 2}
            placeholder="Descreva o nível de independência para tomar banho, necessidade de adaptações ou assistência."
          />
          <input type="hidden" {...register("mif_banho")} />
          {layout !== "simplificado" && (
            <MIFSuggestion
              fieldText={watchedFields.banho}
              fieldName="banho"
              fieldLabel="Banho"
              onConfirm={(score) => handleMIFConfirm("banho", score)}
            />
          )}
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="vestirParteSuperior">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="vestirParteSuperior" className={cn(layout === "simplificado" && "text-sm")}>
              Vestir parte superior do corpo:
            </Label>
            {mifScores.vestirParteSuperior && (
              <Badge variant="outline" className="ml-2">
                MIF: {mifScores.vestirParteSuperior}
              </Badge>
            )}
          </div>
          <Textarea
            id="vestirParteSuperior"
            {...register("vestirParteSuperior")}
            rows={layout === "detalhado" ? 3 : 2}
            placeholder="Descreva o nível de independência para vestir a parte superior do corpo."
          />
          <input type="hidden" {...register("mif_vestirParteSuperior")} />
          {layout !== "simplificado" && (
            <MIFSuggestion
              fieldText={watchedFields.vestirParteSuperior}
              fieldName="vestirParteSuperior"
              fieldLabel="Vestir parte superior"
              onConfirm={(score) => handleMIFConfirm("vestirParteSuperior", score)}
            />
          )}
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="vestirParteInferior">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="vestirParteInferior" className={cn(layout === "simplificado" && "text-sm")}>
              Vestir parte inferior do corpo:
            </Label>
            {mifScores.vestirParteInferior && (
              <Badge variant="outline" className="ml-2">
                MIF: {mifScores.vestirParteInferior}
              </Badge>
            )}
          </div>
          <Textarea
            id="vestirParteInferior"
            {...register("vestirParteInferior")}
            rows={layout === "detalhado" ? 3 : 2}
            placeholder="Descreva o nível de independência para vestir a parte inferior do corpo."
          />
          <input type="hidden" {...register("mif_vestirParteInferior")} />
          {layout !== "simplificado" && (
            <MIFSuggestion
              fieldText={watchedFields.vestirParteInferior}
              fieldName="vestirParteInferior"
              fieldLabel="Vestir parte inferior"
              onConfirm={(score) => handleMIFConfirm("vestirParteInferior", score)}
            />
          )}
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="usoSanitario">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="usoSanitario" className={cn(layout === "simplificado" && "text-sm")}>
              Uso do sanitário:
            </Label>
            {mifScores.usoSanitario && (
              <Badge variant="outline" className="ml-2">
                MIF: {mifScores.usoSanitario}
              </Badge>
            )}
          </div>
          <Textarea
            id="usoSanitario"
            {...register("usoSanitario")}
            rows={layout === "detalhado" ? 3 : 2}
            placeholder="Descreva o nível de independência para usar o sanitário, necessidade de adaptações."
          />
          <input type="hidden" {...register("mif_usoSanitario")} />
          {layout !== "simplificado" && (
            <MIFSuggestion
              fieldText={watchedFields.usoSanitario}
              fieldName="usoSanitario"
              fieldLabel="Uso do sanitário"
              onConfirm={(score) => handleMIFConfirm("usoSanitario", score)}
            />
          )}
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="controleBexiga">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="controleBexiga" className={cn(layout === "simplificado" && "text-sm")}>
              Controle da bexiga:
            </Label>
            {mifScores.controleBexiga && (
              <Badge variant="outline" className="ml-2">
                MIF: {mifScores.controleBexiga}
              </Badge>
            )}
          </div>
          <Textarea
            id="controleBexiga"
            {...register("controleBexiga")}
            rows={layout === "detalhado" ? 3 : 2}
            placeholder="Descreva o nível de controle da bexiga, uso de dispositivos auxiliares."
          />
          <input type="hidden" {...register("mif_controleBexiga")} />
          {layout !== "simplificado" && (
            <MIFSuggestion
              fieldText={watchedFields.controleBexiga}
              fieldName="controleBexiga"
              fieldLabel="Controle da bexiga"
              onConfirm={(score) => handleMIFConfirm("controleBexiga", score)}
            />
          )}
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="controleIntestino">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="controleIntestino" className={cn(layout === "simplificado" && "text-sm")}>
              Controle do intestino:
            </Label>
            {mifScores.controleIntestino && (
              <Badge variant="outline" className="ml-2">
                MIF: {mifScores.controleIntestino}
              </Badge>
            )}
          </div>
          <Textarea
            id="controleIntestino"
            {...register("controleIntestino")}
            rows={layout === "detalhado" ? 3 : 2}
            placeholder="Descreva o nível de controle do intestino, uso de dispositivos auxiliares."
          />
          <input type="hidden" {...register("mif_controleIntestino")} />
          {layout !== "simplificado" && (
            <MIFSuggestion
              fieldText={watchedFields.controleIntestino}
              fieldName="controleIntestino"
              fieldLabel="Controle do intestino"
              onConfirm={(score) => handleMIFConfirm("controleIntestino", score)}
            />
          )}
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="adaptacoesAVDs">
        <div className="grid gap-2">
          <Label htmlFor="adaptacoesAVDs" className={cn(layout === "simplificado" && "text-sm")}>
            Adaptações utilizadas para AVDs:
          </Label>
          <Textarea
            id="adaptacoesAVDs"
            {...register("adaptacoesAVDs")}
            rows={layout === "detalhado" ? 3 : 2}
            placeholder="Descreva adaptações, dispositivos auxiliares ou estratégias utilizadas para as AVDs."
          />
        </div>
      </CampoEspecialidade>
    </FormSectionWrapper>
  )
}
