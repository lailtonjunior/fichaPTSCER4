"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useFormContext } from "react-hook-form"
import CampoEspecialidade from "../campo-especialidade"

export default function PlanejamentoTerapeutico() {
  const { register } = useFormContext()

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">9. PLANEJAMENTO TERAPÊUTICO E ACOMPANHAMENTO</h2>

      <div className="grid gap-6">
        <CampoEspecialidade campo="frequenciaAtendimentos">
          <div className="grid gap-2">
            <Label htmlFor="frequenciaAtendimentos">Frequência de atendimentos (semanal, quinzenal, mensal):</Label>
            <Textarea id="frequenciaAtendimentos" {...register("frequenciaAtendimentos")} rows={2} />
          </div>
        </CampoEspecialidade>

        <CampoEspecialidade campo="metodosEstrategias">
          <div className="grid gap-2">
            <Label htmlFor="metodosEstrategias">
              Métodos e estratégias (terapia individual, grupos, visitas domiciliares etc.):
            </Label>
            <Textarea id="metodosEstrategias" {...register("metodosEstrategias")} rows={2} />
          </div>
        </CampoEspecialidade>

        <CampoEspecialidade campo="escalasTestesAplicados">
          <div className="grid gap-2">
            <Label htmlFor="escalasTestesAplicados">
              Escalas e testes aplicados (Barthel, MIF, EVA de dor, Braden Scale para úlceras, etc.):
            </Label>
            <Textarea id="escalasTestesAplicados" {...register("escalasTestesAplicados")} rows={2} />
          </div>
        </CampoEspecialidade>

        <CampoEspecialidade campo="dataReavaliacao">
          <div className="grid gap-2">
            <Label htmlFor="dataReavaliacao">
              Data(s) prevista(s) para reavaliação (ex.: após 30 dias / 90 dias / 6 meses):
            </Label>
            <Textarea id="dataReavaliacao" {...register("dataReavaliacao")} rows={2} />
          </div>
        </CampoEspecialidade>

        <CampoEspecialidade campo="registroEvolucao">
          <div className="grid gap-2">
            <Label htmlFor="registroEvolucao">
              Registro de evolução: espaço para a equipe anotar progressos ou ajustes necessários nas metas.
            </Label>
            <Textarea id="registroEvolucao" {...register("registroEvolucao")} rows={4} />
          </div>
        </CampoEspecialidade>
      </div>
    </div>
  )
}
