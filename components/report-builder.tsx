"use client"

import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, FileDown, FileCog } from "lucide-react"
import { PDFDownloadLink } from "@react-pdf/renderer"
import PDFDocument from "./pdf-document"
import { toast } from "@/components/ui/use-toast"
import { useEspecialidade, type Especialidade } from "./especialidade-context"

// Mapeamento de seções do formulário
const FORM_SECTIONS = [
  { id: "identificacao", label: "Identificação do Paciente", default: true },
  { id: "percepcao", label: "Percepção do Paciente/Família", default: true },
  { id: "atividade", label: "Atividade e Participação", default: true },
  { id: "ambientais", label: "Fatores Ambientais", default: true },
  { id: "funcoes", label: "Funções e Estruturas Corporais", default: true },
  { id: "pessoais", label: "Fatores Pessoais", default: true },
  { id: "avaliacao", label: "Avaliação Interdisciplinar", default: true },
  { id: "objetivos", label: "Objetivos do PTS", default: true },
  { id: "planejamento", label: "Planejamento Terapêutico", default: true },
  { id: "encaminhamentos", label: "Encaminhamentos", default: false },
  { id: "criterios", label: "Critérios de Alta", default: false },
  { id: "mif", label: "Resumo MIF", default: true },
]

// Mapeamento de especialidades para seções relevantes
const SPECIALTY_SECTIONS: Record<Especialidade, string[]> = {
  todas: FORM_SECTIONS.map((s) => s.id),
  fisioterapia: ["identificacao", "percepcao", "atividade", "funcoes", "avaliacao", "objetivos", "planejamento", "mif"],
  terapia_ocupacional: [
    "identificacao",
    "percepcao",
    "atividade",
    "ambientais",
    "funcoes",
    "avaliacao",
    "objetivos",
    "planejamento",
  ],
  fonoaudiologia: ["identificacao", "percepcao", "atividade", "funcoes", "avaliacao", "objetivos", "planejamento"],
  psicologia: ["identificacao", "percepcao", "pessoais", "avaliacao", "objetivos", "planejamento"],
  assistencia_social: [
    "identificacao",
    "percepcao",
    "ambientais",
    "pessoais",
    "avaliacao",
    "objetivos",
    "encaminhamentos",
  ],
  enfermagem: ["identificacao", "percepcao", "atividade", "funcoes", "avaliacao", "planejamento", "criterios"],
  medicina: ["identificacao", "funcoes", "avaliacao", "objetivos", "planejamento", "criterios"],
  nutricao: ["identificacao", "percepcao", "pessoais", "avaliacao", "objetivos", "planejamento"],
  pedagogia: ["identificacao", "percepcao", "atividade", "avaliacao", "objetivos", "planejamento"],
  educador_fisico: ["identificacao", "atividade", "funcoes", "avaliacao", "objetivos", "planejamento"],
  musicoterapia: ["identificacao", "percepcao", "atividade", "avaliacao", "objetivos", "planejamento"],
}

export default function ReportBuilder() {
  const { getValues } = useFormContext()
  const { especialidadeSelecionada } = useEspecialidade()
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"custom" | "specialty">("custom")
  const [selectedSections, setSelectedSections] = useState<Record<string, boolean>>(
    FORM_SECTIONS.reduce((acc, section) => ({ ...acc, [section.id]: section.default }), {}),
  )
  const [reportTitle, setReportTitle] = useState("Avaliação Funcional e PTS")
  const [anonymizeData, setAnonymizeData] = useState(false)
  const [exportFormat, setExportFormat] = useState<"pdf" | "research">("pdf")

  // Função para selecionar todas as seções
  const selectAllSections = () => {
    const allSelected = FORM_SECTIONS.reduce((acc, section) => ({ ...acc, [section.id]: true }), {})
    setSelectedSections(allSelected)
  }

  // Função para desmarcar todas as seções
  const deselectAllSections = () => {
    const allDeselected = FORM_SECTIONS.reduce((acc, section) => ({ ...acc, [section.id]: false }), {})
    setSelectedSections(allDeselected)
  }

  // Função para aplicar template de especialidade
  const applySpecialtyTemplate = (specialty: Especialidade) => {
    const relevantSections = SPECIALTY_SECTIONS[specialty] || SPECIALTY_SECTIONS.todas
    const newSelection = FORM_SECTIONS.reduce(
      (acc, section) => ({ ...acc, [section.id]: relevantSections.includes(section.id) }),
      {},
    )
    setSelectedSections(newSelection)
    toast({
      title: "Template aplicado",
      description: `Template de relatório para ${
        specialty === "todas" ? "todas as especialidades" : specialty.replace("_", " ")
      } aplicado.`,
    })
  }

  // Função para preparar dados para exportação
  const prepareExportData = () => {
    const formData = getValues()

    // Se anonimizado, remover dados pessoais
    if (anonymizeData) {
      return {
        ...formData,
        nome: "ANÔNIMO",
        dataNascimento: "XX/XX/XXXX",
        sexo: formData.sexo,
        endereco: "ENDEREÇO OMITIDO",
        contato: "CONTATO OMITIDO",
      }
    }

    return formData
  }

  // Função para exportar dados para pesquisa
  const exportForResearch = () => {
    const data = prepareExportData()
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `${reportTitle.replace(/\s+/g, "_").toLowerCase()}_research_data.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setOpen(false)
    toast({
      title: "Dados exportados",
      description: "Os dados foram exportados com sucesso no formato JSON para pesquisa.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FileCog className="h-4 w-4" />
          <span>Relatórios Personalizados</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Gerador de Relatórios Personalizados</DialogTitle>
          <DialogDescription>
            Selecione as seções que deseja incluir no relatório e configure as opções de exportação.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="custom" value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="custom">Personalizado</TabsTrigger>
            <TabsTrigger value="specialty">Por Especialidade</TabsTrigger>
          </TabsList>

          <TabsContent value="custom" className="space-y-4 pt-4">
            <div className="flex justify-between mb-2">
              <Button variant="outline" size="sm" onClick={selectAllSections}>
                Selecionar Todos
              </Button>
              <Button variant="outline" size="sm" onClick={deselectAllSections}>
                Desmarcar Todos
              </Button>
            </div>

            <ScrollArea className="h-[200px] rounded-md border p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {FORM_SECTIONS.map((section) => (
                  <div key={section.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`section-${section.id}`}
                      checked={selectedSections[section.id]}
                      onCheckedChange={(checked) =>
                        setSelectedSections({ ...selectedSections, [section.id]: !!checked })
                      }
                    />
                    <Label htmlFor={`section-${section.id}`} className="cursor-pointer">
                      {section.label}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="specialty" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.keys(SPECIALTY_SECTIONS).map((specialty) => (
                <Button
                  key={specialty}
                  variant="outline"
                  className={especialidadeSelecionada === specialty ? "border-primary" : ""}
                  onClick={() => applySpecialtyTemplate(specialty as Especialidade)}
                >
                  {specialty === "todas"
                    ? "Completo"
                    : specialty.replace("_", " ").charAt(0).toUpperCase() + specialty.replace("_", " ").slice(1)}
                </Button>
              ))}
            </div>

            <div className="p-4 bg-muted rounded-md mt-4">
              <h4 className="font-medium mb-2">Seções incluídas:</h4>
              <div className="text-sm text-muted-foreground">
                {FORM_SECTIONS.filter((s) => selectedSections[s.id])
                  .map((s) => s.label)
                  .join(", ")}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="report-title" className="text-right">
              Título do Relatório
            </Label>
            <Input
              id="report-title"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="export-format" className="text-right">
              Formato de Exportação
            </Label>
            <div className="col-span-3 flex gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="format-pdf"
                  checked={exportFormat === "pdf"}
                  onCheckedChange={() => setExportFormat("pdf")}
                />
                <Label htmlFor="format-pdf">PDF (Documento)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="format-research"
                  checked={exportFormat === "research"}
                  onCheckedChange={() => setExportFormat("research")}
                />
                <Label htmlFor="format-research">JSON (Pesquisa)</Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Anonimizar Dados</Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Checkbox
                id="anonymize"
                checked={anonymizeData}
                onCheckedChange={(checked) => setAnonymizeData(!!checked)}
              />
              <Label htmlFor="anonymize">Remover informações pessoais identificáveis</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>

          {exportFormat === "pdf" ? (
            <PDFDownloadLink
              document={
                <PDFDocument data={prepareExportData()} title={reportTitle} includeSections={selectedSections} />
              }
              fileName={`${reportTitle.replace(/\s+/g, "_").toLowerCase()}.pdf`}
              className="inline-block"
            >
              {({ loading, error }) => (
                <Button disabled={loading}>
                  <FileDown className="mr-2 h-4 w-4" />
                  {loading ? "Preparando PDF..." : "Baixar PDF"}
                </Button>
              )}
            </PDFDownloadLink>
          ) : (
            <Button onClick={exportForResearch}>
              <Download className="mr-2 h-4 w-4" />
              Exportar para Pesquisa
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
