import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useFormContext } from "react-hook-form"
import CampoEspecialidade from "../campo-especialidade"
import FormSectionWrapper from "../form-section-wrapper"
import { useLayoutContext } from "@/components/layout-context"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ClipboardList } from "lucide-react"

export default function HistoricoMedico() {
  const { register, watch } = useFormContext()
  const { layout } = useLayoutContext()

  const temDoencaPrevia = watch("temDoencaPrevia") || false

  return (
    <FormSectionWrapper
      title="2. HISTÓRICO MÉDICO"
      description="Registro cronológico de condições médicas, tratamentos anteriores e evolução clínica do paciente."
      icon={ClipboardList}
    >
      <CampoEspecialidade campo="dataInicioSintomas">
        <div className="grid gap-2">
          <Label htmlFor="dataInicioSintomas" className={cn(layout === "simplificado" && "text-sm")}>
            Data de início dos sintomas / Tempo de evolução:
          </Label>
          <Input id="dataInicioSintomas" {...register("dataInicioSintomas")} />
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="historicoCondicaoAtual">
        <div className="grid gap-2">
          <Label htmlFor="historicoCondicaoAtual" className={cn(layout === "simplificado" && "text-sm")}>
            Histórico da condição atual:
          </Label>
          <Textarea
            id="historicoCondicaoAtual"
            {...register("historicoCondicaoAtual")}
            rows={layout === "detalhado" ? 4 : layout === "compacto" ? 3 : 2}
            placeholder="Descreva como a condição atual se desenvolveu, incluindo eventos precipitantes, tratamentos anteriores e evolução dos sintomas."
          />
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="temDoencaPrevia">
        <div className="grid gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="temDoencaPrevia" {...register("temDoencaPrevia")} />
            <Label htmlFor="temDoencaPrevia" className={cn(layout === "simplificado" && "text-sm")}>
              Possui doenças prévias ou comorbidades?
            </Label>
          </div>

          {temDoencaPrevia && (
            <div className="grid gap-2 mt-2 pl-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="hipertensao" {...register("hipertensao")} />
                  <Label htmlFor="hipertensao">Hipertensão</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="diabetes" {...register("diabetes")} />
                  <Label htmlFor="diabetes">Diabetes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="cardiopatia" {...register("cardiopatia")} />
                  <Label htmlFor="cardiopatia">Cardiopatia</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="doencaRespiratoria" {...register("doencaRespiratoria")} />
                  <Label htmlFor="doencaRespiratoria">Doença Respiratória</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="doencaReumatica" {...register("doencaReumatica")} />
                  <Label htmlFor="doencaReumatica">Doença Reumática</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="doencaNeurologica" {...register("doencaNeurologica")} />
                  <Label htmlFor="doencaNeurologica">Doença Neurológica</Label>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="outrasDoencas">Outras doenças ou comorbidades:</Label>
                <Textarea id="outrasDoencas" {...register("outrasDoencas")} rows={2} />
              </div>
            </div>
          )}
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="medicamentosAtuais">
        <div className="grid gap-2">
          <Label htmlFor="medicamentosAtuais" className={cn(layout === "simplificado" && "text-sm")}>
            Medicamentos em uso atual:
          </Label>
          <Textarea
            id="medicamentosAtuais"
            {...register("medicamentosAtuais")}
            rows={layout === "detalhado" ? 3 : 2}
            placeholder="Liste os medicamentos, dosagens e frequência de uso."
          />
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="cirurgiasRealizadas">
        <div className="grid gap-2">
          <Label htmlFor="cirurgiasRealizadas" className={cn(layout === "simplificado" && "text-sm")}>
            Cirurgias realizadas:
          </Label>
          <Textarea
            id="cirurgiasRealizadas"
            {...register("cirurgiasRealizadas")}
            rows={layout === "detalhado" ? 3 : 2}
            placeholder="Descreva cirurgias anteriores, datas e resultados."
          />
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="historicoFamiliar">
        <div className="grid gap-2">
          <Label htmlFor="historicoFamiliar" className={cn(layout === "simplificado" && "text-sm")}>
            Histórico familiar relevante:
          </Label>
          <Textarea
            id="historicoFamiliar"
            {...register("historicoFamiliar")}
            rows={layout === "detalhado" ? 3 : 2}
            placeholder="Condições hereditárias ou doenças recorrentes na família."
          />
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="nivelDor">
        <div className="grid gap-2">
          <Label className={cn(layout === "simplificado" && "text-sm")}>
            Nível de dor (Escala Visual Analógica - EVA):
          </Label>
          <RadioGroup {...register("nivelDor")}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="dor-0" />
                <Label htmlFor="dor-0">0 - Sem dor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1-3" id="dor-1-3" />
                <Label htmlFor="dor-1-3">1-3 - Leve</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4-6" id="dor-4-6" />
                <Label htmlFor="dor-4-6">4-6 - Moderada</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="7-9" id="dor-7-9" />
                <Label htmlFor="dor-7-9">7-9 - Intensa</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="10" id="dor-10" />
                <Label htmlFor="dor-10">10 - Insuportável</Label>
              </div>
            </div>
          </RadioGroup>

          <div className="grid gap-2 mt-2">
            <Label htmlFor="localizacaoDor" className={cn(layout === "simplificado" && "text-sm")}>
              Localização e características da dor:
            </Label>
            <Textarea
              id="localizacaoDor"
              {...register("localizacaoDor")}
              rows={2}
              placeholder="Descreva onde a dor está localizada, se é constante ou intermitente, o que alivia ou piora."
            />
          </div>
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="tratamentosAnteriores">
        <div className="grid gap-2">
          <Label htmlFor="tratamentosAnteriores" className={cn(layout === "simplificado" && "text-sm")}>
            Tratamentos anteriores para a condição atual:
          </Label>
          <Textarea
            id="tratamentosAnteriores"
            {...register("tratamentosAnteriores")}
            rows={layout === "detalhado" ? 3 : 2}
            placeholder="Descreva tratamentos anteriores, incluindo fisioterapia, terapia ocupacional, fonoaudiologia, etc."
          />
        </div>
      </CampoEspecialidade>
    </FormSectionWrapper>
  )
}
