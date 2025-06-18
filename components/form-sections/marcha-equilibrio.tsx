"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useFormContext } from "react-hook-form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import CampoEspecialidade from "../campo-especialidade"
import FormSectionWrapper from "../form-section-wrapper"
import { useLayoutContext } from "@/components/layout-context"
import { cn } from "@/lib/utils"

export default function MarchaEquilibrio() {
  const { register, watch } = useFormContext()
  const { layout } = useLayoutContext()

  const usaDispositivo = watch("usaDispositivo") || false

  return (
    <FormSectionWrapper
      title="5.1. AVALIAÇÃO DE MARCHA E EQUILÍBRIO"
      description={layout !== "simplificado" ? "Análise detalhada da marcha e equilíbrio do paciente." : undefined}
    >
      <CampoEspecialidade campo="padraoDeMarchaGeral">
        <div className="grid gap-2">
          <Label htmlFor="padraoDeMarchaGeral" className={cn(layout === "simplificado" && "text-sm")}>
            Padrão de marcha geral:
          </Label>
          <RadioGroup {...register("padraoDeMarchaGeral")}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="marcha-normal" />
                <Label htmlFor="marcha-normal">Normal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hemiparética" id="marcha-hemiparética" />
                <Label htmlFor="marcha-hemiparética">Hemiparética</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="atáxica" id="marcha-atáxica" />
                <Label htmlFor="marcha-atáxica">Atáxica</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="parkinsoniana" id="marcha-parkinsoniana" />
                <Label htmlFor="marcha-parkinsoniana">Parkinsoniana</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="antálgica" id="marcha-antálgica" />
                <Label htmlFor="marcha-antálgica">Antálgica</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="claudicante" id="marcha-claudicante" />
                <Label htmlFor="marcha-claudicante">Claudicante</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="não deambula" id="marcha-não-deambula" />
                <Label htmlFor="marcha-não-deambula">Não deambula</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="outro" id="marcha-outro" />
                <Label htmlFor="marcha-outro">Outro</Label>
              </div>
            </div>
          </RadioGroup>

          <Textarea
            id="descricaoMarchaOutro"
            {...register("descricaoMarchaOutro")}
            rows={2}
            placeholder="Descreva outros padrões de marcha ou detalhes adicionais."
            className="mt-2"
          />
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="usaDispositivo">
        <div className="grid gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="usaDispositivo" {...register("usaDispositivo")} />
            <Label htmlFor="usaDispositivo" className={cn(layout === "simplificado" && "text-sm")}>
              Usa dispositivo auxiliar para marcha?
            </Label>
          </div>

          {usaDispositivo && (
            <div className="grid gap-2 mt-2 pl-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="bengala" {...register("bengala")} />
                  <Label htmlFor="bengala">Bengala</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="muleta" {...register("muleta")} />
                  <Label htmlFor="muleta">Muleta</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="andador" {...register("andador")} />
                  <Label htmlFor="andador">Andador</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="cadeiraRodas" {...register("cadeiraRodas")} />
                  <Label htmlFor="cadeiraRodas">Cadeira de Rodas</Label>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="outrosDispositivos">Outros dispositivos:</Label>
                <Textarea id="outrosDispositivos" {...register("outrosDispositivos")} rows={2} />
              </div>
            </div>
          )}
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="avaliacaoEquilibrio">
        <div className="grid gap-2">
          <Label htmlFor="avaliacaoEquilibrio" className={cn(layout === "simplificado" && "text-sm")}>
            Avaliação do equilíbrio:
          </Label>
          <RadioGroup {...register("avaliacaoEquilibrio")}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="equilibrio-normal" />
                <Label htmlFor="equilibrio-normal">Normal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="levemente alterado" id="equilibrio-levemente" />
                <Label htmlFor="equilibrio-levemente">Levemente alterado</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderadamente alterado" id="equilibrio-moderadamente" />
                <Label htmlFor="equilibrio-moderadamente">Moderadamente alterado</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="severamente alterado" id="equilibrio-severamente" />
                <Label htmlFor="equilibrio-severamente">Severamente alterado</Label>
              </div>
            </div>
          </RadioGroup>
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="equilibrioEstatico">
        <div className="grid gap-2">
          <Label htmlFor="equilibrioEstatico" className={cn(layout === "simplificado" && "text-sm")}>
            Equilíbrio estático:
          </Label>
          <Textarea
            id="equilibrioEstatico"
            {...register("equilibrioEstatico")}
            rows={layout === "detalhado" ? 3 : 2}
            placeholder="Avalie o equilíbrio em posição sentada e em pé, com olhos abertos e fechados."
          />
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="equilibrioDinamico">
        <div className="grid gap-2">
          <Label htmlFor="equilibrioDinamico" className={cn(layout === "simplificado" && "text-sm")}>
            Equilíbrio dinâmico:
          </Label>
          <Textarea
            id="equilibrioDinamico"
            {...register("equilibrioDinamico")}
            rows={layout === "detalhado" ? 3 : 2}
            placeholder="Avalie o equilíbrio durante a marcha, mudanças de direção e ao transpor obstáculos."
          />
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="riscoDeCaidas">
        <div className="grid gap-2">
          <Label htmlFor="riscoDeCaidas" className={cn(layout === "simplificado" && "text-sm")}>
            Risco de quedas:
          </Label>
          <RadioGroup {...register("riscoDeCaidas")}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="baixo" id="risco-baixo" />
                <Label htmlFor="risco-baixo">Baixo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderado" id="risco-moderado" />
                <Label htmlFor="risco-moderado">Moderado</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="alto" id="risco-alto" />
                <Label htmlFor="risco-alto">Alto</Label>
              </div>
            </div>
          </RadioGroup>

          <div className="grid gap-2 mt-2">
            <Label htmlFor="historicoQuedas" className={cn(layout === "simplificado" && "text-sm")}>
              Histórico de quedas:
            </Label>
            <Textarea
              id="historicoQuedas"
              {...register("historicoQuedas")}
              rows={2}
              placeholder="Descreva quedas anteriores, frequência, circunstâncias e consequências."
            />
          </div>
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="testesEquilibrio">
        <div className="grid gap-2">
          <Label htmlFor="testesEquilibrio" className={cn(layout === "simplificado" && "text-sm")}>
            Testes de equilíbrio aplicados (Berg, Tinetti, TUG, etc.):
          </Label>
          <Textarea
            id="testesEquilibrio"
            {...register("testesEquilibrio")}
            rows={layout === "detalhado" ? 3 : 2}
            placeholder="Descreva os testes aplicados e seus resultados."
          />
        </div>
      </CampoEspecialidade>
    </FormSectionWrapper>
  )
}
