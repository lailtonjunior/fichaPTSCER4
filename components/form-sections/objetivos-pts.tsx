"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useFormContext } from "react-hook-form"
import CampoEspecialidade from "../campo-especialidade"

export default function ObjetivosPTS() {
  const { register } = useFormContext()

  const prazos = [
    {
      id: "curtoPrazo",
      nome: "Curto prazo",
      descricao:
        "(até 1 mês) – ex.: manter a amplitude articular, reduzir dor, envolver família na rotina de exercícios em casa",
    },
    {
      id: "medioPrazo",
      nome: "Médio prazo",
      descricao:
        "(1 a 6 meses) – ex.: alcançar maior independência em AVDs, iniciar uso de tecnologia assistiva, promover interação social",
    },
    {
      id: "longoPrazo",
      nome: "Longo prazo",
      descricao:
        "(6 meses ou mais) – ex.: estabilizar quadro, prevenir complicações, garantir participação efetiva em atividades comunitárias",
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">8. OBJETIVOS DO PROJETO TERAPÊUTICO SINGULAR (PTS)</h2>

      <div className="grid gap-6">
        {prazos.map((prazo) => (
          <CampoEspecialidade key={prazo.id} campo={prazo.id}>
            <div className="grid gap-2">
              <Label htmlFor={prazo.id}>
                <span className="font-medium">{prazo.nome}</span>{" "}
                <span className="text-muted-foreground text-sm">{prazo.descricao}</span>
              </Label>
              <Textarea id={prazo.id} {...register(prazo.id)} rows={3} />
            </div>
          </CampoEspecialidade>
        ))}

        <p className="text-sm text-muted-foreground italic">
          (Esses objetivos devem ser traçados com a participação do paciente/família.)
        </p>
      </div>
    </div>
  )
}
