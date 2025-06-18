"use client"

import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Check } from "lucide-react"
import { formatarData } from "@/lib/utils"

export default function ResumoEspecialidades() {
  const { watch } = useFormContext()
  const [activeTab, setActiveTab] = useState("fisio")
  const [copiado, setCopiado] = useState<Record<string, boolean>>({
    fisio: false,
    fono: false,
    psico: false,
    medico: false,
  })

  // Dados do paciente
  const nome = watch("nome") || "[Nome do Paciente]"
  const idade = watch("dataNascimento") || "[Idade]"
  const sexo = watch("sexo") || "[Sexo]"
  const diagnostico = watch("diagnostico") || "[Diagnóstico]"

  // Dados de mobilidade e função
  const mobilidade = watch("mobilidadeLocomocao") || ""
  const mifMobilidade = watch("mif_mobilidadeLocomocao") || ""
  const autocuidado = watch("autocuidado") || ""
  const mifAutocuidado = watch("mif_autocuidado") || ""
  const comunicacao = watch("comunicacaoInteracao") || ""
  const mifComunicacao = watch("mif_comunicacaoInteracao") || ""
  const forcaTonos = watch("forcaTonosCoord") || ""
  const dor = watch("presencaDor") || ""
  const cognitivo = watch("funcoesCognitivas") || ""
  const mifCognitivo = watch("mif_funcoesCognitivas") || ""

  // Dados de avaliação interdisciplinar
  const fisioImpressoes = watch("fisioterapiaImpressoes") || ""
  const fisioMetas = watch("fisioterapiaMetas") || ""
  const fonoImpressoes = watch("fonoaudiologiaImpressoes") || ""
  const fonoMetas = watch("fonoaudiologiaMetas") || ""
  const psicoImpressoes = watch("psicologiaImpressoes") || ""
  const psicoMetas = watch("psicologiaMetas") || ""
  const medicoImpressoes = watch("enfermagemMedicinaImpressoes") || ""
  const medicoMetas = watch("enfermagemMedicinaMetas") || ""

  // Dados de planejamento
  const frequencia = watch("frequenciaAtendimentos") || ""
  const metodos = watch("metodosEstrategias") || ""
  const escalas = watch("escalasTestesAplicados") || ""

  // Função para obter descrição do MIF
  const getMIFDescricao = (valor: string) => {
    if (!valor) return ""

    const score = Number.parseInt(valor)
    switch (score) {
      case 1:
        return "Dependência Total"
      case 2:
        return "Dependência Máxima"
      case 3:
        return "Dependência Moderada"
      case 4:
        return "Dependência Mínima"
      case 5:
        return "Supervisão/Preparo"
      case 6:
        return "Independência Modificada"
      case 7:
        return "Independência Completa"
      default:
        return ""
    }
  }

  // Gerar resumo de Fisioterapia
  const gerarResumoFisio = () => {
    const dataAtual = formatarData(new Date())

    return `EVOLUÇÃO FISIOTERAPIA - ${dataAtual}

Paciente: ${nome}
Idade: ${idade}
Sexo: ${sexo}
Diagnóstico: ${diagnostico}

AVALIAÇÃO FUNCIONAL:
- Mobilidade/Locomoção: ${mobilidade}${mifMobilidade ? ` (MIF: ${mifMobilidade} - ${getMIFDescricao(mifMobilidade)})` : ""}
- Força/Tônus/Coordenação: ${forcaTonos}
- Dor: ${dor}
- Autocuidado: ${autocuidado}${mifAutocuidado ? ` (MIF: ${mifAutocuidado} - ${getMIFDescricao(mifAutocuidado)})` : ""}

CONDUTA REALIZADA:
${fisioImpressoes}

OBJETIVOS TERAPÊUTICOS:
${fisioMetas}

PLANO:
- Frequência: ${frequencia}
- Métodos: ${metodos}

Assinatura: ______________________________
Fisioterapeuta - CREFITO XX/XXXXX-X`
  }

  // Gerar resumo de Fonoaudiologia
  const gerarResumoFono = () => {
    const dataAtual = formatarData(new Date())

    return `EVOLUÇÃO FONOAUDIOLOGIA - ${dataAtual}

Paciente: ${nome}
Idade: ${idade}
Sexo: ${sexo}
Diagnóstico: ${diagnostico}

AVALIAÇÃO FUNCIONAL:
- Comunicação: ${comunicacao}${mifComunicacao ? ` (MIF: ${mifComunicacao} - ${getMIFDescricao(mifComunicacao)})` : ""}
- Funções Cognitivas: ${cognitivo}${mifCognitivo ? ` (MIF: ${mifCognitivo} - ${getMIFDescricao(mifCognitivo)})` : ""}

CONDUTA REALIZADA:
${fonoImpressoes}

OBJETIVOS TERAPÊUTICOS:
${fonoMetas}

PLANO:
- Frequência: ${frequencia}
- Métodos: ${metodos}
- Escalas aplicadas: ${escalas}

Assinatura: ______________________________
Fonoaudiólogo(a) - CRFa XX/XXXXX-X`
  }

  // Gerar resumo de Psicologia
  const gerarResumoPsico = () => {
    const dataAtual = formatarData(new Date())

    return `EVOLUÇÃO PSICOLOGIA - ${dataAtual}

Paciente: ${nome}
Idade: ${idade}
Sexo: ${sexo}
Diagnóstico: ${diagnostico}

AVALIAÇÃO PSICOLÓGICA:
- Funções Cognitivas/Comportamentais: ${cognitivo}${mifCognitivo ? ` (MIF: ${mifCognitivo} - ${getMIFDescricao(mifCognitivo)})` : ""}
- Comunicação e Interação Social: ${comunicacao}

CONDUTA REALIZADA:
${psicoImpressoes}

OBJETIVOS TERAPÊUTICOS:
${psicoMetas}

PLANO:
- Frequência: ${frequencia}
- Métodos: ${metodos}

Assinatura: ______________________________
Psicólogo(a) - CRP XX/XXXXX`
  }

  // Gerar resumo Médico
  const gerarResumoMedico = () => {
    const dataAtual = formatarData(new Date())

    return `EVOLUÇÃO MÉDICA - ${dataAtual}

Paciente: ${nome}
Idade: ${idade}
Sexo: ${sexo}
Diagnóstico: ${diagnostico}

AVALIAÇÃO CLÍNICA:
- Mobilidade: ${mobilidade}
- Dor: ${dor}
- Autocuidado: ${autocuidado}
- Funções Cognitivas: ${cognitivo}

CONDUTA REALIZADA:
${medicoImpressoes}

PLANO TERAPÊUTICO:
${medicoMetas}

ORIENTAÇÕES E PRESCRIÇÕES:
- Frequência de atendimentos: ${frequencia}
- Escalas aplicadas: ${escalas}

Assinatura: ______________________________
Médico(a) - CRM XX/XXXXX`
  }

  // Obter o resumo ativo com base na aba selecionada
  const getResumoAtivo = () => {
    switch (activeTab) {
      case "fisio":
        return gerarResumoFisio()
      case "fono":
        return gerarResumoFono()
      case "psico":
        return gerarResumoPsico()
      case "medico":
        return gerarResumoMedico()
      default:
        return ""
    }
  }

  // Função para copiar o texto para a área de transferência
  const copiarTexto = async (tipo: string) => {
    const texto = getResumoAtivo()

    try {
      await navigator.clipboard.writeText(texto)
      setCopiado({ ...copiado, [tipo]: true })

      // Resetar o ícone após 2 segundos
      setTimeout(() => {
        setCopiado({ ...copiado, [tipo]: false })
      }, 2000)
    } catch (err) {
      console.error("Erro ao copiar texto:", err)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo para Prontuário Eletrônico</CardTitle>
        <CardDescription>
          Selecione a especialidade para gerar um resumo pronto para copiar e colar no prontuário eletrônico
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="fisio">Fisioterapia</TabsTrigger>
            <TabsTrigger value="fono">Fonoaudiologia</TabsTrigger>
            <TabsTrigger value="psico">Psicologia</TabsTrigger>
            <TabsTrigger value="medico">Médico</TabsTrigger>
          </TabsList>

          <TabsContent value="fisio" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Evolução de Fisioterapia</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copiarTexto("fisio")}
                className="flex items-center gap-2"
              >
                {copiado.fisio ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copiado.fisio ? "Copiado!" : "Copiar"}
              </Button>
            </div>
            <Textarea value={gerarResumoFisio()} readOnly className="font-mono text-sm h-96" />
          </TabsContent>

          <TabsContent value="fono" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Evolução de Fonoaudiologia</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copiarTexto("fono")}
                className="flex items-center gap-2"
              >
                {copiado.fono ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copiado.fono ? "Copiado!" : "Copiar"}
              </Button>
            </div>
            <Textarea value={gerarResumoFono()} readOnly className="font-mono text-sm h-96" />
          </TabsContent>

          <TabsContent value="psico" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Evolução de Psicologia</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copiarTexto("psico")}
                className="flex items-center gap-2"
              >
                {copiado.psico ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copiado.psico ? "Copiado!" : "Copiar"}
              </Button>
            </div>
            <Textarea value={gerarResumoPsico()} readOnly className="font-mono text-sm h-96" />
          </TabsContent>

          <TabsContent value="medico" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Evolução Médica</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copiarTexto("medico")}
                className="flex items-center gap-2"
              >
                {copiado.medico ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copiado.medico ? "Copiado!" : "Copiar"}
              </Button>
            </div>
            <Textarea value={gerarResumoMedico()} readOnly className="font-mono text-sm h-96" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
