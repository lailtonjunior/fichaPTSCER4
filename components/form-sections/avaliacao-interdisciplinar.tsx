"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useFormContext } from "react-hook-form"
import CampoEspecialidade from "../campo-especialidade"

export default function AvaliacaoInterdisciplinar() {
  const { register } = useFormContext()

  const profissionais = [
    { id: "fisioterapia", nome: "Fisioterapia", campo: "fisioterapiaImpressoes", campoMetas: "fisioterapiaMetas" },
    {
      id: "terapiaOcupacional",
      nome: "Terapia Ocupacional",
      campo: "terapiaOcupacionalImpressoes",
      campoMetas: "terapiaOcupacionalMetas",
    },
    {
      id: "fonoaudiologia",
      nome: "Fonoaudiologia",
      campo: "fonoaudiologiaImpressoes",
      campoMetas: "fonoaudiologiaMetas",
    },
    { id: "psicologia", nome: "Psicologia", campo: "psicologiaImpressoes", campoMetas: "psicologiaMetas" },
    { id: "servicoSocial", nome: "Serviço Social", campo: "servicoSocialImpressoes", campoMetas: "servicoSocialMetas" },
    {
      id: "enfermagemMedicina",
      nome: "Enfermagem/Medicina",
      campo: "enfermagemMedicinaImpressoes",
      campoMetas: "enfermagemMedicinaMetas",
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">7. AVALIAÇÃO INTERDISCIPLINAR</h2>
      <p className="text-muted-foreground">
        Espaço para cada área/profissional registrar impressões e plano específico.
      </p>

      <div className="grid gap-6">
        {profissionais.map((profissional) => (
          <CampoEspecialidade key={profissional.id} campo={profissional.campo}>
            <div className="grid gap-4 p-4 border rounded-md">
              <h3 className="font-medium">{profissional.nome}</h3>

              <div className="grid gap-2">
                <Label htmlFor={`${profissional.id}Impressoes`}>Impressões Clínicas / Avaliação</Label>
                <Textarea
                  id={`${profissional.id}Impressoes`}
                  {...register(profissional.campo)}
                  rows={3}
                  placeholder={`Ex.: ${
                    profissional.id === "fisioterapia"
                      ? "Alterações de marcha, equilíbrio, tônus, dor..."
                      : profissional.id === "terapiaOcupacional"
                        ? "Dificuldades nas AVDs, atividades manuais, adaptação de ambiente..."
                        : profissional.id === "fonoaudiologia"
                          ? "Dificuldades de fala, deglutição, audição..."
                          : profissional.id === "psicologia"
                            ? "Aspectos emocionais, adesão, autocuidado..."
                            : profissional.id === "servicoSocial"
                              ? "Situação socioeconômica, benefícios, rede de apoio..."
                              : "Situação de saúde geral, prescrições, complicações clínicas..."
                  }`}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`${profissional.id}Metas`}>Metas Específicas</Label>
                <Textarea
                  id={`${profissional.id}Metas`}
                  {...register(profissional.campoMetas)}
                  rows={3}
                  placeholder={`Ex.: ${
                    profissional.id === "fisioterapia"
                      ? "Melhorar mobilidade, prevenir contraturas..."
                      : profissional.id === "terapiaOcupacional"
                        ? "Promover independência em AVDs, adequar mobiliário..."
                        : profissional.id === "fonoaudiologia"
                          ? "Aprimorar comunicação, ajustar dispositivos auditivos..."
                          : profissional.id === "psicologia"
                            ? "Reduzir ansiedade, melhorar aceitação de tratamento..."
                            : profissional.id === "servicoSocial"
                              ? "Viabilizar acesso a recursos, fortalecer rede de suporte..."
                              : "Controlar comorbidades, prevenir infecções, adequar medicação..."
                  }`}
                />
              </div>
            </div>
          </CampoEspecialidade>
        ))}
      </div>
    </div>
  )
}
