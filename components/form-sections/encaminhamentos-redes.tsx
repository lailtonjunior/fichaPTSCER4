import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useFormContext } from "react-hook-form"

export default function EncaminhamentosRedes() {
  const { register } = useFormContext()

  const encaminhamentos = [
    { id: "reabilitacaoAuditiva", texto: "Avaliação em Reabilitação Auditiva (perda auditiva, uso de AASI, etc.)" },
    {
      id: "reabilitacaoIntelectual",
      texto: "Avaliação em Reabilitação Intelectual (dificuldades cognitivas, comportamentais, inclusão escolar)",
    },
    {
      id: "reabilitacaoVisual",
      texto: "Avaliação em Reabilitação Visual (dúvidas sobre acuidade visual, uso de recursos de baixa visão)",
    },
    {
      id: "dispensacaoOPM",
      texto: "Dispensação de OPM / Bolsas Coletoras (aparelhos ortopédicos, próteses, bolsas etc.)",
    },
    {
      id: "encaminhamentoSaude",
      texto: "Encaminhamento para outros serviços de saúde (alta complexidade, especialistas)",
    },
    { id: "encaminhamentoAssistencia", texto: "Encaminhamento à assistência social / serviços de convivência" },
    { id: "encaminhamentoEducacao", texto: "Encaminhamento à educação (escolas inclusivas)" },
    { id: "encaminhamentoOutros", texto: "Outros" },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">10. POSSÍVEIS ENCAMINHAMENTOS INTERMODALIDADES / OUTRAS REDES</h2>

      <div className="grid gap-4">
        {encaminhamentos.map((encaminhamento) => (
          <div key={encaminhamento.id} className="flex items-start space-x-2">
            <Checkbox id={encaminhamento.id} {...register(encaminhamento.id)} className="mt-1" />
            <Label htmlFor={encaminhamento.id} className="leading-tight">
              {encaminhamento.texto}
            </Label>
          </div>
        ))}

        <div className="grid gap-2 mt-4">
          <Label htmlFor="outrosEncaminhamentos">Especifique outros encaminhamentos:</Label>
          <Textarea id="outrosEncaminhamentos" {...register("outrosEncaminhamentos")} rows={3} />
        </div>
      </div>
    </div>
  )
}
