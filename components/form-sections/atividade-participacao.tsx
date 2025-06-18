"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useFormContext } from "react-hook-form"
import { useState } from "react"
import MIFSuggestion from "../mif-suggestion"
import { Badge } from "@/components/ui/badge"
import CampoEspecialidade from "../campo-especialidade"
import FormSectionWrapper from "../form-section-wrapper"
import { useLayoutContext } from "@/components/layout-context"
import { cn } from "@/lib/utils"
import { Activity } from "lucide-react"

export default function AtividadeParticipacao() {
  const { register, setValue, watch } = useFormContext()
  const [mifScores, setMifScores] = useState<Record<string, number>>({})
  const { layout } = useLayoutContext()

  const watchedFields = {
    mobilidadeLocomocao: watch("mobilidadeLocomocao") || "",
    autocuidado: watch("autocuidado") || "",
    comunicacaoInteracao: watch("comunicacaoInteracao") || "",
    vidaDomestica: watch("vidaDomestica") || "",
    educacaoTrabalhoLazer: watch("educacaoTrabalhoLazer") || "",
  }

  const handleMIFConfirm = (fieldName: string, score: number) => {
    setMifScores((prev) => ({ ...prev, [fieldName]: score }))
    setValue(`mif_${fieldName}`, score)
  }

  return (
    <FormSectionWrapper
      title="4. ATIVIDADE E PARTICIPAÇÃO"
      description="Análise da capacidade funcional do paciente em mobilidade, autocuidado e interação social no dia a dia."
      icon={Activity}
    >
      <CampoEspecialidade campo="mobilidadeLocomocao">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="mobilidadeLocomocao" className={cn(layout === "simplificado" && "text-sm")}>
              {layout === "detalhado"
                ? "Mobilidade/Locomoção: Anda com ajuda? Usa cadeira de rodas? Próteses/órteses?"
                : "Mobilidade/Locomoção"}
            </Label>
            {mifScores.mobilidadeLocomocao && (
              <Badge variant="outline" className="ml-2">
                MIF: {mifScores.mobilidadeLocomocao}
              </Badge>
            )}
          </div>
          <Textarea
            id="mobilidadeLocomocao"
            {...register("mobilidadeLocomocao")}
            rows={layout === "detalhado" ? 3 : 2}
          />
          <input type="hidden" {...register("mif_mobilidadeLocomocao")} />
          {layout !== "simplificado" && (
            <MIFSuggestion
              fieldText={watchedFields.mobilidadeLocomocao}
              fieldName="mobilidadeLocomocao"
              fieldLabel="Mobilidade/Locomoção"
              onConfirm={(score) => handleMIFConfirm("mobilidadeLocomocao", score)}
            />
          )}
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="autocuidado">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="autocuidado" className={cn(layout === "simplificado" && "text-sm")}>
              {layout === "detalhado"
                ? "Autocuidado (alimentação, higiene, vestir-se): Nível de dependência."
                : "Autocuidado"}
            </Label>
            {mifScores.autocuidado && (
              <Badge variant="outline" className="ml-2">
                MIF: {mifScores.autocuidado}
              </Badge>
            )}
          </div>
          <Textarea id="autocuidado" {...register("autocuidado")} rows={layout === "detalhado" ? 3 : 2} />
          <input type="hidden" {...register("mif_autocuidado")} />
          {layout !== "simplificado" && (
            <MIFSuggestion
              fieldText={watchedFields.autocuidado}
              fieldName="autocuidado"
              fieldLabel="Autocuidado"
              onConfirm={(score) => handleMIFConfirm("autocuidado", score)}
            />
          )}
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="comunicacaoInteracao">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="comunicacaoInteracao" className={cn(layout === "simplificado" && "text-sm")}>
              {layout === "detalhado"
                ? "Comunicação e interação social: Utiliza fala? Aparelhos auditivos? Linguagem de sinais?"
                : "Comunicação e interação social"}
            </Label>
            {mifScores.comunicacaoInteracao && (
              <Badge variant="outline" className="ml-2">
                MIF: {mifScores.comunicacaoInteracao}
              </Badge>
            )}
          </div>
          <Textarea
            id="comunicacaoInteracao"
            {...register("comunicacaoInteracao")}
            rows={layout === "detalhado" ? 3 : 2}
          />
          <input type="hidden" {...register("mif_comunicacaoInteracao")} />
          {layout !== "simplificado" && (
            <MIFSuggestion
              fieldText={watchedFields.comunicacaoInteracao}
              fieldName="comunicacaoInteracao"
              fieldLabel="Comunicação e interação social"
              onConfirm={(score) => handleMIFConfirm("comunicacaoInteracao", score)}
            />
          )}
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="vidaDomestica">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="vidaDomestica" className={cn(layout === "simplificado" && "text-sm")}>
              {layout === "detalhado"
                ? "Vida doméstica e rotinas diárias: Tarefas domésticas, cuidados pessoais, apoio familiar."
                : "Vida doméstica e rotinas diárias"}
            </Label>
            {mifScores.vidaDomestica && (
              <Badge variant="outline" className="ml-2">
                MIF: {mifScores.vidaDomestica}
              </Badge>
            )}
          </div>
          <Textarea id="vidaDomestica" {...register("vidaDomestica")} rows={layout === "detalhado" ? 3 : 2} />
          <input type="hidden" {...register("mif_vidaDomestica")} />
          {layout !== "simplificado" && (
            <MIFSuggestion
              fieldText={watchedFields.vidaDomestica}
              fieldName="vidaDomestica"
              fieldLabel="Vida doméstica e rotinas diárias"
              onConfirm={(score) => handleMIFConfirm("vidaDomestica", score)}
            />
          )}
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="educacaoTrabalhoLazer">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="educacaoTrabalhoLazer" className={cn(layout === "simplificado" && "text-sm")}>
              {layout === "detalhado"
                ? "Educação/Trabalho/Lazer: Frequenta escola? Trabalha? Participa de atividades de lazer?"
                : "Educação/Trabalho/Lazer"}
            </Label>
            {mifScores.educacaoTrabalhoLazer && (
              <Badge variant="outline" className="ml-2">
                MIF: {mifScores.educacaoTrabalhoLazer}
              </Badge>
            )}
          </div>
          <Textarea
            id="educacaoTrabalhoLazer"
            {...register("educacaoTrabalhoLazer")}
            rows={layout === "detalhado" ? 3 : 2}
          />
          <input type="hidden" {...register("mif_educacaoTrabalhoLazer")} />
          {layout !== "simplificado" && (
            <MIFSuggestion
              fieldText={watchedFields.educacaoTrabalhoLazer}
              fieldName="educacaoTrabalhoLazer"
              fieldLabel="Educação/Trabalho/Lazer"
              onConfirm={(score) => handleMIFConfirm("educacaoTrabalhoLazer", score)}
            />
          )}
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="principaisBarreiras">
        <div className="grid gap-2">
          <Label htmlFor="principaisBarreiras" className={cn(layout === "simplificado" && "text-sm")}>
            Principais Barreiras ou Dificuldades Enfrentadas:
          </Label>
          <Textarea
            id="principaisBarreiras"
            {...register("principaisBarreiras")}
            rows={layout === "detalhado" ? 3 : 2}
          />
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="principaisPotencialidades">
        <div className="grid gap-2">
          <Label htmlFor="principaisPotencialidades" className={cn(layout === "simplificado" && "text-sm")}>
            Principais Potencialidades ou Capacidades Mantidas:
          </Label>
          <Textarea
            id="principaisPotencialidades"
            {...register("principaisPotencialidades")}
            rows={layout === "detalhado" ? 3 : 2}
          />
        </div>
      </CampoEspecialidade>
    </FormSectionWrapper>
  )
}
