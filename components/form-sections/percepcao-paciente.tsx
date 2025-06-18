import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useFormContext } from "react-hook-form"
import FormSectionWrapper from "../form-section-wrapper"
import { useLayoutContext } from "@/components/layout-context"
import { cn } from "@/lib/utils"
import CampoEspecialidade from "../campo-especialidade"
import { Eye } from "lucide-react"

export default function PercepcaoPaciente() {
  const { register } = useFormContext()
  const { layout } = useLayoutContext()

  return (
    <FormSectionWrapper
      title="3. PERCEPÇÃO DO PACIENTE/FAMÍLIA"
      description="Registro das expectativas, dificuldades e prioridades relatadas pelo paciente e seus familiares."
      icon={Eye}
    >
      <CampoEspecialidade campo="dificuldadesRelatadas">
        <div className="grid gap-2">
          <Label htmlFor="dificuldadesRelatadas" className={cn(layout === "simplificado" && "text-sm")}>
            Quais as principais dificuldades relatadas pelo paciente/família?
          </Label>
          <Textarea
            id="dificuldadesRelatadas"
            {...register("dificuldadesRelatadas")}
            rows={layout === "detalhado" ? 4 : layout === "compacto" ? 3 : 2}
            placeholder="Descreva as principais dificuldades relatadas pelo paciente e/ou família"
          />
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="expectativasTratamento">
        <div className="grid gap-2">
          <Label htmlFor="expectativasTratamento" className={cn(layout === "simplificado" && "text-sm")}>
            O que o paciente/família espera do tratamento?
          </Label>
          <Textarea
            id="expectativasTratamento"
            {...register("expectativasTratamento")}
            rows={layout === "detalhado" ? 4 : layout === "compacto" ? 3 : 2}
            placeholder="Descreva as expectativas do paciente e/ou família em relação ao tratamento"
          />
        </div>
      </CampoEspecialidade>

      <CampoEspecialidade campo="metasImportantes">
        <div className="grid gap-2">
          <Label htmlFor="metasImportantes" className={cn(layout === "simplificado" && "text-sm")}>
            Quais metas ou atividades são consideradas mais importantes para ele/ela?
          </Label>
          <Textarea
            id="metasImportantes"
            {...register("metasImportantes")}
            rows={layout === "detalhado" ? 4 : layout === "compacto" ? 3 : 2}
            placeholder="Descreva as metas consideradas mais importantes pelo paciente e/ou família"
          />
          {layout !== "simplificado" && (
            <p
              className={cn(
                "italic",
                layout === "detalhado" && "text-sm text-muted-foreground",
                layout === "compacto" && "text-xs text-muted-foreground",
              )}
            >
              (Esse espaço valoriza o protagonismo e a voz do paciente e da família.)
            </p>
          )}
        </div>
      </CampoEspecialidade>
    </FormSectionWrapper>
  )
}
