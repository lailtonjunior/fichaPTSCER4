import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useFormContext } from "react-hook-form"

export default function CriteriosAlta() {
  const { register } = useFormContext()

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">11. CRITÉRIOS DE ALTA / TRANSFERÊNCIA / REAVALIAÇÃO</h2>
      <p className="text-muted-foreground">Quando encerrar ou transferir o caso?</p>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="criteriosAlta">Critérios para alta ou transferência:</Label>
          <Textarea
            id="criteriosAlta"
            {...register("criteriosAlta")}
            rows={4}
            placeholder="Ex.: Ao atingir metas funcionais estabelecidas. Se estabilização do quadro sem possibilidades de ganhos adicionais. Se houver necessidade de mudança de modalidade ou serviço. A pedido do paciente/família. Direcionar o paciente para acompanhamento em atenção primária ou outros serviços da rede."
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="registroAlta">
            Registrar data, motivos, e orientações pós-alta para acompanhamento ou nova avaliação:
          </Label>
          <Textarea id="registroAlta" {...register("registroAlta")} rows={4} />
        </div>
      </div>

      <div className="mt-8 p-4 bg-muted rounded-md">
        <h3 className="font-semibold mb-2">ORIENTAÇÕES GERAIS PARA USO</h3>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>
            <strong>Personalização:</strong> Embora seja um modelo-padrão, cada profissional/equipe deve adaptá-lo às
            necessidades específicas do paciente.
          </li>
          <li>
            <strong>Interdisciplinaridade:</strong> Ideal que todas as áreas preencham e discutam juntas as metas.
          </li>
          <li>
            <strong>Centrado no Paciente e Família:</strong> Garantir espaço de escuta ativa, registrando objetivos que
            realmente façam sentido na vida real do paciente.
          </li>
          <li>
            <strong>Registro de Evolução:</strong> Manter notas periódicas sobre o progresso e reavaliar as metas sempre
            que necessário.
          </li>
          <li>
            <strong>Integração com Prontuário:</strong> Se houver prontuário eletrônico, considerar automatizar ou
            digitalizar esse modelo para facilitar consultas e atualizações pela equipe.
          </li>
        </ul>
      </div>
    </div>
  )
}
