import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useFormContext } from "react-hook-form"
import FormSectionWrapper from "../form-section-wrapper"
import { UserCircle } from "lucide-react"

export default function IdentificacaoPaciente() {
  const { register } = useFormContext()

  return (
    <FormSectionWrapper
      title="1. IDENTIFICAÇÃO DO PACIENTE"
      description="Informações básicas do paciente para identificação e contato."
      icon={UserCircle}
    >
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="nome">Nome completo:</Label>
          <Input id="nome" {...register("nome")} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="dataNascimento">Data de nascimento / Idade:</Label>
            <Input id="dataNascimento" {...register("dataNascimento")} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sexo">Sexo:</Label>
            <Input id="sexo" {...register("sexo")} />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="endereco">Endereço / Município de origem:</Label>
          <Input id="endereco" {...register("endereco")} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="contato">Contato (telefone/e-mail):</Label>
          <Input id="contato" {...register("contato")} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="diagnostico">Diagnóstico principal (CID-10):</Label>
          <Input id="diagnostico" {...register("diagnostico")} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="motivoEncaminhamento">Motivo do encaminhamento / Queixa principal:</Label>
          <Input id="motivoEncaminhamento" {...register("motivoEncaminhamento")} />
        </div>

        <div className="space-y-4">
          <Label>Modalidade de entrada:</Label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="modalidadeFisica" {...register("modalidadeFisica")} />
              <Label htmlFor="modalidadeFisica">Física</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="modalidadeAuditiva" {...register("modalidadeAuditiva")} />
              <Label htmlFor="modalidadeAuditiva">Auditiva</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="modalidadeIntelectual" {...register("modalidadeIntelectual")} />
              <Label htmlFor="modalidadeIntelectual">Intelectual</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="modalidadeVisual" {...register("modalidadeVisual")} />
              <Label htmlFor="modalidadeVisual">Visual</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="modalidadeOPM" {...register("modalidadeOPM")} />
              <Label htmlFor="modalidadeOPM">OPM/Bolsas</Label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Profissionais envolvidos:</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="profFisioterapia" {...register("profFisioterapia")} />
              <Label htmlFor="profFisioterapia">Fisioterapia</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="profTO" {...register("profTO")} />
              <Label htmlFor="profTO">TO</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="profFono" {...register("profFono")} />
              <Label htmlFor="profFono">Fono</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="profPsicologia" {...register("profPsicologia")} />
              <Label htmlFor="profPsicologia">Psicologia</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="profAssistenciaSocial" {...register("profAssistenciaSocial")} />
              <Label htmlFor="profAssistenciaSocial">Assistência Social</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="profEnfermagem" {...register("profEnfermagem")} />
              <Label htmlFor="profEnfermagem">Enfermagem</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="profMedicina" {...register("profMedicina")} />
              <Label htmlFor="profMedicina">Medicina</Label>
            </div>
          </div>
        </div>
      </div>
    </FormSectionWrapper>
  )
}
