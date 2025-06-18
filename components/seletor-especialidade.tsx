"use client"

import { useEspecialidade, type Especialidade } from "./especialidade-context"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Users } from "lucide-react"

export default function SeletorEspecialidade() {
  const { especialidadeSelecionada, setEspecialidadeSelecionada } = useEspecialidade()

  const especialidades = [
    { valor: "todas", nome: "Todas as Especialidades" },
    { valor: "fisioterapia", nome: "Fisioterapia" },
    { valor: "terapia_ocupacional", nome: "Terapia Ocupacional" },
    { valor: "fonoaudiologia", nome: "Fonoaudiologia" },
    { valor: "psicologia", nome: "Psicologia" },
    { valor: "assistencia_social", nome: "Assistência Social" },
    { valor: "enfermagem", nome: "Enfermagem" },
    { valor: "medicina", nome: "Medicina" },
    { valor: "nutricao", nome: "Nutrição" },
    { valor: "pedagogia", nome: "Pedagogia" },
    { valor: "educador_fisico", nome: "Educador Físico" },
    { valor: "musicoterapia", nome: "Musicoterapia" },
  ]

  return (
    <div className="border border-muted rounded-lg p-4 bg-card">
      <h3 className="text-base font-medium mb-3 flex items-center gap-2">
        <Users className="h-4 w-4" />
        Filtrar por Especialidade
      </h3>
      <Select
        value={especialidadeSelecionada}
        onValueChange={(value) => setEspecialidadeSelecionada(value as Especialidade)}
      >
        <SelectTrigger className="w-full" aria-label="Selecionar especialidade">
          <SelectValue placeholder="Selecione uma especialidade" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Especialidades</SelectLabel>
            {especialidades.map((esp) => (
              <SelectItem key={esp.valor} value={esp.valor}>
                {esp.nome}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
