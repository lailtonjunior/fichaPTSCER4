"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useFormContext } from "react-hook-form"
import CampoEspecialidade from "../campo-especialidade"

export default function FatoresAmbientais() {
  const { register } = useFormContext()

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">4. FATORES AMBIENTAIS</h2>
      <p className="text-muted-foreground">Identificação de barreiras e facilitadores no ambiente físico e social.</p>

      <div className="grid gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">4.1. Barreiras</h3>

          <div className="grid gap-4">
            <CampoEspecialidade campo="residenciaAdaptada">
              <div className="grid gap-2">
                <Label htmlFor="residenciaAdaptada">Residência adaptada? Riscos de acessibilidade no domicílio?</Label>
                <Textarea id="residenciaAdaptada" {...register("residenciaAdaptada")} rows={2} />
              </div>
            </CampoEspecialidade>

            <CampoEspecialidade campo="dificuldadeTransporte">
              <div className="grid gap-2">
                <Label htmlFor="dificuldadeTransporte">Dificuldade de transporte?</Label>
                <Textarea id="dificuldadeTransporte" {...register("dificuldadeTransporte")} rows={2} />
              </div>
            </CampoEspecialidade>

            <CampoEspecialidade campo="barreirasComTec">
              <div className="grid gap-2">
                <Label htmlFor="barreirasComTec">Barreiras comunicacionais ou tecnológicas?</Label>
                <Textarea id="barreirasComTec" {...register("barreirasComTec")} rows={2} />
              </div>
            </CampoEspecialidade>

            <CampoEspecialidade campo="faltaApoioFamiliar">
              <div className="grid gap-2">
                <Label htmlFor="faltaApoioFamiliar">Falta de apoio familiar ou sobrecarga do cuidador?</Label>
                <Textarea id="faltaApoioFamiliar" {...register("faltaApoioFamiliar")} rows={2} />
              </div>
            </CampoEspecialidade>

            <CampoEspecialidade campo="barreirasAtitudinais">
              <div className="grid gap-2">
                <Label htmlFor="barreirasAtitudinais">Barreiras atitudinais (preconceitos, discriminação)?</Label>
                <Textarea id="barreirasAtitudinais" {...register("barreirasAtitudinais")} rows={2} />
              </div>
            </CampoEspecialidade>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">4.2. Facilitadores</h3>

          <div className="grid gap-4">
            <CampoEspecialidade campo="presencaCuidador">
              <div className="grid gap-2">
                <Label htmlFor="presencaCuidador">Presença de cuidador fixo ou rede de apoio?</Label>
                <Textarea id="presencaCuidador" {...register("presencaCuidador")} rows={2} />
              </div>
            </CampoEspecialidade>

            <CampoEspecialidade campo="usoTecnologia">
              <div className="grid gap-2">
                <Label htmlFor="usoTecnologia">
                  Uso de tecnologia assistiva (cadeira, órtese, prótese, adaptadores)?
                </Label>
                <Textarea id="usoTecnologia" {...register("usoTecnologia")} rows={2} />
              </div>
            </CampoEspecialidade>

            <CampoEspecialidade campo="acessoBeneficios">
              <div className="grid gap-2">
                <Label htmlFor="acessoBeneficios">Acesso a benefícios sociais ou programas de auxílio?</Label>
                <Textarea id="acessoBeneficios" {...register("acessoBeneficios")} rows={2} />
              </div>
            </CampoEspecialidade>

            <CampoEspecialidade campo="boaCompreensao">
              <div className="grid gap-2">
                <Label htmlFor="boaCompreensao">Boa compreensão das orientações pela família?</Label>
                <Textarea id="boaCompreensao" {...register("boaCompreensao")} rows={2} />
              </div>
            </CampoEspecialidade>
          </div>
        </div>
      </div>
    </div>
  )
}
