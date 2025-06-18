"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useFormContext } from "react-hook-form"
import CampoEspecialidade from "../campo-especialidade"

export default function FatoresPessoais() {
  const { register } = useFormContext()

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">6. FATORES PESSOAIS</h2>
      <p className="text-muted-foreground">Características individuais que influenciam adesão e prognóstico.</p>

      <div className="grid gap-6">
        <CampoEspecialidade campo="idadeGeneroEscolaridade">
          <div className="grid gap-2">
            <Label htmlFor="idadeGeneroEscolaridade">Idade, gênero, escolaridade:</Label>
            <Textarea id="idadeGeneroEscolaridade" {...register("idadeGeneroEscolaridade")} rows={2} />
          </div>
        </CampoEspecialidade>

        <CampoEspecialidade campo="ocupacaoPapelSocial">
          <div className="grid gap-2">
            <Label htmlFor="ocupacaoPapelSocial">Ocupação / Papel social:</Label>
            <Textarea id="ocupacaoPapelSocial" {...register("ocupacaoPapelSocial")} rows={2} />
          </div>
        </CampoEspecialidade>

        <CampoEspecialidade campo="condicaoSocioeconomica">
          <div className="grid gap-2">
            <Label htmlFor="condicaoSocioeconomica">Condição socioeconômica:</Label>
            <Textarea id="condicaoSocioeconomica" {...register("condicaoSocioeconomica")} rows={2} />
          </div>
        </CampoEspecialidade>

        <CampoEspecialidade campo="habitosEstiloVida">
          <div className="grid gap-2">
            <Label htmlFor="habitosEstiloVida">
              Hábitos e estilo de vida: Alimentação, prática de atividades físicas, tabagismo, etilismo.
            </Label>
            <Textarea id="habitosEstiloVida" {...register("habitosEstiloVida")} rows={2} />
          </div>
        </CampoEspecialidade>

        <CampoEspecialidade campo="crencasEspiritualidade">
          <div className="grid gap-2">
            <Label htmlFor="crencasEspiritualidade">Crenças, espiritualidade, práticas culturais:</Label>
            <Textarea id="crencasEspiritualidade" {...register("crencasEspiritualidade")} rows={2} />
          </div>
        </CampoEspecialidade>

        <CampoEspecialidade campo="motivacaoEngajamento">
          <div className="grid gap-2">
            <Label htmlFor="motivacaoEngajamento">Motivação e engajamento no tratamento:</Label>
            <Textarea id="motivacaoEngajamento" {...register("motivacaoEngajamento")} rows={2} />
          </div>
        </CampoEspecialidade>

        <CampoEspecialidade campo="expectativasPrioridades">
          <div className="grid gap-2">
            <Label htmlFor="expectativasPrioridades">Expectativas e prioridades pessoais:</Label>
            <Textarea id="expectativasPrioridades" {...register("expectativasPrioridades")} rows={2} />
          </div>
        </CampoEspecialidade>
      </div>
    </div>
  )
}
